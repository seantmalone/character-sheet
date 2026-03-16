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
