export class HxHActor extends Actor {
  prepareDerivedData() {
    super.prepareDerivedData();
    const sys = this.system;

    // Derivados simples y PC (Puntos de Complejidad)
    const lvl = Number(sys.details?.level ?? 1);
    const intv = Number(sys.abilities?.int?.value ?? 0);
    const perv = Number(sys.abilities?.per?.value ?? 0);

    // Fórmula editable por setting: por defecto PC = Nivel + INT + floor(PER/2)
    const perHalf = Math.floor(perv / 2);
    const totalPC = Math.max(0, lvl + intv + perHalf);

    sys.nen = sys.nen || {};
    sys.nen.puntos = sys.nen.puntos || { total: 0, usados: 0 };
    sys.nen.puntos.total = totalPC;

    // Sumatoria de Hatsus activos
    let used = 0;
    for (const it of this.items) {
      if (it.type === "hatsu" && it.system?.enabled) {
        const base = Number(it.system?.pc?.base ?? 0);
        const mods = Array.isArray(it.system?.pc?.mods) ? it.system.pc.mods.reduce((a,b)=>a+Number(b.value||0),0) : 0;
        used += base + mods;
      }
    }
    sys.nen.puntos.usados = used;
  }
}
