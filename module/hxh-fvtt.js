import { HxHActor } from "./actor/actor.js";
import { HxHCharacterSheet } from "./actor/sheets/character-sheet.js";

Hooks.once("init", async function() {
  CONFIG.Actor.documentClass = HxHActor;
  Actors.registerSheet("hxh-fvtt", HxHCharacterSheet, { types: ["character"], makeDefault: true });

  Handlebars.registerHelper("eq", (a, b) => a === b);
  await loadTemplates([
    "systems/hxh-fvtt/templates/actor/character-sheet.hbs"
  ]);
});