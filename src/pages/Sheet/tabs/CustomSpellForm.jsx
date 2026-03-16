import { useState } from 'react'
import { generateId } from '../../../utils/ids'
import styles from './CustomSpellForm.module.css'

const SCHOOLS = ['abjuration','conjuration','divination','enchantment','evocation','illusion','necromancy','transmutation']

export default function CustomSpellForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({
    name: '', level: 0, school: 'evocation', castingTime: '1 action',
    range: '', components: 'V, S', duration: '', description: '',
    concentration: false, castingAbilityOverride: null,
  })

  function set(field, value) { setForm(f => ({ ...f, [field]: value })) }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onAdd({ ...form, id: generateId(), level: Number(form.level) })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h4>Add Custom Spell</h4>
      <label>Name <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required /></label>
      <label>Level
        <select value={form.level} onChange={e => set('level', Number(e.target.value))}>
          <option value={0}>Cantrip</option>
          {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </label>
      <label>School
        <select value={form.school} onChange={e => set('school', e.target.value)}>
          {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <label>Casting Time <input type="text" value={form.castingTime} onChange={e => set('castingTime', e.target.value)} /></label>
      <label>Range <input type="text" value={form.range} onChange={e => set('range', e.target.value)} /></label>
      <label>Components <input type="text" value={form.components} onChange={e => set('components', e.target.value)} /></label>
      <label>Duration <input type="text" value={form.duration} onChange={e => set('duration', e.target.value)} /></label>
      <label>
        <input type="checkbox" checked={form.concentration} onChange={e => set('concentration', e.target.checked)} />
        Concentration
      </label>
      <label>Description <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} /></label>
      <div className={styles.actions}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" className={styles.primary}>Add Spell</button>
      </div>
    </form>
  )
}
