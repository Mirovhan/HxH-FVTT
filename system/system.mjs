
import { HXHLog } from "./utils/logger.mjs";
import { HXHConfig } from "./config/config.mjs";
import { HXHActorSheet } from "./sheets/actor-sheet.mjs";

Hooks.once("init", () => {
  CONFIG.HXH = HXHConfig;

  try {
    Handlebars.registerHelper("cap", (s)=> (s??"").charAt(0).toUpperCase() + (s??"").slice(1));
    Handlebars.registerHelper("eq", (a,b)=> a===b);
    Handlebars.registerHelper("lookup", (obj, key)=> obj?.[key]);
  } catch {}

  DocumentSheetConfig.registerSheet(Actor, "hxh-1-8b", HXHActorSheet, { types:["character","npc"], makeDefault:true });

  HXHLog.info("HXH v0.9.2 init");
});

Hooks.on("updateActor", (actor) => {
  for (const app of Object.values(actor.apps||{})) app.render(false);
});

Hooks.once("ready", () => {
  const root = document.body;

  // Persist any field
  root.addEventListener("change", async (ev) => {
    const el = ev.target.closest(".hxh-actor-root input, .hxh-actor-root select, .hxh-actor-root textarea");
    if (!el || !el.name) return;
    const host = el.closest(".hxh-actor-root");
    const id = host?.dataset?.actorId;
    const actor = game.actors?.get(id);
    if (!actor) return;

    let v;
    if (el.name === "name") v = el.value;
    else if (el.type === "checkbox") v = el.checked;
    else if (el.type === "number") v = Number(el.value ?? 0);
    else v = el.value;

    await actor.update({ [el.name]: v });
  });

  // Origin type -> set first subtype
  root.addEventListener("change", async (ev) => {
    const sel = ev.target.closest('select[name="system.identity.origin.type"]');
    if (!sel) return;
    const host = sel.closest(".hxh-actor-root");
    const actor = game.actors?.get(host?.dataset?.actorId);
    if (!actor) return;
    const type = sel.value;
    const subs = Object.keys(CONFIG.HXH.ORIGINS[type]||{});
    const first = subs[0] || "";
    await actor.update({ "system.identity.origin.subtype": first });
  });

  // XP -> recompute level
  root.addEventListener("change", async (ev) => {
    const xpEl = ev.target.closest('input[name="system.details.xp"]');
    if (!xpEl) return;
    const host = xpEl.closest(".hxh-actor-root");
    const actor = game.actors?.get(host?.dataset?.actorId);
    if (!actor) return;
    const xp = Number(xpEl.value || 0);
    const levels = CONFIG.HXH.XP_LEVELS;
    let lvl = 1;
    for (const step of levels) if (xp >= step.xp) lvl = step.level;
    await actor.update({ "system.details.level": lvl });
  });
});
