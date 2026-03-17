import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import { useHomebrewStore } from '../../store/homebrew'
import { useSettingsStore } from '../../store/settings'
import { renderApp } from './helpers'

beforeEach(() => {
  useCharacterStore.setState({ characters: [] })
  useHomebrewStore.setState({ races: [], classes: [] })
  useSettingsStore.setState({ globalAdvancedMode: false })
})

describe('homebrew flows', () => {
  it('creates a custom race and it appears in the list', async () => {
    const user = userEvent.setup()
    renderApp('/homebrew')

    await user.click(screen.getByRole('button', { name: /add race/i }))
    await user.type(screen.getByRole('textbox', { name: /race name/i }), 'Tiefling')
    await user.click(screen.getByRole('button', { name: /save race/i }))

    expect(screen.getByText('Tiefling')).toBeInTheDocument()
  })

  it('deletes a custom race', async () => {
    useHomebrewStore.setState({
      races: [{ id: 'r1', name: 'Tiefling', abilityScoreIncreases: {}, traits: [], speed: 30, subraces: [] }],
      classes: [],
    })
    const user = userEvent.setup()
    renderApp('/homebrew')

    await user.click(screen.getByRole('button', { name: /delete tiefling/i }))

    expect(screen.queryByText('Tiefling')).not.toBeInTheDocument()
  })

  it('creates a custom class and it appears in the list', async () => {
    const user = userEvent.setup()
    renderApp('/homebrew')

    await user.click(screen.getByRole('button', { name: /add class/i }))
    await user.type(screen.getByRole('textbox', { name: /class name/i }), 'Artificer')
    await user.click(screen.getByRole('button', { name: /save class/i }))

    expect(screen.getByText('Artificer')).toBeInTheDocument()
  })

  it('custom race appears in wizard Step 2 when advanced mode is on', async () => {
    // MUST set stores before rendering — WizardProvider reads globalAdvancedMode once at mount
    useSettingsStore.setState({ globalAdvancedMode: true })
    useHomebrewStore.setState({
      races: [{ id: 'tiefling', name: 'Tiefling', abilityScoreIncreases: {}, traits: [], speed: 30, subraces: [] }],
      classes: [],
    })

    const user = userEvent.setup()
    renderApp('/new')

    // Advance past Step 1 (name required)
    await user.type(screen.getByLabelText(/character name/i), 'Test')
    await user.click(screen.getByRole('button', { name: /next/i }))

    // Step 2: Race — Tiefling should be in the dropdown
    const raceSelect = screen.getByLabelText(/^race/i)
    const options = Array.from(raceSelect.options).map(o => o.text)
    expect(options).toContain('Tiefling')
  })
})
