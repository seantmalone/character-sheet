import { describe, it, expect } from 'vitest'
import {
  getAbilityModifier,
  getProficiencyBonus,
  getSkillBonus,
  getSpellSaveDC,
  getSpellAttackBonus,
  getPassiveScore,
  getCarryingCapacity,
  getSneakAttackDice,
  getHitDiceAverage,
  getXpThreshold,
  getAC,
} from '../../utils/calculations'

describe('getAbilityModifier', () => {
  it('returns -5 for score 1', () => expect(getAbilityModifier(1)).toBe(-5))
  it('returns 0 for score 10', () => expect(getAbilityModifier(10)).toBe(0))
  it('returns 0 for score 11', () => expect(getAbilityModifier(11)).toBe(0))
  it('returns 2 for score 15', () => expect(getAbilityModifier(15)).toBe(2))
  it('returns 5 for score 20', () => expect(getAbilityModifier(20)).toBe(5))
})

describe('getProficiencyBonus', () => {
  it('returns 2 for levels 1-4', () => {
    expect(getProficiencyBonus(1)).toBe(2)
    expect(getProficiencyBonus(4)).toBe(2)
  })
  it('returns 3 for levels 5-8', () => {
    expect(getProficiencyBonus(5)).toBe(3)
    expect(getProficiencyBonus(8)).toBe(3)
  })
  it('returns 6 for levels 17-20', () => {
    expect(getProficiencyBonus(17)).toBe(6)
    expect(getProficiencyBonus(20)).toBe(6)
  })
})

describe('getSkillBonus', () => {
  it('returns ability modifier for non-proficient skill', () =>
    expect(getSkillBonus({ abilityMod: 2, proficient: false, expert: false, profBonus: 3 })).toBe(2))
  it('adds proficiency bonus when proficient', () =>
    expect(getSkillBonus({ abilityMod: 2, proficient: true, expert: false, profBonus: 3 })).toBe(5))
  it('doubles proficiency bonus for expertise', () =>
    expect(getSkillBonus({ abilityMod: 2, proficient: true, expert: true, profBonus: 3 })).toBe(8))
})

describe('getSpellSaveDC', () => {
  it('returns 8 + prof + ability mod', () =>
    expect(getSpellSaveDC({ profBonus: 3, abilityMod: 4 })).toBe(15))
})

describe('getSpellAttackBonus', () => {
  it('returns prof + ability mod', () =>
    expect(getSpellAttackBonus({ profBonus: 3, abilityMod: 4 })).toBe(7))
})

describe('getPassiveScore', () => {
  it('returns 10 + skill bonus', () =>
    expect(getPassiveScore(3)).toBe(13))
})

describe('getCarryingCapacity', () => {
  it('returns STR score * 15', () =>
    expect(getCarryingCapacity(10)).toBe(150))
})

describe('getSneakAttackDice', () => {
  it('returns 1 for rogue level 1', () => expect(getSneakAttackDice(1)).toBe(1))
  it('returns 1 for rogue level 2', () => expect(getSneakAttackDice(2)).toBe(1))
  it('returns 2 for rogue level 3', () => expect(getSneakAttackDice(3)).toBe(2))
  it('returns 10 for rogue level 20', () => expect(getSneakAttackDice(20)).toBe(10))
})

describe('getHitDiceAverage', () => {
  it('returns 4 for d6', () => expect(getHitDiceAverage(6)).toBe(4))
  it('returns 5 for d8', () => expect(getHitDiceAverage(8)).toBe(5))
  it('returns 6 for d10', () => expect(getHitDiceAverage(10)).toBe(6))
  it('returns 7 for d12', () => expect(getHitDiceAverage(12)).toBe(7))
})

describe('getXpThreshold', () => {
  it('returns 0 for level 1', () => expect(getXpThreshold(1)).toBe(0))
  it('returns 300 for level 2', () => expect(getXpThreshold(2)).toBe(300))
  it('returns 355000 for level 20', () => expect(getXpThreshold(20)).toBe(355000))
})

describe('getAC', () => {
  it('calculates unarmored AC as 10 + DEX mod', () =>
    expect(getAC({ formula: 'unarmored', dexMod: 3, armorBase: null, shield: false })).toBe(13))
  it('caps medium armor DEX bonus at +2', () =>
    expect(getAC({ formula: 'medium', dexMod: 5, armorBase: 14, shield: false })).toBe(16))
  it('adds 2 for shield', () =>
    expect(getAC({ formula: 'unarmored', dexMod: 2, armorBase: null, shield: true })).toBe(14))
  it('ignores DEX for heavy armor', () =>
    expect(getAC({ formula: 'heavy', dexMod: 5, armorBase: 18, shield: false })).toBe(18))
  it('returns acOverride for custom formula', () =>
    expect(getAC({ formula: 'custom', dexMod: 5, armorBase: null, shield: false, acOverride: 16 })).toBe(16))
  it('computes mage armor as 13 + DEX mod', () =>
    expect(getAC({ formula: 'mage-armor', dexMod: 3, armorBase: null, shield: false })).toBe(16))
})
