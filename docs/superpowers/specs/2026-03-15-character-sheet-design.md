# D&D 5e 2014 Character Sheet — Product Requirements & Design Spec

**Date:** 2026-03-15
**Rules set:** D&D 5th Edition 2014 Basic Rules
**Deployment:** Local browser only, no backend, no authentication

---

## 1. Overview

A fully interactive D&D 5e character sheet creator and manager that runs entirely in the browser using localStorage for persistence. Supports multiple characters, a guided creation wizard, free-form editing, and advanced/homebrew options for power users.

---

## 2. Tech Stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | React 18 + Vite | Component-driven UI; excellent for complex reactive state |
| State | Zustand | Minimal boilerplate; built-in localStorage middleware; derived stats via selectors |
| Routing | React Router v6 | Three top-level routes; lightweight |
| Styling | Plain CSS Modules + CSS custom properties | No framework overhead; bespoke D&D aesthetic; DRY via shared tokens |
| Build | Vite | Fast dev server; zero-config for a pure client-side app |

No backend. No authentication. No external API calls at runtime.

---

## 3. Project Structure

```
src/
  data/                 # Static JSON: races, classes, backgrounds, spells, features
    races.json
    classes.json
    backgrounds.json
    spells.json
    features.json       # Class features keyed by class + level
  store/
    characters.js       # Zustand slice: CRUD on character array, persisted
    ui.js               # Active character ID, active tab, wizard step (not persisted)
    settings.js         # Global settings: { globalAdvancedMode: boolean } (persisted)
    homebrew.js         # Homebrew races/classes (persisted, global)
  hooks/
    useCharacter.js     # Access + mutate current character
    useDerivedStats.js  # Computed values: modifiers, bonuses, DCs, AC, capacity
    useSpells.js        # Merges built-in spells (from spells.json) with character.customSpells into
                        # a single unified list for filtering/display; prepared state; slot tracking
  components/
    StatBlock/          # Ability score + modifier display
    SkillRow/           # Skill name, ability, proficiency toggle, bonus
    DiceRoller/         # Inline roll button with result display
    SpellCard/          # Expandable spell entry
    FeatureCard/        # Class/racial/background feature with use tracker
    ConditionToggle/    # Single condition pill
    PipTracker/         # Reusable N-of-M pip display (spell slots, uses)
    CurrencyRow/        # cp/sp/ep/gp/pp inputs
    Modal/              # Shared modal wrapper
    Badge/              # "Homebrew" and other badges
  pages/
    Roster/             # Character list home screen
    Wizard/             # 6-step creation flow
    Sheet/              # Character sheet (summary bar + tabs)
      tabs/
        Abilities/
        Combat/
        Spells/
        Equipment/
        Features/
        Biography/
    Print/              # Print-optimized character sheet view
  utils/
    calculations.js     # Modifier math, proficiency bonus, XP thresholds, AC formulas
    validators.js       # Import JSON schema validation (checks schemaVersion, required fields)
    ids.js              # UUID generation
    diceRoller.js       # Dice expression parser and roller; returns { result, rolls, error }
                        # Invalid expressions return { result: null, error: string }
                        # Roll results do not persist between renders; displayed inline transiently
  styles/
    tokens.css          # All CSS custom properties (colors, spacing, type, radii)
    reset.css           # Minimal CSS reset
    typography.css      # Global type scale
```

---

## 4. Routing

| Route | View |
|---|---|
| `/` | Roster |
| `/new` | Creation Wizard |
| `/character/:id` | Character Sheet |
| `/character/:id/print` | Print View |

Wizard state is ephemeral — not written to localStorage until the final confirmation step.

---

## 5. Data Model

### 5.1 Character Object

