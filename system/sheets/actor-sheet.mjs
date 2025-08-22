const { HandlebarsApplicationMixin } = foundry.applications.api;

import { HXHLog } from "../utils/logger.mjs";
import { rollD20, sendRollMessage, abilBonus, skillRanks } from "../utils/dice.mjs";

export class HXHActorSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "hxh-actor",
    classes: ["hxh-1-8b", "hxh-actor-sheet", "sheet", "actor"],
    window: { title: "HXH" }
  };

  static PARTS = {
    sheet: { template: "systems/hxh-1-8b/templates/actor/actor.hbs" }
  };

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const sys = this.document.system;
    const lvl = Number(sys?.details?.level ?? 1);

    // Experticia por nivel: base 1 + niveles 4/8/12/16/20
    const thresholds = [4,8,12,16,20];
    const add = thresholds.filter(t => lvl >= t).length;
    const experticia = 1 + add;

    // Derivadas a partir de bonos (se editan desde la hoja según tabla del manual)
    const B = k => Number(sys?.abilities?.[k]?.bonus ?? 0);
    const V = k => Number(sys?.abilities?.[k]?.value ?? 0);

    const fort = Math.max(B("fue"), B("con"));
    const refl = Math.max(B("des"), B("per"));
    const vol  = Math.max(B("int"), B("car"));

    // Recursos
    const vidaMax = 10 + 5*lvl + 5*V("con");
    const energiaMax = 2*lvl + 3*B("con");

    // Límite de rangos por habilidad: 2*experticia
    const ranksMax = 2*experticia;

    // Asegurar aura no exceda
    const aura = sys?.nen?.aura ?? {max: 0, ofensiva: 0, defensiva: 0};
    const auraTotal = Number(aura.ofensiva||0) + Number(aura.defensiva||0);
    ctx.auraWarn = auraTotal > Number(aura.max||0);

    ctx.experticia = experticia;
    ctx.derived = { fortaleza: fort, reflejos: refl, voluntad: vol };
    ctx.resources = { vidaMax, energiaMax };
    ctx.ranksMax = ranksMax;

    // Items clasificados
    ctx.weapons = this.document.items.filter(i => i.type === "weapon");
    ctx.armors = this.document.items.filter(i => i.type === "armor");
    ctx.hatsus = this.document.items.filter(i => i.type === "hatsu");
    ctx.equipment = this.document.items.filter(i => i.type === "equipment");
    return ctx;
  }

  /** Instancia Tabs y listeners */
  async _renderInner(data, options) {
    const html = await super._renderInner(data, options);
    try {
      this._tabs = [new foundry.applications.ux.Tabs(
        { navSelector: ".tabs[data-group='primary']", contentSelector: ".tab-content", initial: "summary" }, { app: this }
      )];
    } catch (e) {
      HXHLog.warn("Tabs fallback", e);
      // Fallback: mostrar summary
      html.querySelectorAll(".tab").forEach(el => el.style.display="none");
      const first = html.querySelector('.tab[data-tab="summary"]');
      if (first) first.style.display = "block";
    }
    return html;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Tiradas de habilidades
    html.querySelectorAll("[data-action='roll-skill']").forEach(btn => {
      btn.addEventListener("click", HXHLog.safe(async ev => {
        const key = ev.currentTarget.dataset.key;
        const abil = ev.currentTarget.dataset.abil;
        const ranks = skillRanks(this.document, key);
        const adv = Number(ev.currentTarget.dataset.adv || 0);
        const roll = rollD20({actor: this.document, label: key, ability: abil, ranks, adv});
        await sendRollMessage(roll, {
          speaker: ChatMessage.getSpeaker({actor: this.document}),
          flavor: game.i18n.format("HXH.Chat.SkillRoll", {skill: key})
        });
      }, "roll-skill"));
    });

    // Ataque con arma
    html.querySelectorAll("[data-action='attack-weapon']").forEach(btn => {
      btn.addEventListener("click", HXHLog.safe(async ev => {
        const id = ev.currentTarget.dataset.id;
        const weapon = this.document.items.get(id);
        if (!weapon) return;
        const sys = weapon.system;
        const abil = sys.ability || "fue";
        const ranks = skillRanks(this.document, sys.skill || "atletismo");
        const bonus = Number(sys.attack?.bonus || 0);
        const adv = Number(sys.attack?.adv || 0);

        // aura ofensiva como bono a daño y crítico extendido (simplificado)
        const auraOf = Number(this.document.system?.nen?.aura?.ofensiva || 0);
        const roll = rollD20({actor: this.document, ability: abil, ranks, extra: bonus, adv});
        await roll.evaluate({async:true});
        const total = roll.total;
        const flavor = game.i18n.format("HXH.Chat.AttackRoll", {name: weapon.name});

        await roll.toMessage({speaker: ChatMessage.getSpeaker({actor:this.document}), flavor});

        // Daño
        const abilB = abilBonus(this.document, abil);
        let formula = (sys.damage?.formula || "1d6")           .replace("@abilBonus", `${abilB}`)           .replace("@auraOff", `${auraOf}`);
        try {
          const dmg = await (new Roll(formula)).evaluate({async:true});
          await dmg.toMessage({speaker: ChatMessage.getSpeaker({actor:this.document}), flavor: game.i18n.localize("HXH.Damage") + ` (${weapon.name})`});
        } catch (e) {
          HXHLog.error("Error en tirada de daño", e);
        }
      }, "attack-weapon"));
    });

    // Activar/Desactivar Hatsu
    html.querySelectorAll("[data-action='toggle-hatsu']").forEach(btn => {
      btn.addEventListener("click", HXHLog.safe(async ev => {
        const id = ev.currentTarget.dataset.id;
        const item = this.document.items.get(id);
        if (!item) return;
        const enable = !item.system.enabled;
        const base = Number(item.system?.pc?.base || 0);
        const mods = (item.system?.pc?.mods || []).reduce((a,m)=>a + Number(m.value||0), 0);
        const need = base + mods;
        const total = Number(this.document.system?.nen?.pc?.total || 0);
        const usados = Number(this.document.system?.nen?.pc?.usados || 0);
        const avail = total - usados;
        if (enable && need > avail) {
          ui.notifications?.warn(game.i18n.format("HXH.Errors.OverPC", {need, avail}));
          return;
        }
        await item.update({"system.enabled": enable});
        await this.document.update({
          "system.nen.pc.usados": Math.max(0, usados + (enable?need:-need))
        });
        const msg = enable
          ? game.i18n.format("HXH.Chat.HatsuActivated", {name:item.name, pc: need})
          : game.i18n.format("HXH.Chat.HatsuDeactivated", {name:item.name});
        ChatMessage.create({speaker: ChatMessage.getSpeaker({actor:this.document}), content:`<p>${msg}</p>`});
      }, "toggle-hatsu"));
    });

    // Validar distribución de Aura
    html.querySelectorAll("[data-action='validate-aura']").forEach(btn => {
      btn.addEventListener("click", HXHLog.safe(async ev => {
        const max = Number(this.document.system?.nen?.aura?.max || 0);
        const of = Number(this.document.system?.nen?.aura?.ofensiva || 0);
        const df = Number(this.document.system?.nen?.aura?.defensiva || 0);
        const tot = of + df;
        if (tot > max) {
          ui.notifications?.warn(game.i18n.format("HXH.Errors.AuraOverflow", {total: tot, max}));
        } else {
          ui.notifications?.info("Distribución de aura válida.");
        }
      }, "validate-aura"));
    });
  }
}
