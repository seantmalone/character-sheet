import { useMemo } from 'react'
import { getAbilityModifier, getProficiencyBonus, getSkillBonus,
  getSpellSaveDC, getSpellAttackBonus, getPassiveScore, getAC,
  getCarryingCapacity, getSneakAttackDice } from '../utils/calculations'
import skills from '../data/skills.json'

export function useDerivedStats(character) {
  return useMemo(() => {
    if (!character) return null

    const { abilityScores, proficiencies, combat, meta, spells } = character
    const modifiers = Object.fromEntries(
      Object.entries(abilityScores).map(([k, v]) => [k, getAbilityModifier(v)])
    )
    const profBonus = getProficiencyBonus(meta.level)

    const skillBonuses = Object.fromEntries(
      skills.map(skill => [
        skill.id,
        getSkillBonus({
          abilityMod: modifiers[skill.ability],
          proficient: proficiencies.skills.includes(skill.id),
          expert: proficiencies.expertise.includes(skill.id),
          profBonus,
        }),
      ])
    )

    const savingThrowBonuses = Object.fromEntries(
      ['str','dex','con','int','wis','cha'].map(ability => [
        ability,
        proficiencies.savingThrows.includes(ability)
          ? modifiers[ability] + profBonus
          : modifiers[ability],
      ])
    )

    const equippedArmor = character.equipment.find(
      e => e.id === combat.equippedArmorId && e.armorClass != null
    )

    const ac = getAC({
      formula: combat.acFormula,
      dexMod: modifiers.dex,
      armorBase: equippedArmor?.armorClass ?? null,
      shield: combat.equippedShield,
      acOverride: combat.acOverride,
    })

    const isSpellcaster = spells.ability != null
    const spellAbilityMod = isSpellcaster ? modifiers[spells.ability] : null

    const isRogue = meta.class === 'rogue'

    return {
      abilityModifiers: modifiers,
      proficiencyBonus: profBonus,
      skillBonuses,
      savingThrowBonuses,
      ac,
      initiative: combat.initiative ?? modifiers.dex,
      passivePerception: getPassiveScore(skillBonuses.perception),
      passiveInvestigation: getPassiveScore(skillBonuses.investigation),
      passiveInsight: getPassiveScore(skillBonuses.insight),
      carryingCapacity: getCarryingCapacity(abilityScores.str),
      spellSaveDC: isSpellcaster ? getSpellSaveDC({ profBonus, abilityMod: spellAbilityMod }) : null,
      spellAttackBonus: isSpellcaster ? getSpellAttackBonus({ profBonus, abilityMod: spellAbilityMod }) : null,
      sneakAttackDice: isRogue ? getSneakAttackDice(meta.level) : null,
    }
  }, [character])
}
