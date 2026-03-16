import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import { useDerivedStats } from '../../hooks/useDerivedStats'
import SummaryBar from './SummaryBar'
import styles from './Sheet.module.css'

const TABS = ['Abilities', 'Combat', 'Spells', 'Equipment', 'Features', 'Biography']

export default function Sheet() {
  const { id } = useParams()
  const navigate = useNavigate()
  const character = useCharacterStore(state => state.characters.find(c => c.id === id))
  const [activeTab, setActiveTab] = useState('Abilities')

  if (!character) {
    navigate('/')
    return null
  }

  const derived = useDerivedStats(character)

  return (
    <div className={styles.page}>
      <SummaryBar
        character={character}
        derived={derived}
        onShortRest={() => {/* Short Rest modal — implemented in Chunk 12 */}}
        onLongRest={() => {/* Long Rest modal — implemented in Chunk 12 */}}
        onLevelUp={() => {/* Level Up modal — implemented in Chunk 12 */}}
      />

      <div className={styles.body}>
        <nav className={styles.tabs} role="tablist" aria-label="Character sheet tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={[styles.tab, activeTab === tab ? styles.tabActive : ''].join(' ')}
              onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </nav>

        <div className={styles.tabContent} role="tabpanel" aria-label={activeTab}>
          {activeTab === 'Abilities' && <div>Abilities tab — Chunk 7</div>}
          {activeTab === 'Combat' && <div>Combat tab — Chunk 8</div>}
          {activeTab === 'Spells' && <div>Spells tab — Chunk 9</div>}
          {activeTab === 'Equipment' && <div>Equipment tab — Chunk 10</div>}
          {activeTab === 'Features' && <div>Features tab — Chunk 10</div>}
          {activeTab === 'Biography' && <div>Biography tab — Chunk 10</div>}
        </div>
      </div>
    </div>
  )
}
