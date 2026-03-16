import { useCharacterStore } from '../../../store/characters'
import styles from './BiographyTab.module.css'

const TEXT_FIELDS = [
  { key: 'personalityTraits', label: 'Personality Traits', rows: 3 },
  { key: 'ideals', label: 'Ideals', rows: 2 },
  { key: 'bonds', label: 'Bonds', rows: 2 },
  { key: 'flaws', label: 'Flaws', rows: 2 },
  { key: 'appearance', label: 'Appearance', rows: 3 },
  { key: 'backstory', label: 'Backstory', rows: 5 },
  { key: 'notes', label: 'Notes', rows: 4 },
]

const PHYS_FIELDS = [
  { key: 'age', label: 'Age' }, { key: 'height', label: 'Height' },
  { key: 'weight', label: 'Weight' }, { key: 'eyes', label: 'Eyes' },
  { key: 'skin', label: 'Skin' }, { key: 'hair', label: 'Hair' },
]

export default function BiographyTab({ character }) {
  const { updateCharacter, characters } = useCharacterStore()
  const liveCharacter = characters.find(c => c.id === character.id) ?? character
  const { biography } = liveCharacter

  function setBio(key, value) {
    updateCharacter(character.id, { biography: { ...biography, [key]: value } })
  }

  return (
    <div className={styles.tab}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Physical Characteristics</h3>
        <div className={styles.physGrid}>
          {PHYS_FIELDS.map(({ key, label }) => (
            <label key={key} className={styles.physField}>
              {label}
              <input type="text" value={biography[key]} onChange={e => setBio(key, e.target.value)} />
            </label>
          ))}
        </div>
      </section>

      {TEXT_FIELDS.map(({ key, label, rows }) => (
        <section key={key} className={styles.section}>
          <label className={styles.bioLabel} htmlFor={`bio-${key}`}>
            <span className={styles.sectionTitle}>{label}</span>
          </label>
          <textarea
            id={`bio-${key}`}
            aria-label={label}
            rows={rows}
            value={biography[key]}
            onChange={e => setBio(key, e.target.value)}
            className={styles.bioArea}
          />
        </section>
      ))}
    </div>
  )
}
