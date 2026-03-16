import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import { useDerivedStats } from '../../hooks/useDerivedStats'
import SummaryBar from './SummaryBar'
import AbilitiesTab from './tabs/AbilitiesTab'
import CombatTab from './tabs/CombatTab'
import SpellsTab from './tabs/SpellsTab'
import EquipmentTab from './tabs/EquipmentTab'
import FeaturesTab from './tabs/FeaturesTab'
import BiographyTab from './tabs/BiographyTab'
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
          {activeTab === 'Abilities' && <AbilitiesTab character={character} />}
          {activeTab === 'Combat' && <CombatTab character={character} />}
          {activeTab === 'Spells' && <SpellsTab character={character} />}
          {activeTab === 'Equipment' && <EquipmentTab character={character} />}
          {activeTab === 'Features' && <FeaturesTab character={character} />}
          {activeTab === 'Biography' && <BiographyTab character={character} />}
        </div>
      </div>
    </div>
  )
}
