
export const HXH = {};

HXH.ROLL_MODES = {
  D20: "d20",
  D100: "d100"
};

Handlebars.registerHelper("eq", (a, b) => a === b);
Handlebars.registerHelper("sumMods", mods => {
  if (!Array.isArray(mods)) return 0;
  return mods.reduce((acc, m) => acc + Number(m.value || 0), 0);
});
