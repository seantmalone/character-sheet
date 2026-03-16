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
