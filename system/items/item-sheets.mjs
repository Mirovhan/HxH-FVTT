const { HandlebarsApplicationMixin } = foundry.applications.api;

export class HXHItemSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {
  static DEFAULT_OPTIONS = { ...super.DEFAULT_OPTIONS, classes: ["hxh-1-8b","hxh-item-sheet","sheet","item"] };
  static PARTS = { sheet: { template: "systems/hxh-1-8b/templates/item/item.hbs" } };
}
export class HXHWeaponSheet extends HXHItemSheet {}
export class HXHArmorSheet extends HXHItemSheet {}
export class HXHHatsuSheet extends HXHItemSheet {}
