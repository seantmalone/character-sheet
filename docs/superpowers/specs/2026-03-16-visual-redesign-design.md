# Visual Redesign — Dark Fantasy Design Spec

## Summary

Full design pass converting the existing parchment/crimson theme to a dark fantasy aesthetic. Cinzel + Crimson Text typography from Google Fonts. Gold as the primary CTA color. Crimson demoted to danger-only. All CSS variable names preserved — only values change. Two targeted JSX edits (SummaryBar two-row layout, Wizard numbered progress indicator).

**Approach:** CSS overhaul + targeted JSX tweaks (Approach B).
**Print view** retains the light parchment theme — dark backgrounds waste ink.

---

## 1. Color Token Changes (`src/styles/tokens.css`)

All `--color-*` names stay identical. Only the values change.

| Token | Old value | New value | Role |
|---|---|---|---|
| `--color-parchment` | `#f5f0e8` | `#0f0a04` | Page background |
| `--color-parchment-dark` | `#e8e0d0` | `#140e04` | Tab body, sheet body |
| `--color-ink` | `#2c1810` | `#e8c87a` | Primary text (gold) |
| `--color-ink-light` | `#5c3d2e` | `#c8a85a` | Secondary text |
| `--color-accent` | `#8b1a1a` | `#9b1e1e` | Danger / destructive only |
| `--color-accent-hover` | `#6b1414` | `#7a1515` | Danger hover |
| `--color-gold` | `#c8a951` | `#c8a830` | Primary CTA (buttons, active states) |
| `--color-success` | `#2d6a2d` | `#2d6a2d` | Unchanged |
| `--color-warning` | `#8b6914` | `#c8a830` | Same as gold |
| `--color-danger` | `#8b1a1a` | `#9b1e1e` | Same as accent |
| `--color-surface` | `#ffffff` | `#241a07` | Input/form backgrounds |
| `--color-surface-raised` | `#faf7f2` | `#1a1208` | Card backgrounds |
| `--color-border` | `#c4b89a` | `#2e2008` | Primary borders |
| `--color-border-light` | `#ddd5c0` | `#3d2e0f` | Dividers, lighter borders |
| `--color-muted` | `#8a7a6a` | `#b09050` | Labels, metadata, hints — lifted for dark bg readability |
| `--color-overlay` | `rgba(44,24,16,0.5)` | `rgba(0,0,0,0.75)` | Modal backdrop |

Two new tokens added:

```css
--color-muted-dim: #9a8050;   /* inactive states: unprepared badge, inactive condition pill */
--color-disabled: #7a6040;    /* disabled button text */
```

**`--color-bg-alt` (existing undefined token):** This token is used in 7 files (`ClassBuilder.module.css`, `RaceBuilder.module.css`, `LevelUpModal.module.css`, `CustomSpellForm.module.css`, `FeaturesTab.module.css`, `SummaryBar.module.css`, `Wizard.module.css`) but is not defined in `tokens.css`. Add it alongside the other surface tokens:

```css
--color-bg-alt: #1a1208;    /* alias for --color-surface-raised; list item and form backgrounds */
```

**`--color-hp` (existing undefined token):** `SummaryBar.module.css` currently references `var(--color-hp)` for the HP bar fill, but this token is also not defined in `tokens.css` (existing bug). The redesign intentionally replaces it — the HP bar will use the danger crimson, fitting the dark fantasy aesthetic. Add the token to `tokens.css`:

```css
--color-hp: var(--color-accent);   /* HP bar fill — danger crimson in dark theme */
```

The `SummaryBar.module.css` `.hpFill` rule in Section 5 keeps `background: var(--color-accent)` (which resolves to `#9b1e1e`). No existing test checks the HP bar color, so this is safe to change.

---

## 2. Typography Changes (`index.html` + `src/styles/tokens.css` + `src/styles/typography.css`)

### Google Fonts link in `index.html`

Add to `<head>` before existing styles:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
```

### Token changes in `tokens.css`

```css
--font-serif: 'Cinzel', Georgia, serif;     /* was: 'Georgia', 'Times New Roman', serif */
--font-body:  'Crimson Text', Georgia, serif; /* NEW — for descriptions and flavor text */
/* --font-sans and --font-mono unchanged */
```

### `typography.css` changes

- `h1–h3`: already use `var(--font-serif)` — automatically get Cinzel. Increase `letter-spacing` to `0.04em`.
- `h4`: add `letter-spacing: 0.06em; text-transform: uppercase;`
- `.label`: reduce from `11px` to `10px` (addresses inconsistency where it was rendering at 9px in many places). Keep uppercase + letter-spacing; color uses `var(--color-muted)`. Note: this goes below `--text-xs: 11px` — set the value as a literal `10px` in `typography.css` rather than using the token.
- `.subtitle`: change to `font-family: var(--font-body); font-style: italic;`

---

## 3. Global Reset (`src/styles/reset.css`)

Update `body` rule:
```css
body {
  background: var(--color-parchment);   /* now #0f0a04 */
  color: var(--color-ink);              /* now #e8c87a */
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: 1.5;
}

