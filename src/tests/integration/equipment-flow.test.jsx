import { describe, it, expect, beforeEach } from 'vitest'
import { screen, within } from '@testing-library/react'
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

async function openEquipmentTab(user) {
  await user.click(screen.getByRole('tab', { name: /equipment/i }))
}

async function openCombatTab(user) {
  await user.click(screen.getByRole('tab', { name: /combat/i }))
}

describe('equipment flow', () => {
  it('adds an item from the catalog', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)
    await openEquipmentTab(user)

    await user.click(screen.getByRole('button', { name: /add from catalog/i }))
    await user.selectOptions(screen.getByRole('combobox', { name: /add from catalog/i }), 'dagger')

    const { equipment } = useCharacterStore.getState().characters[0]
    expect(equipment.some(e => e.name === 'Dagger')).toBe(true)
  })

  it('adds a custom item', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)
    await openEquipmentTab(user)

    await user.click(screen.getByRole('button', { name: /add custom item/i }))
    await user.type(screen.getByPlaceholderText(/item name/i), 'Torch')
    await user.click(screen.getByRole('button', { name: /^add$/i }))

    const { equipment } = useCharacterStore.getState().characters[0]
    expect(equipment.some(e => e.name === 'Torch')).toBe(true)
  })

  it('toggling the equip checkbox updates the store', async () => {
    const user = userEvent.setup()
    // Start with leather armor unequipped so we can observe the change
    renderSheet({
      ...CHAR,
      equipment: [{ ...CHAR.equipment[0], equipped: false }],
    })
    await openEquipmentTab(user)

    await user.click(screen.getByRole('checkbox', { name: /equip leather armor/i }))

    const { equipment } = useCharacterStore.getState().characters[0]
    expect(equipment[0].equipped).toBe(true)
  })

  it('deletes an item', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)
    await openEquipmentTab(user)

    await user.click(screen.getByRole('button', { name: /delete leather armor/i }))

    const { equipment } = useCharacterStore.getState().characters[0]
    expect(equipment).toHaveLength(0)
  })

  it('updating gold in the currency row persists to the store', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)
    await openEquipmentTab(user)

    const gpInput = screen.getByRole('spinbutton', { name: /gp/i })
    await user.clear(gpInput)
    await user.type(gpInput, '50')

    const { currency } = useCharacterStore.getState().characters[0]
    expect(currency.gp).toBe(50)
  })

  it('selecting chain mail on combat tab updates AC to 16', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR_CHAIN)
    await openCombatTab(user)

    await user.selectOptions(screen.getByRole('combobox', { name: /ac formula/i }), 'heavy')
    await user.selectOptions(screen.getByRole('combobox', { name: /equipped armor/i }), 'armor-chain')

    expect(screen.getByTestId('ac-value')).toHaveTextContent('16')
  })
})