```js
{
  schemaVersion: 1,         // increment on breaking data model changes; checked on import
  id: "uuid-v4",
  meta: {
    characterName: string,
    playerName: string,
    race: string,           // race ID (built-in or homebrew)
    subrace: string | null,
    class: string,          // class ID (built-in or homebrew)
    secondaryClass: string | null,  // Advanced Mode only; metadata display, no mechanical effect
    background: string,     // background ID
    alignment: string,      // e.g. "Lawful Good"
    level: number,          // 1–20
    xp: number,
    inspiration: boolean,
  },
  abilityScores: {
    str: number, dex: number, con: number,
    int: number, wis: number, cha: number
  },
  proficiencies: {
    savingThrows: string[],   // ability keys: ["str", "con"]
    skills: string[],         // skill keys: ["athletics", "perception"]
    expertise: string[],      // skill keys with double proficiency; invariant: every key in expertise
                              // must also appear in skills (expertise implies proficiency).
                              // The UI enforces this: granting expertise to a skill automatically
                              // adds it to skills if not already present.
    tools: string[],          // e.g. ["thieves-tools", "lute"]
    languages: string[],      // e.g. ["common", "elvish"]
    armor: string[],          // ["light", "medium", "heavy", "shields"]
    weapons: string[],        // ["simple", "martial"] or specific names
  },
  hp: {
    max: number,
    current: number,
    temp: number,
    hitDiceTotal: number,
    hitDiceRemaining: number,
  },
  deathSaves: {
    successes: number,  // 0–3
    failures: number,   // 0–3
    // Auto-reset to {successes: 0, failures: 0} whenever current HP becomes > 0
    // (e.g. from healing). Also reset on Long Rest (Section 7.2).
  },
  combat: {
    acFormula: "unarmored" | "light" | "medium" | "heavy" | "custom",
    acOverride: number | null,  // used when acFormula === "custom"
    speed: number,
    initiative: number | null,  // null = use DEX modifier
    equippedArmorId: string | null,
    equippedShield: boolean,
  },
  currency: {
    cp: number, sp: number, ep: number,  // ep always stored; only displayed when character.settings.advancedMode is true
    gp: number, pp: number
  },
  equipment: [
    {
      id: "uuid",
      name: string,
      quantity: number,
      weight: number,         // in pounds
      equipped: boolean,
      notes: string,
      // Weapon fields (null for non-weapons):
      damage: string | null,          // e.g. "1d8", "2d6"
      damageType: string | null,      // e.g. "slashing", "piercing", "bludgeoning"
      weaponProperties: string[],     // e.g. ["finesse", "light", "thrown"]
      weaponCategory: string | null,  // "simple" | "martial" | null
                                      // Proficiency resolution: character is proficient with this
                                      // weapon if weaponCategory OR the item name appears in
                                      // proficiencies.weapons. Either match grants proficiency.
      range: string | null,           // e.g. "20/60" for thrown/ranged; null for melee
      // Armor fields (null for non-armor):
      armorClass: number | null,      // base AC value; null for non-armor
      armorType: string | null,       // "light" | "medium" | "heavy" | null
    }
  ],
  attacks: [
    // Weapon attack entries derived from equipped weapons or created ad-hoc.
    // Each entry references an equipment item or is a standalone custom attack.
    {
      id: "uuid",
      name: string,
      equipmentId: string | null,   // links to equipment item; null for ad-hoc
      attackAbility: string,        // ability key used for attack roll (e.g. "str", "dex")
      attackBonusOverride: number | null,  // null = auto-calculated from attackAbility + proficiency;
                                            // non-null = replaces the entire auto-calculated bonus (not additive)
      damage: string,               // dice expression e.g. "1d8"
      damageType: string,
      // attackAbility and damageAbility are independent: attackAbility drives the attack roll,
      // damageAbility drives the damage modifier. They may differ (rare) but are usually the same.
      // For a Finesse weapon where Rogue chooses DEX: both would be "dex".
      damageAbility: string | null, // ability modifier added to damage roll; null = no modifier added
      notes: string,
    }
  ],
  spells: {
    ability: string | null,   // spellcasting ability key; null for non-casters
    // All 9 slot levels are always present; levels unavailable to the character have max: 0, used: 0.
    // This ensures consistent access patterns (no missing-key checks needed in rendering code).
    slots: {
      1: { max: number, used: number },
      2: { max: number, used: number },
      3: { max: number, used: number },
      4: { max: number, used: number },
      5: { max: number, used: number },
      6: { max: number, used: number },
      7: { max: number, used: number },
      8: { max: number, used: number },
      9: { max: number, used: number },
    },
    prepared: string[],       // spell IDs currently prepared for the day (both Cleric and Wizard)
    // Wizard: spells.known = spellbook (spells the Wizard has learned); prepares a subset each day.
    //         known is populated at creation and grows at each level-up (+2 free spells).
    // Cleric: spells.known = [] (empty); Clerics prepare directly from the full Cleric spell list
    //         in spells.json (filtered by level ≤ highest available slot). No known tracking needed.
    known: string[],          // Wizard spellbook entries; unused (empty) for non-Wizards
    arcaneRecoveryUsed: boolean,  // Wizard only
  },
  features: [
    {
      id: "uuid",
      name: string,
      source: string,         // "class" | "race" | "background" | "custom"
      description: string,
      uses: number | null,    // null = unlimited
      maxUses: number | null,
      recharge: "short-rest" | "long-rest" | "day" | null,
    }
  ],
  conditions: {
    blinded: boolean,
    charmed: boolean,
    deafened: boolean,
    exhaustion: number,       // 0–6
    frightened: boolean,
    grappled: boolean,
    incapacitated: boolean,
    invisible: boolean,
    paralyzed: boolean,
    petrified: boolean,
    poisoned: boolean,
    prone: boolean,
    restrained: boolean,
    stunned: boolean,
    unconscious: boolean,
  },
  biography: {
    personalityTraits: string,
    ideals: string,
    bonds: string,
    flaws: string,
    appearance: string,
    backstory: string,
    age: string,
    height: string,
    weight: string,
    eyes: string,
    skin: string,
    hair: string,
    notes: string,
  },
  customSpells: [
    {
      id: "uuid",
      name: string,
      level: number,          // 0 = cantrip
      school: string,
      castingTime: string,
      range: string,
      components: string,
      duration: string,
      description: string,
      castingAbilityOverride: string | null,
    }
  ],
  settings: {
    advancedMode: boolean,
    abilityScoreMethod: "standard-array" | "point-buy" | "manual",
    // abilityScoreMethod is record-keeping only after character creation;
    // it is displayed in the Abilities tab as an informational label but
    // does not gate or re-open the score picker post-creation.
  }
}
```

