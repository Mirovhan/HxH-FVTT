import { HxHActor } from "./actor/actor.js";
import { HxHCharacterSheet } from "./actor/sheets/character-sheet.js";

Hooks.once("init", async function() {
  CONFIG.Actor.documentClass = HxHActor;
  Actors.registerSheet("hxh-fvtt", HxHCharacterSheet, { types: ["character"], makeDefault: true });

  Handlebars.registerHelper("eq", (a,b) => a===b);
  Handlebars.registerHelper("times", function(n, block) { let out=""; n=Number(n)||0; for (let i=0;i<n;i++) out += block.fn(i); return out; });
  Handlebars.registerHelper("subtract", (a,b)=> (Number(a)||0)-(Number(b)||0));

  await loadTemplates(["systems/hxh-fvtt/templates/actor/character-sheet.hbs"]);
});