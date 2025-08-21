const { HandlebarsApplicationMixin } = foundry.applications.api;

export class HxHItemSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {
  static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
    classes: ["hxh-1-8b", "sheet", "item"],
    width: 620,
    height: 600
  });
}

export class HxHHatsuSheet extends HxHItemSheet {
  static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
    template: "systems/hxh-1-8b/templates/sheets/item/hatsu-sheet.hbs"
  });

  activateListeners(element) {
    super.activateListeners(element);

    element.querySelectorAll("[data-action='add-mod']").forEach(btn => {
      btn.addEventListener("click", async () => {
        const mods = Array.isArray(this.item.system.pc.mods) ? this.item.system.pc.mods : [];
        mods.push({ label: "", value: 0 });
        await this.item.update({ "system.pc.mods": mods });
      });
    });

    element.querySelectorAll("[data-action='remove-mod']").forEach(btn => {
      btn.addEventListener("click", async ev => {
        const idx = Number(ev.currentTarget.dataset.idx);
        const mods = Array.isArray(this.item.system.pc.mods) ? this.item.system.pc.mods : [];
        mods.splice(idx, 1);
        await this.item.update({ "system.pc.mods": mods });
      });
    });
  }
}
