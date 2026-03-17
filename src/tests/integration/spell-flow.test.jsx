import { describe, it, expect, beforeEach } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import { useHomebrewStore } from '../../store/homebrew'
import { useSettingsStore } from '../../store/settings'
import { CHAR, renderSheet } from './helpers'

beforeEach(() => {
  useCharacterStore.setState({ characters: [] })
  useHomebrewStore.setState({ races: [], classes: [] })
  useSettingsStore.setState({ globalAdvancedMode: false })
})

async function openSpellsTab(user) {
  await user.click(screen.getByRole('tab', { name: /spells/i }))
}

describe('spell flow', () => {
  it('prepares an unprepared known spell', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)
    await openSpellsTab(user)

    // shield is known but not prepared
    await user.click(screen.getByRole('button', { name: /prepare shield/i }))

    const { spells } = useCharacterStore.getState().characters[0]
    expect(spells.prepared).toContain('shield')
  })

  it('unprepares a prepared spell', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)
    await openSpellsTab(user)

    await user.click(screen.getByRole('button', { name: /unprepare magic missile/i }))

    const { spells } = useCharacterStore.getState().characters[0]
    expect(spells.prepared).not.toContain('magic-missile')
  })

  it('clicking an unfilled slot pip increments used count', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)
    await openSpellsTab(user)

    // CHAR slots[1].used=1 → pip 0 filled, pip 1 unfilled
    // "Slot 1 pip 2" is the second pip (index 1) — clicking it calls onChange(2)
    await user.click(screen.getByRole('button', { name: 'Slot 1 pip 2' }))

    const { spells } = useCharacterStore.getState().characters[0]
    expect(spells.slots[1].used).toBe(2)
  })

  it('arcane recovery decrements used slot count', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)
    await openSpellsTab(user)

    await user.click(screen.getByRole('button', { name: /arcane recovery/i }))

    const dialog = screen.getByRole('dialog', { name: /arcane recovery/i })
    // Check the level-1 slot checkbox (label: "Level 1 slot (1 used)")
    await user.click(within(dialog).getByLabelText(/level 1 slot/i))
    await user.click(within(dialog).getByRole('button', { name: /^recover$/i }))

    const { spells } = useCharacterStore.getState().characters[0]
    expect(spells.slots[1].used).toBe(0)
  })

  it('long rest resets slot pip display to all unfilled', async () => {
    const user = userEvent.setup()
    const charWithFullSlots = {
      ...CHAR,
      spells: { ...CHAR.spells, slots: { ...CHAR.spells.slots, 1: { max: 4, used: 4 } } },
    }
    renderSheet(charWithFullSlots)
    await openSpellsTab(user)

    // All 4 level-1 pips filled before rest
    expect(screen.getByRole('button', { name: 'Slot 1 pip 1' })).toHaveAttribute('aria-pressed', 'true')

    // Take long rest from rest menu
    await user.selectOptions(screen.getByRole('combobox', { name: /rest menu/i }), 'long')
    await user.click(screen.getByRole('button', { name: /take long rest/i }))

    // Navigate back to Spells tab
    await openSpellsTab(user)

    expect(screen.getByRole('button', { name: 'Slot 1 pip 1' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Slot 1 pip 4' })).toHaveAttribute('aria-pressed', 'false')
  })
})
