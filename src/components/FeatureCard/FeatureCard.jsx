import { useState } from 'react'
import PipTracker from '../PipTracker/PipTracker'
import styles from './FeatureCard.module.css'

export default function FeatureCard({ feature, onUseChange }) {
  const [expanded, setExpanded] = useState(false)
  const hasUses = feature.maxUses != null

  return (
    <div className={styles.card}>
      <div className={styles.header} onClick={() => setExpanded(v => !v)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setExpanded(v => !v)}>
        <h4 className={styles.name}>{feature.name}</h4>
        <div className={styles.meta}>
          {feature.recharge && (
            <span className="label">{feature.recharge.replace('-', ' ')}</span>
          )}
          {hasUses && (
            <PipTracker
              total={feature.maxUses}
              used={feature.uses}
              onChange={v => onUseChange?.(feature.id, v)}
              label=""
            />
          )}
          <span className={styles.chevron}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      {expanded && <p className={styles.desc}>{feature.description}</p>}
    </div>
  )
}
