import { useWizard } from './WizardContext'
import WizardStep from './WizardStep'
import backgrounds from '../../data/backgrounds.json'

export default function Step4Background() {
  const { draft, updateMeta } = useWizard()
  const { meta } = draft
  const selected = backgrounds.find(b => b.id === meta.background)

  return (
    <WizardStep title="Choose Your Background" nextDisabled={meta.background === null}>
      <label>
        Background
        <select value={meta.background || ''} onChange={e => updateMeta({ background: e.target.value || null })}>
          <option value="">Select a background…</option>
          {backgrounds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </label>
      {selected && (
        <div>
          <p><strong>Skills:</strong> {selected.skillProficiencies.join(', ')}</p>
          {selected.toolProficiencies.length > 0 && (
            <p><strong>Tools:</strong> {selected.toolProficiencies.join(', ')}</p>
          )}
          {selected.languages?.length > 0 && (
            <p><strong>Languages:</strong> {selected.languages.join(', ')}</p>
          )}
          <details>
            <summary><strong>Feature — {selected.feature.name}</strong></summary>
            <p>{selected.feature.description}</p>
          </details>
        </div>
      )}
    </WizardStep>
  )
}
