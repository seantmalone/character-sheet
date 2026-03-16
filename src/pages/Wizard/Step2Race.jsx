import { useWizard } from './WizardContext'
import WizardStep from './WizardStep'
import races from '../../data/races.json'
import { useHomebrewStore } from '../../store/homebrew'

export default function Step2Race() {
  const { draft, updateMeta } = useWizard()
  const { meta, settings } = draft
  const { races: homebrewRaces } = useHomebrewStore()
  const allRaces = settings.advancedMode ? [...races, ...homebrewRaces] : races
  const selected = allRaces.find(r => r.id === meta.race)
  const subraces = selected?.subraces || []
  const subraceData = subraces.find(s => s.id === meta.subrace)
  const canProceed = meta.race !== null && (subraces.length === 0 || meta.subrace !== null)

  function handleRaceChange(id) { updateMeta({ race: id || null, subrace: null }) }

  // Merge base + subrace ability bonuses for display
  const raceBonuses = selected?.abilityScoreIncreases || {}
  const subraceBonuses = subraceData?.abilityScoreIncreases || {}
  const bonuses = Object.fromEntries(
    [...new Set([...Object.keys(raceBonuses), ...Object.keys(subraceBonuses)])].map(k => [
      k, (raceBonuses[k] || 0) + (subraceBonuses[k] || 0)
    ])
  )
  const bonusText = Object.entries(bonuses).filter(([, v]) => v > 0).map(([k, v]) => `${k.toUpperCase()} +${v}`).join(', ')
  const traits = [...(selected?.traits || []), ...(subraceData?.traits || [])]

  return (
    <WizardStep title="Choose Your Race" nextDisabled={!canProceed}>
      <label>
        Race
        <select value={meta.race || ''} onChange={e => handleRaceChange(e.target.value)}>
          <option value="">Select a race…</option>
          {allRaces.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </label>
      {subraces.length > 0 && (
        <label>
          Subrace
          <select value={meta.subrace || ''} onChange={e => updateMeta({ subrace: e.target.value || null })}>
            <option value="">Select a subrace…</option>
            {subraces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
      )}
      {selected && (
        <div>
          {bonusText && <p><strong>Ability Bonuses:</strong> {bonusText}</p>}
          <p><strong>Speed:</strong> {subraceData?.speed ?? selected.speed} ft.</p>
          {traits.map(t => (
            <details key={t.name}><summary><strong>{t.name}</strong></summary><p>{t.description}</p></details>
          ))}
        </div>
      )}
    </WizardStep>
  )
}