input, textarea, select {
  background: var(--color-surface);       /* now #241a07 */
  border: 1px solid var(--color-border-light);  /* now #3d2e0f */
  color: var(--color-ink);
  /* radius and padding unchanged */
}

input:focus, textarea:focus, select:focus {
  outline: 2px solid var(--color-gold);   /* was accent, now gold */
  outline-offset: 1px;
}
```

---

## 4. Button Conventions (applies across all CSS modules)

Wherever primary action buttons appear, update classes to match this intent:

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| Primary | `--color-gold` | `--color-parchment` | none | Level Up, Create, Save, Confirm |
| Ghost | transparent | `--color-muted` | `--color-border-light` | Cancel, Rest, secondary actions |
| Danger | `--color-accent` | `#f0d8d8` | none | Delete, destructive |
| Disabled | `--color-surface-raised` | `--color-disabled` | `--color-border` | Any disabled state |

All buttons use `font-family: var(--font-serif)` (Cinzel), `font-size: var(--text-xs)`, `letter-spacing: 0.07em`.

---

## 5. SummaryBar JSX Change (`src/pages/Sheet/SummaryBar.jsx`)

**Current structure** (single `<header>` with flat children):
```
<header className={styles.bar}>
  <div className={styles.identity}>...</div>
  <div className={styles.stats}>
    <div className={styles.hpBlock}>...</div>
    <div className={styles.stat}>AC</div>
    <div className={styles.stat}>Init</div>
    <div className={styles.stat}>Speed</div>
    <button className={styles.inspiration}>★</button>   {/* ← inside .stats */}
  </div>
  {isDying && <div className={styles.deathSaves}>...</div>}
  <div className={styles.actions}>...</div>
</header>
```

**New structure** (two rows):
```
<header className={styles.bar}>
  <div className={styles.topRow}>
    <div className={styles.identity}>...</div>       {/* name + subtitle */}
    <button
      className={[styles.inspiration, meta.inspiration ? styles.inspOn : ''].join(' ')}
      onClick={toggleInspiration}
      aria-pressed={meta.inspiration}
      title="Inspiration">
      ★
    </button>
    <div className={styles.actions}>...</div>         {/* rest + levelup + settings */}
  </div>
  <div className={styles.statsRow}>
    <div className={styles.hpBlock}>...</div>
    <div className={styles.stat}>
      <span className={styles.statValue}>{ac}</span>
      <span className={styles.statLabel}>AC</span>
    </div>
    <div className={styles.stat}>
      <span className={styles.statValue}>{initiative >= 0 ? `+${initiative}` : initiative}</span>
      <span className={styles.statLabel}>Init</span>
    </div>
    <div className={styles.stat}>
      <input type="number" aria-label="Speed" className={styles.speedInput}
        value={combat.speed}
        onChange={e => updateCharacter(character.id, { combat: { speed: Number(e.target.value) } })} />
      <span className={styles.statLabel}>Speed</span>
    </div>
    <div className={styles.stat}>
      <span className={styles.statValue}>{hp.hitDiceRemaining ?? hp.max}</span>
      <span className={styles.statLabel}>Hit Dice</span>
    </div>
    {isDying && <div className={styles.deathSaves}>...</div>}
  </div>
</header>
```

The inspiration button moves into `topRow` (next to character name). Hit Dice remaining (`hp.hitDiceRemaining`) is added as a new stat in `statsRow` — it's already available on `character.hp`.

### SummaryBar CSS (`SummaryBar.module.css`)

