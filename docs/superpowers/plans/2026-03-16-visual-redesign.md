# Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the D&D 5e character sheet from a light parchment/crimson theme to a dark fantasy aesthetic using Cinzel + Crimson Text typography, gold CTAs, and scoped light-theme print override — with zero behavior changes.

**Architecture:** All color and font values live in `src/styles/tokens.css` CSS custom properties; updating those values cascades to every component automatically. Two targeted JSX edits (SummaryBar two-row layout, Wizard numbered step indicator) restructure layout without touching any business logic. Print view uses a scoped CSS variable override inside `.page { }` to retain the original light parchment values.

**Tech Stack:** React 18, Vite, CSS Modules, Google Fonts (Cinzel + Crimson Text)

**Spec:** `docs/superpowers/specs/2026-03-16-visual-redesign-design.md`

---

## File Map

| File | Change type |
|---|---|
| `index.html` | Add Google Fonts `<link>` tags |
| `src/styles/tokens.css` | All color values + new font/color tokens |
| `src/styles/typography.css` | Heading letter-spacing, subtitle italic, label 10px |
| `src/styles/reset.css` | Input border → `--color-border-light`, focus ring → `--color-gold` |
| `src/pages/Sheet/SummaryBar.jsx` | Two-row layout (topRow + statsRow), inspiration moves to topRow |
| `src/pages/Sheet/SummaryBar.module.css` | Full rewrite for two-row layout |
| `src/pages/Wizard/Wizard.jsx` | Numbered step indicator with connecting lines |
| `src/pages/Wizard/Wizard.module.css` | stepDot/stepLine/stepLabel styles |
| `src/pages/Wizard/WizardStep.module.css` | Gold primary button, dark border |
| `src/pages/Sheet/Sheet.module.css` | Fix `--color-bg`/`--color-text` bugs, Cinzel tabs, gold active |
| `src/pages/Roster/Roster.module.css` | Gold newBtn (was accent) |
| `src/pages/Roster/CharacterCard.module.css` | Gold portrait border, gradient XP bar |
| `src/pages/Homebrew/HomebrewPage.module.css` | Gold back link |
| `src/pages/Homebrew/ClassBuilder.module.css` | No changes needed (uses tokens that auto-update) |
| `src/pages/Homebrew/RaceBuilder.module.css` | No changes needed (uses tokens that auto-update) |
| `src/pages/Sheet/modals/LevelUpModal.module.css` | No changes needed (uses tokens that auto-update) |
| `src/pages/Sheet/tabs/CustomSpellForm.module.css` | No changes needed (uses tokens that auto-update) |
| `src/pages/Print/PrintView.module.css` | Scoped light-theme override on `.page` |
| `src/components/StatBlock/StatBlock.module.css` | Gold modifier, font-serif score |
| `src/components/SkillRow/SkillRow.module.css` | Gold proficiency dot, Crimson Text name |
| `src/components/SpellCard/SpellCard.module.css` | Gold prepared border, muted-dim unprepared badge |
| `src/components/FeatureCard/FeatureCard.module.css` | Crimson Text body/source |
| `src/components/Badge/Badge.module.css` | Dark default/homebrew/custom variants |
| `src/components/Modal/Modal.module.css` | Dark header bg |
| `src/components/PipTracker/PipTracker.module.css` | Gold pips |
| `src/components/ConditionToggle/ConditionToggle.module.css` | muted-dim inactive text |
| `src/components/DiceRoller/DiceRoller.module.css` | Gold button |
| `src/components/CurrencyRow/CurrencyRow.module.css` | No changes needed |
| `src/pages/Sheet/tabs/AbilitiesTab.module.css` | Gold save pips |
| `src/pages/Sheet/tabs/CombatTab.module.css` | No changes needed |
| `src/pages/Sheet/tabs/SpellsTab.module.css` | Gold arcaneBtn, Crimson Text body |
| `src/pages/Sheet/tabs/EquipmentTab.module.css` | No changes needed |
| `src/pages/Sheet/tabs/BiographyTab.module.css` | Crimson Text for bioArea |
| `src/pages/Sheet/tabs/FeaturesTab.module.css` | Gold addBtn |

---

## Chunk 1: Foundation — Tokens, Fonts, Global Styles

### Task 1: Update `src/styles/tokens.css`

**Files:**
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Verify baseline — all 166 tests pass**

```bash
npx vitest run
```
Expected: 166 passed, 0 failed.

- [ ] **Step 2: Replace tokens.css with new dark fantasy values**

Full new content:

```css
:root {
  /* Colors — dark fantasy palette */
  --color-parchment: #0f0a04;
  --color-parchment-dark: #140e04;
  --color-ink: #e8c87a;
  --color-ink-light: #c8a85a;
  --color-accent: #9b1e1e;
  --color-accent-hover: #7a1515;
  --color-gold: #c8a830;
  --color-success: #2d6a2d;
  --color-warning: #c8a830;
  --color-danger: #9b1e1e;
  --color-surface: #241a07;
  --color-surface-raised: #1a1208;
  --color-border: #2e2008;
  --color-border-light: #3d2e0f;
  --color-muted: #b09050;
  --color-overlay: rgba(0, 0, 0, 0.75);

  /* New tokens */
  --color-muted-dim: #9a8050;
  --color-disabled: #7a6040;
  --color-bg-alt: #1a1208;
  --color-hp: var(--color-accent);

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* Typography */
  --font-serif: 'Cinzel', Georgia, serif;
  --font-body: 'Crimson Text', Georgia, serif;
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

  /* Summary bar height — update after measuring two-row SummaryBar */
  --summary-bar-height: 72px;
}
```

