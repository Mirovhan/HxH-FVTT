const { HandlebarsApplicationMixin } = foundry.applications.api;

export class HxHItemSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {
  static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
    classes: ["hxh-1-8b", "sheet", "item"],
    width: 620,
    height: 600
  });

  static PARTS = {
    body: { template: "systems/hxh-1-8b/templates/sheets/item/hatsu-sheet.hbs" }
  };
}

export class HxHHatsuSheet extends HxHItemSheet {}
