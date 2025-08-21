export const HXH = {};

HXH.ROLL_MODES = {
  D20: "d20",
  D100: "d100"
};

// Helpers
export function abilityLabel(key) {
  const map = {
    int: "Inteligencia",
    per: "Percepción",
    str: "Fuerza",
    agi: "Agilidad",
    con: "Constitución",
    cha: "Carisma"
  };
  return map[key] ?? key;
}

export function skillLabel(doc, key) {
  return doc.system?.skills?.[key]?.label ?? key;
}

export function calcHatsuCost(hatsu) {
  const base = Number(hatsu.system?.pc?.base ?? 0);
  const mods = Array.isArray(hatsu.system?.pc?.mods) ? hatSUClamp(hatsu.system.pc.mods).reduce((a,b)=>a+Number(b.value||0),0) : 0;
  return base + mods;
}

function hatSUClamp(mods){
  // sanitize
  return mods.map(m => ({ label: String(m.label||""), value: Number(m.value||0) }));
}
