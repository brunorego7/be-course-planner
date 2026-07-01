"use strict";
/* ===== Catalog (edit each catalog year). diff: normal|hard|hardest. sem ⊆ F,S,Su.
   summer: which summer session a course is offered — MA=May–Aug, MJ=May–Jun, JA=Jul–Aug,
   BOTH=offered in May–Jun AND Jul–Aug (student picks one). Omit 'Su' from sem if not offered in summer. ===== */
const CATALOG = {
  BE1251:{code:'BE 1251',title:'Introduction to Engineering Methods',cr:2,sem:['F'],pre:[],co:[],diff:'normal'},
  CHEM1201:{code:'CHEM 1201',title:'General Chemistry I',cr:3,sem:['F','S','Su'],summer:'MA',pre:[],co:[],diff:'normal'},
  BIOL1201:{code:'BIOL 1201',title:'Biology for Science Majors I',cr:3,sem:['F','S','Su'],summer:'MJ',pre:[],co:[],diff:'normal'},
  MATH1550:{code:'MATH 1550',title:'Differential & Integral Calculus',cr:5,sem:['F','S'],pre:[],co:[],diff:'hard'},
  BIOL1208:{code:'BIOL 1208',title:'Biology Lab for Science Majors I',cr:1,sem:['F','S'],pre:[],co:['BIOL1201'],diff:'normal'},
  ENGL1001:{code:'ENGL 1001',title:'English Composition',cr:3,sem:['F','S'],pre:[],co:[],diff:'normal'},
  BE1252:{code:'BE 1252',title:'Biology in Engineering',cr:2,sem:['S'],pre:[],co:['BIOL1201'],diff:'normal'},
  BIOL1202:{code:'BIOL 1202',title:'Biology for Science Majors II',cr:3,sem:['F','S','Su'],summer:'JA',pre:['BIOL1201'],co:['BIOL1208'],diff:'normal'},
  MATH1552:{code:'MATH 1552',title:'Analytic Geometry & Calculus II',cr:4,sem:['F','S','Su'],summer:'BOTH',pre:['MATH1550'],co:[],diff:'hard'},
  CHEM1202:{code:'CHEM 1202',title:'General Chemistry II',cr:3,sem:['F','S','Su'],summer:'MA',pre:['CHEM1201'],co:[],diff:'normal'},
  BIOL1209:{code:'BIOL 1209',title:'Biology Lab for Science Majors II',cr:1,sem:['F','S'],pre:['BIOL1208'],co:['BIOL1202'],diff:'normal'},
  PHYS2110:{code:'PHYS 2110',title:'Particle Mechanics',cr:3,sem:['F','S','Su'],summer:'BOTH',pre:[],co:['MATH1552'],diff:'hardest'},
  BE2352:{code:'BE 2352',title:'Quantitative Biology in Engineering',cr:3,sem:['F'],pre:['BE1252'],co:[],diff:'normal'},
  BIOL2051:{code:'BIOL 2051',title:'General Microbiology',cr:4,sem:['F','S','Su'],summer:'BOTH',pre:['BIOL1202','BIOL1209','CHEM1202'],co:[],diff:'hard'},
  EE2950:{code:'EE 2950',title:'Comprehensive Electrical Engineering',cr:3,sem:['F','S'],pre:['MATH1552'],co:[],diff:'hardest'},
  MATH2065:{code:'MATH 2065 / 2090',title:'Elementary Differential Equations (+ Linear Algebra)',cr:3,sem:['F','S','Su'],summer:'MJ',pre:['MATH1552'],co:[],diff:'hard'},
  CE2450:{code:'CE 2450',title:'Statics',cr:3,sem:['F','S','Su'],summer:'MJ',pre:['MATH1552','PHYS2110'],co:[],diff:'hardest'},
  BE2350:{code:'BE 2350',title:'Experimental Methods for Engineers',cr:3,sem:['S'],pre:[],co:['EE2950','PHYS2113'],coreqAny:true,diff:'normal'},
  CE3400:{code:'CE 3400',title:'Mechanics of Materials',cr:3,sem:['F','S','Su'],summer:'MJ',pre:['CE2450'],co:[],diff:'hardest'},
  PHYS2113:{code:'PHYS 2113',title:'Fields: Gravity, Electricity & Magnetism',cr:3,sem:['F','S','Su'],summer:'BOTH',pre:['PHYS2110'],co:[],diff:'hardest'},
  ENGL2000:{code:'ENGL 2000',title:'English Composition',cr:3,sem:['F','S','Su'],summer:'BOTH',pre:['ENGL1001'],co:[],diff:'normal'},
  CHEM1212:{code:'CHEM 1212',title:'General Chemistry Laboratory',cr:2,sem:['F','S','Su'],summer:'JA',pre:[],co:['CHEM1202'],diff:'normal'},
  CHEM2261:{code:'CHEM 2261',title:'Organic Chemistry I',cr:3,sem:['F','S','Su'],summer:'MA',pre:['CHEM1202'],co:[],diff:'hard'},
  BE4303:{code:'BE 4303',title:'Engineering Properties of Biological Materials',cr:3,sem:['F'],pre:['MATH2065'],co:['CE3400'],diff:'normal'},
  AGEC2003:{code:'AGEC 2003 or\nECON 2000 / 2010 / 2030',title:'(Agricultural) Economics',cr:3,sem:['F','S','Su'],summer:'BOTH',pre:[],co:[],diff:'normal'},
  BIOL2083:{code:'BIOL 2083',title:'The Elements of Biochemistry',cr:3,sem:['F','S'],pre:['CHEM2261'],co:[],diff:'normal'},
  ME3333:{code:'ME 3333',title:'Thermodynamics',cr:3,sem:['F','S','Su'],summer:'MJ',pre:['MATH1552','PHYS2110'],co:[],diff:'hardest'},
  BE3340:{code:'BE 3340',title:'Process Design in Biological Engineering',cr:3,sem:['S'],pre:['MATH2065'],co:[],diff:'normal'},
  BE4352:{code:'BE 4352',title:'Transport Phenomena in Biological Engineering',cr:3,sem:['S'],pre:['BE2352','BIOL2051'],co:['CE2200','ME3333'],diff:'normal'},
  CE2200:{code:'CE 2200',title:'Fluid Mechanics',cr:3,sem:['F','S','Su'],summer:'JA',pre:['CE2450'],co:[],diff:'hardest'},
  BE3320:{code:'BE 3320',title:'Mechanical Design for Biological Engineering',cr:3,sem:['F'],pre:['CE3400'],co:[],diff:'normal'},
  BE4390:{code:'BE 4390',title:'Senior Engineering Design I',cr:3,sem:['F'],pre:['BE2350'],co:['CE3400'],diff:'normal'},
  CE2460:{code:'CE 2460',title:'Dynamics and Vibrations',cr:3,sem:['F','S'],pre:['CE2450'],co:['MATH2065'],diff:'hardest'},
  BE4392:{code:'BE 4392',title:'Senior Engineering Design II',cr:3,sem:['S'],pre:['BE4390'],co:[],diff:'normal'},
  PHYS2108:{code:'PHYS 2108',title:'Introductory Physics Laboratory',cr:1,sem:['F','S','Su'],summer:'BOTH',pre:[],co:['PHYS2110'],diff:'normal'},
  PHYS2109:{code:'PHYS 2109',title:'General Physics Laboratory',cr:1,sem:['F','S','Su'],summer:'BOTH',pre:['PHYS2108'],co:['PHYS2113'],diff:'normal'},
  CHEM2262:{code:'CHEM 2262',title:'Organic Chemistry II',cr:3,sem:['F','S','Su'],summer:'MA',pre:['CHEM2261'],co:[],diff:'hard'},
  CHEM2364:{code:'CHEM 2364',title:'Organic Chemistry Laboratory',cr:2,sem:['F','S','Su'],summer:'JA',pre:['CHEM1212'],co:['CHEM2262'],diff:'normal'}
};
// Med-school prerequisites — flagged with a "Pre-med" pill, and only shown/counted on the pre-med track.
const PREMED_REQ=new Set(['CHEM1201','CHEM1202','BIOL1201','BIOL1202','BIOL1208','BIOL1209','ENGL1001','ENGL2000','PHYS2110','PHYS2113','CHEM1212','CHEM2261','BIOL2083','PHYS2108','PHYS2109','CHEM2262','CHEM2364']);
// Courses that exist on only one track. Everything else (incl. custom courses) belongs to both.
const PREMED_ONLY=new Set(['PHYS2108','PHYS2109','CHEM2262','CHEM2364']);   // these replace the generic tech-elec/elective on the pre-med track
const STANDARD_ONLY=new Set(['TECHELEC','ELEC']);                            // generic tech-elec + elective; pre-med fills those requirements with Orgo II + Lab
function belongsToTrack(id,track){if(PREMED_ONLY.has(id))return track==='premed';if(STANDARD_ONLY.has(id))return track==='standard';return true;}
const KIND={HUM:{label:'Humanity',code:'Humanity',cr:3},SOCSCI:{label:'Social Science',code:'Social Sci',cr:3},TECHELEC:{label:'Technical Elective / ROTC',code:'Tech Elec',cr:3},DES:{label:'Design Elective',code:'Design Elec',cr:3},ART:{label:'Art',code:'Art',cr:3},ELEC:{label:'Elective / ROTC',code:'Elective',cr:2},GEN:{label:'General Elective',code:'Gen Elec',cr:3}};
const PLACEHOLDER_DEFAULTS={HUM1:'HUM',HUM2:'HUM',HUM3:'HUM',DES1:'DES',DES2:'DES',DES3:'DES',ART:'ART',SOCSCI:'SOCSCI',TECHELEC:'TECHELEC',ELEC:'ELEC'};
const DEFAULT_PLAN_STD=[
  ['completed',[]],
  ['year1-fall',['BE1251','CHEM1201','BIOL1201','MATH1550','BIOL1208','ENGL1001']],
  ['year1-spring',['BE1252','BIOL1202','MATH1552','CHEM1202','BIOL1209','PHYS2110']],
  ['year2-fall',['BE2352','BIOL2051','EE2950','MATH2065','CE2450']],
  ['year2-spring',['BE2350','CE3400','PHYS2113','ENGL2000','CHEM1212','CHEM2261']],
  ['year3-fall',['BE4303','AGEC2003','BIOL2083','ME3333','HUM1']],
  ['year3-spring',['BE3340','BE4352','CE2200','HUM2','DES1']],
  ['year4-fall',['BE3320','BE4390','CE2460','DES2','ART','ELEC']],
  ['year4-spring',['BE4392','DES3','HUM3','SOCSCI','TECHELEC']]
];
const DEFAULT_PLAN_PM=[
  ['completed',[]],
  ['year1-fall',['BE1251','CHEM1201','BIOL1201','MATH1550','BIOL1208','ENGL1001']],
  ['year1-spring',['BE1252','BIOL1202','MATH1552','CHEM1202','BIOL1209','PHYS2110','PHYS2108']],
  ['year2-fall',['BE2352','CHEM1212','CHEM2261','MATH2065','CE2450','SOCSCI']],
  ['year2-spring',['BIOL2051','BIOL2083','CHEM2262','PHYS2113','PHYS2109','ENGL2000']],
  ['year3-fall',['AGEC2003','ART','BE4303','CE2200','CE3400','CHEM2364']],
  ['year3-spring',['BE2350','BE3340','BE4352','EE2950','ME3333']],
  ['year4-fall',['BE3320','BE4390','CE2460','DES1','HUM1']],
  ['year4-spring',['BE4392','DES2','DES3','HUM2','HUM3']]
];
const DEFAULT_PLANS={standard:DEFAULT_PLAN_STD,premed:DEFAULT_PLAN_PM};
const CONFIG={storageKey:'becp.v3.state',legacyKey:'becp.v2.state',maxYear:6,summerCap:6,termCap:18,recHard:2,recHardest:1};
const DEFAULT_TERM_SET=new Set(DEFAULT_PLAN_STD.map(r=>r[0]));   // both tracks share the same default semester structure
function defaultCredit(id){return CATALOG[id]?CATALOG[id].cr:(PLACEHOLDER_DEFAULTS[id]?(KIND[PLACEHOLDER_DEFAULTS[id]]||KIND.GEN).cr:0);}
function creditTarget(track){return DEFAULT_PLANS[track].reduce((t,[,ids])=>t+ids.reduce((s,id)=>s+defaultCredit(id),0),0);}

