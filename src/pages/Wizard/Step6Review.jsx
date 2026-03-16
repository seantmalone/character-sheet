import { useNavigate } from 'react-router-dom'
import { useWizard } from './WizardContext'
import WizardStep from './WizardStep'
import { useCharacterStore } from '../../store/characters'
import { buildCharacterFromDraft } from '../../utils/buildCharacterFromDraft'
import { getAbilityModifier, getProficiencyBonus } from '../../utils/calculations'
import races from '../../data/races.json'
import classes from '../../data/classes.json'
import backgrounds from '../../data/backgrounds.json'

export default function Step6Review() {
  const { draft } = useWizard()
  const { meta, abilityScores, settings } = draft
  const { addCharacter } = useCharacterStore()
  const navigate = useNavigate()

  const raceData = races.find(r => r.id === meta.race)
  const subraceData = (raceData?.subraces || []).find(s => s.id === meta.subrace)
  const classData = classes.find(c => c.id === meta.class)
  const bgData = backgrounds.find(b => b.id === meta.background)
  const raceBonuses = raceData?.abilityScoreIncreases || {}
  const subraceBonuses = subraceData?.abilityScoreIncreases || {}
  const allBonuses = Object.fromEntries(
    [...new Set([...Object.keys(raceBonuses), ...Object.keys(subraceBonuses)])].map(k => [
      k, (raceBonuses[k] || 0) + (subraceBonuses[k] || 0)
    ])
  )

  const finalScores = Object.fromEntries(
    ['str','dex','con','int','wis','cha'].map(k => [k, (abilityScores[k] || 10) + (allBonuses[k] || 0)])
  )
  const conMod = getAbilityModifier(finalScores.con)
  const maxHp = Math.max(1, (classData?.hitDie || 6) + conMod)

  function handleConfirm() {
    const character = buildCharacterFromDraft(draft)
    addCharacter(character)
    navigate(`/character/${character.id}`)
  }

  return (
    <WizardStep title="Review & Confirm" onNext={handleConfirm}>
      <div>
        <h3>{meta.characterName}</h3>
        {meta.playerName && <p>Player: {meta.playerName}</p>}
        <p>{meta.alignment}</p>
        <p>
          Level 1 {raceData?.name}{subraceData ? ` (${subraceData.name})` : ''}{' '}
          {classData?.name}
        </p>
        <p>Background: {bgData?.name}</p>
        <p>Proficiency Bonus: +{getProficiencyBonus(1)}</p>
        <p>Starting HP: {maxHp}</p>
      </div>
      <h4>Ability Scores</h4>
      <dl>
        {['str','dex','con','int','wis','cha'].map(a => {
          const base = abilityScores[a] || 10
          const bonus = allBonuses[a] || 0
          const final = base + bonus
          const mod = getAbilityModifier(final)
          return (
            <div key={a} style={{ display:'flex', gap:'var(--space-sm)' }}>
              <dt><strong>{a.toUpperCase()}</strong></dt>
              <dd>{final} ({mod >= 0 ? `+${mod}` : mod}){bonus !== 0 && ` — base ${base} + ${bonus} racial`}</dd>
            </div>
          )
        })}
      </dl>
    </WizardStep>
  )
}
