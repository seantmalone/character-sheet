import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import Sheet from '../../pages/Sheet/Sheet'
import App from '../../App'

export const CHAR = {
  id: 'c1', schemaVersion: 1,
  meta: {
    characterName: 'Aria', race: 'elf', class: 'wizard', level: 3,
    xp: 900,
    inspiration: false, playerName: 'Sean', subrace: 'high-elf',
    background: 'sage', alignment: 'CG', secondaryClass: null,
  },
  abilityScores: { str: 8, dex: 16, con: 12, int: 17, wis: 13, cha: 10 },
  proficiencies: {
    savingThrows: ['int', 'wis'], skills: ['arcana', 'history'],
    expertise: [], tools: [], languages: ['common', 'elvish'],
    armor: [], weapons: [],
  },
  hp: { max: 16, current: 5, temp: 0, hitDiceTotal: 3, hitDiceRemaining: 3 },
  deathSaves: { successes: 0, failures: 0 },
  combat: {
    acFormula: 'light', acOverride: null, speed: 30, initiative: null,
    equippedArmorId: 'armor-leather',
    equippedShield: false,
  },
  currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
  equipment: [
    {
      id: 'armor-leather', name: 'Leather Armor', quantity: 1, weight: 10,
      equipped: true, notes: '',
      damage: null, damageType: null, weaponProperties: [], weaponCategory: null,
      range: null, armorClass: 11, armorType: 'light',
    },
  ],
  attacks: [
    {
      id: 'a1', name: 'Dagger', equipmentId: null,
      attackAbility: 'dex', attackBonusOverride: null,
      damage: '1d4', damageType: 'piercing', damageAbility: 'dex', notes: '',
    },
  ],
  spells: {
    ability: 'int',
    slots: {
      1: { max: 4, used: 1 },
      2: { max: 2, used: 0 },
      3: { max: 0, used: 0 }, 4: { max: 0, used: 0 }, 5: { max: 0, used: 0 },
      6: { max: 0, used: 0 }, 7: { max: 0, used: 0 }, 8: { max: 0, used: 0 },
      9: { max: 0, used: 0 },
    },
    prepared: ['magic-missile'],
    known: ['magic-missile', 'shield'],
    arcaneRecoveryUsed: false,
  },
  features: [
    {
      id: 'f1', name: 'Arcane Recovery', source: 'class',
      description: 'Recover spell slots on short rest.',
      uses: 1, maxUses: 1, recharge: 'short-rest',
    },
  ],
  conditions: {
    blinded: false, charmed: false, deafened: false, exhaustion: 0,
    frightened: false, grappled: false, incapacitated: false, invisible: false,
    paralyzed: false, petrified: false, poisoned: false, prone: false,
    restrained: false, stunned: false, unconscious: false,
  },
  biography: {
    personalityTraits: 'I use polysyllabic words.', ideals: 'Knowledge',
    bonds: 'My spellbook', flaws: 'Distracted', appearance: 'Pale',
    backstory: 'Former apprentice', age: '120', height: "5'4\"",
    weight: '108 lb', eyes: 'Blue', skin: 'Fair', hair: 'Silver', notes: '',
  },
  customSpells: [],
  settings: { advancedMode: false, abilityScoreMethod: 'standard-array' },
}

export const CHAR_CHAIN = {
  ...CHAR,
  combat: { ...CHAR.combat, acFormula: 'unarmored', equippedArmorId: null },
  equipment: [
    ...CHAR.equipment,
    {
      id: 'armor-chain', name: 'Chain Mail', quantity: 1, weight: 55,
      equipped: false, notes: '',
      damage: null, damageType: null, weaponProperties: [], weaponCategory: null,
      range: null, armorClass: 16, armorType: 'heavy',
    },
  ],
}

export function renderApp(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  )
}

export function renderSheet(character) {
  useCharacterStore.setState({ characters: [character] })
  return render(
    <MemoryRouter initialEntries={[`/character/${character.id}`]}>
      <Routes>
        <Route path="/character/:id" element={<Sheet />} />
        <Route path="/" element={<div />} />
      </Routes>
    </MemoryRouter>
  )
}
