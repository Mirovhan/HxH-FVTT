
const { HandlebarsApplicationMixin } = foundry.applications.api;
export class HXHActorSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    classes: ["hxh-1-8b","hxh-actor-sheet","sheet","actor"],
    position: { width: 860, height: "auto" },
    window: { title: "Hunter × Hunter", resizable: true, minimizable: true }
  };
  static PARTS = { sheet: { template: "systems/hxh-1-8b/templates/actor/actor.hbs" } };
}
