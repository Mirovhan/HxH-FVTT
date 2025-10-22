export class HxHCharacterSheet extends ActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["hxh", "sheet", "actor"],
      width: 820, height: 720,
      tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "stats"}]
    });
  }
  get template() { return "systems/hxh-fvtt/templates/actor/character-sheet.hbs"; }

  activateListeners(html) {
    super.activateListeners(html);
    html.find("[data-action='roll-disc']").on("click", ev => {
      const el = ev.currentTarget;
      const nombre = el.dataset.key;
      const canal  = el.dataset.canal;
      this.actor.rollDisciplina(nombre, canal);
    });

    html.find("[data-action='roll-ataque']").on("click", ev => {
      const idx = Number(ev.currentTarget.dataset.index||0);
      this.actor.rollAtaqueByIndex(idx);
    });

    html.find("[data-action='add-arma']").on("click", async ev => {
      const armas = duplicate(this.actor.system.armas || []);
      armas.push({nombre:"",dado:"d6",stat:{key:"fuerza"},precision:0,efectos:""});
      await this.actor.update({"system.armas": armas});
    });
  }
}