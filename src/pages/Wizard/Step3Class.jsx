import { useWizard } from './WizardContext'
import WizardStep from './WizardStep'
import classes from '../../data/classes.json'
import skills from '../../data/skills.json'
import { useHomebrewStore } from '../../store/homebrew'

export default function Step3Class() {
  const { draft, updateMeta, setClassSkillChoices } = useWizard()
  const { meta, classSkillChoices, settings } = draft
  const { classes: homebrewClasses } = useHomebrewStore()
  const allClasses = settings.advancedMode ? [...classes, ...homebrewClasses] : classes
  const selected = allClasses.find(c => c.id === meta.class)
  const numChoices = selected?.skillChoices?.count || 0
  const canProceed = meta.class !== null && classSkillChoices.length === numChoices

  function toggleSkill(id) {
    if (classSkillChoices.includes(id)) {
      setClassSkillChoices(classSkillChoices.filter(s => s !== id))
    } else if (classSkillChoices.length < numChoices) {
      setClassSkillChoices([...classSkillChoices, id])
    }
  }

  function handleClassChange(id) {
    updateMeta({ class: id || null })
    setClassSkillChoices([])
  }

  return (
    <WizardStep title="Choose Your Class" nextDisabled={!canProceed}>
      <label>
        Class
        <select value={meta.class || ''} onChange={e => handleClassChange(e.target.value)}>
          <option value="">Select a class…</option>
          {allClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>
      {selected && (
        <div>
          <p><strong>Hit Die:</strong> d{selected.hitDie}</p>
          <p><strong>Saving Throws:</strong> {selected.savingThrowProficiencies.map(s => s.toUpperCase()).join(', ')}</p>
          {selected.armorProficiencies.length > 0 && (
            <p><strong>Armor:</strong> {selected.armorProficiencies.join(', ')}</p>
          )}
          <p><strong>Weapons:</strong> {selected.weaponProficiencies.join(', ')}</p>
          <p><strong>Choose {numChoices} skills:</strong></p>
          <div role="group" aria-label="Skill choices">
            {(selected.skillChoices?.options || []).map(skillId => {
              const skill = skills.find(s => s.id === skillId)
              const checked = classSkillChoices.includes(skillId)
              const disabled = !checked && classSkillChoices.length >= numChoices
              return (
                <label key={skillId}>
                  <input type="checkbox" checked={checked} disabled={disabled}
                    onChange={() => toggleSkill(skillId)} />
                  {skill?.name || skillId}
                </label>
              )
            })}
          </div>
          {(selected.features || []).filter(f => f.level === 1).map(f => (
            <details key={f.name}><summary><strong>{f.name}</strong></summary><p>{f.description}</p></details>
          ))}
        </div>
      )}
    </WizardStep>
  )
}
