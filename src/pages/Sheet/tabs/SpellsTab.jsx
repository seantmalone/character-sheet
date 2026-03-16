import { useState } from 'react'
import { useCharacterStore } from '../../../store/characters'
import { useDerivedStats } from '../../../hooks/useDerivedStats'
import { useSpells } from '../../../hooks/useSpells'
import SpellCard from '../../../components/SpellCard/SpellCard'
import PipTracker from '../../../components/PipTracker/PipTracker'
import CustomSpellForm from './CustomSpellForm'
import styles from './SpellsTab.module.css'

export default function SpellsTab({ character }) {
  const { updateCharacter } = useCharacterStore()
  const derived = useDerivedStats(character)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [arcaneOpen, setArcaneOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterSchool, setFilterSchool] = useState('all')
  const [filterPrepared, setFilterPrepared] = useState('all')

  const { spells, customSpells, meta } = character
  const isWizard = meta.class === 'wizard'

  const filtered = useSpells(character, { search, level: filterLevel, school: filterSchool, prepared: filterPrepared })

  function setSlotUsed(level, used) {
    const slot = spells.slots[level]
    updateCharacter(character.id, { spells: { ...spells, slots: { ...spells.slots, [level]: { ...slot, used } } } })
  }

  function togglePrepared(spellId) {
    const isPrepared = spells.prepared.includes(spellId)
    updateCharacter(character.id, {
      spells: {
        ...spells,
        prepared: isPrepared
          ? spells.prepared.filter(id => id !== spellId)
          : [...spells.prepared, spellId],
      },
    })
  }

  function addCustomSpell(spellData) {
    updateCharacter(character.id, { customSpells: [...customSpells, spellData] })
    setShowCustomForm(false)
  }

  function removeCustomSpell(id) {
    updateCharacter(character.id, { customSpells: customSpells.filter(s => s.id !== id) })
  }

  const arcaneRecoveryMax = Math.ceil(meta.level / 2)
  function handleArcaneRecovery(recoverLevels) {
    const newSlots = { ...spells.slots }
    for (const lvl of recoverLevels) {
      const s = newSlots[lvl]
      if (s.used > 0) newSlots[lvl] = { ...s, used: s.used - 1 }
    }
    updateCharacter(character.id, { spells: { ...spells, slots: newSlots, arcaneRecoveryUsed: true } })
    setArcaneOpen(false)
  }

  const activeSlotLevels = [1,2,3,4,5,6,7,8,9].filter(l => spells.slots[l].max > 0)

  return (
    <div className={styles.tab}>
      {spells.ability && (
        <div className={styles.spellStats}>
          <div className={styles.spellStat}>
            <span className={styles.statVal}>{derived.spellSaveDC}</span>
            <span className={styles.statLabel}>Spell Save DC</span>
          </div>
          <div className={styles.spellStat}>
            <span className={styles.statVal}>{derived.spellAttackBonus >= 0 ? `+${derived.spellAttackBonus}` : derived.spellAttackBonus}</span>
            <span className={styles.statLabel}>Spell Attack</span>
          </div>
        </div>
      )}

      {activeSlotLevels.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Spell Slots</h3>
          <div className={styles.slotGrid}>
            {activeSlotLevels.map(level => {
              const slot = spells.slots[level]
              return (
                <div key={level} className={styles.slotRow}>
                  <span className={styles.slotLevel}>Level {level} ({slot.max - slot.used}/{slot.max})</span>
                  <PipTracker
                    total={slot.max}
                    used={slot.used}
                    onChange={used => setSlotUsed(level, used)}
                    label={`Slot ${level} pip`}
                  />
                </div>
              )
            })}
          </div>
          {isWizard && (
            <button
              className={styles.arcaneBtn}
              disabled={spells.arcaneRecoveryUsed || [1,2,3,4,5].every(l => (spells.slots[l]?.used ?? 0) === 0)}
              onClick={() => setArcaneOpen(true)}
              aria-label="Arcane Recovery"
              title={spells.arcaneRecoveryUsed ? 'Already used this rest' : undefined}>
              Arcane Recovery {spells.arcaneRecoveryUsed ? '(used)' : ''}
            </button>
          )}
        </section>
      )}

      {arcaneOpen && (
        <ArcaneRecoveryModal
          slots={spells.slots}
          maxLevels={arcaneRecoveryMax}
          onConfirm={handleArcaneRecovery}
          onCancel={() => setArcaneOpen(false)}
        />
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Spells</h3>
        <div className={styles.filters}>
          <input type="search" placeholder="Search spells…" value={search} onChange={e => setSearch(e.target.value)} aria-label="Search spells" />
          <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} aria-label="Filter by level">
            <option value="all">All levels</option>
            <option value="0">Cantrips</option>
            {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>Level {l}</option>)}
          </select>
          <select value={filterSchool} onChange={e => setFilterSchool(e.target.value)} aria-label="Filter by school">
            <option value="all">All schools</option>
            {['abjuration','conjuration','divination','enchantment','evocation','illusion','necromancy','transmutation'].map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <select value={filterPrepared} onChange={e => setFilterPrepared(e.target.value)} aria-label="Filter by prepared status">
            <option value="all">All spells</option>
            <option value="prepared">Prepared only</option>
            <option value="known">Known only</option>
          </select>
        </div>
        <div className={styles.spellList}>
          {filtered.map(spell => {
            const isCustom = !!customSpells.find(s => s.id === spell.id)
            return (
              <div key={spell.id} className={styles.spellCardWrapper}>
                <SpellCard
                  spell={spell}
                  prepared={spells.prepared.includes(spell.id)}
                  isCustom={isCustom}
                  onTogglePrepared={() => togglePrepared(spell.id)}
                />
                {isCustom && (
                  <button
                    className={styles.deleteSpellBtn}
                    onClick={() => removeCustomSpell(spell.id)}
                    aria-label={`Delete ${spell.name}`}>
                    ×
                  </button>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <p className={styles.empty}>No spells found.</p>}
        </div>
        {!showCustomForm
          ? <button className={styles.addBtn} onClick={() => setShowCustomForm(true)}>+ Add Custom Spell</button>
          : <CustomSpellForm onAdd={addCustomSpell} onCancel={() => setShowCustomForm(false)} />}
      </section>
    </div>
  )
}

function ArcaneRecoveryModal({ slots, maxLevels, onConfirm, onCancel }) {
  const [selected, setSelected] = useState([])
  const totalSelected = selected.reduce((s, l) => s + l, 0)

  function toggle(level) {
    if (selected.includes(level)) {
      setSelected(selected.filter(l => l !== level))
    } else if (totalSelected + level <= maxLevels && slots[level].used > 0) {
      setSelected([...selected, level])
    }
  }

  const recoverableLevels = [1,2,3,4,5].filter(l => slots[l].used > 0)
  return (
    <div role="dialog" aria-label="Arcane Recovery" style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.4)', zIndex:300 }}>
      <div style={{ background:'var(--color-surface)', borderRadius:'var(--radius-lg)', padding:'var(--space-xl)', maxWidth:400, width:'100%' }}>
        <h3>Arcane Recovery</h3>
        <p>Recover spell slots totaling up to {maxLevels} levels (max level 5). Select slots to recover:</p>
        {recoverableLevels.map(l => (
          <label key={l}>
            <input type="checkbox" checked={selected.includes(l)}
              onChange={() => toggle(l)}
              disabled={!selected.includes(l) && totalSelected + l > maxLevels} />
            Level {l} slot ({slots[l].used} used)
          </label>
        ))}
        <p>Levels selected: {totalSelected} / {maxLevels}</p>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={() => onConfirm(selected)} disabled={selected.length === 0}>Recover</button>
      </div>
    </div>
  )
}
