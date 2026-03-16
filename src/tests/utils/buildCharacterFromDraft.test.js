import { describe, it, expect } from 'vitest'
import { buildCharacterFromDraft } from '../../utils/buildCharacterFromDraft'

const BASE_DRAFT = {
  meta: {
    characterName: 'Aria', playerName: '', alignment: 'Chaotic Good',
    race: 'elf', subrace: 'high-elf', class: 'wizard', background: 'sage',
    level: 1, xp: 0, inspiration: false, secondaryClass: null,
  },
  abilityScores: { str: 8, dex: 14, con: 12, int: 15, wis: 13, cha: 10 },
  classSkillChoices: ['arcana', 'history'],
  settings: { advancedMode: false, abilityScoreMethod: 'standard-array' },
}

describe('buildCharacterFromDraft', () => {
  it('applies racial ability bonuses on top of base scores', () => {
    const char = buildCharacterFromDraft(BASE_DRAFT)
    // High Elf: DEX +2, INT +1
    expect(char.abilityScores.dex).toBe(16)
    expect(char.abilityScores.int).toBe(16)
    expect(char.abilityScores.str).toBe(8) // no bonus
  })

  it('computes max HP as hitDie + CON modifier, minimum 1', () => {
    // Wizard d6, CON 12 → mod +1 → 6 + 1 = 7
    const char = buildCharacterFromDraft(BASE_DRAFT)
    expect(char.hp.max).toBe(7)
    expect(char.hp.current).toBe(7)
  })

  it('sets CON modifier so low it would floor at 1', () => {
    const draft = {
      ...BASE_DRAFT,
      meta: { ...BASE_DRAFT.meta, class: 'wizard' },
      abilityScores: { ...BASE_DRAFT.abilityScores, con: 1 }, // mod -5 → 6-5=1
    }
    const char = buildCharacterFromDraft(draft)
    expect(char.hp.max).toBeGreaterThanOrEqual(1)
  })

  it('merges class and background skill proficiencies', () => {
    const char = buildCharacterFromDraft(BASE_DRAFT)
    // classSkillChoices: arcana, history; Sage background: arcana, history (deduped)
    expect(char.proficiencies.skills).toContain('arcana')
    expect(char.proficiencies.skills).toContain('history')
  })

  it('assigns a unique id', () => {
    const a = buildCharacterFromDraft(BASE_DRAFT)
    const b = buildCharacterFromDraft(BASE_DRAFT)
    expect(a.id).not.toBe(b.id)
  })
})