/* ===== term helpers (canonical chronological order) ===== */
const SEASON_OFF={fall:0,spring:1,summer:2},SEASON_CODE={fall:'F',spring:'S',summer:'Su'};
function termPos(k){if(k==='completed')return -1;const m=k.match(/^year(\d+)-(fall|spring|summer)$/);return m?parseInt(m[1],10)*3+SEASON_OFF[m[2]]:Infinity;}
function termSeason(k){const m=k.match(/-(fall|spring|summer)$/);return m?SEASON_CODE[m[1]]:'';}
function termLabel(k){if(k==='completed')return 'AP / transfer credit';const m=k.match(/^year(\d+)-(fall|spring|summer)$/);return m?'Year '+m[1]+' '+m[2][0].toUpperCase()+m[2].slice(1):k;}
function allCanonicalTerms(){const o=['completed'];for(let y=1;y<=CONFIG.maxYear;y++)for(const s of['fall','spring','summer'])o.push('year'+y+'-'+s);return o;}
function num(v,d){const n=parseInt(v,10);return isNaN(n)?d:n;}

/* ===== resolve a tile's definition from catalog/state ===== */
function tileDef(id){
  const meta=(state&&state.tileMeta&&state.tileMeta[id])||{};
  if(CATALOG[id])return Object.assign({type:'core',note:meta.note||'',premedReq:PREMED_REQ.has(id)},CATALOG[id]);
  if(meta.custom)return{type:'custom',code:meta.code||'',title:meta.title||'',cr:num(meta.cr,3),sem:['F','S','Su'],pre:[],co:[],diff:meta.diff||'normal',note:meta.note||''};
  const kind=meta.kind||PLACEHOLDER_DEFAULTS[id];
  if(kind){const b=KIND[kind]||KIND.GEN;
    const offered=kind==='DES'?['F','S']:['F','S','Su'];          // design electives are not offered in summer
    const sum=kind==='DES'?undefined:'GEN';                        // other electives: generic "Summer" (not auto-scheduled there)
    const subDef=(kind==='SOCSCI'&&state&&state.track==='premed')?'PSYC 2000: Introduction to Psychology':'';   // pre-med social-science recommendation
    return{type:'placeholder',kind,code:b.code,label:b.label,title:'',cr:num(meta.cr,b.cr),sem:offered,summer:sum,pre:[],co:[],diff:meta.diff||'normal',subtitle:meta.subtitle||subDef,note:meta.note||'',hint:'Requirement-specific — check the General Catalog.'};}
  return{type:'custom',code:meta.code||'',title:id,cr:0,sem:['F','S','Su'],pre:[],co:[],diff:'normal',note:meta.note||''};
}

/* ===== state + persistence =====
   v3 model: one file holds BOTH track plans plus a shared completion overlay.
     { v:3, track, terms:[key…],
       std:{id:key}, pm:{id:key},   // each track's planned semester for not-yet-completed courses
       done:{id:key},               // completion overlay: the ONE real semester taken (or 'completed' = AP/transfer). presence ⟹ checked.
       tileMeta:{id:{…}} }          // custom/placeholder/subtitle/note overrides — track-agnostic
   Display = project to columns: a completed course shows at done[id] in BOTH tracks (unless it belongs to the other track);
   otherwise it shows at the active track's planned spot. Check/uncheck only touches `done`; dragging an unchecked course
   moves the active track's planned spot; dragging a completed course corrects its done[id]. */
let state=null, persistArmed=false;
const expanded=new Set();   // tile ids whose details panel is open — UI state, persists across re-renders

function posMap(track){return (track||state.track)==='premed'?state.pm:state.std;}
function isDone(id){return !!(state.done&&state.done[id]);}
function planToPos(plan){const o={};plan.forEach(([key,ids])=>{if(key!=='completed')ids.forEach(id=>{o[id]=key;});});return o;}
function defaultTerms(){return DEFAULT_PLAN_STD.map(r=>r[0]).slice().sort((a,b)=>termPos(a)-termPos(b));}

function defaultState(track){
  return{v:3,track:(track==='premed'?'premed':'standard'),terms:defaultTerms(),
    std:planToPos(DEFAULT_PLAN_STD),pm:planToPos(DEFAULT_PLAN_PM),done:{},tileMeta:{}};
}

// Build a v3 state from one track's placements (id->semester, 'completed' = AP bucket) plus meta overrides.
function buildV3(track,terms,placements,meta){
  track=(track==='premed'?'premed':'standard');
  const std=planToPos(DEFAULT_PLAN_STD),pm=planToPos(DEFAULT_PLAN_PM),done={};
  const home=(track==='premed'?pm:std),away=(track==='premed'?std:pm);
  meta=meta&&typeof meta==='object'?meta:{};
  for(const id in placements){
    const key=placements[id];
    const doneFlag=(meta[id]&&meta[id].done===true);
    if(key==='completed'){done[id]='completed';}           // AP/transfer credit
    else if(doneFlag){done[id]=key;home[id]=key;}          // completed in a real semester; remember planned spot too
    else{home[id]=key;}                                     // a planned (not-yet-taken) course on this track
    if(meta[id]&&meta[id].custom&&key!=='completed'&&away[id]===undefined)away[id]=key;  // custom courses live on both tracks
  }
  for(const id in meta){if(meta[id])delete meta[id].done;} // `done` is now the overlay, not a per-tile flag
  const termSet=new Set(defaultTerms());(terms||[]).forEach(k=>termSet.add(k));
  Object.values(done).forEach(k=>{if(k!=='completed')termSet.add(k);});
  const allTerms=[...termSet].filter(k=>termPos(k)!==Infinity).sort((a,b)=>termPos(a)-termPos(b));
  return{v:3,track,terms:allTerms,std,pm,done,tileMeta:meta};
}

function normalizeV3(o){
  const clean=m=>{const r={};if(m&&typeof m==='object')for(const k in m)if(typeof m[k]==='string')r[k]=m[k];return r;};
  const terms=Array.isArray(o.terms)?o.terms.filter(k=>typeof k==='string'&&termPos(k)!==Infinity):[];
  const termSet=new Set(terms.length?terms:defaultTerms());termSet.add('completed');
  return{v:3,track:(o.track==='premed'?'premed':'standard'),
    terms:[...termSet].sort((a,b)=>termPos(a)-termPos(b)),
    std:clean(o.std),pm:clean(o.pm),done:clean(o.done),
    tileMeta:(o.tileMeta&&typeof o.tileMeta==='object')?o.tileMeta:{}};
}

// ----- migration from older formats -----
function v2ToV3(o){
  const cols=Array.isArray(o.columns)?o.columns:[];
  const terms=cols.map(c=>c&&c.key).filter(k=>typeof k==='string');
  const placements={};
  cols.forEach(c=>{if(c&&Array.isArray(c.tiles))c.tiles.forEach(id=>{placements[id]=c.key;});});
  return buildV3('standard',terms,placements,(o.tileMeta&&typeof o.tileMeta==='object')?o.tileMeta:{});  // the v2 app was standard-only
}
function v1ToV3(o,track){
  track=(track==='premed'?'premed':'standard');
  const remap=track==='premed'?{TECHELEC:'CHEM2262',ELEC:'CHEM2364'}:{};  // old premed.html reused these ids for Orgo II / Orgo Lab
  const placements={},terms=new Set();
  for(const key in o){
    if(!Object.prototype.hasOwnProperty.call(o,key)||!Array.isArray(o[key]))continue;
    if(termPos(key)===Infinity)continue;
    const seen=new Set();let any=false;
    o[key].forEach(raw=>{const id=remap[raw]||raw;if((CATALOG[id]||PLACEHOLDER_DEFAULTS[id])&&belongsToTrack(id,track)&&!seen.has(id)){seen.add(id);placements[id]=key;any=true;}});
    if(DEFAULT_TERM_SET.has(key)||any)terms.add(key);   // trim empty, non-default terms (e.g. an untouched summer)
  }
  return buildV3(track,[...terms],placements,{});
}
function toV3(obj,trackParam){
  if(obj&&obj.v===3)return normalizeV3(obj);
  if(obj&&obj.v===2)return v2ToV3(obj);
  return v1ToV3(obj,trackParam||'standard');
}

