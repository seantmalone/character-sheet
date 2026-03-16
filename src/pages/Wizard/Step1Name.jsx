import { useWizard } from './WizardContext'
import WizardStep from './WizardStep'

const ALIGNMENTS = [
  'Lawful Good','Neutral Good','Chaotic Good',
  'Lawful Neutral','True Neutral','Chaotic Neutral',
  'Lawful Evil','Neutral Evil','Chaotic Evil',
]

export default function Step1Name() {
  const { draft, updateMeta } = useWizard()
  const { meta } = draft
  const canProceed = meta.characterName.trim().length > 0

  return (
    <WizardStep title="Name & Biography" nextDisabled={!canProceed}>
      <label>
        Character Name <span aria-hidden="true">*</span>
        <input type="text" value={meta.characterName} autoFocus required
          onChange={e => updateMeta({ characterName: e.target.value })}
          placeholder="Enter character name" />
      </label>
      <label>
        Player Name
        <input type="text" value={meta.playerName}
          onChange={e => updateMeta({ playerName: e.target.value })}
          placeholder="Optional" />
      </label>
      <label>
        Alignment
        <select value={meta.alignment} onChange={e => updateMeta({ alignment: e.target.value })}>
          {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </label>
    </WizardStep>
  )
}
