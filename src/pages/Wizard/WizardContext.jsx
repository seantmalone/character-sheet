import { createContext, useContext, useState } from 'react'

export const EMPTY_DRAFT = {
  meta: {
    characterName: '', playerName: '', alignment: 'True Neutral',
    race: null, subrace: null, class: null, background: null,
    level: 1, xp: 0, inspiration: false, secondaryClass: null,
  },
  abilityScores: { str: null, dex: null, con: null, int: null, wis: null, cha: null },
  classSkillChoices: [],
  settings: { advancedMode: false, abilityScoreMethod: 'standard-array' },
}

const WizardContext = createContext(null)

export function WizardProvider({ children, globalAdvancedMode }) {
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState({
    ...EMPTY_DRAFT,
    settings: { advancedMode: globalAdvancedMode, abilityScoreMethod: 'standard-array' },
  })

  function updateMeta(patch) { setDraft(p => ({ ...p, meta: { ...p.meta, ...patch } })) }
  function updateAbilities(patch) { setDraft(p => ({ ...p, abilityScores: { ...p.abilityScores, ...patch } })) }
  function updateSettings(patch) { setDraft(p => ({ ...p, settings: { ...p.settings, ...patch } })) }
  function setClassSkillChoices(choices) { setDraft(p => ({ ...p, classSkillChoices: choices })) }
  function resetAbilityScores(scores) { setDraft(p => ({ ...p, abilityScores: scores })) }

  return (
    <WizardContext.Provider value={{ step, setStep, draft, updateMeta, updateAbilities, updateSettings, setClassSkillChoices, resetAbilityScores }}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() { return useContext(WizardContext) }
