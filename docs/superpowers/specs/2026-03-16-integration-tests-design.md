# Integration Test Suite — Design Spec
Date: 2026-03-16

## Overview

Add a full integration test suite to the D&D 5e character sheet SPA. The existing 125 tests are unit/isolated-component tests. This suite adds ~35 integration tests covering cross-page user flows and multi-step within-sheet interactions.

## Goals

- Verify complete user journeys (create character → use sheet → rest → level up)
- Catch regressions where a change in one component silently breaks another (e.g. equipping armor not updating AC)
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

### `CHAR` fixture
A complete level-3 wizard character used as the base fixture across all integration tests. Includes:
- All required schema fields (meta, abilityScores, proficiencies, hp, combat, currency, equipment, attacks, spells, features, conditions, biography, customSpells, settings)
- Non-trivial values: DEX 16, INT 17, one dagger attack, spell slots for levels 1–3, one prepared spell (magic-missile), one class feature (Arcane Recovery with 1/1 uses), equipped leather armor

### `renderApp(initialRoute = '/')`
Renders the full `<App>` component inside `MemoryRouter` with the given initial route. Used for cross-page flow tests. Resets both `useCharacterStore` and `useHomebrewStore` to empty state before each test.

### `renderSheet(character, tab = 'Abilities')`
Seeds `useCharacterStore` with the given character, renders `<Sheet>` inside `MemoryRouter` with route `/character/:id`, then clicks the specified tab. Used for within-sheet interaction tests.

### `user`
Re-export of `userEvent.setup()` factory — each test calls `userEvent.setup()` directly for proper event simulation.

---

## Test Files

### `character-creation.test.jsx`
Cross-page flows using `renderApp`.

| # | Test | Assertion |
|---|------|-----------|
| 1 | Complete wizard flow | Enter name → select race/class/background → assign abilities → submit → roster shows character card with correct name and class |
| 2 | Navigate from roster to sheet | Click character card → sheet loads with character name in summary bar |
| 3 | Wizard Next disabled until name entered | Next button on step 1 is disabled with empty name, enabled after typing |
| 4 | Back navigation preserves values | Fill step 1, advance to step 2, go back → step 1 name field still populated |

### `rest-and-recovery.test.jsx`
Within-sheet modal flows using `renderSheet`.

| # | Test | Assertion |
|---|------|-----------|
| 1 | Short rest increases HP | Open Short Rest modal, roll hit dice, finish → `hp.current` increases (capped at max) |
| 2 | Short rest decreases hit dice remaining | After using hit dice → `hp.hitDiceRemaining` decreases |
| 3 | Short rest recharges features | Character has short-rest feature with 0 uses remaining → after short rest, uses restored to max |
| 4 | Long rest restores HP to max | `hp.current` set to max |
| 5 | Long rest resets spell slots | All used spell slots reset to 0 used |
| 6 | Long rest restores hit dice (up to half) | `hp.hitDiceRemaining` increases by `floor(total/2)` |
| 7 | Long rest resets arcane recovery | `spells.arcaneRecoveryUsed` set to false |

### `combat-flow.test.jsx`
Within-sheet interactions on Combat tab and cross-tab with Equipment.

| # | Test | Assertion |
|---|------|-----------|
| 1 | Add weapon attack | Fill add-attack form, submit → attack row appears in attacks table |
| 2 | Delete attack | Click delete on existing attack → row removed |
| 3 | Equip armor updates AC | Navigate to Equipment tab, equip chain mail (AC 16) → switch to Combat tab → AC displays 16 |
| 4 | Toggle condition on | Click Blinded toggle → displayed as active |
| 5 | Toggle condition off | Click active Blinded toggle → clears |
| 6 | Exhaustion increment/decrement | Increment exhaustion to 2 → shows 2; decrement → shows 1 |

### `spell-flow.test.jsx`
Within-sheet interactions on Spells tab.

| # | Test | Assertion |
|---|------|-----------|
| 1 | Prepare a spell | Click Prepare on an unprepared spell → spell appears in prepared list |
| 2 | Unprepare a spell | Click Unprepare on a prepared spell → removed from prepared list |
| 3 | Use a spell slot | Click a slot pip → used count increments |
| 4 | Arcane recovery | Open Arcane Recovery modal, recover 1 level-1 slot → used count decrements |
| 5 | Long rest resets slots | After long rest → all slot used counts show 0 |

### `level-up.test.jsx`
Within-sheet level-up modal flow.

| # | Test | Assertion |
|---|------|-----------|
| 1 | Level increases by 1 | Complete level-up wizard → summary bar shows level 4 |
| 2 | HP increase persists | Enter HP roll in modal → `hp.max` increases by roll + CON modifier |
| 3 | New spell slots available | Level 4 wizard gets new level-2 slot → spell tab slot count increases |
| 4 | ASI +2 to one score | Choose +2 INT on ASI step → `abilityScores.int` increases by 2 |
| 5 | ASI +1/+1 split | Choose +1 STR / +1 DEX → both scores increase by 1 |

### `equipment-flow.test.jsx`
Within-sheet interactions on Equipment tab plus cross-tab AC check.

| # | Test | Assertion |
|---|------|-----------|
| 1 | Add item from catalog | Select item from catalog dropdown → appears in equipment table |
| 2 | Add custom item | Fill custom item form, submit → appears in table |
| 3 | Toggle equip | Check equipped checkbox on item → item shows as equipped |
| 4 | Delete item | Click delete → item removed |
| 5 | Update gold | Change GP input → currency value persists in store |
| 6 | Equipping heavy armor updates AC | Add chain mail (armorClass 16) and equip it → Combat tab shows AC 16 |

### `features-flow.test.jsx`
Within-sheet interactions on Features tab.

| # | Test | Assertion |
|---|------|-----------|
| 1 | Add feature with uses | Fill form with name, 3 max uses, submit → feature card with pip tracker appears |
| 2 | Mark uses | Click 2 pips used → pip tracker shows 2 used |
| 3 | Short rest recharges feature | Feature with short-rest recharge and 0 uses → take short rest → uses restored |
| 4 | Delete feature | Click delete → feature card removed |

### `homebrew-flow.test.jsx`
Cross-page flows using `renderApp`.

| # | Test | Assertion |
|---|------|-----------|
| 1 | Create custom race | Navigate to /homebrew, fill race name, save → race appears in list |
| 2 | Delete custom race | Click delete on race → removed from list |
| 3 | Create custom class | Fill class name, save → class appears in list |
| 4 | Custom race in wizard | After creating a race, navigate to /new, reach step 2 → custom race appears in race options |

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

- No new production code changes — tests only
- No Playwright/Cypress — stay within Vitest + Testing Library
- No snapshot tests
- Each test must be independent (store reset in `beforeEach`)
- Tests use `userEvent` (not `fireEvent`) for realistic interaction simulation
