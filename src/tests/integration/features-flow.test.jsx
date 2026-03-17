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

async function openFeaturesTab(user) {
  await user.click(screen.getByRole('tab', { name: /features/i }))
}

describe('features flow', () => {
  it('adds a feature with uses and a pip tracker appears', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)
    await openFeaturesTab(user)

    await user.click(screen.getByRole('button', { name: /add feature/i }))
    await user.type(screen.getByRole('textbox', { name: /name/i }), 'Second Wind')
    await user.clear(screen.getByRole('spinbutton', { name: /max uses/i }))
    await user.type(screen.getByRole('spinbutton', { name: /max uses/i }), '1')
    await user.selectOptions(screen.getByRole('combobox', { name: /recharge/i }), 'short-rest')
    await user.click(screen.getByRole('button', { name: /^add$/i }))

    const { features } = useCharacterStore.getState().characters[0]
    const secondWind = features.find(f => f.name === 'Second Wind')
    expect(secondWind).toBeDefined()
    expect(secondWind.maxUses).toBe(1)
  })

  it('clicking a filled pip on a feature with uses marks one use consumed', async () => {
    const user = userEvent.setup()
    renderSheet({
      ...CHAR,
      features: [{ ...CHAR.features[0], uses: 2, maxUses: 2 }],
    })
    await openFeaturesTab(user)

    // Get the Arcane Recovery card and find its pip buttons
    // h4.name → div.headerMain → div.header → div.card
    const card = screen.getByText('Arcane Recovery').closest('[class]').parentElement.parentElement.parentElement
    const pips = within(card).getAllByRole('button').filter(b => b.hasAttribute('aria-pressed'))
    // Click pip index 1 (second pip, filled since 1 < used=2) → onChange(1) → uses = 2-1 = 1
    await user.click(pips[1])

    const { features } = useCharacterStore.getState().characters[0]
    expect(features[0].uses).toBe(1)
  })

  it('short rest recharges a short-rest feature pip display to full', async () => {
    const user = userEvent.setup()
    renderSheet({ ...CHAR, features: [{ ...CHAR.features[0], uses: 0 }] })
    await openFeaturesTab(user)

    // Verify depleted: Arcane Recovery pip shows 0 filled (uses=0 → used prop=0 → pip 0 is unfilled)
    // h4.name → div.headerMain → div.header → div.card
    const cardBefore = screen.getByText('Arcane Recovery').closest('[class]').parentElement.parentElement.parentElement
    const pipsBefore = within(cardBefore).getAllByRole('button').filter(b => b.hasAttribute('aria-pressed'))
    expect(pipsBefore[0]).toHaveAttribute('aria-pressed', 'false')

    // Take short rest (no rolling needed)
    await user.selectOptions(screen.getByRole('combobox', { name: /rest menu/i }), 'short')
    await user.click(screen.getByRole('button', { name: /finish rest/i }))

    // Return to Features tab
    await openFeaturesTab(user)

    // h4.name → div.headerMain → div.header → div.card
    const cardAfter = screen.getByText('Arcane Recovery').closest('[class]').parentElement.parentElement.parentElement
    const pipsAfter = within(cardAfter).getAllByRole('button').filter(b => b.hasAttribute('aria-pressed'))
    expect(pipsAfter[0]).toHaveAttribute('aria-pressed', 'true')
  })

  it('deletes a feature', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)
    await openFeaturesTab(user)

    await user.click(screen.getByRole('button', { name: /delete arcane recovery/i }))

    const { features } = useCharacterStore.getState().characters[0]
    expect(features).toHaveLength(0)
  })
})
