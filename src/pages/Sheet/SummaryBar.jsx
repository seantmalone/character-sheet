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
    const current = deathSaves[type]
    const next = current > idx ? idx : idx + 1
    updateCharacter(character.id, { deathSaves: { ...deathSaves, [type]: Math.min(3, next) } })
  }

  function rollDeathSave() {
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
