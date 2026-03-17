import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
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

// Helper: open Short Rest modal via the rest menu select
async function openShortRest(user) {
  await user.selectOptions(screen.getByRole('combobox', { name: /rest menu/i }), 'short')
}

// Helper: open Long Rest modal
async function openLongRest(user) {
  await user.selectOptions(screen.getByRole('combobox', { name: /rest menu/i }), 'long')
}

describe('rest and recovery flows', () => {
  it('short rest increases current HP', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)

    await openShortRest(user)
    await user.click(screen.getByRole('button', { name: /roll d6/i }))
    await user.click(screen.getByRole('button', { name: /finish rest/i }))

    const { hp } = useCharacterStore.getState().characters[0]
    expect(hp.current).toBeGreaterThan(5)
    expect(hp.current).toBeLessThanOrEqual(16)
  })

  it('short rest decreases hit dice remaining', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)

    await openShortRest(user)
    await user.click(screen.getByRole('button', { name: /roll d6/i }))
    await user.click(screen.getByRole('button', { name: /finish rest/i }))

    const { hp } = useCharacterStore.getState().characters[0]
    expect(hp.hitDiceRemaining).toBe(2)
  })

  it('short rest restores short-rest features to max uses', async () => {
    const user = userEvent.setup()
    renderSheet({ ...CHAR, features: [{ ...CHAR.features[0], uses: 0 }] })

    await openShortRest(user)
    // Finish without rolling — features recharge regardless
    await user.click(screen.getByRole('button', { name: /finish rest/i }))

    const { features } = useCharacterStore.getState().characters[0]
    expect(features[0].uses).toBe(1)
  })

  it('long rest restores HP to maximum', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)

    await openLongRest(user)
    await user.click(screen.getByRole('button', { name: /take long rest/i }))

    const { hp } = useCharacterStore.getState().characters[0]
    expect(hp.current).toBe(16)
  })

  it('long rest resets all spell slots to 0 used', async () => {
    const user = userEvent.setup()
    renderSheet({ ...CHAR, spells: { ...CHAR.spells, slots: { ...CHAR.spells.slots, 1: { max: 4, used: 3 }, 2: { max: 2, used: 2 } } } })

    await openLongRest(user)
    await user.click(screen.getByRole('button', { name: /take long rest/i }))

    const { spells } = useCharacterStore.getState().characters[0]
    for (let i = 1; i <= 9; i++) {
      expect(spells.slots[i].used).toBe(0)
    }
  })

  it('long rest restores hit dice up to floor(total / 2)', async () => {
    const user = userEvent.setup()
    renderSheet({ ...CHAR, hp: { ...CHAR.hp, hitDiceRemaining: 0 } })

    await openLongRest(user)
    await user.click(screen.getByRole('button', { name: /take long rest/i }))

    const { hp } = useCharacterStore.getState().characters[0]
    expect(hp.hitDiceRemaining).toBe(Math.max(1, Math.floor(3 / 2)))
  })

  it('long rest resets arcane recovery to unused', async () => {
    const user = userEvent.setup()
    renderSheet({ ...CHAR, spells: { ...CHAR.spells, arcaneRecoveryUsed: true } })

    await openLongRest(user)
    await user.click(screen.getByRole('button', { name: /take long rest/i }))

    const { spells } = useCharacterStore.getState().characters[0]
    expect(spells.arcaneRecoveryUsed).toBe(false)
  })
})
