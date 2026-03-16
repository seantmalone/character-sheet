import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useHomebrewStore = create(
  persist(
    (set, get) => ({
      races: [],
      classes: [],
      addRace: race => set(state => ({ races: [...state.races, race] })),
      updateRace: (id, data) =>
        set(state => ({ races: state.races.map(r => r.id === id ? { ...r, ...data } : r) })),
      deleteRace: id =>
        set(state => ({ races: state.races.filter(r => r.id !== id) })),
      addClass: cls => set(state => ({ classes: [...state.classes, cls] })),
      updateClass: (id, data) =>
        set(state => ({ classes: state.classes.map(c => c.id === id ? { ...c, ...data } : c) })),
      deleteClass: id =>
        set(state => ({ classes: state.classes.filter(c => c.id !== id) })),
    }),
    { name: 'dnd-homebrew' }
  )
)
