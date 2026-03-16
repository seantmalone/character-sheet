import { useState, useMemo } from 'react'
import { useCharacterStore } from '../../../store/characters'
import { useDerivedStats } from '../../../hooks/useDerivedStats'
import { generateId } from '../../../utils/ids'
import { rollDice } from '../../../utils/diceRoller'
import Modal from '../../../components/Modal/Modal'
import classesData from '../../../data/classes.json'
import spellsData from '../../../data/spells.json'
import styles from './LevelUpModal.module.css'

const ABILITIES = ['str','dex','con','int','wis','cha']
const AB_LABEL = { str:'STR', dex:'DEX', con:'CON', int:'INT', wis:'WIS', cha:'CHA' }

export default function LevelUpModal({ character, onClose }) {
  const { updateCharacter } = useCharacterStore()
  const derived = useDerivedStats(character)
  const [step, setStep] = useState(1)
  const [hpGain, setHpGain] = useState(null)
  const [spellChoices, setSpellChoices] = useState([])
  const [asiType, setAsiType] = useState('double')
  const [asiAbility, setAsiAbility] = useState('')
  const [asiA1, setAsiA1] = useState('')
  const [asiA2, setAsiA2] = useState('')

  const newLevel = character.meta.level + 1
  const classData = classesData.find(c => c.id === character.meta.class) || {}
  const hitDie = classData.hitDie || 6
  const conMod = derived.abilityModifiers.con ?? 0
  const isSpellcaster = character.spells.ability !== null
  const isWizard = character.meta.class === 'wizard'
  const hasAsi = (classData.asiLevels || []).includes(newLevel)
  const newSlotProg = classData.spellSlotProgression?.[String(newLevel)] || null
  const newFeatures = (classData.features || []).filter(f => f.level === newLevel)

  const learnableSpells = useMemo(() => {
    if (!isWizard) return []
    const progressionEntries = newSlotProg
      ? Object.entries(newSlotProg).filter(([, v]) => v > 0).map(([k]) => Number(k))
      : []
    const maxSpellLevel = progressionEntries.length > 0 ? Math.max(...progressionEntries) : 1
    return spellsData.filter(s =>
      s.classes.includes('wizard') &&
      !character.spells.known.includes(s.id) &&
      s.level >= 1 &&
      s.level <= maxSpellLevel
    )
  }, [isWizard, character.spells.known, newSlotProg])

  const clericPreparedMax = !isWizard && isSpellcaster
    ? Math.max(1, (character.abilityScores.wis ? Math.floor((character.abilityScores.wis - 10) / 2) : 0) + newLevel)
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

  const STEPS = [
    'HP Increase',
    'New Features',
    ...(isSpellcaster ? ['Spell Slots', 'Spells'] : []),
    ...(hasAsi ? ['Ability Score Improvement'] : []),
    'Confirm',
  ]
  const totalSteps = STEPS.length
  const stepLabel = STEPS[step - 1]

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

    const newSlots = { ...character.spells.slots }
    if (newSlotProg) {
      for (let i = 1; i <= 9; i++) {
        const newMax = newSlotProg[String(i)] ?? 0
        newSlots[i] = { max: newMax, used: Math.min(newSlots[i]?.used || 0, newMax) }
      }
    }

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
    <Modal open={true} title={`Level Up \u2192 Level ${newLevel}`} onClose={onClose} size="lg">
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
          {hpGain !== null && <p className={styles.preview}>+{hpGain} HP &rarr; new max: {character.hp.max + hpGain}</p>}
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
          <p><strong>{clericPreparedMax}</strong> prepared spells (WIS modifier + level {newLevel})</p>
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
              <option value="">Choose ability...</option>
              {ABILITIES.filter(a => character.abilityScores[a] < 20).map(a => (
                <option key={a} value={a}>{AB_LABEL[a]} (currently {character.abilityScores[a]})</option>
              ))}
            </select>
          )}
          {asiType === 'split' && (
            <div className={styles.splitPicker}>
              <select value={asiA1} onChange={e => setAsiA1(e.target.value)}>
                <option value="">First ability...</option>
                {ABILITIES.filter(a => character.abilityScores[a] < 20 && a !== asiA2).map(a => (
                  <option key={a} value={a}>{AB_LABEL[a]} ({character.abilityScores[a]})</option>
                ))}
              </select>
              <select value={asiA2} onChange={e => setAsiA2(e.target.value)}>
                <option value="">Second ability...</option>
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
          <p>Level {character.meta.level} &rarr; Level {newLevel}</p>
          {hpGain !== null && <p>HP Max: {character.hp.max} &rarr; {character.hp.max + hpGain}</p>}
          {hasAsi && <p>Ability Score Improvement applied</p>}
          {newFeatures.length > 0 && <p>New features: {newFeatures.map(f => f.name).join(', ')}</p>}
        </div>
      )}

      <div className={styles.nav}>
        {step > 1 && <button onClick={() => setStep(s => s - 1)}>Back</button>}
        {step < totalSteps
          ? <button disabled={!canNext} onClick={() => setStep(s => s + 1)} aria-label="Next">Next</button>
          : <button disabled={hpGain === null} onClick={applyLevelUp} aria-label="Confirm level up">Confirm Level Up</button>
        }
      </div>
    </Modal>
  )
}