```css
.bar      { position: sticky; top: 0; z-index: 100; background: var(--color-parchment); border-bottom: 1px solid var(--color-border); }
.topRow   { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-sm) var(--space-md); border-bottom: 1px solid var(--color-border); }
.statsRow { display: flex; align-items: stretch; padding: 0 var(--space-md); }

.identity { flex: 1; }
.name     { font-family: var(--font-serif); font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--color-ink); letter-spacing: 0.04em; line-height: 1; }
.subtitle { font-family: var(--font-body); font-size: var(--text-sm); font-style: italic; color: var(--color-muted); margin-top: 3px; }

.stat      { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-sm) var(--space-md); border-right: 1px solid var(--color-border); min-width: 56px; }
.statValue { font-family: var(--font-serif); font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--color-ink); line-height: 1; }
.statLabel { font-family: var(--font-serif); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-muted); margin-top: 3px; }

.hpBlock  { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-sm) var(--space-md); border-right: 1px solid var(--color-border); min-width: 90px; }
.hpRow    { display: flex; align-items: center; gap: 4px; font-family: var(--font-serif); font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--color-ink); }
.hpBar    { width: 72px; height: 3px; background: var(--color-border); border-radius: 2px; margin: 4px 0; overflow: hidden; }
.hpFill   { height: 100%; background: var(--color-accent); border-radius: 2px; transition: width var(--transition); }

.actions  { display: flex; align-items: center; gap: var(--space-sm); }

/* Death saves — retain all existing .deathSaves rules unchanged; they move from a top-level
   flex child of <header> into .statsRow, which is also a flex container. Add align-self:center
   to prevent it from stretching to full statsRow height: */
.deathSaves { align-self: center; }

/* Settings menu — retain from existing SummaryBar.module.css */
.gearWrapper      { position: relative; }
.gear             { background: transparent; border: none; cursor: pointer; color: var(--color-muted); font-size: var(--text-lg); }
.settingsMenu     { position: absolute; right: 0; top: 100%; background: var(--color-surface-raised); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-sm); z-index: 10; min-width: 160px; display: flex; flex-direction: column; gap: var(--space-xs); }
.settingsMenu button:hover { background: var(--color-bg-alt); }
```

> **Note on `--summary-bar-height`:** `tokens.css` defines `--summary-bar-height: 72px`. After the two-row change, the actual height will increase. Update this token value in `tokens.css` to match the real rendered height (measure after implementation). If confirmed unused by any layout file, remove it instead.

---

## 6. Wizard Progress Indicator JSX Change (`src/pages/Wizard/Wizard.jsx`)

**Current:** `<span>` elements with label text, styled as dots via CSS.
**New:** Each step rendered as a column (dot + label) connected by a line element.

```jsx
<nav className={styles.progress} aria-label="Creation steps">
  {STEP_LABELS.map((label, i) => (
    <React.Fragment key={label}>
      <div className={styles.stepCol}>
        <div className={[
          styles.stepDot,
          i + 1 === step ? styles.active : '',
          i + 1 < step ? styles.done : ''
        ].filter(Boolean).join(' ')}>
          {i + 1 < step ? '✓' : i + 1}
        </div>
        <div className={[
          styles.stepLabel,
          i + 1 === step ? styles.active : '',
          i + 1 < step ? styles.done : ''
        ].filter(Boolean).join(' ')}>{label}</div>
      </div>
      {i < STEP_LABELS.length - 1 && (
        <div className={[styles.stepLine, i + 1 < step ? styles.done : ''].filter(Boolean).join(' ')} />
      )}
    </React.Fragment>
  ))}
</nav>
```

### Wizard CSS (`Wizard.module.css`)

```css
.wizard   { max-width: 640px; margin: 0 auto; padding: var(--space-xl) var(--space-md); }
.progress { display: flex; align-items: flex-start; margin-bottom: var(--space-xl); }

.stepCol   { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.stepDot   { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--color-border-light); display: flex; align-items: center; justify-content: center; font-family: var(--font-serif); font-size: 10px; color: var(--color-muted-dim); background: var(--color-surface-raised); flex-shrink: 0; }
.stepDot.active { border-color: var(--color-ink); color: var(--color-ink); background: var(--color-parchment); }
.stepDot.done   { background: var(--color-gold); border-color: var(--color-gold); color: var(--color-parchment); font-weight: var(--weight-bold); }
.stepLabel      { font-family: var(--font-serif); font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-muted-dim); white-space: nowrap; }
.stepLabel.active { color: var(--color-ink); }
.stepLabel.done   { color: var(--color-gold); }
.stepLine       { flex: 1; height: 2px; background: var(--color-border); margin: 13px 4px 0; }
.stepLine.done  { background: var(--color-gold); }
```

---

## 7. Component CSS Module Changes

### Shared patterns applied to all modules