### 5.2 Homebrew Object (global, separate localStorage key)

```js
{
  races: [
    {
      id: "uuid",
      name: string,
      size: "Small" | "Medium",
      speed: number,
      abilityScoreIncreases: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
      darkvision: number | null,    // range in feet; null = none
      traits: [{ name: string, description: string }],
      languages: string[],
      subraces: [
        {
          id: "uuid",
          name: string,
          abilityScoreIncreases: { ... },
          traits: [{ name: string, description: string }],
        }
      ],
    }
  ],
  classes: [
    {
      id: "uuid",
      name: string,
      hitDie: 6 | 8 | 10 | 12,
      savingThrowProficiencies: string[],   // 2 ability keys
      armorProficiencies: string[],
      weaponProficiencies: string[],
      toolProficiencies: string[],
      skillChoices: { count: number, options: string[] },
      asiLevels: number[],                  // levels at which ASI is granted, e.g. [4,8,12,16,19]
      spellcastingAbility: string | null,
      spellSlotProgression: {               // null if not a spellcaster
        // level → slot counts per spell level
        1: { 1: 2 },
        2: { 1: 3 },
        // ...
      } | null,
      features: [
        {
          level: number,
          name: string,
          description: string,
          uses: number | null,
          recharge: "short-rest" | "long-rest" | "day" | null,
        }
      ],
    }
  ]
}
```

### 5.3 Derived Stats (never stored, always computed)

Computed in `useDerivedStats` from raw character data:

