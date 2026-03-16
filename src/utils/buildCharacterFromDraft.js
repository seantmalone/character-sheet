import races from '../data/races.json'
import classes from '../data/classes.json'
import backgrounds from '../data/backgrounds.json'
import { getAbilityModifier } from './calculations'
import { generateId } from './ids'
import { withDefaults } from './validators'

function pick(arr) { return (arr?.length) ? arr[Math.floor(Math.random() * arr.length)] : '' }

export function buildCharacterFromDraft(draft) {
  const { meta, abilityScores, classSkillChoices, settings } = draft

  const raceData = races.find(r => r.id === meta.race) || {}
  const subraceData = (raceData.subraces || []).find(s => s.id === meta.subrace) || {}
  const classData = classes.find(c => c.id === meta.class) || {}
  const bgData = backgrounds.find(b => b.id === meta.background) || {}

  // Ability bonuses: sum race + subrace bonuses
  const raceBonuses = raceData.abilityScoreIncreases || {}
  const subraceBonuses = subraceData.abilityScoreIncreases || {}
  const allBonuses = Object.fromEntries(
    [...new Set([...Object.keys(raceBonuses), ...Object.keys(subraceBonuses)])].map(k => [
      k, (raceBonuses[k] || 0) + (subraceBonuses[k] || 0)
    ])
  )
  const finalScores = Object.fromEntries(
    Object.entries(abilityScores).map(([k, v]) => [k, (v || 10) + (allBonuses[k] || 0)])
  )

  // HP: hitDie + CON mod, min 1
  const conMod = getAbilityModifier(finalScores.con)
  const maxHp = Math.max(1, (classData.hitDie || 6) + conMod)

  // Proficiencies
  const bgSkills = bgData.skillProficiencies || []
  const allSkills = [...new Set([...(classSkillChoices || []), ...bgSkills])]

  // Spell slot progression at level 1
  const slots = {}
  const level1Slots = classData.spellSlotProgression?.['1'] || {}
  for (let i = 1; i <= 9; i++) {
    const max = level1Slots[String(i)] ?? 0
    slots[i] = { max, used: 0 }
  }

  // Features at level 1
  const classFeatures = (classData.features || [])
    .filter(f => f.level === 1)
    .map(f => ({
      id: generateId(), name: f.name, source: 'class',
      description: f.description,
      uses: f.uses ?? null, maxUses: f.uses ?? null,
      recharge: f.recharge ?? null,
    }))
  const bgFeatureEntry = bgData.feature
    ? [{ id: generateId(), name: bgData.feature.name, source: 'background', description: bgData.feature.description, uses: null, maxUses: null, recharge: null }]
    : []

  // Speed: subrace overrides race
  const speed = subraceData.speed ?? raceData.speed ?? 30

  return withDefaults({
    schemaVersion: 1,
    id: generateId(),
    meta: { ...meta, level: 1, xp: 0, inspiration: false },
    abilityScores: finalScores,
    proficiencies: {
      savingThrows: classData.savingThrowProficiencies || [],
      skills: allSkills,
      expertise: [],
      tools: bgData.toolProficiencies || [],
      languages: ['common', ...(raceData.languages || []).filter(l => l !== 'common')],
      armor: classData.armorProficiencies || [],
      weapons: classData.weaponProficiencies || [],
    },
    hp: { max: maxHp, current: maxHp, temp: 0, hitDiceTotal: 1, hitDiceRemaining: 1 },
    deathSaves: { successes: 0, failures: 0 },
    combat: {
      acFormula: 'unarmored', acOverride: null,
      speed, initiative: null, equippedArmorId: null, equippedShield: false,
    },
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    equipment: [], attacks: [],
    spells: {
      ability: classData.spellcastingAbility || null,
      slots, prepared: [], known: [], arcaneRecoveryUsed: false,
    },
    features: [...classFeatures, ...bgFeatureEntry],
    conditions: {
      blinded: false, charmed: false, deafened: false, exhaustion: 0,
      frightened: false, grappled: false, incapacitated: false, invisible: false,
      paralyzed: false, petrified: false, poisoned: false, prone: false,
      restrained: false, stunned: false, unconscious: false,
    },
    biography: {
      personalityTraits: pick(bgData.personalityTraits),
      ideals: pick(bgData.ideals),
      bonds: pick(bgData.bonds),
      flaws: pick(bgData.flaws),
      appearance: '', backstory: '', age: '', height: '', weight: '',
      eyes: '', skin: '', hair: '', notes: '',
    },
    customSpells: [],
    settings,
  })
}
