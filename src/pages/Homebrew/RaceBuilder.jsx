import { useState } from 'react'
import { useHomebrewStore } from '../../store/homebrew'
import { generateId } from '../../utils/ids'
import styles from './RaceBuilder.module.css'

const ABILITIES = ['str','dex','con','int','wis','cha']

function emptyRace() {
  return {
    id: generateId(), name: '', speed: 30, size: 'Medium', darkvision: 0,
    abilityScoreIncreases: {}, traits: [], languages: ['common'], subraces: [],
  }
}

export default function RaceBuilder() {
  const { races, addRace, deleteRace } = useHomebrewStore()
  const [form, setForm] = useState(null)
  const [traitName, setTraitName] = useState('')
  const [traitDesc, setTraitDesc] = useState('')

  function openNew() { setForm(emptyRace()); setTraitName(''); setTraitDesc('') }

  function addTrait() {
    if (!traitName.trim()) return
    setForm(f => ({ ...f, traits: [...f.traits, { name: traitName, description: traitDesc }] }))
    setTraitName(''); setTraitDesc('')
  }

  function removeTrait(i) { setForm(f => ({ ...f, traits: f.traits.filter((_, idx) => idx !== i) })) }

  function setBonus(ability, val) {
    const n = parseInt(val, 10)
    setForm(f => ({
      ...f,
      abilityScoreIncreases: n ? { ...f.abilityScoreIncreases, [ability]: n } : Object.fromEntries(Object.entries(f.abilityScoreIncreases).filter(([k]) => k !== ability)),
    }))
  }

  function save() {
    if (!form.name.trim()) return
    addRace(form)
    setForm(null)
  }

  return (
    <div className={styles.section}>
      <h3>Homebrew Races</h3>
      {races.map(race => (
        <div key={race.id} className={styles.item}>
          <span>{race.name}</span>
          <span className={styles.tag}>Speed {race.speed} ft</span>
          {Object.entries(race.abilityScoreIncreases).map(([a,v]) => (
            <span key={a} className={styles.tag}>{a.toUpperCase()} +{v}</span>
          ))}
          <button onClick={() => deleteRace(race.id)} aria-label={`Delete ${race.name}`}>Delete</button>
        </div>
      ))}
      {races.length === 0 && !form && <p className={styles.empty}>No homebrew races yet.</p>}

      {!form ? (
        <button onClick={openNew} aria-label="Add race">+ Add Race</button>
      ) : (
        <div className={styles.form}>
          <label>Race Name
            <input type="text" placeholder="Race name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </label>
          <label>Speed (ft)
            <input type="number" value={form.speed} min={0} step={5} onChange={e => setForm(f => ({ ...f, speed: Number(e.target.value) }))} style={{ width: 70 }} />
          </label>
          <label>Size
            <select value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))}>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
            </select>
          </label>
          <label>Darkvision (ft, 0 = none)
            <input type="number" value={form.darkvision} min={0} step={30} onChange={e => setForm(f => ({ ...f, darkvision: Number(e.target.value) }))} style={{ width: 70 }} />
          </label>
          <fieldset className={styles.bonuses}>
            <legend>Ability Bonuses</legend>
            {ABILITIES.map(a => (
              <label key={a}>{a.toUpperCase()}
                <input type="number" min={-2} max={4} value={form.abilityScoreIncreases[a] || ''} placeholder="0"
                  onChange={e => setBonus(a, e.target.value)} style={{ width: 44 }} />
              </label>
            ))}
          </fieldset>
          <div>
            <strong>Traits</strong>
            {form.traits.map((t, i) => (
              <div key={i} className={styles.traitRow}>
                <strong>{t.name}:</strong> {t.description}
                <button onClick={() => removeTrait(i)} aria-label={`Remove trait ${t.name}`}>&times;</button>
              </div>
            ))}
            <div className={styles.traitForm}>
              <input type="text" placeholder="Trait name" value={traitName} onChange={e => setTraitName(e.target.value)} />
              <input type="text" placeholder="Description" value={traitDesc} onChange={e => setTraitDesc(e.target.value)} />
              <button type="button" onClick={addTrait}>Add Trait</button>
            </div>
          </div>
          <div className={styles.formActions}>
            <button onClick={() => setForm(null)}>Cancel</button>
            <button className={styles.primary} onClick={save} disabled={!form.name.trim()} aria-label="Save race">Save Race</button>
          </div>
        </div>
      )}
    </div>
  )
}
