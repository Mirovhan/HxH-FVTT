export class HxHActor extends Actor {
  prepareDerivedData() {
    const data = this.system ?? {};
    const S = (k) => Number(getProperty(data, k) ?? 0);
    const FU=S("stats.fuerza.bono"), DE=S("stats.destreza.bono"), CO=S("stats.constitucion.bono"),
          IN=S("stats.inteligencia.bono"), PE=S("stats.percepcion.bono"), CA=S("stats.carisma.bono");
    const nivel = Math.max(1, Number(data.nivel || 1));
    const exp   = Number(data.experticia || 0);
    const vidaBase = 10 + (nivel * 5) + (Number(data.stats?.constitucion?.valor||0) * 5);
    const energiaBase = (nivel * 2) + (CO * 3);
    const durableCount = (data.dotes?.lista || []).filter(d => (d?.name||"").toLowerCase().includes("durable")).length;
    const vidaBonusDurable = 10 * exp * durableCount;
    data.vida = data.vida || {}; data.vida.total = vidaBase + vidaBonusDurable;
    data.vida.actual = Math.min(data.vida.actual || data.vida.total, data.vida.total);
    data.vida.bonusDurable = vidaBonusDurable;
    data.energia = data.energia || {}; data.energia.total = energiaBase;
    data.energia.actual = Math.min(data.energia.actual || data.energia.total, data.energia.total);
    data.salvaciones = data.salvaciones || {};
    for (const k of ["fortaleza","reflejos","voluntad"]) data.salvaciones[k] = data.salvaciones[k] || {};
    data.salvaciones.fortaleza.total = Math.max(FU, CO) + S("salvaciones.fortaleza.bonoEspecial");
    data.salvaciones.reflejos.total  = Math.max(DE, PE) + S("salvaciones.reflejos.bonoEspecial");
    data.salvaciones.voluntad.total  = Math.max(IN, CA) + S("salvaciones.voluntad.bonoEspecial");
    data.habilidadesNaturales = (data.habilidadesNaturales||[]).map(h => ({...h, total:Number(h.origen||0)+Number(h.rangos||0)+Number(h.extra||0)}));
    data.disciplinas = data.disciplinas || {};
    for (const k of ["diseno","criaturas","historia","tecnologia","medicina","mundo"]) {
      const base = S(`disciplinas.${k}.origen`) + S(`disciplinas.${k}.rangos`) + S(`disciplinas.${k}.especial`);
      data.disciplinas[k] = data.disciplinas[k] || {};
      data.disciplinas[k].totalD = base + DE; data.disciplinas[k].totalI = base + IN; data.disciplinas[k].totalC = base + CA;
    }
    const evBase = Number(data.evasiones?.base || 10);
    const evRef = data.salvaciones.reflejos.total || 0;
    const evArmor = (data.evasiones?.armaduras||[]).reduce((a,b)=>a+Number(b.valor||0),0);
    data.evasiones = data.evasiones || {}; data.evasiones.total = evBase + evRef + evArmor;
  }
  async rollStat(statKey){ const bono=Number(getProperty(this.system,`stats.${statKey}.bono`)||0);
    const roll = await (new Roll(`1d20 + ${bono}`)).evaluate({async:true});
    return roll.toMessage({speaker:ChatMessage.getSpeaker({actor:this}),flavor:`Atributo: ${statKey}`});}
  async rollHabilidad(i=0){ const h=(this.system?.habilidadesNaturales||[])[i]; if(!h)return;
    const roll = await (new Roll(`1d20 + ${Number(h.total||0)}`)).evaluate({async:true});
    return roll.toMessage({speaker:ChatMessage.getSpeaker({actor:this}),flavor:`Habilidad: ${h.nombre}`});}
  async rollSalvacion(k){ const tot=Number(getProperty(this.system,`salvaciones.${k}.total`)||0);
    const roll = await (new Roll(`1d20 + ${tot}`)).evaluate({async:true});
    return roll.toMessage({speaker:ChatMessage.getSpeaker({actor:this}),flavor:`Salvación: ${k}`});}
  async rollDisciplina(n, canal="D"){ const d=this.system?.disciplinas?.[n]; if(!d)return;
    const tot=canal==="D"?d.totalD:canal==="I"?d.totalI:d.totalC; const dice=d.dado||"1d4";
    const roll = await (new Roll(`${dice} + ${tot||0}`)).evaluate({async:true});
    return roll.toMessage({speaker:ChatMessage.getSpeaker({actor:this}),flavor:`Disciplina: ${n} (${canal})`});}
  async rollAtaqueByIndex(i=0){ const a=(this.system?.armas||[])[i]; if(!a)return;
    const k=a?.stat?.key||"fuerza"; const val=Number(getProperty(this.system,`stats.${k}.valor`)||0);
    const bono=Number(getProperty(this.system,`stats.${k}.bono`)||0);
    const r1 = await (new Roll(`1d20 + ${Number(this.system?.experticia||0)} + ${bono} + ${Number(a.precision||0)}`)).evaluate({async:true});
    const r2 = await (new Roll(`${a.dado||"1d6"} + ${val}`)).evaluate({async:true});
    return ChatMessage.create({speaker:ChatMessage.getSpeaker({actor:this}),content:`<b>${a.nombre||"Ataque"}</b><br>Precisión: ${r1.total}<br>Daño: ${r2.total}<br><small>${a.efectos||""}</small>`});}
}