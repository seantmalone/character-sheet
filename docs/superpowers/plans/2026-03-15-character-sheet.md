# D&D 5e Character Sheet Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully interactive D&D 5e 2014 Basic Rules character sheet web app that runs entirely in the browser using localStorage.

**Architecture:** React 18 + Vite SPA with Zustand for state (persisted to localStorage). All derived stats computed at render time from raw stored data. React Router v6 for three routes: Roster, Wizard, Sheet.

**Tech Stack:** React 18, Vite, Zustand, React Router v6, Vitest, @testing-library/react, CSS Modules

**Spec:** `docs/superpowers/specs/2026-03-15-character-sheet-design.md`

---

## Chunk 1: Project Foundation

### Task 1: Scaffold Vite + React project

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`

- [ ] Run scaffold command:
```bash
cd /Users/sean/Projects/CharacterSheet
npm create vite@latest . -- --template react
```

- [ ] Install runtime dependencies:
```bash
npm install zustand react-router-dom
```

- [ ] Install dev dependencies:
```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

- [ ] Replace `vite.config.js` content:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.js',
  },
})
```

- [ ] Create `src/tests/setup.js`:
```js
import '@testing-library/jest-dom'
```

- [ ] Create empty CSS stubs so the dev server can start (content added in Task 2):
```bash
mkdir -p src/styles
touch src/styles/tokens.css src/styles/reset.css src/styles/typography.css
```

- [ ] Replace `src/main.jsx`:
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/reset.css'
import './styles/tokens.css'
import './styles/typography.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

- [ ] Replace `src/App.jsx`:
```jsx
import { Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Roster placeholder</div>} />
      <Route path="/new" element={<div>Wizard placeholder</div>} />
      <Route path="/character/:id" element={<div>Sheet placeholder</div>} />
      <Route path="/character/:id/print" element={<div>Print placeholder</div>} />
    </Routes>
  )
}
```

- [ ] Run dev server to verify it starts:
```bash
npm run dev
```
Expected: server starts on localhost:5173, browser shows "Roster placeholder"

- [ ] Commit:
```bash
git init
git add -A
git commit -m "chore: scaffold Vite + React project with Zustand and testing setup"
```

---

### Task 2: CSS design token system

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/reset.css`, `src/styles/typography.css`

- [ ] Create `src/styles/tokens.css`:
```css
:root {
  /* Colors */
  --color-parchment: #f5f0e8;
  --color-parchment-dark: #e8e0d0;
  --color-ink: #2c1810;
  --color-ink-light: #5c3d2e;
  --color-accent: #8b1a1a;
  --color-accent-hover: #6b1414;
  --color-gold: #c8a951;
  --color-success: #2d6a2d;
  --color-warning: #8b6914;
  --color-danger: #8b1a1a;
  --color-surface: #ffffff;
  --color-surface-raised: #faf7f2;
  --color-border: #c4b89a;
  --color-border-light: #ddd5c0;
  --color-muted: #8a7a6a;
  --color-overlay: rgba(44, 24, 16, 0.5);

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* Typography */
  --font-serif: 'Georgia', 'Times New Roman', serif;
  --font-sans: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-mono: 'Courier New', monospace;
  --text-xs: 11px;
  --text-sm: 13px;
  --text-base: 15px;
  --text-md: 17px;
  --text-lg: 20px;
  --text-xl: 24px;
  --text-2xl: 32px;
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-bold: 700;

  /* Layout */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-lg: 12px;
  --shadow-sm: 0 1px 3px rgba(44,24,16,0.15);
  --shadow-md: 0 3px 8px rgba(44,24,16,0.2);
  --shadow-lg: 0 8px 24px rgba(44,24,16,0.25);
  --transition: 150ms ease;

  /* Summary bar height — referenced by sheet layout */
  --summary-bar-height: 72px;
}
```

- [ ] Create `src/styles/reset.css`:
```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--color-parchment); color: var(--color-ink); font-family: var(--font-sans); font-size: var(--text-base); line-height: 1.5; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; border: none; background: none; font: inherit; color: inherit; }
input, textarea, select { font: inherit; color: inherit; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: var(--space-xs) var(--space-sm); }
input:focus, textarea:focus, select:focus { outline: 2px solid var(--color-accent); outline-offset: 1px; }
ul, ol { list-style: none; }
img { max-width: 100%; display: block; }
```

- [ ] Create `src/styles/typography.css`:
```css
h1 { font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: var(--weight-bold); }
h2 { font-family: var(--font-serif); font-size: var(--text-xl); font-weight: var(--weight-bold); }
h3 { font-family: var(--font-serif); font-size: var(--text-lg); font-weight: var(--weight-medium); }
h4 { font-size: var(--text-md); font-weight: var(--weight-medium); }
.label { font-size: var(--text-xs); font-weight: var(--weight-medium); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-muted); }
.subtitle { font-size: var(--text-sm); color: var(--color-muted); }
```

- [ ] Commit:
```bash
git add src/styles/
git commit -m "feat: add CSS design token system"
```

---

### Task 3: Utility — calculations

**Files:**
- Create: `src/utils/calculations.js`, `src/tests/utils/calculations.test.js`

- [ ] Write the failing tests first — create `src/tests/utils/calculations.test.js`:
```js
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
```

- [ ] Run tests to confirm they all fail:
```bash
npx vitest run src/tests/utils/calculations.test.js
```
Expected: all tests fail with "Cannot find module"

- [ ] Create `src/utils/calculations.js`:
```js
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
```

- [ ] Run tests to confirm they all pass:
```bash
npx vitest run src/tests/utils/calculations.test.js
```
Expected: all 33 tests pass

- [ ] Commit:
```bash
git add src/utils/calculations.js src/tests/utils/calculations.test.js
git commit -m "feat: add calculations utility with full test coverage"
```

---

### Task 4: Utility — ids and diceRoller

**Files:**
- Create: `src/utils/ids.js`, `src/utils/diceRoller.js`, `src/tests/utils/diceRoller.test.js`

- [ ] Create `src/utils/ids.js`:
```js
export function generateId() {
  return crypto.randomUUID()
}
```

- [ ] Write failing tests — create `src/tests/utils/diceRoller.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { rollDice, parseDiceExpression } from '../../utils/diceRoller'

describe('parseDiceExpression', () => {
  it('parses "1d6" correctly', () => {
    expect(parseDiceExpression('1d6')).toEqual({ count: 1, sides: 6, modifier: 0 })
  })
  it('parses "2d8+3" correctly', () => {
    expect(parseDiceExpression('2d8+3')).toEqual({ count: 2, sides: 8, modifier: 3 })
  })
  it('parses "1d20-2" correctly', () => {
    expect(parseDiceExpression('1d20-2')).toEqual({ count: 1, sides: 20, modifier: -2 })
  })
  it('returns error for invalid expression', () => {
    expect(parseDiceExpression('banana')).toEqual({ count: 0, sides: 0, modifier: 0, error: 'Invalid dice expression' })
  })
})

describe('rollDice', () => {
  it('returns result, rolls array, and no error for valid expression', () => {
    const out = rollDice('2d6')
    expect(out.error).toBeUndefined()
    expect(out.rolls).toHaveLength(2)
    expect(out.result).toBeGreaterThanOrEqual(2)
    expect(out.result).toBeLessThanOrEqual(12)
  })
  it('applies modifier to result', () => {
    const out = rollDice('1d1+5')
    expect(out.result).toBe(6)
  })
  it('returns error for invalid expression', () => {
    const out = rollDice('banana')
    expect(out.error).toBe('Invalid dice expression')
    expect(out.result).toBeNull()
  })
})
```

- [ ] Run to confirm failure:
```bash
npx vitest run src/tests/utils/diceRoller.test.js
```
Expected: fail with "Cannot find module"

- [ ] Create `src/utils/diceRoller.js`:
```js
export function parseDiceExpression(expr) {
  const match = String(expr).trim().match(/^(\d+)d(\d+)([+-]\d+)?$/i)
  if (!match) return { count: 0, sides: 0, modifier: 0, error: 'Invalid dice expression' }
  return {
    count: parseInt(match[1], 10),
    sides: parseInt(match[2], 10),
    modifier: match[3] ? parseInt(match[3], 10) : 0,
  }
}

export function rollDice(expr) {
  const parsed = parseDiceExpression(expr)
  if (parsed.error) return { result: null, rolls: [], error: parsed.error }
  const rolls = Array.from({ length: parsed.count }, () =>
    Math.floor(Math.random() * parsed.sides) + 1
  )
  const result = rolls.reduce((a, b) => a + b, 0) + parsed.modifier
  return { result, rolls, modifier: parsed.modifier }
}
```

- [ ] Run tests to confirm they all pass:
```bash
npx vitest run src/tests/utils/diceRoller.test.js
```
Expected: all 7 tests pass

- [ ] Commit:
```bash
git add src/utils/ids.js src/utils/diceRoller.js src/tests/utils/diceRoller.test.js
git commit -m "feat: add id generator and dice roller utilities"
```

---

### Task 5: Utility — import validator

**Files:**
- Create: `src/utils/validators.js`, `src/tests/utils/validators.test.js`

- [ ] Write failing tests — create `src/tests/utils/validators.test.js`:
```js
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
```

- [ ] Run to confirm failure:
```bash
npx vitest run src/tests/utils/validators.test.js
```

- [ ] Create `src/utils/validators.js`:
```js
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
```

- [ ] Run tests to confirm they all pass:
```bash
npx vitest run src/tests/utils/validators.test.js
```
Expected: all 5 tests pass

- [ ] Commit:
```bash
git add src/utils/validators.js src/tests/utils/validators.test.js
git commit -m "feat: add import validator with schema version support"
```

---

## Chunk 2: Static Game Data + Zustand Store

### Task 6: Static game data — races, classes, backgrounds

**Files:**
- Create: `src/data/races.json`, `src/data/classes.json`, `src/data/backgrounds.json`

- [ ] Create `src/data/races.json` (Basic Rules races with subraces):
```json
[
  {
    "id": "dwarf", "name": "Dwarf", "size": "Medium", "speed": 25,
    "abilityScoreIncreases": { "str": 0, "dex": 0, "con": 2, "int": 0, "wis": 0, "cha": 0 },
    "darkvision": 60,
    "traits": [
      { "name": "Dwarven Resilience", "description": "Advantage on saving throws against poison, resistance against poison damage." },
      { "name": "Stonecunning", "description": "Double proficiency bonus on History checks related to stonework." }
    ],
    "languages": ["common", "dwarvish"],
    "subraces": [
      {
        "id": "hill-dwarf", "name": "Hill Dwarf",
        "abilityScoreIncreases": { "str": 0, "dex": 0, "con": 0, "int": 0, "wis": 1, "cha": 0 },
        "traits": [{ "name": "Dwarven Toughness", "description": "HP maximum increases by 1, and again by 1 every time you gain a level." }]
      },
      {
        "id": "mountain-dwarf", "name": "Mountain Dwarf",
        "abilityScoreIncreases": { "str": 2, "dex": 0, "con": 0, "int": 0, "wis": 0, "cha": 0 },
        "traits": [{ "name": "Dwarven Armor Training", "description": "You have proficiency with light and medium armor." }]
      }
    ]
  },
  {
    "id": "elf", "name": "Elf", "size": "Medium", "speed": 30,
    "abilityScoreIncreases": { "str": 0, "dex": 2, "con": 0, "int": 0, "wis": 0, "cha": 0 },
    "darkvision": 60,
    "traits": [
      { "name": "Fey Ancestry", "description": "Advantage on saving throws against being charmed, and magic can't put you to sleep." },
      { "name": "Keen Senses", "description": "Proficiency in Perception." },
      { "name": "Trance", "description": "Elves don't need to sleep. Instead, they meditate deeply for 4 hours a day." }
    ],
    "languages": ["common", "elvish"],
    "subraces": [
      {
        "id": "high-elf", "name": "High Elf",
        "abilityScoreIncreases": { "str": 0, "dex": 0, "con": 0, "int": 1, "wis": 0, "cha": 0 },
        "traits": [{ "name": "Cantrip", "description": "You know one cantrip of your choice from the wizard spell list." }]
      },
      {
        "id": "wood-elf", "name": "Wood Elf",
        "abilityScoreIncreases": { "str": 0, "dex": 0, "con": 0, "int": 0, "wis": 1, "cha": 0 },
        "speed": 35,
        "darkvision": null,
        "traits": [
          { "name": "Fleet of Foot", "description": "Base walking speed increases to 35 feet." },
          { "name": "Mask of the Wild", "description": "Can attempt to hide when lightly obscured by foliage, rain, snow, mist, or other natural phenomena." }
        ]
      },
      {
        "id": "dark-elf", "name": "Dark Elf (Drow)",
        "abilityScoreIncreases": { "str": 0, "dex": 0, "con": 0, "int": 0, "wis": 0, "cha": 1 },
        "speed": null,
        "darkvision": 120,
        "traits": [
          { "name": "Superior Darkvision", "description": "Darkvision range of 120 feet." },
          { "name": "Sunlight Sensitivity", "description": "Disadvantage on attack rolls and Perception checks in direct sunlight." },
          { "name": "Drow Magic", "description": "You know the dancing lights cantrip." }
        ]
      }
    ]
  },
  {
    "id": "halfling", "name": "Halfling", "size": "Small", "speed": 25,
    "abilityScoreIncreases": { "str": 0, "dex": 2, "con": 0, "int": 0, "wis": 0, "cha": 0 },
    "darkvision": null,
    "traits": [
      { "name": "Lucky", "description": "When you roll a 1 on a d20, you can reroll and must use the new roll." },
      { "name": "Brave", "description": "Advantage on saving throws against being frightened." },
      { "name": "Halfling Nimbleness", "description": "Can move through the space of any creature that is of a size larger than yours." }
    ],
    "languages": ["common", "halfling"],
    "subraces": [
      {
        "id": "lightfoot", "name": "Lightfoot Halfling",
        "abilityScoreIncreases": { "str": 0, "dex": 0, "con": 0, "int": 0, "wis": 0, "cha": 1 },
        "traits": [{ "name": "Naturally Stealthy", "description": "Can attempt to hide when obscured by a creature that is at least one size larger than you." }]
      },
      {
        "id": "stout", "name": "Stout Halfling",
        "abilityScoreIncreases": { "str": 0, "dex": 0, "con": 1, "int": 0, "wis": 0, "cha": 0 },
        "traits": [{ "name": "Stout Resilience", "description": "Advantage on saving throws against poison, resistance against poison damage." }]
      }
    ]
  },
  {
    "id": "human", "name": "Human", "size": "Medium", "speed": 30,
    "abilityScoreIncreases": { "str": 1, "dex": 1, "con": 1, "int": 1, "wis": 1, "cha": 1 },
    "darkvision": null,
    "traits": [],
    "languages": ["common"],
    "extraLanguages": 1,
    "subraces": []
  }
]
```

- [ ] Create `src/data/classes.json` (Cleric, Fighter, Rogue, Wizard with full feature lists and ASI levels):
```json
[
  {
    "id": "cleric", "name": "Cleric", "hitDie": 8,
    "spellcastingAbility": "wis",
    "savingThrowProficiencies": ["wis", "cha"],
    "armorProficiencies": ["light", "medium", "heavy", "shields"],
    "weaponProficiencies": ["simple"],
    "toolProficiencies": [],
    "skillChoices": { "count": 2, "options": ["history","insight","medicine","persuasion","religion"] },
    "asiLevels": [4, 8, 12, 16, 19],
    "spellSlotProgression": {
      "1": {"1":2}, "2": {"1":3}, "3": {"1":4,"2":2}, "4": {"1":4,"2":3},
      "5": {"1":4,"2":3,"3":2}, "6": {"1":4,"2":3,"3":3},
      "7": {"1":4,"2":3,"3":3,"4":1}, "8": {"1":4,"2":3,"3":3,"4":2},
      "9": {"1":4,"2":3,"3":3,"4":3,"5":1}, "10": {"1":4,"2":3,"3":3,"4":3,"5":2},
      "11": {"1":4,"2":3,"3":3,"4":3,"5":2,"6":1}, "12": {"1":4,"2":3,"3":3,"4":3,"5":2,"6":1},
      "13": {"1":4,"2":3,"3":3,"4":3,"5":2,"6":1,"7":1}, "14": {"1":4,"2":3,"3":3,"4":3,"5":2,"6":1,"7":1},
      "15": {"1":4,"2":3,"3":3,"4":3,"5":2,"6":1,"7":1,"8":1}, "16": {"1":4,"2":3,"3":3,"4":3,"5":2,"6":1,"7":1,"8":1},
      "17": {"1":4,"2":3,"3":3,"4":3,"5":2,"6":1,"7":1,"8":1,"9":1}, "18": {"1":4,"2":3,"3":3,"4":3,"5":3,"6":1,"7":1,"8":1,"9":1},
      "19": {"1":4,"2":3,"3":3,"4":3,"5":3,"6":1,"7":1,"8":1,"9":1}, "20": {"1":4,"2":3,"3":3,"4":3,"5":3,"6":1,"7":1,"8":1,"9":1}
    },
    "features": [
      { "level": 1, "name": "Spellcasting", "description": "You can cast cleric spells. Wisdom is your spellcasting ability.", "uses": null, "recharge": null },
      { "level": 1, "name": "Divine Domain", "description": "Choose a domain related to your deity. Your choice grants you domain spells and other features at levels 1, 2, 6, 8, and 17.", "uses": null, "recharge": null },
      { "level": 2, "name": "Channel Divinity: Turn Undead", "description": "As an action, present your holy symbol and speak a prayer censuring the undead. Each undead within 30 feet must make a Wisdom saving throw.", "uses": 1, "recharge": "short-rest" },
      { "level": 5, "name": "Destroy Undead (CR 1/2)", "description": "When an undead fails its saving throw against your Turn Undead, the creature is instantly destroyed if its CR is 1/2 or lower.", "uses": null, "recharge": null },
      { "level": 6, "name": "Channel Divinity: 2 Uses", "description": "You can use Channel Divinity twice between rests.", "uses": 2, "recharge": "short-rest" },
      { "level": 10, "name": "Divine Intervention", "description": "You can call on your deity to intervene on your behalf. Roll d100; if you roll equal to or lower than your cleric level, your deity intervenes.", "uses": 1, "recharge": "day" },
      { "level": 18, "name": "Channel Divinity: 3 Uses", "description": "You can use Channel Divinity three times between rests.", "uses": 3, "recharge": "short-rest" }
    ]
  },
  {
    "id": "fighter", "name": "Fighter", "hitDie": 10,
    "spellcastingAbility": null,
    "savingThrowProficiencies": ["str", "con"],
    "armorProficiencies": ["light", "medium", "heavy", "shields"],
    "weaponProficiencies": ["simple", "martial"],
    "toolProficiencies": [],
    "skillChoices": { "count": 2, "options": ["acrobatics","animal-handling","athletics","history","insight","intimidation","perception","survival"] },
    "asiLevels": [4, 6, 8, 12, 14, 16, 19],
    "spellSlotProgression": null,
    "features": [
      { "level": 1, "name": "Fighting Style", "description": "Choose a fighting style specialty: Archery (+2 ranged attack rolls), Defense (+1 AC in armor), Dueling (+2 damage with one-handed weapon), Great Weapon Fighting (reroll 1s and 2s on damage with two-handed weapons), Protection (impose disadvantage on attacks against adjacent allies), or Two-Weapon Fighting (add ability modifier to off-hand attacks).", "uses": null, "recharge": null },
      { "level": 1, "name": "Second Wind", "description": "As a bonus action, regain 1d10 + your fighter level HP. You can use this feature once per short or long rest.", "uses": 1, "recharge": "short-rest" },
      { "level": 2, "name": "Action Surge", "description": "On your turn, you can take one additional action. Once you use this feature, you must finish a short or long rest before you can use it again.", "uses": 1, "recharge": "short-rest" },
      { "level": 3, "name": "Martial Archetype", "description": "Choose an archetype that reflects your style and technique (Champion, Battle Master, or Eldritch Knight).", "uses": null, "recharge": null },
      { "level": 5, "name": "Extra Attack", "description": "Beginning at 5th level, you can attack twice whenever you take the Attack action.", "uses": null, "recharge": null },
      { "level": 9, "name": "Indomitable", "description": "You can reroll a saving throw that you fail. You must use the new roll. You can use this feature once between long rests.", "uses": 1, "recharge": "long-rest" }
    ]
  },
  {
    "id": "rogue", "name": "Rogue", "hitDie": 8,
    "spellcastingAbility": null,
    "savingThrowProficiencies": ["dex", "int"],
    "armorProficiencies": ["light"],
    "weaponProficiencies": ["simple", "hand-crossbow", "longsword", "rapier", "shortsword"],
    "toolProficiencies": ["thieves-tools"],
    "skillChoices": { "count": 4, "options": ["acrobatics","athletics","deception","insight","intimidation","investigation","perception","performance","persuasion","sleight-of-hand","stealth"] },
    "asiLevels": [4, 8, 10, 12, 16, 19],
    "spellSlotProgression": null,
    "features": [
      { "level": 1, "name": "Expertise", "description": "Choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check using those skills.", "uses": null, "recharge": null },
      { "level": 1, "name": "Sneak Attack", "description": "Once per turn, deal extra damage to one creature you hit with a finesse or ranged weapon if you have advantage or an ally is adjacent to the target. The extra damage increases as you gain levels.", "uses": null, "recharge": null },
      { "level": 1, "name": "Thieves' Cant", "description": "Secret mix of dialect, jargon, and code. Takes 4 times longer to convey a message in cant than normal speech.", "uses": null, "recharge": null },
      { "level": 2, "name": "Cunning Action", "description": "As a bonus action, Dash, Disengage, or Hide.", "uses": null, "recharge": null },
      { "level": 3, "name": "Roguish Archetype", "description": "Choose an archetype that reflects your character's focus (Thief, Assassin, or Arcane Trickster).", "uses": null, "recharge": null },
      { "level": 5, "name": "Uncanny Dodge", "description": "When an attacker you can see hits you with an attack, use your reaction to halve the attack's damage.", "uses": null, "recharge": null },
      { "level": 7, "name": "Evasion", "description": "When subjected to an effect that allows a DEX saving throw for half damage, take no damage on a success and only half on a failure.", "uses": null, "recharge": null }
    ]
  },
  {
    "id": "wizard", "name": "Wizard", "hitDie": 6,
    "spellcastingAbility": "int",
    "savingThrowProficiencies": ["int", "wis"],
    "armorProficiencies": [],
    "weaponProficiencies": ["dagger", "dart", "sling", "quarterstaff", "light-crossbow"],
    "toolProficiencies": [],
    "skillChoices": { "count": 2, "options": ["arcana","history","insight","investigation","medicine","religion"] },
    "asiLevels": [4, 8, 12, 16, 19],
    "spellSlotProgression": {
      "1": {"1":2}, "2": {"1":3}, "3": {"1":4,"2":2}, "4": {"1":4,"2":3},
      "5": {"1":4,"2":3,"3":2}, "6": {"1":4,"2":3,"3":3},
      "7": {"1":4,"2":3,"3":3,"4":1}, "8": {"1":4,"2":3,"3":3,"4":2},
      "9": {"1":4,"2":3,"3":3,"4":3,"5":1}, "10": {"1":4,"2":3,"3":3,"4":3,"5":2},
      "11": {"1":4,"2":3,"3":3,"4":3,"5":2,"6":1}, "12": {"1":4,"2":3,"3":3,"4":3,"5":2,"6":1},
      "13": {"1":4,"2":3,"3":3,"4":3,"5":2,"6":1,"7":1}, "14": {"1":4,"2":3,"3":3,"4":3,"5":2,"6":1,"7":1},
      "15": {"1":4,"2":3,"3":3,"4":3,"5":2,"6":1,"7":1,"8":1}, "16": {"1":4,"2":3,"3":3,"4":3,"5":2,"6":1,"7":1,"8":1},
      "17": {"1":4,"2":3,"3":3,"4":3,"5":2,"6":1,"7":1,"8":1,"9":1}, "18": {"1":4,"2":3,"3":3,"4":3,"5":3,"6":1,"7":1,"8":1,"9":1},
      "19": {"1":4,"2":3,"3":3,"4":3,"5":3,"6":1,"7":1,"8":1,"9":1}, "20": {"1":4,"2":3,"3":3,"4":3,"5":3,"6":1,"7":1,"8":1,"9":1}
    },
    "features": [
      { "level": 1, "name": "Spellcasting", "description": "You can cast wizard spells. Intelligence is your spellcasting ability. Your spellbook contains six 1st-level wizard spells.", "uses": null, "recharge": null },
      { "level": 1, "name": "Arcane Recovery", "description": "Once per day after a short rest, recover spell slots whose combined level is no more than half your wizard level (rounded up). Cannot recover slots of 6th level or higher.", "uses": 1, "recharge": "day" },
      { "level": 2, "name": "Arcane Tradition", "description": "Choose an arcane tradition (School of Evocation, School of Abjuration, etc.).", "uses": null, "recharge": null },
      { "level": 18, "name": "Spell Mastery", "description": "Choose a 1st-level and a 2nd-level spell. You can cast each at its lowest level without expending a spell slot.", "uses": null, "recharge": null },
      { "level": 20, "name": "Signature Spells", "description": "Choose two 3rd-level wizard spells. You always have them prepared and can cast each once without expending a spell slot.", "uses": null, "recharge": null }
    ]
  }
]
```

