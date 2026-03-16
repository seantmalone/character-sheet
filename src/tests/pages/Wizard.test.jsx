import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import Wizard from '../../pages/Wizard/Wizard'

function renderWizard() {
  return render(<MemoryRouter><Wizard /></MemoryRouter>)
}

describe('Wizard', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [] }) })

  it('Next is disabled on step 1 when name is empty, enabled when filled', async () => {
    renderWizard()
    const nextBtn = screen.getByRole('button', { name: /next/i })
    expect(nextBtn).toBeDisabled()
    await userEvent.type(screen.getByPlaceholderText(/enter character name/i), 'Aria')
    expect(nextBtn).not.toBeDisabled()
  })

  it('Step 5 Next disabled until all 6 standard array scores assigned', async () => {
    renderWizard()
    // fill name → advance
    await userEvent.type(screen.getByPlaceholderText(/enter character name/i), 'Aria')
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // step 2: select race
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /race/i }), 'human')
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // step 3: select class, pick skills
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /class/i }), 'fighter')
    const skillBoxes = screen.getAllByRole('checkbox')
    await userEvent.click(skillBoxes[0])
    await userEvent.click(skillBoxes[1])
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // step 4: select background
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /background/i }), 'soldier')
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // step 5: all dropdowns unset → Next disabled
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
    // assign all 6 values via selects
    const selects = screen.getAllByRole('combobox')
    let remaining = [15, 14, 13, 12, 10, 8]
    for (let i = 0; i < selects.length; i++) {
      await userEvent.selectOptions(selects[i], String(remaining[i]))
    }
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled()
  })
})
