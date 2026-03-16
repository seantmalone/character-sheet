# Integration Test Suite — Design Spec
Date: 2026-03-16

## Overview

Add a full integration test suite to the D&D 5e character sheet SPA. The existing 125 tests are unit/isolated-component tests. This suite adds ~41 integration tests covering cross-page user flows and multi-step within-sheet interactions.

## Goals

- Verify complete user journeys (create character → use sheet → rest → level up)
- Catch regressions where a change in one component silently breaks another
- Complement, not replace, existing unit tests

## Tech Stack (unchanged)

- Vitest + @testing-library/react + @testing-library/user-event
- jsdom environment (existing setup)
- Zustand store seeded via `setState` for within-sheet tests
- Full `<App>` rendered via `MemoryRouter` for cross-page tests

---

## Directory Layout

```
src/tests/
  setup.js                        (existing)
  integration/
    helpers.jsx                   (shared render helpers + fixtures)
    character-creation.test.jsx
    rest-and-recovery.test.jsx
    combat-flow.test.jsx
    spell-flow.test.jsx
    level-up.test.jsx
    equipment-flow.test.jsx
    features-flow.test.jsx
    homebrew-flow.test.jsx
```

---

## Shared Helpers (`helpers.jsx`)

### Exports

- `CHAR` — complete level-3 wizard fixture
- `CHAR_CHAIN` — CHAR variant with chain mail pre-seeded and `acFormula: 'unarmored'`
- `renderApp(initialRoute)` — full App in MemoryRouter
- `renderSheet(character)` — Sheet with pre-seeded store

### `CHAR` fixture

```js
export const CHAR = {
  id: 'c1', schemaVersion: 1,
  meta: {
    characterName: 'Aria', race: 'elf', class: 'wizard', level: 3,
    xp: 900,       // at level-3 XP threshold; Level Up button is enabled
    inspiration: false, playerName: 'Sean', subrace: 'high-elf',
    background: 'sage', alignment: 'CG', secondaryClass: null,
  },
  abilityScores: { str: 8, dex: 16, con: 12, int: 17, wis: 13, cha: 10 },
  // CON 12 → CON modifier = +1
  // INT 17 → +2 ASI takes it to 19 (within cap)
  proficiencies: {
    savingThrows: ['int','wis'], skills: ['arcana','history'],
    expertise: [], tools: [], languages: ['common','elvish'],
    armor: [], weapons: [],
  },
  hp: { max: 16, current: 5, temp: 0, hitDiceTotal: 3, hitDiceRemaining: 3 },
  // hp.current = 5 (well below max) so short-rest HP gain is always observable
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
      // Level 3 wizard has slots at levels 1 (max 4) and 2 (max 2) only
      1: { max: 4, used: 1 },
      2: { max: 2, used: 0 },
      3: { max: 0, used: 0 }, 4: { max: 0, used: 0 }, 5: { max: 0, used: 0 },
      6: { max: 0, used: 0 }, 7: { max: 0, used: 0 }, 8: { max: 0, used: 0 },
      9: { max: 0, used: 0 },
    },
    // 'shield' is level 1 — known but NOT prepared, so spell-flow tests can prepare it
    // 'magic-missile' is level 1 — known AND prepared
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
```

### `CHAR_CHAIN` fixture

Used in combat-flow test 3 and equipment-flow test 6:

```js
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
```

### `renderApp(initialRoute = '/')`

```jsx
export function renderApp(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  )
}
```

`beforeEach` in each cross-page test file must reset all stores:
```js
beforeEach(() => {
  useCharacterStore.setState({ characters: [] })
  useHomebrewStore.setState({ races: [], classes: [] })
  useSettingsStore.setState({ globalAdvancedMode: false })
})
```

### `renderSheet(character)`

```jsx
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
```

The `<Route path="/character/:id">` wrapper is required: `Sheet.jsx` calls `useParams()`, and without it, the character lookup fails and the component immediately redirects.

### `userEvent`

Each test file imports `userEvent` from `@testing-library/user-event` and calls `const user = userEvent.setup()` at the top of each `it` block (or in `beforeEach`). `helpers.jsx` does not export a `user` instance.

