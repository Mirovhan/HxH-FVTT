
import { HXHActorSheet } from "./sheets/actor-sheet.mjs";
import { HXHItem } from "./items/hxh-item.mjs";
import { HXHItemSheet, HXHWeaponSheet, HXHArmorSheet, HXHHatsuSheet } from "./items/item-sheets.mjs";
import { HXHLog } from "./utils/logger.mjs";

Hooks.once("init", function() {
  HXHLog.info("Init v13 HxH 1.8B");

  // Docs
  CONFIG.Item.documentClass = HXHItem;

  // Settings
  game.settings.register("hxh-1-8b", "rollMode", {
    name: "HXH.Settings.RollMode.Name",
    hint: "HXH.Settings.RollMode.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: {"d20":"HXH.Settings.RollMode.d20", "d100":"HXH.Settings.RollMode.d100"},
    default: "d20"
  });

  // Load templates
  loadTemplates([
    "systems/hxh-1-8b/templates/actor/actor.hbs",
    "systems/hxh-1-8b/templates/actor/parts/summary.hbs",
    "systems/hxh-1-8b/templates/actor/parts/attributes.hbs",
    "systems/hxh-1-8b/templates/actor/parts/nen.hbs",
    "systems/hxh-1-8b/templates/actor/parts/inventory.hbs",
    "systems/hxh-1-8b/templates/item/item.hbs",
    "systems/hxh-1-8b/templates/item/weapon.hbs",
    "systems/hxh-1-8b/templates/item/armor.hbs",
    "systems/hxh-1-8b/templates/item/hatsu.hbs"
  ]);

  // Register sheets
  
  
  
  
  

  // Handlebars helpers
  Handlebars.registerHelper("eq", (a,b)=> a===b);
  Handlebars.registerHelper("gt", (a,b)=> (Number(a)||0) > (Number(b)||0));
  Handlebars.registerHelper("sum", (...vals)=> vals.slice(0,-1).map(Number).reduce((a,b)=>a+b,0));
});


// --- Robust registration (v13 API) ---
try {
  DocumentSheetConfig.registerSheet(Actor, "hxh-1-8b", HXHActorSheet, { types:["character","npc"], makeDefault:true });
  DocumentSheetConfig.registerSheet(Item, "hxh-1-8b", HXHItemSheet, { types:["equipment"], makeDefault: true });
  DocumentSheetConfig.registerSheet(Item, "hxh-1-8b", HXHWeaponSheet, { types:["weapon"], makeDefault: true });
  DocumentSheetConfig.registerSheet(Item, "hxh-1-8b", HXHArmorSheet, { types:["armor"], makeDefault: true });
  DocumentSheetConfig.registerSheet(Item, "hxh-1-8b", HXHHatsuSheet, { types:["hatsu"], makeDefault: true });
  HXHLog.info("Sheets registered via DocumentSheetConfig");
} catch (e) {
  HXHLog.error("Sheet registration failed", e);
}

// --- Global error logging ---
window.addEventListener("error", (ev)=> {
  try { HXHLog.error("Uncaught error:", ev?.message || ev); } catch {}
});
window.addEventListener("unhandledrejection", (ev)=> {
  try { HXHLog.error("Unhandled promise:", ev?.reason || ev); } catch {}
});
