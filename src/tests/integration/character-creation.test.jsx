import { describe, it, expect, beforeEach } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import { useHomebrewStore } from '../../store/homebrew'
import { useSettingsStore } from '../../store/settings'
import { CHAR, renderApp } from './helpers'

beforeEach(() => {
  useCharacterStore.setState({ characters: [] })
  useHomebrewStore.setState({ races: [], classes: [] })
  useSettingsStore.setState({ globalAdvancedMode: false })
})

describe('character creation flows', () => {
  it('completes wizard flow and lands on Sheet with character name', async () => {
    const user = userEvent.setup()
    renderApp('/new')

    // Step 1: Name & Biography
    await user.type(screen.getByLabelText(/character name/i), 'Thorn')
    await user.click(screen.getByRole('button', { name: /next/i }))

    // Step 2: Race — select Human (no subraces required)
    await user.selectOptions(screen.getByLabelText(/^race/i), 'human')
    await user.click(screen.getByRole('button', { name: /next/i }))

    // Step 3: Class — select Fighter (requires 2 skill choices)
    await user.selectOptions(screen.getByLabelText(/^class/i), 'fighter')
    const skillGroup = screen.getByRole('group', { name: /skill choices/i })
    const skillBoxes = within(skillGroup).getAllByRole('checkbox')
    await user.click(skillBoxes[0])
    await user.click(skillBoxes[1])
    await user.click(screen.getByRole('button', { name: /next/i }))

    // Step 4: Background — select first available
    const bgSelect = screen.getByLabelText(/^background/i)
    await user.selectOptions(bgSelect, bgSelect.options[1].value)
    await user.click(screen.getByRole('button', { name: /next/i }))

    // Step 5: Abilities (standard array — assign all 6 values)
    await user.selectOptions(screen.getByLabelText(/str score/i), '8')
    await user.selectOptions(screen.getByLabelText(/dex score/i), '14')
    await user.selectOptions(screen.getByLabelText(/con score/i), '13')
    await user.selectOptions(screen.getByLabelText(/int score/i), '15')
    await user.selectOptions(screen.getByLabelText(/wis score/i), '12')
    await user.selectOptions(screen.getByLabelText(/cha score/i), '10')
    await user.click(screen.getByRole('button', { name: /next/i }))

    // Step 6: Review — confirm creates character and navigates to Sheet
    await user.click(screen.getByRole('button', { name: /create character/i }))

    expect(screen.getByText('Thorn')).toBeInTheDocument()
  })

  it('navigates from roster card to character sheet', async () => {
    const user = userEvent.setup()
    useCharacterStore.setState({ characters: [CHAR] })
    renderApp('/')

    await user.click(screen.getByRole('button', { name: /^open$/i }))

    expect(screen.getByText('Aria')).toBeInTheDocument()
  })

  it('disables Next until character name is entered', async () => {
    renderApp('/new')

    const nextBtn = screen.getByRole('button', { name: /next/i })
    expect(nextBtn).toBeDisabled()

    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/character name/i), 'Thorn')

    expect(nextBtn).not.toBeDisabled()
  })

  it('back navigation preserves entered name', async () => {
    const user = userEvent.setup()
    renderApp('/new')

    await user.type(screen.getByLabelText(/character name/i), 'Thorn')
    await user.click(screen.getByRole('button', { name: /next/i }))
    await user.click(screen.getByRole('button', { name: /back/i }))

    expect(screen.getByLabelText(/character name/i)).toHaveValue('Thorn')
  })
})