- [ ] Create `src/data/backgrounds.json` (all 13 Basic Rules backgrounds):
```json
[
  {
    "id": "acolyte", "name": "Acolyte",
    "skillProficiencies": ["insight", "religion"],
    "toolProficiencies": [],
    "languages": 2,
    "feature": { "name": "Shelter of the Faithful", "description": "You and your companions can receive free healing and care at a temple of your faith, and you can call on your religion for assistance." },
    "personalityTraits": ["I idolize a particular hero and constantly refer to their deeds.", "I can find common ground between the fiercest enemies.", "I see omens in every event and action.", "Nothing can shake my optimistic attitude.", "I quote (or misquote) sacred texts.", "I am tolerant of other faiths.", "I've enjoyed fine food, drink, and high society.", "I've spent so long in the temple that I have little experience dealing with people."],
    "ideals": ["Tradition", "Charity", "Change", "Power", "Faith", "Aspiration"],
    "bonds": ["I would die to recover an ancient relic of my faith.", "I will someday get revenge on the corrupt temple hierarchy.", "I owe my life to the priest who took me in.", "Everything I do is for the common people.", "I will do anything to protect the temple where I served.", "I seek to preserve a sacred text that my enemies consider heretical."],
    "flaws": ["I judge others harshly, and myself even more so.", "I put too much trust in those in power.", "My piety sometimes leads me to blindly trust those that profess faith.", "I am inflexible in my thinking.", "I am suspicious of strangers.", "Once I pick a goal, I become obsessed with it."]
  },
  {
    "id": "charlatan", "name": "Charlatan",
    "skillProficiencies": ["deception", "sleight-of-hand"],
    "toolProficiencies": ["disguise-kit", "forgery-kit"],
    "languages": 0,
    "feature": { "name": "False Identity", "description": "You have a second identity including documentation, established acquaintances, and disguises." },
    "personalityTraits": ["I fall in and out of love easily.", "I swindle people who deserve it.", "I'm a born gambler.", "I'm convinced that no one can outsmart me.", "I'm a smooth talker.", "I bluff my way through anything.", "I have a weakness for the vices of the city.", "I always have a plan for escape."],
    "ideals": ["Independence", "Fairness", "Charity", "Creativity", "Friendship", "Aspiration"],
    "bonds": ["I fleeced the wrong person and need to lay low.", "I owe everything to my mentor—a horrible person who taught me what I know.", "Somewhere out there I have a child who doesn't know me.", "I come from a noble family.", "A powerful person killed someone I love.", "I swindled and ruined a merchant who didn't deserve it."],
    "flaws": ["I can't resist a pretty face.", "I'm always in debt.", "I'm convinced that no one could ever fool me.", "I'm too greedy for my own good.", "I can't resist taking something I covet.", "I'm overconfident."]
  },
  {
    "id": "criminal", "name": "Criminal",
    "skillProficiencies": ["deception", "stealth"],
    "toolProficiencies": ["thieves-tools", "gaming-set"],
    "languages": 0,
    "feature": { "name": "Criminal Contact", "description": "You have a reliable contact in the criminal underworld who can get you information and pass messages." },
    "personalityTraits": ["I always have a plan for escape.", "I am always calm.", "The first thing I do is note the exits.", "I would rather make a new friend than an enemy.", "I am incredibly slow to trust.", "I don't pay attention to risks.", "The best way to get me to do something is to tell me I can't.", "I blow up at the slightest insult."],
    "ideals": ["Honor", "Freedom", "Charity", "Greed", "People", "Redemption"],
    "bonds": ["I'm trying to pay off a debt to a mob boss.", "My ill-gotten gains go to support my family.", "Something important was taken from me and I aim to steal it back.", "I will become the greatest thief who ever lived.", "I'm guilty of a terrible crime.", "Someone I loved died because of a mistake I made."],
    "flaws": ["When I see something valuable, I can't think about anything but how to steal it.", "When faced with a choice, I always take the darker path.", "Lying is second nature to me.", "I turn tail and run when things look bad.", "An innocent person is in prison for a crime I committed.", "I have a tell that reveals when I'm lying."]
  },
  {
    "id": "entertainer", "name": "Entertainer",
    "skillProficiencies": ["acrobatics", "performance"],
    "toolProficiencies": ["disguise-kit", "musical-instrument"],
    "languages": 0,
    "feature": { "name": "By Popular Demand", "description": "You can always find a place to perform and receive free lodging and food in exchange for nightly performances." },
    "personalityTraits": ["I know a story relevant to almost every situation.", "Whenever I come to a new place I collect local rumors and spread gossip.", "I'm a hopeless romantic.", "Nobody stays angry at me for long.", "I love a good insult.", "I get bitter if I'm not the center of attention.", "I'll settle for nothing less than perfection.", "I change my mood or my mind as quickly as I change key in a song."],
    "ideals": ["Beauty", "Tradition", "Creativity", "Greed", "People", "Honesty"],
    "bonds": ["My instrument is my most treasured possession.", "Someone stole my precious instrument, and someday I'll get it back.", "I want to be famous.", "I idolize a hero of the old tales.", "I will do anything to prove myself superior to my hated rival.", "I would do anything for the other members of my old troupe."],
    "flaws": ["I'll do anything to win fame and renown.", "I'm a sucker for a pretty face.", "A scandal prevents me from ever going home again.", "I once satirized a noble who still wants my head.", "I have trouble keeping my true feelings hidden.", "Despite my best efforts, I am unreliable."]
  },
  {
    "id": "folk-hero", "name": "Folk Hero",
    "skillProficiencies": ["animal-handling", "survival"],
    "toolProficiencies": ["artisans-tools", "vehicles-land"],
    "languages": 0,
    "feature": { "name": "Rustic Hospitality", "description": "Since you come from the ranks of the common folk, you can find a place to hide, rest, or recuperate among common people." },
    "personalityTraits": ["I judge people by their actions, not their words.", "If someone is in trouble, I'm always ready to lend help.", "When I set my mind to something, I follow through.", "I have a strong sense of fair play.", "I'm confident in my own abilities.", "Thinking is for other people.", "I misuse long words in an attempt to sound smarter.", "I get bored easily."],
    "ideals": ["Respect", "Fairness", "Freedom", "Tyranny", "Sincerity", "Destiny"],
    "bonds": ["I have a family, but I have no idea where they are.", "I worked the land, I love the land, and I will protect the land.", "A proud noble once gave me a horrible beating.", "My tools are symbols of my past life.", "I protect those who cannot protect themselves.", "I wish my childhood sweetheart had come with me to pursue my destiny."],
    "flaws": ["The tyrant who rules my land will stop at nothing to see me killed.", "I'm convinced of the significance of my destiny, and blind to my shortcomings.", "The people who knew me when I was young know my shameful secret.", "I have a weakness for the vices of the city.", "Secretly, I believe that things would be better if I were a tyrant.", "I have trouble trusting in my allies."]
  },
  {
    "id": "guild-artisan", "name": "Guild Artisan",
    "skillProficiencies": ["insight", "persuasion"],
    "toolProficiencies": ["artisans-tools"],
    "languages": 1,
    "feature": { "name": "Guild Membership", "description": "Your guild will provide you with lodgings and food, bail you out of jail, and provide legal assistance in most situations." },
    "personalityTraits": ["I believe that anything worth doing is worth doing right.", "I'm rude to people who lack my commitment to hard work.", "I like to talk at length about my profession.", "I don't part with my money easily.", "I'm well known for my work and I want to make sure everyone knows it.", "I'm full of witty aphorisms.", "I'm used to getting what I want.", "I'm quick to assume the worst of people."],
    "ideals": ["Community", "Generosity", "Freedom", "Greed", "People", "Aspiration"],
    "bonds": ["The workshop where I learned my trade is the most important place in the world to me.", "I created a great work for someone who then betrayed me.", "I owe my guild a great debt.", "I pursue wealth to secure someone's love.", "One day I will return to my guild and prove that I am the greatest artisan.", "I will get revenge on the evil forces that destroyed my place of business."],
    "flaws": ["I'll do anything to get my hands on something rare or priceless.", "I'm quick to assume that someone is trying to cheat me.", "No one must ever learn that I once stole from a guild member.", "I'm never satisfied with what I have.", "I would kill to acquire a particularly valuable item.", "I'm horribly jealous of anyone who outshines my handiwork."]
  },
  {
    "id": "hermit", "name": "Hermit",
    "skillProficiencies": ["medicine", "religion"],
    "toolProficiencies": ["herbalism-kit"],
    "languages": 1,
    "feature": { "name": "Discovery", "description": "The quiet seclusion of your extended hermitage gave you access to a unique discovery—a secret, location, or truth." },
    "personalityTraits": ["I've been isolated for so long that I rarely speak.", "I am utterly serene.", "The leader of my community had something wise to say on every topic.", "I feel tremendous empathy for all who suffer.", "I'm oblivious to etiquette.", "I connect everything that happens to a grand cosmic plan.", "I often get lost in my own thoughts.", "I am working on a grand philosophical theory."],
    "ideals": ["Greater Good", "Logic", "Free Thinking", "Power", "Live and Let Live", "Self-Knowledge"],
    "bonds": ["Nothing is more important than the other members of my hermitage.", "I entered seclusion to hide from the ones who might still be hunting me.", "I'm still seeking the enlightenment I pursued in my seclusion.", "I entered seclusion because I loved someone I could never have.", "My isolation gave me great insight into a great evil that only I can destroy.", "My deepest calling is to champion the downtrodden."],
    "flaws": ["Now that I've returned to the world, I enjoy its delights a little too much.", "I harbor dark, bloodthirsty thoughts that my isolation failed to quell.", "I am dogmatic in my thoughts and philosophy.", "I let my need to win arguments overshadow friendships.", "I'd risk too much to uncover a lost bit of knowledge.", "I like keeping secrets and won't share them with anyone."]
  },
  {
    "id": "noble", "name": "Noble",
    "skillProficiencies": ["history", "persuasion"],
    "toolProficiencies": ["gaming-set"],
    "languages": 1,
    "feature": { "name": "Position of Privilege", "description": "People are inclined to think the best of you and grant you access to high society, comfortable accommodations, and audience with local leaders." },
    "personalityTraits": ["My eloquent flattery makes everyone I talk to feel like the most wonderful person.", "The common folk love me for my kindness.", "No one could doubt by looking at my regal bearing that I am a cut above.", "I take great pains to always look my best.", "I don't like to get my hands dirty.", "Despite my noble birth, I do not place myself above others.", "My favor, once lost, is lost forever.", "If you do me an ill turn, I will remember it."],
    "ideals": ["Respect", "Responsibility", "Independence", "Power", "Family", "Noble Obligation"],
    "bonds": ["I will face any challenge to win the approval of my family.", "My house's alliance with another noble family must be sustained.", "Nothing is more important than the other members of my family.", "I am in love with the heir of a family my family despises.", "My loyalty to my sovereign is unwavering.", "The common folk must see me as a hero."],
    "flaws": ["I secretly believe that everyone is beneath me.", "I hide a truly scandalous secret.", "I too often hear veiled insults and threats.", "I have an insatiable desire for carnal pleasures.", "In fact, the world does revolve around me.", "By my words and actions, I often bring shame to my family."]
  },
  {
    "id": "outlander", "name": "Outlander",
    "skillProficiencies": ["athletics", "survival"],
    "toolProficiencies": ["musical-instrument"],
    "languages": 1,
    "feature": { "name": "Wanderer", "description": "You have an excellent memory for maps and geography, and can always recall the general layout of terrain and settlements you've seen." },
    "personalityTraits": ["I'm driven by a wanderlust.", "I watch over my friends as if they were a litter of newborn pups.", "I once ran twenty-five miles without stopping to warn a friend.", "I have a lesson for every situation.", "I place no stock in wealthy people.", "I'm always picking things up and fiddling with them.", "I feel far more comfortable around animals than people.", "I was, in fact, raised by wolves."],
    "ideals": ["Change", "Greater Good", "Honor", "Might", "Nature", "Glory"],
    "bonds": ["My family, clan, or tribe is the most important thing in my life.", "An injury to the unspoiled wilderness is an injury to me.", "I will bring terrible wrath down on the evil-doers who destroyed my homeland.", "I am the last of my tribe, and it is up to me to ensure their survival.", "I suffer awful visions of a coming disaster and will do anything to prevent it.", "It is my duty to provide children to sustain my tribe."],
    "flaws": ["I am too enamored of ale, wine, and other intoxicants.", "There's no room for caution in a life lived to the fullest.", "I remember every insult I've received and nurse a silent resentment.", "I am slow to trust members of other races.", "Violence is my answer to almost any challenge.", "Don't expect me to save those who can't save themselves."]
  },
  {
    "id": "sage", "name": "Sage",
    "skillProficiencies": ["arcana", "history"],
    "toolProficiencies": [],
    "languages": 2,
    "feature": { "name": "Researcher", "description": "When you attempt to learn or recall a piece of lore, if you don't know it, you often know where to obtain it." },
    "personalityTraits": ["I use polysyllabic words to convey the impression of great erudition.", "I've read every book in the world's greatest libraries.", "I'm used to helping out those who aren't as smart.", "There's nothing I like more than a good mystery.", "I'm willing to listen to every side of an argument before I make my own judgment.", "I speak to others as if they were slow-witted.", "I am horribly, horribly awkward in social situations.", "I'm convinced that people are always trying to steal my secrets."],
    "ideals": ["Knowledge", "Beauty", "Logic", "No Limits", "Power", "Self-Improvement"],
    "bonds": ["It is my duty to protect my students.", "I have an ancient text that holds terrible secrets.", "I work to preserve a library, university, or scriptorium.", "My life's work is a series of tomes related to a specific field of lore.", "I've been searching my whole life for the answer to a certain question.", "I sold my soul for knowledge."],
    "flaws": ["I am easily distracted by the promise of information.", "Most people scream and run when they see a demon.", "Unlocking an ancient mystery is worth the price of a civilization.", "I overlook obvious solutions in favor of complicated ones.", "I speak without really thinking through my words.", "I can't keep a secret to save my life."]
  },
  {
    "id": "sailor", "name": "Sailor",
    "skillProficiencies": ["athletics", "perception"],
    "toolProficiencies": ["navigators-tools", "vehicles-water"],
    "languages": 0,
    "feature": { "name": "Ship's Passage", "description": "You can secure free passage on a sailing ship for yourself and companions in exchange for working during the voyage." },
    "personalityTraits": ["My friends know they can rely on me.", "I work hard so that I can play hard when the work is done.", "I enjoy sailing into new ports and making new friends over a flagon of ale.", "I stretch the truth for the sake of a good story.", "To me, a tavern brawl is a nice way to get to know a new city.", "I never pass up a friendly wager.", "My language is as foul as an otyugh nest.", "I like a job well done."],
    "ideals": ["Respect", "Fairness", "Freedom", "Mastery", "People", "Aspiration"],
    "bonds": ["I'm loyal to my captain first, everything else second.", "The ship is most important—crewmates and captains come and go.", "I'll always remember my first ship.", "In a harbor town, I have a paramour whose eyes nearly stole me from the sea.", "I was cheated out of my fair share of the profits and I want to get my due.", "Rum and I have an understanding."],
    "flaws": ["I follow orders, even if I think they're wrong.", "I'll say anything to avoid having to do extra work.", "Once someone questions my courage, I never back down.", "Once I start drinking, it's hard to stop.", "I can't help but pocket loose coins.", "My pride will probably lead to my destruction."]
  },
  {
    "id": "soldier", "name": "Soldier",
    "skillProficiencies": ["athletics", "intimidation"],
    "toolProficiencies": ["gaming-set", "vehicles-land"],
    "languages": 0,
    "feature": { "name": "Military Rank", "description": "Soldiers loyal to your former military organization still recognize your authority and defer to you." },
    "personalityTraits": ["I'm always polite and respectful.", "I'm haunted by memories of war.", "I've lost too many friends, and I'm slow to make new ones.", "I'm full of inspiring and cautionary tales.", "I can stare down a hell hound without flinching.", "I enjoy being strong and like breaking things.", "I have a crude sense of humor.", "I face problems head-on."],
    "ideals": ["Greater Good", "Responsibility", "Independence", "Might", "Live and Let Live", "Nation"],
    "bonds": ["I would still lay down my life for the people I served with.", "Someone saved my life on the battlefield. To this day, I will never leave a friend behind.", "My honor is my life.", "I'll never forget the crushing defeat my company suffered.", "Those who fight beside me are those worth dying for.", "I fight for those who cannot fight for themselves."],
    "flaws": ["The monstrous enemy we faced in battle still leaves me quivering with fear.", "I have little respect for anyone who is not a proven warrior.", "I made a terrible mistake in battle that cost many lives, and I would do anything to keep that mistake secret.", "My hatred of my enemies is blinding and unreasoning.", "I obey the law, even if the law causes misery.", "I'd rather eat my armor than admit when I'm wrong."]
  },
  {
    "id": "urchin", "name": "Urchin",
    "skillProficiencies": ["sleight-of-hand", "stealth"],
    "toolProficiencies": ["disguise-kit", "thieves-tools"],
    "languages": 0,
    "feature": { "name": "City Secrets", "description": "You know the secret patterns and flow to cities and can find passages through the urban sprawl that others would miss." },
    "personalityTraits": ["I hide scraps of food and trinkets in my pockets.", "I ask a lot of questions.", "I like to squeeze into small places where no one else can get to me.", "I sleep with my back to a wall or tree.", "I am wary of anyone who seems too friendly.", "I don't like to bathe.", "I bluntly say what other people are hinting at or hiding.", "I don't like to be alone."],
    "ideals": ["Respect", "Community", "Change", "Retribution", "People", "Aspiration"],
    "bonds": ["My town or city is my home, and I'll fight to defend it.", "I sponsor an orphanage to keep others from enduring what I was forced to endure.", "I owe my survival to another urchin who taught me to live on the streets.", "I owe a debt I can never repay to the person who took pity on me.", "I escaped my life of poverty by robbing an important person, and I'm wanted for it.", "No one else should have to suffer the way I did."],
    "flaws": ["If I'm outnumbered, I will run away from a fight.", "Gold seems like a lot of money to me, and I'll do just about anything for more.", "I will never fully trust anyone other than myself.", "I'd rather kill someone in their sleep than fight fair.", "It's not stealing if I need it more than someone else.", "People who can't take care of themselves get what they deserve."]
  }
]
```

- [ ] Commit:
```bash
git add src/data/races.json src/data/classes.json src/data/backgrounds.json
git commit -m "feat: add static game data — races, classes, backgrounds"
```

---

### Task 7: Static game data — skills, conditions, equipment

**Files:**
- Create: `src/data/skills.json`, `src/data/conditions.json`, `src/data/equipment.json`

- [ ] Create `src/data/skills.json`:
```json
[
  { "id": "acrobatics", "name": "Acrobatics", "ability": "dex" },
  { "id": "animal-handling", "name": "Animal Handling", "ability": "wis" },
  { "id": "arcana", "name": "Arcana", "ability": "int" },
  { "id": "athletics", "name": "Athletics", "ability": "str" },
  { "id": "deception", "name": "Deception", "ability": "cha" },
  { "id": "history", "name": "History", "ability": "int" },
  { "id": "insight", "name": "Insight", "ability": "wis" },
  { "id": "intimidation", "name": "Intimidation", "ability": "cha" },
  { "id": "investigation", "name": "Investigation", "ability": "int" },
  { "id": "medicine", "name": "Medicine", "ability": "wis" },
  { "id": "nature", "name": "Nature", "ability": "int" },
  { "id": "perception", "name": "Perception", "ability": "wis" },
  { "id": "performance", "name": "Performance", "ability": "cha" },
  { "id": "persuasion", "name": "Persuasion", "ability": "cha" },
  { "id": "religion", "name": "Religion", "ability": "int" },
  { "id": "sleight-of-hand", "name": "Sleight of Hand", "ability": "dex" },
  { "id": "stealth", "name": "Stealth", "ability": "dex" },
  { "id": "survival", "name": "Survival", "ability": "wis" }
]
```

- [ ] Create `src/data/conditions.json`:
```json
[
  { "id": "blinded", "name": "Blinded", "description": "A blinded creature can't see and automatically fails any ability check that requires sight. Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage." },
  { "id": "charmed", "name": "Charmed", "description": "A charmed creature can't attack the charmer or target the charmer with harmful abilities or magical effects. The charmer has advantage on any ability check to interact socially with the creature." },
  { "id": "deafened", "name": "Deafened", "description": "A deafened creature can't hear and automatically fails any ability check that requires hearing." },
  { "id": "exhaustion", "name": "Exhaustion", "description": "Levels 1–6: 1=Disadvantage on ability checks; 2=Speed halved; 3=Disadvantage on attacks and saving throws; 4=HP maximum halved; 5=Speed reduced to 0; 6=Death." },
  { "id": "frightened", "name": "Frightened", "description": "A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight. The creature can't willingly move closer to the source." },
  { "id": "grappled", "name": "Grappled", "description": "A grappled creature's speed becomes 0, and it can't benefit from any bonus to its speed. The condition ends if the grappler is incapacitated or the creature is moved outside the grappler's reach." },
  { "id": "incapacitated", "name": "Incapacitated", "description": "An incapacitated creature can't take actions or reactions." },
  { "id": "invisible", "name": "Invisible", "description": "An invisible creature is impossible to see without special sense. Attack rolls against the creature have disadvantage, and the creature's attack rolls have advantage." },
  { "id": "paralyzed", "name": "Paralyzed", "description": "A paralyzed creature is incapacitated and can't move or speak. Attack rolls against the creature have advantage. Any attack that hits is a critical hit if the attacker is within 5 feet." },
  { "id": "petrified", "name": "Petrified", "description": "A petrified creature is transformed into solid inanimate substance, is incapacitated, unaware of surroundings, and has resistance to all damage and immunity to poison and disease." },
  { "id": "poisoned", "name": "Poisoned", "description": "A poisoned creature has disadvantage on attack rolls and ability checks." },
  { "id": "prone", "name": "Prone", "description": "A prone creature's only movement option is to crawl, unless it stands up. The creature has disadvantage on attack rolls. Attack rolls against it have advantage if the attacker is within 5 feet, disadvantage otherwise." },
  { "id": "restrained", "name": "Restrained", "description": "A restrained creature's speed becomes 0. Attack rolls against it have advantage, and its attack rolls have disadvantage. It has disadvantage on DEX saving throws." },
  { "id": "stunned", "name": "Stunned", "description": "A stunned creature is incapacitated, can't move, and can speak only falteringly. The creature automatically fails STR and DEX saving throws. Attack rolls against it have advantage." },
  { "id": "unconscious", "name": "Unconscious", "description": "An unconscious creature is incapacitated, can't move or speak, and is unaware of its surroundings. It drops whatever it's holding and falls prone. Attack rolls against it have advantage. Any attack that hits is a critical hit if the attacker is within 5 feet." }
]
```

- [ ] Create `src/data/equipment.json` (standard weapons and armor):
```json
{
  "weapons": [
    { "id": "club", "name": "Club", "damage": "1d4", "damageType": "bludgeoning", "weaponCategory": "simple", "weaponProperties": ["light"], "range": null, "weight": 2, "cost": "1 sp" },
    { "id": "dagger", "name": "Dagger", "damage": "1d4", "damageType": "piercing", "weaponCategory": "simple", "weaponProperties": ["finesse", "light", "thrown"], "range": "20/60", "weight": 1, "cost": "2 gp" },
    { "id": "greatclub", "name": "Greatclub", "damage": "1d8", "damageType": "bludgeoning", "weaponCategory": "simple", "weaponProperties": ["two-handed"], "range": null, "weight": 10, "cost": "2 sp" },
    { "id": "handaxe", "name": "Handaxe", "damage": "1d6", "damageType": "slashing", "weaponCategory": "simple", "weaponProperties": ["light", "thrown"], "range": "20/60", "weight": 2, "cost": "5 gp" },
    { "id": "javelin", "name": "Javelin", "damage": "1d6", "damageType": "piercing", "weaponCategory": "simple", "weaponProperties": ["thrown"], "range": "30/120", "weight": 2, "cost": "5 sp" },
    { "id": "light-hammer", "name": "Light Hammer", "damage": "1d4", "damageType": "bludgeoning", "weaponCategory": "simple", "weaponProperties": ["light", "thrown"], "range": "20/60", "weight": 2, "cost": "2 gp" },
    { "id": "mace", "name": "Mace", "damage": "1d6", "damageType": "bludgeoning", "weaponCategory": "simple", "weaponProperties": [], "range": null, "weight": 4, "cost": "5 gp" },
    { "id": "quarterstaff", "name": "Quarterstaff", "damage": "1d6", "damageType": "bludgeoning", "weaponCategory": "simple", "weaponProperties": ["versatile"], "range": null, "weight": 4, "cost": "2 sp" },
    { "id": "spear", "name": "Spear", "damage": "1d6", "damageType": "piercing", "weaponCategory": "simple", "weaponProperties": ["thrown", "versatile"], "range": "20/60", "weight": 3, "cost": "1 gp" },
    { "id": "light-crossbow", "name": "Light Crossbow", "damage": "1d8", "damageType": "piercing", "weaponCategory": "simple", "weaponProperties": ["ammunition", "loading", "two-handed"], "range": "80/320", "weight": 5, "cost": "25 gp" },
    { "id": "shortbow", "name": "Shortbow", "damage": "1d6", "damageType": "piercing", "weaponCategory": "simple", "weaponProperties": ["ammunition", "two-handed"], "range": "80/320", "weight": 2, "cost": "25 gp" },
    { "id": "battleaxe", "name": "Battleaxe", "damage": "1d8", "damageType": "slashing", "weaponCategory": "martial", "weaponProperties": ["versatile"], "range": null, "weight": 4, "cost": "10 gp" },
    { "id": "flail", "name": "Flail", "damage": "1d8", "damageType": "bludgeoning", "weaponCategory": "martial", "weaponProperties": [], "range": null, "weight": 2, "cost": "10 gp" },
    { "id": "glaive", "name": "Glaive", "damage": "1d10", "damageType": "slashing", "weaponCategory": "martial", "weaponProperties": ["heavy", "reach", "two-handed"], "range": null, "weight": 6, "cost": "20 gp" },
    { "id": "greataxe", "name": "Greataxe", "damage": "1d12", "damageType": "slashing", "weaponCategory": "martial", "weaponProperties": ["heavy", "two-handed"], "range": null, "weight": 7, "cost": "30 gp" },
    { "id": "greatsword", "name": "Greatsword", "damage": "2d6", "damageType": "slashing", "weaponCategory": "martial", "weaponProperties": ["heavy", "two-handed"], "range": null, "weight": 6, "cost": "50 gp" },
    { "id": "longsword", "name": "Longsword", "damage": "1d8", "damageType": "slashing", "weaponCategory": "martial", "weaponProperties": ["versatile"], "range": null, "weight": 3, "cost": "15 gp" },
    { "id": "rapier", "name": "Rapier", "damage": "1d8", "damageType": "piercing", "weaponCategory": "martial", "weaponProperties": ["finesse"], "range": null, "weight": 2, "cost": "25 gp" },
    { "id": "scimitar", "name": "Scimitar", "damage": "1d6", "damageType": "slashing", "weaponCategory": "martial", "weaponProperties": ["finesse", "light"], "range": null, "weight": 3, "cost": "25 gp" },
    { "id": "shortsword", "name": "Shortsword", "damage": "1d6", "damageType": "piercing", "weaponCategory": "martial", "weaponProperties": ["finesse", "light"], "range": null, "weight": 2, "cost": "10 gp" },
    { "id": "hand-crossbow", "name": "Hand Crossbow", "damage": "1d6", "damageType": "piercing", "weaponCategory": "martial", "weaponProperties": ["ammunition", "light", "loading"], "range": "30/120", "weight": 3, "cost": "75 gp" },
    { "id": "longbow", "name": "Longbow", "damage": "1d8", "damageType": "piercing", "weaponCategory": "martial", "weaponProperties": ["ammunition", "heavy", "two-handed"], "range": "150/600", "weight": 2, "cost": "50 gp" }
  ],
  "armor": [
    { "id": "padded", "name": "Padded", "armorClass": 11, "armorType": "light", "weight": 8, "cost": "5 gp", "stealthDisadvantage": true },
    { "id": "leather", "name": "Leather", "armorClass": 11, "armorType": "light", "weight": 10, "cost": "10 gp", "stealthDisadvantage": false },
    { "id": "studded-leather", "name": "Studded Leather", "armorClass": 12, "armorType": "light", "weight": 13, "cost": "45 gp", "stealthDisadvantage": false },
    { "id": "hide", "name": "Hide", "armorClass": 12, "armorType": "medium", "weight": 12, "cost": "10 gp", "stealthDisadvantage": false },
    { "id": "chain-shirt", "name": "Chain Shirt", "armorClass": 13, "armorType": "medium", "weight": 20, "cost": "50 gp", "stealthDisadvantage": false },
    { "id": "scale-mail", "name": "Scale Mail", "armorClass": 14, "armorType": "medium", "weight": 45, "cost": "50 gp", "stealthDisadvantage": true },
    { "id": "breastplate", "name": "Breastplate", "armorClass": 14, "armorType": "medium", "weight": 20, "cost": "400 gp", "stealthDisadvantage": false },
    { "id": "half-plate", "name": "Half Plate", "armorClass": 15, "armorType": "medium", "weight": 40, "cost": "750 gp", "stealthDisadvantage": true },
    { "id": "ring-mail", "name": "Ring Mail", "armorClass": 14, "armorType": "heavy", "weight": 40, "cost": "30 gp", "stealthDisadvantage": true },
    { "id": "chain-mail", "name": "Chain Mail", "armorClass": 16, "armorType": "heavy", "weight": 55, "cost": "75 gp", "stealthDisadvantage": true },
    { "id": "splint", "name": "Splint", "armorClass": 17, "armorType": "heavy", "weight": 60, "cost": "200 gp", "stealthDisadvantage": true },
    { "id": "plate", "name": "Plate", "armorClass": 18, "armorType": "heavy", "weight": 65, "cost": "1500 gp", "stealthDisadvantage": true },
    { "id": "shield", "name": "Shield", "armorClass": 2, "armorType": "shield", "weight": 6, "cost": "10 gp", "stealthDisadvantage": false }
  ]
}
```

- [ ] Commit:
```bash
git add src/data/skills.json src/data/conditions.json src/data/equipment.json
git commit -m "feat: add static game data — skills, conditions, equipment"
```

---

### Task 8: Zustand store — character slice

**Files:**
- Create: `src/store/characters.js`, `src/tests/store/characters.test.js`

- [ ] Write failing tests — create `src/tests/store/characters.test.js`:
```js
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
```

- [ ] Run to confirm failure:
```bash
npx vitest run src/tests/store/characters.test.js
```
Expected: fail with "Cannot find module"

- [ ] Create `src/store/characters.js`:
```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCharacterStore = create(
  persist(
    (set, get) => ({
      characters: [],

      addCharacter(character) {
        set(state => ({ characters: [...state.characters, character] }))
      },

      updateCharacter(id, partial) {
        set(state => ({
          characters: state.characters.map(c =>
            c.id === id ? mergeDeep(c, partial) : c
          ),
        }))
      },

      deleteCharacter(id) {
        set(state => ({ characters: state.characters.filter(c => c.id !== id) }))
      },

      updateHp(id, newCurrent) {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== id) return c
            const deathSaves = newCurrent > 0
              ? { successes: 0, failures: 0 }
              : c.deathSaves
            return { ...c, hp: { ...c.hp, current: Math.max(0, newCurrent) }, deathSaves }
          }),
        }))
      },
    }),
    { name: 'dnd-characters' }
  )
)

function mergeDeep(target, source) {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeDeep(target[key] ?? {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  return result
}
```

- [ ] Run tests to confirm they all pass:
```bash
npx vitest run src/tests/store/characters.test.js
```
Expected: all 6 tests pass

- [ ] Commit:
```bash
git add src/store/characters.js src/tests/store/characters.test.js
git commit -m "feat: add character Zustand store with persistence"
```

---

### Task 9: Zustand store — ui, settings, homebrew slices

**Files:**
- Create: `src/store/ui.js`, `src/store/settings.js`, `src/store/homebrew.js`, `src/store/index.js`

- [ ] Create `src/store/ui.js`:
```js
import { create } from 'zustand'

export const useUiStore = create(set => ({
  activeCharacterId: null,
  activeTab: 'abilities',
  wizardStep: 1,
  setActiveCharacter: id => set({ activeCharacterId: id }),
  setActiveTab: tab => set({ activeTab: tab }),
  setWizardStep: step => set({ wizardStep: step }),
}))
```

- [ ] Create `src/store/settings.js`:
```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettingsStore = create(
  persist(
    set => ({
      globalAdvancedMode: false,
      toggleGlobalAdvancedMode: () =>
        set(state => ({ globalAdvancedMode: !state.globalAdvancedMode })),
    }),
    { name: 'dnd-settings' }
  )
)
```

- [ ] Create `src/store/homebrew.js`:
```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useHomebrewStore = create(
  persist(
    (set, get) => ({
      races: [],
      classes: [],
      addRace: race => set(state => ({ races: [...state.races, race] })),
      updateRace: (id, data) =>
        set(state => ({ races: state.races.map(r => r.id === id ? { ...r, ...data } : r) })),
      deleteRace: id =>
        set(state => ({ races: state.races.filter(r => r.id !== id) })),
      addClass: cls => set(state => ({ classes: [...state.classes, cls] })),
      updateClass: (id, data) =>
        set(state => ({ classes: state.classes.map(c => c.id === id ? { ...c, ...data } : c) })),
      deleteClass: id =>
        set(state => ({ classes: state.classes.filter(c => c.id !== id) })),
    }),
    { name: 'dnd-homebrew' }
  )
)
```

- [ ] Create `src/store/index.js`:
```js
export { useCharacterStore } from './characters'
export { useUiStore } from './ui'
export { useSettingsStore } from './settings'
export { useHomebrewStore } from './homebrew'
```

- [ ] Run all tests to confirm nothing is broken:
```bash
npx vitest run
```
Expected: all previously written tests still pass

- [ ] Commit:
```bash
git add src/store/ui.js src/store/settings.js src/store/homebrew.js src/store/index.js
git commit -m "feat: add ui, settings, and homebrew Zustand stores"
```

---

### Task 10: useDerivedStats hook

**Files:**
- Create: `src/hooks/useDerivedStats.js`, `src/tests/hooks/useDerivedStats.test.js`

- [ ] Write failing tests — create `src/tests/hooks/useDerivedStats.test.js`:
```js
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
```

- [ ] Run to confirm failure:
```bash
npx vitest run src/tests/hooks/useDerivedStats.test.js
```

- [ ] Create `src/hooks/useDerivedStats.js`:
```js
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
```

- [ ] Run tests to confirm they all pass:
```bash
npx vitest run src/tests/hooks/useDerivedStats.test.js
```
Expected: all 8 tests pass

- [ ] Commit:
```bash
git add src/hooks/useDerivedStats.js src/tests/hooks/useDerivedStats.test.js
git commit -m "feat: add useDerivedStats hook with full computed stat coverage"
```

---

## Chunk 3: Shared Components

### Task 11: Modal component

**Files:**
- Create: `src/components/Modal/Modal.jsx`, `src/components/Modal/Modal.module.css`
- Create: `src/tests/components/Modal.test.jsx`

- [ ] Write failing test:
```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../../components/Modal/Modal'

describe('Modal', () => {
  it('renders children when open', () => {
    render(<Modal open title="Test Modal"><p>Content</p></Modal>)
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
  it('renders nothing when closed', () => {
    render(<Modal open={false} title="Test Modal"><p>Content</p></Modal>)
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
  })
  it('calls onClose when backdrop clicked', async () => {
    const onClose = vi.fn()
    render(<Modal open title="Test" onClose={onClose}><p>hi</p></Modal>)
    await userEvent.click(screen.getByTestId('modal-backdrop'))
    expect(onClose).toHaveBeenCalled()
  })
})
```

- [ ] Run to confirm failure:
```bash
npx vitest run src/tests/components/Modal.test.jsx
```

- [ ] Create `src/components/Modal/Modal.jsx`:
```jsx
import styles from './Modal.module.css'

export default function Modal({ open, title, onClose, children, size = 'md' }) {
  if (!open) return null
  return (
    <div className={styles.backdrop} data-testid="modal-backdrop" onClick={onClose}>
      <div
        className={`${styles.modal} ${styles[size]}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {onClose && (
            <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
          )}
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}
```

- [ ] Create `src/components/Modal/Modal.module.css`:
```css
.backdrop {
  position: fixed; inset: 0;
  background: var(--color-overlay);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
}
.modal {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-height: 90vh;
  overflow-y: auto;
  width: 100%;
}
.sm { max-width: 400px; }
.md { max-width: 560px; }
.lg { max-width: 780px; }
.header {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--color-border-light);
}
.title { font-family: var(--font-serif); }
.close {
  font-size: var(--text-lg); color: var(--color-muted);
  transition: color var(--transition);
}
.close:hover { color: var(--color-ink); }
.body { padding: var(--space-lg); }
```

- [ ] Run tests to confirm they pass:
```bash
npx vitest run src/tests/components/Modal.test.jsx
```
Expected: all 3 tests pass

- [ ] Commit:
```bash
git add src/components/Modal/ src/tests/components/Modal.test.jsx
git commit -m "feat: add Modal component"
```

---

### Task 12: PipTracker component

**Files:**
- Create: `src/components/PipTracker/PipTracker.jsx`, `src/components/PipTracker/PipTracker.module.css`
- Create: `src/tests/components/PipTracker.test.jsx`

- [ ] Write failing test:
```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PipTracker from '../../components/PipTracker/PipTracker'