- [ ] **Step 3: Run tests to confirm nothing breaks**

```bash
npx vitest run
```
Expected: 166 passed.

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat: update color and font tokens for dark fantasy theme"
```

---

### Task 2: Add Google Fonts to `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add font preconnect and stylesheet links**

In `index.html`, add these three lines immediately after `<meta name="viewport" ...>` and before `</head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Run tests**

```bash
npx vitest run
```
Expected: 166 passed.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Cinzel and Crimson Text Google Fonts"
```

---

### Task 3: Update `src/styles/typography.css`

**Files:**
- Modify: `src/styles/typography.css`

- [ ] **Step 1: Replace with updated typography rules**

Full new content:

```css
h1 { font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: var(--weight-bold); letter-spacing: 0.04em; }
h2 { font-family: var(--font-serif); font-size: var(--text-xl); font-weight: var(--weight-bold); letter-spacing: 0.04em; }
h3 { font-family: var(--font-serif); font-size: var(--text-lg); font-weight: var(--weight-medium); letter-spacing: 0.04em; }
h4 { font-size: var(--text-md); font-weight: var(--weight-medium); letter-spacing: 0.06em; text-transform: uppercase; }
.label { font-size: 10px; font-weight: var(--weight-medium); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-muted); }
.subtitle { font-size: var(--text-sm); font-family: var(--font-body); font-style: italic; color: var(--color-muted); }
```

- [ ] **Step 2: Run tests**

```bash
npx vitest run
```
Expected: 166 passed.

- [ ] **Step 3: Commit**

```bash
git add src/styles/typography.css
git commit -m "feat: add letter-spacing to headings, italic subtitle, 10px label"
```

---

### Task 4: Update `src/styles/reset.css`

**Files:**
- Modify: `src/styles/reset.css`

- [ ] **Step 1: Replace input border and focus ring**

Full new content:

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--color-parchment); color: var(--color-ink); font-family: var(--font-sans); font-size: var(--text-base); line-height: 1.5; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; border: none; background: none; font: inherit; color: inherit; }
input, textarea, select { font: inherit; color: inherit; background: var(--color-surface); border: 1px solid var(--color-border-light); border-radius: var(--radius-sm); padding: var(--space-xs) var(--space-sm); }
input:focus, textarea:focus, select:focus { outline: 2px solid var(--color-gold); outline-offset: 1px; }
ul, ol { list-style: none; }
img { max-width: 100%; display: block; }
```

- [ ] **Step 2: Run tests**

```bash
npx vitest run
```
Expected: 166 passed.

- [ ] **Step 3: Commit**

```bash
git add src/styles/reset.css
git commit -m "feat: update input border to border-light, focus ring to gold"
```

---

## Chunk 2: SummaryBar Redesign

### Task 5: Rewrite `SummaryBar.jsx` — two-row layout

**Files:**
- Modify: `src/pages/Sheet/SummaryBar.jsx`

- [ ] **Step 1: Run existing SummaryBar integration tests to establish baseline**

```bash
npx vitest run src/tests/integration/rest-and-recovery.test.jsx src/tests/integration/combat-flow.test.jsx
```
Expected: all pass.

- [ ] **Step 2: Replace the JSX return block with the two-row layout**

Replace everything from `return (` through the closing `</header>` and `)` with:

```jsx
  return (
    <header className={styles.bar}>
      <div className={styles.topRow}>
        <div className={styles.identity}>
          <h1 className={styles.name}>{meta.characterName}</h1>
          <p className={styles.subtitle}>
            Level {meta.level} {meta.race} {meta.class}
          </p>
        </div>
        <button
          className={[styles.inspiration, meta.inspiration ? styles.inspOn : ''].join(' ')}
          onClick={toggleInspiration}
          aria-pressed={meta.inspiration}
          title="Inspiration">
          ★
        </button>
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
      </div>
      <div className={styles.statsRow}>
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
        <div className={styles.stat}>
          <span className={styles.statValue}>{hp.hitDiceRemaining ?? hp.max}</span>
          <span className={styles.statLabel}>Hit Dice</span>
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
            <button className={styles.dsRollBtn} onClick={rollDeathSave} aria-label="Roll death save">
              Roll d20
            </button>
          </div>
        )}
      </div>
    </header>
  )
```

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```
Expected: 166 passed. All aria-labels are preserved — tests select elements by aria-label, not by layout position.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Sheet/SummaryBar.jsx
git commit -m "feat: restructure SummaryBar to two-row layout with statsRow"
```

---

### Task 6: Rewrite `SummaryBar.module.css`

**Files:**
- Modify: `src/pages/Sheet/SummaryBar.module.css`

- [ ] **Step 1: Replace with new two-row CSS**

Full new content:

```css
.bar      { position: sticky; top: 0; z-index: 100; background: var(--color-parchment); border-bottom: 1px solid var(--color-border); }
.topRow   { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-sm) var(--space-md); border-bottom: 1px solid var(--color-border); }
.statsRow { display: flex; align-items: stretch; padding: 0 var(--space-md); }

