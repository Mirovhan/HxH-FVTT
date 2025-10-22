import { HxHActor } from "./actor/actor.js";
import { HxHCharacterSheet } from "./actor/sheets/character-sheet.js";

Hooks.once("init", async function() {
  CONFIG.Actor.documentClass = HxHActor;
  Actors.registerSheet("hxh-fvtt", HxHCharacterSheet, { types: ["character"], makeDefault: true });

  Handlebars.registerHelper("concat", function() {
    return Array.from(arguments).slice(0, -1).join("");
  });
  Handlebars.registerHelper("eq", (a, b) => a === b);

  const templatePaths = [
    "systems/hxh-fvtt/templates/actor/character-sheet.hbs",
    "systems/hxh-fvtt/templates/actor/partials/salv.hbs"
  ];
  await loadTemplates(templatePaths);
});