---

## Key Implementation Notes

### Triggering Rest modals

`SummaryBar` renders a `<select aria-label="Rest menu">` with option values `'short'` and `'long'`. There are no "Short Rest" / "Long Rest" buttons. To open the short rest modal:
```js
await user.selectOptions(screen.getByRole('combobox', { name: /rest menu/i }), 'short')
```
For long rest, use `'long'`.

### Long Rest confirm button

`LongRestModal` renders `<button aria-label="Take long rest">Take Long Rest</button>`. Use `getByRole('button', { name: /take long rest/i })`.

### Short Rest roll button

`ShortRestModal` renders `<button aria-label="Roll d6">Roll d6</button>` for a wizard. Use `getByRole('button', { name: /roll d6/i })`.

### Level Up: HP step

Use the "Take Average" button for deterministic HP gain. For a wizard (d6), CON=12 (mod=+1):
`hpGain = Math.floor(6/2) + 1 + 1 = 5`. New `hp.max = 16 + 5 = 21`.

Button: `<button aria-label="Take average">Take Average (4)</button>`

### Level Up: wizard Spells step

The Spells step renders checkboxes (not buttons). Each spell has `<input type="checkbox">` and a label like `{spell.name} (Level {spell.level})`. Pick 2 spells by clicking their checkboxes. The "Next" button enables only after exactly 2 spells are checked.

### CharacterCard navigation

`CharacterCard` has an `<button>Open</button>` (no aria-label). Click this to navigate to the Sheet. Use `getByRole('button', { name: /open/i })` within the card container.

### PipTracker in FeatureCard (aria-label quirk)

`FeatureCard` passes `label=""` to `PipTracker`. This produces pip buttons with `aria-label=" 1"`, `" 2"` (leading space), not `"pip 1"`. Do not query feature pips by accessible name. Instead, use container queries:
```js
const featureCard = screen.getByText('Arcane Recovery').closest('[class*="card"]')
const pips = within(featureCard).getAllByRole('button').filter(b => b.getAttribute('aria-label')?.trim().match(/^\d+$/))
```
Or simply: `within(featureCard).getAllByRole('button')` and select by index.

### PipTracker / Feature Uses Semantics

`FeatureCard` passes `used={feature.uses}` to `PipTracker` where `feature.uses` = uses **remaining** (filled pip = available use). `FeaturesTab.updateFeatureUses(id, v)` sets `uses = maxUses - v`.

With `uses: 2, maxUses: 2` (2 remaining):
- Pip 0: filled (0 < 2). Pip 1: filled (1 < 2).
- Clicking pip 1 → `onChange(1)` → `uses = 2 - 1 = 1`. ✓

For tests where short rest should restore uses: start with `uses: 0` so there are unfilled pips to observe after recharge.

### AC Updates

AC is derived from `combat.acFormula` + `combat.equippedArmorId`. The Equipment tab "Equip" checkbox sets `item.equipped` but does **not** affect AC. To change AC:
1. On Combat tab: change AC formula dropdown (e.g. to `"heavy"`)
2. On Combat tab: select the armor from the equipped armor dropdown
3. Assert the displayed AC value

---

## Test Files

### `character-creation.test.jsx`

Cross-page flows using `renderApp`. Store reset in `beforeEach`.

The review step (Step 6) shows a "Create Character" button (not "Next →"). After clicking it, `Step6Review.handleConfirm()` calls `navigate('/character/${id}')` — the app navigates to the Sheet, **not** back to the Roster.

| # | Test | Steps | Assertion |
|---|------|-------|-----------|
| 1 | Complete wizard flow | `renderApp('/new')` → type "Thorn" → click "Next →" → select race "Human" → click "Next →" → select class "Fighter" → click "Next →" → select any background → click "Next →" → assign standard array: STR=8, DEX=14, CON=13, INT=15, WIS=12, CHA=10 using the six ability score dropdowns → click "Next →" → click "Create Character" | Sheet renders showing "Thorn" in the character name area |
| 2 | Navigate from roster to sheet | `useCharacterStore.setState({ characters: [CHAR] })` → `renderApp('/')` → click the "Open" button on Aria's card | Sheet renders with "Aria" visible in the summary bar |
| 3 | Wizard Next disabled until name entered | `renderApp('/new')` → "Next →" button is disabled → type "Thorn" → "Next →" button is enabled |  |
| 4 | Back navigation preserves values | `renderApp('/new')` → type "Thorn" → click "Next →" → click "Back" → name input still shows "Thorn" |  |

