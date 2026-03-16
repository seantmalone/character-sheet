import { describe, it, expect } from 'vitest'
import { validateCharacterImport } from '../../utils/validators'

const minimalValid = {
  schemaVersion: 1,
  id: 'abc',
  meta: { characterName: 'Torm', level: 1, xp: 0, race: 'human', class: 'fighter',
    background: 'soldier', alignment: 'Lawful Good', inspiration: false,
    playerName: '', subrace: null, secondaryClass: null },
  abilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  proficiencies: { savingThrows: [], skills: [], expertise: [], tools: [], languages: [], armor: [], weapons: [] },
  hp: { max: 10, current: 10, temp: 0, hitDiceTotal: 1, hitDiceRemaining: 1 },
  deathSaves: { successes: 0, failures: 0 },
  combat: { acFormula: 'unarmored', acOverride: null, speed: 30, initiative: null, equippedArmorId: null, equippedShield: false },
  currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
  equipment: [],
  attacks: [],
  spells: { ability: null, slots: {1:{max:0,used:0},2:{max:0,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}}, prepared: [], known: [], arcaneRecoveryUsed: false },
  features: [],
  conditions: { blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false },
  biography: { personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:'' },
  customSpells: [],
  settings: { advancedMode: false, abilityScoreMethod: 'standard-array' },
}

describe('validateCharacterImport', () => {
  it('accepts a valid character', () => {
    expect(validateCharacterImport(minimalValid)).toEqual({ valid: true, warnings: [] })
  })
  it('rejects non-objects', () => {
    expect(validateCharacterImport(null).valid).toBe(false)
    expect(validateCharacterImport('string').valid).toBe(false)
  })
  it('rejects missing required top-level fields', () => {
    const { meta: _m, ...noMeta } = minimalValid
    expect(validateCharacterImport(noMeta).valid).toBe(false)
  })
  it('rejects missing characterName', () => {
    const bad = { ...minimalValid, meta: { ...minimalValid.meta, characterName: undefined } }
    expect(validateCharacterImport(bad).valid).toBe(false)
  })
  it('warns on schema version mismatch', () => {
    const future = { ...minimalValid, schemaVersion: 99 }
    const result = validateCharacterImport(future)
    expect(result.valid).toBe(true)
    expect(result.warnings).toContain('schema-version-mismatch')
  })
})
