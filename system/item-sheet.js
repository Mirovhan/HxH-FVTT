export class HxHItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["hxh-1-8b", "sheet", "item"],
      width: 620,
      height: 600,
      tabs: [{ navSelector: ".tabs", contentSelector: ".sheet-body", initial: "main" }]
    });
  }
}

export class HxHHatsuSheet extends HxHItemSheet {
  get template() {
    return "systems/hxh-1-8b/templates/sheets/item/hatsu-sheet.hbs";
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find("[data-action='add-mod']").on("click", async ev => {
      const mods = Array.isArray(this.item.system.pc.mods) ? this.item.system.pc.mods : [];
      mods.push({ label: "", value: 0 });
      await this.item.update({ "system.pc.mods": mods });
    });
    html.find("[data-action='remove-mod']").on("click", async ev => {
      const idx = Number(ev.currentTarget.dataset.idx);
      const mods = Array.isArray(this.item.system.pc.mods) ? this.item.system.pc.mods : [];
      mods.splice(idx, 1);
      await this.item.update({ "system.pc.mods": mods });
    });
  }
}