function lsGet(key){try{return localStorage.getItem(key);}catch(e){return null;}}
function lsSet(key,s){try{localStorage.setItem(key,s);return true;}catch(e){return false;}}

// Decode a shared-plan payload. Tries the value as-is and, as a recovery, with spaces restored to '+',
// because a base64 '+' left unencoded in a query string is turned back into a space when the link is read.
// This keeps older links (generated before the payload was URL-encoded) loading correctly.
function decodePlan(enc){
  if(!enc)return null;
  const cands=[enc, enc.replace(/ /g,'+')];
  for(const s of cands){
    try{return JSON.parse(decodeURIComponent(escape(atob(s))));}catch(e){}
    try{return JSON.parse(atob(s));}catch(e){}
  }
  return null;
}

function loadInitial(){
  const params=new URLSearchParams(location.search);
  const tp=params.get('track');const trackParam=tp==='premed'?'premed':(tp==='standard'?'standard':null);
  const compact=params.get('p');   // compact v4 share link
  if(compact){
    let obj=null;try{obj=decodeStateCompact(compact);}catch(e){}
    if(obj){try{state=toV3(obj,trackParam);return 'url';}catch(e){console.warn('bad compact link',e);}}
    console.warn('bad compact link: could not decode ?p=');
    state=defaultState(trackParam);return 'url-error';
  }
  const enc=params.get('data');   // legacy share link (full base64 JSON) — kept working forever
  if(enc){
    const obj=decodePlan(enc);
    if(obj){try{state=toV3(obj,trackParam);return 'url';}catch(e){console.warn('bad share link',e);}}
    // A data= link was supplied but could not be decoded or parsed (corrupt or truncated). Do not fall back
    // to a locally saved plan, which would masquerade as the shared one; show the default and flag the error.
    console.warn('bad share link: could not decode ?data=');
    state=defaultState(trackParam);return 'url-error';
  }
  const saved=lsGet(CONFIG.storageKey);
  if(saved){try{state=normalizeV3(JSON.parse(saved));persistArmed=true;return 'local';}catch(e){console.warn('bad saved state',e);}}
  const legacy=lsGet(CONFIG.legacyKey);   // migrate a plan saved by the previous (standard-only) version
  if(legacy){try{state=toV3(JSON.parse(legacy),'standard');persistArmed=true;return 'local';}catch(e){console.warn('bad legacy state',e);}}
  state=defaultState(trackParam);return 'default';
}
function serialize(){return JSON.stringify(state);}   // the whole snapshot: both tracks + completion overlay + active track
function save(){ // armed only after a real edit, so viewing a shared link never clobbers a local plan
  if(!persistArmed)return;
  setSaved('saving');
  const ok=lsSet(CONFIG.storageKey,serialize());
  setSaved(ok?'saved':'nostore');
}
function touch(){persistArmed=true;save();}

// ----- project the v3 model to display columns for the active track -----
function tileSortKey(id){const d=tileDef(id);return((d.code||'')+' '+(d.title||d.label||'')).toLowerCase();}
function projectColumns(){
  const T=state.track,home=posMap(T);
  const cols=state.terms.map(k=>({key:k,tiles:[]})),byKey={};cols.forEach(c=>{byKey[c.key]=c;});
  const ids=new Set(Object.keys(home));Object.keys(state.done).forEach(id=>ids.add(id));
  ids.forEach(id=>{
    if(!belongsToTrack(id,T))return;
    const sem=isDone(id)?state.done[id]:home[id];
    if(sem===undefined)return;
    const col=byKey[sem]||byKey['completed'];
    if(col)col.tiles.push(id);
  });
  cols.forEach(c=>c.tiles.sort((a,b)=>tileSortKey(a)<tileSortKey(b)?-1:tileSortKey(a)>tileSortKey(b)?1:0));
  return cols;
}

/* ===== tiny helpers ===== */
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function el(id){return document.getElementById(id);}
function codeOf(id){const d=tileDef(id);return d.code||d.title;}
function placementMap(){const m={};const cols=projectColumns();for(const c of cols)for(const id of c.tiles)m[id]=c.key;return m;}

/* ===== validation (ported + tested against original behavior) ===== */
function validate(id,P){
  const def=tileDef(id),here=P[id],my=termPos(here);
  if(here==='completed')return{pre:true,co:true,sem:true,credits:true,ok:true};
  let pre=true;
  for(const p of def.pre){const pk=P[p];if(pk!==undefined&&termPos(pk)>=my)pre=false;}
  let co=true;
  if(def.coreqAny){co=def.co.some(c=>{const ck=P[c];return ck!==undefined&&termPos(ck)<=my;});}
  else{for(const c of def.co){const ck=P[c];if(ck!==undefined&&termPos(ck)>my)co=false;}}
  const sem=def.sem.includes(termSeason(here));
  let credits=true;                                  // design electives need >=60 credits earned before their term
  if(def.kind==='DES'){let before=0;for(const cid in P){if(cid!==id&&termPos(P[cid])<my)before+=tileDef(cid).cr;}credits=before>=60;}
  return{pre,co,sem,credits,ok:pre&&co&&sem&&credits};
}

/* ===== render ===== */
function colCredits(col){return col.tiles.reduce((s,id)=>s+tileDef(id).cr,0);}