.identity { flex: 1; min-width: 0; }
.name     { font-family: var(--font-serif); font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--color-ink); letter-spacing: 0.04em; line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.subtitle { font-family: var(--font-body); font-size: var(--text-sm); font-style: italic; color: var(--color-muted); margin-top: 3px; }

.stat      { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-sm) var(--space-md); border-right: 1px solid var(--color-border); min-width: 56px; }
.statValue { font-family: var(--font-serif); font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--color-ink); line-height: 1; }
.statLabel { font-family: var(--font-serif); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-muted); margin-top: 3px; }

.hpBlock  { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-sm) var(--space-md); border-right: 1px solid var(--color-border); min-width: 90px; }
.hpRow    { display: flex; align-items: center; gap: 4px; }
.hpInput  { width: 52px; text-align: center; font-family: var(--font-serif); font-size: var(--text-lg); font-weight: var(--weight-bold); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 2px 4px; }
.hpSep    { color: var(--color-muted); }
.hpMax    { font-family: var(--font-serif); font-size: var(--text-md); color: var(--color-muted); }
.hpTemp   { font-size: var(--text-xs); color: var(--color-accent); }
.hpBar    { width: 72px; height: 3px; background: var(--color-border); border-radius: 2px; margin: 4px 0; overflow: hidden; }
.hpFill   { height: 100%; background: var(--color-accent); border-radius: 2px; transition: width var(--transition); }

.speedInput { width: 44px; text-align: center; font-family: var(--font-serif); font-size: var(--text-md); font-weight: var(--weight-bold); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 2px 4px; }

.inspiration { font-size: 20px; opacity: 0.3; transition: opacity var(--transition); background: none; border: none; cursor: pointer; padding: 0; color: var(--color-gold); }
.inspOn { opacity: 1; }

.deathSaves { display: flex; align-items: center; gap: var(--space-sm); align-self: center; padding: var(--space-sm) var(--space-md); }
.dsLabel { font-family: var(--font-serif); font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--color-danger); }
.dsRow { display: flex; align-items: center; gap: var(--space-xs); font-size: var(--text-xs); }
.dsPip { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--color-border); background: none; cursor: pointer; }
.dsSuccess { background: var(--color-success); border-color: var(--color-success); }
.dsFailure { background: var(--color-danger); border-color: var(--color-danger); }
.dsRollBtn { font-family: var(--font-serif); font-size: var(--text-xs); padding: 2px var(--space-xs); border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: var(--color-surface); cursor: pointer; }

.actions  { display: flex; align-items: center; gap: var(--space-sm); margin-left: auto; }
.restMenu select { font-family: var(--font-serif); font-size: var(--text-xs); letter-spacing: 0.05em; padding: var(--space-xs); border-radius: var(--radius-sm); border: 1px solid var(--color-border-light); background: var(--color-surface); color: var(--color-muted); }
.levelUpBtn { font-family: var(--font-serif); font-size: var(--text-xs); letter-spacing: 0.07em; padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-sm); border: 1px solid var(--color-border-light); background: transparent; color: var(--color-muted); cursor: pointer; }
.levelUpReady { background: var(--color-gold); color: var(--color-parchment); border-color: var(--color-gold); font-weight: var(--weight-bold); animation: pulse 2s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.75; } }

.gear { font-size: 18px; background: none; border: none; cursor: pointer; color: var(--color-muted); opacity: 0.7; }
.gear:hover { opacity: 1; }
.gearWrapper { position: relative; }
.settingsMenu {
  position: absolute; top: calc(100% + 4px); right: 0;
  background: var(--color-surface-raised); border: 1px solid var(--color-border);
  border-radius: var(--radius-md); box-shadow: var(--shadow-md);
  padding: var(--space-sm); display: flex; flex-direction: column; gap: var(--space-xs);
  min-width: 160px; z-index: 200;
}
.settingsMenu label { display: flex; align-items: center; gap: var(--space-xs); font-size: var(--text-sm); cursor: pointer; }
.settingsMenu button { text-align: left; font-size: var(--text-sm); padding: var(--space-xs); border-radius: var(--radius-sm); background: none; border: none; cursor: pointer; }
.settingsMenu button:hover { background: var(--color-bg-alt); }
```

- [ ] **Step 2: Run tests**

```bash
npx vitest run
```
Expected: 166 passed.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Sheet/SummaryBar.module.css
git commit -m "feat: rewrite SummaryBar CSS for two-row dark fantasy layout"
```

---

## Chunk 3: Wizard Redesign

### Task 7: Update `Wizard.jsx` — numbered step indicator

**Files:**
- Modify: `src/pages/Wizard/Wizard.jsx`

- [ ] **Step 1: Add React import and replace the nav block**

At the top of the file, add `React` to the import if not already present. Replace the `<nav>` block (lines 19–26) with:

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

Also add `import React from 'react'` at the very top of the file (line 1), since `React.Fragment` requires it.

The full updated `Wizard.jsx`:

```jsx
import React from 'react'
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

- [ ] **Step 2: Run tests**

```bash
npx vitest run
```
Expected: 166 passed. The wizard step tests use `getByRole('navigation', { name: 'Creation steps' })` and `getByText` for step labels — both are preserved.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Wizard/Wizard.jsx
git commit -m "feat: replace Wizard progress dots with numbered step indicator"
```

