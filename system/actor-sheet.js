const { HandlebarsApplicationMixin } = foundry.applications.api;

export class HxHActorSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["hxh-1-8b", "sheet", "actor"],
      width: 740,
      height: 720
    });
  }

  get template() {
    return "systems/hxh-1-8b/templates/sheets/actor/character-sheet.hbs";
  }

  async _prepareContext(_options) {
    const context = await super._prepareContext(_options);
    context.actor = this.actor;
    context.system = this.actor.system;
    context.items = Array.from(this.actor.items);
    context.editable = this.isEditable;
    context.owner = this.document?.isOwner ?? true;
    return context;
  }

  activateListeners(element) {
    super.activateListeners(element);
    if (!this.isEditable) return;

    element.querySelectorAll("[data-action='roll-skill']").forEach(btn => {
      btn.addEventListener("click", ev => this._rollSkill(ev));
    });

    element.querySelectorAll("[data-action='toggle-hatsu']").forEach(btn => {
      btn.addEventListener("click", ev => this._toggleHatsu(ev));
    });
  }

  async _rollSkill(ev) {
    const key = ev.currentTarget.dataset.skill;
    const sk = this.actor.system.skills?.[key];
    const abilKey = sk?.ability ?? "int";
    const abil = Number(this.actor.system.abilities?.[abilKey]?.value ?? 0);
    const rank = Number(sk?.rank ?? 0);
    const rollMode = game.settings.get("hxh-1-8b", "rollMode");

    if (rollMode === "d20") {
      const roll = await (new Roll(`1d20 + ${abil} + ${rank}`)).evaluate({ async: true });
      const flavor = game.i18n.format("HXH.RollFlavor.Skill", { skill: sk?.label ?? key });
      roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this.actor }), flavor });
    } else {
      const target = Math.max(1, 50 + (abil * 5) + (rank * 5));
      const roll = await (new Roll(`1d100`)).evaluate({ async: true });
      const success = roll.total <= target;
      const flavor = `${game.i18n.format("HXH.RollFlavor.Skill", { skill: sk?.label ?? key })} | Objetivo: ${target} → ${success ? "ÉXITO" : "FALLO"}`;
      roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this.actor }), flavor });
    }
  }

  async _toggleHatsu(ev) {
    const id = ev.currentTarget.dataset.id;
    const item = this.actor.items.get(id);
    if (!item) return;

    const enable = !item.system.enabled;
    if (enable) {
      const cost = this._calcHatsuCost(item);
      const used = (this.actor.system.nen.puntos.usados ?? 0) + cost;
      const total = (this.actor.system.nen.puntos.total ?? 0);
      if (used > total) {
        ui.notifications?.warn(game.i18n.format("HXH.Prompt.PCExceeded", { used, total }));
        return;
      }
    }
    await item.update({ "system.enabled": enable });

    const msg = enable
      ? game.i18n.format("HXH.Chat.HatsuActivated", { name: item.name, cost: this._calcHatsuCost(item) })
      : game.i18n.format("HXH.Chat.HatsuDeactivated", { name: item.name });

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `<p>${msg}</p>`
    });
  }

  _calcHatsuCost(item) {
    const base = Number(item.system?.pc?.base ?? 0);
    const mods = Array.isArray(item.system?.pc?.mods) ? item.system.pc.mods.reduce((a, b) => a + Number(b.value || 0), 0) : 0;
    return base + mods;
  }
}
