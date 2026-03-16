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
