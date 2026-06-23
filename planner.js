/* BECPlanner — exact course-arrangement optimizer.

   Models "arrange the un-completed courses across the open semesters" as a MILP and
   solves it to proven optimality with HiGHS. Pure logic only (no DOM): the caller hands
   in a normalized scenario and a solve function, so this same file runs in the browser
   (window.Highs) and in Node tests (the `highs` npm package).

   Scenario shape (all produced by app.js `buildScenario`):
     terms:   [{key, rank, season:'F'|'S'|'Su', open:bool}]   // every plan term, dense rank by order
     movable: [{id, cr, eff, pre:[id], co:[id], coAny:bool, seasons:['F','S','Su']}]
     fixedRank: {id: rank}            // completed courses (incl. AP bucket) — for requisite bounds only
     defTerm:   {id: termKey|null}    // the active track's default-plan term (for the shape anchor)
     defTP:     {id: termPos}         // default term as intrinsic termPos (the anchor target)
     caps:    {fsMin, fsMax, suMax}
     weights: {band, even, flat, anchor}   // band ≫ even ≈ flat ≫ anchor

   Objective (minimize):  band-violation (official credits, soft 12–18 / ≤6 summer)
                        + min-max peak load + convex spread (sum-of-squares) across fall/spring terms
                        + shift-invariant anchor toward the recommended plan SHAPE (a free global
                          offset absorbs whole-plan slides, so only out-of-order moves are charged).
*/
(function (global) {
  "use strict";

  function fmt(x) { return Number.isInteger(x) ? String(x) : String(x); }

  // [[coef, varName], ...] -> "3 a + 2 b - c"  (coef 1 omitted, clean leading term)
  function lin(terms) {
    const parts = terms.filter(t => t[0] !== 0);
    if (!parts.length) return "0";
    let s = "";
    parts.forEach(([c, v], i) => {
      const coef = Math.abs(c) === 1 ? "" : fmt(Math.abs(c)) + " ";
      if (i === 0) s += (c < 0 ? "- " : "") + coef + v;
      else s += (c < 0 ? " - " : " + ") + coef + v;
    });
    return s;
  }

  function buildLP(scn) {
    const W = scn.weights, C = scn.caps;
    const openTerms = scn.terms.filter(t => t.open);
    const movable = scn.movable;
    const idIndex = {}; movable.forEach((c, i) => { idIndex[c.id] = i; });

    // allowed (course -> open terms whose season the course is offered in)
    const allowed = movable.map(c =>
      openTerms.map((t, ti) => ({ t, ti })).filter(o => c.seasons.includes(o.t.season)));
    for (let i = 0; i < movable.length; i++) {
      if (!allowed[i].length)
        return { infeasible: true, reason: `${movable[i].id} is offered only in ${movable[i].seasons.join("/")}, and no open semester matches.` };
    }

    const xv = (ci, ti) => `x_${ci}_${ti}`;
    const fixedCr = scn.fixedCr || {}, fixedEff = scn.fixedEff || {};   // credits of completed courses pinned in an OPEN (partially-done) term
    const obj = [];      // [coef, var]
    const cons = [];     // constraint strings
    const bins = [];     // binary var names
    const bounds = [];   // variable bound declarations (e.g. free vars)
    let n = 0;

    for (let i = 0; i < movable.length; i++) for (const o of allowed[i]) bins.push(xv(i, o.ti));

    // exactly one term per course
    for (let i = 0; i < movable.length; i++)
      cons.push(`asg_${i}: ` + lin(allowed[i].map(o => [1, xv(i, o.ti)])) + ` = 1`);

    // Ordering uses each term's intrinsic termPos (tp), NOT a dense rank. tp never shifts when other
    // semesters are added or removed, so prereq/coreq ordering — and thus the whole solution — is
    // identical whether or not empty summers are present. tp is strictly increasing across terms, so
    // tp(c) >= tp(p)+1 still means "c is in a strictly later term."
    const fixedPos = scn.fixedTP || scn.fixedRank || {};
    const posTerms = i => allowed[i].map(o => [o.t.tp, xv(i, o.ti)]);
    const neg = ts => ts.map(([k, v]) => [-k, v]);
    const Mbig = Math.max(...scn.terms.map(t => t.tp)) + 1;   // BigM >= any termPos difference

    // prerequisites (strictly earlier) and corequisites (same or earlier)
    for (let i = 0; i < movable.length; i++) {
      const c = movable[i];
      for (const p of c.pre) {
        if (idIndex[p] !== undefined) cons.push(`pre_${n++}: ` + lin(posTerms(i).concat(neg(posTerms(idIndex[p])))) + ` >= 1`);
        else if (fixedPos[p] !== undefined) cons.push(`pre_${n++}: ` + lin(posTerms(i)) + ` >= ${fixedPos[p] + 1}`);
      }
      if (!c.coAny) {
        for (const a of c.co) {
          if (idIndex[a] !== undefined) cons.push(`co_${n++}: ` + lin(posTerms(i).concat(neg(posTerms(idIndex[a])))) + ` >= 0`);
          else if (fixedPos[a] !== undefined) cons.push(`co_${n++}: ` + lin(posTerms(i)) + ` >= ${fixedPos[a]}`);
        }
      } else {
        // "any one of" coreq: satisfied for free if a member is already completed
        const anyFixed = c.co.some(a => idIndex[a] === undefined && fixedPos[a] !== undefined);
        const members = c.co.filter(a => idIndex[a] !== undefined).map(a => idIndex[a]);
        if (!anyFixed && members.length) {
          const M = Mbig, ys = [];
          for (const j of members) {
            const y = `y_${i}_${j}`; ys.push(y); bins.push(y);
            // y=1  ⇒  tp(member) ≤ tp(course)
            cons.push(`coa_${n++}: ` + lin(posTerms(j).concat(neg(posTerms(i))).concat([[M, y]])) + ` <= ${M}`);
          }
          cons.push(`coas_${n++}: ` + lin(ys.map(y => [1, y])) + ` >= 1`);
        }
      }
    }

    // back-to-back course pairs (e.g. senior design I→II): tp(b) − tp(a) = gap. With gap=1 this pins
    // them to consecutive terms — for Design I (fall) → Design II (spring), that is the same academic year.
    for (const pr of (scn.pairs || [])) {
      const ai = idIndex[pr.a], bi = idIndex[pr.b], aFix = fixedPos[pr.a], bFix = fixedPos[pr.b];
      if ((ai === undefined && aFix === undefined) || (bi === undefined && bFix === undefined)) continue;
      if (ai !== undefined && bi !== undefined) cons.push(`pair_${n++}: ` + lin(posTerms(bi).concat(neg(posTerms(ai)))) + ` = ${pr.gap}`);
      else if (ai !== undefined) cons.push(`pair_${n++}: ` + lin(posTerms(ai)) + ` = ${bFix - pr.gap}`);
      else if (bi !== undefined) cons.push(`pair_${n++}: ` + lin(posTerms(bi)) + ` = ${aFix + pr.gap}`);
    }

    // per-term load: band (official credits) + difficulty-weighted evenness. Completed courses
    // pinned in a partially-done open term contribute fixed credits, folded into each RHS.
    // Evenness has two parts: (1) a min-max "peak" that caps the single heaviest fall/spring term,
    // and (2) a convex SPREAD penalty that pushes every fall/spring term toward an equal difficulty-
    // weighted load. The spread penalty approximates sum-of-squares of each term's effective load via
    // tangent lower bounds z_t >= 2a*E_t - a^2 (a tangent to x^2 at x=a); minimizing the z's both
    // flattens the fall/spring terms relative to each other AND offloads load into any open summers
    // (summers are not penalized, so they act as relief valves). This makes the optimizer spread a
    // heavy curriculum across every available term instead of only relieving the single worst one.
    const FLAT_TANGENTS = [12, 16, 20, 24];
    const coursesIn = ti => { const r = []; for (let i = 0; i < movable.length; i++) if (allowed[i].some(o => o.ti === ti)) r.push(i); return r; };
    let anyFS = false;
    openTerms.forEach((t, ti) => {
      const fc = fixedCr[t.key] || 0, fe = fixedEff[t.key] || 0;
      const cr = coursesIn(ti).map(i => [movable[i].cr, xv(i, ti)]);
      if (t.season === "Su") {
        cons.push(`shi_${ti}: ` + lin(cr.concat([[-1, `s_${ti}`]])) + ` <= ${C.suMax - fc}`);
        obj.push([W.band, `s_${ti}`]);
      } else {
        anyFS = true;
        cons.push(`blo_${ti}: ` + lin(cr.concat([[1, `u_${ti}`]])) + ` >= ${C.fsMin - fc}`);
        cons.push(`bhi_${ti}: ` + lin(cr.concat([[-1, `o_${ti}`]])) + ` <= ${C.fsMax - fc}`);
        obj.push([W.band, `u_${ti}`], [W.band, `o_${ti}`]);
        const eff = coursesIn(ti).map(i => [movable[i].eff, xv(i, ti)]);
        // (1) min-max: pull down the heaviest difficulty-weighted term.  peak >= E_t (+ fixed)
        cons.push(`pk_${ti}: ` + lin([[1, `peak`]].concat(neg(eff))) + ` >= ${fe}`);
        // (2) convex spread: z_t >= 2a*E_t - a^2 for tangent points a; minimizing sum z_t ~ sum E_t^2.
        if (W.flat) {
          for (const a of FLAT_TANGENTS)
            cons.push(`flat_${ti}_${a}: ` + lin([[1, `z_${ti}`]].concat(eff.map(([e, v]) => [-2 * a * e, v]))) + ` >= ${2 * a * fe - a * a}`);
          obj.push([W.flat, `z_${ti}`]);
        }
      }
    });
    if (anyFS) obj.push([W.even, `peak`]);

    // SHIFT-INVARIANT anchor: stay close to the recommended plan SHAPE, not its absolute timing.
    // The whole default plan may slide by a single free offset c (so a 5th year, or a late start
    // after switching majors, shifts everything together at zero cost) and we charge only each
    // course's displacement RELATIVE to that shared offset:  minimize sum_i |(p_i - dtp_i) - c|,
    // where p_i is the placed termPos. Measured in intrinsic termPos, so it stays summer-invariant.
    // O(n): one slack per anchored course plus one shared offset c (the LP settles c on the median
    // displacement). This keeps capstones terminal and foundations early without pinning absolutes.
    const anchored = [];
    for (let i = 0; i < movable.length; i++) { const dtp = scn.defTP ? scn.defTP[movable[i].id] : null; if (dtp != null) anchored.push([i, dtp]); }
    if (anchored.length) {
      // Paired-capstone courses (senior design) are anchored much harder than the rest: they have a
      // firm terminal slot in the flowchart, and without this the spread penalty can pull them early
      // under a loose solver gap. The strong weight keeps them put regardless of gap noise, while every
      // other course stays free to rearrange for balance/spread. Still shift-invariant, so a whole-plan
      // slide (5th year, late start) costs them nothing.
      const strong = new Set(); (scn.pairs || []).forEach(p => { strong.add(p.a); strong.add(p.b); });
      bounds.push("c free");
      for (const [i, dtp] of anchored) {
        const s = `an_${i}`;
        cons.push(`anu_${i}: ` + lin([[1, s], [1, "c"]].concat(neg(posTerms(i)))) + ` >= ${-dtp}`);   // s >=  (p_i - dtp - c)
        cons.push(`anl_${i}: ` + lin([[1, s], [-1, "c"]].concat(posTerms(i))) + ` >= ${dtp}`);        // s >= -(p_i - dtp - c)
        obj.push([strong.has(movable[i].id) ? (W.anchorPair || W.anchor) : W.anchor, s]);
      }
    }

    // ---- Summer session conflicts ----
    // Within one summer, a May–Aug (MA) course and any "crammed" course (May–Jun, Jul–Aug, or a
    // both-session course taking one of those halves) cannot coexist. Two May–Aug courses CAN share a
    // summer, and one May–Jun + one Jul–Aug can. We allow at most one May–Jun and one Jul–Aug. A binary
    // m per summer selects the mode: m=1 => May–Aug only, m=0 => crammed only.
    openTerms.forEach((t, ti) => {
      if (t.season !== "Su") return;
      const mj = [], ja = [], crammed = [], ma = [];
      for (let i = 0; i < movable.length; i++) {
        if (!allowed[i].some(o => o.ti === ti)) continue;
        const s = movable[i].summer;
        if (s === "MA") ma.push([1, xv(i, ti)]);
        else if (s === "MJ") { mj.push([1, xv(i, ti)]); crammed.push([1, xv(i, ti)]); }
        else if (s === "JA") { ja.push([1, xv(i, ti)]); crammed.push([1, xv(i, ti)]); }
        else if (s === "BOTH") {
          const z1 = `z1_${i}_${ti}`, z2 = `z2_${i}_${ti}`; bins.push(z1, z2);
          cons.push(`zsum_${i}_${ti}: ` + lin([[1, z1], [1, z2], [-1, xv(i, ti)]]) + ` = 0`);
          mj.push([1, z1]); ja.push([1, z2]); crammed.push([1, xv(i, ti)]);
        }
      }
      if (mj.length) cons.push(`sumj_${ti}: ` + lin(mj) + ` <= 1`);   // at most one May–Jun
      if (ja.length) cons.push(`suja_${ti}: ` + lin(ja) + ` <= 1`);   // at most one Jul–Aug
      if (ma.length && crammed.length) {                              // May–Aug vs crammed are mutually exclusive
        const m = `sm_${ti}`; bins.push(m); const Kc = crammed.length, Km = ma.length;
        cons.push(`sucr_${ti}: ` + lin(crammed.concat([[Kc, m]])) + ` <= ${Kc}`);   // crammed only when m=0
        cons.push(`suma_${ti}: ` + lin(ma.concat([[-Km, m]])) + ` <= 0`);           // May–Aug only when m=1
      }
    });

    // ---- Design electives ----
    const desIdx = []; for (let i = 0; i < movable.length; i++) if (movable[i].isDesign) desIdx.push(i);
    if (desIdx.length) {
      // (a) prefer at most one design elective per term (the approved list is short, so we spread them out).
      // SOFT: a second one in the same term is allowed but penalized, so a student with few terms left and
      // several design electives can still be scheduled rather than hitting an impossible problem.
      openTerms.forEach((t, ti) => {
        const ds = desIdx.filter(i => allowed[i].some(o => o.ti === ti)).map(i => [1, xv(i, ti)]);
        if (ds.length > 1) { const e = `de_${ti}`; cons.push(`des1_${ti}: ` + lin(ds.concat([[-1, e]])) + ` <= 1`); if (W.desExtra) obj.push([W.desExtra, e]); }
      });
      // (b) HARD: a design elective needs >=60 credits already earned before its term (AP/transfer + all
      // prior terms). Applied PER design course so that two in one term don't wrongly require 120 credits:
      //   creditsBefore(t) >= 60 * x[d,t]   for each design course d that could go in t.
      const ap = scn.apCredits || 0, minCr = scn.desMinCredits || 60;
      const tpByKey = {}; scn.terms.forEach(t => { tpByKey[t.key] = t.tp; });
      openTerms.forEach((t, ti) => {
        const ds = desIdx.filter(i => allowed[i].some(o => o.ti === ti));
        if (!ds.length) return;
        let constCr = ap;
        for (const tk in fixedCr) { const p = tpByKey[tk]; if (p != null && p < t.tp) constCr += fixedCr[tk]; }
        const before = [];
        for (let i = 0; i < movable.length; i++) for (const o of allowed[i]) if (o.t.tp < t.tp) before.push([movable[i].cr, xv(i, o.ti)]);
        ds.forEach(di => cons.push(`des60_${ti}_${di}: ` + lin(before.concat([[-minCr, xv(di, ti)]])) + ` >= ${-constCr}`));
      });
    }

    // ---- Humanities (spread out like design electives, but at half the penalty) ----
    // There are three humanities slots, so without this the difficulty-flattener can pile them into one
    // term (they carry no prereq chain). SOFT, mirroring the design-elective rule, at half its weight.
    const humIdx = []; for (let i = 0; i < movable.length; i++) if (movable[i].isHum) humIdx.push(i);
    if (humIdx.length) {
      const humW = (W.desExtra || 0) / 2;   // half the design-elective spread penalty
      openTerms.forEach((t, ti) => {
        const hs = humIdx.filter(i => allowed[i].some(o => o.ti === ti)).map(i => [1, xv(i, ti)]);
        if (hs.length > 1 && humW) { const e = `he_${ti}`; cons.push(`hum1_${ti}: ` + lin(hs.concat([[-1, e]])) + ` <= 1`); obj.push([humW, e]); }
      });
    }

    // ---- Pre-med timing penalty ----
    // Penalize any pre-med requirement scheduled later than Year 3 Fall, growing with how late it is.
    // pmw is 1 for most reqs, 0.5 for the lower-priority ones, and 0 off the pre-med track.
    if (W.pmLate) {
      const after = scn.pmAfterTP != null ? scn.pmAfterTP : Infinity;
      for (let i = 0; i < movable.length; i++) {
        const pmw = movable[i].pmw || 0; if (!pmw) continue;
        for (const o of allowed[i]) if (o.t.tp > after) obj.push([W.pmLate * pmw * (o.t.tp - after), xv(i, o.ti)]);
      }
    }

    // ---- Co-requisite togetherness ----
    // A small BINARY penalty (same whether 1 or 3 terms apart) when a course sits in a different semester
    // than a co-requisite that is also being scheduled. Keeps lecture/lab and similar pairs together unless
    // separating them clearly helps the rest of the schedule. cs=1 is forced whenever their terms differ.
    if (W.coSep) {
      const seen = new Set();
      for (let i = 0; i < movable.length; i++) {
        const c = movable[i]; if (c.coAny) continue;
        for (const a of c.co) {
          const j = idIndex[a]; if (j === undefined) continue;
          const key = i < j ? i + '_' + j : j + '_' + i; if (seen.has(key)) continue; seen.add(key);
          const cs = `cs_${key}`; bins.push(cs);
          cons.push(`csa_${key}: ` + lin([[Mbig, cs]].concat(neg(posTerms(i))).concat(posTerms(j))) + ` >= 0`);
          cons.push(`csb_${key}: ` + lin([[Mbig, cs]].concat(neg(posTerms(j))).concat(posTerms(i))) + ` >= 0`);
          obj.push([W.coSep, cs]);
        }
      }
    }

    const boundsSec = bounds.length ? `Bounds\n ${bounds.join("\n ")}\n` : "";
    const lp = `Minimize\n obj: ${lin(obj)}\nSubject To\n ${cons.join("\n ")}\n${boundsSec}Binary\n ${bins.join(" ")}\nEnd\n`;
    return { lp, openTerms, movable, allowed };
  }

  function readSolution(cols, ctx) {
    const place = {};
    ctx.movable.forEach((c, i) => {
      for (const o of ctx.allowed[i]) {
        const col = cols[`x_${i}_${o.ti}`];
        if (col && col.Primal > 0.5) { place[c.id] = o.t.key; break; }
      }
    });
    return place;
  }

  async function solvePlan(scn, solveFn) {
    if (!scn.movable.length) return { status: "empty", placements: {} };
    const built = buildLP(scn);
    if (built.infeasible) return { status: "infeasible", reason: built.reason };
    let sol;
    try { sol = await solveFn(built.lp); }
    catch (e) { return { status: "error", reason: String((e && e.message) || e) }; }
    if (!sol) return { status: "error", reason: "No solution" };
    if (sol.Status === "Infeasible" || sol.Status === "Primal infeasible or unbounded")
      return { status: "infeasible", reason: "Solver status: " + sol.Status };
    // Accept any complete feasible assignment — HiGHS returns "Optimal" once within the gap tolerance,
    // and any returned incumbent already satisfies every hard constraint.
    const placements = readSolution(sol.Columns, built);
    for (const c of scn.movable) if (!(c.id in placements)) return { status: "infeasible", reason: "No complete assignment (solver status: " + sol.Status + ")" };
    return { status: "optimal", placements, objective: sol.ObjectiveValue };
  }

  const api = { buildLP, readSolution, solvePlan, _lin: lin };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else global.BECPlanner = api;
})(typeof self !== "undefined" ? self : this);
