import { HXHLog } from "../utils/logger.mjs";
const { HandlebarsApplicationMixin } = foundry.applications.api;

export class HXHActorSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
  get id() { return `hxh-actor-${this.document?.id ?? "unknown"}`; }

  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    classes: ["hxh-1-8b","hxh-actor-sheet","sheet","actor"],
    position: { width: 860, height: "auto" },
    window: { title: "Hunter × Hunter", resizable: true, minimizable: true }
  };

  static PARTS = {
    sheet: { template: "systems/hxh-1-8b/templates/actor/actor.hbs" }
  };

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const sys = this.document.system ?? {};
    const lvl = Number(sys?.details?.level ?? 1);
    const thresholds = [4,8,12,16,20];
    const experticia = 1 + thresholds.filter(t => lvl >= t).length;

    const B = k => Number(sys?.abilities?.[k]?.bonus ?? 0);
    const V = k => Number(sys?.abilities?.[k]?.value ?? 0);

    ctx.experticia = experticia;
    ctx.derivedCalc = {
      fortaleza: Math.max(B("fue"), B("con")),
      reflejos:  Math.max(B("des"), B("per")),
      voluntad:  Math.max(B("int"), B("car"))
    };
    ctx.resourcesCalc = {
      vidaMax:    10 + 5*lvl + 5*V("con"),
      energiaMax: 2*lvl + 3*B("con")
    };

    ctx.weapons   = this.document.items.filter(i => i.type === "weapon");
    ctx.armors    = this.document.items.filter(i => i.type === "armor");
    ctx.hatsus    = this.document.items.filter(i => i.type === "hatsu");
    ctx.equipment = this.document.items.filter(i => i.type === "equipment");

    return ctx;
  }

  activateListeners(html) {
    super.activateListeners(html);
    const root = (this.element instanceof HTMLElement ? this.element : html) || html;
    try { console.log("HXH listeners bound", this.id, root); } catch {}

    root.addEventListener("change", HXHLog.safe(async (ev) => {
      const el = ev.target.closest("input,select,textarea");
      if (!el || !el.name) return;
      let v;
      if (el.type === "checkbox") v = el.checked;
      else if (el.type === "number") v = Number(el.value ?? 0);
      else v = el.value;
      await this.document.update({ [el.name]: v });
    }, "persist-change"));

    root.addEventListener("click", HXHLog.safe(async (ev) => {
      const btn = ev.target.closest("[data-action]");
      if (!btn) return;
      ev.preventDefault();
      const action = btn.dataset.action;
      const speak = () => ChatMessage.getSpeaker({ actor: this.document });

      switch (action) {
        case "roll-save": {
          const key = btn.dataset.key;
          const val = Number(this.document.system?.derived?.[key] ?? 0) || 0;
          const roll = new Roll(`1d20 + ${val}`); await roll.evaluate({async:true});
          await roll.toMessage({speaker: speak(), flavor:`Salvación: ${key}`});
          break;
        }
        case "roll-ability": {
          const a = btn.dataset.key;
          const bonus = Number(this.document.system?.abilities?.[a]?.bonus ?? 0);
          const roll = new Roll(`1d20 + ${bonus}`); await roll.evaluate({async:true});
          await roll.toMessage({speaker: speak(), flavor:`Chequeo de ${a.toUpperCase()}`});
          break;
        }
        case "roll-skill": {
          const s = btn.dataset.key;
          const abil = this.document.system?.skills?.[s]?.ability || "int";
          const ranks = Number(this.document.system?.skills?.[s]?.ranks || 0);
          const ab = Number(this.document.system?.abilities?.[abil]?.bonus || 0);
          const roll = new Roll(`1d20 + ${ab} + ${ranks}`); await roll.evaluate({async:true});
          await roll.toMessage({speaker: speak(), flavor:`Habilidad: ${s}`});
          break;
        }
        case "validate-aura": {
          const a = this.document.system?.nen?.aura || {max:0, ofensiva:0, defensiva:0};
          const tot = Number(a.ofensiva||0) + Number(a.defensiva||0);
          const max = Number(a.max||0);
          if (tot>max) ui.notifications?.warn(`Of(${a.ofensiva}) + Def(${a.defensiva}) = ${tot} > Máx(${max})`);
          else ui.notifications?.info("Distribución válida.");
          break;
        }
        case "attack-weapon": {
          const id = btn.dataset.id; const w = this.document.items.get(id); if (!w) return;
          const abil = w.system?.ability || "fue";
          const skill= w.system?.skill   || "atletismo";
          const ranks= Number(this.document.system?.skills?.[skill]?.ranks || 0);
          const ab   = Number(this.document.system?.abilities?.[abil]?.bonus || 0);
          const atk  = Number(w.system?.attack?.bonus || 0);
          const roll = new Roll(`1d20 + ${ab} + ${ranks} + ${atk}`);
          await roll.evaluate({async:true}); await roll.toMessage({speaker: speak(), flavor:`Ataque con ${w.name}`});
          break;
        }
        case "damage-weapon": {
          const id = btn.dataset.id; const w = this.document.items.get(id); if (!w) return;
          const abil = w.system?.ability || "fue";
          const ab   = Number(this.document.system?.abilities?.[abil]?.bonus || 0);
          const aof  = Number(this.document.system?.nen?.aura?.ofensiva || 0);
          const formula = (w.system?.damage?.formula || "1d6").replace("@abilBonus", `${ab}`).replace("@auraOff", `${aof}`);
          const roll = new Roll(formula);
          await roll.evaluate({async:true}); await roll.toMessage({speaker: speak(), flavor:`Daño de ${w.name}`});
          break;
        }
        case "roll-hatsu": {
          const id = btn.dataset.id; const it = this.document.items.get(id); if (!it) return;
          const vol = Number(this.document.system?.derived?.voluntad || 0);
          const lvl = Number(this.document.system?.details?.level || 1);
          const thresholds = [4,8,12,16,20];
          const exp = 1 + thresholds.filter(t => lvl >= t).length;
          const roll = new Roll(`1d20 + ${vol} + ${exp}`);
          await roll.evaluate({async:true}); await roll.toMessage({speaker: speak(), flavor:`Hatsu: ${it.name}`});
          break;
        }
      }
    }, "click-actions"));
  }
}
