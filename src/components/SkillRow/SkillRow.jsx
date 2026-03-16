import styles from './SkillRow.module.css'

export default function SkillRow({ skill, bonus, proficient, expert, onProfToggle, onExpertToggle, readonly }) {
  const bonusStr = bonus >= 0 ? `+${bonus}` : `${bonus}`
  return (
    <div className={`${styles.row} ${proficient ? styles.proficient : ''}`}>
      <button
        className={`${styles.dot} ${proficient ? styles.filled : ''}`}
        onClick={() => !readonly && onProfToggle?.()}
        aria-label={`${proficient ? 'Remove' : 'Add'} proficiency in ${skill.name}`}
        aria-pressed={proficient}
        disabled={readonly}
      />
      {onExpertToggle != null && (
        <button
          className={`${styles.dot} ${styles.expert} ${expert ? styles.filled : ''}`}
          onClick={() => !readonly && onExpertToggle?.()}
          aria-label={`${expert ? 'Remove' : 'Add'} expertise in ${skill.name}`}
          aria-pressed={expert}
          disabled={readonly}
        />
      )}
      <span className={styles.bonus}>{bonusStr}</span>
      <span className={styles.name}>{skill.name}</span>
      <span className={styles.ability}>({skill.ability.toUpperCase()})</span>
    </div>
  )
}