describe('PipTracker', () => {
  it('renders correct number of pips', () => {
    render(<PipTracker total={4} used={2} onChange={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(4)
  })
  it('marks used pips as filled', () => {
    render(<PipTracker total={3} used={2} onChange={() => {}} />)
    const pips = screen.getAllByRole('button')
    expect(pips[0]).toHaveAttribute('aria-pressed', 'true')
    expect(pips[1]).toHaveAttribute('aria-pressed', 'true')
    expect(pips[2]).toHaveAttribute('aria-pressed', 'false')
  })
  it('calls onChange with new used count on pip click', async () => {
    const onChange = vi.fn()
    render(<PipTracker total={3} used={1} onChange={onChange} />)
    await userEvent.click(screen.getAllByRole('button')[2])
    expect(onChange).toHaveBeenCalledWith(3)
  })
})
```

- [ ] Run to confirm failure:
```bash
npx vitest run src/tests/components/PipTracker.test.jsx
```

- [ ] Create `src/components/PipTracker/PipTracker.jsx`:
```jsx
import styles from './PipTracker.module.css'

export default function PipTracker({ total, used, onChange, label }) {
  return (
    <div className={styles.tracker}>
      {label && <span className="label">{label}</span>}
      <div className={styles.pips}>
        {Array.from({ length: total }, (_, i) => {
          const filled = i < used
          return (
            <button
              key={i}
              role="button"
              aria-pressed={filled}
              className={`${styles.pip} ${filled ? styles.filled : ''}`}
              onClick={() => onChange(filled ? i : i + 1)}
              aria-label={`${label ?? 'pip'} ${i + 1}`}
            />
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] Create `src/components/PipTracker/PipTracker.module.css`:
```css
.tracker { display: flex; align-items: center; gap: var(--space-sm); }
.pips { display: flex; gap: 4px; flex-wrap: wrap; }
.pip {
  width: 16px; height: 16px;
  border-radius: 50%;
  border: 2px solid var(--color-accent);
  background: transparent;
  transition: background var(--transition);
}
.pip.filled { background: var(--color-accent); }
.pip:hover { opacity: 0.7; }
```

- [ ] Run tests to confirm they pass:
```bash
npx vitest run src/tests/components/PipTracker.test.jsx
```
Expected: all 3 tests pass

- [ ] Commit:
```bash
git add src/components/PipTracker/ src/tests/components/PipTracker.test.jsx
git commit -m "feat: add PipTracker component"
```

---

### Task 13: Badge, DiceRoller, and ConditionToggle components

**Files:**
- Create: `src/components/Badge/Badge.jsx`, `src/components/Badge/Badge.module.css`
- Create: `src/components/DiceRoller/DiceRoller.jsx`, `src/components/DiceRoller/DiceRoller.module.css`
- Create: `src/components/ConditionToggle/ConditionToggle.jsx`, `src/components/ConditionToggle/ConditionToggle.module.css`

- [ ] Create `src/components/Badge/Badge.jsx`:
```jsx
import styles from './Badge.module.css'
export default function Badge({ children, variant = 'default' }) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>
}
```

- [ ] Create `src/components/Badge/Badge.module.css`:
```css
.badge {
  display: inline-block;
  padding: 1px var(--space-xs);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: 0.03em;
}
.default { background: var(--color-parchment-dark); color: var(--color-ink-light); }
.homebrew { background: var(--color-gold); color: var(--color-ink); }
.custom { background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-ink-light); }
```

- [ ] Create `src/components/DiceRoller/DiceRoller.jsx`:
```jsx
import { useState } from 'react'
import { rollDice } from '../../utils/diceRoller'
import styles from './DiceRoller.module.css'

export default function DiceRoller({ expression, label, onRoll }) {
  const [lastResult, setLastResult] = useState(null)

  function handleRoll() {
    const outcome = rollDice(expression)
    setLastResult(outcome)
    onRoll?.(outcome)
  }

  return (
    <div className={styles.roller}>
      <button className={styles.btn} onClick={handleRoll} type="button">
        {label ?? `Roll ${expression}`}
      </button>
      {lastResult && (
        <span className={styles.result}>
          {lastResult.error
            ? <span className={styles.error}>{lastResult.error}</span>
            : <span>{lastResult.result}</span>
          }
        </span>
      )}
    </div>
  )
}
```

- [ ] Create `src/components/DiceRoller/DiceRoller.module.css`:
```css
.roller { display: inline-flex; align-items: center; gap: var(--space-sm); }
.btn {
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-accent);
  color: white;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  transition: background var(--transition);
}
.btn:hover { background: var(--color-accent-hover); }
.result { font-weight: var(--weight-bold); min-width: 2ch; text-align: center; }
.error { color: var(--color-danger); font-size: var(--text-sm); }
```

- [ ] Create `src/components/ConditionToggle/ConditionToggle.jsx`:
```jsx
import styles from './ConditionToggle.module.css'

export default function ConditionToggle({ condition, active, value, onChange }) {
  const isExhaustion = condition.id === 'exhaustion'

  if (isExhaustion) {
    return (
      <div className={`${styles.pill} ${value > 0 ? styles.active : ''}`}>
        <span className={styles.name}>{condition.name}</span>
        <div className={styles.stepper}>
          <button onClick={() => onChange(Math.max(0, value - 1))} aria-label="Decrease exhaustion">−</button>
          <span>{value}</span>
          <button onClick={() => onChange(Math.min(6, value + 1))} aria-label="Increase exhaustion">+</button>
        </div>
      </div>
    )
  }

  return (
    <button
      className={`${styles.pill} ${active ? styles.active : ''}`}
      onClick={() => onChange(!active)}
      aria-pressed={active}
      title={condition.description}
    >
      {condition.name}
    </button>
  )
}
```

- [ ] Create `src/components/ConditionToggle/ConditionToggle.module.css`:
```css
.pill {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: var(--text-sm);
  transition: all var(--transition);
}
.pill.active {
  background: var(--color-danger);
  border-color: var(--color-danger);
  color: white;
}
.name { font-weight: var(--weight-medium); }
.stepper { display: flex; align-items: center; gap: 4px; }
.stepper button { width: 20px; height: 20px; border-radius: 50%; border: 1px solid currentColor; font-size: var(--text-sm); display: flex; align-items: center; justify-content: center; }
```

- [ ] Run all tests to verify nothing is broken:
```bash
npx vitest run
```
Expected: all previously passing tests still pass (Badge/DiceRoller/ConditionToggle have no unit tests — they are integration-tested via the tabs that use them)

- [ ] Commit:
```bash
git add src/components/Badge/ src/components/DiceRoller/ src/components/ConditionToggle/
git commit -m "feat: add Badge, DiceRoller, and ConditionToggle components"
```

---

### Task 14: StatBlock and SkillRow components

**Files:**
- Create: `src/components/StatBlock/StatBlock.jsx`, `src/components/StatBlock/StatBlock.module.css`
- Create: `src/components/SkillRow/SkillRow.jsx`, `src/components/SkillRow/SkillRow.module.css`

- [ ] Create `src/components/StatBlock/StatBlock.jsx`:
```jsx
import styles from './StatBlock.module.css'

export default function StatBlock({ label, score, modifier, children }) {
  const modStr = modifier >= 0 ? `+${modifier}` : `${modifier}`
  return (
    <div className={styles.block}>
      <span className="label">{label}</span>
      <div className={styles.score}>{score ?? '—'}</div>
      <div className={styles.modifier}>{modStr}</div>
      {children && <div className={styles.extra}>{children}</div>}
    </div>
  )
}
```

- [ ] Create `src/components/StatBlock/StatBlock.module.css`:
```css
.block {
  display: flex; flex-direction: column; align-items: center;
  gap: 2px;
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-raised);
  min-width: 72px;
  text-align: center;
}
.score { font-size: var(--text-lg); font-weight: var(--weight-bold); line-height: 1; }
.modifier {
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
  color: var(--color-accent);
  background: var(--color-parchment);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 1px 6px;
}
.extra { font-size: var(--text-xs); margin-top: var(--space-xs); }
```

- [ ] Create `src/components/SkillRow/SkillRow.jsx`:
```jsx
import styles from './SkillRow.module.css'

export default function SkillRow({ skill, bonus, proficient, expert, onProfToggle, onExpertToggle, readonly }) {
  const bonusStr = bonus >= 0 ? `+${bonus}` : `${bonus}`
  return (
    <div className={`${styles.row} ${proficient ? styles.proficient : ''}`}>
      <button
        className={`${styles.dot} ${proficient ? styles.filled : ''}`}
        onClick={() => !readonly && onProfToggle?.()}
        aria-label={`${proficient ? 'Remove' : 'Add'} proficiency in ${skill.name}`}
        aria-pressed={proficient}
        disabled={readonly}
      />
      {onExpertToggle != null && (
        <button
          className={`${styles.dot} ${styles.expert} ${expert ? styles.filled : ''}`}
          onClick={() => !readonly && onExpertToggle?.()}
          aria-label={`${expert ? 'Remove' : 'Add'} expertise in ${skill.name}`}
          aria-pressed={expert}
          disabled={readonly}
        />
      )}
      <span className={styles.bonus}>{bonusStr}</span>
      <span className={styles.name}>{skill.name}</span>
      <span className={styles.ability}>({skill.ability.toUpperCase()})</span>
    </div>
  )
}
```

- [ ] Create `src/components/SkillRow/SkillRow.module.css`:
```css
.row {
  display: flex; align-items: center; gap: var(--space-xs);
  padding: 3px var(--space-xs);
  border-radius: var(--radius-sm);
  transition: background var(--transition);
}
.row:hover { background: var(--color-parchment-dark); }
.row.proficient { font-weight: var(--weight-medium); }
.dot {
  width: 12px; height: 12px; border-radius: 50%;
  border: 2px solid var(--color-border);
  background: transparent; flex-shrink: 0;
  transition: all var(--transition);
}
.dot.filled { background: var(--color-accent); border-color: var(--color-accent); }
.dot.expert { border-style: dashed; }
.dot.expert.filled { background: var(--color-gold); border-color: var(--color-gold); }
.bonus { font-weight: var(--weight-bold); min-width: 2.5ch; text-align: right; font-size: var(--text-sm); }
.name { flex: 1; font-size: var(--text-sm); }
.ability { font-size: var(--text-xs); color: var(--color-muted); }
```

- [ ] Run all tests to verify nothing is broken:
```bash
npx vitest run
```

- [ ] Commit:
```bash
git add src/components/StatBlock/ src/components/SkillRow/
git commit -m "feat: add StatBlock and SkillRow components"
```

---

### Task 15: CurrencyRow, SpellCard, and FeatureCard components

**Files:**
- Create: `src/components/CurrencyRow/CurrencyRow.jsx`, `src/components/CurrencyRow/CurrencyRow.module.css`
- Create: `src/components/SpellCard/SpellCard.jsx`, `src/components/SpellCard/SpellCard.module.css`
- Create: `src/components/FeatureCard/FeatureCard.jsx`, `src/components/FeatureCard/FeatureCard.module.css`

- [ ] Create `src/components/CurrencyRow/CurrencyRow.jsx`:
```jsx
import styles from './CurrencyRow.module.css'

const COINS = [
  { key: 'cp', label: 'CP' },
  { key: 'sp', label: 'SP' },
  { key: 'ep', label: 'EP', advancedOnly: true },
  { key: 'gp', label: 'GP' },
  { key: 'pp', label: 'PP' },
]

export default function CurrencyRow({ currency, onChange, advancedMode }) {
  const visibleCoins = COINS.filter(c => !c.advancedOnly || advancedMode)
  return (
    <div className={styles.row}>
      {visibleCoins.map(({ key, label }) => (
        <label key={key} className={styles.coin}>
          <span className="label">{label}</span>
          <input
            type="number" min="0"
            value={currency[key]}
            onChange={e => onChange({ ...currency, [key]: Math.max(0, parseInt(e.target.value) || 0) })}
            className={styles.input}
          />
        </label>
      ))}
    </div>
  )
}
```

- [ ] Create `src/components/CurrencyRow/CurrencyRow.module.css`:
```css
.row { display: flex; gap: var(--space-md); flex-wrap: wrap; align-items: flex-end; }
.coin { display: flex; flex-direction: column; gap: 2px; }
.input { width: 64px; text-align: center; }
```

- [ ] Create `src/components/SpellCard/SpellCard.jsx`:
```jsx
import { useState } from 'react'
import Badge from '../Badge/Badge'
import styles from './SpellCard.module.css'

export default function SpellCard({ spell, prepared, onTogglePrepared, isCustom }) {
  const [expanded, setExpanded] = useState(false)
  const levelLabel = spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`

  return (
    <div className={`${styles.card} ${prepared ? styles.prepared : ''}`}>
      <div className={styles.header} onClick={() => setExpanded(v => !v)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setExpanded(v => !v)}>
        <div className={styles.meta}>
          <span className={styles.level}>{levelLabel}</span>
          <span className={styles.school}>{spell.school}</span>
        </div>
        <h4 className={styles.name}>{spell.name}</h4>
        <div className={styles.actions}>
          {isCustom && <Badge variant="custom">Custom</Badge>}
          {spell.level > 0 && onTogglePrepared && (
            <button
              className={`${styles.prepBtn} ${prepared ? styles.prepBtnActive : ''}`}
              onClick={e => { e.stopPropagation(); onTogglePrepared() }}
              aria-pressed={prepared}
            >
              {prepared ? 'Prepared' : 'Prepare'}
            </button>
          )}
          <span className={styles.chevron}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      {expanded && (
        <div className={styles.body}>
          <div className={styles.stats}>
            <span><strong>Casting Time:</strong> {spell.castingTime}</span>
            <span><strong>Range:</strong> {spell.range}</span>
            <span><strong>Components:</strong> {spell.components}</span>
            <span><strong>Duration:</strong> {spell.duration}</span>
          </div>
          <p className={styles.desc}>{spell.description}</p>
        </div>
      )}
    </div>
  )
}
```

- [ ] Create `src/components/SpellCard/SpellCard.module.css`:
```css
.card {
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  overflow: hidden;
  transition: border-color var(--transition);
}
.card.prepared { border-color: var(--color-accent); }
.header {
  display: flex; align-items: center; gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  cursor: pointer;
  background: var(--color-surface-raised);
}
.header:hover { background: var(--color-parchment-dark); }
.meta { display: flex; gap: var(--space-xs); flex-direction: column; min-width: 80px; }
.level { font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--color-accent); text-transform: uppercase; }
.school { font-size: var(--text-xs); color: var(--color-muted); font-style: italic; }
.name { flex: 1; font-weight: var(--weight-medium); }
.actions { display: flex; align-items: center; gap: var(--space-sm); }
.prepBtn { font-size: var(--text-xs); padding: 2px var(--space-xs); border: 1px solid var(--color-border); border-radius: var(--radius-sm); }
.prepBtnActive { background: var(--color-accent); color: white; border-color: var(--color-accent); }
.chevron { font-size: var(--text-xs); color: var(--color-muted); }
.body { padding: var(--space-md); }
.stats { display: flex; flex-wrap: wrap; gap: var(--space-sm) var(--space-lg); font-size: var(--text-sm); margin-bottom: var(--space-sm); }
.desc { font-size: var(--text-sm); line-height: 1.6; }
```

- [ ] Create `src/components/FeatureCard/FeatureCard.jsx`:
```jsx
import { useState } from 'react'
import PipTracker from '../PipTracker/PipTracker'
import styles from './FeatureCard.module.css'

export default function FeatureCard({ feature, onUseChange }) {
  const [expanded, setExpanded] = useState(false)
  const hasUses = feature.maxUses != null

  return (
    <div className={styles.card}>
      <div className={styles.header} onClick={() => setExpanded(v => !v)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setExpanded(v => !v)}>
        <h4 className={styles.name}>{feature.name}</h4>
        <div className={styles.meta}>
          {feature.recharge && (
            <span className="label">{feature.recharge.replace('-', ' ')}</span>
          )}
          {hasUses && (
            <PipTracker
              total={feature.maxUses}
              used={feature.uses}
              onChange={v => onUseChange?.(feature.id, v)}
              label=""
            />
          )}
          <span className={styles.chevron}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      {expanded && <p className={styles.desc}>{feature.description}</p>}
    </div>
  )
}
```

- [ ] Create `src/components/FeatureCard/FeatureCard.module.css`:
```css
.card {
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  overflow: hidden;
}
.header {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  cursor: pointer;
  background: var(--color-surface-raised);
}
.header:hover { background: var(--color-parchment-dark); }
.name { font-weight: var(--weight-medium); }
.meta { display: flex; align-items: center; gap: var(--space-md); }
.chevron { font-size: var(--text-xs); color: var(--color-muted); }
.desc {
  padding: var(--space-md);
  font-size: var(--text-sm);
  line-height: 1.6;
  border-top: 1px solid var(--color-border-light);
}
```

- [ ] Run all tests to verify nothing is broken:
```bash
npx vitest run
```

- [ ] Commit:
```bash
git add src/components/CurrencyRow/ src/components/SpellCard/ src/components/FeatureCard/
git commit -m "feat: add CurrencyRow, SpellCard, and FeatureCard components"
```

---

## Chunk 4: Roster Page

### Task 16: Roster page

**Files:**
- Create: `src/utils/export.js`
- Create: `src/pages/Roster/CharacterCard.jsx`, `src/pages/Roster/CharacterCard.module.css`
- Create: `src/pages/Roster/Roster.jsx`, `src/pages/Roster/Roster.module.css`
- Modify: `src/App.jsx`

- [ ] Write failing test — create `src/tests/pages/Roster.test.jsx`:
```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import Roster from '../../pages/Roster/Roster'

function renderRoster() {
  return render(<MemoryRouter><Roster /></MemoryRouter>)
}

describe('Roster', () => {
  beforeEach(() => {
    useCharacterStore.setState({ characters: [] })
  })

  it('shows empty state when no characters', () => {
    renderRoster()
    expect(screen.getByText(/no characters yet/i)).toBeInTheDocument()
  })

  it('shows character cards when characters exist', () => {
    useCharacterStore.setState({
      characters: [{
        id: '1', schemaVersion: 1,
        meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 3, xp: 900, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null },
        abilityScores: { str:8,dex:14,con:12,int:16,wis:13,cha:10 },
        proficiencies: { savingThrows:[],skills:[],expertise:[],tools:[],languages:[],armor:[],weapons:[] },
        hp: { max:16,current:16,temp:0,hitDiceTotal:3,hitDiceRemaining:3 },
        deathSaves: { successes:0,failures:0 },
        combat: { acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false },
        currency:{cp:0,sp:0,ep:0,gp:10,pp:0}, equipment:[], attacks:[],
        spells:{ability:'int',slots:{1:{max:4,used:0},2:{max:2,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:[],known:[],arcaneRecoveryUsed:false},
        features:[], conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
        biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
        customSpells:[], settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
      }],
    })
    renderRoster()
    expect(screen.getByText('Aria')).toBeInTheDocument()
    expect(screen.getByText(/level 3/i)).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: /xp progress/i })).toBeInTheDocument()
  })

  it('deletes a character after confirmation', async () => {
    useCharacterStore.setState({
      characters: [{ id: '1', schemaVersion: 1, meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 1, xp: 0, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null }, abilityScores:{str:8,dex:14,con:12,int:16,wis:13,cha:10}, proficiencies:{savingThrows:[],skills:[],expertise:[],tools:[],languages:[],armor:[],weapons:[]}, hp:{max:8,current:8,temp:0,hitDiceTotal:1,hitDiceRemaining:1}, deathSaves:{successes:0,failures:0}, combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false}, currency:{cp:0,sp:0,ep:0,gp:0,pp:0}, equipment:[], attacks:[], spells:{ability:null,slots:{1:{max:0,used:0},2:{max:0,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:[],known:[],arcaneRecoveryUsed:false}, features:[], conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false}, biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''}, customSpells:[], settings:{advancedMode:false,abilityScoreMethod:'standard-array'} }],
    })
    renderRoster()
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }))
    expect(useCharacterStore.getState().characters).toHaveLength(0)
  })
})
```

- [ ] Run to confirm failure:
```bash
npx vitest run src/tests/pages/Roster.test.jsx
```

- [ ] Create `src/utils/export.js`:
```js
export function exportCharacter(character) {
  const json = JSON.stringify(character, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${character.meta.characterName.replace(/\s+/g, '_')}.json`
  a.click()
  URL.revokeObjectURL(url)
}
```

- [ ] Create `src/pages/Roster/CharacterCard.jsx`:
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getXpThreshold } from '../../utils/calculations'
import styles from './CharacterCard.module.css'

export default function CharacterCard({ character, onDelete, onExport }) {
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const { meta } = character
  const xpNext = getXpThreshold(meta.level)
  const xpPct = xpNext > 0 ? Math.min(100, Math.round((meta.xp / xpNext) * 100)) : 100

  return (
    <div className={styles.card}>
      <div className={styles.portrait} aria-hidden="true">
        {meta.characterName.charAt(0).toUpperCase()}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{meta.characterName}</h3>
        <p className={styles.details}>
          Level {meta.level} {meta.race} {meta.class}
        </p>
        {meta.playerName && <p className={styles.player}>Player: {meta.playerName}</p>}
        <div className={styles.xpBar} role="progressbar" aria-valuenow={meta.xp} aria-valuemax={xpNext} aria-label="XP progress">
          <div className={styles.xpFill} style={{ width: `${xpPct}%` }} />
        </div>
        <p className={styles.xpLabel}>{meta.xp} / {xpNext} XP</p>
      </div>
      <div className={styles.actions}>
        <button className={styles.primary} onClick={() => navigate(`/character/${character.id}`)}>
          Open
        </button>
        <button onClick={() => onExport(character)}>Export</button>
        {!confirming
          ? <button className={styles.danger} onClick={() => setConfirming(true)} aria-label="Delete character">Delete</button>
          : <>
              <span className={styles.confirmText}>Delete {meta.characterName}?</span>
              <button className={styles.danger} onClick={() => onDelete(character.id)} aria-label="Confirm delete">Confirm</button>
              <button onClick={() => setConfirming(false)}>Cancel</button>
            </>
        }
      </div>
    </div>
  )
}
```

- [ ] Create `src/pages/Roster/CharacterCard.module.css`:
```css
.card {
  display: flex; align-items: center; gap: var(--space-md);
  padding: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition);
}
.card:hover { box-shadow: var(--shadow-md); }
.portrait {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--color-accent);
  color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--text-xl);
  font-family: var(--font-serif);
  font-weight: var(--weight-bold);
  flex-shrink: 0;
}
.info { flex: 1; min-width: 0; }
.name { font-family: var(--font-serif); font-size: var(--text-md); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.details { font-size: var(--text-sm); color: var(--color-muted); text-transform: capitalize; }
.player { font-size: var(--text-xs); color: var(--color-muted); }
.actions { display: flex; align-items: center; gap: var(--space-sm); flex-wrap: wrap; justify-content: flex-end; }
.primary { background: var(--color-accent); color: white; padding: var(--space-xs) var(--space-md); border-radius: var(--radius-sm); }
.primary:hover { background: var(--color-accent-hover); }
.danger { color: var(--color-danger); }
.confirmText { font-size: var(--text-sm); color: var(--color-danger); }
.xpBar { height: 4px; background: var(--color-border); border-radius: 2px; margin-top: var(--space-xs); overflow: hidden; }
.xpFill { height: 100%; background: var(--color-accent); border-radius: 2px; transition: width 0.3s ease; }
.xpLabel { font-size: var(--text-xs); color: var(--color-muted); margin-top: 2px; }
```

- [ ] Create `src/pages/Roster/Roster.jsx`:
```jsx
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import { useSettingsStore } from '../../store/settings'
import { withDefaults, validateCharacterImport } from '../../utils/validators'
import { generateId } from '../../utils/ids'
import { exportCharacter } from '../../utils/export'
import CharacterCard from './CharacterCard'
import styles from './Roster.module.css'

export default function Roster() {
  const { characters, deleteCharacter, addCharacter } = useCharacterStore()
  const { globalAdvancedMode, toggleGlobalAdvancedMode } = useSettingsStore()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result)
        const { valid, error, warnings } = validateCharacterImport(data)
        if (!valid) { alert(`Import failed: ${error}`); return }
        if (warnings.includes('schema-version-mismatch')) {
          if (!confirm('This file was created with a different version. Attempt import anyway?')) return
        }
        addCharacter({ ...withDefaults(data), id: generateId() })
      } catch {
        alert('Import failed: file is not valid JSON.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Characters</h1>
        <div className={styles.headerActions}>
          <label className={styles.toggle}>
            <input type="checkbox" checked={globalAdvancedMode} onChange={toggleGlobalAdvancedMode} />
            Advanced Mode
          </label>
          <button onClick={() => fileInputRef.current?.click()}>Import JSON</button>
          <input ref={fileInputRef} type="file" accept=".json" hidden onChange={handleImport} />
          <button className={styles.newBtn} onClick={() => navigate('/new')}>+ New Character</button>
        </div>
      </header>

      {characters.length === 0 ? (
        <div className={styles.empty}>
          <p>No characters yet. Create one to get started!</p>
          <button className={styles.newBtn} onClick={() => navigate('/new')}>Create Your First Character</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {characters.map(char => (
            <CharacterCard
              key={char.id}
              character={char}
              onDelete={deleteCharacter}
              onExport={exportCharacter}
            />
          ))}
        </div>
      )}

      {globalAdvancedMode && (
        <div className={styles.homebrew}>
          <button onClick={() => navigate('/homebrew')}>Manage Homebrew</button>
        </div>
      )}
    </div>
  )
}
```

- [ ] Create `src/pages/Roster/Roster.module.css`:
```css
.page { max-width: 900px; margin: 0 auto; padding: var(--space-2xl) var(--space-md); }
.header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: var(--space-xl);
  flex-wrap: wrap; gap: var(--space-md);
}
.headerActions { display: flex; align-items: center; gap: var(--space-md); }
.toggle { display: flex; align-items: center; gap: var(--space-xs); font-size: var(--text-sm); cursor: pointer; }
.newBtn { background: var(--color-accent); color: white; padding: var(--space-xs) var(--space-md); border-radius: var(--radius-sm); font-weight: var(--weight-medium); }
.newBtn:hover { background: var(--color-accent-hover); }
.empty { text-align: center; padding: var(--space-2xl); display: flex; flex-direction: column; align-items: center; gap: var(--space-md); color: var(--color-muted); }
.grid { display: flex; flex-direction: column; gap: var(--space-md); }
.homebrew { margin-top: var(--space-lg); padding-top: var(--space-lg); border-top: 1px solid var(--color-border-light); }
```

- [ ] Update `src/App.jsx` to use the real Roster component:
```jsx
import { Routes, Route } from 'react-router-dom'
import Roster from './pages/Roster/Roster'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Roster />} />
      <Route path="/new" element={<div>Wizard placeholder</div>} />
      <Route path="/character/:id" element={<div>Sheet placeholder</div>} />
      <Route path="/character/:id/print" element={<div>Print placeholder</div>} />
    </Routes>
  )
}
```

- [ ] Run tests to confirm they pass:
```bash
npx vitest run src/tests/pages/Roster.test.jsx
```
Expected: all 3 tests pass

- [ ] Run all tests to confirm nothing is broken:
```bash
npx vitest run
```

- [ ] Commit:
```bash
git add src/utils/export.js src/pages/Roster/ src/tests/pages/Roster.test.jsx src/App.jsx
git commit -m "feat: add Roster page with character cards, import, and export"
```

---

## Chunk 5: Creation Wizard

### Task 17: Creation Wizard (6-step flow)

**Files:**
- Create: `src/utils/buildCharacterFromDraft.js`
- Create: `src/tests/utils/buildCharacterFromDraft.test.js`
- Create: `src/pages/Wizard/WizardContext.jsx`
- Create: `src/pages/Wizard/Wizard.jsx`, `src/pages/Wizard/Wizard.module.css`
- Create: `src/pages/Wizard/WizardStep.jsx`, `src/pages/Wizard/WizardStep.module.css`
- Create: `src/pages/Wizard/Step1Name.jsx`
- Create: `src/pages/Wizard/Step2Race.jsx`
- Create: `src/pages/Wizard/Step3Class.jsx`
- Create: `src/pages/Wizard/Step4Background.jsx`
- Create: `src/pages/Wizard/Step5Abilities.jsx`, `src/pages/Wizard/Step5Abilities.module.css`
- Create: `src/pages/Wizard/Step6Review.jsx`
- Create: `src/tests/pages/Wizard.test.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Verify `src/data/classes.json` already has skill choice structure**

No modification to `classes.json` is needed. Task 6 (Chunk 2) already defined each class with:
```json
"skillChoices": { "count": 2, "options": ["history","insight","medicine","persuasion","religion"] }
```
This structure (`skillChoices.count` and `skillChoices.options`) is what `Step3Class.jsx` will use. Do NOT add flat `skillChoices` or `numSkillChoices` fields — they would conflict.

- [ ] **Step 2: Write failing tests** — create `src/tests/utils/buildCharacterFromDraft.test.js`:

```js
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
```

- [ ] **Step 3: Run to confirm failure**:
```bash
npx vitest run src/tests/utils/buildCharacterFromDraft.test.js
```
Expected: FAIL — module not found

- [ ] **Step 4: Create `src/utils/buildCharacterFromDraft.js`**:
```js
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

  // Ability bonuses: subrace overrides race
  const allBonuses = { ...(raceData.abilityScoreIncreases || {}), ...(subraceData.abilityScoreIncreases || {}) }
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
  // spellSlotProgression is an object keyed by level string: { "1": {"1": 2, "2": 0, ...}, "2": {...} }
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
```

- [ ] **Step 5: Run tests to confirm they pass**:
```bash
npx vitest run src/tests/utils/buildCharacterFromDraft.test.js
```
Expected: all 5 tests pass

- [ ] **Step 6: Create `src/pages/Wizard/WizardContext.jsx`**:
```jsx
import { createContext, useContext, useState } from 'react'

export const EMPTY_DRAFT = {
  meta: {
    characterName: '', playerName: '', alignment: 'True Neutral',
    race: null, subrace: null, class: null, background: null,
    level: 1, xp: 0, inspiration: false, secondaryClass: null,
  },
  abilityScores: { str: null, dex: null, con: null, int: null, wis: null, cha: null },
  classSkillChoices: [],
  settings: { advancedMode: false, abilityScoreMethod: 'standard-array' },
}

const WizardContext = createContext(null)

export function WizardProvider({ children, globalAdvancedMode }) {
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState({
    ...EMPTY_DRAFT,
    settings: { advancedMode: globalAdvancedMode, abilityScoreMethod: 'standard-array' },
  })

  function updateMeta(patch) { setDraft(p => ({ ...p, meta: { ...p.meta, ...patch } })) }
  function updateAbilities(patch) { setDraft(p => ({ ...p, abilityScores: { ...p.abilityScores, ...patch } })) }
  function updateSettings(patch) { setDraft(p => ({ ...p, settings: { ...p.settings, ...patch } })) }
  function setClassSkillChoices(choices) { setDraft(p => ({ ...p, classSkillChoices: choices })) }
  function resetAbilityScores(scores) { setDraft(p => ({ ...p, abilityScores: scores })) }

  return (
    <WizardContext.Provider value={{ step, setStep, draft, updateMeta, updateAbilities, updateSettings, setClassSkillChoices, resetAbilityScores }}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() { return useContext(WizardContext) }
```

- [ ] **Step 7: Create `src/pages/Wizard/WizardStep.jsx`**:
```jsx
import { useWizard } from './WizardContext'
import styles from './WizardStep.module.css'

export default function WizardStep({ title, nextDisabled = false, onNext, children }) {
  const { step, setStep } = useWizard()

  function handleNext() {
    if (onNext) onNext()
    else setStep(s => s + 1)
  }

  return (
    <section className={styles.step}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.body}>{children}</div>
      <footer className={styles.nav}>
        {step > 1 && (
          <button type="button" className={styles.back} onClick={() => setStep(s => s - 1)}>
            Back
          </button>
        )}
        <button type="button" className={styles.next} disabled={nextDisabled} onClick={handleNext}>
          {step === 6 ? 'Create Character' : 'Next →'}
        </button>
      </footer>
    </section>
  )
}
```

- [ ] **Step 8: Create `src/pages/Wizard/WizardStep.module.css`**:
```css
.step { display: flex; flex-direction: column; gap: var(--space-lg); }
.title { font-family: var(--font-serif); font-size: var(--text-xl); }
.body { display: flex; flex-direction: column; gap: var(--space-md); }
.nav { display: flex; justify-content: space-between; gap: var(--space-md); padding-top: var(--space-lg); border-top: 1px solid var(--color-border-light); }
.back { color: var(--color-muted); }
.next { background: var(--color-accent); color: white; padding: var(--space-xs) var(--space-xl); border-radius: var(--radius-sm); font-weight: var(--weight-medium); margin-left: auto; }
.next:hover:not(:disabled) { background: var(--color-accent-hover); }
.next:disabled { opacity: 0.4; cursor: not-allowed; }
```


- [ ] **Step 9: Create `src/pages/Wizard/Step1Name.jsx`**:
```jsx
import { useWizard } from './WizardContext'
import WizardStep from './WizardStep'

const ALIGNMENTS = [
  'Lawful Good','Neutral Good','Chaotic Good',
  'Lawful Neutral','True Neutral','Chaotic Neutral',
  'Lawful Evil','Neutral Evil','Chaotic Evil',
]

export default function Step1Name() {
  const { draft, updateMeta } = useWizard()
  const { meta } = draft
  const canProceed = meta.characterName.trim().length > 0

  return (
    <WizardStep title="Name & Biography" nextDisabled={!canProceed}>
      <label>
        Character Name <span aria-hidden="true">*</span>
        <input type="text" value={meta.characterName} autoFocus required
          onChange={e => updateMeta({ characterName: e.target.value })}
          placeholder="Enter character name" />
      </label>
      <label>
        Player Name
        <input type="text" value={meta.playerName}
          onChange={e => updateMeta({ playerName: e.target.value })}
          placeholder="Optional" />
      </label>
      <label>
        Alignment
        <select value={meta.alignment} onChange={e => updateMeta({ alignment: e.target.value })}>
          {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </label>
    </WizardStep>
  )
}
```

- [ ] **Step 10: Create `src/pages/Wizard/Step2Race.jsx`**:
```jsx
import { useWizard } from './WizardContext'
import WizardStep from './WizardStep'
import races from '../../data/races.json'
import { useHomebrewStore } from '../../store/homebrew'

export default function Step2Race() {
  const { draft, updateMeta } = useWizard()
  const { meta, settings } = draft
  const { homebrewRaces } = useHomebrewStore()
  const allRaces = settings.advancedMode ? [...races, ...homebrewRaces] : races
  const selected = allRaces.find(r => r.id === meta.race)
  const subraces = selected?.subraces || []
  const subraceData = subraces.find(s => s.id === meta.subrace)
  const canProceed = meta.race !== null && (subraces.length === 0 || meta.subrace !== null)

  function handleRaceChange(id) { updateMeta({ race: id || null, subrace: null }) }

  // Merge base + subrace ability bonuses for display
  const bonuses = { ...(selected?.abilityScoreIncreases || {}), ...(subraceData?.abilityScoreIncreases || {}) }
  const bonusText = Object.entries(bonuses).map(([k, v]) => `${k.toUpperCase()} +${v}`).join(', ')
  const traits = [...(selected?.traits || []), ...(subraceData?.traits || [])]

  return (
    <WizardStep title="Choose Your Race" nextDisabled={!canProceed}>
      <label>
        Race
        <select value={meta.race || ''} onChange={e => handleRaceChange(e.target.value)}>
          <option value="">Select a race…</option>
          {allRaces.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </label>
      {subraces.length > 0 && (
        <label>
          Subrace
          <select value={meta.subrace || ''} onChange={e => updateMeta({ subrace: e.target.value || null })}>
            <option value="">Select a subrace…</option>
            {subraces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
      )}
      {selected && (
        <div>
          {bonusText && <p><strong>Ability Bonuses:</strong> {bonusText}</p>}
          <p><strong>Speed:</strong> {subraceData?.speed ?? selected.speed} ft.</p>
          {traits.map(t => (
            <details key={t.name}><summary><strong>{t.name}</strong></summary><p>{t.description}</p></details>
          ))}
        </div>
      )}
    </WizardStep>
  )
}
```

