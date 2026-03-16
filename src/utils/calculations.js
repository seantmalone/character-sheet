const XP_THRESHOLDS = [0, 0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000,
  64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000]

export function getAbilityModifier(score) {
  return Math.floor((score - 10) / 2)
}

export function getProficiencyBonus(level) {
  return Math.ceil(level / 4) + 1
}

export function getSkillBonus({ abilityMod, proficient, expert, profBonus }) {
  if (expert) return abilityMod + profBonus * 2
  if (proficient) return abilityMod + profBonus
  return abilityMod
}

export function getSpellSaveDC({ profBonus, abilityMod }) {
  return 8 + profBonus + abilityMod
}

export function getSpellAttackBonus({ profBonus, abilityMod }) {
  return profBonus + abilityMod
}

export function getPassiveScore(skillBonus) {
  return 10 + skillBonus
}

export function getCarryingCapacity(strScore) {
  return strScore * 15
}

export function getSneakAttackDice(rogueLevel) {
  return Math.ceil(rogueLevel / 2)
}

export function getHitDiceAverage(hitDie) {
  return Math.floor(hitDie / 2) + 1
}

export function getXpThreshold(level) {
  return XP_THRESHOLDS[level] ?? 0
}

export function getAC({ formula, dexMod, armorBase, shield, acOverride }) {
  const shieldBonus = shield ? 2 : 0
  if (formula === 'custom') return acOverride ?? 10
  if (formula === 'unarmored') return 10 + dexMod + shieldBonus
  if (formula === 'mage-armor') return 13 + dexMod + shieldBonus  // PHB p. 256: 13 + DEX mod
  if (formula === 'light') return armorBase + dexMod + shieldBonus
  if (formula === 'medium') return armorBase + Math.min(dexMod, 2) + shieldBonus
  if (formula === 'heavy') return armorBase + shieldBonus
  return 10 + dexMod + shieldBonus
}
