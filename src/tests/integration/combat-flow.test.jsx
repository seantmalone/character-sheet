import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import { useHomebrewStore } from '../../store/homebrew'
import { useSettingsStore } from '../../store/settings'
import { CHAR, CHAR_CHAIN, renderSheet } from './helpers'

beforeEach(() => {
  useCharacterStore.setState({ characters: [] })
  useHomebrewStore.setState({ races: [], classes: [] })
  useSettingsStore.setState({ globalAdvancedMode: false })
})

async function openCombatTab(user) {
  await user.click(screen.getByRole('tab', { name: /combat/i }))
}

describe('combat flow', () => {
  it('adds a custom attack to the table', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)
    await openCombatTab(user)

    // CHAR starts with 1 attack (Dagger); adding a custom attack gives 2 rows
    await user.click(screen.getByRole('button', { name: /add custom attack/i }))

    const { attacks } = useCharacterStore.getState().characters[0]
    expect(attacks).toHaveLength(2)
    expect(attacks[1].name).toBe('Custom Attack')
  })

  it('deletes an attack from the table', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)
    await openCombatTab(user)

    await user.click(screen.getByRole('button', { name: /delete dagger/i }))

    const { attacks } = useCharacterStore.getState().characters[0]
    expect(attacks).toHaveLength(0)
  })

  it('changing AC formula and selecting armor updates the AC display', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR_CHAIN)
    await openCombatTab(user)

    // Change formula to heavy to reveal the equipped armor dropdown
    await user.selectOptions(screen.getByRole('combobox', { name: /ac formula/i }), 'heavy')
    // Select chain mail from the now-visible dropdown
    await user.selectOptions(screen.getByRole('combobox', { name: /equipped armor/i }), 'armor-chain')

    expect(screen.getByTestId('ac-value')).toHaveTextContent('16')
  })

  it('toggles a condition on', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)
    await openCombatTab(user)

    const blindedBtn = screen.getByRole('button', { name: /^blinded$/i })
    expect(blindedBtn).toHaveAttribute('aria-pressed', 'false')

    await user.click(blindedBtn)

    expect(blindedBtn).toHaveAttribute('aria-pressed', 'true')
  })

  it('toggles a condition off', async () => {
    const user = userEvent.setup()
    renderSheet({ ...CHAR, conditions: { ...CHAR.conditions, blinded: true } })
    await openCombatTab(user)

    const blindedBtn = screen.getByRole('button', { name: /^blinded$/i })
    expect(blindedBtn).toHaveAttribute('aria-pressed', 'true')

    await user.click(blindedBtn)

    expect(blindedBtn).toHaveAttribute('aria-pressed', 'false')
  })

  it('increments and decrements exhaustion', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)
    await openCombatTab(user)

    await user.click(screen.getByRole('button', { name: /increase exhaustion/i }))
    await user.click(screen.getByRole('button', { name: /increase exhaustion/i }))
    await user.click(screen.getByRole('button', { name: /decrease exhaustion/i }))

    const { conditions } = useCharacterStore.getState().characters[0]
    expect(conditions.exhaustion).toBe(1)
  })
})
