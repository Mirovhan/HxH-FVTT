const { HandlebarsApplicationMixin } = foundry.applications.api;

export class HXHItemSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {
  static DEFAULT_OPTIONS = { ...super.DEFAULT_OPTIONS, classes: ["hxh-1-8b","hxh-item-sheet"] };
  static PARTS = { sheet: { template: "systems/hxh-1-8b/templates/item/item.hbs" } };
}
export class HXHWeaponSheet extends HXHItemSheet {
  static PARTS = { sheet: { template: "systems/hxh-1-8b/templates/item/weapon.hbs" } };
}
export class HXHArmorSheet extends HXHItemSheet {
  static PARTS = { sheet: { template: "systems/hxh-1-8b/templates/item/armor.hbs" } };
}
export class HXHHatsuSheet extends HXHItemSheet {
  static PARTS = { sheet: { template: "systems/hxh-1-8b/templates/item/hatsu.hbs" } };
}
