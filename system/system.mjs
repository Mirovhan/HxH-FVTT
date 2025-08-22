import { HXHLog } from "./utils/logger.mjs";
import { HXHActorSheet } from "./sheets/actor-sheet.mjs";
import { HXHItemSheet, HXHWeaponSheet, HXHArmorSheet, HXHHatsuSheet } from "./items/item-sheets.mjs";

Hooks.once("init", () => {
  // Preload Handlebars partials required by the sheets
  loadTemplates([
    "systems/hxh-1-8b/templates/actor/parts/summary.hbs",
    "systems/hxh-1-8b/templates/actor/parts/attributes.hbs",
    "systems/hxh-1-8b/templates/actor/parts/nen.hbs",
    "systems/hxh-1-8b/templates/actor/parts/inventory.hbs",
    "systems/hxh-1-8b/templates/item/item.hbs"
  ]);

  

  // Handlebars helpers (needed by templates)
  try {
    const H = Handlebars;
    H.registerHelper("sum", (...vals) => vals.slice(0,-1).map(v => Number(v)||0).reduce((a,b)=>a+b, 0));
    H.registerHelper("eq", (a,b) => a===b);
    H.registerHelper("ne", (a,b) => a!==b);
    H.registerHelper("gt", (a,b) => (Number(a)||0) > (Number(b)||0));
    H.registerHelper("gte", (a,b) => (Number(a)||0) >= (Number(b)||0));
    H.registerHelper("lt", (a,b) => (Number(a)||0) < (Number(b)||0));
    H.registerHelper("lte", (a,b) => (Number(a)||0) <= (Number(b)||0));
    H.registerHelper("and", (a,b) => a && b);
    H.registerHelper("or", (a,b) => a || b);
    H.registerHelper("not", (a) => !a);
  } catch (e) {
    console.error("HXH helpers registration failed", e);
  }

try {
    DocumentSheetConfig.registerSheet(Actor, "hxh-1-8b", HXHActorSheet, { types:["character","npc"], makeDefault:true });
    DocumentSheetConfig.registerSheet(Item,  "hxh-1-8b", HXHItemSheet,   { types:["equipment"], makeDefault:true });
    DocumentSheetConfig.registerSheet(Item,  "hxh-1-8b", HXHWeaponSheet,  { types:["weapon"], makeDefault:true });
    DocumentSheetConfig.registerSheet(Item,  "hxh-1-8b", HXHArmorSheet,   { types:["armor"], makeDefault:true });
    DocumentSheetConfig.registerSheet(Item,  "hxh-1-8b", HXHHatsuSheet,   { types:["hatsu"], makeDefault:true });
    HXHLog.info("HXH v13 system initialized.");
  } catch (e) {
    HXHLog.error("Sheet registration failed", e);
  }
});

window.addEventListener("error", (ev)=> { try { HXHLog.error("Uncaught error:", ev?.message || ev); } catch {} });
window.addEventListener("unhandledrejection", (ev)=> { try { HXHLog.error("Unhandled promise:", ev?.reason || ev); } catch {} });
