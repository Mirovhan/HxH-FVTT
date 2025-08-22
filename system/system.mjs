import { HXHLog } from "./utils/logger.mjs";
import { HXHActorSheet } from "./sheets/actor-sheet.mjs";
import { HXHItemSheet, HXHWeaponSheet, HXHArmorSheet, HXHHatsuSheet } from "./items/item-sheets.mjs";

Hooks.once("init", () => {
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
