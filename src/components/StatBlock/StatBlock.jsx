import styles from './StatBlock.module.css'

export default function StatBlock({ label, score, modifier, modifierTestId, children }) {
  const modStr = modifier >= 0 ? `+${modifier}` : `${modifier}`
  return (
    <div className={styles.block}>
      <span className="label">{label}</span>
      <div className={styles.score}>{score ?? '—'}</div>
      <div className={styles.modifier} {...(modifierTestId ? { 'data-testid': modifierTestId } : {})}>{modStr}</div>
      {children && <div className={styles.extra}>{children}</div>}
    </div>
  )
}
