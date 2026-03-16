import { useCharacterStore } from '../../../store/characters'
import { useDerivedStats } from '../../../hooks/useDerivedStats'
import StatBlock from '../../../components/StatBlock/StatBlock'
import SkillRow from '../../../components/SkillRow/SkillRow'
import skillsData from '../../../data/skills.json'
import styles from './AbilitiesTab.module.css'

const ABILITIES = ['str','dex','con','int','wis','cha']
const ABILITY_NAMES = { str:'Strength', dex:'Dexterity', con:'Constitution', int:'Intelligence', wis:'Wisdom', cha:'Charisma' }

export default function AbilitiesTab({ character }) {
  const { updateCharacter } = useCharacterStore()
  const derived = useDerivedStats(character)
  const { proficiencies, settings } = character

  function toggleSkillProf(skillId) {
    const isProf = proficiencies.skills.includes(skillId)
    if (isProf) {
      updateCharacter(character.id, {
        proficiencies: {
          skills: proficiencies.skills.filter(s => s !== skillId),
          expertise: proficiencies.expertise.filter(s => s !== skillId),
        },
      })
    } else {
      updateCharacter(character.id, {
        proficiencies: { skills: [...proficiencies.skills, skillId] },
      })
    }
  }

  function toggleSkillExpertise(skillId) {
    const isExpert = proficiencies.expertise.includes(skillId)
    if (isExpert) {
      updateCharacter(character.id, {
        proficiencies: { expertise: proficiencies.expertise.filter(s => s !== skillId) },
      })
    } else {
      // expertise implies proficiency
      const newSkills = proficiencies.skills.includes(skillId)
        ? proficiencies.skills
        : [...proficiencies.skills, skillId]
      updateCharacter(character.id, {
        proficiencies: { expertise: [...proficiencies.expertise, skillId], skills: newSkills },
      })
    }
  }

  function toggleSaveProf(ability) {
    const isProf = proficiencies.savingThrows.includes(ability)
    updateCharacter(character.id, {
      proficiencies: {
        savingThrows: isProf
          ? proficiencies.savingThrows.filter(a => a !== ability)
          : [...proficiencies.savingThrows, ability],
      },
    })
  }

  return (
    <div className={styles.tab}>
      {/* Ability Scores */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Ability Scores</h3>
        <div className={styles.abilityGrid}>
          {ABILITIES.map(a => (
            <StatBlock
              key={a}
              label={ABILITY_NAMES[a]}
              score={character.abilityScores[a]}
              modifier={derived.abilityModifiers[a]}
              modifierTestId={`modifier-${a}`}
            >
              <div>
                <button
                  aria-label={`Toggle save ${a}`}
                  aria-pressed={proficiencies.savingThrows.includes(a)}
                  className={proficiencies.savingThrows.includes(a) ? styles.saveOn : styles.saveOff}
                  onClick={() => toggleSaveProf(a)}
                >
                  Save {derived.savingThrowBonuses[a] >= 0 ? `+${derived.savingThrowBonuses[a]}` : derived.savingThrowBonuses[a]}
                </button>
              </div>
            </StatBlock>
          ))}
        </div>
      </section>

      {/* Proficiency Bonus + Score Method */}
      <section className={styles.section}>
        <p className={styles.profBonus}>
          Proficiency Bonus: <strong>+{derived.proficiencyBonus}</strong>
        </p>
        <p className={styles.scoreMethod}>
          Score method: <em>{settings.abilityScoreMethod.replace(/-/g, ' ')}</em>
        </p>
      </section>

      {/* Skills */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Skills</h3>
        <div className={styles.skillList}>
          {skillsData.map(skill => (
            <SkillRow
              key={skill.id}
              skill={skill}
              proficient={proficiencies.skills.includes(skill.id)}
              expert={proficiencies.expertise.includes(skill.id)}
              bonus={derived.skillBonuses[skill.id]}
              onProfToggle={() => toggleSkillProf(skill.id)}
              onExpertToggle={() => toggleSkillExpertise(skill.id)}
            />
          ))}
        </div>
      </section>

      {/* Passive Checks */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Passive Checks</h3>
        <div className={styles.passiveList}>
          <div className={styles.passive}>
            <span className={styles.passiveName}>Passive Perception</span>
            <span className={styles.passiveValue}>{derived.passivePerception}</span>
          </div>
          <div className={styles.passive}>
            <span className={styles.passiveName}>Passive Investigation</span>
            <span className={styles.passiveValue}>{derived.passiveInvestigation}</span>
          </div>
          <div className={styles.passive}>
            <span className={styles.passiveName}>Passive Insight</span>
            <span className={styles.passiveValue}>{derived.passiveInsight}</span>
          </div>
        </div>
      </section>

      {/* Proficiency Tags */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Other Proficiencies & Languages</h3>
        {[
          { label: 'Armor', items: proficiencies.armor },
          { label: 'Weapons', items: proficiencies.weapons },
          { label: 'Tools', items: proficiencies.tools },
          { label: 'Languages', items: proficiencies.languages },
        ].map(({ label, items }) => items.length > 0 && (
          <p key={label} className={styles.profTag}>
            <strong>{label}:</strong> {items.join(', ')}
          </p>
        ))}
      </section>
    </div>
  )
}
