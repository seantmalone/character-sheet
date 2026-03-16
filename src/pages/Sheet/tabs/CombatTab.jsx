import { useCharacterStore } from '../../../store/characters'
import { useDerivedStats } from '../../../hooks/useDerivedStats'
import { generateId } from '../../../utils/ids'
import { rollDice } from '../../../utils/diceRoller'
import ConditionToggle from '../../../components/ConditionToggle/ConditionToggle'
import DiceRoller from '../../../components/DiceRoller/DiceRoller'
import PipTracker from '../../../components/PipTracker/PipTracker'
import classes from '../../../data/classes.json'
import conditionsData from '../../../data/conditions.json'
import styles from './CombatTab.module.css'

const AC_FORMULAS = ['unarmored','mage-armor','light','medium','heavy','custom']

function getAttackBonus(attack, character, derived) {
  if (attack.attackBonusOverride !== null) return attack.attackBonusOverride
  const abilityMod = derived.abilityModifiers[attack.attackAbility] ?? 0
  const eq = character.equipment.find(e => e.id === attack.equipmentId)
  const isProficient = eq
    ? character.proficiencies.weapons.includes(eq.weaponCategory) || character.proficiencies.weapons.includes(eq.name.toLowerCase())
    : false
  return abilityMod + (isProficient ? derived.proficiencyBonus : 0)
}

function formatBonus(n) { return n >= 0 ? `+${n}` : `${n}` }