- [ ] **Step 11: Create `src/pages/Wizard/Step3Class.jsx`**:
```jsx
import { useWizard } from './WizardContext'
import WizardStep from './WizardStep'
import classes from '../../data/classes.json'
import skills from '../../data/skills.json'
import { useHomebrewStore } from '../../store/homebrew'

export default function Step3Class() {
  const { draft, updateMeta, setClassSkillChoices } = useWizard()
  const { meta, classSkillChoices, settings } = draft
  const { homebrewClasses } = useHomebrewStore()
  const allClasses = settings.advancedMode ? [...classes, ...homebrewClasses] : classes
  const selected = allClasses.find(c => c.id === meta.class)
  const numChoices = selected?.skillChoices?.count || 0
  const canProceed = meta.class !== null && classSkillChoices.length === numChoices

  function toggleSkill(id) {
    if (classSkillChoices.includes(id)) {
      setClassSkillChoices(classSkillChoices.filter(s => s !== id))
    } else if (classSkillChoices.length < numChoices) {
      setClassSkillChoices([...classSkillChoices, id])
    }
  }

  function handleClassChange(id) {
    updateMeta({ class: id || null })
    setClassSkillChoices([])
  }

  return (
    <WizardStep title="Choose Your Class" nextDisabled={!canProceed}>
      <label>
        Class
        <select value={meta.class || ''} onChange={e => handleClassChange(e.target.value)}>
          <option value="">Select a class…</option>
          {allClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>
      {selected && (
        <div>
          <p><strong>Hit Die:</strong> d{selected.hitDie}</p>
          <p><strong>Saving Throws:</strong> {selected.savingThrowProficiencies.map(s => s.toUpperCase()).join(', ')}</p>
          {selected.armorProficiencies.length > 0 && (
            <p><strong>Armor:</strong> {selected.armorProficiencies.join(', ')}</p>
          )}
          <p><strong>Weapons:</strong> {selected.weaponProficiencies.join(', ')}</p>
          <p><strong>Choose {numChoices} skills:</strong></p>
          <div role="group" aria-label="Skill choices">
            {(selected.skillChoices?.options || []).map(skillId => {
              const skill = skills.find(s => s.id === skillId)
              const checked = classSkillChoices.includes(skillId)
              const disabled = !checked && classSkillChoices.length >= numChoices
              return (
                <label key={skillId}>
                  <input type="checkbox" checked={checked} disabled={disabled}
                    onChange={() => toggleSkill(skillId)} />
                  {skill?.name || skillId}
                </label>
              )
            })}
          </div>
          {(selected.features || []).filter(f => f.level === 1).map(f => (
            <details key={f.name}><summary><strong>{f.name}</strong></summary><p>{f.description}</p></details>
          ))}
        </div>
      )}
    </WizardStep>
  )
}
```

- [ ] **Step 12: Create `src/pages/Wizard/Step4Background.jsx`**:
```jsx
import { useWizard } from './WizardContext'
import WizardStep from './WizardStep'
import backgrounds from '../../data/backgrounds.json'

export default function Step4Background() {
  const { draft, updateMeta } = useWizard()
  const { meta } = draft
  const selected = backgrounds.find(b => b.id === meta.background)

  return (
    <WizardStep title="Choose Your Background" nextDisabled={meta.background === null}>
      <label>
        Background
        <select value={meta.background || ''} onChange={e => updateMeta({ background: e.target.value || null })}>
          <option value="">Select a background…</option>
          {backgrounds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </label>
      {selected && (
        <div>
          <p><strong>Skills:</strong> {selected.skillProficiencies.join(', ')}</p>
          {selected.toolProficiencies.length > 0 && (
            <p><strong>Tools:</strong> {selected.toolProficiencies.join(', ')}</p>
          )}
          {selected.languages?.length > 0 && (
            <p><strong>Languages:</strong> {selected.languages.join(', ')}</p>
          )}
          <details>
            <summary><strong>Feature — {selected.feature.name}</strong></summary>
            <p>{selected.feature.description}</p>
          </details>
        </div>
      )}
    </WizardStep>
  )
}
```


- [ ] **Step 13: Create `src/pages/Wizard/Step5Abilities.jsx`**:
```jsx
import { useWizard } from './WizardContext'
import WizardStep from './WizardStep'
import { getAbilityModifier } from '../../utils/calculations'
import styles from './Step5Abilities.module.css'

const ABILITIES = ['str','dex','con','int','wis','cha']
const LABELS = { str:'STR', dex:'DEX', con:'CON', int:'INT', wis:'WIS', cha:'CHA' }
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8]
const PB_COSTS = { 8:0, 9:1, 10:2, 11:3, 12:4, 13:5, 14:7, 15:9 }
const PB_BUDGET = 27

function allScoresFilled(scores, method) {
  if (method === 'standard-array') {
    const vals = ABILITIES.map(a => scores[a])
    return vals.every(v => v !== null) && new Set(vals).size === 6
  }
  return ABILITIES.every(a => scores[a] !== null && Number.isInteger(scores[a]))
}

export default function Step5Abilities() {
  const { draft, updateAbilities, updateSettings, resetAbilityScores } = useWizard()
  const { abilityScores: scores, settings } = draft
  const { abilityScoreMethod: method, advancedMode } = settings

  const canProceed = allScoresFilled(scores, method)

  const pointsSpent = method === 'point-buy'
    ? ABILITIES.reduce((s, a) => s + (PB_COSTS[scores[a]] ?? 0), 0)
    : 0
  const pointsLeft = PB_BUDGET - pointsSpent

  function changeMethod(m) {
    updateSettings({ abilityScoreMethod: m })
    resetAbilityScores(
      m === 'point-buy'
        ? { str:8, dex:8, con:8, int:8, wis:8, cha:8 }
        : { str:null, dex:null, con:null, int:null, wis:null, cha:null }
    )
  }

  function getAvailable(forAbility) {
    const used = ABILITIES.filter(a => a !== forAbility && scores[a] !== null).map(a => scores[a])
    const available = STANDARD_ARRAY.filter(v => !used.includes(v))
    return available
  }

  return (
    <WizardStep title="Ability Scores" nextDisabled={!canProceed}>
      {advancedMode && (
        <div className={styles.methods}>
          {[['standard-array','Standard Array'],['point-buy','Point Buy'],['manual','Manual Entry']].map(([val, label]) => (
            <label key={val} className={styles.methodLabel}>
              <input type="radio" name="method" value={val} checked={method === val} onChange={() => changeMethod(val)} />
              {label}
            </label>
          ))}
        </div>
      )}

      {method === 'point-buy' && (
        <p className={styles.budget}>Points remaining: <strong>{pointsLeft}</strong> / {PB_BUDGET}</p>
      )}

      <div className={styles.grid}>
        {ABILITIES.map(ability => {
          const score = scores[ability]
          const mod = score !== null ? getAbilityModifier(score) : null
          return (
            <div key={ability} className={styles.row}>
              <span className={styles.label}>{LABELS[ability]}</span>

              {method === 'standard-array' && (
                <select value={score ?? ''} onChange={e => updateAbilities({ [ability]: e.target.value !== '' ? Number(e.target.value) : null })}>
                  <option value="">—</option>
                  {/* always include current value even if already counted in "used" */}
                  {[...(score !== null ? [score] : []), ...getAvailable(ability)].sort((a,b) => b-a).map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              )}

              {method === 'point-buy' && (
                <div className={styles.pbRow}>
                  <button type="button" onClick={() => { if (score > 8) updateAbilities({ [ability]: score - 1 }) }} disabled={score <= 8} aria-label={`Decrease ${ability}`}>−</button>
                  <span className={styles.score}>{score}</span>
                  <button type="button"
                    onClick={() => { if (score < 15 && pointsLeft >= (PB_COSTS[score+1] - PB_COSTS[score])) updateAbilities({ [ability]: score + 1 }) }}
                    disabled={score >= 15 || pointsLeft < ((PB_COSTS[score + 1] ?? 99) - PB_COSTS[score])}
                    aria-label={`Increase ${ability}`}>+</button>
                </div>
              )}

              {method === 'manual' && (
                <input type="number" value={score ?? ''} min={1} max={30}
                  onChange={e => updateAbilities({ [ability]: e.target.value !== '' ? parseInt(e.target.value, 10) : null })} />
              )}

              <span className={styles.mod}>{mod !== null ? (mod >= 0 ? `+${mod}` : `${mod}`) : '—'}</span>
            </div>
          )
        })}
      </div>
    </WizardStep>
  )
}
```

- [ ] **Step 14: Create `src/pages/Wizard/Step5Abilities.module.css`**:
```css
.methods { display: flex; gap: var(--space-lg); margin-bottom: var(--space-sm); }
.methodLabel { display: flex; align-items: center; gap: var(--space-xs); font-size: var(--text-sm); cursor: pointer; }
.budget { font-size: var(--text-sm); color: var(--color-muted); }
.grid { display: flex; flex-direction: column; gap: var(--space-sm); }
.row { display: grid; grid-template-columns: 50px 1fr 60px; align-items: center; gap: var(--space-md); }
.label { font-weight: var(--weight-bold); font-size: var(--text-sm); text-align: center; }
.score { text-align: center; min-width: 2ch; }
.mod { text-align: center; color: var(--color-muted); font-size: var(--text-sm); }
.pbRow { display: flex; align-items: center; gap: var(--space-sm); }
```

- [ ] **Step 15: Create `src/pages/Wizard/Step6Review.jsx`**:
```jsx
import { useNavigate } from 'react-router-dom'
import { useWizard } from './WizardContext'
import WizardStep from './WizardStep'
import { useCharacterStore } from '../../store/characters'
import { buildCharacterFromDraft } from '../../utils/buildCharacterFromDraft'
import { getAbilityModifier, getProficiencyBonus } from '../../utils/calculations'
import races from '../../data/races.json'
import classes from '../../data/classes.json'
import backgrounds from '../../data/backgrounds.json'

export default function Step6Review() {
  const { draft } = useWizard()
  const { meta, abilityScores, settings } = draft
  const { addCharacter } = useCharacterStore()
  const navigate = useNavigate()

  const raceData = races.find(r => r.id === meta.race)
  const subraceData = (raceData?.subraces || []).find(s => s.id === meta.subrace)
  const classData = classes.find(c => c.id === meta.class)
  const bgData = backgrounds.find(b => b.id === meta.background)
  const allBonuses = { ...(raceData?.abilityScoreIncreases || {}), ...(subraceData?.abilityScoreIncreases || {}) }

  const finalScores = Object.fromEntries(
    ['str','dex','con','int','wis','cha'].map(k => [k, (abilityScores[k] || 10) + (allBonuses[k] || 0)])
  )
  const conMod = getAbilityModifier(finalScores.con)
  const maxHp = Math.max(1, (classData?.hitDie || 6) + conMod)

  function handleConfirm() {
    const character = buildCharacterFromDraft(draft)
    addCharacter(character)
    navigate(`/character/${character.id}`)
  }

  return (
    <WizardStep title="Review & Confirm" onNext={handleConfirm}>
      <div>
        <h3>{meta.characterName}</h3>
        {meta.playerName && <p>Player: {meta.playerName}</p>}
        <p>{meta.alignment}</p>
        <p>
          Level 1 {raceData?.name}{subraceData ? ` (${subraceData.name})` : ''}{' '}
          {classData?.name}
        </p>
        <p>Background: {bgData?.name}</p>
        <p>Proficiency Bonus: +{getProficiencyBonus(1)}</p>
        <p>Starting HP: {maxHp}</p>
      </div>
      <h4>Ability Scores</h4>
      <dl>
        {['str','dex','con','int','wis','cha'].map(a => {
          const base = abilityScores[a] || 10
          const bonus = allBonuses[a] || 0
          const final = base + bonus
          const mod = getAbilityModifier(final)
          return (
            <div key={a} style={{ display:'flex', gap:'var(--space-sm)' }}>
              <dt><strong>{a.toUpperCase()}</strong></dt>
              <dd>{final} ({mod >= 0 ? `+${mod}` : mod}){bonus !== 0 && ` — base ${base} + ${bonus} racial`}</dd>
            </div>
          )
        })}
      </dl>
    </WizardStep>
  )
}
```

- [ ] **Step 16: Create `src/pages/Wizard/Wizard.jsx`**:
```jsx
import { useSettingsStore } from '../../store/settings'
import { WizardProvider, useWizard } from './WizardContext'
import Step1Name from './Step1Name'
import Step2Race from './Step2Race'
import Step3Class from './Step3Class'
import Step4Background from './Step4Background'
import Step5Abilities from './Step5Abilities'
import Step6Review from './Step6Review'
import styles from './Wizard.module.css'

const STEPS = [Step1Name, Step2Race, Step3Class, Step4Background, Step5Abilities, Step6Review]
const STEP_LABELS = ['Name', 'Race', 'Class', 'Background', 'Abilities', 'Review']

function WizardInner() {
  const { step } = useWizard()
  const StepComponent = STEPS[step - 1]
  return (
    <div className={styles.wizard}>
      <nav className={styles.progress} aria-label="Creation steps">
        {STEP_LABELS.map((label, i) => (
          <span key={label}
            className={[styles.dot, i + 1 === step ? styles.active : '', i + 1 < step ? styles.done : ''].filter(Boolean).join(' ')}>
            {label}
          </span>
        ))}
      </nav>
      <StepComponent />
    </div>
  )
}

export default function Wizard() {
  const { globalAdvancedMode } = useSettingsStore()
  return (
    <WizardProvider globalAdvancedMode={globalAdvancedMode}>
      <WizardInner />
    </WizardProvider>
  )
}
```

- [ ] **Step 17: Create `src/pages/Wizard/Wizard.module.css`**:
```css
.wizard { max-width: 640px; margin: 0 auto; padding: var(--space-2xl) var(--space-md); display: flex; flex-direction: column; gap: var(--space-xl); }
.progress { display: flex; justify-content: center; gap: var(--space-sm); flex-wrap: wrap; }
.dot { padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-sm); font-size: var(--text-xs); background: var(--color-bg-alt); color: var(--color-muted); }
.active { background: var(--color-accent); color: white; font-weight: var(--weight-bold); }
.done { background: var(--color-bg-alt); color: var(--color-accent); }
```

- [ ] **Step 18: Write wizard integration tests** — create `src/tests/pages/Wizard.test.jsx`:
```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import Wizard from '../../pages/Wizard/Wizard'

function renderWizard() {
  return render(<MemoryRouter><Wizard /></MemoryRouter>)
}

describe('Wizard', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [] }) })

  it('Next is disabled on step 1 when name is empty, enabled when filled', async () => {
    renderWizard()
    const nextBtn = screen.getByRole('button', { name: /next/i })
    expect(nextBtn).toBeDisabled()
    await userEvent.type(screen.getByPlaceholderText(/enter character name/i), 'Aria')
    expect(nextBtn).not.toBeDisabled()
  })

  it('Step 5 Next disabled until all 6 standard array scores assigned', async () => {
    renderWizard()
    // fill name → advance
    await userEvent.type(screen.getByPlaceholderText(/enter character name/i), 'Aria')
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // step 2: select race
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /race/i }), 'human')
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // step 3: select class, pick skills
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /class/i }), 'fighter')
    const skillBoxes = screen.getAllByRole('checkbox')
    await userEvent.click(skillBoxes[0])
    await userEvent.click(skillBoxes[1])
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // step 4: select background
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /background/i }), 'soldier')
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // step 5: all dropdowns unset → Next disabled
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
    // assign all 6 values via selects
    const selects = screen.getAllByRole('combobox')
    let remaining = [15, 14, 13, 12, 10, 8]
    for (let i = 0; i < selects.length; i++) {
      await userEvent.selectOptions(selects[i], String(remaining[i]))
    }
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled()
  })
})
```

- [ ] **Step 19: Run wizard tests to confirm failure**:
```bash
npx vitest run src/tests/pages/Wizard.test.jsx
```
Expected: FAIL — module not found

- [ ] **Step 20: Update `src/App.jsx` to wire Wizard route**:
```jsx
import { Routes, Route } from 'react-router-dom'
import Roster from './pages/Roster/Roster'
import Wizard from './pages/Wizard/Wizard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Roster />} />
      <Route path="/new" element={<Wizard />} />
      <Route path="/character/:id" element={<div>Sheet placeholder</div>} />
      <Route path="/character/:id/print" element={<div>Print placeholder</div>} />
    </Routes>
  )
}
```

- [ ] **Step 21: Run wizard tests to confirm they pass**:
```bash
npx vitest run src/tests/pages/Wizard.test.jsx
```
Expected: all 2 tests pass

- [ ] **Step 22: Run full test suite**:
```bash
npx vitest run
```
Expected: all tests pass

- [ ] **Step 23: Commit**:
```bash
git add src/utils/buildCharacterFromDraft.js \
  src/pages/Wizard/ src/tests/utils/buildCharacterFromDraft.test.js \
  src/tests/pages/Wizard.test.jsx src/App.jsx
git commit -m "feat: add creation wizard with 6-step flow and buildCharacterFromDraft utility"
```

---

## Chunk 6: Sheet Foundation

### Task 18: Sheet layout + SummaryBar

**Files:**
- Create: `src/pages/Sheet/Sheet.jsx`, `src/pages/Sheet/Sheet.module.css`
- Create: `src/pages/Sheet/SummaryBar.jsx`, `src/pages/Sheet/SummaryBar.module.css`
- Create: `src/tests/pages/Sheet.test.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write failing tests** — create `src/tests/pages/Sheet.test.jsx`:
```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import Sheet from '../../pages/Sheet/Sheet'

const CHAR = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 3, xp: 300, inspiration: false, playerName: '', subrace: 'high-elf', background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores: { str:8, dex:16, con:12, int:17, wis:13, cha:10 },
  proficiencies: { savingThrows:['int','wis'], skills:['arcana','history'], expertise:[], tools:[], languages:['common','elvish'], armor:[], weapons:['daggers'] },
  hp: { max:16, current:16, temp:0, hitDiceTotal:3, hitDiceRemaining:3 },
  deathSaves: { successes:0, failures:0 },
  combat: { acFormula:'unarmored', acOverride:null, speed:30, initiative:null, equippedArmorId:null, equippedShield:false },
  currency:{cp:0,sp:0,ep:0,gp:10,pp:0}, equipment:[], attacks:[],
  spells:{ability:'int',slots:{1:{max:4,used:0},2:{max:2,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:[],known:['magic-missile'],arcaneRecoveryUsed:false},
  features:[], conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[], settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

function renderSheet() {
  return render(
    <MemoryRouter initialEntries={['/character/c1']}>
      <Routes><Route path="/character/:id" element={<Sheet />} /></Routes>
    </MemoryRouter>
  )
}

describe('Sheet', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [CHAR] }) })

  it('shows character name and class in summary bar', () => {
    renderSheet()
    expect(screen.getByText('Aria')).toBeInTheDocument()
    expect(screen.getByText(/wizard/i)).toBeInTheDocument()
  })

  it('updates current HP in store when edited', async () => {
    renderSheet()
    const hpInput = screen.getByRole('spinbutton', { name: /current hp/i })
    await userEvent.clear(hpInput)
    await userEvent.type(hpInput, '10')
    hpInput.blur()
    expect(useCharacterStore.getState().characters[0].hp.current).toBe(10)
  })

  it('shows death saves only when current HP is 0', async () => {
    useCharacterStore.setState({ characters: [{ ...CHAR, hp: { ...CHAR.hp, current: 0 } }] })
    renderSheet()
    expect(screen.getByText(/death saves/i)).toBeInTheDocument()
  })

  it('death saves not shown when HP > 0', () => {
    renderSheet()
    expect(screen.queryByText(/death saves/i)).not.toBeInTheDocument()
  })

  it('shows all 6 tabs', () => {
    renderSheet()
    for (const tab of ['Abilities', 'Combat', 'Spells', 'Equipment', 'Features', 'Biography']) {
      expect(screen.getByRole('tab', { name: tab })).toBeInTheDocument()
    }
  })
})
```

- [ ] **Step 2: Run to confirm failure**:
```bash
npx vitest run src/tests/pages/Sheet.test.jsx
```
Expected: FAIL — module not found

- [ ] **Step 3: Create `src/pages/Sheet/SummaryBar.jsx`**:
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import { exportCharacter } from '../../utils/export'
import { getXpThreshold } from '../../utils/calculations'
import styles from './SummaryBar.module.css'

export default function SummaryBar({ character, derived, onShortRest, onLongRest, onLevelUp }) {
  const { updateCharacter, updateHp } = useCharacterStore()
  const navigate = useNavigate()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { meta, hp, deathSaves, combat } = character
  const { ac, initiative } = derived

  const isDying = hp.current === 0
  const xpThreshold = getXpThreshold(meta.level)
  const canLevelUp = xpThreshold > 0 && meta.xp >= xpThreshold

  function setHp(current) {
    const clamped = Math.max(0, Math.min(hp.max + hp.temp, current))
    updateHp(character.id, clamped)
  }

  function setTempHp(temp) {
    updateCharacter(character.id, { hp: { ...hp, temp: Math.max(0, temp) } })
  }

  function toggleInspiration() {
    updateCharacter(character.id, { meta: { inspiration: !meta.inspiration } })
  }

  function toggleSave(type, idx) {
    // type: 'successes' | 'failures'; idx: 0,1,2
    const current = deathSaves[type]
    const next = current > idx ? idx : idx + 1
    updateCharacter(character.id, { deathSaves: { ...deathSaves, [type]: Math.min(3, next) } })
  }

  function rollDeathSave() {
    // PHB p. 197: roll d20; nat 20 = regain 1 HP + clear saves; nat 1 = 2 failures; 10+ = success; <10 = failure
    const roll = Math.floor(Math.random() * 20) + 1
    if (roll === 20) {
      updateHp(character.id, 1)
      updateCharacter(character.id, { deathSaves: { successes: 0, failures: 0 } })
    } else if (roll === 1) {
      updateCharacter(character.id, { deathSaves: { ...deathSaves, failures: Math.min(3, deathSaves.failures + 2) } })
    } else if (roll >= 10) {
      updateCharacter(character.id, { deathSaves: { ...deathSaves, successes: Math.min(3, deathSaves.successes + 1) } })
    } else {
      updateCharacter(character.id, { deathSaves: { ...deathSaves, failures: Math.min(3, deathSaves.failures + 1) } })
    }
  }

  function toggleAdvancedMode() {
    updateCharacter(character.id, { settings: { ...character.settings, advancedMode: !character.settings.advancedMode } })
    setSettingsOpen(false)
  }

  return (
    <header className={styles.bar}>
      <div className={styles.identity}>
        <h1 className={styles.name}>{meta.characterName}</h1>
        <p className={styles.subtitle}>
          Level {meta.level} {meta.race} {meta.class}
        </p>
      </div>

      <div className={styles.stats}>
        <div className={styles.hpBlock}>
          <label className={styles.statLabel}>HP</label>
          <div className={styles.hpRow}>
            <input
              type="number"
              aria-label="Current HP"
              className={styles.hpInput}
              value={hp.current}
              min={0} max={hp.max + hp.temp}
              onChange={e => setHp(Number(e.target.value))}
              onBlur={e => setHp(Number(e.target.value))}
            />
            <span className={styles.hpSep}>/</span>
            <span className={styles.hpMax}>{hp.max}</span>
            {hp.temp > 0 && <span className={styles.hpTemp}>(+{hp.temp})</span>}
          </div>
          <div
            className={styles.hpBar}
            role="progressbar"
            aria-valuenow={hp.current}
            aria-valuemax={hp.max}
            aria-label="HP bar">
            <div className={styles.hpFill} style={{ width: `${Math.max(0, Math.min(100, (hp.current / hp.max) * 100))}%` }} />
          </div>
        </div>

        <div className={styles.stat}>
          <span className={styles.statValue}>{ac}</span>
          <span className={styles.statLabel}>AC</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statValue}>{initiative >= 0 ? `+${initiative}` : initiative}</span>
          <span className={styles.statLabel}>Init</span>
        </div>

        <div className={styles.stat}>
          <input type="number" aria-label="Speed"
            className={styles.speedInput}
            value={combat.speed}
            onChange={e => updateCharacter(character.id, { combat: { speed: Number(e.target.value) } })} />
          <span className={styles.statLabel}>Speed</span>
        </div>

        <button
          className={[styles.inspiration, meta.inspiration ? styles.inspOn : ''].join(' ')}
          onClick={toggleInspiration}
          aria-pressed={meta.inspiration}
          title="Inspiration">
          ★
        </button>
      </div>

      {isDying && (
        <div className={styles.deathSaves} aria-label="Death saves">
          <span className={styles.dsLabel}>Death Saves</span>
          <div className={styles.dsRow}>
            <span>Successes:</span>
            {[0,1,2].map(i => (
              <button key={i} className={[styles.dsPip, i < deathSaves.successes ? styles.dsSuccess : ''].join(' ')}
                onClick={() => toggleSave('successes', i)} aria-label={`Success ${i+1}`} />
            ))}
          </div>
          <div className={styles.dsRow}>
            <span>Failures:</span>
            {[0,1,2].map(i => (
              <button key={i} className={[styles.dsPip, i < deathSaves.failures ? styles.dsFailure : ''].join(' ')}
                onClick={() => toggleSave('failures', i)} aria-label={`Failure ${i+1}`} />
            ))}
          </div>
          {/* Roll button: handles nat-20 (regain 1 HP) and nat-1 (2 failures) per PHB p. 197 */}
          <button className={styles.dsRollBtn} onClick={rollDeathSave} aria-label="Roll death save">
            Roll d20
          </button>
        </div>
      )}

      <div className={styles.actions}>
        <div className={styles.restMenu}>
          <select aria-label="Rest menu" onChange={e => { if (e.target.value === 'short') onShortRest(); else if (e.target.value === 'long') onLongRest(); e.target.value = '' }}>
            <option value="">Rest…</option>
            <option value="short">Short Rest</option>
            <option value="long">Long Rest</option>
          </select>
        </div>

        <button
          className={[styles.levelUpBtn, canLevelUp ? styles.levelUpReady : ''].join(' ')}
          onClick={onLevelUp}
          disabled={!canLevelUp}
          title={canLevelUp ? 'Level Up!' : `${meta.xp} / ${xpThreshold} XP`}>
          Level Up
        </button>

        <div className={styles.gearWrapper}>
          <button className={styles.gear} onClick={() => setSettingsOpen(o => !o)} aria-label="Settings">⚙</button>
          {settingsOpen && (
            <div className={styles.settingsMenu}>
              <label>
                <input type="checkbox" checked={character.settings.advancedMode} onChange={toggleAdvancedMode} />
                Advanced Mode
              </label>
              <button onClick={() => { exportCharacter(character); setSettingsOpen(false) }}>Export JSON</button>
              <button onClick={() => navigate(`/character/${character.id}/print`)}>Print / PDF</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
```


- [ ] **Step 4: Create `src/pages/Sheet/SummaryBar.module.css`**:
```css
.bar {
  position: sticky; top: 0; z-index: 100;
  background: var(--color-surface);
  border-bottom: 2px solid var(--color-border);
  padding: var(--space-sm) var(--space-md);
  display: flex; align-items: center; gap: var(--space-lg); flex-wrap: wrap;
  box-shadow: var(--shadow-sm);
}
.identity { min-width: 0; }
.name { font-family: var(--font-serif); font-size: var(--text-lg); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.subtitle { font-size: var(--text-xs); color: var(--color-muted); text-transform: capitalize; }
.stats { display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap; }
.stat { display: flex; flex-direction: column; align-items: center; min-width: 44px; }
.statValue { font-size: var(--text-lg); font-weight: var(--weight-bold); line-height: 1; }
.statLabel { font-size: var(--text-xs); color: var(--color-muted); text-transform: uppercase; }
.hpBlock { display: flex; flex-direction: column; gap: 2px; }
.hpRow { display: flex; align-items: center; gap: 4px; }
.hpInput { width: 52px; text-align: center; font-size: var(--text-lg); font-weight: var(--weight-bold); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 2px 4px; }
.hpSep { color: var(--color-muted); }
.hpMax { font-size: var(--text-md); color: var(--color-muted); }
.hpTemp { font-size: var(--text-xs); color: var(--color-accent); }
.hpBar { height: 4px; background: var(--color-border); border-radius: 2px; overflow: hidden; }
.hpFill { height: 100%; background: var(--color-hp); border-radius: 2px; transition: width 0.2s; }
.speedInput { width: 44px; text-align: center; font-size: var(--text-md); font-weight: var(--weight-bold); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 2px 4px; }
.inspiration { font-size: 20px; opacity: 0.3; transition: opacity var(--transition); background: none; border: none; cursor: pointer; padding: 0; }
.inspOn { opacity: 1; color: var(--color-accent); }
.deathSaves { display: flex; align-items: center; gap: var(--space-sm); }
.dsLabel { font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--color-danger); }
.dsRow { display: flex; align-items: center; gap: var(--space-xs); font-size: var(--text-xs); }
.dsPip { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--color-border); background: none; cursor: pointer; }
.dsSuccess { background: var(--color-success); border-color: var(--color-success); }
.dsFailure { background: var(--color-danger); border-color: var(--color-danger); }
.dsRollBtn { font-size: var(--text-xs); padding: 2px var(--space-xs); border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: var(--color-surface); cursor: pointer; }
.actions { display: flex; align-items: center; gap: var(--space-sm); margin-left: auto; }
.restMenu select { font-size: var(--text-sm); padding: var(--space-xs); border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: var(--color-surface); }
.levelUpBtn { font-size: var(--text-sm); padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: var(--color-surface); cursor: pointer; }
.levelUpReady { background: var(--color-accent); color: white; border-color: var(--color-accent); animation: pulse 2s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.75; } }
.gear { font-size: 18px; background: none; border: none; cursor: pointer; opacity: 0.7; }
.gear:hover { opacity: 1; }
.gearWrapper { position: relative; }
.settingsMenu {
  position: absolute; top: calc(100% + 4px); right: 0;
  background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-md); box-shadow: var(--shadow-md);
  padding: var(--space-sm); display: flex; flex-direction: column; gap: var(--space-xs);
  min-width: 160px; z-index: 200;
}
.settingsMenu label { display: flex; align-items: center; gap: var(--space-xs); font-size: var(--text-sm); cursor: pointer; }
.settingsMenu button { text-align: left; font-size: var(--text-sm); padding: var(--space-xs); border-radius: var(--radius-sm); background: none; border: none; cursor: pointer; }
.settingsMenu button:hover { background: var(--color-bg-alt); }
```

- [ ] **Step 5: Create `src/pages/Sheet/Sheet.jsx`**:
```jsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import { useDerivedStats } from '../../hooks/useDerivedStats'
import SummaryBar from './SummaryBar'
import styles from './Sheet.module.css'

const TABS = ['Abilities', 'Combat', 'Spells', 'Equipment', 'Features', 'Biography']

export default function Sheet() {
  const { id } = useParams()
  const navigate = useNavigate()
  const character = useCharacterStore(state => state.characters.find(c => c.id === id))
  const [activeTab, setActiveTab] = useState('Abilities')

  if (!character) {
    navigate('/')
    return null
  }

  const derived = useDerivedStats(character)

  return (
    <div className={styles.page}>
      <SummaryBar
        character={character}
        derived={derived}
        onShortRest={() => {/* Short Rest modal — implemented in Chunk 12 */}}
        onLongRest={() => {/* Long Rest modal — implemented in Chunk 12 */}}
        onLevelUp={() => {/* Level Up modal — implemented in Chunk 12 */}}
      />

      <div className={styles.body}>
        <nav className={styles.tabs} role="tablist" aria-label="Character sheet tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={[styles.tab, activeTab === tab ? styles.tabActive : ''].join(' ')}
              onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </nav>

        <div className={styles.tabContent} role="tabpanel" aria-label={activeTab}>
          {activeTab === 'Abilities' && <div>Abilities tab — Chunk 7</div>}
          {activeTab === 'Combat' && <div>Combat tab — Chunk 8</div>}
          {activeTab === 'Spells' && <div>Spells tab — Chunk 9</div>}
          {activeTab === 'Equipment' && <div>Equipment tab — Chunk 10</div>}
          {activeTab === 'Features' && <div>Features tab — Chunk 10</div>}
          {activeTab === 'Biography' && <div>Biography tab — Chunk 10</div>}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create `src/pages/Sheet/Sheet.module.css`**:
```css
.page { min-height: 100vh; background: var(--color-bg); }
.body { max-width: 960px; margin: 0 auto; padding: var(--space-md); }
.tabs { display: flex; gap: 0; border-bottom: 2px solid var(--color-border); margin-bottom: var(--space-lg); }
.tab {
  padding: var(--space-sm) var(--space-md);
  background: none; border: none; border-bottom: 2px solid transparent;
  margin-bottom: -2px; cursor: pointer;
  font-size: var(--text-sm); color: var(--color-muted); transition: color var(--transition);
}
.tab:hover { color: var(--color-text); }
.tabActive { color: var(--color-accent); border-bottom-color: var(--color-accent); font-weight: var(--weight-medium); }
.tabContent { padding: var(--space-md) 0; }
```

- [ ] **Step 7: Update `src/App.jsx` to wire the Sheet route**:
```jsx
import { Routes, Route } from 'react-router-dom'
import Roster from './pages/Roster/Roster'
import Wizard from './pages/Wizard/Wizard'
import Sheet from './pages/Sheet/Sheet'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Roster />} />
      <Route path="/new" element={<Wizard />} />
      <Route path="/character/:id" element={<Sheet />} />
      <Route path="/character/:id/print" element={<div>Print placeholder</div>} />
    </Routes>
  )
}
```

- [ ] **Step 8: Run tests to confirm they pass**:
```bash
npx vitest run src/tests/pages/Sheet.test.jsx
```
Expected: all 5 tests pass

- [ ] **Step 9: Run full test suite**:
```bash
npx vitest run
```
Expected: all tests pass

- [ ] **Step 10: Commit**:
```bash
git add src/pages/Sheet/ src/tests/pages/Sheet.test.jsx src/App.jsx
git commit -m "feat: add Sheet page with SummaryBar, tab navigation, HP tracker, and death saves"
```

---

## Chunk 7: Abilities Tab

### Task 19: Abilities Tab

**Files:**
- Create: `src/pages/Sheet/tabs/AbilitiesTab.jsx`, `src/pages/Sheet/tabs/AbilitiesTab.module.css`
- Create: `src/tests/pages/AbilitiesTab.test.jsx`
- Modify: `src/pages/Sheet/Sheet.jsx`

- [ ] **Step 1: Write failing test** — create `src/tests/pages/AbilitiesTab.test.jsx`:
```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import AbilitiesTab from '../../pages/Sheet/tabs/AbilitiesTab'

