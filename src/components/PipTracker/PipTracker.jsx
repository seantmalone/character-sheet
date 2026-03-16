import styles from './PipTracker.module.css'

export default function PipTracker({ total, used, onChange, label }) {
  return (
    <div className={styles.tracker}>
      {label && <span className="label">{label}</span>}
      <div className={styles.pips}>
        {Array.from({ length: total }, (_, i) => {
          const filled = i < used
          return (
            <button
              key={i}
              role="button"
              aria-pressed={filled}
              className={`${styles.pip} ${filled ? styles.filled : ''}`}
              onClick={() => onChange(filled ? i : i + 1)}
              aria-label={`${label ?? 'pip'} ${i + 1}`}
            />
          )
        })}
      </div>
    </div>
  )
}
