import styles from './ConditionToggle.module.css'

export default function ConditionToggle({ condition, active, value, onChange }) {
  const isExhaustion = condition.id === 'exhaustion'

  if (isExhaustion) {
    return (
      <div className={`${styles.pill} ${value > 0 ? styles.active : ''}`}>
        <span className={styles.name}>{condition.name}</span>
        <div className={styles.stepper}>
          <button onClick={() => onChange(Math.max(0, value - 1))} aria-label="Decrease exhaustion">−</button>
          <span>{value}</span>
          <button onClick={() => onChange(Math.min(6, value + 1))} aria-label="Increase exhaustion">+</button>
        </div>
      </div>
    )
  }

  return (
    <button
      className={`${styles.pill} ${active ? styles.active : ''}`}
      onClick={() => onChange(!active)}
      aria-pressed={active}
      title={condition.description}
    >
      {condition.name}
    </button>
  )
}
