export class HxHCharacterSheet extends ActorSheet {
  static get defaultOptions(){ return mergeObject(super.defaultOptions,{classes:["hxh","sheet","actor"],width:1000,height:780});}
  get template(){ return "systems/hxh-fvtt/templates/actor/character-sheet.hbs"; }
  activateListeners(html){ super.activateListeners(html);
    html.find("[data-action='roll-disc']").on("click", ev => { const el=ev.currentTarget; this.actor.rollDisciplina(el.dataset.key, el.dataset.canal); });
    html.find("[data-action='roll-ataque']").on("click", ev => { this.actor.rollAtaqueByIndex(Number(ev.currentTarget.dataset.index||0)); });
    html.find("[data-action='add-arma']").on("click", async ev => { const armas=duplicate(this.actor.system.armas||[]); armas.push({nombre:"",dado:"1d6",stat:{key:"fuerza"},precision:0,efectos:""}); await this.actor.update({"system.armas":armas}); });
    html.find("[data-action='roll-stat']").on("click", ev => this.actor.rollStat(ev.currentTarget.dataset.key));
    html.find("[data-action='roll-hab']").on("click", ev => this.actor.rollHabilidad(Number(ev.currentTarget.dataset.index||0)));
    html.find("[data-action='roll-salv']").on("click", ev => this.actor.rollSalvacion(ev.currentTarget.dataset.key));
  }
}