export default function CombatTab({ character }) {
  const { updateCharacter } = useCharacterStore()
  // Read live combat fields from the store so controlled inputs reflect updates during tests
  const liveCombat = useCharacterStore(state => state.characters.find(c => c.id === character.id)?.combat) ?? character.combat
  const derived = useDerivedStats(character)
  const { conditions, hp, attacks, equipment } = character
  const combat = liveCombat
  const classData = classes.find(c => c.id === character.meta.class)
  const hitDie = classData?.hitDie || 6
  const isRogue = character.meta.class === 'rogue'

  const weaponItems = equipment.filter(e => e.damage !== null)

  function handleAcFormulaChange(formula) {
    updateCharacter(character.id, { combat: { acFormula: formula } })
  }

  function handleAcOverrideChange(val) {
    updateCharacter(character.id, { combat: { acOverride: Number(val) } })
  }

  function addAttackFromEquipment(equipmentId) {
    if (!equipmentId) return
    const item = equipment.find(e => e.id === equipmentId)
    if (!item) return
    const attack = {
      id: generateId(), name: item.name, equipmentId,
      attackAbility: item.weaponProperties?.includes('finesse') ? 'dex' : 'str',
      attackBonusOverride: null,
      damage: item.damage, damageType: item.damageType,
      damageAbility: item.weaponProperties?.includes('finesse') ? 'dex' : 'str',
      notes: '',
    }
    updateCharacter(character.id, { attacks: [...attacks, attack] })
  }

  function addCustomAttack() {
    const attack = {
      id: generateId(), name: 'Custom Attack', equipmentId: null,
      attackAbility: 'str', attackBonusOverride: null,
      damage: '1d6', damageType: 'bludgeoning',
      damageAbility: 'str', notes: '',
    }
    updateCharacter(character.id, { attacks: [...attacks, attack] })
  }

  function deleteAttack(id) {
    updateCharacter(character.id, { attacks: attacks.filter(a => a.id !== id) })
  }

  function spendHitDie() {
    if (hp.hitDiceRemaining <= 0) return
    const { result } = rollDice(`1d${hitDie}`)
    const conMod = derived.abilityModifiers.con ?? 0
    const heal = Math.max(1, result + conMod)
    const newCurrent = Math.min(hp.max, hp.current + heal)
    updateCharacter(character.id, { hp: { ...hp, current: newCurrent, hitDiceRemaining: hp.hitDiceRemaining - 1 } })
  }

  function handleConditionChange(conditionId, newValue) {
    if (conditionId === 'exhaustion') {
      updateCharacter(character.id, { conditions: { ...conditions, exhaustion: newValue } })
    } else {
      updateCharacter(character.id, { conditions: { ...conditions, [conditionId]: newValue } })
    }
  }

  return (
    <div className={styles.tab}>
      {/* AC & Speed */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Armor Class</h3>
        <div className={styles.acRow}>
          <span data-testid="ac-value" className={styles.acValue}>{derived.ac}</span>
          <select
            aria-label="AC formula"
            value={combat.acFormula}
            onChange={e => handleAcFormulaChange(e.target.value)}>
            {AC_FORMULAS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          {combat.acFormula === 'custom' && (
            <input type="number" aria-label="Custom AC" value={combat.acOverride ?? ''} onChange={e => handleAcOverrideChange(e.target.value)} />
          )}
          {['light','medium','heavy'].includes(combat.acFormula) && (
            <select
              aria-label="Equipped armor"
              value={combat.equippedArmorId || ''}
              onChange={e => updateCharacter(character.id, { combat: { equippedArmorId: e.target.value || null } })}>
              <option value="">No armor</option>
              {equipment.filter(e => e.armorType !== null && e.armorType !== 'shield').map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          )}
          <label className={styles.shieldLabel}>
            <input type="checkbox" checked={combat.equippedShield}
              onChange={e => updateCharacter(character.id, { combat: { equippedShield: e.target.checked } })} />
            Shield (+2)
          </label>
        </div>
      </section>

      {/* Initiative */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Initiative</h3>
        <div className={styles.initiativeRow}>
          <span className={styles.initiativeValue} data-testid="initiative-value">
            {(combat.initiative ?? derived.initiative) >= 0
              ? `+${combat.initiative ?? derived.initiative}`
              : `${combat.initiative ?? derived.initiative}`}
          </span>
          <input
            type="number"
            aria-label="Initiative override"
            placeholder="Override…"
            value={combat.initiative ?? ''}
            onChange={e => updateCharacter(character.id, {
              combat: { ...combat, initiative: e.target.value !== '' ? parseInt(e.target.value, 10) : null },
            })}
          />
          <span className={styles.initiativeLabel}>
            {combat.initiative !== null ? 'override' : '(DEX modifier)'}
          </span>
        </div>
      </section>

      {/* Speed */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Speed</h3>
        <div className={styles.speedRow}>
          <input
            type="number"
            aria-label="Speed"
            value={combat.speed ?? 30}
            min={0}
            onChange={e => updateCharacter(character.id, {
              combat: { ...combat, speed: parseInt(e.target.value, 10) || 0 },
            })}
          />
          <span className={styles.speedLabel}>ft.</span>
        </div>
      </section>

      {/* Weapon Attacks */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Weapon Attacks</h3>
        {attacks.length > 0 && (
          <table className={styles.attackTable}>
            <thead>
              <tr><th>Name</th><th>Attack</th><th>Damage</th><th>Type</th><th></th></tr>
            </thead>
            <tbody>
              {attacks.map(attack => {
                const bonus = getAttackBonus(attack, character, derived)
                const damMod = attack.damageAbility ? (derived.abilityModifiers[attack.damageAbility] ?? 0) : 0
                return (
                  <tr key={attack.id}>
                    <td>{attack.name}</td>
                    <td>{formatBonus(bonus)}</td>
                    <td>{attack.damage}{damMod !== 0 ? ` ${formatBonus(damMod)}` : ''}</td>
                    <td>{attack.damageType}</td>
                    <td><button onClick={() => deleteAttack(attack.id)} aria-label={`Delete ${attack.name}`}>×</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        <div className={styles.addAttack}>
          {weaponItems.length > 0 && (
            <select aria-label="Add weapon from equipment" onChange={e => addAttackFromEquipment(e.target.value)}>
              <option value="">Add from equipment…</option>
              {weaponItems.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          )}
          <button onClick={addCustomAttack} aria-label="Add custom attack">+ Custom Attack</button>
        </div>
      </section>

      {/* Sneak Attack (Rogue only) */}
      {isRogue && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Sneak Attack</h3>
          <div className={styles.sneakRow}>
            <span>{derived.sneakAttackDice}d6</span>
            <DiceRoller expression={`${derived.sneakAttackDice}d6`} label="Roll Sneak Attack" />
          </div>
        </section>
      )}

      {/* Hit Dice */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Hit Dice (d{hitDie})</h3>
        <div className={styles.hitDiceRow}>
          <PipTracker
            total={hp.hitDiceTotal}
            used={hp.hitDiceTotal - hp.hitDiceRemaining}
            onChange={val => updateCharacter(character.id, { hp: { hitDiceRemaining: hp.hitDiceTotal - val } })}
            label="Hit dice remaining"
          />
          <button onClick={spendHitDie} disabled={hp.hitDiceRemaining <= 0} aria-label="Spend hit die">
            Spend Hit Die
          </button>
        </div>
      </section>

      {/* Conditions */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Conditions</h3>
        <div className={styles.conditions}>
          {conditionsData.map(condObj => (
            <ConditionToggle
              key={condObj.id}
              condition={condObj}
              active={condObj.id === 'exhaustion' ? conditions.exhaustion > 0 : conditions[condObj.id]}
              value={condObj.id === 'exhaustion' ? conditions.exhaustion : undefined}
              onChange={newValue => handleConditionChange(condObj.id, newValue)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