### `rest-and-recovery.test.jsx`

Within-sheet modal flows using `renderSheet`. Store reset in `beforeEach`.

Rest is triggered via a `<select aria-label="Rest menu">` (combobox). Options: `'short'` opens `ShortRestModal`; `'long'` opens `LongRestModal`.

| # | Test | Steps | Assertion |
|---|------|-------|-----------|
| 1 | Short rest increases HP | `renderSheet(CHAR)` → `selectOptions(getByRole('combobox', { name: /rest menu/i }), 'short')` → click `aria-label="Roll d6"` button → click `aria-label="Finish rest"` button | `characters[0].hp.current` > 5 and ≤ 16 |
| 2 | Short rest decreases hit dice | Same steps as test 1 | `hp.hitDiceRemaining` = 2 (was 3) |
| 3 | Short rest recharges features | `renderSheet({ ...CHAR, features: [{ ...CHAR.features[0], uses: 0 }] })` → select `'short'` → click "Finish Rest" (no rolling needed) | `features[0].uses` = 1 (restored to maxUses) |
| 4 | Long rest restores HP | `renderSheet(CHAR)` → select `'long'` → click `aria-label="Take long rest"` | `hp.current` = 16 |
| 5 | Long rest resets spell slots | Same as test 4 | All `spells.slots[n].used` = 0 for n = 1..9 |
| 6 | Long rest restores hit dice | `renderSheet({ ...CHAR, hp: { ...CHAR.hp, hitDiceRemaining: 0 } })` → select `'long'` → confirm | `hp.hitDiceRemaining` = `Math.max(1, Math.floor(3/2))` = 1 |
| 7 | Long rest resets arcane recovery | `renderSheet({ ...CHAR, spells: { ...CHAR.spells, arcaneRecoveryUsed: true } })` → select `'long'` → confirm | `spells.arcaneRecoveryUsed` = false |

### `combat-flow.test.jsx`

Within-sheet interactions. Click the "Combat" tab at the start of each test.

| # | Test | Steps | Assertion |
|---|------|-------|-----------|
| 1 | Add custom attack | Click "Combat" tab → click "+ Custom Attack" | A second row appears in the attacks table (Dagger + new custom attack) |
| 2 | Delete attack | Click "Combat" tab → click delete button `aria-label="Delete Dagger"` | Attacks table shows 0 rows (Dagger removed) |
| 3 | AC formula + armor updates AC | `renderSheet(CHAR_CHAIN)` → click "Combat" tab → change AC formula select to "heavy" → select "Chain Mail" from the equipped armor dropdown | AC displays 16 |
| 4 | Toggle condition on | Click "Combat" tab → interact with the Blinded condition toggle to activate it | Blinded is shown as active |
| 5 | Toggle condition off | `renderSheet({ ...CHAR, conditions: { ...CHAR.conditions, blinded: true } })` → click "Combat" tab → interact with Blinded toggle to deactivate it | Blinded is inactive |
| 6 | Exhaustion increment/decrement | Click "Combat" tab → increment exhaustion twice → decrement once | Exhaustion = 1 |

### `spell-flow.test.jsx`

Within-sheet interactions on Spells tab. Click the "Spells" tab at the start of each test.

CHAR has `known: ['magic-missile', 'shield']` and `prepared: ['magic-missile']`. `shield` (level 1) is known but not prepared.

`SpellCard` renders a prepare button only for level ≥ 1 spells. aria-label format: `"Prepare {spell.name}"` / `"Unprepare {spell.name}"`.

