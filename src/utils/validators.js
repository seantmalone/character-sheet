const CURRENT_SCHEMA_VERSION = 1
const REQUIRED_TOP_LEVEL = ['schemaVersion','id','meta','abilityScores','proficiencies',
  'hp','deathSaves','combat','currency','equipment','attacks','spells',
  'features','conditions','biography','customSpells','settings']

export function validateCharacterImport(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, error: 'File does not contain a valid character object.' }
  }
  for (const key of REQUIRED_TOP_LEVEL) {
    if (!(key in data)) {
      return { valid: false, error: `Missing required field: ${key}` }
    }
  }
  if (!data.meta?.characterName) {
    return { valid: false, error: 'Character must have a name.' }
  }
  const warnings = []
  if (data.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    warnings.push('schema-version-mismatch')
  }
  return { valid: true, warnings }
}

export function withDefaults(data) {
  // Fill missing optional fields with safe defaults for schema-mismatched imports
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    ...data,
    settings: { advancedMode: false, abilityScoreMethod: 'standard-array', ...data.settings },
    combat: { acFormula: 'unarmored', acOverride: null, speed: 30, initiative: null,
      equippedArmorId: null, equippedShield: false, ...data.combat },
    attacks: data.attacks ?? [],
    customSpells: data.customSpells ?? [],
    biography: { personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',
      age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:'', ...data.biography },
  }
}
