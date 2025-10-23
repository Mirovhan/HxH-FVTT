
export class HxHCharacterSheet extends ActorSheet {
  static get defaultOptions(){
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes:["hxh","sheet","actor"], width:1200, height:900, submitOnChange:true
    });
  }
  get template(){ return "systems/hxh-fvtt/templates/actor/character-sheet.hbs"; }

  activateListeners(html){ super.activateListeners(html);
    // Rolls
    html.on("click","[data-action='roll-stat']", ev => this.actor.rollStat(ev.currentTarget.dataset.key));
    html.on("click","[data-action='roll-hab']", ev => this.actor.rollHabilidad(Number(ev.currentTarget.dataset.index||0)));
    html.on("click","[data-action='roll-salv']", ev => this.actor.rollSalvacion(ev.currentTarget.dataset.key));
    html.on("click","[data-action='roll-disc']", ev => { const el=ev.currentTarget; this.actor.rollDisciplina(el.dataset.key, el.dataset.canal); });
    html.on("click","[data-action='roll-ataque']", ev => this.actor.rollAtaqueByIndex(Number(ev.currentTarget.dataset.index||0)));

    // Repeating controls
    html.on("click","[data-action='add-arma']", async e => {
      const arr = foundry.utils.duplicate(this.actor.system.armas || []);
      arr.push({nombre:"",dado:"1d6",stat:{key:"fuerza"},precision:0,efectos:"",tipo:"Contundente",extremidad:"Brazo Derecho"});
      await this.actor.update({"system.armas":arr});
    });
    html.on("click","[data-action='del-arma']", async e => {
      const i = Number(e.currentTarget.dataset.index||0);
      const arr = foundry.utils.duplicate(this.actor.system.armas || []);
      arr.splice(i,1); await this.actor.update({"system.armas":arr});
    });

    html.on("click","[data-action='add-armadura']", async e => {
      const arr = foundry.utils.duplicate(this.actor.system.evasiones.armaduras || []);
      arr.push({nombre:"",v:0,sd:0,d:0,valor:0});
      await this.actor.update({"system.evasiones.armaduras":arr});
    });
    html.on("click","[data-action='del-armadura']", async e => {
      const i = Number(e.currentTarget.dataset.index||0);
      const arr = foundry.utils.duplicate(this.actor.system.evasiones.armaduras || []);
      arr.splice(i,1);
      await this.actor.update({"system.evasiones.armaduras":arr});
    });

    html.on("click","[data-action='add-acc']", async e => {
      const arr = foundry.utils.duplicate(this.actor.system.accesorios || []);
      arr.push({nombre:"",nota:"",cargas:""});
      await this.actor.update({"system.accesorios":arr});
    });
    html.on("click","[data-action='del-acc']", async e => {
      const i = Number(e.currentTarget.dataset.index||0);
      const arr = foundry.utils.duplicate(this.actor.system.accesorios || []);
      arr.splice(i,1); await this.actor.update({"system.accesorios":arr});
    });

    html.on("click","[data-action='add-item']", async e => {
      const arr = foundry.utils.duplicate(this.actor.system.inventario.mochila || []);
      arr.push({item:"",cantidad:1});
      await this.actor.update({"system.inventario.mochila":arr});
    });
    html.on("click","[data-action='del-item']", async e => {
      const i = Number(e.currentTarget.dataset.index||0);
      const arr = foundry.utils.duplicate(this.actor.system.inventario.mochila || []);
      arr.splice(i,1); await this.actor.update({"system.inventario.mochila":arr});
    });
  }
}
