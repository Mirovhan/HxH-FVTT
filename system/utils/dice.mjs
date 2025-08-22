
import { HXHLog } from "./logger.mjs";

export function abilBonus(actor, key) {
  const b = Number(actor.system?.abilities?.[key]?.bonus ?? 0);
  return Number.isFinite(b) ? b : 0;
}

export function skillRanks(actor, key) {
  return Number(actor.system?.skills?.[key]?.ranks ?? 0);
}

export function rollD20({actor, label, ability, ranks=0, extra=0, adv=0}) {
  const ab = abilBonus(actor, ability);
  const formula = `1d20 + ${ab} + ${ranks} + ${extra}`;
  const roll = new Roll(formula);
  if (adv === 1) roll.terms[0].options = {advantage: true};
  if (adv === -1) roll.terms[0].options = {disadvantage: true};
  return roll;
}

export async function sendRollMessage(roll, {speaker, flavor}) {
  try {
    await roll.evaluate({async: true});
    await roll.toMessage({ speaker, flavor });
  } catch (e) {
    HXHLog.error("Fallo al publicar tirada:", e);
  }
}
