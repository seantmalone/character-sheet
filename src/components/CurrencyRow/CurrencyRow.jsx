import styles from './CurrencyRow.module.css'

const COINS = [
  { key: 'cp', label: 'CP' },
  { key: 'sp', label: 'SP' },
  { key: 'ep', label: 'EP', advancedOnly: true },
  { key: 'gp', label: 'GP' },
  { key: 'pp', label: 'PP' },
]

export default function CurrencyRow({ currency, onChange, advancedMode }) {
  const visibleCoins = COINS.filter(c => !c.advancedOnly || advancedMode)
  return (
    <div className={styles.row}>
      {visibleCoins.map(({ key, label }) => (
        <label key={key} className={styles.coin}>
          <span className="label">{label}</span>
          <input
            type="number" min="0"
            value={currency[key]}
            onChange={e => onChange({ ...currency, [key]: Math.max(0, parseInt(e.target.value) || 0) })}
            className={styles.input}
          />
        </label>
      ))}
    </div>
  )
}