| # | Test | Steps | Assertion |
|---|------|-------|-----------|
| 1 | Prepare a spell | Click "Spells" tab → click button `aria-label="Prepare Shield"` | Shield appears in the prepared spells section |
| 2 | Unprepare a spell | Click "Spells" tab → click button `aria-label="Unprepare Magic Missile"` | Magic Missile removed from prepared section |
| 3 | Use a spell slot | Click "Spells" tab → CHAR has `slots[1].used=1`; click the second level-1 pip (pip index 1, first unfilled pip) | `spells.slots[1].used` = 2 |
| 4 | Arcane recovery | Click "Spells" tab → click "Arcane Recovery" → in the modal, select 1 level-1 slot to recover → confirm | `spells.slots[1].used` = 0 (was 1) |
| 5 | Long rest resets slots (UI) | `renderSheet({ ...CHAR, spells: { ...CHAR.spells, slots: { ...CHAR.spells.slots, 1: { max: 4, used: 4 } } } })` → click "Spells" tab → level-1 pips all show filled → select `'long'` from rest menu → confirm → click "Spells" tab | Level-1 slot pip display shows 0 used (all 4 pips unfilled) |

### `level-up.test.jsx`

Within-sheet level-up modal flow using `renderSheet(CHAR)`. CHAR has `xp: 900` (= level-3 threshold), so "Level Up" button is enabled.

Level-up steps for level-3→4 wizard: **HP Increase → New Features → Spell Slots → Spells (pick 2) → ASI → Confirm**.
- HP step: click `aria-label="Take average"` for deterministic gain. CON mod=+1, d6 wizard: `hpGain = Math.floor(6/2)+1+1 = 5`. New `hp.max = 21`.
- Spells step: Renders checkboxes. Check 2 spells (any 2 available wizard spells not in `known`). "Next" enables only after exactly 2 are checked.
- ASI step: `+2 to one ability` radio (default) with `aria-label="+2 ability"` select. `+1 to two` radio with two unlabeled selects.
- Confirm button: `aria-label="Confirm level up"`.
- Level 4 wizard spell slots: `{ 1: 4, 2: 3 }` — level-2 increases from 2 → 3.

| # | Test | Steps | Assertion |
|---|------|-------|-----------|
| 1 | Level increases by 1 | Click "Level Up" → click "Take Average" → click "Next" (past HP) → click "Next" (past New Features) → click "Next" (past Spell Slots) → check any 2 spell checkboxes → click "Next" (past Spells) → choose "+2 to one ability" for INT → click "Next" (past ASI) → click "Confirm level up" | Summary bar shows "Level 4" |
| 2 | HP max increases | Same full flow | `hp.max` = 21 (was 16, gained 5) |
| 3 | New spell slots in Spells tab | Same full flow → close modal → click "Spells" tab | Level-2 slot display shows max=3 (was 2) |
| 4 | ASI +2 to one score | Full flow → on ASI step, ensure "+2 to one ability" is selected → select INT from `aria-label="+2 ability"` dropdown → Confirm | `abilityScores.int` = 19 (was 17) |
| 5 | ASI +1/+1 split | Full flow → on ASI step, click "+1 to two different abilities" radio → select STR as first, DEX as second → Confirm | `abilityScores.str` = 9 (was 8), `abilityScores.dex` = 17 (was 16) |

### `equipment-flow.test.jsx`

Within-sheet interactions on Equipment tab. Click "Equipment" tab at start of each test.

| # | Test | Steps | Assertion |
|---|------|-------|-----------|
| 1 | Add item from catalog | Click "Equipment" tab → click `aria-label="Add from catalog"` → select "Dagger" from dropdown | Row with "Dagger" appears in equipment table |
| 2 | Add custom item | Click "Equipment" tab → click `aria-label="Add custom item"` → type "Torch" in name input → click "Add" | Row with "Torch" appears |
| 3 | Toggle equip | Click "Equipment" tab → check the equipped checkbox on Leather Armor row | Checkbox is checked; `equipment[0].equipped` = true in store |
| 4 | Delete item | Click "Equipment" tab → click delete button on Leather Armor row | Leather Armor row removed |
| 5 | Update gold | Click "Equipment" tab → find GP input in CurrencyRow → clear it and type "50" | `currency.gp` = 50 in store |
| 6 | Cross-tab: armor changes AC | `renderSheet(CHAR_CHAIN)` → click "Combat" tab → change AC formula to "heavy" → select "Chain Mail" from equipped armor dropdown | AC = 16 |

