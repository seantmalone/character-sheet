import { useState } from 'react'
import { useHomebrewStore } from '../../store/homebrew'
import { generateId } from '../../utils/ids'
import styles from './ClassBuilder.module.css'

const ABILITIES = ['str','dex','con','int','wis','cha']
const SKILLS_LIST = ['acrobatics','animal-handling','athletics','arcana','deception','history','insight','intimidation','investigation','medicine','nature','perception','performance','persuasion','religion','sleight-of-hand','stealth','survival']

function emptyClass() {
  return {
    id: generateId(), name: '', hitDie: 8, spellcastingAbility: null,
    savingThrowProficiencies: [], armorProficiencies: [], weaponProficiencies: [],
    toolProficiencies: [],
    skillChoices: { count: 2, options: [] },
    features: [], asiLevels: [4,8,12,16,19],
    spellSlotProgression: null,
  }
}

export default function ClassBuilder() {
  const { classes, addClass, deleteClass } = useHomebrewStore()
  const [form, setForm] = useState(null)
  const [featName, setFeatName] = useState('')
  const [featLevel, setFeatLevel] = useState(1)
  const [featDesc, setFeatDesc] = useState('')

  function openNew() { setForm(emptyClass()); setFeatName(''); setFeatDesc('') }

  function toggleSave(a) {
    setForm(f => ({
      ...f,
      savingThrowProficiencies: f.savingThrowProficiencies.includes(a)
        ? f.savingThrowProficiencies.filter(s => s !== a)
        : [...f.savingThrowProficiencies, a],
    }))
  }

  function toggleSkill(id) {
    setForm(f => {
      const opts = f.skillChoices.options
      return {
        ...f,
        skillChoices: {
          ...f.skillChoices,
          options: opts.includes(id) ? opts.filter(s => s !== id) : [...opts, id],
        },
      }
    })
  }

  function addFeature() {
    if (!featName.trim()) return
    setForm(f => ({
      ...f,
      features: [...f.features, { level: Number(featLevel), name: featName, description: featDesc }],
    }))
    setFeatName(''); setFeatDesc('')
  }

  function removeFeature(i) { setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) })) }

  function save() {
    if (!form.name.trim()) return
    addClass(form)
    setForm(null)
  }

  return (
    <div className={styles.section}>
      <h3>Homebrew Classes</h3>
      {classes.map(cls => (
        <div key={cls.id} className={styles.item}>
          <span>{cls.name}</span>
          <span className={styles.tag}>d{cls.hitDie}</span>
          <button onClick={() => deleteClass(cls.id)} aria-label={`Delete ${cls.name}`}>Delete</button>
        </div>
      ))}
      {classes.length === 0 && !form && <p className={styles.empty}>No homebrew classes yet.</p>}

      {!form ? (
        <button onClick={openNew} aria-label="Add class">+ Add Class</button>
      ) : (
        <div className={styles.form}>
          <label>Class Name
            <input type="text" placeholder="Class name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </label>
          <div className={styles.row}>
            <label>Hit Die
              <select value={form.hitDie} onChange={e => setForm(f => ({ ...f, hitDie: Number(e.target.value) }))}>
                {[6,8,10,12].map(d => <option key={d} value={d}>d{d}</option>)}
              </select>
            </label>
            <label>Spellcasting Ability
              <select value={form.spellcastingAbility || ''} onChange={e => setForm(f => ({ ...f, spellcastingAbility: e.target.value || null }))}>
                <option value="">None</option>
                {ABILITIES.map(a => <option key={a} value={a}>{a.toUpperCase()}</option>)}
              </select>
            </label>
            <label>Skill Choices (count)
              <input type="number" min={1} max={5} value={form.skillChoices.count} onChange={e => setForm(f => ({ ...f, skillChoices: { ...f.skillChoices, count: Number(e.target.value) } }))} style={{ width: 50 }} />
            </label>
          </div>
          <fieldset>
            <legend>Saving Throw Proficiencies</legend>
            {ABILITIES.map(a => (
              <label key={a}><input type="checkbox" checked={form.savingThrowProficiencies.includes(a)} onChange={() => toggleSave(a)} /> {a.toUpperCase()}</label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Available Skill Choices</legend>
            {SKILLS_LIST.map(s => (
              <label key={s}><input type="checkbox" checked={form.skillChoices.options.includes(s)} onChange={() => toggleSkill(s)} /> {s}</label>
            ))}
          </fieldset>
          <div>
            <strong>Class Features</strong>
            {form.features.map((f, i) => (
              <div key={i} className={styles.featRow}>
                Level {f.level}: <strong>{f.name}</strong> &mdash; {f.description}
                <button onClick={() => removeFeature(i)}>&times;</button>
              </div>
            ))}
            <div className={styles.featForm}>
              <input type="number" min={1} max={20} value={featLevel} onChange={e => setFeatLevel(e.target.value)} placeholder="Lvl" style={{ width: 44 }} />
              <input type="text" placeholder="Feature name" value={featName} onChange={e => setFeatName(e.target.value)} />
              <input type="text" placeholder="Description" value={featDesc} onChange={e => setFeatDesc(e.target.value)} />
              <button type="button" onClick={addFeature}>Add</button>
            </div>
          </div>
          <div className={styles.formActions}>
            <button onClick={() => setForm(null)}>Cancel</button>
            <button className={styles.primary} onClick={save} disabled={!form.name.trim()} aria-label="Save class">Save Class</button>
          </div>
        </div>
      )}
    </div>
  )
}
