import { HXHLog } from "./utils/logger.mjs";
import { HXHActorSheet } from "./sheets/actor-sheet.mjs";

Hooks.once("init", () => {
  try {
    const H = Handlebars;
    H.registerHelper("cap", (s) => (s||"").charAt(0).toUpperCase() + (s||"").slice(1));
  } catch {}

  DocumentSheetConfig.registerSheet(Actor, "hxh-1-8b", HXHActorSheet, { types:["character","npc"], makeDefault:true });
  HXHLog.info("HXH v13 system initialized.");
});

window.addEventListener("error", (ev)=> { try { console.error("HXH uncaught:", ev?.message||ev); } catch {} });
window.addEventListener("unhandledrejection", (ev)=> { try { console.error("HXH unhandled promise:", ev?.reason||ev); } catch {} });
