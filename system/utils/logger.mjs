
export const HXHLog = {
  info(...args) {
    console.log("%cHXH","color:#4b9;font-weight:bold", ...args);
  },
  warn(...args) {
    console.warn("%cHXH","color:#db0;font-weight:bold", ...args);
  },
  error(...args) {
    console.error("%cHXH","color:#e33;font-weight:bold", ...args);
    try { ui.notifications?.error(["HXH", ...args].join(" ")); } catch {}
  },
  safe(fn, context="") {
    return async (...args)=>{
      try { return await fn.apply(this, args); }
      catch (e) {
        this.error("Excepción", context, e?.message || e);
        console.error(e);
      }
    };
  }
};