- **Backgrounds**: `var(--color-surface-raised)` for cards (`#1a1208`), `var(--color-surface)` for inputs (`#241a07`).
- **Borders**: `var(--color-border)` for card borders, `var(--color-border-light)` for internal dividers.
- **Shadows**: Existing shadow values stay — they use ink-color alpha which now reads as warm dark-on-dark. No change needed.
- **Hover states**: Use `var(--color-surface)` background on hover (slightly lighter than card bg).
- **Active/selected states**: Use `var(--color-gold)` for border/text, not `var(--color-accent)`.
- **Inactive secondary states**: Use `var(--color-muted-dim)` (`#9a8050`) — not `var(--color-muted)` — for things like inactive condition pills, unprepared spell badge, placeholder text.
- **Disabled**: Use `var(--color-disabled)` (`#7a6040`) for text on disabled buttons.

### Per-module specifics

**StatBlock.module.css**
- `.block`: background `var(--color-surface-raised)`, border `var(--color-border)`
- `.score`: Cinzel (via `--font-serif`), gold text
- `.modifier`: gold text (`--color-gold`), background `var(--color-parchment)` (the darkest bg)

**SkillRow.module.css**
- `.dot` unfilled: border `var(--color-border-light)`
- `.dot` proficient: background + border `var(--color-gold)`
- `.dot` expert: dashed border `var(--color-gold)`, filled background `var(--color-gold)`
- `.bonus`: Cinzel font, `var(--color-ink)`
- `.name`: Crimson Text (`var(--font-body)`), `var(--color-ink-light)`

**SpellCard.module.css**
- Prepared state: border-left `3px solid var(--color-gold)`, background slightly lighter
- Unprepared badge: border `var(--color-border-light)`, text `var(--color-muted-dim)` — not `var(--color-muted)` (readability fix)
- Spell name: Cinzel, `var(--color-ink)`
- Spell metadata (school/level/component): Crimson Text italic, `var(--color-muted)` (`#b09050`)
- Spell body: Crimson Text, `var(--color-ink-light)`

**FeatureCard.module.css**
- Feature name: Cinzel, `var(--color-ink)`
- Source/recharge: Crimson Text italic, `var(--color-muted)` (`#b09050`)
- Body text: Crimson Text, `var(--color-ink-light)`
- Delete button hover: `var(--color-accent)`

**PipTracker.module.css**
- Unfilled pip: border `var(--color-border-light)`
- Filled pip: background + border `var(--color-gold)`

**ConditionToggle.module.css**
- Inactive pill: border `var(--color-border-light)`, text `var(--color-muted-dim)` (`#9a8050`) — not `var(--color-muted)` (readability fix)
- Active pill: background `var(--color-accent)`, text `#f0d8d8`

**Badge.module.css**
- Default: background `var(--color-surface-raised)`, border `var(--color-border-light)`, text `var(--color-muted)`
- Homebrew (gold): background `rgba(200,168,48,0.15)`, border `rgba(200,168,48,0.4)`, text `var(--color-gold)`
- Custom: same as default

**Modal.module.css**
- Header: background `var(--color-parchment)` (darkest), border-bottom `var(--color-border)`
- Modal body: background `var(--color-surface-raised)`, Crimson Text for body text
- Close button: `var(--color-muted)`, hover `var(--color-ink)`

**CharacterCard.module.css** (Roster)
- Portrait: border `2px solid var(--color-gold)`, background `var(--color-border)`
- Name: Cinzel, `var(--color-ink)`
- Details: Crimson Text italic, `var(--color-muted)`
- XP bar fill: `linear-gradient(90deg, var(--color-gold), var(--color-ink))`

**Sheet.module.css**
- `.tab`: Cinzel, `text-transform: uppercase`, `font-size: var(--text-xs)`, `letter-spacing: 0.08em`, color `var(--color-muted-dim)`
- `.tabActive`: color `var(--color-ink)`, border-bottom `var(--color-gold)`

**All tab CSS modules** (Abilities, Combat, Spells, Equipment, Biography, Features)
- Section group headers: Cinzel, uppercase, `var(--color-muted)`, border-bottom `var(--color-border)`
- Body/description text areas: `font-family: var(--font-body)` (Crimson Text)
- Tables: border-color `var(--color-border)`

---

## 8. Print View Exception (`src/pages/Print/PrintView.module.css`)

Print view retains the **light parchment theme** — dark backgrounds waste printer ink and look poor on paper. Add a scoped override at the top of the file:

```css
.page {
  --color-parchment: #f5f0e8;
  --color-parchment-dark: #e8e0d0;
  --color-ink: #2c1810;
  --color-ink-light: #5c3d2e;
  --color-accent: #8b1a1a;
  --color-gold: #c8a951;
  --color-surface: #ffffff;
  --color-surface-raised: #faf7f2;
  --color-bg-alt: #faf7f2;
  --color-border: #c4b89a;
  --color-border-light: #ddd5c0;
  --color-muted: #8a7a6a;
}
```

This scopes the old light-theme values to the `.page` container so print output is unaffected. `--color-bg-alt` is also included here since it needs the light value in print context.

---

## 9. Files Changed

### New/modified files

| File | Change |
|---|---|
| `index.html` | Add Google Fonts `<link>` |
| `src/styles/tokens.css` | All color values + font tokens |
| `src/styles/typography.css` | letter-spacing on headings, subtitle italic, label 10px |
| `src/styles/reset.css` | body bg/color, input styles, focus ring gold |
| `src/pages/Sheet/SummaryBar.jsx` | Two-row structure (topRow + statsRow) |
| `src/pages/Sheet/SummaryBar.module.css` | Full rewrite for two-row layout |
| `src/pages/Sheet/Sheet.module.css` | Tab styles (Cinzel, gold active) |
| `src/pages/Roster/Roster.module.css` | Dark background, header styles |
| `src/pages/Roster/CharacterCard.module.css` | Gold-border portrait, Cinzel name, gradient XP bar |
| `src/pages/Wizard/Wizard.jsx` | Numbered step indicator with connecting lines |
| `src/pages/Wizard/Wizard.module.css` | stepDot/stepLine/stepLabel styles |
| `src/pages/Wizard/WizardStep.module.css` | Dark background, gold buttons |
| `src/pages/Homebrew/HomebrewPage.module.css` | Dark background |
| `src/pages/Homebrew/ClassBuilder.module.css` | Uses `--color-bg-alt`; dark form/item backgrounds |
| `src/pages/Homebrew/RaceBuilder.module.css` | Uses `--color-bg-alt`; dark form/item backgrounds |
| `src/pages/Sheet/modals/LevelUpModal.module.css` | Uses `--color-bg-alt`; dark step indicator backgrounds |
| `src/pages/Sheet/tabs/CustomSpellForm.module.css` | Uses `--color-bg-alt`; dark form background |
| `src/pages/Print/PrintView.module.css` | Scoped light-theme override on `.page` |
| `src/pages/Sheet/tabs/AbilitiesTab.module.css` | Dark cards, gold proficiency dots |
| `src/pages/Sheet/tabs/CombatTab.module.css` | Dark tables, condition styles |
| `src/pages/Sheet/tabs/SpellsTab.module.css` | Prepared/unprepared badge fix |
| `src/pages/Sheet/tabs/EquipmentTab.module.css` | Dark tables |
| `src/pages/Sheet/tabs/BiographyTab.module.css` | Crimson Text for textareas |
| `src/pages/Sheet/tabs/FeaturesTab.module.css` | Group headers, Crimson Text body |
| `src/components/StatBlock/StatBlock.module.css` | Dark bg, gold modifier |
| `src/components/SkillRow/SkillRow.module.css` | Gold proficiency dots, Crimson Text |
| `src/components/SpellCard/SpellCard.module.css` | Prepared state, readability fixes |
| `src/components/FeatureCard/FeatureCard.module.css` | Crimson Text body |
| `src/components/Badge/Badge.module.css` | Dark variants |
| `src/components/Modal/Modal.module.css` | Dark header, body |
| `src/components/PipTracker/PipTracker.module.css` | Gold filled pips |
| `src/components/ConditionToggle/ConditionToggle.module.css` | Readability fix on inactive |
| `src/components/DiceRoller/DiceRoller.module.css` | Gold button |
| `src/components/CurrencyRow/CurrencyRow.module.css` | Dark inputs |

### JSX files changed (2 only)
- `src/pages/Sheet/SummaryBar.jsx`
- `src/pages/Wizard/Wizard.jsx`

---

## 10. Testing

- All 166 existing integration and unit tests must continue to pass — no behavior changes, only CSS/structure.
- The SummaryBar JSX change restructures layout only; all existing `aria-label` attributes, interactive elements, and store interactions are preserved.
- The Wizard JSX change adds new CSS classes but preserves the `step` value and all existing logic.
- Visual regression: open the app in a browser and verify each page (Roster, Sheet/all tabs, Wizard, Homebrew, Print) renders correctly before committing.