---

### Task 8: Update `Wizard.module.css` and `WizardStep.module.css`

**Files:**
- Modify: `src/pages/Wizard/Wizard.module.css`
- Modify: `src/pages/Wizard/WizardStep.module.css`

- [ ] **Step 1: Replace Wizard.module.css**

Full new content:

```css
.wizard   { max-width: 640px; margin: 0 auto; padding: var(--space-xl) var(--space-md); display: flex; flex-direction: column; gap: var(--space-xl); }
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

- [ ] **Step 2: Replace WizardStep.module.css**

Full new content:

```css
.step { display: flex; flex-direction: column; gap: var(--space-lg); }
.title { font-family: var(--font-serif); font-size: var(--text-xl); letter-spacing: 0.04em; }
.body { display: flex; flex-direction: column; gap: var(--space-md); }
.nav { display: flex; justify-content: space-between; gap: var(--space-md); padding-top: var(--space-lg); border-top: 1px solid var(--color-border); }
.back { color: var(--color-muted); }
.next { background: var(--color-gold); color: var(--color-parchment); padding: var(--space-xs) var(--space-xl); border-radius: var(--radius-sm); font-family: var(--font-serif); font-size: var(--text-xs); letter-spacing: 0.07em; font-weight: var(--weight-bold); margin-left: auto; }
.next:hover:not(:disabled) { background: var(--color-accent); }
.next:disabled { opacity: 0.4; cursor: not-allowed; }
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run
```
Expected: 166 passed.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Wizard/Wizard.module.css src/pages/Wizard/WizardStep.module.css
git commit -m "feat: update Wizard CSS for numbered steps and gold nav buttons"
```

---

## Chunk 4: Component CSS Modules

### Task 9: StatBlock, SkillRow, SpellCard, FeatureCard

**Files:**
- Modify: `src/components/StatBlock/StatBlock.module.css`
- Modify: `src/components/SkillRow/SkillRow.module.css`
- Modify: `src/components/SpellCard/SpellCard.module.css`
- Modify: `src/components/FeatureCard/FeatureCard.module.css`

