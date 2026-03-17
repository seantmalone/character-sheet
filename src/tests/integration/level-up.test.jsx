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

async function completeLevelUp(user, { asiFunc } = {}) {
  await user.click(screen.getByRole('button', { name: /level up/i }))
  await user.click(screen.getByRole('button', { name: /take average/i }))
  await user.click(screen.getByRole('button', { name: /^next$/i })) // HP done
  await user.click(screen.getByRole('button', { name: /^next$/i })) // New Features done
  await user.click(screen.getByRole('button', { name: /^next$/i })) // Spell Slots done
  // Spells step: pick first 2 available checkboxes
  const checkboxes = screen.getAllByRole('checkbox')
  await user.click(checkboxes[0])
  await user.click(checkboxes[1])
  await user.click(screen.getByRole('button', { name: /^next$/i })) // Spells done
  // ASI step
  if (asiFunc) await asiFunc()
  await user.click(screen.getByRole('button', { name: /^next$/i })) // ASI done
  await user.click(screen.getByRole('button', { name: /confirm level up/i }))
}

describe('level up flow', () => {
  it('increases character level by 1', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)

    await completeLevelUp(user, {
      asiFunc: async () => {
        await user.selectOptions(screen.getByRole('combobox', { name: /\+2 ability/i }), 'int')
      },
    })

    const { meta } = useCharacterStore.getState().characters[0]
    expect(meta.level).toBe(4)
  })

  it('increases hp max by take-average gain + CON modifier', async () => {
    // Wizard d6: avg = floor(6/2)+1 = 4; CON mod = +1 (CON 12); hpGain = 5; new max = 21
    const user = userEvent.setup()
    renderSheet(CHAR)

    await completeLevelUp(user, {
      asiFunc: async () => {
        await user.selectOptions(screen.getByRole('combobox', { name: /\+2 ability/i }), 'int')
      },
    })

    const { hp } = useCharacterStore.getState().characters[0]
    expect(hp.max).toBe(21)
  })

  it('level-2 spell slot max increases after level up', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)

    await completeLevelUp(user, {
      asiFunc: async () => {
        await user.selectOptions(screen.getByRole('combobox', { name: /\+2 ability/i }), 'int')
      },
    })

    const { spells } = useCharacterStore.getState().characters[0]
    // Level 4 wizard progression: level-2 slots increase from 2 to 3
    expect(spells.slots[2].max).toBe(3)
  })

  it('ASI +2 to one ability score applies correctly', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)

    await completeLevelUp(user, {
      asiFunc: async () => {
        // "+2 to one ability" is the default radio; just select INT
        await user.selectOptions(screen.getByRole('combobox', { name: /\+2 ability/i }), 'int')
      },
    })

    const { abilityScores } = useCharacterStore.getState().characters[0]
    expect(abilityScores.int).toBe(19) // was 17
  })

  it('ASI +1/+1 split applies to both chosen abilities', async () => {
    const user = userEvent.setup()
    renderSheet(CHAR)

    await completeLevelUp(user, {
      asiFunc: async () => {
        // Click the "+1 to two different abilities" radio (second radio in the group)
        const radios = screen.getAllByRole('radio')
        await user.click(radios[1]) // second radio = split mode
        // Two selects appear (no aria-label); pick STR for first, DEX for second
        const selects = screen.getAllByRole('combobox')
        // The split ASI selects have no aria-label; filter them out from any other selects
        const asiSelects = selects.filter(s => !s.getAttribute('aria-label'))
        await user.selectOptions(asiSelects[0], 'str')
        await user.selectOptions(asiSelects[1], 'dex')
      },
    })

    const { abilityScores } = useCharacterStore.getState().characters[0]
    expect(abilityScores.str).toBe(9)  // was 8
    expect(abilityScores.dex).toBe(17) // was 16
  })
})