| Stat | Formula |
|---|---|
| Ability modifier | `floor((score - 10) / 2)` |
| Proficiency bonus | Level 1–4: +2, 5–8: +3, 9–12: +4, 13–16: +5, 17–20: +6 |
| Skill bonus | ability modifier + (proficiency bonus if proficient) + (proficiency bonus again if expertise) |
| Saving throw bonus | ability modifier + (proficiency bonus if proficient) |
| Passive Perception | 10 + Perception skill bonus (which already includes proficiency and expertise per the Skill bonus formula) |
| Passive Investigation | 10 + Investigation skill bonus |
| Passive Insight | 10 + Insight skill bonus |
| AC — unarmored | 10 + DEX modifier |
| AC — light armor | armor base + DEX modifier |
| AC — medium armor | armor base + min(DEX modifier, 2) |
| AC — heavy armor | armor base |
| AC — shield bonus | +2 added to any formula |
| Spell Save DC | 8 + proficiency bonus + spellcasting ability modifier |
| Spell Attack Bonus | proficiency bonus + spellcasting ability modifier |
| Carrying capacity | STR score × 15 (pounds) |
| Initiative | DEX modifier (unless overridden) |
| Sneak Attack dice | `ceil(rogue level / 2)` d6 — displayed as a dedicated row in the Combat tab for Rogue characters, with an inline roll button |
| Attack bonus (weapon) | When `attackBonusOverride` is null: `attackAbility modifier + proficiency bonus (if proficient with weapon)`. When `attackBonusOverride` is non-null: use `attackBonusOverride` as the entire bonus (replaces auto-calc; not additive). |
| Weapon damage bonus | damage dice + ability modifier (for the configured damageAbility) |

---

## 6. Screens & Views

### 6.1 Roster

- Grid of character cards: name, race/class, level, XP bar, portrait placeholder
- Actions per card: Open sheet, Export JSON, Delete (with confirmation)
- Global actions: "New Character" (→ Wizard), "Import JSON"
- "Manage Homebrew" link visible when `settings.globalAdvancedMode` is true (a global toggle in the Roster header, separate from per-character Advanced Mode)
- Empty state: prompt to create first character

### 6.2 Creation Wizard

Linear 6-step flow. Progress indicator at top. Back/Next navigation. Not persisted until step 6 confirmed.

| Step | Content |
|---|---|
| 1. Name & Biography | Character name (required), player name, alignment picker, appearance notes |
| 2. Race | Race picker → subrace picker; racial traits and stat bonuses displayed inline; homebrew races included (Advanced Mode) |
| 3. Class | Class picker; hit die, proficiencies, saving throws, starting features displayed inline; homebrew classes included (Advanced Mode) |
| 4. Background | Background picker; granted skill/tool proficiencies and feature displayed inline |
| 5. Ability Scores | Standard array assignment by default (drag-to-assign or dropdown); racial bonuses applied automatically; modifiers shown live. Point buy and manual entry available in Advanced Mode |
| 6. Review & Finish | Summary of all choices; calculated max HP; starting proficiency bonus; confirm creates character and navigates to sheet |

**Ability score generation methods (step 5):**

The "Next" button on step 5 is disabled until all six ability scores have been assigned a value:
- Standard array: all six values from the set must be placed (no unassigned slots remain)
- Point buy: all six scores must be explicitly set (default to 8 each; user adjusts from there)
- Manual entry: all six fields must contain a non-empty integer

- **Standard array** (default): assign {15, 14, 13, 12, 10, 8} — each value used exactly once
- **Point buy** (Advanced Mode): 27 points; scores 8–15; non-linear cost table enforced:

  | Score | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
  |---|---|---|---|---|---|---|---|---|
  | Cost | 0 | 1 | 2 | 3 | 4 | 5 | 7 | 9 |

- **Manual entry** (Advanced Mode): free numeric input; no constraints enforced

### 6.3 Character Sheet

#### Summary Bar (always visible, fixed top)

| Element | Detail |
|---|---|
| Character name, race/class, level | Read-only display |
| HP tracker | Current / Max, editable current; Temp HP inline; progress bar |
| AC | Derived display |
| Initiative | Derived display |
| Speed | Editable |
| Inspiration | Toggle button |
| Death saves | Shown only when current HP = 0; tap to increment successes/failures |
| Rest menu | Dropdown: Short Rest, Long Rest |
| Level Up button | Highlighted when XP ≥ threshold |
| Settings (gear icon) | Advanced Mode toggle, export, print |