const CHAR = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 3, xp: 300, inspiration: false, playerName: '', subrace: 'high-elf', background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores: { str:8, dex:16, con:12, int:17, wis:13, cha:10 },
  proficiencies: { savingThrows:['int','wis'], skills:['arcana','history'], expertise:[], tools:[], languages:['common','elvish'], armor:[], weapons:[] },
  hp:{max:16,current:16,temp:0,hitDiceTotal:3,hitDiceRemaining:3},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:0,sp:0,ep:0,gp:0,pp:0},equipment:[],attacks:[],
  spells:{ability:'int',slots:{1:{max:4,used:0},2:{max:2,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:[],known:[],arcaneRecoveryUsed:false},
  features:[],conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

describe('AbilitiesTab', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [CHAR] }) })

  it('shows modifier for each ability score', () => {
    render(<AbilitiesTab character={CHAR} />)
    // STR 8 → -1
    expect(screen.getByTestId('modifier-str')).toHaveTextContent('-1')
    // INT 17 → +3
    expect(screen.getByTestId('modifier-int')).toHaveTextContent('+3')
  })

  it('shows proficiency bonus', () => {
    render(<AbilitiesTab character={CHAR} />)
    expect(screen.getByText(/\+2/)).toBeInTheDocument() // level 3 prof bonus
  })

  it('toggling skill proficiency updates store', async () => {
    render(<AbilitiesTab character={CHAR} />)
    // Acrobatics is not proficient; click its prof button
    const profBtn = screen.getByRole('button', { name: /toggle proficiency acrobatics/i })
    await userEvent.click(profBtn)
    const char = useCharacterStore.getState().characters.find(c => c.id === 'c1')
    expect(char.proficiencies.skills).toContain('acrobatics')
  })

  it('expertise toggle auto-adds skill proficiency if missing', async () => {
    render(<AbilitiesTab character={CHAR} />)
    // Arcana is proficient; Athletics is not — try to grant expertise to athletics
    const expBtn = screen.getByRole('button', { name: /toggle expertise athletics/i })
    await userEvent.click(expBtn)
    const char = useCharacterStore.getState().characters.find(c => c.id === 'c1')
    // Both expertise AND proficiency granted
    expect(char.proficiencies.expertise).toContain('athletics')
    expect(char.proficiencies.skills).toContain('athletics')
  })

  it('shows passive perception derived from WIS modifier + perception bonus', () => {
    render(<AbilitiesTab character={CHAR} />)
    // WIS 13 → mod +1; perception not proficient → passive = 10 + 1 = 11
    expect(screen.getByText(/passive perception/i).closest('div')).toHaveTextContent('11')
  })

  it('shows ability score method as informational label', () => {
    render(<AbilitiesTab character={CHAR} />)
    // settings.abilityScoreMethod is 'standard-array' → displayed as text
    expect(screen.getByText(/score method/i)).toHaveTextContent(/standard array/i)
  })
})
```

- [ ] **Step 2: Run to confirm failure**:
```bash
npx vitest run src/tests/pages/AbilitiesTab.test.jsx
```
Expected: FAIL — module not found

- [ ] **Step 3: Create `src/pages/Sheet/tabs/AbilitiesTab.jsx`**:
```jsx
import { useCharacterStore } from '../../../store/characters'
import { useDerivedStats } from '../../../hooks/useDerivedStats'
import StatBlock from '../../../components/StatBlock/StatBlock'
import SkillRow from '../../../components/SkillRow/SkillRow'
import skillsData from '../../../data/skills.json'
import styles from './AbilitiesTab.module.css'

const ABILITIES = ['str','dex','con','int','wis','cha']
const ABILITY_NAMES = { str:'Strength', dex:'Dexterity', con:'Constitution', int:'Intelligence', wis:'Wisdom', cha:'Charisma' }

