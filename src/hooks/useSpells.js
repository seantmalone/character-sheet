import { useMemo } from 'react'
import spellsData from '../data/spells.json'

export function useSpells(character, { search = '', level = 'all', school = 'all', prepared = 'all' } = {}) {
  const { spells, customSpells, meta } = character
  const isWizard = meta.class === 'wizard'
  const isCleric = meta.class === 'cleric'

  const baseSpells = useMemo(() => {
    if (isWizard) return spellsData.filter(s => spells.known.includes(s.id))
    if (isCleric) return spellsData.filter(s => s.classes.includes('cleric'))
    return []
  }, [isWizard, isCleric, spells.known])

  return useMemo(() => {
    const all = [...baseSpells, ...customSpells]
    return all.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
      const matchLevel = level === 'all' || String(s.level) === String(level)
      const matchSchool = school === 'all' || s.school === school
      const matchPrepared =
        prepared === 'all' ||
        (prepared === 'prepared' && spells.prepared.includes(s.id)) ||
        (prepared === 'known' && spells.known.includes(s.id))
      return matchSearch && matchLevel && matchSchool && matchPrepared
    })
  }, [baseSpells, customSpells, search, level, school, prepared, spells.prepared, spells.known])
}