### `features-flow.test.jsx`

Within-sheet interactions on Features tab. Click "Features" tab at start of each test.

See "PipTracker / Feature Uses Semantics" in Key Implementation Notes for details on how to interact with pips.

| # | Test | Steps | Assertion |
|---|------|-------|-----------|
| 1 | Add feature with uses | Click "Features" tab → click `aria-label="Add feature"` → type "Second Wind" → set max uses to 1 → select recharge "short-rest" → click `aria-label="Add"` | Feature card "Second Wind" appears with a pip tracker |
| 2 | Mark a use consumed | `renderSheet({ ...CHAR, features: [{ ...CHAR.features[0], uses: 2, maxUses: 2 }] })` → click "Features" tab → click pip index 1 (second pip, currently filled) within the Arcane Recovery card | `features[0].uses` = 1 in store |
| 3 | Short rest recharges feature (UI) | `renderSheet({ ...CHAR, features: [{ ...CHAR.features[0], uses: 0 }] })` → click "Features" tab → select `'short'` rest → click "Finish Rest" → click "Features" tab | Arcane Recovery pip tracker shows 1 filled pip (uses = 1) |
| 4 | Delete feature | Click "Features" tab → click `aria-label="Delete Arcane Recovery"` | Arcane Recovery card removed |

### `homebrew-flow.test.jsx`

Cross-page flows using `renderApp`. Store reset in `beforeEach`.

`RaceBuilder` and `ClassBuilder` initialize with the add form hidden. The "Add race" (`aria-label="Add race"`) / "Add class" (`aria-label="Add class"`) button must be clicked before the name input appears.

**Critical for test 4:** `WizardProvider` reads `globalAdvancedMode` from `useSettingsStore` once at mount via `useState`. Store changes after mount are NOT reflected. `useSettingsStore.setState(...)` must be called **before** `renderApp('/new')`.

| # | Test | Steps | Assertion |
|---|------|-------|-----------|
| 1 | Create custom race | `renderApp('/homebrew')` → click `aria-label="Add race"` → type "Tiefling" in name input → click `aria-label="Save race"` | "Tiefling" appears in race list |
| 2 | Delete custom race | `useHomebrewStore.setState({ races: [{ id: 'r1', name: 'Tiefling', abilityScoreIncreases: {}, traits: [], speed: 30, subraces: [] }], classes: [] })` → `renderApp('/homebrew')` → click `aria-label="Delete Tiefling"` | Tiefling removed |
| 3 | Create custom class | `renderApp('/homebrew')` → click `aria-label="Add class"` → type "Artificer" → click `aria-label="Save class"` | "Artificer" appears in class list |
| 4 | Custom race in wizard | `useSettingsStore.setState({ globalAdvancedMode: true })` → `useHomebrewStore.setState({ races: [{ id: 'tiefling', name: 'Tiefling', abilityScoreIncreases: {}, traits: [], speed: 30, subraces: [] }], classes: [] })` → `renderApp('/new')` → type any name → click "Next →" | Race select on Step 2 contains "Tiefling" as an option |

---

## Test Count Summary

| File | Tests |
|------|-------|
| character-creation | 4 |
| rest-and-recovery | 7 |
| combat-flow | 6 |
| spell-flow | 5 |
| level-up | 5 |
| equipment-flow | 6 |
| features-flow | 4 |
| homebrew-flow | 4 |
| **Total** | **41** |

---

## Constraints

- No production code changes — tests only
- No Playwright/Cypress — stay within Vitest + Testing Library
- No snapshot tests
- Each test is independent: reset `useCharacterStore`, `useHomebrewStore`, `useSettingsStore` in `beforeEach`
- Use `userEvent` (not `fireEvent`); call `userEvent.setup()` per test
