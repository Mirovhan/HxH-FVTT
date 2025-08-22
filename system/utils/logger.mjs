export const HXHLog = {
  info: (...a)=>{ console.log("HXH", ...a); },
  warn: (...a)=>{ console.warn("HXH", ...a); ui.notifications?.warn(a.map(String).join(" ")); },
  error: (...a)=>{ console.error("HXH", ...a); ui.notifications?.error(a.map(String).join(" ")); },
  safe: (fn, ctx="") => async (ev) => {
    try { return await fn(ev); } catch (e) { console.error("HXH Unhandled:", ctx, e); ui.notifications?.error(`HXH Unhandled ${ctx}: ${e?.message||e}`); }
  }
};
