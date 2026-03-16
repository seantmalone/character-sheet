import { useNavigate } from 'react-router-dom'
import RaceBuilder from './RaceBuilder'
import ClassBuilder from './ClassBuilder'
import styles from './HomebrewPage.module.css'

export default function HomebrewPage() {
  const navigate = useNavigate()
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>&#8592; Back to Roster</button>
        <h1>Homebrew Builder</h1>
        <p className={styles.subtitle}>Create custom races and classes for use in character creation (Advanced Mode).</p>
      </header>
      <div className={styles.builders}>
        <RaceBuilder />
        <ClassBuilder />
      </div>
    </div>
  )
}
