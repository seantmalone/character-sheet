import { useState } from 'react'
import { useCharacterStore } from '../../../store/characters'
import { useDerivedStats } from '../../../hooks/useDerivedStats'
import { generateId } from '../../../utils/ids'
import CurrencyRow from '../../../components/CurrencyRow/CurrencyRow'
import equipmentData from '../../../data/equipment.json'
import styles from './EquipmentTab.module.css'

export default function EquipmentTab({ character }) {
  const { updateCharacter } = useCharacterStore()
  const liveCharacter = useCharacterStore(state => state.characters.find(c => c.id === character.id)) ?? character
  const derived = useDerivedStats(liveCharacter)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showCatalog, setShowCatalog] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, weight: 0, notes: '' })
  const [catalogId, setCatalogId] = useState('')

  const { equipment, currency, settings } = liveCharacter
  const totalWeight = equipment.reduce((s, e) => s + (e.weight * e.quantity), 0)

  function deleteItem(id) {
    updateCharacter(character.id, { equipment: equipment.filter(e => e.id !== id) })
  }

  function updateItem(id, patch) {
    updateCharacter(character.id, {
      equipment: equipment.map(e => e.id === id ? { ...e, ...patch } : e),
    })
  }

  function addFromCatalog(catalogItemId) {
    if (!catalogItemId) return
    const allItems = [...equipmentData.weapons, ...equipmentData.armor]
    const item = allItems.find(i => i.id === catalogItemId)
    if (!item) return
    const entry = {
      id: generateId(), name: item.name, quantity: 1, weight: item.weight,
      equipped: false, notes: '',
      damage: item.damage || null, damageType: item.damageType || null,
      weaponProperties: item.weaponProperties || [], weaponCategory: item.weaponCategory || null,
      range: item.range || null, armorClass: item.armorClass || null, armorType: item.armorType || null,
    }
    updateCharacter(character.id, { equipment: [...equipment, entry] })
    setCatalogId('')
    setShowCatalog(false)
  }

  function addCustomItem() {
    if (!newItem.name.trim()) return
    const entry = {
      id: generateId(), ...newItem, quantity: Number(newItem.quantity), weight: Number(newItem.weight),
      equipped: false,
      damage: null, damageType: null, weaponProperties: [], weaponCategory: null,
      range: null, armorClass: null, armorType: null,
    }
    updateCharacter(character.id, { equipment: [...equipment, entry] })
    setNewItem({ name: '', quantity: 1, weight: 0, notes: '' })
    setShowAddForm(false)
  }

  function updateCurrency(newCurrency) {
    updateCharacter(character.id, { currency: newCurrency })
  }

  return (
    <div className={styles.tab}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Equipment</h3>
        {settings.advancedMode && (
          <div className={styles.carryRow}>
            <p className={styles.weight}>
              Carried: {totalWeight} lb / {derived.carryingCapacity} lb
              {totalWeight > derived.carryingCapacity / 3 && totalWeight <= derived.carryingCapacity * 2 / 3 && (
                <span className={styles.encumbered}> (encumbered)</span>
              )}
              {totalWeight > derived.carryingCapacity * 2 / 3 && totalWeight <= derived.carryingCapacity && (
                <span className={styles.encumbered}> (heavily encumbered)</span>
              )}
              {totalWeight > derived.carryingCapacity && (
                <span className={styles.overloaded}> (overloaded)</span>
              )}
            </p>
            <progress
              className={styles.carryBar}
              value={totalWeight}
              max={derived.carryingCapacity}
              aria-label="Carrying capacity"
            />
          </div>
        )}
        <table className={styles.table}>
          <thead>
            <tr><th>Name</th><th>Qty</th><th>Weight</th><th>Equip</th><th>Notes</th><th></th></tr>
          </thead>
          <tbody>
            {equipment.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  <input type="number" min={1} value={item.quantity}
                    onChange={e => updateItem(item.id, { quantity: Number(e.target.value) })}
                    className={styles.numInput} />
                </td>
                <td>{item.weight * item.quantity} lb</td>
                <td>
                  <input type="checkbox" checked={item.equipped}
                    onChange={e => updateItem(item.id, { equipped: e.target.checked })}
                    aria-label={`Equip ${item.name}`} />
                </td>
                <td>
                  <input type="text" value={item.notes}
                    onChange={e => updateItem(item.id, { notes: e.target.value })}
                    placeholder="Notes" className={styles.notesInput} />
                </td>
                <td>
                  <button onClick={() => deleteItem(item.id)} aria-label={`Delete ${item.name}`}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.addRow}>
          {!showCatalog && !showAddForm && (
            <button onClick={() => setShowCatalog(true)} aria-label="Add from catalog">+ From Catalog</button>
          )}
          {showCatalog && (
            <select
              aria-label="Add from catalog"
              value={catalogId}
              onChange={e => { setCatalogId(e.target.value); addFromCatalog(e.target.value) }}
            >
              <option value="">Select item…</option>
              <optgroup label="Weapons">
                {equipmentData.weapons.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </optgroup>
              <optgroup label="Armor">
                {equipmentData.armor.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </optgroup>
            </select>
          )}
          {!showAddForm
            ? <button onClick={() => setShowAddForm(true)} aria-label="Add custom item">+ Custom Item</button>
            : (
              <div className={styles.customForm}>
                <input type="text" placeholder="Item name" value={newItem.name}
                  onChange={e => setNewItem(f => ({ ...f, name: e.target.value }))} />
                <input type="number" placeholder="Qty" min={1} value={newItem.quantity}
                  onChange={e => setNewItem(f => ({ ...f, quantity: e.target.value }))} style={{ width: 50 }} />
                <input type="number" placeholder="Weight (lb)" min={0} step={0.1} value={newItem.weight}
                  onChange={e => setNewItem(f => ({ ...f, weight: e.target.value }))} style={{ width: 80 }} />
                <button onClick={addCustomItem} aria-label="Add">Add</button>
                <button onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            )}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Currency</h3>
        <CurrencyRow currency={currency} advancedMode={settings.advancedMode} onChange={updateCurrency} />
      </section>
    </div>
  )
}
