import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettingsStore = create(
  persist(
    set => ({
      globalAdvancedMode: false,
      toggleGlobalAdvancedMode: () =>
        set(state => ({ globalAdvancedMode: !state.globalAdvancedMode })),
    }),
    { name: 'dnd-settings' }
  )
)
