import { HxHActor } from "./hxh-actor.js";
import { HxHItem } from "./hxh-item.js";
import { HxHActorSheet } from "./actor-sheet.js";
import { HxHHatsuSheet } from "./item-sheet.js";

Hooks.once("init", async function () {
  console.log("HXH 1.8B | Init v13");

  // Document classes
  CONFIG.Actor.documentClass = HxHActor;
  CONFIG.Item.documentClass = HxHItem;

  // Settings
  game.settings.register("hxh-1-8b", "rollMode", {
    name: game.i18n.localize("HXH.Settings.RollMode.Name"),
    hint: game.i18n.localize("HXH.Settings.RollMode.Hint"),
    scope: "world",
    config: true,
    type: String,
    choices: {
      "d20": game.i18n.localize("HXH.Settings.RollMode.d20"),
      "d100": game.i18n.localize("HXH.Settings.RollMode.d100")
    },
    default: "d20"
  });

  // Templates
  await loadTemplates([
    "systems/hxh-1-8b/templates/sheets/actor/character-sheet.hbs",
    "systems/hxh-1-8b/templates/sheets/item/hatsu-sheet.hbs"
  ]);

  // Helpers
  Handlebars.registerHelper("eq", (a, b) => a === b);
  Handlebars.registerHelper("sumMods", mods => {
    if (!Array.isArray(mods)) return 0;
    return mods.reduce((acc, m) => acc + Number(m.value || 0), 0);
  });

  // Sheets
  Actors.registerSheet("hxh-1-8b", HxHActorSheet, {
    types: ["character", "npc"],
    makeDefault: true,
    label: game.i18n.localize("HXH.ActorSheet")
  });

  Items.registerSheet("hxh-1-8b", HxHHatsuSheet, {
    types: ["hatsu"],
    makeDefault: true
  });
});
