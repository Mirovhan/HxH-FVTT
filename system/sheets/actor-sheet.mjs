
const { HandlebarsApplicationMixin } = foundry.applications.api;

export class HXHActorSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    classes: ["hxh-1-8b","hxh-actor-sheet","sheet","actor"],
    position: { width: 1080, height: "auto" },
    window: { title: "Hoja HXH", resizable: true, minimizable: true }
  };

  static PARTS = { sheet: { template: "systems/hxh-1-8b/templates/actor/identity.hbs" } };

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const sys = this.document.system ?? {};

    // Origins
    const OR = CONFIG.HXH.ORIGINS || {};
    ctx.originTypes = Object.keys(OR);
    const selType = sys?.identity?.origin?.type || ctx.originTypes[0] || "";
    const selSub  = sys?.identity?.origin?.subtype || Object.keys(OR[selType]||{})[0] || "";
    ctx.originSelected = { type: selType, subtype: selSub };
    ctx.originSubtypes = Object.keys(OR[selType]||{});
    ctx.originBonuses  = (OR[selType] && OR[selType][selSub] && OR[selType][selSub].attr) || {};

    // Attributes
    const base = sys?.attributes?.base || {};
    const trained = sys?.attributes?.trained || {};
    const totals = {}; const bonus = {};
    const table = CONFIG.HXH.BONUS_TABLE || [];
    for (const key of ["fue","des","con","per","int","car"]) {
      const b = Number(base[key]||0);
      const o = Number((ctx.originBonuses[key]||0));
      const t = Number(trained[key]||0);
      const val = b + o + t;
      totals[key] = val;
      let bn = 0;
      if (table[val] != null) bn = Number(table[val]);
      else bn = Math.floor((val-10)/3);
      bonus[key] = bn;
    }
    ctx.attr = { base, trained, totals, bonus };

    // Level / XP / Experticia
    const xp = Number(sys?.details?.xp || 0);
    const levels = CONFIG.HXH.XP_LEVELS || [];
    let level = Number(sys?.details?.level || 1);
    for (const step of levels) if (xp >= step.xp) level = step.level;
    ctx.level = level;
    let next = levels.find(s => s.xp > xp);
    ctx.xpToNext = next ? (next.xp - xp) : 0;
    const hits = CONFIG.HXH.EXPERTICIA_HITOS || [];
    ctx.experticiaSugerida = 1 + hits.filter(h => level >= h).length;

    // Trainable points
    ctx.points = {
      current: Number(sys?.attributes?.points?.current || 0),
      max:     Number(sys?.attributes?.points?.max || 0)
    };

    return ctx;
  }
}
