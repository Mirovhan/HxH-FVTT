
import { HXHLog } from "./utils/logger.mjs";
import { HXHActorSheet } from "./sheets/actor-sheet.mjs";

Hooks.once("init", () => {
  try { Handlebars.registerHelper("cap",(s)=> (s||""[0]?.toUpperCase()) + (s||"").slice(1)); } catch {}

  DocumentSheetConfig.registerSheet(Actor, "hxh-1-8b", HXHActorSheet, { types:["character","npc"], makeDefault:true });
  HXHLog.info("HXH v13 system initialized.");
});

// Delegación global: clicks y cambios desde body para asegurar captura
Hooks.once("ready", () => {
  const root = document.body;

  root.addEventListener("change", async (ev) => {
    const el = ev.target.closest(".hxh-actor-root input, .hxh-actor-root select, .hxh-actor-root textarea");
    if (!el || !el.name) return;
    const host = el.closest(".hxh-actor-root");
    const id = host?.dataset?.actorId;
    const actor = game.actors?.get(id);
    if (!actor) return;
    let v;
    if (el.type === "checkbox") v = el.checked;
    else if (el.type === "number") v = Number(el.value ?? 0);
    else v = el.value;
    try { await actor.update({ [el.name]: v }); } catch(e) { console.error("HXH persist error", e); }
  });

  root.addEventListener("click", async (ev) => {
    const btn = ev.target.closest(".hxh-actor-root [data-action]");
    if (!btn) return;
    const host = btn.closest(".hxh-actor-root");
    const id = host?.dataset?.actorId;
    const actor = game.actors?.get(id);
    if (!actor) return;

    ev.preventDefault();
    const speak = () => ChatMessage.getSpeaker({ actor });

    switch (btn.dataset.action) {
      case "roll-save": {
        const key = btn.dataset.key;
        const val = Number(actor.system?.derived?.[key] ?? 0) || 0;
        const r = new Roll(`1d20 + ${val}`); await r.evaluate({async:true});
        await r.toMessage({ speaker:speak(), flavor:`Salvación: ${key}` });
        break;
      }
      case "roll-ability": {
        const a = btn.dataset.key;
        const bonus = Number(actor.system?.abilities?.[a]?.bonus ?? 0);
        const r = new Roll(`1d20 + ${bonus}`); await r.evaluate({async:true});
        await r.toMessage({ speaker:speak(), flavor:`Chequeo de ${a.toUpperCase()}` });
        break;
      }
      case "roll-skill": {
        const s = btn.dataset.key;
        const abil = actor.system?.skills?.[s]?.ability || "int";
        const ranks = Number(actor.system?.skills?.[s]?.ranks || 0);
        const ab = Number(actor.system?.abilities?.[abil]?.bonus || 0);
        const r = new Roll(`1d20 + ${ab} + ${ranks}`); await r.evaluate({async:true});
        await r.toMessage({ speaker:speak(), flavor:`Habilidad: ${s}` });
        break;
      }
      case "validate-aura": {
        const a = actor.system?.nen?.aura || {max:0, ofensiva:0, defensiva:0};
        const tot = Number(a.ofensiva||0) + Number(a.defensiva||0);
        const max = Number(a.max||0);
        if (tot>max) ui.notifications?.warn(`Of(${a.ofensiva}) + Def(${a.defensiva}) = ${tot} > Máx(${max})`);
        else ui.notifications?.info("Distribución válida.");
        break;
      }
      case "attack-weapon": {
        const idIt = btn.dataset.id; const w = actor.items.get(idIt); if (!w) return;
        const abil = w.system?.ability || "fue";
        const skill= w.system?.skill   || "atletismo";
        const ranks= Number(actor.system?.skills?.[skill]?.ranks || 0);
        const ab   = Number(actor.system?.abilities?.[abil]?.bonus || 0);
        const atk  = Number(w.system?.attack?.bonus || 0);
        const r = new Roll(`1d20 + ${ab} + ${ranks} + ${atk}`); await r.evaluate({async:true});
        await r.toMessage({ speaker:speak(), flavor:`Ataque con ${w.name}` });
        break;
      }
      case "damage-weapon": {
        const idIt = btn.dataset.id; const w = actor.items.get(idIt); if (!w) return;
        const abil = w.system?.ability || "fue";
        const ab   = Number(actor.system?.abilities?.[abil]?.bonus || 0);
        const aof  = Number(actor.system?.nen?.aura?.ofensiva || 0);
        const formula = (w.system?.damage?.formula || "1d6").replace("@abilBonus", `${ab}`).replace("@auraOff", `${aof}`);
        const r = new Roll(formula); await r.evaluate({async:true});
        await r.toMessage({ speaker:speak(), flavor:`Daño de ${w.name}` });
        break;
      }
      case "roll-hatsu": {
        const idIt = btn.dataset.id; const it = actor.items.get(idIt); if (!it) return;
        const vol = Number(actor.system?.derived?.voluntad || 0);
        const lvl = Number(actor.system?.details?.level || 1);
        const exp = 1 + [4,8,12,16,20].filter(t => lvl >= t).length;
        const r = new Roll(`1d20 + ${vol} + ${exp}`); await r.evaluate({async:true});
        await r.toMessage({ speaker:speak(), flavor:`Hatsu: ${it.name}` });
        break;
      }
    }
  });
});
