/* ===== Guided tour =====
   A self-contained spotlight tour. No external libraries. Launched by #tour-btn.
   To edit the tour, just change the `steps` array below: each step is
   { sel, title, body }, where `sel` is a CSS selector for the element to
   highlight (or null for a centered welcome/closing card). Steps whose element
   is not on the page are skipped automatically. */
(function () {
  "use strict";

  var steps = [
    { sel: null, title: "Welcome to the course planner",
      body: "Here is a quick walk through what everything does. Use <strong>Next</strong> and <strong>Back</strong> to move through it, or <strong>Exit tour</strong> to leave at any time." },
    { sel: ".prog", title: "Your progress",
      body: function () { var t = document.getElementById("prog-target"); return "This bar fills as you check off courses you have finished, tracking your credits toward the " + ((t && t.textContent) || "128") + " you need to graduate."; } },
    { sel: ".col:not(.bank) .tile", title: "A course",
      body: "Each tile is one course. Check the box at its top-left to mark it complete, drag the tile to move it, and look for a difficulty flag on the heavier ones." },
    { sel: ".col:not(.bank) .tile .t-menu", title: "More for each course",
      body: "The three-dot menu moves a course to another semester, adds a note, or edits it. You can also just drag a tile wherever you want it." },
    { sel: ".col:not(.bank) .col-h", title: "A semester",
      body: "Each column is one semester. The header shows its credit total and a tally of difficult courses, and its checkbox marks the whole semester complete at once." },
    { sel: ".col.bank", title: "AP and transfer credit",
      body: "Drop anything you earned outside LSU here, like AP, IB, or transfer credit. It counts as already complete." },
    { sel: "#btn-auto", title: "Auto-arrange",
      body: "Press this and the planner arranges every course you have not finished across your semesters, evening out the workload while respecting prerequisites. Check off your completed semesters first so it leaves them alone." },
    { sel: "#btn-addterm", title: "Build out your plan",
      body: "Add a semester here, including summers or a fifth year. Inside any semester, the <strong>Add custom course</strong> button can be used to add minor courses, extra electives, or anything else not already listed." },
    { sel: ".trackswitch", title: "Standard or Pre-med",
      body: "Switch between the <strong>Standard</strong> and <strong>Pre-med</strong> plans here. The pre-med track swaps in the medical school prerequisites and extra labs, and any course you have checked off is shared across both plans." },
    { sel: "#btn-share", title: "Save and share",
      body: "<strong>Copy link</strong> puts your whole plan into a link so you can paste it into an email to your advisor." },
    { sel: ".issues", scroll: true, title: "Things to review",
      body: "If a course breaks a rule, like if it's missing a prerequisite or is placed in a semester where it's not offered, it turns red and is listed here with the details." },
    { sel: ".doclink", title: "Learn more",
      body: "For the full details on difficulty points and how the auto-arranger works, visit the documentation page. You can replay this anytime by clicking <strong>Take a tour</strong>." }
  ];

  var running = false, pos = 0, active = [];
  var root, spot, pop, stepEl, titleEl, bodyEl, skipBtn, backBtn, nextBtn;

  function build() {
    root = document.createElement("div"); root.className = "tour-root";
    spot = document.createElement("div"); spot.className = "tour-spot";
    pop = document.createElement("div"); pop.className = "tour-pop";
    pop.setAttribute("role", "dialog"); pop.setAttribute("aria-live", "polite");
    pop.innerHTML =
      '<div class="tour-pop-step"></div>' +
      '<h4 class="tour-pop-title"></h4>' +
      '<p class="tour-pop-body"></p>' +
      '<div class="tour-pop-nav">' +
        '<button type="button" class="tour-skip">Exit tour</button>' +
        '<span class="tour-grow"></span>' +
        '<button type="button" class="tour-back">Back</button>' +
        '<button type="button" class="tour-next">Next</button>' +
      '</div>';
    root.appendChild(spot); root.appendChild(pop);
    document.body.appendChild(root);
    stepEl = pop.querySelector(".tour-pop-step");
    titleEl = pop.querySelector(".tour-pop-title");
    bodyEl = pop.querySelector(".tour-pop-body");
    skipBtn = pop.querySelector(".tour-skip");
    backBtn = pop.querySelector(".tour-back");
    nextBtn = pop.querySelector(".tour-next");
    skipBtn.onclick = end;
    backBtn.onclick = prev;
    nextBtn.onclick = next;
  }

  function placeSpot(r) {
    var p = 6;
    spot.style.display = "block";
    spot.style.top = (r.top - p) + "px";
    spot.style.left = (r.left - p) + "px";
    spot.style.width = (r.width + p * 2) + "px";
    spot.style.height = (r.height + p * 2) + "px";
  }

  function placePop(r) {
    var vw = window.innerWidth, vh = window.innerHeight, g = 12, m = 12;
    var pw = pop.offsetWidth, ph = pop.offsetHeight, top;
    if (r.bottom + g + ph <= vh - m) top = r.bottom + g;            // below
    else if (r.top - g - ph >= m) top = r.top - g - ph;            // above
    else top = Math.max(m, Math.min(vh - ph - m, r.bottom + g));   // fallback
    var left = r.left + r.width / 2 - pw / 2;
    left = Math.max(m, Math.min(vw - pw - m, left));
    pop.style.top = top + "px";
    pop.style.left = left + "px";
  }

  function placeCenter() {
    pop.style.top = Math.max(12, (window.innerHeight - pop.offsetHeight) / 2) + "px";
    pop.style.left = Math.max(12, (window.innerWidth - pop.offsetWidth) / 2) + "px";
  }

  function targetOf(step) { return step.sel ? document.querySelector(step.sel) : null; }

  function show() {
    var step = active[pos];
    stepEl.textContent = (pos + 1) + " / " + active.length;
    titleEl.textContent = step.title;
    bodyEl.innerHTML = (typeof step.body === "function") ? step.body() : step.body;
    var last = pos === active.length - 1;
    nextBtn.textContent = last ? "Done" : "Next";
    skipBtn.style.display = last ? "none" : "";
    backBtn.style.visibility = pos === 0 ? "hidden" : "visible";
    var el = targetOf(step);
    if (el) {
      root.classList.remove("dim");
      if (step.scroll) { try { el.scrollIntoView({ block: "center", inline: "nearest" }); } catch (e) { el.scrollIntoView(); } }
      else window.scrollTo(0, 0);
      window.requestAnimationFrame(function () {
        var r = el.getBoundingClientRect();
        placeSpot(r); placePop(r);
      });
    } else {
      spot.style.display = "none";
      root.classList.add("dim");
      window.scrollTo(0, 0);
      window.requestAnimationFrame(placeCenter);
    }
  }

  function reflow() {
    if (!running) return;
    var el = targetOf(active[pos]);
    if (el) { var r = el.getBoundingClientRect(); placeSpot(r); placePop(r); }
    else placeCenter();
  }

  function onKey(e) {
    if (!running) return;
    if (e.key === "Escape") end();
    else if (e.key === "ArrowRight" || e.key === "Enter") next();
    else if (e.key === "ArrowLeft") prev();
  }

  function next() { if (pos < active.length - 1) { pos++; show(); } else end(); }
  function prev() { if (pos > 0) { pos--; show(); } }

  function start() {
    if (running) return;
    active = steps.filter(function (s) { return !s.sel || document.querySelector(s.sel); });
    if (!active.length) return;
    running = true; pos = 0;
    build(); show();
    window.addEventListener("resize", reflow);
    window.addEventListener("scroll", reflow, true);
    window.addEventListener("keydown", onKey);
  }

  function end() {
    if (!running) return;
    running = false;
    window.removeEventListener("resize", reflow);
    window.removeEventListener("scroll", reflow, true);
    window.removeEventListener("keydown", onKey);
    if (root && root.parentNode) root.parentNode.removeChild(root);
    root = null;
  }

  function wire() { var b = document.getElementById("tour-btn"); if (b) b.onclick = start; }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
  window.startTour = start;
})();
