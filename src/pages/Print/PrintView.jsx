import { useParams, useNavigate } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import { useDerivedStats } from '../../hooks/useDerivedStats'
import skillsData from '../../data/skills.json'
import spellsData from '../../data/spells.json'
import styles from './PrintView.module.css'

const ABILITIES = ['str','dex','con','int','wis','cha']
const AB_LABEL = { str:'STR', dex:'DEX', con:'CON', int:'INT', wis:'WIS', cha:'CHA' }
function fmt(n) { return n >= 0 ? `+${n}` : `${n}` }

const EMPTY_CHAR = {
  abilityScores: { str:10, dex:10, con:10, int:10, wis:10, cha:10 },
  meta: { level:1, class:'fighter' },
  proficiencies: { savingThrows:[], skills:[], expertise:[] },
  spells: { ability:null, slots:{}, prepared:[], known:[] },
  combat: { acFormula:'unarmored', acOverride:null, equippedArmorId:null, equippedShield:false, initiative:null },
  equipment: [],
}

export default function PrintView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const character = useCharacterStore(s => s.characters.find(c => c.id === id))
  const derived = useDerivedStats(character ?? EMPTY_CHAR)

  if (!character) { navigate('/'); return null }

  const { meta, abilityScores, proficiencies, hp, combat, attacks, spells, features, equipment, currency, biography, customSpells, settings } = character

  const isSpellcaster = spells.ability !== null
  const activeSlots = [1,2,3,4,5,6,7,8,9].filter(l => spells.slots[l].max > 0)
  const preparedSpells = [...spellsData, ...customSpells].filter(s => spells.prepared.includes(s.id))
  const knownCantrips = [...spellsData, ...customSpells].filter(s => spells.known.includes(s.id) && s.level === 0)

  return (
    <div className={styles.page}>
      <div className={styles.printBtn}>
        <button onClick={() => window.print()} aria-label="Print">Print / Save as PDF</button>
        <button onClick={() => navigate(`/character/${id}`)}>← Back to Sheet</button>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.charName}>{meta.characterName}</h1>
        <div className={styles.headerMeta}>
          <span>Level {meta.level} {meta.race} {meta.class}</span>
          <span>Background: {meta.background}</span>
          <span>Alignment: {meta.alignment}</span>
          <span>XP: {meta.xp}</span>
          {meta.playerName && <span>Player: {meta.playerName}</span>}
        </div>
      </header>

      {/* Ability Scores + Saves + Skills */}
      <section className={styles.section}>
        <div className={styles.abilitiesRow}>
          {ABILITIES.map(a => (
            <div key={a} className={styles.abilityBlock}>
              <span className={styles.abilityLabel}>{AB_LABEL[a]}</span>
              <span className={styles.abilityScore}>{abilityScores[a]}</span>
              <span className={styles.abilityMod}>{fmt(derived.abilityModifiers[a])}</span>
              <span className={styles.saveBonus}>
                Save: {fmt(derived.savingThrowBonuses[a])}
                {proficiencies.savingThrows.includes(a) ? ' ●' : ''}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.skills}>
          <strong>Proficiency Bonus:</strong> {fmt(derived.proficiencyBonus)}&nbsp;&nbsp;
          <strong>Passive Perception:</strong> {derived.passivePerception}
          &nbsp;&nbsp;<strong>Initiative:</strong> {fmt(derived.initiative)}
          <table className={styles.skillTable}>
            <tbody>
              {skillsData.map(skill => (
                <tr key={skill.id}>
                  <td>{proficiencies.skills.includes(skill.id) ? (proficiencies.expertise.includes(skill.id) ? '◆' : '●') : '○'}</td>
                  <td>{fmt(derived.skillBonuses[skill.id])}</td>
                  <td>{skill.name}</td>
                  <td className={styles.skillAbility}>({AB_LABEL[skill.ability]})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Combat */}
      <section className={styles.section}>
        <h2>Combat</h2>
        <div className={styles.combatRow}>
          <div><strong>AC</strong><br/>{derived.ac}</div>
          <div><strong>HP</strong><br/>{hp.current}/{hp.max}{hp.temp > 0 ? ` (+${hp.temp} temp)` : ''}</div>
          <div><strong>Speed</strong><br/>{combat.speed} ft</div>
          <div><strong>Hit Dice</strong><br/>{hp.hitDiceRemaining}/{hp.hitDiceTotal}</div>
        </div>
        {attacks.length > 0 && (
          <table className={styles.attackTable}>
            <thead><tr><th>Attack</th><th>Bonus</th><th>Damage</th><th>Type</th></tr></thead>
            <tbody>
              {attacks.map(a => {
                const bonus = a.attackBonusOverride !== null ? a.attackBonusOverride
                  : (derived.abilityModifiers[a.attackAbility] ?? 0) + derived.proficiencyBonus
                const damMod = a.damageAbility ? (derived.abilityModifiers[a.damageAbility] ?? 0) : 0
                return (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{fmt(bonus)}</td>
                    <td>{a.damage}{damMod !== 0 ? ` ${fmt(damMod)}` : ''}</td>
                    <td>{a.damageType}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        {meta.class === 'rogue' && (
          <p><strong>Sneak Attack:</strong> {derived.sneakAttackDice}d6</p>
        )}
      </section>

      {/* Proficiencies */}
      <section className={styles.section}>
        <h2>Proficiencies & Languages</h2>
        {proficiencies.armor.length > 0 && <p><strong>Armor:</strong> {proficiencies.armor.join(', ')}</p>}
        {proficiencies.weapons.length > 0 && <p><strong>Weapons:</strong> {proficiencies.weapons.join(', ')}</p>}
        {proficiencies.tools.length > 0 && <p><strong>Tools:</strong> {proficiencies.tools.join(', ')}</p>}
        {proficiencies.languages.length > 0 && <p><strong>Languages:</strong> {proficiencies.languages.join(', ')}</p>}
      </section>

      {/* Features */}
      {features.length > 0 && (
        <section className={styles.section}>
          <h2>Features & Traits</h2>
          {features.map(f => (
            <div key={f.id} className={styles.feature}>
              <strong>{f.name}</strong> <em>({f.source})</em>
              {f.maxUses !== null && ` — Uses: ${f.uses}/${f.maxUses} [${f.recharge}]`}
            </div>
          ))}
        </section>
      )}

      {/* Equipment */}
      {equipment.length > 0 && (
        <section className={styles.section}>
          <h2>Equipment</h2>
          <table className={styles.eqTable}>
            <thead><tr><th>Item</th><th>Qty</th><th>Equipped</th><th>Notes</th></tr></thead>
            <tbody>
              {equipment.map(e => (
                <tr key={e.id}>
                  <td>{e.name}</td><td>{e.quantity}</td>
                  <td>{e.equipped ? '✓' : ''}</td><td>{e.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p><strong>Currency:</strong> {currency.gp} gp, {currency.sp} sp, {currency.cp} cp{settings.advancedMode ? `, ${currency.ep} ep` : ''}, {currency.pp} pp</p>
        </section>
      )}

      {/* Spells */}
      {isSpellcaster && (
        <section className={styles.section}>
          <h2>Spells</h2>
          <p><strong>Spell Save DC:</strong> {derived.spellSaveDC} &nbsp; <strong>Spell Attack:</strong> {fmt(derived.spellAttackBonus)}</p>
          <h3>Spell Slots</h3>
          <div className={styles.slotRow}>
            {activeSlots.map(l => (
              <span key={l} className={styles.slotBadge}>Lvl {l}: {spells.slots[l].max - spells.slots[l].used}/{spells.slots[l].max}</span>
            ))}
          </div>
          {knownCantrips.length > 0 && (
            <p><strong>Cantrips:</strong> {knownCantrips.map(s => s.name).join(', ')}</p>
          )}
          {preparedSpells.length > 0 && (
            <div>
              <strong>Prepared Spells:</strong>
              {preparedSpells.map(s => (
                <div key={s.id} className={styles.printSpell}>
                  <strong>{s.name}</strong> (Level {s.level}, {s.school}) — {s.castingTime}, {s.range}, {s.duration}
                  <p>{s.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Biography */}
      <section className={styles.section}>
        <h2>Biography</h2>
        {biography.age && <p><strong>Age:</strong> {biography.age} &nbsp; <strong>Height:</strong> {biography.height} &nbsp; <strong>Weight:</strong> {biography.weight}</p>}
        {biography.eyes && <p><strong>Eyes:</strong> {biography.eyes} &nbsp; <strong>Skin:</strong> {biography.skin} &nbsp; <strong>Hair:</strong> {biography.hair}</p>}
        {biography.appearance && <p><strong>Appearance:</strong> {biography.appearance}</p>}
        {biography.personalityTraits && <p><strong>Personality:</strong> {biography.personalityTraits}</p>}
        {biography.ideals && <p><strong>Ideals:</strong> {biography.ideals}</p>}
        {biography.bonds && <p><strong>Bonds:</strong> {biography.bonds}</p>}
        {biography.flaws && <p><strong>Flaws:</strong> {biography.flaws}</p>}
        {biography.backstory && <p><strong>Backstory:</strong> {biography.backstory}</p>}
        {biography.notes && <p><strong>Notes:</strong> {biography.notes}</p>}
      </section>
    </div>
  )
}