function render(){
  const cols=projectColumns();
  const P={};for(const c of cols)for(const id of c.tiles)P[id]=c.key;
  el('ledger').innerHTML=cols.map(col=>{
    const cr=colCredits(col),isBank=col.key==='completed',season=termSeason(col.key);
    const cap=isBank?null:(season==='Su'?CONFIG.summerCap:CONFIG.termCap);
    const hasTiles=col.tiles.length>0,termAllDone=hasTiles&&col.tiles.every(id=>isDone(id,col.key));
    const over=cap!==null&&cr>cap&&!termAllDone;   // a fully-completed term doesn't complain about its load
    let nH=0,nHH=0;for(const id of col.tiles){const d=tileDef(id);if(d.diff==='hard')nH++;else if(d.diff==='hardest')nHH++;}
    const counts=isBank?'':
      (nH>0?`<span class="tcount avg" title="${nH} difficult course${nH>1?'s':''} this semester">${nH}</span>`:'')+
      (nHH>0?`<span class="tcount most" title="${nHH} very difficult course${nHH>1?'s':''} this semester">${nHH}</span>`:'');
    const countWrap=counts?`<span class="tcounts">${counts}</span>`:'';
    const overBtn=over?`<button class="col-info" data-act="overinfo" data-key="${col.key}" title="Above the recommended credit load"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg></button>`:'';
    const termChk=isBank
      ?`<span class="t-done term-chk on locked" title="AP / transfer credit always counts as completed" aria-label="AP / transfer credit — always counted as completed"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg></span>`
      :`<button class="t-done term-chk${termAllDone?' on':''}" data-act="termdone" data-key="${col.key}"${hasTiles?'':' disabled'} title="${termAllDone?'Uncheck every course in this semester':'Mark every course in this semester complete'}" aria-pressed="${termAllDone}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg></button>`;
    const tiles=col.tiles.map(id=>renderTile(id,P)).join('');
    return `<div class="col${isBank?' bank':''}${over?' over':''}" data-key="${col.key}">
      <div class="col-h"><div class="col-name">${termChk}${esc(termLabel(col.key))}</div>${canRemoveTerm(col.key)?`<button class="col-del" data-act="delterm" data-key="${col.key}" title="Remove this semester" aria-label="Remove ${esc(termLabel(col.key))}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`:''}
        <div class="col-meta"><span class="col-cr">${cr} ${cr===1?'credit':'credits'}</span>${overBtn}${countWrap}</div></div>
      <div class="col-b">${tiles||(isBank?'<div style="color:var(--ink-faint);font-size:12px;padding:6px 2px">Drag AP / transfer credit here</div>':'')}<button class="col-add" data-act="add" data-key="${col.key}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>Add custom course</button></div>
    </div>`;
  }).join('');
  updateProgress(P);
  updateIssues(P);
  updateChevrons();
  syncTrackUI();
}

function renderTile(id,P){
  const d=tileDef(id),v=validate(id,P);
  const here=P[id],inSummer=termSeason(here)==='Su',isBank=here==='completed';
  const done=isDone(id);
  const cls=(v.ok||done)?'':'bad';   // a checked/completed course never shows as broken
  const premedPill=(state.track==='premed'&&d.premedReq)?'<span class="t-premed" title="Required for medical school">Pre-med</span>':'';
  const diffBadge=d.diff==='hardest'?'<span class="t-dbadge most" title="Very difficult">very difficult</span>':d.diff==='hard'?'<span class="t-dbadge avg" title="Difficult">difficult</span>':'';
  const diffWord=d.diff==='hardest'?'very difficult':d.diff==='hard'?'difficult':'';
  const diffCls=d.diff==='hardest'?'most':d.diff==='hard'?'avg':'';
  const printMeta=`<span class="t-printmeta" aria-hidden="true">${diffWord?`<span class="pd ${diffCls}">${diffWord}</span> · `:''}${d.cr}${d.cr===1?' credit':' credits'}</span>`;
  const preTxt=d.pre.length?d.pre.map(codeOf).map(esc).join(', '):'None';
  const coTxt=d.co.length?d.co.map(codeOf).map(esc).join(d.coreqAny?' <em>or</em> ':', '):'None';
  const summerLabel=({MA:'Summer (May–Aug)',MJ:'Summer (May–Jun)',JA:'Summer (Jul–Aug)',BOTH:'Summer (May–Jun or Jul–Aug)'})[d.summer]||'Summer';
  const semTxt=d.sem.map(s=>s==='F'?'Fall':s==='S'?'Spring':summerLabel).join(', ');
  const summerWarn=inSummer&&!(d.type==='core'&&!v.sem);   // always-visible reminder; a not-offered core course already flags itself red
  const summerEl=summerWarn?'<div class="sn">Double-check summer offerings</div>':'';
  const chk='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>';
  const doneBox=isBank
    ?`<span class="t-done locked" title="Counted as completed (AP / transfer credit)">${chk}</span>`
    :`<button class="t-done${done?' on':''}" data-act="done" title="${done?'Completed — counts toward your progress':'Mark as completed'}" aria-pressed="${done}">${chk}</button>`;
  const codeEl=d.type==='placeholder'
    ?`<span class="t-code cat">${esc(d.code)}</span>`
    :(d.code?`<span class="t-code">${esc(d.code)}</span>`:'');
  const titleEl=d.type==='placeholder'?renderEditableTitle(d):(d.title?`<div class="t-title">${esc(d.title)}</div>`:'');
  const noteEl=d.note?`<div class="t-note">${esc(d.note)}</div>`:'';
  const isOpen=expanded.has(id);
  const detailEl=d.type==='core'
    ?`<div class="r"><b${!v.pre?' class="v"':''}>Prerequisites:</b> ${preTxt}</div>
      <div class="r"><b${!v.co?' class="v"':''}>Corequisites:</b> ${coTxt}</div>
      <div class="r"><b${!v.sem?' class="v"':''}>Offered:</b> ${semTxt}</div>`
    :d.type==='custom'
    ?`<div class="r warn-note"><b>Not checked:</b> prerequisites and semester availability aren’t tracked for custom courses.</div>`
    :d.kind==='DES'
    ?`<div class="r"><b${!v.credits?' class="v"':''}>Credits:</b> 60 credits required before taking design electives</div>
      <div class="r"><b>Other:</b> Prerequisites, corequisites, and semesters offered are course-specific — check General Catalog</div>`
    :`<div class="r">Prerequisites, corequisites, and semesters offered are course-specific — check General Catalog</div>`;
  return `<div class="tile ${cls} ${d.type}${done?' done':''}" draggable="true" data-id="${id}">
    <div class="t-top">${doneBox}${codeEl}
      <button class="t-menu" data-act="menu" title="Course actions"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg></button></div>
    ${titleEl}
    ${(premedPill||diffBadge)?`<div class="t-diffrow">${premedPill}${diffBadge}</div>`:''}
    ${noteEl}${summerEl}
    <div class="t-creditrow"><span class="t-credits">${d.cr} ${d.cr===1?'credit':'credits'}</span><button class="t-details-link${isOpen?' open':''}" data-act="info" aria-expanded="${isOpen}"><span class="lk">${isOpen?'Hide details':'View details'}</span><svg class="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg></button></div>
    <div class="t-info${isOpen?' open':''}">${detailEl}</div>${printMeta}</div>`;
}

/* ===== progress ===== */
function updateProgress(P){
  const cols=projectColumns();
  let total=0,done=0,custom=0;
  for(const c of cols)for(const id of c.tiles){const d=tileDef(id),cr=d.cr;total+=cr;if(isDone(id))done+=cr;if(d.type==='custom')custom+=cr;}
  const target=creditTarget(state.track)+custom;   // custom courses extend the requirement so the bar can't overfill
  el('prog-num').textContent=done;el('prog-target').textContent=target;
  const pct=v=>Math.min(100,Math.round(v/target*100));
  el('prog-plan').style.width=pct(total)+'%';
  el('prog-done').style.width=pct(done)+'%';
}

/* ===== issues panel ===== */
function updateIssues(P){
  const issues=[];
  for(const c of projectColumns()){
    for(const id of c.tiles){
      const d=tileDef(id),v=validate(id,P);
      if(!v.ok && !isDone(id,c.key)){   // a checked course is treated as done — no theoretical issues
        const reasons=[];
        if(!v.pre)reasons.push('prerequisite not completed earlier');
        if(!v.co)reasons.push('corequisite is scheduled too late');
        if(!v.sem)reasons.push('not offered in '+(termSeason(c.key)==='F'?'fall':termSeason(c.key)==='S'?'spring':'summer'));
        if(!v.credits)reasons.push('60 credits required before taking design electives');
        issues.push({type:'err',id,key:c.key,title:(d.code?d.code+' — ':'')+d.title,where:termLabel(c.key),msg:reasons.join('; ')});
      }
    }
    if(c.key!=='completed'){
      const season=termSeason(c.key),cap=season==='Su'?CONFIG.summerCap:CONFIG.termCap,cr=colCredits(c);
      const termAllDone=c.tiles.length>0&&c.tiles.every(id=>isDone(id,c.key));
      if(cr>cap&&!termAllDone)issues.push({type:'err',key:c.key,title:termLabel(c.key),where:termLabel(c.key),msg:`${cr} credit${cr===1?'':'s'} exceeds the ${cap}-credit limit`});
    }
  }
  const pill=el('ipill');
  if(!issues.length){pill.className='p clear';pill.textContent='All clear';el('ib').innerHTML='<div style="padding:10px;color:var(--ink-soft);font-size:12.5px">No prerequisite, credit, or load problems right now.</div>';return;}
  pill.className='p bad';pill.textContent=issues.length+(issues.length===1?' item':' items');
  el('ib').innerHTML=issues.map((it,i)=>`<div class="iss" data-key="${it.key}"${it.id?` data-id="${it.id}"`:''}>
    <span class="ic ${it.type}">${it.type==='err'?'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>':'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.8 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z"/><path d="M12 10v3M12 17h.01"/></svg>'}</span>
    <span class="tx">${esc(it.title)}<br><span class="w">${esc(it.where)} — ${esc(it.msg)}</span></span></div>`).join('');
}

/* ===== saved indicator + toast ===== */
let savedTimer=null;
function setSaved(stt){
  const chip=el('saved');if(!chip)return;const t=el('saved-t');
  if(stt==='saving'){chip.classList.add('saving');t.textContent='Saving…';}
  else{chip.classList.remove('saving');t.textContent=stt==='nostore'?'Not saved here':'Saved';}
}
function toast(msg,actionLabel,onAction){
  const host=el('toasts'),d=document.createElement('div');d.className='toast';
  d.innerHTML=`<span>${esc(msg)}</span>`;
  if(actionLabel){const b=document.createElement('button');b.textContent=actionLabel;b.onclick=()=>{onAction&&onAction();d.remove();};d.appendChild(b);}
  host.appendChild(d);setTimeout(()=>d.remove(),actionLabel?6000:2600);
}

/* ===== move a tile between columns (drag / "Move to") ===== */
function moveTile(id,toKey){
  if(!belongsToTrack(id,state.track))return;
  const wasDone=isDone(id),wasBank=wasDone&&state.done[id]==='completed';
  if(toKey==='completed'){state.done[id]='completed';}            // marked as AP / transfer credit
  else if(wasDone&&!wasBank){state.done[id]=toKey;}               // a checked course: correct which semester it was actually taken
  else{delete state.done[id];posMap(state.track)[id]=toKey;}      // from the AP bucket, or an unchecked course: (re)plan it on this track
  touch();render();
}

/* ===== drag & drop (native, via delegation) + edge auto-scroll ===== */
let draggedId=null;
function wireDnD(){
  const led=el('ledger');
  led.addEventListener('dragstart',e=>{const t=e.target.closest('.tile');if(!t)return;draggedId=t.dataset.id;t.classList.add('drag');e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',draggedId);}catch(_){}}); 
  led.addEventListener('dragend',()=>{draggedId=null;led.querySelectorAll('.tile.drag').forEach(t=>t.classList.remove('drag'));led.querySelectorAll('.col.drop').forEach(c=>c.classList.remove('drop'));});
  led.addEventListener('dragover',e=>{
    e.preventDefault();e.dataTransfer.dropEffect='move';
    const c=e.target.closest('.col');led.querySelectorAll('.col.drop').forEach(x=>{if(x!==c)x.classList.remove('drop');});if(c)c.classList.add('drop');
    const r=led.getBoundingClientRect();
    if(e.clientX<r.left+44)led.scrollLeft-=16;else if(e.clientX>r.right-44)led.scrollLeft+=16;
  });
  led.addEventListener('drop',e=>{e.preventDefault();const c=e.target.closest('.col');if(c&&draggedId)moveTile(draggedId,c.dataset.key);});
}

/* ===== click delegation: tile menu + info toggle ===== */
function wireClicks(){
  el('ledger').addEventListener('click',e=>{
    const del=e.target.closest('[data-act="delterm"]');
    if(del){removeTerm(del.dataset.key);return;}
    const oi=e.target.closest('[data-act="overinfo"]');
    if(oi){openOverInfo(oi,oi.dataset.key);return;}
    const add=e.target.closest('[data-act="add"]');
    if(add){openCourseDialog({mode:'custom',termKey:add.dataset.key});return;}
    const dn=e.target.closest('[data-act="done"]');
    if(dn){toggleDone(dn.closest('.tile').dataset.id);return;}
    const tdn=e.target.closest('[data-act="termdone"]');
    if(tdn){toggleTermDone(tdn.dataset.key);return;}
    const sub=e.target.closest('[data-act="subtitle"]');
    if(sub){startSubtitleEdit(sub.closest('.tile').dataset.id);return;}
    const mb=e.target.closest('[data-act="menu"]');
    if(mb){openTileMenu(mb,mb.closest('.tile').dataset.id);return;}
    const ib=e.target.closest('[data-act="info"]');
    if(ib){const tile=ib.closest('.tile'),tid=tile.dataset.id;const open=expanded.has(tid)?(expanded.delete(tid),false):(expanded.add(tid),true);tile.querySelector('.t-info').classList.toggle('open',open);ib.classList.toggle('open',open);const lk=ib.querySelector('.lk');if(lk)lk.textContent=open?'Hide details':'View details';ib.setAttribute('aria-expanded',open?'true':'false');return;}
  });
  el('ib').addEventListener('click',e=>{const row=e.target.closest('.iss');if(!row)return;locate(row.dataset.key,row.dataset.id);});
}

/* ===== popover ===== */
let popAnchor=null;
function closeAllPops(){document.querySelectorAll('.pop').forEach(p=>p.remove());popAnchor=null;document.removeEventListener('pointerdown',popOutside);document.removeEventListener('keydown',popEsc);}
function popOutside(e){if(e.target.closest('.pop'))return;if(popAnchor&&popAnchor.contains(e.target))return;closeAllPops();}
function popEsc(e){if(e.key==='Escape')closeAllPops();}
function openPop(anchor,build){
  if(popAnchor===anchor){closeAllPops();return;}   // tapping the same trigger again closes the menu
  closeAllPops();
  const pop=document.createElement('div');pop.className='pop';
  build(pop,closeAllPops);
  el('pop-host').appendChild(pop);
  const r=anchor.getBoundingClientRect(),pw=pop.offsetWidth,ph=pop.offsetHeight;
  let left=r.left,top=r.bottom+6;
  if(left+pw>window.innerWidth-8)left=window.innerWidth-8-pw;if(left<8)left=8;
  if(top+ph>window.innerHeight-8&&r.top-6-ph>8)top=r.top-6-ph;
  pop.style.left=(left+window.scrollX)+'px';pop.style.top=(top+window.scrollY)+'px';
  popAnchor=anchor;
  setTimeout(()=>{document.addEventListener('pointerdown',popOutside);document.addEventListener('keydown',popEsc);},0);
}
function openTileMenu(anchor,id){
  openPop(anchor,(pop,close)=>{
    const d=tileDef(id),cur=placementMap()[id];
    const lbl=document.createElement('div');lbl.className='gl';lbl.textContent='Move to';pop.appendChild(lbl);
    const sc=document.createElement('div');sc.className='sc';
    state.terms.forEach(key=>{
      if(key===cur)return;
      const b=document.createElement('button');b.className='it';b.textContent=termLabel(key);
      b.onclick=()=>{moveTile(id,key);close();toast('Moved to '+termLabel(key));};
      sc.appendChild(b);
    });
    pop.appendChild(sc);
    const sep=document.createElement('div');sep.className='sep';pop.appendChild(sep);
    const nb=document.createElement('button');nb.className='it';
    nb.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'+(d.note?'Edit note…':'Add note…');
    nb.onclick=()=>{close();openNoteDialog(id);};
    pop.appendChild(nb);
    if(d.type!=='core'){
      const ed=document.createElement('button');ed.className='it';
      ed.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>'+(d.type==='custom'?'Edit course…':'Edit details…');
      ed.onclick=()=>{close();openCourseDialog({mode:d.type,id});};
      pop.appendChild(ed);
      const del=document.createElement('button');del.className='it danger';
      del.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>Delete';
      del.onclick=()=>{close();deleteTile(id);};
      pop.appendChild(del);
    }
  });
}

/* ===== locate from an issue row ===== */
function locate(key,id){
  const led=el('ledger'),col=led.querySelector(`.col[data-key="${key}"]`);
  if(col&&col.scrollIntoView)col.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});
  if(id){const t=led.querySelector(`.tile[data-id="${id}"]`);if(t){t.classList.add('flash');setTimeout(()=>t.classList.remove('flash'),1200);}}
  else if(col){col.classList.add('drop');setTimeout(()=>col.classList.remove('drop'),1000);}
}

/* ===== horizontal scroll controls ===== */
function updateChevrons(){const led=el('ledger'),max=led.scrollWidth-led.clientWidth;el('sc-left').disabled=led.scrollLeft<=2;el('sc-right').disabled=led.scrollLeft>=max-2;}

/* ===== share link ===== */
function encodeState(){return btoa(unescape(encodeURIComponent(serialize())));}
/* ===== compact share links (v4): far shorter URLs. Old ?data= links still load via decodePlan. ===== */
// Frozen, APPEND-ONLY index of every placeable course/placeholder code. This order defines the positional
// encoding below, so old links keep decoding correctly. Only ever append new codes; never reorder or remove
// (leave the string in place as a tombstone if a course is retired). Codes missing here still round-trip;
// they fall to the JSON residual, just less compactly.
const SHARE_CODES=["BE1251","CHEM1201","BIOL1201","MATH1550","BIOL1208","ENGL1001","BE1252","BIOL1202","MATH1552","CHEM1202","BIOL1209","PHYS2110","BE2352","BIOL2051","EE2950","MATH2065","CE2450","BE2350","CE3400","PHYS2113","ENGL2000","CHEM1212","CHEM2261","BE4303","AGEC2003","BIOL2083","ME3333","BE3340","BE4352","CE2200","BE3320","BE4390","CE2460","BE4392","PHYS2108","PHYS2109","CHEM2262","CHEM2364","HUM1","HUM2","DES1","DES2","ART","ELEC","DES3","HUM3","SOCSCI","TECHELEC"];
// Frozen, APPEND-ONLY canonical term order. When a plan uses exactly these terms they are omitted from the
// link entirely; a plan with added or removed terms carries its own list. Same rule: append only.
const SHARE_TERMS=["completed","year1-fall","year1-spring","year2-fall","year2-spring","year3-fall","year3-spring","year4-fall","year4-spring"];
// 64 URL-safe "digits" for single-character indices. '.' = course not placed. '~' separates fields.
const SHARE_ALPH="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function b64urlEncode(s){return btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function b64urlDecode(s){s=String(s).replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return decodeURIComponent(escape(atob(s)));}
// 12-bit integrity tag (2 URL-safe chars) so a truncated or corrupted ?p= link fails cleanly to the error
// alert instead of silently decoding a partial plan. Not security; just tamper/truncation detection.
function shareChk(s){var h=0;for(var i=0;i<s.length;i++){h=(Math.imul(h,31)+s.charCodeAt(i))>>>0;}return SHARE_ALPH.charAt((h>>>6)&63)+SHARE_ALPH.charAt(h&63);}

// Serialize the whole plan to a compact, URL-safe string. The bulk (three course->term maps) becomes one
// character per catalog course; only the irregular remainder (custom courses, notes, non-default terms) is
// carried as a small base64url JSON blob.
function encodeStateCompact(){
  const st=state;
  const termsDefault=JSON.stringify(st.terms)===JSON.stringify(SHARE_TERMS);
  const termList=termsDefault?SHARE_TERMS:(st.terms||SHARE_TERMS);
  const tIdx={};termList.forEach((t,i)=>{tIdx[t]=i;});
  function encMap(map){
    let s='';map=map||{};
    for(let i=0;i<SHARE_CODES.length;i++){const t=map[SHARE_CODES[i]];s+=(typeof t==='string'&&tIdx[t]!=null)?SHARE_ALPH.charAt(tIdx[t]):'.';}
    return s.replace(/\.+$/,'');
  }
  const residual={};
  if(!termsDefault)residual.t=st.terms;
  const extra={};
  ['std','pm','done'].forEach(mk=>{const map=st[mk]||{},sub={};for(const code in map){if(SHARE_CODES.indexOf(code)<0&&typeof map[code]==='string')sub[code]=map[code];}if(Object.keys(sub).length)extra[mk]=sub;});
  if(Object.keys(extra).length)residual.x=extra;
  const tm={},meta=st.tileMeta||{};
  for(const code in meta){if(meta[code]&&typeof meta[code]==='object'&&Object.keys(meta[code]).length)tm[code]=meta[code];}
  if(Object.keys(tm).length)residual.m=tm;
  const res=Object.keys(residual).length?b64urlEncode(JSON.stringify(residual)):'';
  const body='4~'+(st.track==='premed'?'p':'s')+'~'+encMap(st.std)+'~'+encMap(st.pm)+'~'+encMap(st.done)+'~'+res;
  return body+shareChk(body);
}

// Inverse of encodeStateCompact. Returns a v3-shaped object, or null if the string is not a valid v4 payload.
function decodeStateCompact(str){
  if(typeof str!=='string'||str.length<3||str.charAt(0)!=='4'||str.charAt(1)!=='~')return null;
  const chk=str.slice(-2),body=str.slice(0,-2);
  if(shareChk(body)!==chk)return null;   // truncated or corrupted link
  const p=body.split('~');if(p.length<5)return null;
  let residual={};
  if(p[5]){try{residual=JSON.parse(b64urlDecode(p[5]));}catch(e){return null;}}
  const termList=Array.isArray(residual.t)?residual.t:SHARE_TERMS;
  function decMap(s){const map={};s=s||'';for(let i=0;i<s.length&&i<SHARE_CODES.length;i++){const c=s.charAt(i);if(c==='.')continue;const ti=SHARE_ALPH.indexOf(c);if(ti<0||ti>=termList.length)continue;map[SHARE_CODES[i]]=termList[ti];}return map;}
  const std=decMap(p[2]),pm=decMap(p[3]),done=decMap(p[4]);
  if(residual.x&&typeof residual.x==='object'){const maps={std:std,pm:pm,done:done};for(const mk in residual.x){if(maps[mk]&&residual.x[mk]&&typeof residual.x[mk]==='object'){const sub=residual.x[mk];for(const code in sub)if(typeof sub[code]==='string')maps[mk][code]=sub[code];}}}
  return {v:3,track:(p[1]==='p'?'premed':'standard'),terms:termList.slice(),std:std,pm:pm,done:done,tileMeta:(residual.m&&typeof residual.m==='object')?residual.m:{}};
}

function shareLink(){
  const url=location.origin+location.pathname+'?p='+encodeURIComponent(encodeStateCompact());
  const done=()=>toast('Link copied to clipboard');
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(done).catch(()=>prompt('Copy this link:',url));}
  else prompt('Copy this link:',url);
}

/* ===== confirm modal ===== */
function confirmModal(opts){
  opts=opts||{};
  const root=document.createElement('div');root.className='modal-root';
  root.innerHTML='<div class="modal-card" role="dialog" aria-modal="true">'+
    '<h4 class="modal-title"></h4><p class="modal-msg"></p>'+
    '<div class="modal-acts"><button type="button" class="modal-btn modal-cancel">Cancel</button>'+
    '<button type="button" class="modal-btn modal-go"></button></div></div>';
  root.querySelector('.modal-card').setAttribute('aria-label',opts.title||'Confirm');
  root.querySelector('.modal-title').textContent=opts.title||'Are you sure?';
  root.querySelector('.modal-msg').textContent=opts.message||'';
  const go=root.querySelector('.modal-go');go.textContent=opts.confirmText||(opts.alert?'OK':'Confirm');
  if(opts.danger)go.classList.add('danger');
  const cancel=root.querySelector('.modal-cancel');
  if(opts.alert)cancel.style.display='none';
  function close(){document.removeEventListener('keydown',onKey);if(root.parentNode)root.parentNode.removeChild(root);}
  function onKey(e){if(e.key==='Escape'){e.preventDefault();close();}}
  cancel.onclick=close;
  go.onclick=function(){close();if(opts.onConfirm)opts.onConfirm();};
  root.addEventListener('click',function(e){if(e.target===root)close();});
  document.addEventListener('keydown',onKey);
  document.body.appendChild(root);
  (opts.alert?go:cancel).focus();
}

/* ===== reset ===== */
function resetPlan(){
  confirmModal({title:'Reset plan?',message:'This clears your current arrangement and restores the default Biological Engineering plan.',confirmText:'Reset',danger:true,onConfirm:function(){
    state=defaultState(state.track);persistArmed=true;save();
    if(location.search)history.replaceState(null,'',location.pathname);
    render();toast('Plan reset to default');
  }});
}

/* ===== elective subtitle (inline edit) ===== */
function renderEditableTitle(d){
  const has=d.subtitle&&d.subtitle.trim();
  return `<button class="t-title editable${has?'':' empty'}" data-act="subtitle" title="${has?'Edit this course':'Add the specific course you’re using'}"><span class="txt">${has?esc(d.subtitle):'Add course number / title'}</span><svg class="pencil" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>`;
}
function startSubtitleEdit(id){
  const tile=el('ledger').querySelector(`.tile[data-id="${id}"]`);if(!tile)return;
  const sub=tile.querySelector('[data-act="subtitle"]');if(!sub)return;
  const meta=state.tileMeta[id]||(state.tileMeta[id]={});
  const inp=document.createElement('input');inp.className='sub-input';inp.value=tileDef(id).subtitle||'';inp.placeholder='e.g., PSYC 2000: Introduction to Psychology';inp.maxLength=80;
  sub.replaceWith(inp);inp.focus();inp.select();
  let done=false;
  const commit=save_=>{if(done)return;done=true;
    if(save_){const v=inp.value.trim();if(v)meta.subtitle=v;else delete meta.subtitle;touch();}
    render();};
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();commit(true);}else if(e.key==='Escape'){e.preventDefault();commit(false);}});
  inp.addEventListener('blur',()=>commit(true));
}

/* ===== mark complete + per-tile note ===== */
function toggleDone(id){
  if(isDone(id))delete state.done[id];                  // uncheck: course falls back to its active-track planned spot
  else state.done[id]=posMap(state.track)[id];          // check: pin to the semester where it currently sits — planned spots untouched
  touch();render();
}
function toggleTermDone(key){
  const col=projectColumns().find(c=>c.key===key);if(!col||!col.tiles.length)return;
  const allDone=col.tiles.every(id=>isDone(id));   // if everything is checked, this click clears them; otherwise it checks them all
  col.tiles.forEach(id=>{if(allDone)delete state.done[id];else state.done[id]=key;});
  touch();render();
}
function openNoteDialog(id){
  const meta=state.tileMeta[id]||(state.tileMeta[id]={}),d=tileDef(id),cur=meta.note||'';
  const ov=document.createElement('div');ov.className='overlay';
  ov.innerHTML=`<div class="dialog" role="dialog" aria-modal="true">
    <h3>Note</h3>
    <div class="dlg-body">
      <div style="font-size:12px;color:var(--ink-soft);margin:0 0 8px">${esc((d.code?d.code+' — ':'')+d.title)}</div>
      <div class="field"><label>Comment <span style="font-weight:400;color:var(--ink-faint)">(shows in this course’s details)</span></label>
        <textarea id="f-note2" maxlength="200" rows="3" placeholder="e.g., also counts toward Robotics minor"></textarea></div>
    </div>
    <div class="dlg-foot">
      <button class="btn2" data-x="cancel">Cancel</button>
      ${cur?'<button class="btn2" data-x="remove">Remove</button>':''}
      <button class="btn2 primary" data-x="ok">Save</button>
    </div></div>`;
  document.body.appendChild(ov);
  const ta=ov.querySelector('#f-note2');ta.value=cur;
  const escH=e=>{if(e.key==='Escape')close();};
  const close=()=>{ov.remove();document.removeEventListener('keydown',escH);};
  document.addEventListener('keydown',escH);
  ov.addEventListener('pointerdown',e=>{if(e.target===ov)close();});
  ov.querySelector('[data-x="cancel"]').onclick=close;
  const rm=ov.querySelector('[data-x="remove"]');if(rm)rm.onclick=()=>{delete meta.note;touch();render();close();};
  ta.focus();
  ov.querySelector('[data-x="ok"]').onclick=()=>{const val=ta.value.trim();if(val)meta.note=val;else delete meta.note;touch();render();close();};
}

/* ===== custom-course / edit dialog ===== */
function openCourseDialog(opts){
  const {mode,id,termKey}=opts,editing=!!id,isCustom=mode==='custom';
  const meta=editing?(state.tileMeta[id]||{}):{},d=editing?tileDef(id):null;
  const kindFor=()=>meta.kind||(id&&PLACEHOLDER_DEFAULTS[id])||'GEN';
  const titleVal=editing&&isCustom?(meta.title||''):'';
  const codeVal=editing&&isCustom?(meta.code||''):'';
  const crVal=editing?d.cr:(isCustom?3:'');
  const diffVal=editing?d.diff:'normal';
  const subVal=editing&&!isCustom?(d.subtitle||''):'';
  const noteVal=editing&&isCustom?(meta.note||''):'';
  const head=isCustom?(editing?'Edit course':'Add a custom course'):'Edit '+(d?(d.label||'elective'):'elective');
  const ov=document.createElement('div');ov.className='overlay';
  ov.innerHTML=`<div class="dialog" role="dialog" aria-modal="true">
    <h3>${esc(head)}</h3>
    <div class="dlg-body">
      ${isCustom
        ?`<div class="field"><label>Course number</label><p class="field-err" id="err-code">This field is required.</p><input id="f-code" type="text" maxlength="16" placeholder="e.g., ENGR 3100" value="${esc(codeVal)}"></div>
          <div class="field"><label>Course title <span style="font-weight:400;color:var(--ink-faint)">(optional)</span></label><input id="f-title" type="text" maxlength="60" placeholder="e.g., Introduction to Robotics" value="${esc(titleVal)}"></div>`
        :`<div class="field"><label>Course number / title <span style="font-weight:400;color:var(--ink-faint)">(optional)</span></label><input id="f-sub" type="text" maxlength="80" placeholder="e.g., PSYC 2000: Introduction to Psychology" value="${esc(subVal)}"></div>`}
      <div class="field inline">
        <div><label>Credits</label><p class="field-err" id="err-cr">This field is required.</p><input id="f-cr" type="number" min="0" max="20" step="1" value="${crVal}"></div>
        <div><label>Difficulty</label><select id="f-diff">
          <option value="normal"${diffVal==='normal'?' selected':''}>Typical</option>
          <option value="hard"${diffVal==='hard'?' selected':''}>Difficult</option>
          <option value="hardest"${diffVal==='hardest'?' selected':''}>Very difficult</option>
        </select></div>
      </div>
      ${isCustom?`<div class="field"><label>Note <span style="font-weight:400;color:var(--ink-faint)">(optional — shows on the tile)</span></label><input id="f-note" type="text" maxlength="120" placeholder="e.g., counts toward Robotics minor" value="${esc(noteVal)}"></div>
      <div style="font-size:11.5px;color:var(--ink-faint);margin:2px 0 4px;line-height:1.4">Heads up: prerequisites and semester availability aren’t checked for custom courses.</div>`:''}
    </div>
    <div class="dlg-foot"><button class="btn2" data-x="cancel">Cancel</button><button class="btn2 primary" data-x="ok">${editing?'Save changes':'Add course'}</button></div>
  </div>`;
  document.body.appendChild(ov);
  const escH=e=>{if(e.key==='Escape')close();};
  const close=()=>{ov.remove();document.removeEventListener('keydown',escH);};
  document.addEventListener('keydown',escH);
  ov.addEventListener('pointerdown',e=>{if(e.target===ov)close();});
  ov.querySelector('[data-x="cancel"]').onclick=close;
  const f=ov.querySelector('input,select');if(f)f.focus();
  if(isCustom){ // clear a field's error as soon as the person edits it
    const wire=(inp,errId)=>{if(inp)inp.addEventListener('input',()=>{inp.classList.remove('err');const er=ov.querySelector('#'+errId);if(er)er.classList.remove('show');});};
    wire(ov.querySelector('#f-code'),'err-code');wire(ov.querySelector('#f-cr'),'err-cr');
  }
  ov.querySelector('[data-x="ok"]').onclick=()=>{
    const diff=ov.querySelector('#f-diff').value;
    if(isCustom){
      const codeEl=ov.querySelector('#f-code'),crEl=ov.querySelector('#f-cr');
      const code=codeEl.value.trim();
      let firstBad=null;
      const flag=(inp,errId)=>{inp.classList.add('err');const er=ov.querySelector('#'+errId);if(er)er.classList.add('show');firstBad=firstBad||inp;};
      codeEl.classList.remove('err');ov.querySelector('#err-code').classList.remove('show');
      crEl.classList.remove('err');ov.querySelector('#err-cr').classList.remove('show');
      if(!code)flag(codeEl,'err-code');
      if(crEl.value.trim()==='')flag(crEl,'err-cr');
      if(firstBad){firstBad.focus();return;}
      const cr=num(crEl.value,3),title=ov.querySelector('#f-title').value.trim(),note=ov.querySelector('#f-note').value.trim();
      if(editing){Object.assign(state.tileMeta[id],{custom:true,code,title,cr,diff,note});}
      else{const nid='c-'+Date.now().toString(36)+Math.floor(Math.random()*1e4);state.tileMeta[nid]={custom:true,code,title,cr,diff,note};const home=(termKey==='completed')?'year1-fall':termKey;state.std[nid]=home;state.pm[nid]=home;if(termKey==='completed')state.done[nid]='completed';}
    }else{
      const cr=num(ov.querySelector('#f-cr').value,(KIND[kindFor()]||KIND.GEN).cr);
      const sub=ov.querySelector('#f-sub').value.trim();
      const m=state.tileMeta[id]||(state.tileMeta[id]={});
      m.kind=kindFor();m.cr=cr;m.diff=diff;if(sub)m.subtitle=sub;else delete m.subtitle;
    }
    touch();render();close();
  };
}

/* ===== delete (with undo) ===== */
let undoSnap=null;
function cloneState(){return JSON.parse(JSON.stringify(state));}
function deleteTile(id){
  const d=tileDef(id);undoSnap=cloneState();
  delete state.std[id];delete state.pm[id];delete state.done[id];
  if(state.tileMeta[id])delete state.tileMeta[id];
  touch();render();
  toast('Deleted '+((d.code?d.code+' — ':'')+d.title),'Undo',()=>{if(undoSnap){state=undoSnap;undoSnap=null;persistArmed=true;save();render();}});
}

/* ===== add / remove terms ===== */
function termPredecessor(key){
  const m=key.match(/^year(\d+)-(fall|spring|summer)$/);if(!m)return null;
  const y=+m[1],s=m[2];
  if(s==='spring')return 'year'+y+'-fall';
  if(s==='summer')return 'year'+y+'-spring';
  return y<=1?null:'year'+(y-1)+'-spring';        // a fall term follows the previous spring (summers don't gate it)
}
function termPresent(key){return state.terms.includes(key);}
function canAddTerm(key){
  if(key==='completed'||termPresent(key))return false;
  const p=termPredecessor(key);
  return p===null?true:termPresent(p);            // only offer a term once the one before it exists
}
function canRemoveTerm(key){
  if(key==='completed'||DEFAULT_TERM_SET.has(key))return false;   // Years 1–4 fall/spring are fixed
  return !state.terms.some(k=>termPredecessor(k)===key);          // can't remove a term another present term depends on
}
function missingTerms(){return allCanonicalTerms().filter(canAddTerm);}
function addTerm(key){
  if(!canAddTerm(key))return;
  state.terms=state.terms.concat([key]).filter((k,i,a)=>a.indexOf(k)===i).sort((a,b)=>termPos(a)-termPos(b));
  touch();render();
  const led=el('ledger'),c=led.querySelector(`.col[data-key="${key}"]`);
  if(c&&typeof led.scrollBy==='function'){ // scroll the ledger sideways to reveal the new column WITHOUT moving the page vertically
    const cr=c.getBoundingClientRect(),lr=led.getBoundingClientRect();
    led.scrollBy({left:(cr.left-lr.left)-(led.clientWidth-cr.width)/2,behavior:'smooth'});
  }
  toast(termLabel(key)+' added');
}
function openAddTermMenu(anchor){
  const miss=missingTerms();
  openPop(anchor,(pop)=>{
    if(!miss.length){const e=document.createElement('div');e.className='gl';e.textContent='All semesters are already shown';pop.appendChild(e);return;}
    const lbl=document.createElement('div');lbl.className='gl';lbl.textContent='Add a semester';pop.appendChild(lbl);
    const sc=document.createElement('div');sc.className='sc';
    miss.forEach(k=>{const b=document.createElement('button');b.className='it';b.textContent=termLabel(k);b.onclick=()=>{addTerm(k);closeAllPops();};sc.appendChild(b);});
    pop.appendChild(sc);
  });
}
function removeTerm(key){
  if(!canRemoveTerm(key))return;
  if(!state.terms.includes(key))return;
  undoSnap=cloneState();
  const remaining=state.terms.filter(k=>k!==key),delPos=termPos(key);
  let targetKey=null;for(const k of remaining){if(k==='completed')continue;if(termPos(k)<delPos&&(targetKey===null||termPos(k)>termPos(targetKey)))targetKey=k;}
  if(targetKey===null)targetKey=remaining.includes('completed')?'completed':remaining[0];
  const seen=projectColumns().find(c=>c.key===key),movedCount=seen?seen.tiles.length:0;   // what the user sees moving (active track)
  [state.std,state.pm,state.done].forEach(map=>{for(const id in map){if(map[id]===key)map[id]=targetKey;}});  // terms are shared — fix every track + the overlay
  state.terms=remaining;touch();render();
  const msg=movedCount?`Removed ${termLabel(key)} · moved ${movedCount} course${movedCount>1?'s':''} to ${termLabel(targetKey)}`:`Removed ${termLabel(key)}`;
  toast(msg,'Undo',()=>{if(undoSnap){state=undoSnap;undoSnap=null;persistArmed=true;save();render();}});
}

function openOverInfo(anchor,key){
  const col=projectColumns().find(c=>c.key===key);if(!col)return;
  const season=termSeason(key),cap=season==='Su'?CONFIG.summerCap:CONFIG.termCap,cr=colCredits(col);
  const tt=season==='Su'?'a summer semester':'a fall or spring semester';
  openPop(anchor,(pop)=>{
    const d=document.createElement('div');
    d.style.cssText='padding:9px 11px;max-width:230px;font-size:12.5px;line-height:1.45;color:var(--ink-soft)';
    d.innerHTML='<b style="color:var(--ink)">'+cr+(cr===1?' credit':' credits')+' planned</b><br>That’s above the recommended maximum of '+cap+' for '+tt+'.';
    pop.appendChild(d);
  });
}

/* ===== backup file (save .json / load .json or legacy .xml) ===== */
function saveBackup(){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='course-plan.json';
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500);
  toast('Backup downloaded');
}
function loadBackupText(text){
  let ns=null;
  try{const obj=JSON.parse(text);ns=toV3(obj,null);}
  catch(e){
    try{
      const xml=new DOMParser().parseFromString(text,'application/xml');
      if(xml.getElementsByTagName('parsererror').length)throw 0;
      const obj={};
      Array.from(xml.getElementsByTagName('semester')).forEach(s=>{const id=s.getAttribute('id');if(!id)return;obj[id]=Array.from(s.getElementsByTagName('course')).map(c=>c.getAttribute('id')).filter(Boolean);});
      if(!Object.keys(obj).length)throw 0;
      ns=toV3(obj,null);
    }catch(e2){toast('Could not read that file — expected a .json or .xml course plan');return;}
  }
  state=ns;persistArmed=true;save();
  if(location.search)history.replaceState(null,'',location.pathname);
  render();toast('Backup loaded');
}
function openBackupMenu(anchor){
  openPop(anchor,(pop)=>{
    const s=document.createElement('button');s.className='it';
    s.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>Download backup (.json)';
    s.onclick=()=>{closeAllPops();saveBackup();};pop.appendChild(s);
    const l=document.createElement('button');l.className='it';
    l.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>Load from file…';
    l.onclick=()=>{closeAllPops();el('file-load').click();};pop.appendChild(l);
  });
}

/* ===== curriculum track toggle ===== */
function syncTrackUI(){
  const t=state.track;
  ['standard','premed'].forEach(k=>{const b=el('tsw-'+k);if(b){b.classList.toggle('on',t===k);b.setAttribute('aria-pressed',t===k?'true':'false');}});
  const note=el('track-note');
  if(note)note.textContent=t==='premed'
    ?'Med-school prerequisites are flagged in green. Both tracks save together.'
    :'Switch anytime — your work in both tracks is saved together.';
}
function setTrack(track){
  track=(track==='premed'?'premed':'standard');
  if(state.track===track)return;
  state.track=track;touch();render();
}

/* ===== auto-arrange (exact MILP optimizer via HiGHS) ===== */
const DIFF_FACTOR={normal:1, hard:1.5, hardest:2};   // difficulty inflates a course's "effective" load (for balance only)
const SENIOR_DESIGN=['BE4390','BE4392'];             // Design I (F) → Design II (S): must be consecutive (rank diff = 1)
// EXPERIMENT KNOB — an extra multiplier on senior design's difficulty, applied ON TOP of its hard/hardest
// factor. 1 keeps the tagged 1.5x / 2x as-is; set to 2, 3, ... to weight the design year more heavily so
// the optimizer pushes more other coursework out of it. Balance-only: no effect on official credits or
// the (already hidden) difficulty pills. Re-run auto-arrange after changing it to see the effect.
const SD_DIFF_MULT={BE4390:2, BE4392:3};             // senior design counts as a fixed multiple of its credits (Design I 2x, Design II 3x), set directly rather than via difficulty tiers, to keep the rest of the senior year lighter
// General-education courses are a bit lighter than STEM at the same credit count. The 0.9 also gives
// STEM vs gen-ed distinct effective loads, which helps the optimizer break ties cleanly.
const GENED=new Set(['HUM','SOCSCI','ART','ELEC','ENGL1001','ENGL2000']);
function effFactor(id,diff){ return SD_DIFF_MULT[id] || (GENED.has(id)?0.9:(DIFF_FACTOR[diff]||1)); }
// Gen-eds and electives have no pedagogically meaningful position in the sequence, so they are NOT
// anchored to their flowchart slot — the optimizer floats them wherever balance is best. Every
// placeholder requirement slot (HUM/SOCSCI/ART/DES/ELEC/TECHELEC/GEN) floats by type; these three REAL
// courses float too. Their hard constraints still hold (prereqs, the design-elective 60-credit gate,
// season offerings), so unanchoring only drops the soft pull toward the recommended position.
const FLOAT_COURSES=new Set(['ENGL1001','ENGL2000','AGEC2003']);
const isFloating=(id,def)=>def.type==='placeholder'||FLOAT_COURSES.has(id);
// Pre-med requirements we want done by Year 3 Fall (before the MCAT). These ones carry HALF the lateness penalty.
const PREMED_LATE_HALF=new Set(['BIOL1208','ENGL1001','BIOL1209','PHYS2108','CHEM1212','CHEM2364','PHYS2109','ENGL2000']);
const SUMMER_SCHEDULABLE={MA:1,MJ:1,JA:1,BOTH:1};    // only these summer types may be auto-placed in summer
function buildScenario(){
  const track=state.track;
  const sorted=state.terms.slice().sort((a,b)=>termPos(a)-termPos(b));
  const rankOf={}; sorted.forEach((k,i)=>{rankOf[k]=i;});                 // dense ordering ranks
  const home=posMap(track);

  // arrange every un-completed course on this track; tally movable courses per term
  const movable=[], movCnt={};
  Object.keys(home).forEach(id=>{
    if(isDone(id)||!belongsToTrack(id,track))return;
    const d=tileDef(id);
    const summer=SUMMER_SCHEDULABLE[d.summer]?d.summer:null;            // gen-eds/design/custom => not auto-schedulable in summer
    let seasons=(d.sem||[]).slice(); if(!summer)seasons=seasons.filter(s=>s!=='Su');
    const pmw=(track==='premed'&&PREMED_REQ.has(id))?(PREMED_LATE_HALF.has(id)?0.5:1):0;
    movable.push({id, cr:d.cr, eff:d.cr*effFactor(id,d.diff), seasons, summer, isDesign:d.kind==='DES', isHum:d.kind==='HUM', pmw,
      pre:(d.pre||[]).slice(), co:(d.co||[]).slice(), coAny:!!d.coreqAny, float:isFloating(id,d)});
    movCnt[home[id]]=(movCnt[home[id]]||0)+1;
  });
  let apCredits=0; for(const did in state.done){ if(state.done[did]==='completed'&&belongsToTrack(did,track)) apCredits+=tileDef(did).cr; }
  // completed courses shown on this track: count + credits pinned per (real) term, and requisite positions
  const doneCnt={}, fixedCr={}, fixedEff={}, fixedRank={}, fixedTP={};
  for(const id in state.done){
    const k=state.done[id];
    if(rankOf[k]!==undefined){fixedRank[id]=rankOf[k]; fixedTP[id]=termPos(k);}   // requisite lower-bounds (incl. AP bucket)
    if(k==='completed'||!belongsToTrack(id,track))continue;
    const d=tileDef(id);
    doneCnt[k]=(doneCnt[k]||0)+1;
    fixedCr[k]=(fixedCr[k]||0)+d.cr;
    fixedEff[k]=(fixedEff[k]||0)+d.cr*effFactor(id,d.diff);
  }
  // A term is OPEN for placement unless it is fully checked off (completed courses, no movable ones).
  // If the student has added a summer term, that itself signals intent to use it, so the planner may
  // schedule into any activated semester — fall, spring, or summer, including Year 5/6.
  const terms=sorted.map(k=>({key:k, rank:rankOf[k], season:termSeason(k), tp:termPos(k),
    open:(k!=='completed' && termPos(k)>=0 && !((doneCnt[k]||0)>0 && (movCnt[k]||0)===0))}));

  const defOf={}; (DEFAULT_PLANS[track]||[]).forEach(([k,arr])=>arr.forEach(id=>{defOf[id]=k;}));
  const defTerm={}, defTP={};                            // anchor target by termKey AND by intrinsic termPos (summer-invariant)
  movable.forEach(c=>{const dk=defOf[c.id]!==undefined?defOf[c.id]:null; defTerm[c.id]=dk; defTP[c.id]=(dk!=null&&!c.float)?termPos(dk):null;});
  const pairs=[]; if(SENIOR_DESIGN.every(id=>belongsToTrack(id,track)))pairs.push({a:SENIOR_DESIGN[0], b:SENIOR_DESIGN[1], gap:1});
  return {terms, movable, fixedRank, fixedTP, fixedCr, fixedEff, defTerm, defTP, pairs, apCredits,
    desMinCredits:60,                                   // a design elective needs >=60 credits already earned before its term
    pmAfterTP:termPos('year3-fall'),                    // pre-med reqs should land no later than Year 3 Fall (tp=9)
    caps:{fsMin:12, fsMax:CONFIG.termCap, suMax:CONFIG.summerCap},
    weights:{band:1e7, even:1e3, flat:20, pmLate:2e3, desExtra:2e3, coSep:1.5e3, anchor:300, anchorPair:1500}};   // band ≫ {premed-timing, design-spread} ≥ coreq-together ≫ {peak, spread} ≫ shape-anchor (senior design pinned harder)
}

let _highs=null, _highsLoading=null;
// highs.js (an Emscripten MODULARIZE build) exposes its factory as a global — named `Module`
// in the browser, not `Highs`. Look under either name so a future build rename won't break us.
function highsFactory(){
  const f=(typeof Highs!=='undefined'&&Highs)||(typeof Module!=='undefined'&&Module)
        ||(typeof window!=='undefined'&&(window.Highs||window.Module));
  return typeof f==='function'?f:null;
}
function loadHighs(){   // lazy: only fetch the ~3 MB solver the first time someone auto-arranges
  if(_highs)return Promise.resolve(_highs);
  if(_highsLoading)return _highsLoading;
  _highsLoading=new Promise((resolve,reject)=>{
    const go=()=>{ const F=highsFactory();
      if(!F){reject(new Error('optimizer global not found after load'));return;}
      F({locateFile:f=>f}).then(h=>{_highs=h;resolve(h);}).catch(reject); };
    if(highsFactory()){go();return;}
    const s=document.createElement('script'); s.src='highs.js'; s.async=true;
    s.onload=go; s.onerror=()=>reject(new Error('Could not load highs.js.'));
    document.head.appendChild(s);
  });
  return _highsLoading;
}

// Run the MILP solve in a Web Worker so the main thread (and the spinner) stay responsive. The worker
// loads its own planner.js + highs.js from the same directory. Rejects if Workers are unavailable or
// the worker fails to load/run, which makes autoArrange fall back to the in-thread solver. The worker
// is created lazily on first use and reused; a worker-level error discards it so the next try is fresh.
let _solverWorker=null, _solveSeq=0;
function solveOffThread(scn, opts){
  return new Promise((resolve,reject)=>{
    if(typeof Worker==='undefined'){reject(new Error('Web Workers unavailable'));return;}
    let worker;
    try{ worker=_solverWorker||(_solverWorker=new Worker('solver-worker.js')); }
    catch(err){ _solverWorker=null; reject(new Error('worker create failed: '+((err&&err.message)||err))); return; }
    const id=++_solveSeq;
    const cleanup=()=>{ worker.removeEventListener('message',onMsg); worker.removeEventListener('error',onErr); };
    const onMsg=(e)=>{ if(!e.data||e.data.id!==id)return; cleanup(); e.data.ok?resolve(e.data.res):reject(new Error(e.data.error||'solver error')); };
    const onErr=(err)=>{ cleanup(); _solverWorker=null; reject(new Error('worker error: '+((err&&err.message)||'load failure'))); };
    worker.addEventListener('message',onMsg);
    worker.addEventListener('error',onErr);
    worker.postMessage({id, scn, opts});
  });
}

async function autoArrange(){
  const btn=el('btn-auto');
  if(btn){btn.disabled=true;btn.classList.add('busy');}
  try{
    const scn=buildScenario();
    if(!scn.movable.length){toast('Nothing to arrange — every course is already marked complete.');return;}
    const opts={output_flag:false, mip_rel_gap:0.05, time_limit:20};
    // Paint the busy label + spinner before solving. With the worker the page stays live and the
    // spinner keeps animating for the whole solve; this frame also covers the in-thread fallback,
    // where the solve freezes the main thread (there at least the label shows before the freeze).
    await new Promise(r=>{const raf=window.requestAnimationFrame||(cb=>setTimeout(cb,16));raf(()=>raf(r));});
    let res;
    try{
      res=await solveOffThread(scn, opts);                        // Web Worker: keeps the UI responsive
    }catch(workerErr){
      let highs; try{highs=await loadHighs();}catch(e){           // fallback: solve on the main thread
        toast(location.protocol==='file:'
          ? 'Auto-arrange needs the page served over http. Open it through a local server or your published link, not by double-clicking the file.'
          : 'Couldn’t load the optimizer. Make sure highs.js and highs.wasm sit next to index.html, then try again.');
        return;}
      res=await BECPlanner.solvePlan(scn, lp=>highs.solve(lp, opts));
    }
    if(res.status==='infeasible'){toast('Couldn’t fit every course into the semesters you have. '+(res.reason||'Try adding a semester, then auto-arrange again.'));return;}
    if(res.status!=='optimal'){toast('Auto-arrange hit a snag'+(res.reason?(': '+res.reason):'')+'. Nothing was changed.');return;}
    undoSnap=cloneState();
    const home=posMap(state.track);
    for(const id in res.placements)home[id]=res.placements[id];
    touch();render();
    toast('Auto-arranged your '+(state.track==='premed'?'pre-med':'standard')+' plan','Undo',
      ()=>{if(undoSnap){state=undoSnap;undoSnap=null;persistArmed=true;save();render();}});
  }catch(e){toast('Auto-arrange failed: '+((e&&e.message)||e));}
  finally{const b=el('btn-auto'); if(b){b.disabled=false;b.classList.remove('busy');}}
}

/* ===== init ===== */
function init(){
  const src=loadInitial();
  render();
  wireDnD();wireClicks();
  el('ledger').addEventListener('scroll',updateChevrons,{passive:true});
  window.addEventListener('resize',updateChevrons);
  el('sc-left').onclick=()=>{el('ledger').scrollBy({left:-(222),behavior:'smooth'});};
  el('sc-right').onclick=()=>{el('ledger').scrollBy({left:222,behavior:'smooth'});};
  el('btn-share').onclick=shareLink;
  el('btn-print').onclick=()=>window.print();
  el('btn-reset').onclick=resetPlan;
  el('tsw-standard').onclick=()=>setTrack('standard');
  el('tsw-premed').onclick=()=>setTrack('premed');
  el('btn-addterm').onclick=function(){openAddTermMenu(this);};
  el('btn-auto').onclick=autoArrange;
  // Backup button removed from the UI; saveBackup/loadBackupText/openBackupMenu remain available to re-enable.
  el('file-load').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>loadBackupText(r.result);r.readAsText(f);e.target.value='';});
  el('ih').onclick=()=>el('issues').classList.toggle('cl');
  if(src==='local')setSaved('saved');
  if(src==='url-error')confirmModal({alert:true,title:'This shared link could not be opened',message:'The link looks incomplete or corrupted, so the shared plan could not be loaded. You are seeing the default plan, not the plan that was shared with you. Ask the sender to copy the full link and send it again.',confirmText:'OK'});
}
document.addEventListener('DOMContentLoaded',init);
if(document.readyState!=='loading')init();
