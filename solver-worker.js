/* Web Worker for auto-arrange.

   Runs the HiGHS MILP solve off the main thread so the page (and the "Arranging…" spinner) stay fully
   responsive while the optimizer works. It loads the very same planner.js and highs.js as the page,
   from the same directory, so the model and solver are identical to the in-thread path. The main
   thread falls back to an in-thread solve if this worker cannot be created or fails to load (old
   browsers, file://, or a strict content-security policy). */
'use strict';

// Synchronous in a worker, and off the main thread: pull in the optimizer module + the HiGHS glue.
// A load failure here surfaces to the page as the worker's 'error' event, which triggers the fallback.
importScripts('planner.js', 'highs.js');

// highs.js (an Emscripten MODULARIZE build) exposes its factory as a global, named `Module` or `Highs`.
function highsFactory() {
  const f = (typeof Highs !== 'undefined' && Highs) || (typeof Module !== 'undefined' && Module) || self.Highs || self.Module;
  return typeof f === 'function' ? f : null;
}

let _highsP = null;
function getHighs() {
  if (_highsP) return _highsP;
  const F = highsFactory();
  if (!F) return Promise.reject(new Error('HiGHS factory not found in worker'));
  _highsP = F({ locateFile: function (f) { return f; } }); // highs.wasm resolves next to the worker
  return _highsP;
}

self.onmessage = function (e) {
  const msg = e.data || {};
  getHighs()
    .then(function (highs) { return self.BECPlanner.solvePlan(msg.scn, function (lp) { return highs.solve(lp, msg.opts); }); })
    .then(function (res) { self.postMessage({ id: msg.id, ok: true, res: res }); })
    .catch(function (err) { self.postMessage({ id: msg.id, ok: false, error: (err && err.message) || String(err) }); });
};
