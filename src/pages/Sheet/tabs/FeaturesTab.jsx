import { useState } from 'react'
import { useCharacterStore } from '../../../store/characters'
import { generateId } from '../../../utils/ids'
import FeatureCard from '../../../components/FeatureCard/FeatureCard'
import styles from './FeaturesTab.module.css'

const SOURCE_OPTIONS = ['custom', 'class', 'race', 'background']
const SOURCES = ['class', 'race', 'background', 'custom']

export default function FeaturesTab({ character }) {
  const { updateCharacter } = useCharacterStore()
  const liveCharacter = useCharacterStore(state => state.characters.find(c => c.id === character.id)) ?? character
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', source: 'custom', description: '', uses: '', recharge: null })

  const { features } = liveCharacter

  function deleteFeature(id) {
    updateCharacter(character.id, { features: features.filter(f => f.id !== id) })
  }

  function updateFeatureUses(id, usedCount) {
    updateCharacter(character.id, {
      features: features.map(f => f.id === id ? { ...f, uses: f.maxUses - usedCount } : f),
    })
  }

  function addFeature() {
    const maxUses = form.uses !== '' ? Number(form.uses) : null
    const feature = {
      id: generateId(), name: form.name, source: form.source,
      description: form.description, uses: maxUses, maxUses, recharge: form.recharge,
    }
    updateCharacter(character.id, { features: [...features, feature] })
    setForm({ name: '', source: 'custom', description: '', uses: '', recharge: null })
    setShowForm(false)
  }

  const grouped = SOURCES.reduce((acc, src) => {
    const group = features.filter(f => f.source === src)
    if (group.length > 0) acc.push({ source: src, items: group })
    return acc
  }, [])
  const uncategorized = features.filter(f => !SOURCES.includes(f.source))
  if (uncategorized.length > 0) grouped.push({ source: 'other', items: uncategorized })

  return (
    <div className={styles.tab}>
      {grouped.length === 0 && <p className={styles.empty}>No features yet.</p>}
      {grouped.map(({ source, items }) => (
        <section key={source} className={styles.group}>
          <h3 className={styles.groupTitle}>{source.charAt(0).toUpperCase() + source.slice(1)}</h3>
          <div className={styles.list}>
            {items.map(feature => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onDelete={() => deleteFeature(feature.id)}
                onUsesChange={used => updateFeatureUses(feature.id, used)}
              />
            ))}
          </div>
        </section>
      ))}

      {!showForm ? (
        <button className={styles.addBtn} onClick={() => setShowForm(true)} aria-label="Add feature">+ Add Feature</button>
      ) : (
        <div className={styles.form}>
          <h4>Add Custom Feature</h4>
          <label>Name <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></label>
          <label>Source
            <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}>
              {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label>Description <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></label>
          <label>Max Uses (leave blank for unlimited) <input type="number" min={1} value={form.uses} onChange={e => setForm(f => ({ ...f, uses: e.target.value }))} /></label>
          <label>Recharge
            <select value={form.recharge || ''} onChange={e => setForm(f => ({ ...f, recharge: e.target.value || null }))}>
              <option value="">None</option>
              <option value="short-rest">Short Rest</option>
              <option value="long-rest">Long Rest</option>
              <option value="day">Day</option>
            </select>
          </label>
          <div className={styles.formActions}>
            <button onClick={() => setShowForm(false)}>Cancel</button>
            <button className={styles.primary} onClick={addFeature} disabled={!form.name.trim()} aria-label="Add">Add</button>
          </div>
        </div>
      )}
    </div>
  )
}