#### Tab: Abilities

- Six ability score blocks: score (editable in Advanced Mode), modifier (auto-computed)
- Per ability: saving throw row with proficiency toggle and total bonus
- 18 skill rows: skill name, governing ability label, proficiency toggle, expertise toggle (shown when skill key is present in `proficiencies.expertise`), total bonus
- Passive checks section: Passive Perception, Passive Investigation, Passive Insight (derived, read-only)
- Proficiency bonus display
- Proficiency tags: armor, weapons, tools, languages (read-only, sourced from race/class/background + manual)

#### Tab: Combat

- AC display with formula selector (unarmored / light / medium / heavy / custom)
- Initiative and Speed (editable)
- Weapon attacks table: entries sourced from `character.attacks`; add weapon from equipment (auto-populates fields) or create ad-hoc; each row shows name, attack bonus, damage, damage type — attack bonus and damage bonus auto-calculated from linked ability scores and proficiency; delete action per row
- **Sneak Attack** row (Rogue only, driven by class data): shows current sneak attack dice count (e.g., "3d6"), inline roll button
- Conditions panel: 15 condition toggles (exhaustion shows 0–6 stepper); active conditions highlighted
- Hit dice tracker: remaining / total pips; "Spend Hit Die" button rolls hit die + CON mod and adds to current HP

#### Tab: Spells

