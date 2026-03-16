import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDerivedStats } from '../../hooks/useDerivedStats'

const baseCharacter = {
  meta: { level: 5, class: 'rogue' },
  abilityScores: { str: 10, dex: 18, con: 14, int: 12, wis: 13, cha: 8 },
  proficiencies: { savingThrows: ['dex', 'int'], skills: ['stealth', 'perception'], expertise: ['stealth'], armor: [], weapons: ['simple'] },
  combat: { acFormula: 'unarmored', acOverride: null, equippedArmorId: null, equippedShield: false },
  equipment: [],
  spells: { ability: null },
}

describe('useDerivedStats', () => {
  it('computes ability modifiers', () => {
    const { result } = renderHook(() => useDerivedStats(baseCharacter))
    expect(result.current.abilityModifiers.dex).toBe(4)
    expect(result.current.abilityModifiers.str).toBe(0)
  })

  it('computes proficiency bonus for level 5', () => {
    const { result } = renderHook(() => useDerivedStats(baseCharacter))
    expect(result.current.proficiencyBonus).toBe(3)
  })

  it('computes skill bonus with expertise', () => {
    const { result } = renderHook(() => useDerivedStats(baseCharacter))
    // stealth: DEX mod(4) + prof*2(6) = 10
    expect(result.current.skillBonuses.stealth).toBe(10)
  })

  it('computes skill bonus without proficiency', () => {
    const { result } = renderHook(() => useDerivedStats(baseCharacter))
    // athletics: STR mod(0), no prof = 0
    expect(result.current.skillBonuses.athletics).toBe(0)
  })

  it('computes passive perception correctly', () => {
    const { result } = renderHook(() => useDerivedStats(baseCharacter))
    // perception: WIS mod(1) + prof(3) = 4; passive = 14
    expect(result.current.passivePerception).toBe(14)
  })

  it('computes AC as unarmored', () => {
    const { result } = renderHook(() => useDerivedStats(baseCharacter))
    // 10 + DEX mod(4) = 14
    expect(result.current.ac).toBe(14)
  })

  it('computes initiative as DEX modifier', () => {
    const { result } = renderHook(() => useDerivedStats(baseCharacter))
    expect(result.current.initiative).toBe(4)
  })

  it('returns null spell save DC for non-casters', () => {
    const { result } = renderHook(() => useDerivedStats(baseCharacter))
    expect(result.current.spellSaveDC).toBeNull()
  })
})
