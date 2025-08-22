import { HXHLog } from "../utils/logger.mjs";
const { HandlebarsApplicationMixin } = foundry.applications.api;

export class HXHActorSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
  get id() { return `hxh-actor-${this.document?.id ?? "unknown"}`; }

  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    classes: ["hxh-1-8b","hxh-actor-sheet","sheet","actor"],
    window: { title: "HXH" }
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
    ctx.derived = {
      fortaleza: Math.max(B("fue"), B("con")),
      reflejos:  Math.max(B("des"), B("per")),
      voluntad:  Math.max(B("int"), B("car"))
    };
    ctx.resources = {
      vidaMax:    10 + 5*lvl + 5*V("con"),
      energiaMax: 2*lvl + 3*B("con")
    };
    ctx.ranksMax = 2*experticia;

    const aura = sys?.nen?.aura ?? {max:0, ofensiva:0, defensiva:0};
    ctx.auraWarn = (Number(aura?.ofensiva||0) + Number(aura?.defensiva||0)) > Number(aura?.max||0);

    ctx.weapons   = this.document.items.filter(i => i.type === "weapon");
    ctx.armors    = this.document.items.filter(i => i.type === "armor");
    ctx.hatsus    = this.document.items.filter(i => i.type === "hatsu");
    ctx.equipment = this.document.items.filter(i => i.type === "equipment");

    return ctx;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.addEventListener("click", HXHLog.safe(async (ev) => {
      // Tabs
      const tabA = ev.target.closest(".tabs .item[data-tab]");
      if (tabA) { ev.preventDefault(); this._showTab(html, tabA.dataset.tab); return; }

      // Any button with data-action
      const btn = ev.target.closest("[data-action]");
      if (!btn) return;
      ev.preventDefault();

      const action = btn.dataset.action;
      const speak = () => ChatMessage.getSpeaker({ actor: this.document });

      switch (action) {
        case "roll-skill": {
          const key   = btn.dataset.key;
          const abil  = btn.dataset.abil;
          const ranks = Number(this.document.system?.skills?.[key ]?.ranks || 0);
          const ab    = Number(this.document.system?.abilities?.[abil]?.bonus || 0);
          const roll  = new Roll(`1d20 + ${ab} + ${ranks}`);
          await roll.evaluate({async:true});
          await roll.toMessage({ speaker: speak(), flavor: `Skill: ${key}` });
          break;
        }
        case "roll-save": {
          const map = {
            fortaleza: Number(this.document.system?.derived?.fortaleza || 0),
            reflejos:  Number(this.document.system?.derived?.reflejos  || 0),
            voluntad:  Number(this.document.system?.derived?.voluntad  || 0)
          };
          const save = btn.dataset.save;
          const roll = new Roll(`1d20 + ${map[save] || 0}`);
          await roll.evaluate({async:true});
          await roll.toMessage({ speaker: speak(), flavor: `Salvación: ${save}` });
          break;
        }
        case "roll-ability": {
          const abil = btn.dataset.abil;
          const ab   = Number(this.document.system?.abilities?.[abil]?.bonus || 0);
          const roll = new Roll(`1d20 + ${ab}`);
          await roll.evaluate({async:true});
          await roll.toMessage({ speaker: speak(), flavor: `Chequeo de ${abil.toUpperCase()}` });
          break;
        }
        case "attack-weapon": {
          const id    = btn.dataset.id;
          const w     = this.document.items.get(id); if (!w) return;
          const abil  = w.system?.ability || "fue";
          const skill = w.system?.skill   || "atletismo";
          const ranks = Number(this.document.system?.skills?.[skill]?.ranks || 0);
          const ab    = Number(this.document.system?.abilities?.[abil]?.bonus || 0);
          const atk   = Number(w.system?.attack?.bonus || 0);
          const roll  = new Roll(`1d20 + ${ab} + ${ranks} + ${atk}`);
          await roll.evaluate({async:true});
          await roll.toMessage({ speaker: speak(), flavor: `Ataque con ${w.name}` });
          break;
        }
        case "damage-weapon": {
          const id   = btn.dataset.id;
          const w    = this.document.items.get(id); if (!w) return;
          const abil = w.system?.ability || "fue";
          const ab   = Number(this.document.system?.abilities?.[abil]?.bonus || 0);
          const aof  = Number(this.document.system?.nen?.aura?.ofensiva || 0);
          const formula = (w.system?.damage?.formula || "1d6")
            .replace("@abilBonus", `${ab}`)
            .replace("@auraOff", `${aof}`);
          const roll = new Roll(formula);
          await roll.evaluate({async:true});
          await roll.toMessage({ speaker: speak(), flavor: `Daño de ${w.name}` });
          break;
        }
        case "roll-hatsu": {
          const id  = btn.dataset.id;
          const it  = this.document.items.get(id); if (!it) return;
          const vol = Number(this.document.system?.derived?.voluntad || 0);
          const lvl = Number(this.document.system?.details?.level || 1);
          const thresholds = [4,8,12,16,20];
          const exp = 1 + thresholds.filter(t => lvl >= t).length;
          const roll = new Roll(`1d20 + ${vol} + ${exp}`);
          await roll.evaluate({async:true});
          await roll.toMessage({ speaker: speak(), flavor: `Hatsu: ${it.name}` });
          break;
        }
        case "validate-aura": {
          const max = Number(this.document.system?.nen?.aura?.max || 0);
          const of  = Number(this.document.system?.nen?.aura?.ofensiva || 0);
          const df  = Number(this.document.system?.nen?.aura?.defensiva || 0);
          const tot = of + df;
          if (tot > max) ui.notifications?.warn(`La suma de Aura (${tot}) excede el máximo (${max}).`);
          else ui.notifications?.info("Distribución de aura válida.");
          break;
        }
        case "toggle-hatsu": {
          const id = btn.dataset.id;
          const item = this.document.items.get(id); if (!item) return;
          const enable = !item.system.enabled;
          const base = Number(item.system?.pc?.base || 0);
          const mods = (item.system?.pc?.mods || []).reduce((a,m)=> a + Number(m.value||0), 0);
          const need = base + mods;
          const total  = Number(this.document.system?.nen?.pc?.total || 0);
          const usados = Number(this.document.system?.nen?.pc?.usados || 0);
          const avail = total - usados;

          if (enable && need > avail) { ui.notifications?.warn(`No hay PC suficientes: necesitas ${need}, disponibles ${avail}`); return; }

          await item.update({ "system.enabled": enable });
          await this.document.update({ "system.nen.pc.usados": Math.max(0, usados + (enable ? need : -need)) });

          ChatMessage.create({ speaker: speak(), content: `<p>${enable ? "Hatsu activado" : "Hatsu desactivado"}: ${item.name}${enable?` (PC ${need})`:""}</p>` });
          break;
        }
      }
    }, "delegated-click"));

    this._showTab(html, "summary");
  }

  _showTab(root, tab) {
    root.querySelectorAll(".tabs .item").forEach(a => a.classList.toggle("active", a.dataset.tab === tab));
    root.querySelectorAll(".tab-content .tab").forEach(p => p.classList.toggle("active", p.dataset.tab === tab));
  }
}
