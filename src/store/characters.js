import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCharacterStore = create(
  persist(
    (set, get) => ({
      characters: [],

      addCharacter(character) {
        set(state => ({ characters: [...state.characters, character] }))
      },

      updateCharacter(id, partial) {
        set(state => ({
          characters: state.characters.map(c =>
            c.id === id ? mergeDeep(c, partial) : c
          ),
        }))
      },

      deleteCharacter(id) {
        set(state => ({ characters: state.characters.filter(c => c.id !== id) }))
      },

      updateHp(id, newCurrent) {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== id) return c
            const deathSaves = newCurrent > 0
              ? { successes: 0, failures: 0 }
              : c.deathSaves
            return { ...c, hp: { ...c.hp, current: Math.max(0, newCurrent) }, deathSaves }
          }),
        }))
      },
    }),
    { name: 'dnd-characters' }
  )
)

function mergeDeep(target, source) {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeDeep(target[key] ?? {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  return result
}