- [ ] **Step 1: Replace StatBlock.module.css**

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
.score { font-family: var(--font-serif); font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--color-ink); line-height: 1; }
.modifier {
  font-family: var(--font-serif);
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
  color: var(--color-gold);
  background: var(--color-parchment);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 1px 6px;
}
.extra { font-size: var(--text-xs); margin-top: var(--space-xs); }
```

- [ ] **Step 2: Replace SkillRow.module.css**

```css
.row {
  display: flex; align-items: center; gap: var(--space-xs);
  padding: 3px var(--space-xs);
  border-radius: var(--radius-sm);
  transition: background var(--transition);
}
.row:hover { background: var(--color-surface-raised); }
.row.proficient { font-weight: var(--weight-medium); }
.dot {
  width: 12px; height: 12px; border-radius: 50%;
  border: 2px solid var(--color-border-light);
  background: transparent; flex-shrink: 0;
  transition: all var(--transition);
}
.dot.filled { background: var(--color-gold); border-color: var(--color-gold); }
.dot.expert { border-style: dashed; }
.dot.expert.filled { background: var(--color-gold); border-color: var(--color-gold); }
.bonus { font-family: var(--font-serif); font-weight: var(--weight-bold); min-width: 2.5ch; text-align: right; font-size: var(--text-sm); color: var(--color-ink); }
.name { flex: 1; font-family: var(--font-body); font-size: var(--text-sm); color: var(--color-ink-light); }
.ability { font-size: var(--text-xs); color: var(--color-muted); }
```

- [ ] **Step 3: Replace SpellCard.module.css**

```css
.card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-raised);
  overflow: hidden;
  transition: border-color var(--transition);
}
.card.prepared { border-left: 3px solid var(--color-gold); }
.header {
  display: flex; align-items: center; gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  cursor: pointer;
  background: var(--color-surface-raised);
}
.header:hover { background: var(--color-surface); }
.meta { display: flex; gap: var(--space-xs); flex-direction: column; min-width: 80px; }
.level { font-family: var(--font-serif); font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.05em; }
.school { font-family: var(--font-body); font-size: var(--text-xs); color: var(--color-muted); font-style: italic; }
.name { font-family: var(--font-serif); flex: 1; font-weight: var(--weight-medium); color: var(--color-ink); }
.actions { display: flex; align-items: center; gap: var(--space-sm); }
.prepBtn { font-family: var(--font-serif); font-size: var(--text-xs); letter-spacing: 0.05em; padding: 3px var(--space-xs); border: 1px solid var(--color-border-light); border-radius: 10px; color: var(--color-muted-dim); background: transparent; cursor: pointer; white-space: nowrap; }
.prepBtnActive { background: var(--color-gold); color: var(--color-parchment); border-color: var(--color-gold); font-weight: var(--weight-bold); }
.chevron { font-size: var(--text-xs); color: var(--color-muted); }
.body { padding: var(--space-md); }
.stats { display: flex; flex-wrap: wrap; gap: var(--space-sm) var(--space-lg); font-family: var(--font-body); font-size: var(--text-sm); margin-bottom: var(--space-sm); color: var(--color-muted); font-style: italic; }
.desc { font-family: var(--font-body); font-size: var(--text-base); line-height: 1.6; color: var(--color-ink-light); }
```

- [ ] **Step 4: Replace FeatureCard.module.css**

```css
.card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-raised);
  overflow: hidden;
}
.header {
  display: flex; align-items: center;
  background: var(--color-surface-raised);
}
.header:hover { background: var(--color-surface); }
.headerMain {
  display: flex; align-items: center; justify-content: space-between;
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  cursor: pointer;
}
.name { font-family: var(--font-serif); font-weight: var(--weight-medium); color: var(--color-ink); letter-spacing: 0.05em; }
.meta { display: flex; align-items: center; gap: var(--space-md); }
.chevron { font-size: var(--text-xs); color: var(--color-muted); }
.deleteBtn {
  background: none; border: none; cursor: pointer;
  color: var(--color-muted); font-size: var(--text-md); line-height: 1;
  padding: var(--space-sm); flex-shrink: 0;
}
.deleteBtn:hover { color: var(--color-accent); }
.desc {
  padding: var(--space-md);
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--color-ink-light);
  border-top: 1px solid var(--color-border);
}
```

- [ ] **Step 5: Run tests**

```bash
npx vitest run
```
Expected: 166 passed.

- [ ] **Step 6: Commit**

```bash
git add src/components/StatBlock/StatBlock.module.css src/components/SkillRow/SkillRow.module.css src/components/SpellCard/SpellCard.module.css src/components/FeatureCard/FeatureCard.module.css
git commit -m "feat: update StatBlock, SkillRow, SpellCard, FeatureCard for dark theme"
```

---

### Task 10: Badge, Modal, PipTracker, ConditionToggle, DiceRoller

**Files:**
- Modify: `src/components/Badge/Badge.module.css`
- Modify: `src/components/Modal/Modal.module.css`
- Modify: `src/components/PipTracker/PipTracker.module.css`
- Modify: `src/components/ConditionToggle/ConditionToggle.module.css`
- Modify: `src/components/DiceRoller/DiceRoller.module.css`

- [ ] **Step 1: Replace Badge.module.css**

```css
.badge {
  display: inline-block;
  padding: 1px var(--space-xs);
  border-radius: 10px;
  font-family: var(--font-serif);
  font-size: 9px;
  letter-spacing: 0.06em;
}
.default { background: var(--color-surface-raised); border: 1px solid var(--color-border-light); color: var(--color-muted); }
.homebrew { background: rgba(200,168,48,0.15); border: 1px solid rgba(200,168,48,0.4); color: var(--color-gold); }
.custom { background: var(--color-surface-raised); border: 1px solid var(--color-border-light); color: var(--color-muted); }
```

- [ ] **Step 2: Replace Modal.module.css**

```css
.backdrop {
  position: fixed; inset: 0;
  background: var(--color-overlay);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
}
.modal {
  background: var(--color-surface-raised);
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
  border-bottom: 1px solid var(--color-border);
  background: var(--color-parchment);
}
.title { font-family: var(--font-serif); color: var(--color-ink); letter-spacing: 0.04em; }
.close {
  font-size: var(--text-lg); color: var(--color-muted);
  transition: color var(--transition);
}
.close:hover { color: var(--color-ink); }
.body { padding: var(--space-lg); font-family: var(--font-body); font-size: var(--text-base); line-height: 1.6; color: var(--color-ink-light); }
```

- [ ] **Step 3: Replace PipTracker.module.css**

```css
.tracker { display: flex; align-items: center; gap: var(--space-sm); }
.pips { display: flex; gap: 4px; flex-wrap: wrap; }
.pip {
  width: 16px; height: 16px;
  border-radius: 50%;
  border: 2px solid var(--color-border-light);
  background: transparent;
  transition: background var(--transition);
  cursor: pointer;
}
.pip.filled { background: var(--color-gold); border-color: var(--color-gold); }
.pip:hover { opacity: 0.7; }
```

- [ ] **Step 4: Replace ConditionToggle.module.css**

```css
.pill {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  background: transparent;
  font-family: var(--font-serif);
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted-dim);
  transition: all var(--transition);
  cursor: pointer;
}
.pill.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #f0d8d8;
}
.name { font-weight: var(--weight-medium); }
.stepper { display: flex; align-items: center; gap: 4px; }
.stepper button { width: 20px; height: 20px; border-radius: 50%; border: 1px solid currentColor; font-size: var(--text-sm); display: flex; align-items: center; justify-content: center; }
```

- [ ] **Step 5: Replace DiceRoller.module.css**

```css
.roller { display: inline-flex; align-items: center; gap: var(--space-sm); }
.btn {
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-gold);
  color: var(--color-parchment);
  border-radius: var(--radius-sm);
  font-family: var(--font-serif);
  font-size: var(--text-xs);
  letter-spacing: 0.07em;
  font-weight: var(--weight-bold);
  transition: background var(--transition);
}
.btn:hover { background: var(--color-accent); }
.result { font-family: var(--font-serif); font-weight: var(--weight-bold); min-width: 2ch; text-align: center; color: var(--color-ink); }
.error { color: var(--color-danger); font-size: var(--text-sm); }
```

- [ ] **Step 6: Run tests**

```bash
npx vitest run
```
Expected: 166 passed.

- [ ] **Step 7: Commit**

```bash
git add src/components/Badge/Badge.module.css src/components/Modal/Modal.module.css src/components/PipTracker/PipTracker.module.css src/components/ConditionToggle/ConditionToggle.module.css src/components/DiceRoller/DiceRoller.module.css
git commit -m "feat: update Badge, Modal, PipTracker, ConditionToggle, DiceRoller CSS"
```

---

## Chunk 5: Page and Tab CSS Modules

### Task 11: Sheet, Roster, CharacterCard, Homebrew pages

**Files:**
- Modify: `src/pages/Sheet/Sheet.module.css`
- Modify: `src/pages/Roster/Roster.module.css`
- Modify: `src/pages/Roster/CharacterCard.module.css`
- Modify: `src/pages/Homebrew/HomebrewPage.module.css`

- [ ] **Step 1: Replace Sheet.module.css**

Note: The existing file uses `var(--color-bg)` and `var(--color-text)` which are undefined tokens. These are fixed here.

```css
.page { min-height: 100vh; background: var(--color-parchment); }
.body { max-width: 960px; margin: 0 auto; padding: var(--space-md); }
.tabs { display: flex; gap: 0; border-bottom: 2px solid var(--color-border); margin-bottom: var(--space-lg); }
.tab {
  padding: var(--space-sm) var(--space-md);
  background: none; border: none; border-bottom: 2px solid transparent;
  margin-bottom: -2px; cursor: pointer;
  font-family: var(--font-serif); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--color-muted-dim); transition: color var(--transition);
}
.tab:hover { color: var(--color-ink); }
.tabActive { color: var(--color-ink); border-bottom-color: var(--color-gold); font-weight: var(--weight-medium); }
.tabContent { padding: var(--space-md) 0; }
```

- [ ] **Step 2: Replace Roster.module.css**

```css
.page { max-width: 900px; margin: 0 auto; padding: var(--space-2xl) var(--space-md); }
.header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: var(--space-xl);
  flex-wrap: wrap; gap: var(--space-md);
}
.headerActions { display: flex; align-items: center; gap: var(--space-md); }
.toggle { display: flex; align-items: center; gap: var(--space-xs); font-size: var(--text-sm); cursor: pointer; }
.newBtn { background: var(--color-gold); color: var(--color-parchment); padding: var(--space-xs) var(--space-md); border-radius: var(--radius-sm); font-family: var(--font-serif); font-size: var(--text-xs); letter-spacing: 0.07em; font-weight: var(--weight-bold); }
.newBtn:hover { background: var(--color-accent); }
.empty { text-align: center; padding: var(--space-2xl); display: flex; flex-direction: column; align-items: center; gap: var(--space-md); color: var(--color-muted); }
.grid { display: flex; flex-direction: column; gap: var(--space-md); }
.homebrew { margin-top: var(--space-lg); padding-top: var(--space-lg); border-top: 1px solid var(--color-border); }
```

- [ ] **Step 3: Replace CharacterCard.module.css**

```css
.card {
  display: flex; align-items: center; gap: var(--space-md);
  padding: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface-raised);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition);
}
.card:hover { box-shadow: var(--shadow-md); }
.portrait {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--color-border);
  border: 2px solid var(--color-gold);
  color: var(--color-ink);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--text-xl);
  font-family: var(--font-serif);
  font-weight: var(--weight-bold);
  flex-shrink: 0;
}
.info { flex: 1; min-width: 0; }
.name { font-family: var(--font-serif); font-size: var(--text-md); color: var(--color-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.details { font-family: var(--font-body); font-size: var(--text-sm); font-style: italic; color: var(--color-muted); text-transform: capitalize; }
.player { font-size: var(--text-xs); color: var(--color-muted); }
.actions { display: flex; align-items: center; gap: var(--space-sm); flex-wrap: wrap; justify-content: flex-end; }
.primary { background: var(--color-gold); color: var(--color-parchment); padding: var(--space-xs) var(--space-md); border-radius: var(--radius-sm); font-family: var(--font-serif); font-size: var(--text-xs); letter-spacing: 0.05em; font-weight: var(--weight-bold); }
.primary:hover { background: var(--color-accent); }
.danger { color: var(--color-danger); }
.confirmText { font-size: var(--text-sm); color: var(--color-danger); }
.xpBar { height: 3px; background: var(--color-border); border-radius: 2px; margin-top: var(--space-xs); overflow: hidden; }
.xpFill { height: 100%; background: linear-gradient(90deg, var(--color-gold), var(--color-ink)); border-radius: 2px; transition: width 0.3s ease; }
.xpLabel { font-size: var(--text-xs); color: var(--color-muted); margin-top: 2px; }
```

- [ ] **Step 4: Replace HomebrewPage.module.css**

```css
.page { max-width: 960px; margin: 0 auto; padding: var(--space-2xl) var(--space-md); }
.header { margin-bottom: var(--space-xl); }
.back { color: var(--color-gold); background: none; border: none; cursor: pointer; font-family: var(--font-serif); font-size: var(--text-xs); letter-spacing: 0.07em; margin-bottom: var(--space-sm); }
.subtitle { font-family: var(--font-body); font-style: italic; color: var(--color-muted); font-size: var(--text-sm); }
.builders { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2xl); }
@media (max-width: 640px) { .builders { grid-template-columns: 1fr; } }
```

- [ ] **Step 5: Run tests**

```bash
npx vitest run
```
Expected: 166 passed.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Sheet/Sheet.module.css src/pages/Roster/Roster.module.css src/pages/Roster/CharacterCard.module.css src/pages/Homebrew/HomebrewPage.module.css
git commit -m "feat: update Sheet, Roster, CharacterCard, and Homebrew page CSS"
```

---

### Task 12: Tab CSS modules and Print override

**Files:**
- Modify: `src/pages/Sheet/tabs/AbilitiesTab.module.css`
- Modify: `src/pages/Sheet/tabs/SpellsTab.module.css`
- Modify: `src/pages/Sheet/tabs/BiographyTab.module.css`
- Modify: `src/pages/Sheet/tabs/FeaturesTab.module.css`
- Modify: `src/pages/Print/PrintView.module.css`

- [ ] **Step 1: Update AbilitiesTab.module.css — gold save pips**

Change only the two save button rules (lines with `.saveOn` and `.saveOff`):

```css
.saveOn { background: var(--color-gold); color: var(--color-parchment); border-radius: var(--radius-sm); padding: 1px var(--space-xs); font-size: var(--text-xs); border: none; cursor: pointer; font-family: var(--font-serif); letter-spacing: 0.05em; }
.saveOff { background: none; color: var(--color-muted-dim); border-radius: var(--radius-sm); padding: 1px var(--space-xs); font-size: var(--text-xs); border: 1px solid var(--color-border-light); cursor: pointer; }
```

Full new file:

```css
.tab { display: flex; flex-direction: column; gap: var(--space-xl); }
.section { display: flex; flex-direction: column; gap: var(--space-md); }
.sectionTitle { font-family: var(--font-serif); font-size: var(--text-md); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-xs); color: var(--color-ink); letter-spacing: 0.04em; }
.abilityGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: var(--space-md); }
.profBonus { font-size: var(--text-sm); }
.scoreMethod { font-size: var(--text-xs); color: var(--color-muted); text-transform: capitalize; }
.skillList { display: flex; flex-direction: column; gap: 2px; }
.passiveList { display: flex; flex-direction: column; gap: var(--space-xs); }
.passive { display: flex; justify-content: space-between; align-items: center; padding: var(--space-xs) 0; border-bottom: 1px solid var(--color-border); }
.passiveName { font-size: var(--text-sm); }
.passiveValue { font-weight: var(--weight-bold); }
.profTag { font-size: var(--text-sm); }
.saveOn { background: var(--color-gold); color: var(--color-parchment); border-radius: var(--radius-sm); padding: 1px var(--space-xs); font-size: var(--text-xs); border: none; cursor: pointer; font-family: var(--font-serif); letter-spacing: 0.05em; }
.saveOff { background: none; color: var(--color-muted-dim); border-radius: var(--radius-sm); padding: 1px var(--space-xs); font-size: var(--text-xs); border: 1px solid var(--color-border-light); cursor: pointer; }
```

- [ ] **Step 2: Update SpellsTab.module.css — gold arcaneBtn, Crimson Text desc**

Full new file (change `.arcaneBtn` color to gold, add Crimson Text to `.desc`):

```css
.tab { display: flex; flex-direction: column; gap: var(--space-xl); }
.section { display: flex; flex-direction: column; gap: var(--space-md); }
.sectionTitle { font-family: var(--font-serif); font-size: var(--text-md); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-xs); color: var(--color-ink); letter-spacing: 0.04em; }
.spellStats { display: flex; gap: var(--space-xl); }
.spellStat { display: flex; flex-direction: column; align-items: center; }
.statVal { font-family: var(--font-serif); font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--color-ink); }
.statLabel { font-size: var(--text-xs); color: var(--color-muted); text-transform: uppercase; }
.slotGrid { display: flex; flex-direction: column; gap: var(--space-sm); }
.slotRow { display: flex; align-items: center; gap: var(--space-md); }
.slotLevel { font-family: var(--font-serif); font-size: var(--text-sm); min-width: 90px; color: var(--color-muted); }
.arcaneBtn { align-self: flex-start; font-family: var(--font-serif); font-size: var(--text-xs); letter-spacing: 0.07em; padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-sm); border: 1px solid var(--color-gold); color: var(--color-gold); background: none; cursor: pointer; }
.arcaneBtn:disabled { opacity: 0.5; cursor: default; }
.filters { display: flex; gap: var(--space-sm); flex-wrap: wrap; }
.filters input, .filters select { flex: 1; min-width: 120px; padding: var(--space-xs); border: 1px solid var(--color-border-light); border-radius: var(--radius-sm); background: var(--color-surface); font-size: var(--text-sm); }
.spellList { display: flex; flex-direction: column; gap: var(--space-xs); }
.spellCardWrapper { position: relative; display: flex; align-items: flex-start; gap: var(--space-xs); }
.spellCardWrapper > :first-child { flex: 1; }
.deleteSpellBtn { flex-shrink: 0; background: none; border: none; color: var(--color-muted); cursor: pointer; font-size: var(--text-lg); line-height: 1; padding: var(--space-xs); border-radius: var(--radius-sm); }
.deleteSpellBtn:hover { color: var(--color-danger); }
.empty { color: var(--color-muted); font-family: var(--font-body); font-style: italic; font-size: var(--text-sm); text-align: center; padding: var(--space-lg); }
.addBtn { align-self: flex-start; font-family: var(--font-serif); font-size: var(--text-xs); letter-spacing: 0.07em; color: var(--color-gold); background: none; border: none; cursor: pointer; }
```

- [ ] **Step 3: Update BiographyTab.module.css — Crimson Text for bioArea**

Full new file:

```css
.tab { display: flex; flex-direction: column; gap: var(--space-xl); }
.section { display: flex; flex-direction: column; gap: var(--space-sm); }
.sectionTitle { font-family: var(--font-serif); font-size: var(--text-md); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-xs); color: var(--color-ink); letter-spacing: 0.04em; }
.physGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--space-sm); }
.physField { display: flex; flex-direction: column; gap: 2px; font-size: var(--text-sm); }
.bioLabel { display: flex; flex-direction: column; gap: var(--space-xs); }
.bioArea { width: 100%; resize: vertical; font-family: var(--font-body); font-size: var(--text-base); line-height: 1.6; padding: var(--space-xs); border: 1px solid var(--color-border-light); border-radius: var(--radius-sm); background: var(--color-surface); color: var(--color-ink-light); }
```

- [ ] **Step 4: Update FeaturesTab.module.css — gold addBtn**

Full new file:

```css
.tab { display: flex; flex-direction: column; gap: var(--space-lg); }
.group { display: flex; flex-direction: column; gap: var(--space-sm); }
.groupTitle { font-family: var(--font-serif); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-muted); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-xs); }
.list { display: flex; flex-direction: column; gap: var(--space-sm); }
.empty { color: var(--color-muted); font-family: var(--font-body); font-style: italic; font-size: var(--text-sm); }
.addBtn { align-self: flex-start; color: var(--color-gold); background: none; border: none; cursor: pointer; font-family: var(--font-serif); font-size: var(--text-xs); letter-spacing: 0.07em; }
.form { display: flex; flex-direction: column; gap: var(--space-sm); padding: var(--space-md); background: var(--color-bg-alt); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.form label { display: flex; flex-direction: column; gap: 2px; font-size: var(--text-sm); }
.formActions { display: flex; justify-content: flex-end; gap: var(--space-sm); }
.primary { background: var(--color-gold); color: var(--color-parchment); padding: var(--space-xs) var(--space-md); border-radius: var(--radius-sm); font-family: var(--font-serif); font-size: var(--text-xs); letter-spacing: 0.07em; font-weight: var(--weight-bold); }
```

- [ ] **Step 5: Add print override to the top of PrintView.module.css**

Prepend this block at the very beginning of `src/pages/Print/PrintView.module.css` (before `.page { max-width: ...}`):

```css
/* Scoped light-theme override — print must not use dark backgrounds */
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

**Important:** The existing `.page { max-width: 800px; ... }` rule stays — the override above it is a *separate* `.page` rule block. CSS will merge both `.page` blocks, with the variable overrides taking effect for all descendants.

- [ ] **Step 6: Run all tests**

```bash
npx vitest run
```
Expected: 166 passed.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Sheet/tabs/AbilitiesTab.module.css src/pages/Sheet/tabs/SpellsTab.module.css src/pages/Sheet/tabs/BiographyTab.module.css src/pages/Sheet/tabs/FeaturesTab.module.css src/pages/Print/PrintView.module.css
git commit -m "feat: update tab CSS modules and add print view light-theme override"
```

---

### Task 13: Visual QA

**Files:** None (verification only)

- [ ] **Step 1: Run full test suite one final time**

```bash
npx vitest run
```
Expected: 166 passed, 0 failed.

- [ ] **Step 2: Start dev server and verify each page**

```bash
npm run dev
```

Open `http://localhost:5173` and check:

| Page | What to verify |
|---|---|
| Roster | Dark bg, gold portrait border, gold "New Character" button, gradient XP bar |
| Character Wizard | Numbered step dots (1–6) with connecting lines, gold "Next" button |
| Sheet / Abilities tab | Gold proficiency dots, dark StatBlock cards with gold modifier |
| Sheet / Combat tab | Condition pills: inactive is muted-gold text, active is crimson |
| Sheet / Spells tab | Prepared border is gold left-stripe, unprepared badge is muted, slot pips are gold |
| Sheet / Equipment tab | Dark table borders |
| Sheet / Biography tab | Crimson Text in bio textareas |
| Sheet / Features tab | Gold "Add feature" link, Crimson Text feature descriptions |
| SummaryBar | Two rows: name/inspiration/actions on top, HP/AC/Init/Speed/HitDice on bottom |
| Print view | Opens with **light** parchment background (override working) |
| Homebrew | Dark background, gold back link |

- [ ] **Step 3: Commit if any minor fixes were needed during QA**

```bash
git add -p   # stage only intentional fixes
git commit -m "fix: visual QA corrections after dark theme implementation"
```

---

## Summary

| Chunk | Tasks | Commits |
|---|---|---|
| 1: Foundation | 4 | 4 |
| 2: SummaryBar | 2 | 2 |
| 3: Wizard | 2 | 2 |
| 4: Components | 2 | 2 |
| 5: Pages/Tabs | 3 | 3 |
| **Total** | **13** | **13** |