Visible when `character.spells.ability` is non-null (set by the character's class definition). This is determined by the class data, not by class name. Among the four Basic Rules built-in classes: **Cleric** (`spells.ability = "wis"`) and **Wizard** (`spells.ability = "int"`) are spellcasters; **Fighter** and **Rogue** (including their Basic Rules subclasses) are not and have `spells.ability = null`.

- Spell Save DC and Spell Attack Bonus (derived, read-only, prominent)
- Spell slot tracker: one row per slot level 1–9; only rows where `slots[level].max > 0` are rendered; pip display; click pip to expend; "Recover All" on long rest
- Arcane Recovery tracker (Wizard only): 1/day button; disabled when no expended slots of levels 1–5 exist (shows tooltip "No recoverable slots available"); when clicked, opens a recovery modal listing all currently expended slots of levels 1–5 as checkboxes; if no eligible slots are expended the modal shows "No recoverable slots available" with only a Cancel button; otherwise player selects any combination; the modal enforces that the sum of selected slot levels does not exceed `ceil(wizardLevel / 2)`; running total shown; Confirm button disabled until at least one slot is selected and the sum constraint is met
- Spell list: filterable by level, school, prepared/known status, search by name
- Each spell: expandable to show full description (from static data or custom definition); prepared toggle; source badge (Basic Rules / Custom)
- "Add Custom Spell" button: opens form with all spell fields + optional casting ability override

#### Tab: Equipment

- Item list: name, quantity, weight, equipped toggle, notes; add / edit / delete per item
- Currency: cp / sp / ep (Advanced Mode only) / gp / pp fields
- Carrying capacity: current weight vs. STR × 15 lbs; progress bar; encumbrance warnings in Advanced Mode

#### Tab: Features

- All features grouped by source (Class, Race, Background, Custom)
- Each feature: name, description (collapsible), usage tracker (pips for limited-use features), recharge label
- "Add Custom Feature" button: opens form for homebrew abilities

#### Tab: Biography

- Personality traits, ideals, bonds, flaws (text areas; pre-filled at character creation from a random selection from the background's trait tables — each background in `backgrounds.json` includes arrays of personality traits, ideals, bonds, and flaws; one entry is randomly selected per field at creation; all are freely editable thereafter)
- Appearance, backstory (free text areas)
- Physical description fields: age, height, weight, eyes, skin, hair
- General notes area

### 6.4 Print View (`/character/:id/print`)

Rendered via a dedicated route using `@media print` CSS. No interactive elements. Logical sections:

1. Header: name, race/class/level, background, alignment, XP
2. Ability scores + saving throws + skills
3. Combat stats: AC, HP, initiative, speed, hit dice; weapon attacks table (name, attack bonus, damage, damage type); Sneak Attack row if Rogue
4. Proficiencies and languages
5. Features and traits (condensed)
6. Equipment and currency
7. Spells (if applicable): slots, prepared spells, spell descriptions
8. Biography

Accessible via "Print / Save as PDF" button in sheet settings menu.

---

## 7. Operations (Guided Flows)

### 7.1 Short Rest

Modal confirms action. On confirm:
- Prompt to spend hit dice: show remaining dice, roll button per die (rolls hit die + CON mod), running total shown
- On finish: all short-rest features reset (uses refilled); hit dice count updated

### 7.2 Long Rest

Modal confirms action. On confirm:
- HP restored to maximum
- All spell slots restored to maximum
- All short-rest and long-rest features reset
- Hit dice restored: recover expended hit dice up to `max(1, floor(hitDiceTotal / 2))` — i.e. half total rounded down, minimum 1 (the minimum-1 applies to the recovery count, ensuring a level-1 character who spent their only hit die still recovers 1)
- Arcane Recovery resets (Wizard)
- Death saves cleared

### 7.3 Level Up

Multi-step modal. Only available when XP ≥ threshold for next level.

| Step | Content |
|---|---|
| 1. HP increase | Roll hit die (inline dice roller) or take the 5e fixed average (`floor(hitDie / 2) + 1`, e.g. d8 = 5); CON modifier added to either result; result floored at minimum 1 (i.e. `max(1, roll + CON modifier)`); new max HP previewed |
| 2. New features | Read-only list of all features gained at new level (from static class data) |
| 3. Spell slots | (Spellcasters only) New slot counts displayed; newly unlocked spell levels highlighted |
| 4. Spells | (Spellcasters only) Wizard: prompted to add 2 free spells; a filtered spell picker shows all built-in and custom spells of levels for which the character now has spell slots (using the post-level-up slot counts); duplicate selection not allowed; Cleric: prepared spell maximum auto-updates (= WIS modifier + Cleric level, shown read-only) |
| 5. Ability Score Improvement | Available at levels defined by `class.asiLevels` (varies per class — Fighter has more ASIs than Cleric/Wizard/Rogue); player chooses either +2 to one score OR +1 to two different scores (both options presented in the UI); max 20 per score; Advanced Mode: feat option as free-text custom feature instead |
| 6. Confirm | Summary of all changes; XP threshold for next level displayed |

On confirm: level increments, proficiency bonus recalculates automatically, hit dice total gains 1, new features added to Features tab, spell slots updated.

---

## 8. Export, Import & Print

### Export
- Available from Roster (per card) and Sheet (settings menu)
- Produces `[CharacterName].json` containing the full character object
- Exported JSON is human-readable (formatted)

### Import
- Available from Roster ("Import JSON" button)
- Accepts `.json` file; validates `schemaVersion` field and expected schema shape before accepting
- On `schemaVersion` mismatch: warn user that the file was created with a different version; offer to attempt import anyway (the validator fills missing fields with safe defaults and ignores unrecognized fields — no migration functions required for v1)
- On validation failure: clear error message, no data written
- Imported characters receive a fresh UUID to prevent ID collisions

### Print
- See Section 6.4
- Browser's native print dialog used (no PDF library dependency)

---

## 9. Advanced Mode

**Global Advanced Mode** (`settings.globalAdvancedMode`): toggled from the Roster header. Controls whether the Homebrew builder is accessible and whether Advanced Mode can be enabled on individual characters.

**Per-character Advanced Mode** (`character.settings.advancedMode`): toggled via gear icon in the sheet header. Controls character-level complexity features listed below.

| Feature | Default (off) | Advanced Mode (on) |
|---|---|---|
| Ability score methods | Standard array only | + Point buy + Manual entry |
| Ability Score Improvements | +2 stat bump only | + Feat (free-text custom feature) |
| AC | Formula selector | + Custom numeric override |
| Multiclass | Hidden | Secondary class field (metadata only; no mechanical calculation) |
| Encumbrance | Reference bar | Enforced warnings + speed penalties in Combat tab |
| Electrum pieces (ep) | Hidden | Shown in currency |

Note: the **Homebrew builder** is controlled by `settings.globalAdvancedMode` (a global toggle on the Roster), not by per-character Advanced Mode. See Section 6.1.

---

## 10. Homebrew (Advanced Mode Only)

Homebrew data stored in a separate localStorage key (`dnd-homebrew`). Available globally across all characters.

### Homebrew Race Builder

Fields: name, size, speed, ability score increases (per stat), darkvision range, traits (repeating: name + description), languages, subraces (optional: name, additional ability score increases, additional traits).

### Homebrew Class Builder

Fields: name, hit die, saving throw proficiencies (2), armor/weapon/tool proficiencies, skill choices (count + candidate list), spellcasting ability (optional), spell slot progression table (optional), features by level (level, name, description, uses, recharge).

### Integration

- Homebrew races and classes appear in wizard dropdowns alongside built-in options
- Marked with a "Homebrew" badge everywhere they appear
- Editing a homebrew race/class does not retroactively update characters already using it (data is copied at character creation time)

---

## 11. Static Game Data

All built-in D&D 2014 Basic Rules content stored as JSON in `src/data/`:

**Races:** Dwarf (Hill, Mountain), Elf (High, Wood, Drow), Halfling (Lightfoot, Stout), Human
**Classes:** Cleric, Fighter, Rogue, Wizard (with all Basic Rules subclasses)
**Backgrounds:** Acolyte, Charlatan, Criminal, Entertainer, Folk Hero, Guild Artisan, Hermit, Noble, Outlander, Sage, Sailor, Soldier, Urchin
**Spells:** Full Basic Rules spell list (~100 spells), keyed by ID, including level, school, casting time, range, components, duration, and description
**Class features:** Keyed by class + level; includes recharge type, use counts, and `asiLevels` array per class
**Skills:** 18 skills with governing ability keys
**Conditions:** 15 conditions with descriptions
**Equipment:** Standard weapons and armor with weights, damage dice, properties, and AC values
**XP thresholds:** Level 1–20 XP table (XP required to reach each level):

| Level | XP Required | Level | XP Required |
|---|---|---|---|
| 1 | 0 | 11 | 85,000 |
| 2 | 300 | 12 | 100,000 |
| 3 | 900 | 13 | 120,000 |
| 4 | 2,700 | 14 | 140,000 |
| 5 | 6,500 | 15 | 165,000 |
| 6 | 14,000 | 16 | 195,000 |
| 7 | 23,000 | 17 | 225,000 |
| 8 | 34,000 | 18 | 265,000 |
| 9 | 48,000 | 19 | 305,000 |
| 10 | 64,000 | 20 | 355,000 |

**Spell slot progression:** Per class, per level

---

## 12. CSS Architecture

All design tokens defined in `src/styles/tokens.css` as CSS custom properties:

- Color palette: parchment tones, accent colors, semantic colors (danger/warning/success)
- Spacing scale (--space-xs through --space-2xl)
- Typography scale (--text-xs through --text-2xl), font families, weights
- Border radii, box shadows, transition durations

Each component has a co-located `.module.css` file. No global class names except tokens and resets. Shared structural patterns (e.g., stat block layout, pip tracker) extracted into reusable component stylesheets.

---

## 13. Out of Scope

The following are explicitly out of scope for this version:

- Multiclassing mechanics (metadata field only)
- Feats (feat rules not in Basic Rules; captured as free-text in Advanced Mode)
- Monsters / NPCs / encounter tracker
- Initiative order / combat tracker
- Map or grid tools
- Cloud sync or multi-device support
- Collaborative/shared sessions
- Rules beyond D&D 5e 2014 Basic Rules (no Xanathar's, Tasha's, etc.)
- Character portraits / image uploads
- Dice sound effects or animations
