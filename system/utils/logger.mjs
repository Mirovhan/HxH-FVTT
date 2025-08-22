export const HXHLog = {
  info: (...a)=>{ try{ console.log("HXH", ...a);}catch{}},
  warn: (...a)=>{ try{ console.warn("HXH", ...a); ui.notifications?.warn(a.map(String).join(" ")); }catch{}},
  error: (...a)=>{ try{ console.error("HXH", ...a); ui.notifications?.error(a.map(String).join(" ")); }catch{}},
  safe: (fn, ctx="") => async (ev) => {
    try { return await fn(ev); }
    catch (e) { console.error("HXH Unhandled:", ctx, e); ui.notifications?.error(`HXH ${ctx}: ${e?.message||e}`); }
  }
};
