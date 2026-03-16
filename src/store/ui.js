import { create } from 'zustand'

export const useUiStore = create(set => ({
  activeCharacterId: null,
  activeTab: 'abilities',
  wizardStep: 1,
  setActiveCharacter: id => set({ activeCharacterId: id }),
  setActiveTab: tab => set({ activeTab: tab }),
  setWizardStep: step => set({ wizardStep: step }),
}))
