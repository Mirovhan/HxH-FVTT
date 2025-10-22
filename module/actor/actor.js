export class HxHActor extends Actor {
  prepareDerivedData() {
    const data = this.system ?? {};
    const S = (k) => Number(getProperty(data, k) ?? 0);
    const max = Math.max;

    const FU = S("stats.fuerza.bono");
    const DE = S("stats.destreza.bono");
    const CO = S("stats.constitucion.bono");
    const IN = S("stats.inteligencia.bono");
    const PE = S("stats.percepcion.bono");
    const CA = S("stats.carisma.bono");
    const nivel = Math.max(1, Number(data.nivel || 1));
    const exp   = Number(data.experticia || 0);

    const vidaBase = 10 + (nivel * 5) + (Number(data.stats?.constitucion?.valor||0) * 5);
    const energiaBase = (nivel * 2) + (CO * 3);

    const durableCount = (data.dotes?.lista || []).filter(d => (d?.name||"").toLowerCase().includes("durable")).length;
    const vidaBonusDurable = 10 * exp * durableCount;

    data.vida = data.vida || {};
    data.vida.total = vidaBase + vidaBonusDurable;
    data.vida.actual = Math.min(data.vida.actual || data.vida.total, data.vida.total);
    data.vida.bonusDurable = vidaBonusDurable;

    data.energia = data.energia || {};
    data.energia.total = energiaBase;
    data.energia.actual = Math.min(data.energia.actual || data.energia.total, data.energia.total);

    data.salvaciones = data.salvaciones || {};
    data.salvaciones.fortaleza = data.salvaciones.fortaleza || {};
    data.salvaciones.reflejos  = data.salvaciones.reflejos  || {};
    data.salvaciones.voluntad  = data.salvaciones.voluntad  || {};

    data.salvaciones.fortaleza.total = max(FU, CO) + S("salvaciones.fortaleza.bonoEspecial");
    data.salvaciones.reflejos.total  = max(DE, PE) + S("salvaciones.reflejos.bonoEspecial");
    data.salvaciones.voluntad.total  = max(IN, CA) + S("salvaciones.voluntad.bonoEspecial");

    const discKeys = ["diseno","criaturas","historia","tecnologia","medicina","mundo"];
    data.disciplinas = data.disciplinas || {};
    for (const k of discKeys) {
      const base = S(`disciplinas.${k}.origen`) + S(`disciplinas.${k}.rangos`) + S(`disciplinas.${k}.especial`);
      if (!data.disciplinas[k]) data.disciplinas[k] = {};
      data.disciplinas[k].totalD = base + DE;
      data.disciplinas[k].totalI = base + IN;
      data.disciplinas[k].totalC = base + CA;
    }
  }

  rollDisciplina(nombre, canal="D") {
    const d = this.system?.disciplinas?.[nombre];
    if (!d) return;
    const tot = canal==="D" ? d.totalD : canal==="I" ? d.totalI : d.totalC;
    const formula = `${d.dado || "d4"} + ${tot||0}`;
    return (new Roll(formula)).roll({async:false}).toMessage({
      speaker: ChatMessage.getSpeaker({actor: this}),
      flavor: `Disciplina: ${nombre} (${canal})`
    });
  }

  rollAtaqueByIndex(index=0) {
    const arma = (this.system?.armas||[])[index];
    if (!arma) return;
    const statKey = arma?.stat?.key || "fuerza";
    const statVal = Number(getProperty(this.system, `stats.${statKey}.valor`) || 0);
    const statBono = Number(getProperty(this.system, `stats.${statKey}.bono`) || 0);
    const prec = `1d20 + ${Number(this.system?.experticia||0)} + ${statBono} + ${Number(arma.precision||0)}`;
    const dano = `${arma.dado||"d6"} + ${statVal}`;
    const r1 = (new Roll(prec)).roll({async:false});
    const r2 = (new Roll(dano)).roll({async:false});
    return ChatMessage.create({
      speaker: ChatMessage.getSpeaker({actor: this}),
      content: `<b>${arma.nombre||"Ataque"}</b><br>Precisión: ${r1.total}<br>Daño: ${r2.total}<br><small>${arma.efectos||""}</small>`
    });
  }
}