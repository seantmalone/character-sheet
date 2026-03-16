import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useCharacterStore } from '../../store/characters'

function buildCharacter(overrides = {}) {
  return {
    schemaVersion: 1, id: 'test-1',
    meta: { characterName: 'Aria', level: 1, xp: 0, race: 'elf', class: 'wizard',
      background: 'sage', alignment: 'Chaotic Good', inspiration: false,
      playerName: '', subrace: 'high-elf', secondaryClass: null },
    abilityScores: { str: 8, dex: 14, con: 12, int: 16, wis: 13, cha: 10 },
    proficiencies: { savingThrows: ['int','wis'], skills: ['arcana','history'], expertise: [], tools: [], languages: ['common','elvish'], armor: [], weapons: ['dagger','dart','sling','quarterstaff','light-crossbow'] },
    hp: { max: 8, current: 8, temp: 0, hitDiceTotal: 1, hitDiceRemaining: 1 },
    deathSaves: { successes: 0, failures: 0 },
    combat: { acFormula: 'unarmored', acOverride: null, speed: 30, initiative: null, equippedArmorId: null, equippedShield: false },
    currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
    equipment: [], attacks: [],
    spells: { ability: 'int', slots: {1:{max:2,used:0},2:{max:0,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}}, prepared: [], known: ['magic-missile','shield'], arcaneRecoveryUsed: false },
    features: [], conditions: { blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false },
    biography: { personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:'' },
    customSpells: [], settings: { advancedMode: false, abilityScoreMethod: 'standard-array' },
    ...overrides,
  }
}

describe('character store', () => {
  beforeEach(() => {
    useCharacterStore.setState({ characters: [] })
  })

  it('starts with empty characters', () => {
    expect(useCharacterStore.getState().characters).toEqual([])
  })

  it('addCharacter adds a character', () => {
    const char = buildCharacter()
    act(() => useCharacterStore.getState().addCharacter(char))
    expect(useCharacterStore.getState().characters).toHaveLength(1)
    expect(useCharacterStore.getState().characters[0].id).toBe('test-1')
  })

  it('updateCharacter merges partial updates', () => {
    act(() => useCharacterStore.getState().addCharacter(buildCharacter()))
    act(() => useCharacterStore.getState().updateCharacter('test-1', { meta: { characterName: 'Aria Stormveil' } }))
    const updated = useCharacterStore.getState().characters[0]
    expect(updated.meta.characterName).toBe('Aria Stormveil')
    expect(updated.meta.level).toBe(1)
  })

  it('deleteCharacter removes character by id', () => {
    act(() => useCharacterStore.getState().addCharacter(buildCharacter()))
    act(() => useCharacterStore.getState().deleteCharacter('test-1'))
    expect(useCharacterStore.getState().characters).toHaveLength(0)
  })

  it('updateHp updates current hp and resets death saves when above 0', () => {
    act(() => useCharacterStore.getState().addCharacter(buildCharacter({ deathSaves: { successes: 2, failures: 1 } })))
    act(() => useCharacterStore.getState().updateHp('test-1', 5))
    const char = useCharacterStore.getState().characters[0]
    expect(char.hp.current).toBe(5)
    expect(char.deathSaves.successes).toBe(0)
    expect(char.deathSaves.failures).toBe(0)
  })

  it('updateHp does not reset death saves when hp stays at 0', () => {
    act(() => useCharacterStore.getState().addCharacter(buildCharacter({ deathSaves: { successes: 2, failures: 1 } })))
    act(() => useCharacterStore.getState().updateHp('test-1', 0))
    const char = useCharacterStore.getState().characters[0]
    expect(char.deathSaves.successes).toBe(2)
  })
})