export default function AbilitiesTab({ character }) {
  const { updateCharacter } = useCharacterStore()
  const derived = useDerivedStats(character)
  const { proficiencies, settings } = character

  function toggleSkillProf(skillId) {
    const isProf = proficiencies.skills.includes(skillId)
    if (isProf) {
      updateCharacter(character.id, {
        proficiencies: {
          skills: proficiencies.skills.filter(s => s !== skillId),
          expertise: proficiencies.expertise.filter(s => s !== skillId),
        },
      })
    } else {
      updateCharacter(character.id, {
        proficiencies: { skills: [...proficiencies.skills, skillId] },
      })
    }
  }

  function toggleSkillExpertise(skillId) {
    const isExpert = proficiencies.expertise.includes(skillId)
    if (isExpert) {
      updateCharacter(character.id, {
        proficiencies: { expertise: proficiencies.expertise.filter(s => s !== skillId) },
      })
    } else {
      // expertise implies proficiency
      const newSkills = proficiencies.skills.includes(skillId)
        ? proficiencies.skills
        : [...proficiencies.skills, skillId]
      updateCharacter(character.id, {
        proficiencies: { expertise: [...proficiencies.expertise, skillId], skills: newSkills },
      })
    }
  }

  function toggleSaveProf(ability) {
    const isProf = proficiencies.savingThrows.includes(ability)
    updateCharacter(character.id, {
      proficiencies: {
        savingThrows: isProf
          ? proficiencies.savingThrows.filter(a => a !== ability)
          : [...proficiencies.savingThrows, ability],
      },
    })
  }

  return (
    <div className={styles.tab}>
      {/* Ability Scores */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Ability Scores</h3>
        <div className={styles.abilityGrid}>
          {ABILITIES.map(a => (
            <StatBlock
              key={a}
              ability={a}
              label={ABILITY_NAMES[a]}
              score={character.abilityScores[a]}
              modifier={derived.abilityModifiers[a]}
              modifierTestId={`modifier-${a}`}
              editable={settings.advancedMode}
              onScoreChange={val => updateCharacter(character.id, { abilityScores: { [a]: val } })}
              saveProf={proficiencies.savingThrows.includes(a)}
              saveBonus={derived.savingThrowBonuses[a]}
              onToggleSave={() => toggleSaveProf(a)}
            />
          ))}
        </div>
      </section>

      {/* Proficiency Bonus + Score Method */}
      <section className={styles.section}>
        <p className={styles.profBonus}>
          Proficiency Bonus: <strong>+{derived.proficiencyBonus}</strong>
        </p>
        <p className={styles.scoreMethod}>
          Score method: <em>{settings.abilityScoreMethod.replace(/-/g, ' ')}</em>
        </p>
      </section>

      {/* Skills */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Skills</h3>
        <div className={styles.skillList}>
          {skillsData.map(skill => (
            <SkillRow
              key={skill.id}
              skill={skill}
              proficient={proficiencies.skills.includes(skill.id)}
              expert={proficiencies.expertise.includes(skill.id)}
              bonus={derived.skillBonuses[skill.id]}
              onToggleProf={() => toggleSkillProf(skill.id)}
              onToggleExpert={() => toggleSkillExpertise(skill.id)}
            />
          ))}
        </div>
      </section>

      {/* Passive Checks */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Passive Checks</h3>
        <div className={styles.passiveList}>
          <div className={styles.passive}>
            <span className={styles.passiveName}>Passive Perception</span>
            <span className={styles.passiveValue}>{derived.passivePerception}</span>
          </div>
          <div className={styles.passive}>
            <span className={styles.passiveName}>Passive Investigation</span>
            <span className={styles.passiveValue}>{derived.passiveInvestigation}</span>
          </div>
          <div className={styles.passive}>
            <span className={styles.passiveName}>Passive Insight</span>
            <span className={styles.passiveValue}>{derived.passiveInsight}</span>
          </div>
        </div>
      </section>

      {/* Proficiency Tags */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Other Proficiencies & Languages</h3>
        {[
          { label: 'Armor', items: proficiencies.armor },
          { label: 'Weapons', items: proficiencies.weapons },
          { label: 'Tools', items: proficiencies.tools },
          { label: 'Languages', items: proficiencies.languages },
        ].map(({ label, items }) => items.length > 0 && (
          <p key={label} className={styles.profTag}>
            <strong>{label}:</strong> {items.join(', ')}
          </p>
        ))}
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/pages/Sheet/tabs/AbilitiesTab.module.css`**:
```css
.tab { display: flex; flex-direction: column; gap: var(--space-xl); }
.section { display: flex; flex-direction: column; gap: var(--space-md); }
.sectionTitle { font-family: var(--font-serif); font-size: var(--text-md); border-bottom: 1px solid var(--color-border-light); padding-bottom: var(--space-xs); }
.abilityGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: var(--space-md); }
.profBonus { font-size: var(--text-sm); }
.scoreMethod { font-size: var(--text-xs); color: var(--color-muted); text-transform: capitalize; }
.skillList { display: flex; flex-direction: column; gap: 2px; }
.passiveList { display: flex; flex-direction: column; gap: var(--space-xs); }
.passive { display: flex; justify-content: space-between; align-items: center; padding: var(--space-xs) 0; border-bottom: 1px solid var(--color-border-light); }
.passiveName { font-size: var(--text-sm); }
.passiveValue { font-weight: var(--weight-bold); }
.profTag { font-size: var(--text-sm); }
```

- [ ] **Step 5: Update `src/pages/Sheet/Sheet.jsx`** to import and render AbilitiesTab:

Replace the line:
```jsx
{activeTab === 'Abilities' && <div>Abilities tab — Chunk 7</div>}
```
With:
```jsx
import AbilitiesTab from './tabs/AbilitiesTab'
// ...
{activeTab === 'Abilities' && <AbilitiesTab character={character} />}
```

(Add the import at the top of the file, replace the placeholder in the JSX.)

- [ ] **Step 6: Run tests**:
```bash
npx vitest run src/tests/pages/AbilitiesTab.test.jsx
```
Expected: all 6 tests pass

- [ ] **Step 7: Run full suite**:
```bash
npx vitest run
```
Expected: all tests pass

- [ ] **Step 8: Commit**:
```bash
git add src/pages/Sheet/tabs/AbilitiesTab.jsx src/pages/Sheet/tabs/AbilitiesTab.module.css \
  src/tests/pages/AbilitiesTab.test.jsx src/pages/Sheet/Sheet.jsx
git commit -m "feat: add Abilities tab with skill rows, saving throws, and passive checks"
```

---

## Chunk 8: Combat Tab

### Task 20: Combat Tab

**Files:**
- Create: `src/pages/Sheet/tabs/CombatTab.jsx`, `src/pages/Sheet/tabs/CombatTab.module.css`
- Create: `src/tests/pages/CombatTab.test.jsx`
- Modify: `src/pages/Sheet/Sheet.jsx`

- [ ] **Step 1: Write failing tests** — create `src/tests/pages/CombatTab.test.jsx`:
```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import CombatTab from '../../pages/Sheet/tabs/CombatTab'

const BASE_CHAR = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 3, xp: 300, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores: { str:8, dex:16, con:12, int:17, wis:13, cha:10 },
  proficiencies: { savingThrows:['int','wis'], skills:['arcana'], expertise:[], tools:[], languages:['common'], armor:[], weapons:['dagger'] },
  hp:{max:16,current:16,temp:0,hitDiceTotal:3,hitDiceRemaining:3},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:0,sp:0,ep:0,gp:0,pp:0},
  equipment:[{ id:'e1',name:'Dagger',quantity:1,weight:1,equipped:true,notes:'',damage:'1d4',damageType:'piercing',weaponProperties:['finesse','light','thrown'],weaponCategory:'simple',range:'20/60',armorClass:null,armorType:null }],
  attacks:[],
  spells:{ability:'int',slots:{1:{max:2,used:0},2:{max:0,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:[],known:[],arcaneRecoveryUsed:false},
  features:[],conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

describe('CombatTab', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [BASE_CHAR] }) })

  it('shows derived AC', () => {
    render(<CombatTab character={BASE_CHAR} />)
    // unarmored: 10 + DEX 16 mod (+3) = 13
    expect(screen.getByTestId('ac-value')).toHaveTextContent('13')
  })

  it('adding a custom attack row stores entry', async () => {
    render(<CombatTab character={BASE_CHAR} />)
    await userEvent.click(screen.getByRole('button', { name: /add custom attack/i }))
    expect(useCharacterStore.getState().characters.find(c => c.id === 'c1').attacks).toHaveLength(1)
  })

  it('shows Sneak Attack row only for rogues', () => {
    render(<CombatTab character={BASE_CHAR} />)
    expect(screen.queryByText(/sneak attack/i)).not.toBeInTheDocument()

    const rogue = { ...BASE_CHAR, meta: { ...BASE_CHAR.meta, class: 'rogue' } }
    useCharacterStore.setState({ characters: [rogue] })
    render(<CombatTab character={rogue} />)
    expect(screen.getAllByText(/sneak attack/i).length).toBeGreaterThan(0)
  })

  it('spending a hit die reduces hitDiceRemaining', async () => {
    render(<CombatTab character={BASE_CHAR} />)
    await userEvent.click(screen.getByRole('button', { name: /spend hit die/i }))
    const char = useCharacterStore.getState().characters.find(c => c.id === 'c1')
    expect(char.hp.hitDiceRemaining).toBe(2)
  })

  it('shows initiative bonus derived from DEX modifier', () => {
    render(<CombatTab character={BASE_CHAR} />)
    // DEX 16 → mod +3
    expect(screen.getByTestId('initiative-value')).toHaveTextContent('+3')
  })

  it('initiative override input sets combat.initiative', async () => {
    render(<CombatTab character={BASE_CHAR} />)
    const input = screen.getByLabelText(/initiative override/i)
    await userEvent.clear(input)
    await userEvent.type(input, '5')
    const char = useCharacterStore.getState().characters.find(c => c.id === 'c1')
    expect(char.combat.initiative).toBe(5)
  })

  it('shows and edits speed', async () => {
    render(<CombatTab character={BASE_CHAR} />)
    const input = screen.getByLabelText(/speed/i)
    expect(input).toHaveValue(30)
    await userEvent.clear(input)
    await userEvent.type(input, '35')
    const char = useCharacterStore.getState().characters.find(c => c.id === 'c1')
    expect(char.combat.speed).toBe(35)
  })
})
```

- [ ] **Step 2: Run to confirm failure**:
```bash
npx vitest run src/tests/pages/CombatTab.test.jsx
```
Expected: FAIL — module not found

- [ ] **Step 3: Create `src/pages/Sheet/tabs/CombatTab.jsx`**:
```jsx
import { useState } from 'react'
import { useCharacterStore } from '../../../store/characters'
import { useDerivedStats } from '../../../hooks/useDerivedStats'
import { generateId } from '../../../utils/ids'
import { rollDice } from '../../../utils/diceRoller'
import ConditionToggle from '../../../components/ConditionToggle/ConditionToggle'
import DiceRoller from '../../../components/DiceRoller/DiceRoller'
import PipTracker from '../../../components/PipTracker/PipTracker'
import classes from '../../../data/classes.json'
import styles from './CombatTab.module.css'

const AC_FORMULAS = ['unarmored','mage-armor','light','medium','heavy','custom']

function getAttackBonus(attack, character, derived) {
  if (attack.attackBonusOverride !== null) return attack.attackBonusOverride
  const abilityMod = derived.abilityModifiers[attack.attackAbility] ?? 0
  // Check proficiency: weapon category or name match
  const eq = character.equipment.find(e => e.id === attack.equipmentId)
  const isProficient = eq
    ? character.proficiencies.weapons.includes(eq.weaponCategory) || character.proficiencies.weapons.includes(eq.name.toLowerCase())
    : false
  return abilityMod + (isProficient ? derived.proficiencyBonus : 0)
}

function formatBonus(n) { return n >= 0 ? `+${n}` : `${n}` }

export default function CombatTab({ character }) {
  const { updateCharacter } = useCharacterStore()
  const derived = useDerivedStats(character)
  const { combat, conditions, hp, attacks, equipment } = character
  const classData = classes.find(c => c.id === character.meta.class)
  const hitDie = classData?.hitDie || 6
  const isRogue = character.meta.class === 'rogue'

  // Weapons available to add as attacks
  const weaponItems = equipment.filter(e => e.damage !== null)

  function handleAcFormulaChange(formula) {
    updateCharacter(character.id, { combat: { acFormula: formula } })
  }

  function handleAcOverrideChange(val) {
    updateCharacter(character.id, { combat: { acOverride: Number(val) } })
  }

  function addAttackFromEquipment(equipmentId) {
    if (!equipmentId) return
    const item = equipment.find(e => e.id === equipmentId)
    if (!item) return
    const attack = {
      id: generateId(), name: item.name, equipmentId,
      attackAbility: item.weaponProperties?.includes('finesse') ? 'dex' : 'str',
      attackBonusOverride: null,
      damage: item.damage, damageType: item.damageType,
      damageAbility: item.weaponProperties?.includes('finesse') ? 'dex' : 'str',
      notes: '',
    }
    updateCharacter(character.id, { attacks: [...attacks, attack] })
  }

  function addCustomAttack() {
    const attack = {
      id: generateId(), name: 'Custom Attack', equipmentId: null,
      attackAbility: 'str', attackBonusOverride: null,
      damage: '1d6', damageType: 'bludgeoning',
      damageAbility: 'str', notes: '',
    }
    updateCharacter(character.id, { attacks: [...attacks, attack] })
  }

  function deleteAttack(id) {
    updateCharacter(character.id, { attacks: attacks.filter(a => a.id !== id) })
  }

  function spendHitDie() {
    if (hp.hitDiceRemaining <= 0) return
    const { result } = rollDice(`1d${hitDie}`)
    const conMod = derived.abilityModifiers.con ?? 0
    const heal = Math.max(1, result + conMod)
    const newCurrent = Math.min(hp.max, hp.current + heal)
    updateCharacter(character.id, { hp: { ...hp, current: newCurrent, hitDiceRemaining: hp.hitDiceRemaining - 1 } })
  }

  function toggleCondition(conditionId) {
    if (conditionId === 'exhaustion') return // handled by stepper
    updateCharacter(character.id, {
      conditions: { ...conditions, [conditionId]: !conditions[conditionId] },
    })
  }

  function setExhaustion(level) {
    updateCharacter(character.id, { conditions: { ...conditions, exhaustion: level } })
  }

  return (
    <div className={styles.tab}>
      {/* AC & Speed */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Armor Class</h3>
        <div className={styles.acRow}>
          <span data-testid="ac-value" className={styles.acValue}>{derived.ac}</span>
          <select
            aria-label="AC formula"
            value={combat.acFormula}
            onChange={e => handleAcFormulaChange(e.target.value)}>
            {AC_FORMULAS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          {combat.acFormula === 'custom' && (
            <input type="number" aria-label="Custom AC" value={combat.acOverride ?? ''} onChange={e => handleAcOverrideChange(e.target.value)} />
          )}
          {['light','medium','heavy'].includes(combat.acFormula) && (
            <select
              aria-label="Equipped armor"
              value={combat.equippedArmorId || ''}
              onChange={e => updateCharacter(character.id, { combat: { equippedArmorId: e.target.value || null } })}>
              <option value="">No armor</option>
              {equipment.filter(e => e.armorType !== null && e.armorType !== 'shield').map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          )}
          <label className={styles.shieldLabel}>
            <input type="checkbox" checked={combat.equippedShield}
              onChange={e => updateCharacter(character.id, { combat: { equippedShield: e.target.checked } })} />
            Shield (+2)
          </label>
        </div>
      </section>

      {/* Initiative */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Initiative</h3>
        <div className={styles.initiativeRow}>
          <span className={styles.initiativeValue} data-testid="initiative-value">
            {(combat.initiative ?? derived.initiative) >= 0
              ? `+${combat.initiative ?? derived.initiative}`
              : `${combat.initiative ?? derived.initiative}`}
          </span>
          <input
            type="number"
            aria-label="Initiative override"
            placeholder="Override…"
            value={combat.initiative ?? ''}
            onChange={e => updateCharacter(character.id, {
              combat: { ...combat, initiative: e.target.value !== '' ? parseInt(e.target.value, 10) : null },
            })}
          />
          <span className={styles.initiativeLabel}>
            {combat.initiative !== null ? 'override' : '(DEX modifier)'}
          </span>
        </div>
      </section>

      {/* Speed */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Speed</h3>
        <div className={styles.speedRow}>
          <input
            type="number"
            aria-label="Speed"
            value={combat.speed ?? 30}
            min={0}
            onChange={e => updateCharacter(character.id, {
              combat: { ...combat, speed: parseInt(e.target.value, 10) || 0 },
            })}
          />
          <span className={styles.speedLabel}>ft.</span>
        </div>
      </section>

      {/* Weapon Attacks */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Weapon Attacks</h3>
        {attacks.length > 0 && (
          <table className={styles.attackTable}>
            <thead>
              <tr><th>Name</th><th>Attack</th><th>Damage</th><th>Type</th><th></th></tr>
            </thead>
            <tbody>
              {attacks.map(attack => {
                const bonus = getAttackBonus(attack, character, derived)
                const damMod = attack.damageAbility ? (derived.abilityModifiers[attack.damageAbility] ?? 0) : 0
                return (
                  <tr key={attack.id}>
                    <td>{attack.name}</td>
                    <td>{formatBonus(bonus)}</td>
                    <td>{attack.damage}{damMod !== 0 ? ` ${formatBonus(damMod)}` : ''}</td>
                    <td>{attack.damageType}</td>
                    <td><button onClick={() => deleteAttack(attack.id)} aria-label={`Delete ${attack.name}`}>×</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        <div className={styles.addAttack}>
          {weaponItems.length > 0 && (
            <select aria-label="Add weapon from equipment" onChange={e => addAttackFromEquipment(e.target.value)}>
              <option value="">Add from equipment…</option>
              {weaponItems.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          )}
          <button onClick={addCustomAttack} aria-label="Add custom attack">+ Custom Attack</button>
        </div>
      </section>

      {/* Sneak Attack (Rogue only) */}
      {isRogue && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Sneak Attack</h3>
          <div className={styles.sneakRow}>
            <span>{derived.sneakAttackDice}d6</span>
            <DiceRoller expression={`${derived.sneakAttackDice}d6`} label="Roll Sneak Attack" />
          </div>
        </section>
      )}

      {/* Hit Dice */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Hit Dice (d{hitDie})</h3>
        <div className={styles.hitDiceRow}>
          <PipTracker
            total={hp.hitDiceTotal}
            filled={hp.hitDiceRemaining}
            onChange={val => updateCharacter(character.id, { hp: { hitDiceRemaining: val } })}
            label="Hit dice remaining"
          />
          <button onClick={spendHitDie} disabled={hp.hitDiceRemaining <= 0} aria-label="Spend hit die">
            Spend Hit Die
          </button>
        </div>
      </section>

      {/* Conditions */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Conditions</h3>
        <div className={styles.conditions}>
          {Object.keys(conditions).map(id => (
            <ConditionToggle
              key={id}
              conditionId={id}
              active={id === 'exhaustion' ? conditions.exhaustion > 0 : conditions[id]}
              exhaustionLevel={id === 'exhaustion' ? conditions.exhaustion : undefined}
              onToggle={() => toggleCondition(id)}
              onExhaustionChange={id === 'exhaustion' ? setExhaustion : undefined}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/pages/Sheet/tabs/CombatTab.module.css`**:
```css
.tab { display: flex; flex-direction: column; gap: var(--space-xl); }
.section { display: flex; flex-direction: column; gap: var(--space-md); }
.sectionTitle { font-family: var(--font-serif); font-size: var(--text-md); border-bottom: 1px solid var(--color-border-light); padding-bottom: var(--space-xs); }
.acRow { display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap; }
.acValue { font-size: var(--text-2xl); font-weight: var(--weight-bold); min-width: 44px; text-align: center; }
.shieldLabel { display: flex; align-items: center; gap: var(--space-xs); font-size: var(--text-sm); cursor: pointer; }
.attackTable { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.attackTable th { text-align: left; padding: var(--space-xs); color: var(--color-muted); border-bottom: 1px solid var(--color-border); }
.attackTable td { padding: var(--space-xs); border-bottom: 1px solid var(--color-border-light); }
.addAttack { display: flex; gap: var(--space-sm); align-items: center; flex-wrap: wrap; }
.sneakRow { display: flex; align-items: center; gap: var(--space-md); }
.initiativeRow { display: flex; align-items: center; gap: var(--space-sm); flex-wrap: wrap; }
.initiativeValue { font-size: var(--text-2xl); font-weight: var(--weight-bold); min-width: 44px; text-align: center; }
.initiativeLabel { font-size: var(--text-sm); color: var(--color-muted); }
.speedRow { display: flex; align-items: center; gap: var(--space-sm); }
.speedLabel { font-size: var(--text-sm); color: var(--color-muted); }
.hitDiceRow { display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap; }
.conditions { display: flex; gap: var(--space-xs); flex-wrap: wrap; }
```

- [ ] **Step 5: Update `src/pages/Sheet/Sheet.jsx`** — add import at top of file, then replace Combat placeholder:

Add at the top of the file (with the other imports):
```jsx
import CombatTab from './tabs/CombatTab'
```

Replace:
```jsx
{activeTab === 'Combat' && <div>Combat tab — Chunk 8</div>}
```
With:
```jsx
{activeTab === 'Combat' && <CombatTab character={character} />}
```

- [ ] **Step 6: Run tests**:
```bash
npx vitest run src/tests/pages/CombatTab.test.jsx
```
Expected: all 7 tests pass

- [ ] **Step 7: Run full suite**:
```bash
npx vitest run
```
Expected: all tests pass

- [ ] **Step 8: Commit**:
```bash
git add src/pages/Sheet/tabs/CombatTab.jsx src/pages/Sheet/tabs/CombatTab.module.css \
  src/tests/pages/CombatTab.test.jsx src/pages/Sheet/Sheet.jsx
git commit -m "feat: add Combat tab with AC selector, initiative/speed, weapon attacks, hit dice, and conditions"
```

---

## Chunk 9: Spells Tab

### Task 21: Spells data + Spells Tab

**Files:**
- Create: `src/data/spells.json`
- Create: `src/hooks/useSpells.js`
- Create: `src/pages/Sheet/tabs/SpellsTab.jsx`, `src/pages/Sheet/tabs/SpellsTab.module.css`
- Create: `src/pages/Sheet/tabs/CustomSpellForm.jsx`, `src/pages/Sheet/tabs/CustomSpellForm.module.css`
- Create: `src/tests/pages/SpellsTab.test.jsx`
- Modify: `src/pages/Sheet/Sheet.jsx`

- [ ] **Step 1: Create `src/data/spells.json`**

Each spell object shape:
```jsonc
{
  "id": "magic-missile",     // kebab-case unique ID
  "name": "Magic Missile",
  "level": 1,                // 0 = cantrip
  "school": "evocation",
  "classes": ["wizard"],     // which class spell lists it appears on
  "castingTime": "1 action",
  "range": "120 feet",
  "components": "V, S",
  "duration": "Instantaneous",
  "concentration": false,
  "description": "..."       // full rules text
}
```

Create `src/data/spells.json` with the following example entries. **After scaffolding the file, fill in all remaining Basic Rules spells following this schema** (see D&D 5e SRD / Basic Rules for complete spell text):

```json
[
  {
    "id": "sacred-flame", "name": "Sacred Flame", "level": 0, "school": "evocation",
    "classes": ["cleric"], "castingTime": "1 action", "range": "60 feet",
    "components": "V, S", "duration": "Instantaneous", "concentration": false,
    "description": "Flame-like radiance descends on a creature you can see within range. The target must succeed on a Dex saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw. The spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8)."
  },
  {
    "id": "guidance", "name": "Guidance", "level": 0, "school": "divination",
    "classes": ["cleric"], "castingTime": "1 action", "range": "Touch",
    "components": "V, S", "duration": "Concentration, up to 1 minute", "concentration": true,
    "description": "You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends."
  },
  {
    "id": "cure-wounds", "name": "Cure Wounds", "level": 1, "school": "evocation",
    "classes": ["cleric"], "castingTime": "1 action", "range": "Touch",
    "components": "V, S", "duration": "Instantaneous", "concentration": false,
    "description": "A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs. At Higher Levels: When you cast this spell using a slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st."
  },
  {
    "id": "guiding-bolt", "name": "Guiding Bolt", "level": 1, "school": "evocation",
    "classes": ["cleric"], "castingTime": "1 action", "range": "120 feet",
    "components": "V, S", "duration": "1 round", "concentration": false,
    "description": "A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 4d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage. At Higher Levels: When you cast this spell using a slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st."
  },
  {
    "id": "fire-bolt", "name": "Fire Bolt", "level": 0, "school": "evocation",
    "classes": ["wizard"], "castingTime": "1 action", "range": "120 feet",
    "components": "V, S", "duration": "Instantaneous", "concentration": false,
    "description": "You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried. This spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10)."
  },
  {
    "id": "mage-hand", "name": "Mage Hand", "level": 0, "school": "conjuration",
    "classes": ["wizard"], "castingTime": "1 action", "range": "30 feet",
    "components": "V, S", "duration": "1 minute", "concentration": false,
    "description": "A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. You can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial."
  },
  {
    "id": "magic-missile", "name": "Magic Missile", "level": 1, "school": "evocation",
    "classes": ["wizard"], "castingTime": "1 action", "range": "120 feet",
    "components": "V, S", "duration": "Instantaneous", "concentration": false,
    "description": "You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously. At Higher Levels: When you cast this spell using a slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st."
  },
  {
    "id": "shield", "name": "Shield", "level": 1, "school": "abjuration",
    "classes": ["wizard"], "castingTime": "1 reaction", "range": "Self",
    "components": "V, S", "duration": "1 round", "concentration": false,
    "description": "An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile."
  },
  {
    "id": "burning-hands", "name": "Burning Hands", "level": 1, "school": "evocation",
    "classes": ["wizard"], "castingTime": "1 action", "range": "Self (15-foot cone)",
    "components": "V, S", "duration": "Instantaneous", "concentration": false,
    "description": "As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a Dex saving throw. A creature takes 3d6 fire damage on a failed save, or half as much on a successful one. At Higher Levels: When you cast using a slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st."
  },
  {
    "id": "sleep", "name": "Sleep", "level": 1, "school": "enchantment",
    "classes": ["wizard"], "castingTime": "1 action", "range": "90 feet",
    "components": "V, S, M", "duration": "1 minute", "concentration": false,
    "description": "This spell sends creatures into a magical slumber. Roll 5d8; the total is how many hit points of creatures this spell can affect. Starting with the creature that has the lowest current hit points, each creature affected by this spell falls unconscious until the spell ends, the sleeper takes damage, or someone uses an action to shake or slap the sleeper awake. Undead and creatures immune to being charmed aren't affected by this spell. At Higher Levels: When you cast this spell using a slot of 2nd level or higher, roll an additional 2d8 for each slot level above 1st."
  }
]
```

> **Note to implementer:** The above is a minimal scaffold. Populate the remaining Basic Rules spells following this schema. Use the D&D 5e SRD or the free Basic Rules PDF.
>
> **Acceptance criteria before proceeding:** Verify `spells.json` contains at minimum:
> - [ ] 10+ Wizard spells covering levels 0–5 (cantrips + at least 2 spells at each of levels 1–5)
> - [ ] 10+ Cleric spells covering levels 0–5 (cantrips + at least 2 spells at each of levels 1–5)
> - [ ] All entries follow the schema above (no missing fields)
>
> Run: `node -e "const s=require('./src/data/spells.json'); console.log('Wizard:', s.filter(x=>x.classes.includes('wizard')).length, 'Cleric:', s.filter(x=>x.classes.includes('cleric')).length)"`

- [ ] **Step 2: Write failing tests** — create `src/tests/pages/SpellsTab.test.jsx`:
```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import SpellsTab from '../../pages/Sheet/tabs/SpellsTab'

const WIZARD_CHAR = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 3, xp: 300, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores: { str:8, dex:16, con:12, int:17, wis:13, cha:10 },
  proficiencies: { savingThrows:['int','wis'], skills:[], expertise:[], tools:[], languages:['common'], armor:[], weapons:[] },
  hp:{max:16,current:16,temp:0,hitDiceTotal:3,hitDiceRemaining:3},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:0,sp:0,ep:0,gp:0,pp:0},equipment:[],attacks:[],
  spells:{ability:'int',slots:{1:{max:4,used:0},2:{max:2,used:0},3:{max:2,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:['magic-missile'],known:['magic-missile','shield','fire-bolt'],arcaneRecoveryUsed:false},
  features:[],conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

describe('SpellsTab', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [WIZARD_CHAR] }) })

  it('shows spell slots for levels with max > 0', () => {
    render(<SpellsTab character={WIZARD_CHAR} />)
    expect(screen.getByText(/level 1.*4/i)).toBeInTheDocument()
  })

  it('using a slot increments used count in store', async () => {
    render(<SpellsTab character={WIZARD_CHAR} />)
    // Click the first pip in level-1 slot tracker (marks one slot used)
    const slotPips = screen.getAllByRole('button', { name: /slot 1 pip/i })
    await userEvent.click(slotPips[0])
    expect(useCharacterStore.getState().characters[0].spells.slots[1].used).toBe(1)
  })

  it('shows spells from known list for wizard', () => {
    render(<SpellsTab character={WIZARD_CHAR} />)
    expect(screen.getByText('Magic Missile')).toBeInTheDocument()
    expect(screen.getByText('Shield')).toBeInTheDocument()
  })

  it('toggling prepare marks spell as prepared in store', async () => {
    render(<SpellsTab character={WIZARD_CHAR} />)
    // Shield is not prepared; click its prepare toggle
    const prepBtn = screen.getByRole('button', { name: /prepare shield/i })
    await userEvent.click(prepBtn)
    expect(useCharacterStore.getState().characters[0].spells.prepared).toContain('shield')
  })

  it('shows Arcane Recovery button only for wizards', () => {
    render(<SpellsTab character={WIZARD_CHAR} />)
    expect(screen.getByRole('button', { name: /arcane recovery/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run to confirm failure**:
```bash
npx vitest run src/tests/pages/SpellsTab.test.jsx
```
Expected: FAIL — module not found


- [ ] **Step 4: Create `src/hooks/useSpells.js`**:
```js
import { useMemo } from 'react'
import spellsData from '../data/spells.json'

/**
 * Returns a merged, filtered list of spells for the given character.
 * Combines built-in spells (filtered to class list or known list) with customSpells.
 * @param {object} character
 * @param {{ search: string, level: string, school: string, prepared: string }} filters
 *   prepared: 'all' | 'prepared' | 'known'
 */
export function useSpells(character, { search = '', level = 'all', school = 'all', prepared = 'all' } = {}) {
  const { spells, customSpells, meta } = character
  const isWizard = meta.class === 'wizard'
  const isCleric = meta.class === 'cleric'

  const baseSpells = useMemo(() => {
    if (isWizard) return spellsData.filter(s => spells.known.includes(s.id))
    if (isCleric) return spellsData.filter(s => s.classes.includes('cleric'))
    return []
  }, [isWizard, isCleric, spells.known])

  return useMemo(() => {
    const all = [...baseSpells, ...customSpells]
    return all.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
      const matchLevel = level === 'all' || String(s.level) === String(level)
      const matchSchool = school === 'all' || s.school === school
      const matchPrepared =
        prepared === 'all' ||
        (prepared === 'prepared' && spells.prepared.includes(s.id)) ||
        (prepared === 'known' && spells.known.includes(s.id))
      return matchSearch && matchLevel && matchSchool && matchPrepared
    })
  }, [baseSpells, customSpells, search, level, school, prepared, spells.prepared, spells.known])
}
```

- [ ] **Step 5: Create `src/pages/Sheet/tabs/CustomSpellForm.jsx`**:
```jsx
import { useState } from 'react'
import { generateId } from '../../../utils/ids'
import styles from './CustomSpellForm.module.css'

const SCHOOLS = ['abjuration','conjuration','divination','enchantment','evocation','illusion','necromancy','transmutation']

export default function CustomSpellForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({
    name: '', level: 0, school: 'evocation', castingTime: '1 action',
    range: '', components: 'V, S', duration: '', description: '',
    concentration: false, castingAbilityOverride: null,
  })

  function set(field, value) { setForm(f => ({ ...f, [field]: value })) }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onAdd({ ...form, id: generateId(), level: Number(form.level) })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h4>Add Custom Spell</h4>
      <label>Name <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required /></label>
      <label>Level
        <select value={form.level} onChange={e => set('level', Number(e.target.value))}>
          <option value={0}>Cantrip</option>
          {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </label>
      <label>School
        <select value={form.school} onChange={e => set('school', e.target.value)}>
          {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <label>Casting Time <input type="text" value={form.castingTime} onChange={e => set('castingTime', e.target.value)} /></label>
      <label>Range <input type="text" value={form.range} onChange={e => set('range', e.target.value)} /></label>
      <label>Components <input type="text" value={form.components} onChange={e => set('components', e.target.value)} /></label>
      <label>Duration <input type="text" value={form.duration} onChange={e => set('duration', e.target.value)} /></label>
      <label>
        <input type="checkbox" checked={form.concentration} onChange={e => set('concentration', e.target.checked)} />
        Concentration
      </label>
      <label>Description <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} /></label>
      <div className={styles.actions}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" className={styles.primary}>Add Spell</button>
      </div>
    </form>
  )
}
```

- [ ] **Step 6: Create `src/pages/Sheet/tabs/CustomSpellForm.module.css`**:
```css
.form { display: flex; flex-direction: column; gap: var(--space-sm); padding: var(--space-md); background: var(--color-bg-alt); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.form label { display: flex; flex-direction: column; gap: 2px; font-size: var(--text-sm); }
.actions { display: flex; justify-content: flex-end; gap: var(--space-sm); }
.primary { background: var(--color-accent); color: white; padding: var(--space-xs) var(--space-md); border-radius: var(--radius-sm); }
```

- [ ] **Step 7: Create `src/pages/Sheet/tabs/SpellsTab.jsx`**:
```jsx
import { useState } from 'react'
import { useCharacterStore } from '../../../store/characters'
import { useDerivedStats } from '../../../hooks/useDerivedStats'
import { useSpells } from '../../../hooks/useSpells'
import SpellCard from '../../../components/SpellCard/SpellCard'
import PipTracker from '../../../components/PipTracker/PipTracker'
import CustomSpellForm from './CustomSpellForm'
import styles from './SpellsTab.module.css'

export default function SpellsTab({ character }) {
  const { updateCharacter } = useCharacterStore()
  const derived = useDerivedStats(character)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [arcaneOpen, setArcaneOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterSchool, setFilterSchool] = useState('all')
  const [filterPrepared, setFilterPrepared] = useState('all')

  const { spells, customSpells, meta } = character
  const isWizard = meta.class === 'wizard'

  const filtered = useSpells(character, { search, level: filterLevel, school: filterSchool, prepared: filterPrepared })

  function setSlotUsed(level, used) {
    const slot = spells.slots[level]
    updateCharacter(character.id, { spells: { ...spells, slots: { ...spells.slots, [level]: { ...slot, used } } } })
  }

  function togglePrepared(spellId) {
    const isPrepared = spells.prepared.includes(spellId)
    updateCharacter(character.id, {
      spells: {
        ...spells,
        prepared: isPrepared
          ? spells.prepared.filter(id => id !== spellId)
          : [...spells.prepared, spellId],
      },
    })
  }

  function addCustomSpell(spellData) {
    updateCharacter(character.id, { customSpells: [...customSpells, spellData] })
    setShowCustomForm(false)
  }

  function removeCustomSpell(id) {
    updateCharacter(character.id, { customSpells: customSpells.filter(s => s.id !== id) })
  }

  // Arcane Recovery: Wizard; recover spell slots up to ceil(level/2) total levels
  const arcaneRecoveryMax = Math.ceil(meta.level / 2)
  function handleArcaneRecovery(recoverLevels) {
    // recoverLevels: array of slot level numbers to recover one slot each
    const newSlots = { ...spells.slots }
    for (const lvl of recoverLevels) {
      const s = newSlots[lvl]
      if (s.used > 0) newSlots[lvl] = { ...s, used: s.used - 1 }
    }
    updateCharacter(character.id, { spells: { ...spells, slots: newSlots, arcaneRecoveryUsed: true } })
    setArcaneOpen(false)
  }

  // Slot levels that have max > 0
  const activeSlotLevels = [1,2,3,4,5,6,7,8,9].filter(l => spells.slots[l].max > 0)

  return (
    <div className={styles.tab}>
      {/* Spell stats */}
      {spells.ability && (
        <div className={styles.spellStats}>
          <div className={styles.spellStat}>
            <span className={styles.statVal}>{derived.spellSaveDC}</span>
            <span className={styles.statLabel}>Spell Save DC</span>
          </div>
          <div className={styles.spellStat}>
            <span className={styles.statVal}>{derived.spellAttackBonus >= 0 ? `+${derived.spellAttackBonus}` : derived.spellAttackBonus}</span>
            <span className={styles.statLabel}>Spell Attack</span>
          </div>
        </div>
      )}

      {/* Slot Tracker */}
      {activeSlotLevels.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Spell Slots</h3>
          <div className={styles.slotGrid}>
            {activeSlotLevels.map(level => {
              const slot = spells.slots[level]
              return (
                <div key={level} className={styles.slotRow}>
                  <span className={styles.slotLevel}>Level {level} <span className={styles.slotCount}>{slot.max - slot.used}/{slot.max}</span></span>
                  <PipTracker
                    total={slot.max}
                    filled={slot.used}
                    onChange={used => setSlotUsed(level, used)}
                    label={`Slot ${level} pip`}
                  />
                </div>
              )
            })}
          </div>
          {isWizard && (
            <button
              className={styles.arcaneBtn}
              disabled={spells.arcaneRecoveryUsed || [1,2,3,4,5].every(l => (spells.slots[l]?.used ?? 0) === 0)}
              onClick={() => setArcaneOpen(true)}
              aria-label="Arcane Recovery"
              title={spells.arcaneRecoveryUsed ? 'Already used this rest' : [1,2,3,4,5].every(l => (spells.slots[l]?.used ?? 0) === 0) ? 'No recoverable slots available' : undefined}>
              Arcane Recovery {spells.arcaneRecoveryUsed ? '(used)' : ''}
            </button>
          )}
        </section>
      )}

      {/* Arcane Recovery Modal */}
      {arcaneOpen && (
        <ArcaneRecoveryModal
          slots={spells.slots}
          maxLevels={arcaneRecoveryMax}
          onConfirm={handleArcaneRecovery}
          onCancel={() => setArcaneOpen(false)}
        />
      )}

      {/* Spell List */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Spells</h3>
        <div className={styles.filters}>
          <input type="search" placeholder="Search spells…" value={search} onChange={e => setSearch(e.target.value)} aria-label="Search spells" />
          <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} aria-label="Filter by level">
            <option value="all">All levels</option>
            <option value="0">Cantrips</option>
            {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>Level {l}</option>)}
          </select>
          <select value={filterSchool} onChange={e => setFilterSchool(e.target.value)} aria-label="Filter by school">
            <option value="all">All schools</option>
            {['abjuration','conjuration','divination','enchantment','evocation','illusion','necromancy','transmutation'].map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <select value={filterPrepared} onChange={e => setFilterPrepared(e.target.value)} aria-label="Filter by prepared status">
            <option value="all">All spells</option>
            <option value="prepared">Prepared only</option>
            <option value="known">Known only</option>
          </select>
        </div>
        <div className={styles.spellList}>
          {filtered.map(spell => {
            const isCustom = !!customSpells.find(s => s.id === spell.id)
            return (
              <div key={spell.id} className={styles.spellCardWrapper}>
                <SpellCard
                  spell={spell}
                  prepared={spells.prepared.includes(spell.id)}
                  isCustom={isCustom}
                  onTogglePrepared={() => togglePrepared(spell.id)}
                />
                {isCustom && (
                  <button
                    className={styles.deleteSpellBtn}
                    onClick={() => removeCustomSpell(spell.id)}
                    aria-label={`Delete ${spell.name}`}>
                    ×
                  </button>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <p className={styles.empty}>No spells found.</p>}
        </div>
        {!showCustomForm
          ? <button className={styles.addBtn} onClick={() => setShowCustomForm(true)}>+ Add Custom Spell</button>
          : <CustomSpellForm onAdd={addCustomSpell} onCancel={() => setShowCustomForm(false)} />}
      </section>
    </div>
  )
}

// Arcane Recovery modal: select which slots to recover (sum of levels ≤ arcaneRecoveryMax)
function ArcaneRecoveryModal({ slots, maxLevels, onConfirm, onCancel }) {
  const [selected, setSelected] = useState([]) // array of slot level numbers

  const totalSelected = selected.reduce((s, l) => s + l, 0)

  function toggle(level) {
    if (selected.includes(level)) {
      setSelected(selected.filter(l => l !== level))
    } else if (totalSelected + level <= maxLevels && slots[level].used > 0) {
      setSelected([...selected, level])
    }
  }

  const recoverableLevels = [1,2,3,4,5].filter(l => slots[l].used > 0 && l < 6) // can't recover 6th+
  return (
    <div role="dialog" aria-label="Arcane Recovery" style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.4)', zIndex:300 }}>
      <div style={{ background:'var(--color-surface)', borderRadius:'var(--radius-lg)', padding:'var(--space-xl)', maxWidth:400, width:'100%' }}>
        <h3>Arcane Recovery</h3>
        <p>Recover spell slots totaling up to {maxLevels} levels (max level 5). Select slots to recover:</p>
        {recoverableLevels.map(l => (
          <label key={l}>
            <input type="checkbox" checked={selected.includes(l)}
              onChange={() => toggle(l)}
              disabled={!selected.includes(l) && totalSelected + l > maxLevels} />
            Level {l} slot ({slots[l].used} used)
          </label>
        ))}
        <p>Levels selected: {totalSelected} / {maxLevels}</p>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={() => onConfirm(selected)} disabled={selected.length === 0}>Recover</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Create `src/pages/Sheet/tabs/SpellsTab.module.css`**:
```css
.tab { display: flex; flex-direction: column; gap: var(--space-xl); }
.section { display: flex; flex-direction: column; gap: var(--space-md); }
.sectionTitle { font-family: var(--font-serif); font-size: var(--text-md); border-bottom: 1px solid var(--color-border-light); padding-bottom: var(--space-xs); }
.spellStats { display: flex; gap: var(--space-xl); }
.spellStat { display: flex; flex-direction: column; align-items: center; }
.statVal { font-size: var(--text-xl); font-weight: var(--weight-bold); }
.statLabel { font-size: var(--text-xs); color: var(--color-muted); text-transform: uppercase; }
.slotGrid { display: flex; flex-direction: column; gap: var(--space-sm); }
.slotRow { display: flex; align-items: center; gap: var(--space-md); }
.slotLevel { font-size: var(--text-sm); min-width: 90px; }
.slotCount { color: var(--color-muted); }
.arcaneBtn { align-self: flex-start; font-size: var(--text-sm); padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-sm); border: 1px solid var(--color-accent); color: var(--color-accent); background: none; cursor: pointer; }
.arcaneBtn:disabled { opacity: 0.5; cursor: default; }
.filters { display: flex; gap: var(--space-sm); flex-wrap: wrap; }
.filters input, .filters select { flex: 1; min-width: 120px; padding: var(--space-xs); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-surface); font-size: var(--text-sm); }
.spellList { display: flex; flex-direction: column; gap: var(--space-xs); }
.spellCardWrapper { position: relative; display: flex; align-items: flex-start; gap: var(--space-xs); }
.spellCardWrapper > :first-child { flex: 1; }
.deleteSpellBtn { flex-shrink: 0; background: none; border: none; color: var(--color-muted); cursor: pointer; font-size: var(--text-lg); line-height: 1; padding: var(--space-xs); border-radius: var(--radius-sm); }
.deleteSpellBtn:hover { color: var(--color-danger); }
.empty { color: var(--color-muted); font-size: var(--text-sm); text-align: center; padding: var(--space-lg); }
.addBtn { align-self: flex-start; font-size: var(--text-sm); color: var(--color-accent); background: none; border: none; cursor: pointer; }
```

- [ ] **Step 9: Update `src/pages/Sheet/Sheet.jsx`** — replace Spells placeholder:

Add at the top of the file (with the other imports):
```jsx
import SpellsTab from './tabs/SpellsTab'
```

Replace:
```jsx
{activeTab === 'Spells' && <div>Spells tab — Chunk 9</div>}
```
With:
```jsx
{activeTab === 'Spells' && <SpellsTab character={character} />}
```

- [ ] **Step 10: Run tests**:
```bash
npx vitest run src/tests/pages/SpellsTab.test.jsx
```
Expected: all 5 tests pass

- [ ] **Step 11: Run full suite**:
```bash
npx vitest run
```
Expected: all tests pass

- [ ] **Step 12: Commit**:
```bash
git add src/data/spells.json src/hooks/useSpells.js \
  src/pages/Sheet/tabs/SpellsTab.jsx src/pages/Sheet/tabs/SpellsTab.module.css \
  src/pages/Sheet/tabs/CustomSpellForm.jsx src/pages/Sheet/tabs/CustomSpellForm.module.css \
  src/tests/pages/SpellsTab.test.jsx src/pages/Sheet/Sheet.jsx
git commit -m "feat: add Spells tab with slot tracker, spell list, arcane recovery, and custom spells"
```

---

## Chunk 10: Equipment, Features, and Biography Tabs

### Task 22: Equipment Tab

**Files:**
- Create: `src/pages/Sheet/tabs/EquipmentTab.jsx`, `src/pages/Sheet/tabs/EquipmentTab.module.css`
- Create: `src/tests/pages/EquipmentTab.test.jsx`
- Modify: `src/pages/Sheet/Sheet.jsx`

- [ ] **Step 1: Write failing tests** — create `src/tests/pages/EquipmentTab.test.jsx`:
```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import EquipmentTab from '../../pages/Sheet/tabs/EquipmentTab'

const CHAR_WITH_GEAR = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 1, xp: 0, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores:{str:8,dex:16,con:12,int:17,wis:13,cha:10},
  proficiencies:{savingThrows:[],skills:[],expertise:[],tools:[],languages:['common'],armor:[],weapons:[]},
  hp:{max:7,current:7,temp:0,hitDiceTotal:1,hitDiceRemaining:1},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:5,sp:3,ep:0,gp:10,pp:0},
  equipment:[
    {id:'e1',name:'Dagger',quantity:2,weight:1,equipped:true,notes:'',damage:'1d4',damageType:'piercing',weaponProperties:['finesse','light','thrown'],weaponCategory:'simple',range:'20/60',armorClass:null,armorType:null},
    {id:'e2',name:'Spellbook',quantity:1,weight:3,equipped:false,notes:'50 spells',damage:null,damageType:null,weaponProperties:[],weaponCategory:null,range:null,armorClass:null,armorType:null},
  ],
  attacks:[],
  spells:{ability:'int',slots:{1:{max:2,used:0},2:{max:0,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:[],known:[],arcaneRecoveryUsed:false},
  features:[],conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

describe('EquipmentTab', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [CHAR_WITH_GEAR] }) })

  it('renders equipment items', () => {
    render(<EquipmentTab character={CHAR_WITH_GEAR} />)
    expect(screen.getByText('Dagger')).toBeInTheDocument()
    expect(screen.getByText('Spellbook')).toBeInTheDocument()
  })

  it('deletes an item on confirmation', async () => {
    render(<EquipmentTab character={CHAR_WITH_GEAR} />)
    await userEvent.click(screen.getAllByRole('button', { name: /delete/i })[0])
    expect(useCharacterStore.getState().characters[0].equipment).toHaveLength(1)
  })

  it('shows currency values', () => {
    render(<EquipmentTab character={CHAR_WITH_GEAR} />)
    expect(screen.getByDisplayValue('10')).toBeInTheDocument() // gp
  })

  it('adding a custom item appends to equipment', async () => {
    render(<EquipmentTab character={CHAR_WITH_GEAR} />)
    await userEvent.click(screen.getByRole('button', { name: /add custom item/i }))
    const nameInput = screen.getByPlaceholderText(/item name/i)
    await userEvent.type(nameInput, 'Rope')
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }))
    expect(useCharacterStore.getState().characters[0].equipment).toHaveLength(3)
  })
})
```

- [ ] **Step 2: Run to confirm failure**:
```bash
npx vitest run src/tests/pages/EquipmentTab.test.jsx
```
Expected: FAIL — module not found

- [ ] **Step 3: Create `src/pages/Sheet/tabs/EquipmentTab.jsx`**:
```jsx
import { useState } from 'react'
import { useCharacterStore } from '../../../store/characters'
import { useDerivedStats } from '../../../hooks/useDerivedStats'
import { generateId } from '../../../utils/ids'
import CurrencyRow from '../../../components/CurrencyRow/CurrencyRow'
import equipmentData from '../../../data/equipment.json'
import styles from './EquipmentTab.module.css'

export default function EquipmentTab({ character }) {
  const { updateCharacter } = useCharacterStore()
  const derived = useDerivedStats(character)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, weight: 0, notes: '' })
  const [catalogId, setCatalogId] = useState('')

  const { equipment, currency, settings } = character
  const totalWeight = equipment.reduce((s, e) => s + (e.weight * e.quantity), 0)

  function deleteItem(id) {
    updateCharacter(character.id, { equipment: equipment.filter(e => e.id !== id) })
  }

  function updateItem(id, patch) {
    updateCharacter(character.id, {
      equipment: equipment.map(e => e.id === id ? { ...e, ...patch } : e),
    })
  }

  function addFromCatalog(catalogItemId) {
    if (!catalogItemId) return
    const allItems = [...equipmentData.weapons, ...equipmentData.armor]
    const item = allItems.find(i => i.id === catalogItemId)
    if (!item) return
    const entry = {
      id: generateId(), name: item.name, quantity: 1, weight: item.weight,
      equipped: false, notes: '',
      damage: item.damage || null, damageType: item.damageType || null,
      weaponProperties: item.weaponProperties || [], weaponCategory: item.weaponCategory || null,
      range: item.range || null, armorClass: item.armorClass || null, armorType: item.armorType || null,
    }
    updateCharacter(character.id, { equipment: [...equipment, entry] })
    setCatalogId('')
  }

  function addCustomItem() {
    if (!newItem.name.trim()) return
    const entry = {
      id: generateId(), ...newItem, quantity: Number(newItem.quantity), weight: Number(newItem.weight),
      equipped: false,
      damage: null, damageType: null, weaponProperties: [], weaponCategory: null,
      range: null, armorClass: null, armorType: null,
    }
    updateCharacter(character.id, { equipment: [...equipment, entry] })
    setNewItem({ name: '', quantity: 1, weight: 0, notes: '' })
    setShowAddForm(false)
  }

  function updateCurrency(field, value) {
    updateCharacter(character.id, { currency: { ...currency, [field]: Math.max(0, Number(value)) } })
  }

  const allCatalogItems = [...equipmentData.weapons, ...equipmentData.armor]

  return (
    <div className={styles.tab}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Equipment</h3>
        {settings.advancedMode && (
          <div className={styles.carryRow}>
            <p className={styles.weight}>
              Carried: {totalWeight} lb / {derived.carryingCapacity} lb
              {/* Encumbered: > STR×5 = carryingCapacity/3; Heavily encumbered: > STR×10 = carryingCapacity×2/3 */}
              {totalWeight > derived.carryingCapacity / 3 && totalWeight <= derived.carryingCapacity * 2 / 3 && (
                <span className={styles.encumbered}> (encumbered)</span>
              )}
              {totalWeight > derived.carryingCapacity * 2 / 3 && totalWeight <= derived.carryingCapacity && (
                <span className={styles.encumbered}> (heavily encumbered)</span>
              )}
              {totalWeight > derived.carryingCapacity && (
                <span className={styles.overloaded}> (overloaded)</span>
              )}
            </p>
            <progress
              className={styles.carryBar}
              value={totalWeight}
              max={derived.carryingCapacity}
              aria-label="Carrying capacity"
            />
          </div>
        )}
        <table className={styles.table}>
          <thead>
            <tr><th>Name</th><th>Qty</th><th>Weight</th><th>Equip</th><th>Notes</th><th></th></tr>
          </thead>
          <tbody>
            {equipment.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  <input type="number" min={1} value={item.quantity}
                    onChange={e => updateItem(item.id, { quantity: Number(e.target.value) })}
                    className={styles.numInput} />
                </td>
                <td>{item.weight * item.quantity} lb</td>
                <td>
                  <input type="checkbox" checked={item.equipped}
                    onChange={e => updateItem(item.id, { equipped: e.target.checked })}
                    aria-label={`Equip ${item.name}`} />
                </td>
                <td>
                  <input type="text" value={item.notes}
                    onChange={e => updateItem(item.id, { notes: e.target.value })}
                    placeholder="Notes" className={styles.notesInput} />
                </td>
                <td>
                  <button onClick={() => deleteItem(item.id)} aria-label={`Delete ${item.name}`}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.addRow}>
          <select aria-label="Add from catalog" value={catalogId} onChange={e => { setCatalogId(e.target.value); addFromCatalog(e.target.value) }}>
            <option value="">Add from catalog…</option>
            <optgroup label="Weapons">
              {equipmentData.weapons.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </optgroup>
            <optgroup label="Armor">
              {equipmentData.armor.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </optgroup>
          </select>
          {!showAddForm
            ? <button onClick={() => setShowAddForm(true)} aria-label="Add custom item">+ Custom Item</button>
            : (
              <div className={styles.customForm}>
                <input type="text" placeholder="Item name" value={newItem.name}
                  onChange={e => setNewItem(f => ({ ...f, name: e.target.value }))} />
                <input type="number" placeholder="Qty" min={1} value={newItem.quantity}
                  onChange={e => setNewItem(f => ({ ...f, quantity: e.target.value }))} style={{ width: 50 }} />
                <input type="number" placeholder="Weight (lb)" min={0} step={0.1} value={newItem.weight}
                  onChange={e => setNewItem(f => ({ ...f, weight: e.target.value }))} style={{ width: 80 }} />
                <button onClick={addCustomItem} aria-label="Add">Add</button>
                <button onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            )}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Currency</h3>
        <CurrencyRow currency={currency} advancedMode={settings.advancedMode} onChange={updateCurrency} />
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/pages/Sheet/tabs/EquipmentTab.module.css`**:
```css
.tab { display: flex; flex-direction: column; gap: var(--space-xl); }
.section { display: flex; flex-direction: column; gap: var(--space-md); }
.sectionTitle { font-family: var(--font-serif); font-size: var(--text-md); border-bottom: 1px solid var(--color-border-light); padding-bottom: var(--space-xs); }
.carryRow { display: flex; flex-direction: column; gap: var(--space-xs); }
.weight { font-size: var(--text-sm); color: var(--color-muted); }
.carryBar { width: 100%; height: 8px; border-radius: 4px; accent-color: var(--color-accent); }
.encumbered { color: var(--color-warning, #b45309); font-weight: var(--weight-bold); }
.overloaded { color: var(--color-danger, #dc2626); font-weight: var(--weight-bold); }
.table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.table th { text-align: left; padding: var(--space-xs); color: var(--color-muted); border-bottom: 1px solid var(--color-border); }
.table td { padding: var(--space-xs); border-bottom: 1px solid var(--color-border-light); vertical-align: middle; }
.numInput { width: 44px; text-align: center; }
.notesInput { width: 100%; font-size: var(--text-xs); }
.addRow { display: flex; align-items: center; gap: var(--space-sm); flex-wrap: wrap; }
.customForm { display: flex; gap: var(--space-xs); align-items: center; flex-wrap: wrap; }
```

- [ ] **Step 5: Update `src/pages/Sheet/Sheet.jsx`** — add import at top of file, then replace Equipment placeholder:

Add at the top of the file (with the other imports):
```jsx
import EquipmentTab from './tabs/EquipmentTab'
```

Replace:
```jsx
{activeTab === 'Equipment' && <div>Equipment tab — Chunk 10</div>}
```
With:
```jsx
{activeTab === 'Equipment' && <EquipmentTab character={character} />}
```

- [ ] **Step 6: Run tests**:
```bash
npx vitest run src/tests/pages/EquipmentTab.test.jsx
```
Expected: all 4 tests pass

---

### Task 23: Features and Biography Tabs

**Files:**
- Create: `src/pages/Sheet/tabs/FeaturesTab.jsx`, `src/pages/Sheet/tabs/FeaturesTab.module.css`
- Create: `src/pages/Sheet/tabs/BiographyTab.jsx`, `src/pages/Sheet/tabs/BiographyTab.module.css`
- Modify: `src/pages/Sheet/Sheet.jsx`

- [ ] **Step 7: Write failing tests for FeaturesTab** — create `src/tests/pages/FeaturesTab.test.jsx`:
```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import FeaturesTab from '../../pages/Sheet/tabs/FeaturesTab'

const CHAR_WITH_FEATURES = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 1, xp: 0, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores:{str:8,dex:16,con:12,int:17,wis:13,cha:10},
  proficiencies:{savingThrows:[],skills:[],expertise:[],tools:[],languages:['common'],armor:[],weapons:[]},
  hp:{max:7,current:7,temp:0,hitDiceTotal:1,hitDiceRemaining:1},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:0,sp:0,ep:0,gp:0,pp:0},equipment:[],attacks:[],
  spells:{ability:'int',slots:{1:{max:2,used:0},2:{max:0,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:[],known:[],arcaneRecoveryUsed:false},
  features:[
    { id:'f1', name:'Arcane Recovery', source:'class', description:'Recover spell slots.', uses:1, maxUses:1, recharge:'long-rest' },
    { id:'f2', name:'Sage Researcher', source:'background', description:'Background research ability.', uses:null, maxUses:null, recharge:null },
  ],
  conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

describe('FeaturesTab', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [CHAR_WITH_FEATURES] }) })

  it('renders features grouped by source', () => {
    render(<FeaturesTab character={CHAR_WITH_FEATURES} />)
    // Group headings
    expect(screen.getByText(/class/i)).toBeInTheDocument()
    expect(screen.getByText(/background/i)).toBeInTheDocument()
    // Feature names
    expect(screen.getByText('Arcane Recovery')).toBeInTheDocument()
    expect(screen.getByText('Sage Researcher')).toBeInTheDocument()
  })

  it('deletes a feature', async () => {
    render(<FeaturesTab character={CHAR_WITH_FEATURES} />)
    await userEvent.click(screen.getAllByRole('button', { name: /delete/i })[0])
    expect(useCharacterStore.getState().characters[0].features).toHaveLength(1)
  })

  it('adds a custom feature', async () => {
    render(<FeaturesTab character={CHAR_WITH_FEATURES} />)
    await userEvent.click(screen.getByRole('button', { name: /add feature/i }))
    await userEvent.type(screen.getByLabelText(/name/i), 'Lucky')
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }))
    expect(useCharacterStore.getState().characters[0].features).toHaveLength(3)
  })
})
```

- [ ] **Step 7b: Run to confirm failure**:
```bash
npx vitest run src/tests/pages/FeaturesTab.test.jsx
```
Expected: FAIL — module not found

- [ ] **Step 8: Create `src/pages/Sheet/tabs/FeaturesTab.jsx`**:
```jsx
import { useState } from 'react'
import { useCharacterStore } from '../../../store/characters'
import { generateId } from '../../../utils/ids'
import FeatureCard from '../../../components/FeatureCard/FeatureCard'
import styles from './FeaturesTab.module.css'

const RECHARGE_OPTIONS = [null, 'short-rest', 'long-rest', 'day']
const SOURCE_OPTIONS = ['custom', 'class', 'race', 'background']

export default function FeaturesTab({ character }) {
  const { updateCharacter } = useCharacterStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', source: 'custom', description: '', uses: '', recharge: null })

  const { features } = character

  function deleteFeature(id) {
    updateCharacter(character.id, { features: features.filter(f => f.id !== id) })
  }

  function updateFeatureUses(id, usedCount) {
    // usedCount is the number of pips filled (=used), so remaining = max - usedCount
    updateCharacter(character.id, {
      features: features.map(f => f.id === id ? { ...f, uses: f.maxUses - usedCount } : f),
    })
  }

  function addFeature() {
    const maxUses = form.uses !== '' ? Number(form.uses) : null
    const feature = {
      id: generateId(), name: form.name, source: form.source,
      description: form.description, uses: maxUses, maxUses, recharge: form.recharge,
    }
    updateCharacter(character.id, { features: [...features, feature] })
    setForm({ name: '', source: 'custom', description: '', uses: '', recharge: null })
    setShowForm(false)
  }

  // Group features by source
  const SOURCES = ['class', 'race', 'background', 'custom']
  const grouped = SOURCES.reduce((acc, src) => {
    const group = features.filter(f => f.source === src)
    if (group.length > 0) acc.push({ source: src, items: group })
    return acc
  }, [])
  const uncategorized = features.filter(f => !SOURCES.includes(f.source))
  if (uncategorized.length > 0) grouped.push({ source: 'other', items: uncategorized })

  return (
    <div className={styles.tab}>
      {grouped.length === 0 && <p className={styles.empty}>No features yet.</p>}
      {grouped.map(({ source, items }) => (
        <section key={source} className={styles.group}>
          <h3 className={styles.groupTitle}>{source.charAt(0).toUpperCase() + source.slice(1)}</h3>
          <div className={styles.list}>
            {items.map(feature => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onDelete={() => deleteFeature(feature.id)}
                onUsesChange={used => updateFeatureUses(feature.id, used)}
              />
            ))}
          </div>
        </section>
      ))}

      {!showForm ? (
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>+ Add Feature</button>
      ) : (
        <div className={styles.form}>
          <h4>Add Custom Feature</h4>
          <label>Name <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></label>
          <label>Source
            <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}>
              {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label>Description <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></label>
          <label>Max Uses (leave blank for unlimited) <input type="number" min={1} value={form.uses} onChange={e => setForm(f => ({ ...f, uses: e.target.value }))} /></label>
          <label>Recharge
            <select value={form.recharge || ''} onChange={e => setForm(f => ({ ...f, recharge: e.target.value || null }))}>
              <option value="">None</option>
              <option value="short-rest">Short Rest</option>
              <option value="long-rest">Long Rest</option>
              <option value="day">Day</option>
            </select>
          </label>
          <div className={styles.formActions}>
            <button onClick={() => setShowForm(false)}>Cancel</button>
            <button className={styles.primary} onClick={addFeature} disabled={!form.name.trim()}>Add</button>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 8b: Create `src/pages/Sheet/tabs/FeaturesTab.module.css`**:
```css
.tab { display: flex; flex-direction: column; gap: var(--space-lg); }
.group { display: flex; flex-direction: column; gap: var(--space-sm); }
.groupTitle { font-family: var(--font-serif); font-size: var(--text-sm); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-muted); border-bottom: 1px solid var(--color-border-light); padding-bottom: var(--space-xs); }
.list { display: flex; flex-direction: column; gap: var(--space-sm); }
.empty { color: var(--color-muted); font-size: var(--text-sm); }
.addBtn { align-self: flex-start; color: var(--color-accent); background: none; border: none; cursor: pointer; font-size: var(--text-sm); }
.form { display: flex; flex-direction: column; gap: var(--space-sm); padding: var(--space-md); background: var(--color-bg-alt); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.form label { display: flex; flex-direction: column; gap: 2px; font-size: var(--text-sm); }
.formActions { display: flex; justify-content: flex-end; gap: var(--space-sm); }
.primary { background: var(--color-accent); color: white; padding: var(--space-xs) var(--space-md); border-radius: var(--radius-sm); }
```

- [ ] **Step 9: Write failing tests for BiographyTab** — create `src/tests/pages/BiographyTab.test.jsx`:
```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import BiographyTab from '../../pages/Sheet/tabs/BiographyTab'

const CHAR_BIO = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 1, xp: 0, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores:{str:8,dex:16,con:12,int:17,wis:13,cha:10},
  proficiencies:{savingThrows:[],skills:[],expertise:[],tools:[],languages:['common'],armor:[],weapons:[]},
  hp:{max:7,current:7,temp:0,hitDiceTotal:1,hitDiceRemaining:1},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:0,sp:0,ep:0,gp:0,pp:0},equipment:[],attacks:[],
  spells:{ability:'int',slots:{1:{max:2,used:0},2:{max:0,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:[],known:[],arcaneRecoveryUsed:false},
  features:[],
  conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'Curious',ideals:'Knowledge',bonds:'',flaws:'',appearance:'',backstory:'',age:'120',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

describe('BiographyTab', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [CHAR_BIO] }) })

  it('renders pre-filled biography traits', () => {
    render(<BiographyTab character={CHAR_BIO} />)
    expect(screen.getByDisplayValue('Curious')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Knowledge')).toBeInTheDocument()
  })

  it('renders physical characteristics fields', () => {
    render(<BiographyTab character={CHAR_BIO} />)
    expect(screen.getByDisplayValue('120')).toBeInTheDocument() // age
  })

  it('editing a field updates the store', async () => {
    render(<BiographyTab character={CHAR_BIO} />)
    const backstoryArea = screen.getByLabelText(/backstory/i)
    await userEvent.type(backstoryArea, ' An orphan.')
    expect(useCharacterStore.getState().characters[0].biography.backstory).toContain('orphan')
  })
})
```

- [ ] **Step 9b: Run to confirm failure**:
```bash
npx vitest run src/tests/pages/BiographyTab.test.jsx
```
Expected: FAIL — module not found

- [ ] **Step 10: Create `src/pages/Sheet/tabs/BiographyTab.jsx`**:
```jsx
import { useCharacterStore } from '../../../store/characters'
import styles from './BiographyTab.module.css'

const TEXT_FIELDS = [
  { key: 'personalityTraits', label: 'Personality Traits', rows: 3 },
  { key: 'ideals', label: 'Ideals', rows: 2 },
  { key: 'bonds', label: 'Bonds', rows: 2 },
  { key: 'flaws', label: 'Flaws', rows: 2 },
  { key: 'appearance', label: 'Appearance', rows: 3 },
  { key: 'backstory', label: 'Backstory', rows: 5 },
  { key: 'notes', label: 'Notes', rows: 4 },
]

const PHYS_FIELDS = [
  { key: 'age', label: 'Age' }, { key: 'height', label: 'Height' },
  { key: 'weight', label: 'Weight' }, { key: 'eyes', label: 'Eyes' },
  { key: 'skin', label: 'Skin' }, { key: 'hair', label: 'Hair' },
]

export default function BiographyTab({ character }) {
  const { updateCharacter } = useCharacterStore()
  const { biography } = character

  function setBio(key, value) {
    updateCharacter(character.id, { biography: { ...biography, [key]: value } })
  }

  return (
    <div className={styles.tab}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Physical Characteristics</h3>
        <div className={styles.physGrid}>
          {PHYS_FIELDS.map(({ key, label }) => (
            <label key={key} className={styles.physField}>
              {label}
              <input type="text" value={biography[key]} onChange={e => setBio(key, e.target.value)} />
            </label>
          ))}
        </div>
      </section>

      {TEXT_FIELDS.map(({ key, label, rows }) => (
        <section key={key} className={styles.section}>
          <label className={styles.bioLabel}>
            <span className={styles.sectionTitle}>{label}</span>
            <textarea
              rows={rows}
              value={biography[key]}
              onChange={e => setBio(key, e.target.value)}
              className={styles.bioArea}
            />
          </label>
        </section>
      ))}
    </div>
  )
}
```

- [ ] **Step 10b: Create `src/pages/Sheet/tabs/BiographyTab.module.css`**:
```css
.tab { display: flex; flex-direction: column; gap: var(--space-xl); }
.section { display: flex; flex-direction: column; gap: var(--space-sm); }
.sectionTitle { font-family: var(--font-serif); font-size: var(--text-md); border-bottom: 1px solid var(--color-border-light); padding-bottom: var(--space-xs); }
.physGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--space-sm); }
.physField { display: flex; flex-direction: column; gap: 2px; font-size: var(--text-sm); }
.bioLabel { display: flex; flex-direction: column; gap: var(--space-xs); }
.bioArea { width: 100%; resize: vertical; font-family: var(--font-sans); font-size: var(--text-sm); padding: var(--space-xs); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-surface); }
```

- [ ] **Step 11: Update `src/pages/Sheet/Sheet.jsx`** — add imports at top of file, then replace Features and Biography placeholders:

Add at the top of the file (with the other imports):
```jsx
import FeaturesTab from './tabs/FeaturesTab'
import BiographyTab from './tabs/BiographyTab'
```

Replace:
```jsx
{activeTab === 'Features' && <div>Features tab — Chunk 10</div>}
{activeTab === 'Biography' && <div>Biography tab — Chunk 10</div>}
```
With:
```jsx
{activeTab === 'Features' && <FeaturesTab character={character} />}
{activeTab === 'Biography' && <BiographyTab character={character} />}
```

- [ ] **Step 12: Run full test suite**:
```bash
npx vitest run
```
Expected: all tests pass

- [ ] **Step 13: Commit**:
```bash
git add src/pages/Sheet/tabs/EquipmentTab.jsx src/pages/Sheet/tabs/EquipmentTab.module.css \
  src/pages/Sheet/tabs/FeaturesTab.jsx src/pages/Sheet/tabs/FeaturesTab.module.css \
  src/pages/Sheet/tabs/BiographyTab.jsx src/pages/Sheet/tabs/BiographyTab.module.css \
  src/tests/pages/EquipmentTab.test.jsx \
  src/tests/pages/FeaturesTab.test.jsx src/tests/pages/BiographyTab.test.jsx \
  src/pages/Sheet/Sheet.jsx
git commit -m "feat: add Equipment, Features, and Biography tabs"
```

---

## Chunk 11: Print View

### Task 24: Print View

**Files:**
- Create: `src/pages/Print/PrintView.jsx`, `src/pages/Print/PrintView.module.css`
- Create: `src/tests/pages/PrintView.test.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write failing tests** — create `src/tests/pages/PrintView.test.jsx`:
```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import PrintView from '../../pages/Print/PrintView'

const CHAR = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 3, xp: 300, inspiration: false, playerName: 'Sean', subrace: 'high-elf', background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores:{str:8,dex:16,con:12,int:17,wis:13,cha:10},
  proficiencies:{savingThrows:['int','wis'],skills:['arcana','history'],expertise:[],tools:[],languages:['common','elvish'],armor:[],weapons:[]},
  hp:{max:16,current:16,temp:0,hitDiceTotal:3,hitDiceRemaining:3},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:0,sp:0,ep:0,gp:10,pp:0},equipment:[],
  attacks:[{id:'a1',name:'Dagger',equipmentId:null,attackAbility:'dex',attackBonusOverride:null,damage:'1d4',damageType:'piercing',damageAbility:'dex',notes:''}],
  spells:{ability:'int',slots:{1:{max:4,used:1},2:{max:2,used:0},3:{max:2,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:['magic-missile'],known:['magic-missile'],arcaneRecoveryUsed:false},
  features:[{id:'f1',name:'Arcane Recovery',source:'class',description:'Once per day when you finish a short rest, you can recover expended spell slots.',uses:1,maxUses:1,recharge:'day'}],
  conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'I use polysyllabic words.',ideals:'Knowledge',bonds:'My spellbook',flaws:'Distracted by information',appearance:'Pale, slender',backstory:'Former apprentice',age:'120',height:'5\'4"',weight:'108 lb',eyes:'Blue',skin:'Fair',hair:'Silver',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

function renderPrint() {
  return render(
    <MemoryRouter initialEntries={['/character/c1/print']}>
      <Routes><Route path="/character/:id/print" element={<PrintView />} /></Routes>
    </MemoryRouter>
  )
}

describe('PrintView', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [CHAR] }) })

  it('shows character name and class', () => {
    renderPrint()
    expect(screen.getByText('Aria')).toBeInTheDocument()
    expect(screen.getByText(/wizard/i)).toBeInTheDocument()
  })

  it('shows all 6 ability scores', () => {
    renderPrint()
    expect(screen.getByText('STR')).toBeInTheDocument()
    expect(screen.getByText('INT')).toBeInTheDocument()
  })

  it('shows weapon attacks table', () => {
    renderPrint()
    expect(screen.getByText('Dagger')).toBeInTheDocument()
  })

  it('shows spells section for casters', () => {
    renderPrint()
    expect(screen.getByText(/spell slots/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to confirm failure**:
```bash
npx vitest run src/tests/pages/PrintView.test.jsx
```
Expected: FAIL — module not found

- [ ] **Step 3: Create `src/pages/Print/PrintView.jsx`**:
```jsx
import { useParams, useNavigate } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import { useDerivedStats } from '../../hooks/useDerivedStats'
import skillsData from '../../data/skills.json'
import spellsData from '../../data/spells.json'
import styles from './PrintView.module.css'

const ABILITIES = ['str','dex','con','int','wis','cha']
const AB_LABEL = { str:'STR', dex:'DEX', con:'CON', int:'INT', wis:'WIS', cha:'CHA' }
function fmt(n) { return n >= 0 ? `+${n}` : `${n}` }

export default function PrintView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const character = useCharacterStore(s => s.characters.find(c => c.id === id))

  if (!character) { navigate('/'); return null }
  const derived = useDerivedStats(character)
  const { meta, abilityScores, proficiencies, hp, combat, attacks, spells, features, equipment, currency, biography, customSpells, settings } = character

  const isSpellcaster = spells.ability !== null
  const activeSlots = [1,2,3,4,5,6,7,8,9].filter(l => spells.slots[l].max > 0)
  const preparedSpells = [...spellsData, ...customSpells].filter(s => spells.prepared.includes(s.id))
  const knownCantrips = [...spellsData, ...customSpells].filter(s => spells.known.includes(s.id) && s.level === 0)

  return (
    <div className={styles.page}>
      <div className={styles.printBtn}>
        <button onClick={() => window.print()} aria-label="Print">Print / Save as PDF</button>
        <button onClick={() => navigate(`/character/${id}`)}>← Back to Sheet</button>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.charName}>{meta.characterName}</h1>
        <div className={styles.headerMeta}>
          <span>Level {meta.level} {meta.race} {meta.class}</span>
          <span>Background: {meta.background}</span>
          <span>Alignment: {meta.alignment}</span>
          <span>XP: {meta.xp}</span>
          {meta.playerName && <span>Player: {meta.playerName}</span>}
        </div>
      </header>

      {/* Ability Scores + Saves + Skills */}
      <section className={styles.section}>
        <div className={styles.abilitiesRow}>
          {ABILITIES.map(a => (
            <div key={a} className={styles.abilityBlock}>
              <span className={styles.abilityLabel}>{AB_LABEL[a]}</span>
              <span className={styles.abilityScore}>{abilityScores[a]}</span>
              <span className={styles.abilityMod}>{fmt(derived.abilityModifiers[a])}</span>
              <span className={styles.saveBonus}>
                Save: {fmt(derived.savingThrowBonuses[a])}
                {proficiencies.savingThrows.includes(a) ? ' ●' : ''}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.skills}>
          <strong>Proficiency Bonus:</strong> {fmt(derived.proficiencyBonus)}&nbsp;&nbsp;
          <strong>Passive Perception:</strong> {derived.passivePerception}
          &nbsp;&nbsp;<strong>Initiative:</strong> {fmt(derived.initiative)}
          <table className={styles.skillTable}>
            <tbody>
              {skillsData.map(skill => (
                <tr key={skill.id}>
                  <td>{proficiencies.skills.includes(skill.id) ? (proficiencies.expertise.includes(skill.id) ? '◆' : '●') : '○'}</td>
                  <td>{fmt(derived.skillBonuses[skill.id])}</td>
                  <td>{skill.name}</td>
                  <td className={styles.skillAbility}>({AB_LABEL[skill.ability]})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Combat */}
      <section className={styles.section}>
        <h2>Combat</h2>
        <div className={styles.combatRow}>
          <div><strong>AC</strong><br/>{derived.ac}</div>
          <div><strong>HP</strong><br/>{hp.current}/{hp.max}{hp.temp > 0 ? ` (+${hp.temp} temp)` : ''}</div>
          <div><strong>Speed</strong><br/>{combat.speed} ft</div>
          <div><strong>Hit Dice</strong><br/>{hp.hitDiceRemaining}/{hp.hitDiceTotal}</div>
        </div>
        {attacks.length > 0 && (
          <table className={styles.attackTable}>
            <thead><tr><th>Attack</th><th>Bonus</th><th>Damage</th><th>Type</th></tr></thead>
            <tbody>
              {attacks.map(a => {
                const bonus = a.attackBonusOverride !== null ? a.attackBonusOverride
                  : (derived.abilityModifiers[a.attackAbility] ?? 0) + derived.proficiencyBonus
                const damMod = a.damageAbility ? (derived.abilityModifiers[a.damageAbility] ?? 0) : 0
                return (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{fmt(bonus)}</td>
                    <td>{a.damage}{damMod !== 0 ? ` ${fmt(damMod)}` : ''}</td>
                    <td>{a.damageType}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        {meta.class === 'rogue' && (
          <p><strong>Sneak Attack:</strong> {derived.sneakAttackDice}d6</p>
        )}
      </section>

      {/* Proficiencies */}
      <section className={styles.section}>
        <h2>Proficiencies & Languages</h2>
        {proficiencies.armor.length > 0 && <p><strong>Armor:</strong> {proficiencies.armor.join(', ')}</p>}
        {proficiencies.weapons.length > 0 && <p><strong>Weapons:</strong> {proficiencies.weapons.join(', ')}</p>}
        {proficiencies.tools.length > 0 && <p><strong>Tools:</strong> {proficiencies.tools.join(', ')}</p>}
        {proficiencies.languages.length > 0 && <p><strong>Languages:</strong> {proficiencies.languages.join(', ')}</p>}
      </section>

      {/* Features */}
      {features.length > 0 && (
        <section className={styles.section}>
          <h2>Features & Traits</h2>
          {features.map(f => (
            <div key={f.id} className={styles.feature}>
              <strong>{f.name}</strong> <em>({f.source})</em>
              {f.maxUses !== null && ` — Uses: ${f.uses}/${f.maxUses}`}
              <p>{f.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Equipment */}
      {equipment.length > 0 && (
        <section className={styles.section}>
          <h2>Equipment</h2>
          <table className={styles.eqTable}>
            <thead><tr><th>Item</th><th>Qty</th><th>Equipped</th><th>Notes</th></tr></thead>
            <tbody>
              {equipment.map(e => (
                <tr key={e.id}>
                  <td>{e.name}</td><td>{e.quantity}</td>
                  <td>{e.equipped ? '✓' : ''}</td><td>{e.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p><strong>Currency:</strong> {currency.gp} gp, {currency.sp} sp, {currency.cp} cp{settings.advancedMode ? `, ${currency.ep} ep` : ''}, {currency.pp} pp</p>
        </section>
      )}

      {/* Spells */}
      {isSpellcaster && (
        <section className={styles.section}>
          <h2>Spells</h2>
          <p><strong>Spell Save DC:</strong> {derived.spellSaveDC} &nbsp; <strong>Spell Attack:</strong> {fmt(derived.spellAttackBonus)}</p>
          <div className={styles.slotRow}>
            {activeSlots.map(l => (
              <span key={l} className={styles.slotBadge}>Lvl {l}: {spells.slots[l].max - spells.slots[l].used}/{spells.slots[l].max}</span>
            ))}
          </div>
          {knownCantrips.length > 0 && (
            <p><strong>Cantrips:</strong> {knownCantrips.map(s => s.name).join(', ')}</p>
          )}
          {preparedSpells.length > 0 && (
            <div>
              <strong>Prepared Spells:</strong>
              {preparedSpells.map(s => (
                <div key={s.id} className={styles.printSpell}>
                  <strong>{s.name}</strong> (Level {s.level}, {s.school}) — {s.castingTime}, {s.range}, {s.duration}
                  <p>{s.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Biography */}
      <section className={styles.section}>
        <h2>Biography</h2>
        {biography.age && <p><strong>Age:</strong> {biography.age} &nbsp; <strong>Height:</strong> {biography.height} &nbsp; <strong>Weight:</strong> {biography.weight}</p>}
        {biography.eyes && <p><strong>Eyes:</strong> {biography.eyes} &nbsp; <strong>Skin:</strong> {biography.skin} &nbsp; <strong>Hair:</strong> {biography.hair}</p>}
        {biography.appearance && <p><strong>Appearance:</strong> {biography.appearance}</p>}
        {biography.personalityTraits && <p><strong>Personality:</strong> {biography.personalityTraits}</p>}
        {biography.ideals && <p><strong>Ideals:</strong> {biography.ideals}</p>}
        {biography.bonds && <p><strong>Bonds:</strong> {biography.bonds}</p>}
        {biography.flaws && <p><strong>Flaws:</strong> {biography.flaws}</p>}
        {biography.backstory && <p><strong>Backstory:</strong> {biography.backstory}</p>}
        {biography.notes && <p><strong>Notes:</strong> {biography.notes}</p>}
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/pages/Print/PrintView.module.css`**:
```css
.page { max-width: 800px; margin: 0 auto; padding: var(--space-xl) var(--space-md); font-size: 12pt; }
.printBtn { display: flex; gap: var(--space-sm); margin-bottom: var(--space-lg); }
.header { margin-bottom: var(--space-lg); border-bottom: 2px solid var(--color-border); padding-bottom: var(--space-md); }
.charName { font-family: var(--font-serif); font-size: 24pt; margin: 0; }
.headerMeta { display: flex; gap: var(--space-lg); flex-wrap: wrap; font-size: 11pt; color: var(--color-muted); }
.section { margin-bottom: var(--space-xl); }
.section h2 { font-family: var(--font-serif); font-size: 14pt; border-bottom: 1px solid var(--color-border); margin-bottom: var(--space-sm); }
.abilitiesRow { display: flex; gap: var(--space-md); flex-wrap: wrap; margin-bottom: var(--space-md); }
.abilityBlock { display: flex; flex-direction: column; align-items: center; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: var(--space-xs) var(--space-sm); min-width: 70px; }
.abilityLabel { font-size: 8pt; font-weight: var(--weight-bold); text-transform: uppercase; color: var(--color-muted); }
.abilityScore { font-size: 16pt; font-weight: var(--weight-bold); line-height: 1.1; }
.abilityMod { font-size: 12pt; }
.saveBonus { font-size: 8pt; color: var(--color-muted); }
.skills { display: flex; flex-direction: column; gap: var(--space-xs); }
.skillTable { border-collapse: collapse; font-size: 10pt; }
.skillTable td { padding: 2px 4px; }
.skillAbility { color: var(--color-muted); }
.combatRow { display: flex; gap: var(--space-xl); flex-wrap: wrap; margin-bottom: var(--space-md); }
.combatRow > div { text-align: center; }
.attackTable, .eqTable { width: 100%; border-collapse: collapse; font-size: 10pt; margin-top: var(--space-sm); }
.attackTable th, .eqTable th { text-align: left; border-bottom: 1px solid var(--color-border); padding: 2px 4px; }
.attackTable td, .eqTable td { padding: 2px 4px; border-bottom: 1px solid var(--color-border-light); }
.feature { margin-bottom: var(--space-sm); }
.feature p { margin: 2px 0; font-size: 10pt; }
.slotRow { display: flex; gap: var(--space-sm); flex-wrap: wrap; margin-bottom: var(--space-sm); }
.slotBadge { font-size: 10pt; padding: 2px 6px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); }
.printSpell { margin-bottom: var(--space-sm); }
.printSpell p { margin: 2px 0; font-size: 10pt; }
@page { margin: 10mm; }
@media print {
  .printBtn { display: none !important; }
  .page { margin: 0; padding: 10mm; }
}
```

- [ ] **Step 5: Update `src/App.jsx`** — replace Print placeholder:
```jsx
import { Routes, Route } from 'react-router-dom'
import Roster from './pages/Roster/Roster'
import Wizard from './pages/Wizard/Wizard'
import Sheet from './pages/Sheet/Sheet'
import PrintView from './pages/Print/PrintView'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Roster />} />
      <Route path="/new" element={<Wizard />} />
      <Route path="/character/:id" element={<Sheet />} />
      <Route path="/character/:id/print" element={<PrintView />} />
    </Routes>
  )
}
```

- [ ] **Step 6: Run tests**:
```bash
npx vitest run src/tests/pages/PrintView.test.jsx
```
Expected: all 4 tests pass

- [ ] **Step 7: Run full suite**:
```bash
npx vitest run
```
Expected: all tests pass

- [ ] **Step 8: Commit**:
```bash
git add src/pages/Print/ src/tests/pages/PrintView.test.jsx src/App.jsx
git commit -m "feat: add print view with all character sheet sections and @media print styling"
```

---

## Chunk 12: Guided Flows (Short Rest, Long Rest, Level Up)

### Task 25: Rest Modals

**Files:**
- Create: `src/pages/Sheet/modals/ShortRestModal.jsx`
- Create: `src/pages/Sheet/modals/LongRestModal.jsx`
- Create: `src/tests/pages/RestModals.test.jsx`
- Modify: `src/pages/Sheet/Sheet.jsx`

- [ ] **Step 1: Write failing tests** — create `src/tests/pages/RestModals.test.jsx`:
```jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import ShortRestModal from '../../pages/Sheet/modals/ShortRestModal'
import LongRestModal from '../../pages/Sheet/modals/LongRestModal'

const CHAR = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 3, xp: 300, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores:{str:8,dex:16,con:12,int:17,wis:13,cha:10},
  proficiencies:{savingThrows:[],skills:[],expertise:[],tools:[],languages:['common'],armor:[],weapons:[]},
  hp:{max:16,current:10,temp:0,hitDiceTotal:3,hitDiceRemaining:3},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:0,sp:0,ep:0,gp:0,pp:0},equipment:[],attacks:[],
  spells:{ability:'int',slots:{1:{max:4,used:2},2:{max:2,used:1},3:{max:2,used:2},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:['magic-missile'],known:['magic-missile'],arcaneRecoveryUsed:true},
  features:[{id:'f1',name:'Channel Divinity',source:'class',description:'Use channel divinity.',uses:0,maxUses:1,recharge:'short-rest'}],
  conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

describe('ShortRestModal', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [CHAR] }) })

  it('shows remaining hit dice count', () => {
    render(<ShortRestModal character={CHAR} onClose={() => {}} />)
    expect(screen.getByText(/hit dice remaining.*3/i)).toBeInTheDocument()
  })

  it('spending a hit die via Roll button increases HP and decreases remaining', async () => {
    render(<ShortRestModal character={CHAR} onClose={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /roll d6/i }))
    const char = useCharacterStore.getState().characters[0]
    expect(char.hp.hitDiceRemaining).toBe(2)
    expect(char.hp.current).toBeGreaterThan(10)
  })

  it('closes on Finish', async () => {
    const onClose = vi.fn()
    render(<ShortRestModal character={CHAR} onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /finish rest/i }))
    expect(onClose).toHaveBeenCalled()
  })
})

describe('LongRestModal', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [CHAR] }) })

  it('after confirming, restores HP to max', async () => {
    render(<LongRestModal character={CHAR} onClose={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /take long rest/i }))
    expect(useCharacterStore.getState().characters[0].hp.current).toBe(16)
  })

  it('after confirming, restores all spell slots', async () => {
    render(<LongRestModal character={CHAR} onClose={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /take long rest/i }))
    const slots = useCharacterStore.getState().characters[0].spells.slots
    expect(slots[1].used).toBe(0)
    expect(slots[2].used).toBe(0)
  })

  it('after confirming, resets arcane recovery', async () => {
    render(<LongRestModal character={CHAR} onClose={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /take long rest/i }))
    expect(useCharacterStore.getState().characters[0].spells.arcaneRecoveryUsed).toBe(false)
  })
})
```

- [ ] **Step 2: Run to confirm failure**:
```bash
npx vitest run src/tests/pages/RestModals.test.jsx
```
Expected: FAIL — module not found

- [ ] **Step 3: Create `src/pages/Sheet/modals/ShortRestModal.jsx`**:
```jsx
import { useState } from 'react'
import { useCharacterStore } from '../../../store/characters'
import { rollDice } from '../../../utils/diceRoller'
import { useDerivedStats } from '../../../hooks/useDerivedStats'
import Modal from '../../../components/Modal/Modal'
import classes from '../../../data/classes.json'

export default function ShortRestModal({ character, onClose }) {
  const { updateCharacter } = useCharacterStore()
  const derived = useDerivedStats(character)
  const [healingLog, setHealingLog] = useState([])

  const classData = classes.find(c => c.id === character.meta.class)
  const hitDie = classData?.hitDie || 6
  const conMod = derived.abilityModifiers.con ?? 0
  const { hp } = character
  // Get live character from store for dice remaining
  const liveChar = useCharacterStore(s => s.characters.find(c => c.id === character.id)) || character
  const remaining = liveChar.hp.hitDiceRemaining
  const current = liveChar.hp.current

  function rollHitDie() {
    if (remaining <= 0) return
    const { result: roll } = rollDice(`1d${hitDie}`)
    const heal = Math.max(1, roll + conMod)
    const newCurrent = Math.min(hp.max, current + heal)
    updateCharacter(character.id, {
      hp: { ...liveChar.hp, current: newCurrent, hitDiceRemaining: remaining - 1 },
    })
    setHealingLog(log => [...log, { roll, conMod, heal, total: newCurrent }])
  }

  function finish() {
    // Reset short-rest features
    updateCharacter(character.id, {
      features: liveChar.features.map(f =>
        f.recharge === 'short-rest'
          ? { ...f, uses: f.maxUses }
          : f
      ),
    })
    onClose()
  }

  return (
    <Modal title="Short Rest" onClose={onClose} size="md">
      <p>Hit Dice Remaining: {remaining} / {liveChar.hp.hitDiceTotal} (d{hitDie})</p>
      <p>Current HP: {current} / {hp.max}</p>
      <button onClick={rollHitDie} disabled={remaining <= 0} aria-label={`Roll d${hitDie}`}>
        Roll d{hitDie} {conMod !== 0 ? `(${conMod >= 0 ? '+' : ''}${conMod})` : ''}
      </button>
      {healingLog.length > 0 && (
        <ul>
          {healingLog.map((entry, i) => (
            <li key={i}>Rolled {entry.roll}{entry.conMod !== 0 ? ` + ${entry.conMod}` : ''} = {entry.heal} HP → {entry.total} HP</li>
          ))}
        </ul>
      )}
      <button onClick={finish} aria-label="Finish rest">Finish Rest</button>
    </Modal>
  )
}
```

- [ ] **Step 4: Create `src/pages/Sheet/modals/LongRestModal.jsx`**:
```jsx
import { useCharacterStore } from '../../../store/characters'
import Modal from '../../../components/Modal/Modal'

export default function LongRestModal({ character, onClose }) {
  const { updateCharacter } = useCharacterStore()

  function doLongRest() {
    const { hp, spells, features } = character
    // Restore spell slots to max
    const newSlots = {}
    for (const [lvl, slot] of Object.entries(spells.slots)) {
      newSlots[lvl] = { ...slot, used: 0 }
    }
    // Restore hit dice: recover floor(total/2) min 1
    const toRecover = Math.max(1, Math.floor(hp.hitDiceTotal / 2))
    const newRemaining = Math.min(hp.hitDiceTotal, hp.hitDiceRemaining + toRecover)
    // Reset all features
    const newFeatures = features.map(f =>
      f.maxUses !== null ? { ...f, uses: f.maxUses } : f
    )
    // Single updateCharacter call to avoid split-update races
    updateCharacter(character.id, {
      hp: { ...hp, current: hp.max, temp: 0, hitDiceRemaining: newRemaining },
      spells: { ...spells, slots: newSlots, arcaneRecoveryUsed: false },
      deathSaves: { successes: 0, failures: 0 },
      features: newFeatures,
    })
    onClose()
  }

  return (
    <Modal title="Long Rest" onClose={onClose} size="sm">
      <p>Taking a long rest will:</p>
      <ul>
        <li>Restore HP to maximum ({character.hp.max})</li>
        <li>Restore all spell slots</li>
        <li>Reset all feature uses</li>
        <li>Recover hit dice (up to half total)</li>
        <li>Clear death saves</li>
        {character.meta.class === 'wizard' && <li>Reset Arcane Recovery</li>}
      </ul>
      <button onClick={doLongRest} aria-label="Take long rest">Take Long Rest</button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  )
}
```

- [ ] **Step 5: Run rest modal tests**:
```bash
npx vitest run src/tests/pages/RestModals.test.jsx
```
Expected: all 6 tests pass


### Task 26: Level Up Modal

**Files:**
- Create: `src/pages/Sheet/modals/LevelUpModal.jsx`, `src/pages/Sheet/modals/LevelUpModal.module.css`
- Create: `src/tests/pages/LevelUpModal.test.jsx`
- Modify: `src/pages/Sheet/Sheet.jsx`

- [ ] **Step 6: Write failing tests** — create `src/tests/pages/LevelUpModal.test.jsx`:
```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import LevelUpModal from '../../pages/Sheet/modals/LevelUpModal'

const WIZARD_L3 = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 3, xp: 2700, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores:{str:8,dex:16,con:12,int:17,wis:13,cha:10},
  proficiencies:{savingThrows:['int','wis'],skills:[],expertise:[],tools:[],languages:['common'],armor:[],weapons:[]},
  hp:{max:16,current:16,temp:0,hitDiceTotal:3,hitDiceRemaining:3},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:0,sp:0,ep:0,gp:0,pp:0},equipment:[],attacks:[],
  spells:{ability:'int',slots:{1:{max:4,used:0},2:{max:2,used:0},3:{max:2,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:['magic-missile'],known:['magic-missile','shield'],arcaneRecoveryUsed:false},
  features:[],conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

describe('LevelUpModal', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [WIZARD_L3] }) })

  it('shows level up heading', () => {
    render(<LevelUpModal character={WIZARD_L3} onClose={() => {}} />)
    expect(screen.getByText(/level up.*4/i)).toBeInTheDocument()
  })

  it('step 1: Take Average button sets HP increase preview', async () => {
    render(<LevelUpModal character={WIZARD_L3} onClose={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /take average/i }))
    // Average for d6 = 4 (floor(6/2) + 1 = 4), CON 12 = +1, total = 5
    expect(screen.getByText(/\+5 hp/i)).toBeInTheDocument()
  })

  it('confirms level up increments level in store', async () => {
    render(<LevelUpModal character={WIZARD_L3} onClose={() => {}} />)
    // Step 1: Take average HP
    await userEvent.click(screen.getByRole('button', { name: /take average/i }))
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // Step 2: new features (Next)
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // Step 3: spell slots (Next)
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // Step 4: spells — need to pick 2 for wizard; skip for now with 'Next' if gated
    // For level 4 wizard: no new spell level unlocked, still need to pick 2 spells
    // The test character already knows 2 spells; we need to pick 2 new ones
    // Select 'burning-hands' and 'sleep' from the spell picker
    const checkboxes = screen.getAllByRole('checkbox')
    if (checkboxes.length >= 2) {
      await userEvent.click(checkboxes[0])
      await userEvent.click(checkboxes[1])
    }
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // Step 5: ASI (if available at level 4 — yes for wizard)
    // Choose +2 STR (just to advance)
    const asiSelect = screen.getByRole('combobox', { name: /\+2 ability/i })
    await userEvent.selectOptions(asiSelect, 'str')
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // Step 6: Confirm
    await userEvent.click(screen.getByRole('button', { name: /confirm level up/i }))
    expect(useCharacterStore.getState().characters[0].meta.level).toBe(4)
  })
})
```

- [ ] **Step 7: Run to confirm failure**:
```bash
npx vitest run src/tests/pages/LevelUpModal.test.jsx
```
Expected: FAIL — module not found

- [ ] **Step 8: Create `src/pages/Sheet/modals/LevelUpModal.jsx`**:
```jsx
import { useState, useMemo } from 'react'
import { useCharacterStore } from '../../../store/characters'
import { useDerivedStats } from '../../../hooks/useDerivedStats'
import { generateId } from '../../../utils/ids'
import { rollDice } from '../../../utils/diceRoller'
import { getAbilityModifier } from '../../../utils/calculations'
import Modal from '../../../components/Modal/Modal'
import classesData from '../../../data/classes.json'
import spellsData from '../../../data/spells.json'
import styles from './LevelUpModal.module.css'

const ABILITIES = ['str','dex','con','int','wis','cha']
const AB_LABEL = { str:'STR', dex:'DEX', con:'CON', int:'INT', wis:'WIS', cha:'CHA' }

export default function LevelUpModal({ character, onClose }) {
  const { updateCharacter, updateHp } = useCharacterStore()
  const derived = useDerivedStats(character)
  const [step, setStep] = useState(1)
  const [hpGain, setHpGain] = useState(null)        // final HP increase amount
  const [spellChoices, setSpellChoices] = useState([]) // wizard: 2 spell IDs
  const [asiType, setAsiType] = useState('double')   // 'double' | 'split'
  const [asiAbility, setAsiAbility] = useState('')   // for 'double'
  const [asiA1, setAsiA1] = useState('')             // for 'split'
  const [asiA2, setAsiA2] = useState('')             // for 'split'

  const newLevel = character.meta.level + 1
  const classData = classesData.find(c => c.id === character.meta.class) || {}
  const hitDie = classData.hitDie || 6
  const conMod = derived.abilityModifiers.con ?? 0
  const isSpellcaster = character.spells.ability !== null
  const isWizard = character.meta.class === 'wizard'
  const hasAsi = (classData.asiLevels || []).includes(newLevel)
  // spellSlotProgression keyed by level string: { "1": {"1": 2}, "2": {"1": 3, "2": 2}, ... }
  const newSlotProg = classData.spellSlotProgression?.[String(newLevel)] || null
  const newFeatures = (classData.features || []).filter(f => f.level === newLevel)

  // Wizard: available spells to learn (not already known, at or below highest available slot level)
  const learnableSpells = useMemo(() => {
    if (!isWizard) return []
    const progressionEntries = newSlotProg
      ? Object.entries(newSlotProg).filter(([, v]) => v > 0).map(([k]) => Number(k))
      : []
    const maxSpellLevel = progressionEntries.length > 0 ? Math.max(...progressionEntries) : 1
    return spellsData.filter(s =>
      s.classes.includes('wizard') &&
      !character.spells.known.includes(s.id) &&
      s.level <= maxSpellLevel
    )
  }, [isWizard, character.spells.known, newSlotProg])

  // Cleric: max prepared spells = WIS modifier + cleric level
  const clericPreparedMax = !isWizard && isSpellcaster
    ? (classData ? Math.max(1, (character.abilityScores.wis ? Math.floor((character.abilityScores.wis - 10) / 2) : 0) + newLevel) : newLevel)
    : null

  function rollHp() {
    const { result: roll } = rollDice(`1d${hitDie}`)
    setHpGain(Math.max(1, roll + conMod))
  }

  function takeAverage() {
    const avg = Math.floor(hitDie / 2) + 1
    setHpGain(Math.max(1, avg + conMod))
  }

  function toggleSpell(id) {
    if (spellChoices.includes(id)) setSpellChoices(spellChoices.filter(s => s !== id))
    else if (spellChoices.length < 2) setSpellChoices([...spellChoices, id])
  }

  // Total steps: 1 HP, 2 Features, 3 Slots (casters), 4 Spells (casters), 5 ASI, 6 Confirm
  // For non-casters: skip steps 3 and 4
  const STEPS = [
    'HP Increase',
    'New Features',
    ...(isSpellcaster ? ['Spell Slots', 'Spells'] : []),
    ...(hasAsi ? ['Ability Score Improvement'] : []),
    'Confirm',
  ]
  const totalSteps = STEPS.length
  const stepLabel = STEPS[step - 1]

  // Step 5 in full wizard flow = ASI step (if applicable), etc.
  // We use labels to determine current step content
  function isStepLabel(label) { return stepLabel === label }

  const canNext = isStepLabel('HP Increase') ? hpGain !== null
    : isStepLabel('Spells') && isWizard ? spellChoices.length === 2
    : isStepLabel('Ability Score Improvement')
      ? (asiType === 'double' ? !!asiAbility : (!!asiA1 && !!asiA2 && asiA1 !== asiA2))
    : true

  function applyLevelUp() {
    const newFeatureEntries = newFeatures.map(f => ({
      id: generateId(), name: f.name, source: 'class', description: f.description,
      uses: f.uses ?? null, maxUses: f.uses ?? null, recharge: f.recharge ?? null,
    }))

    // New spell slots
    const newSlots = { ...character.spells.slots }
    if (newSlotProg) {
      for (let i = 1; i <= 9; i++) {
        const newMax = newSlotProg[String(i)] ?? 0
        newSlots[i] = { max: newMax, used: Math.min(newSlots[i]?.used || 0, newMax) }
      }
    }

    // ASI
    const newScores = { ...character.abilityScores }
    if (hasAsi) {
      if (asiType === 'double' && asiAbility) {
        newScores[asiAbility] = Math.min(20, newScores[asiAbility] + 2)
      } else if (asiType === 'split' && asiA1 && asiA2) {
        newScores[asiA1] = Math.min(20, newScores[asiA1] + 1)
        newScores[asiA2] = Math.min(20, newScores[asiA2] + 1)
      }
    }

    updateCharacter(character.id, {
      meta: { ...character.meta, level: newLevel },
      abilityScores: newScores,
      hp: { ...character.hp, max: character.hp.max + (hpGain || 0), hitDiceTotal: character.hp.hitDiceTotal + 1 },
      features: [...character.features, ...newFeatureEntries],
      spells: {
        ...character.spells,
        slots: newSlots,
        known: isWizard ? [...character.spells.known, ...spellChoices] : character.spells.known,
      },
    })
    onClose()
  }

  return (
    <Modal title={`Level Up → Level ${newLevel}`} onClose={onClose} size="lg">
      <div className={styles.progress}>
        {STEPS.map((s, i) => (
          <span key={s} className={[styles.step, i + 1 === step ? styles.active : '', i + 1 < step ? styles.done : ''].filter(Boolean).join(' ')}>
            {s}
          </span>
        ))}
      </div>

      {isStepLabel('HP Increase') && (
        <div className={styles.section}>
          <p>Hit Die: d{hitDie} + CON ({conMod >= 0 ? '+' : ''}{conMod})</p>
          <div className={styles.hpButtons}>
            <button onClick={rollHp} aria-label="Roll hit die">Roll d{hitDie}</button>
            <button onClick={takeAverage} aria-label="Take average">Take Average ({Math.floor(hitDie/2)+1})</button>
          </div>
          {hpGain !== null && <p className={styles.preview}>+{hpGain} HP → new max: {character.hp.max + hpGain}</p>}
        </div>
      )}

      {isStepLabel('New Features') && (
        <div className={styles.section}>
          {newFeatures.length > 0 ? newFeatures.map(f => (
            <div key={f.name}><strong>{f.name}:</strong> {f.description}</div>
          )) : <p>No new features at this level.</p>}
        </div>
      )}

      {isStepLabel('Spell Slots') && newSlotProg && (
        <div className={styles.section}>
          <p>New spell slots at level {newLevel}:</p>
          {[1,2,3,4,5,6,7,8,9].filter(l => (newSlotProg[l] || 0) > 0).map(l => (
            <p key={l}>Level {l}: {newSlotProg[l]} slots</p>
          ))}
        </div>
      )}

      {isStepLabel('Spells') && isWizard && (
        <div className={styles.section}>
          <p>Choose 2 spells to add to your spellbook ({spellChoices.length}/2 selected):</p>
          <div className={styles.spellPicker}>
            {learnableSpells.map(s => (
              <label key={s.id} className={styles.spellOption}>
                <input type="checkbox"
                  checked={spellChoices.includes(s.id)}
                  disabled={!spellChoices.includes(s.id) && spellChoices.length >= 2}
                  onChange={() => toggleSpell(s.id)} />
                {s.name} (Level {s.level})
              </label>
            ))}
          </div>
        </div>
      )}

      {isStepLabel('Spells') && !isWizard && isSpellcaster && (
        <div className={styles.section}>
          <p>Your prepared spell maximum has been updated:</p>
          <p className={styles.preparedMax}>
            <strong>{clericPreparedMax}</strong> prepared spells (WIS modifier + level {newLevel})
          </p>
          <p className={styles.hint}>You may reprepare spells from your full class list at the end of a long rest.</p>
        </div>
      )}

      {isStepLabel('Ability Score Improvement') && (
        <div className={styles.section}>
          <div className={styles.asiOptions}>
            <label>
              <input type="radio" checked={asiType === 'double'} onChange={() => { setAsiType('double'); setAsiA1(''); setAsiA2('') }} />
              +2 to one ability
            </label>
            <label>
              <input type="radio" checked={asiType === 'split'} onChange={() => { setAsiType('split'); setAsiAbility('') }} />
              +1 to two different abilities
            </label>
          </div>
          {asiType === 'double' && (
            <select value={asiAbility} onChange={e => setAsiAbility(e.target.value)} aria-label="+2 ability">
              <option value="">Choose ability…</option>
              {ABILITIES.filter(a => character.abilityScores[a] < 20).map(a => (
                <option key={a} value={a}>{AB_LABEL[a]} (currently {character.abilityScores[a]})</option>
              ))}
            </select>
          )}
          {asiType === 'split' && (
            <div className={styles.splitPicker}>
              <select value={asiA1} onChange={e => setAsiA1(e.target.value)}>
                <option value="">First ability…</option>
                {ABILITIES.filter(a => character.abilityScores[a] < 20 && a !== asiA2).map(a => (
                  <option key={a} value={a}>{AB_LABEL[a]} ({character.abilityScores[a]})</option>
                ))}
              </select>
              <select value={asiA2} onChange={e => setAsiA2(e.target.value)}>
                <option value="">Second ability…</option>
                {ABILITIES.filter(a => character.abilityScores[a] < 20 && a !== asiA1).map(a => (
                  <option key={a} value={a}>{AB_LABEL[a]} ({character.abilityScores[a]})</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {isStepLabel('Confirm') && (
        <div className={styles.section}>
          <p>Level {character.meta.level} → Level {newLevel}</p>
          {hpGain !== null && <p>HP Max: {character.hp.max} → {character.hp.max + hpGain}</p>}
          {hasAsi && <p>Ability Score Improvement applied</p>}
          {newFeatures.length > 0 && <p>New features: {newFeatures.map(f => f.name).join(', ')}</p>}
        </div>
      )}

      <div className={styles.nav}>
        {step > 1 && <button onClick={() => setStep(s => s - 1)}>Back</button>}
        {step < totalSteps
          ? <button disabled={!canNext} onClick={() => setStep(s => s + 1)}>Next</button>
          : <button disabled={hpGain === null} onClick={applyLevelUp} aria-label="Confirm level up">Confirm Level Up</button>
        }
      </div>
    </Modal>
  )
}
```

- [ ] **Step 9: Create `src/pages/Sheet/modals/LevelUpModal.module.css`**:
```css
.progress { display: flex; gap: var(--space-xs); flex-wrap: wrap; margin-bottom: var(--space-lg); }
.step { padding: 2px var(--space-sm); border-radius: var(--radius-sm); font-size: var(--text-xs); background: var(--color-bg-alt); color: var(--color-muted); }
.active { background: var(--color-accent); color: white; font-weight: var(--weight-bold); }
.done { background: var(--color-bg-alt); color: var(--color-accent); }
.section { display: flex; flex-direction: column; gap: var(--space-sm); margin-bottom: var(--space-lg); }
.hpButtons { display: flex; gap: var(--space-sm); }
.preview { font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--color-accent); }
.spellPicker { display: flex; flex-direction: column; gap: var(--space-xs); max-height: 300px; overflow-y: auto; }
.spellOption { display: flex; align-items: center; gap: var(--space-xs); font-size: var(--text-sm); cursor: pointer; }
.asiOptions { display: flex; gap: var(--space-lg); }
.splitPicker { display: flex; gap: var(--space-sm); }
.nav { display: flex; justify-content: space-between; padding-top: var(--space-md); border-top: 1px solid var(--color-border-light); }
```

- [ ] **Step 10: Update `src/pages/Sheet/Sheet.jsx`** — wire the modal handlers:

Add modal state and render conditionally:
```jsx
// Add at top of Sheet component:
const [modal, setModal] = useState(null) // null | 'shortRest' | 'longRest' | 'levelUp'

// Replace SummaryBar handlers:
onShortRest={() => setModal('shortRest')}
onLongRest={() => setModal('longRest')}
onLevelUp={() => setModal('levelUp')}

// Add imports and render after SummaryBar:
import ShortRestModal from './modals/ShortRestModal'
import LongRestModal from './modals/LongRestModal'
import LevelUpModal from './modals/LevelUpModal'
// ...
{modal === 'shortRest' && <ShortRestModal character={character} onClose={() => setModal(null)} />}
{modal === 'longRest' && <LongRestModal character={character} onClose={() => setModal(null)} />}
{modal === 'levelUp' && <LevelUpModal character={character} onClose={() => setModal(null)} />}
```

- [ ] **Step 11: Run tests**:
```bash
npx vitest run src/tests/pages/RestModals.test.jsx src/tests/pages/LevelUpModal.test.jsx
```
Expected: all tests pass (6 rest + 3 level up = 9 tests)

- [ ] **Step 12: Run full suite**:
```bash
npx vitest run
```
Expected: all tests pass

- [ ] **Step 13: Commit**:
```bash
git add src/pages/Sheet/modals/ src/tests/pages/RestModals.test.jsx \
  src/tests/pages/LevelUpModal.test.jsx src/pages/Sheet/Sheet.jsx
git commit -m "feat: add Short Rest, Long Rest, and Level Up guided flow modals"
```

---

## Chunk 13: Homebrew Builder

### Task 27: Homebrew Race & Class Builder

**Files:**
- Create: `src/pages/Homebrew/HomebrewPage.jsx`, `src/pages/Homebrew/HomebrewPage.module.css`
- Create: `src/pages/Homebrew/RaceBuilder.jsx`, `src/pages/Homebrew/RaceBuilder.module.css`
- Create: `src/pages/Homebrew/ClassBuilder.jsx`, `src/pages/Homebrew/ClassBuilder.module.css`
- Create: `src/tests/pages/HomebrewPage.test.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write failing tests** — create `src/tests/pages/HomebrewPage.test.jsx`:
```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { useHomebrewStore } from '../../store/homebrew'
import HomebrewPage from '../../pages/Homebrew/HomebrewPage'

function renderPage() {
  return render(<MemoryRouter><HomebrewPage /></MemoryRouter>)
}

describe('HomebrewPage', () => {
  beforeEach(() => { useHomebrewStore.setState({ homebrewRaces: [], homebrewClasses: [] }) })

  it('shows race and class builder sections', () => {
    renderPage()
    expect(screen.getByText(/homebrew races/i)).toBeInTheDocument()
    expect(screen.getByText(/homebrew classes/i)).toBeInTheDocument()
  })

  it('adding a homebrew race stores it', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /add race/i }))
    await userEvent.type(screen.getByPlaceholderText(/race name/i), 'Tiefling')
    await userEvent.click(screen.getByRole('button', { name: /save race/i }))
    expect(useHomebrewStore.getState().homebrewRaces).toHaveLength(1)
    expect(useHomebrewStore.getState().homebrewRaces[0].name).toBe('Tiefling')
  })

  it('adding a homebrew class stores it', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /add class/i }))
    await userEvent.type(screen.getByPlaceholderText(/class name/i), 'Paladin')
    await userEvent.click(screen.getByRole('button', { name: /save class/i }))
    expect(useHomebrewStore.getState().homebrewClasses).toHaveLength(1)
    expect(useHomebrewStore.getState().homebrewClasses[0].name).toBe('Paladin')
  })

  it('deleting a homebrew race removes it', async () => {
    useHomebrewStore.setState({ homebrewRaces: [{ id: 'r1', name: 'Tiefling', speed: 30, size: 'Medium', darkvision: 60, abilityScoreIncreases: {}, traits: [], languages: ['common'], subraces: [] }], homebrewClasses: [] })
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /delete tiefling/i }))
    expect(useHomebrewStore.getState().homebrewRaces).toHaveLength(0)
  })

  it('save is blocked when race name is empty', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /add race/i }))
    // Save button is disabled with empty name
    expect(screen.getByRole('button', { name: /save race/i })).toBeDisabled()
  })
})
```

- [ ] **Step 2: Run to confirm failure**:
```bash
npx vitest run src/tests/pages/HomebrewPage.test.jsx
```
Expected: FAIL — module not found

- [ ] **Step 3: Create `src/pages/Homebrew/RaceBuilder.jsx`**:
```jsx
import { useState } from 'react'
import { useHomebrewStore } from '../../store/homebrew'
import { generateId } from '../../utils/ids'
import styles from './RaceBuilder.module.css'

const ABILITIES = ['str','dex','con','int','wis','cha']

function emptyRace() {
  return {
    id: generateId(), name: '', speed: 30, size: 'Medium', darkvision: 0,
    abilityScoreIncreases: {}, traits: [], languages: ['common'], subraces: [],
  }
}

export default function RaceBuilder() {
  const { homebrewRaces, addHomebrewRace, deleteHomebrewRace } = useHomebrewStore()
  const [form, setForm] = useState(null) // null = not showing form
  const [traitName, setTraitName] = useState('')
  const [traitDesc, setTraitDesc] = useState('')

  function openNew() { setForm(emptyRace()); setTraitName(''); setTraitDesc('') }

  function addTrait() {
    if (!traitName.trim()) return
    setForm(f => ({ ...f, traits: [...f.traits, { name: traitName, description: traitDesc }] }))
    setTraitName(''); setTraitDesc('')
  }

  function removeTrait(i) { setForm(f => ({ ...f, traits: f.traits.filter((_, idx) => idx !== i) })) }

  function setBonus(ability, val) {
    const n = parseInt(val, 10)
    setForm(f => ({
      ...f,
      abilityScoreIncreases: n ? { ...f.abilityScoreIncreases, [ability]: n } : Object.fromEntries(Object.entries(f.abilityScoreIncreases).filter(([k]) => k !== ability)),
    }))
  }

  function save() {
    if (!form.name.trim()) return
    addHomebrewRace(form)
    setForm(null)
  }

  return (
    <div className={styles.section}>
      <h3>Homebrew Races</h3>
      {homebrewRaces.map(race => (
        <div key={race.id} className={styles.item}>
          <span>{race.name}</span>
          <span className={styles.tag}>Speed {race.speed} ft</span>
          {Object.entries(race.abilityScoreIncreases).map(([a,v]) => (
            <span key={a} className={styles.tag}>{a.toUpperCase()} +{v}</span>
          ))}
          <button onClick={() => deleteHomebrewRace(race.id)} aria-label={`Delete ${race.name}`}>Delete</button>
        </div>
      ))}
      {homebrewRaces.length === 0 && !form && <p className={styles.empty}>No homebrew races yet.</p>}

      {!form ? (
        <button onClick={openNew} aria-label="Add race">+ Add Race</button>
      ) : (
        <div className={styles.form}>
          <label>Race Name
            <input type="text" placeholder="Race name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </label>
          <label>Speed (ft)
            <input type="number" value={form.speed} min={0} step={5} onChange={e => setForm(f => ({ ...f, speed: Number(e.target.value) }))} style={{ width: 70 }} />
          </label>
          <label>Size
            <select value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))}>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
            </select>
          </label>
          <label>Darkvision (ft, 0 = none)
            <input type="number" value={form.darkvision} min={0} step={30} onChange={e => setForm(f => ({ ...f, darkvision: Number(e.target.value) }))} style={{ width: 70 }} />
          </label>
          <fieldset className={styles.bonuses}>
            <legend>Ability Bonuses</legend>
            {ABILITIES.map(a => (
              <label key={a}>{a.toUpperCase()}
                <input type="number" min={-2} max={4} value={form.abilityScoreIncreases[a] || ''} placeholder="0"
                  onChange={e => setBonus(a, e.target.value)} style={{ width: 44 }} />
              </label>
            ))}
          </fieldset>
          <div>
            <strong>Traits</strong>
            {form.traits.map((t, i) => (
              <div key={i} className={styles.traitRow}>
                <strong>{t.name}:</strong> {t.description}
                <button onClick={() => removeTrait(i)} aria-label={`Remove trait ${t.name}`}>×</button>
              </div>
            ))}
            <div className={styles.traitForm}>
              <input type="text" placeholder="Trait name" value={traitName} onChange={e => setTraitName(e.target.value)} />
              <input type="text" placeholder="Description" value={traitDesc} onChange={e => setTraitDesc(e.target.value)} />
              <button type="button" onClick={addTrait}>Add Trait</button>
            </div>
          </div>
          <div className={styles.formActions}>
            <button onClick={() => setForm(null)}>Cancel</button>
            <button className={styles.primary} onClick={save} disabled={!form.name.trim()} aria-label="Save race">Save Race</button>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create `src/pages/Homebrew/RaceBuilder.module.css`**:
```css
.section { display: flex; flex-direction: column; gap: var(--space-md); }
.item { display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-sm); background: var(--color-bg-alt); border-radius: var(--radius-sm); }
.tag { font-size: var(--text-xs); padding: 2px 6px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); }
.empty { color: var(--color-muted); font-size: var(--text-sm); }
.form { display: flex; flex-direction: column; gap: var(--space-sm); padding: var(--space-md); background: var(--color-bg-alt); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.form label { display: flex; flex-direction: column; gap: 2px; font-size: var(--text-sm); }
.bonuses { display: flex; gap: var(--space-sm); flex-wrap: wrap; border: 1px solid var(--color-border); padding: var(--space-sm); border-radius: var(--radius-sm); }
.bonuses label { display: flex; align-items: center; gap: var(--space-xs); font-size: var(--text-sm); }
.traitRow { display: flex; align-items: center; gap: var(--space-xs); font-size: var(--text-sm); padding: var(--space-xs) 0; }
.traitForm { display: flex; gap: var(--space-xs); flex-wrap: wrap; }
.formActions { display: flex; justify-content: flex-end; gap: var(--space-sm); }
.primary { background: var(--color-accent); color: white; padding: var(--space-xs) var(--space-md); border-radius: var(--radius-sm); }
```

- [ ] **Step 5: Create `src/pages/Homebrew/ClassBuilder.jsx`**:
```jsx
import { useState } from 'react'
import { useHomebrewStore } from '../../store/homebrew'
import { generateId } from '../../utils/ids'
import styles from './ClassBuilder.module.css'

const ABILITIES = ['str','dex','con','int','wis','cha']
const SKILLS_LIST = ['acrobatics','animal-handling','athletics','arcana','deception','history','insight','intimidation','investigation','medicine','nature','perception','performance','persuasion','religion','sleight-of-hand','stealth','survival']

function emptyClass() {
  return {
    id: generateId(), name: '', hitDie: 8, spellcastingAbility: null,
    savingThrowProficiencies: [], armorProficiencies: [], weaponProficiencies: [],
    toolProficiencies: [],
    skillChoices: { count: 2, options: [] },
    features: [], asiLevels: [4,8,12,16,19],
    spellSlotProgression: null,
  }
}

export default function ClassBuilder() {
  const { homebrewClasses, addHomebrewClass, deleteHomebrewClass } = useHomebrewStore()
  const [form, setForm] = useState(null)
  const [featName, setFeatName] = useState('')
  const [featLevel, setFeatLevel] = useState(1)
  const [featDesc, setFeatDesc] = useState('')

  function openNew() { setForm(emptyClass()); setFeatName(''); setFeatDesc('') }

  function toggleSave(a) {
    setForm(f => ({
      ...f,
      savingThrowProficiencies: f.savingThrowProficiencies.includes(a)
        ? f.savingThrowProficiencies.filter(s => s !== a)
        : [...f.savingThrowProficiencies, a],
    }))
  }

  function toggleSkill(id) {
    setForm(f => {
      const opts = f.skillChoices.options
      return {
        ...f,
        skillChoices: {
          ...f.skillChoices,
          options: opts.includes(id) ? opts.filter(s => s !== id) : [...opts, id],
        },
      }
    })
  }

  function addFeature() {
    if (!featName.trim()) return
    setForm(f => ({
      ...f,
      features: [...f.features, { level: Number(featLevel), name: featName, description: featDesc }],
    }))
    setFeatName(''); setFeatDesc('')
  }

  function removeFeature(i) { setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) })) }

  function save() {
    if (!form.name.trim()) return
    addHomebrewClass(form)
    setForm(null)
  }

  return (
    <div className={styles.section}>
      <h3>Homebrew Classes</h3>
      {homebrewClasses.map(cls => (
        <div key={cls.id} className={styles.item}>
          <span>{cls.name}</span>
          <span className={styles.tag}>d{cls.hitDie}</span>
          <button onClick={() => deleteHomebrewClass(cls.id)} aria-label={`Delete ${cls.name}`}>Delete</button>
        </div>
      ))}
      {homebrewClasses.length === 0 && !form && <p className={styles.empty}>No homebrew classes yet.</p>}

      {!form ? (
        <button onClick={openNew} aria-label="Add class">+ Add Class</button>
      ) : (
        <div className={styles.form}>
          <label>Class Name
            <input type="text" placeholder="Class name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </label>
          <div className={styles.row}>
            <label>Hit Die
              <select value={form.hitDie} onChange={e => setForm(f => ({ ...f, hitDie: Number(e.target.value) }))}>
                {[6,8,10,12].map(d => <option key={d} value={d}>d{d}</option>)}
              </select>
            </label>
            <label>Spellcasting Ability
              <select value={form.spellcastingAbility || ''} onChange={e => setForm(f => ({ ...f, spellcastingAbility: e.target.value || null }))}>
                <option value="">None</option>
                {ABILITIES.map(a => <option key={a} value={a}>{a.toUpperCase()}</option>)}
              </select>
            </label>
            <label>Skill Choices (count)
              <input type="number" min={1} max={5} value={form.skillChoices.count} onChange={e => setForm(f => ({ ...f, skillChoices: { ...f.skillChoices, count: Number(e.target.value) } }))} style={{ width: 50 }} />
            </label>
          </div>
          <fieldset>
            <legend>Saving Throw Proficiencies</legend>
            {ABILITIES.map(a => (
              <label key={a}><input type="checkbox" checked={form.savingThrowProficiencies.includes(a)} onChange={() => toggleSave(a)} /> {a.toUpperCase()}</label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Available Skill Choices</legend>
            {SKILLS_LIST.map(s => (
              <label key={s}><input type="checkbox" checked={form.skillChoices.options.includes(s)} onChange={() => toggleSkill(s)} /> {s}</label>
            ))}
          </fieldset>
          <div>
            <strong>Class Features</strong>
            {form.features.map((f, i) => (
              <div key={i} className={styles.featRow}>
                Level {f.level}: <strong>{f.name}</strong> — {f.description}
                <button onClick={() => removeFeature(i)}>×</button>
              </div>
            ))}
            <div className={styles.featForm}>
              <input type="number" min={1} max={20} value={featLevel} onChange={e => setFeatLevel(e.target.value)} placeholder="Lvl" style={{ width: 44 }} />
              <input type="text" placeholder="Feature name" value={featName} onChange={e => setFeatName(e.target.value)} />
              <input type="text" placeholder="Description" value={featDesc} onChange={e => setFeatDesc(e.target.value)} />
              <button type="button" onClick={addFeature}>Add</button>
            </div>
          </div>
          <div className={styles.formActions}>
            <button onClick={() => setForm(null)}>Cancel</button>
            <button className={styles.primary} onClick={save} disabled={!form.name.trim()} aria-label="Save class">Save Class</button>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 6: Create `src/pages/Homebrew/ClassBuilder.module.css`**:
```css
.section { display: flex; flex-direction: column; gap: var(--space-md); }
.item { display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-sm); background: var(--color-bg-alt); border-radius: var(--radius-sm); }
.tag { font-size: var(--text-xs); padding: 2px 6px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); }
.empty { color: var(--color-muted); font-size: var(--text-sm); }
.form { display: flex; flex-direction: column; gap: var(--space-sm); padding: var(--space-md); background: var(--color-bg-alt); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.form label { display: flex; flex-direction: column; gap: 2px; font-size: var(--text-sm); }
.row { display: flex; gap: var(--space-md); flex-wrap: wrap; }
.featRow { display: flex; align-items: center; gap: var(--space-xs); font-size: var(--text-sm); padding: var(--space-xs) 0; flex-wrap: wrap; }
.featForm { display: flex; gap: var(--space-xs); flex-wrap: wrap; }
.formActions { display: flex; justify-content: flex-end; gap: var(--space-sm); }
.primary { background: var(--color-accent); color: white; padding: var(--space-xs) var(--space-md); border-radius: var(--radius-sm); }
```

- [ ] **Step 7: Create `src/pages/Homebrew/HomebrewPage.jsx`**:
```jsx
import { useNavigate } from 'react-router-dom'
import RaceBuilder from './RaceBuilder'
import ClassBuilder from './ClassBuilder'
import styles from './HomebrewPage.module.css'

export default function HomebrewPage() {
  const navigate = useNavigate()
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>← Back to Roster</button>
        <h1>Homebrew Builder</h1>
        <p className={styles.subtitle}>Create custom races and classes for use in character creation (Advanced Mode).</p>
      </header>
      <div className={styles.builders}>
        <RaceBuilder />
        <ClassBuilder />
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Create `src/pages/Homebrew/HomebrewPage.module.css`**:
```css
.page { max-width: 960px; margin: 0 auto; padding: var(--space-2xl) var(--space-md); }
.header { margin-bottom: var(--space-xl); }
.back { color: var(--color-accent); background: none; border: none; cursor: pointer; font-size: var(--text-sm); margin-bottom: var(--space-sm); }
.subtitle { color: var(--color-muted); font-size: var(--text-sm); }
.builders { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2xl); }
@media (max-width: 640px) { .builders { grid-template-columns: 1fr; } }
```

- [ ] **Step 9: Update `src/App.jsx`** — add Homebrew import and route (do NOT replace the whole file; add to what prior chunks established):

Add to the imports at the top of the file:
```jsx
import HomebrewPage from './pages/Homebrew/HomebrewPage'
```

Add inside the `<Routes>` block (before the closing `</Routes>`):
```jsx
<Route path="/homebrew" element={<HomebrewPage />} />
```

- [ ] **Step 10: Run tests**:
```bash
npx vitest run src/tests/pages/HomebrewPage.test.jsx
```
Expected: all 5 tests pass

- [ ] **Step 11: Run full suite**:
```bash
npx vitest run
```
Expected: all tests pass

- [ ] **Step 12: Commit**:
```bash
git add src/pages/Homebrew/ src/tests/pages/HomebrewPage.test.jsx src/App.jsx
git commit -m "feat: add Homebrew Builder page with race and class builders (Advanced Mode)"
```

---

