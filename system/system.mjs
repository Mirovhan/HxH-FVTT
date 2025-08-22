import { HXHLog } from "./utils/logger.mjs";
import { HXHActorSheet } from "./sheets/actor-sheet.mjs";

Hooks.once("init", () => {
  // Precarga de parciales
  loadTemplates([
    "systems/hxh-1-8b/templates/actor/parts/summary.hbs",
    "systems/hxh-1-8b/templates/actor/parts/attributes.hbs",
    "systems/hxh-1-8b/templates/actor/parts/nen.hbs",
    "systems/hxh-1-8b/templates/actor/parts/inventory.hbs",
    "systems/hxh-1-8b/templates/item/item.hbs"
  ]);

  // Helpers usados por templates
  try {
    const H = Handlebars;
    H.registerHelper("sum", (...vals) => vals.slice(0,-1).map(v => Number(v)||0).reduce((a,b)=>a+b, 0));
    H.registerHelper("eq", (a,b)=>a===b);
    H.registerHelper("ne", (a,b)=>a!==b);
    H.registerHelper("gt", (a,b)=>(Number(a)||0)>(Number(b)||0));
    H.registerHelper("gte",(a,b)=>(Number(a)||0)>=(Number(b)||0));
    H.registerHelper("lt", (a,b)=>(Number(a)||0)<(Number(b)||0));
    H.registerHelper("lte",(a,b)=>(Number(a)||0)<=(Number(b)||0));
    H.registerHelper("and",(a,b)=>a&&b);
    H.registerHelper("or", (a,b)=>a||b);
    H.registerHelper("not",(a)=>!a);
  } catch (e) {
    console.error("HXH helpers registration failed", e);
  }

  // Registrar hojas
  DocumentSheetConfig.registerSheet(Actor, "hxh-1-8b", HXHActorSheet, { types:["character","npc"], makeDefault:true });

  HXHLog.info("HXH v13 system initialized.");
});

window.addEventListener("error", (ev)=> { try { HXHLog.error("Uncaught error:", ev?.message || ev); } catch {} });
window.addEventListener("unhandledrejection", (ev)=> { try { HXHLog.error("Unhandled promise:", ev?.reason || ev); } catch {} });
