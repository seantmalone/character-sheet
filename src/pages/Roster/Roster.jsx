import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import { useSettingsStore } from '../../store/settings'
import { withDefaults, validateCharacterImport } from '../../utils/validators'
import { generateId } from '../../utils/ids'
import { exportCharacter } from '../../utils/export'
import CharacterCard from './CharacterCard'
import styles from './Roster.module.css'

export default function Roster() {
  const { characters, deleteCharacter, addCharacter } = useCharacterStore()
  const { globalAdvancedMode, toggleGlobalAdvancedMode } = useSettingsStore()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result)
        const { valid, error, warnings } = validateCharacterImport(data)
        if (!valid) { alert(`Import failed: ${error}`); return }
        if (warnings.includes('schema-version-mismatch')) {
          if (!confirm('This file was created with a different version. Attempt import anyway?')) return
        }
        addCharacter({ ...withDefaults(data), id: generateId() })
      } catch {
        alert('Import failed: file is not valid JSON.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Characters</h1>
        <div className={styles.headerActions}>
          <label className={styles.toggle}>
            <input type="checkbox" checked={globalAdvancedMode} onChange={toggleGlobalAdvancedMode} />
            Advanced Mode
          </label>
          <button onClick={() => fileInputRef.current?.click()}>Import JSON</button>
          <input ref={fileInputRef} type="file" accept=".json" hidden onChange={handleImport} />
          <button className={styles.newBtn} onClick={() => navigate('/new')}>+ New Character</button>
        </div>
      </header>

      {characters.length === 0 ? (
        <div className={styles.empty}>
          <p>No characters yet. Create one to get started!</p>
          <button className={styles.newBtn} onClick={() => navigate('/new')}>Create Your First Character</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {characters.map(char => (
            <CharacterCard
              key={char.id}
              character={char}
              onDelete={deleteCharacter}
              onExport={exportCharacter}
            />
          ))}
        </div>
      )}

      {globalAdvancedMode && (
        <div className={styles.homebrew}>
          <button onClick={() => navigate('/homebrew')}>Manage Homebrew</button>
        </div>
      )}
    </div>
  )
}
