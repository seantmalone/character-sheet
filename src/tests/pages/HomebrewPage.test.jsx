import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { useHomebrewStore } from '../../store/homebrew'
import HomebrewPage from '../../pages/Homebrew/HomebrewPage'

function renderPage() {
  return render(<MemoryRouter><HomebrewPage /></MemoryRouter>)
}

describe('HomebrewPage', () => {
  beforeEach(() => { useHomebrewStore.setState({ races: [], classes: [] }) })

  it('shows race and class builder sections', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /homebrew races/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /homebrew classes/i })).toBeInTheDocument()
  })

  it('adding a homebrew race stores it', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /add race/i }))
    await userEvent.type(screen.getByPlaceholderText(/race name/i), 'Tiefling')
    await userEvent.click(screen.getByRole('button', { name: /save race/i }))
    expect(useHomebrewStore.getState().races).toHaveLength(1)
    expect(useHomebrewStore.getState().races[0].name).toBe('Tiefling')
  })

  it('adding a homebrew class stores it', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /add class/i }))
    await userEvent.type(screen.getByPlaceholderText(/class name/i), 'Paladin')
    await userEvent.click(screen.getByRole('button', { name: /save class/i }))
    expect(useHomebrewStore.getState().classes).toHaveLength(1)
    expect(useHomebrewStore.getState().classes[0].name).toBe('Paladin')
  })

  it('deleting a homebrew race removes it', async () => {
    useHomebrewStore.setState({ races: [{ id: 'r1', name: 'Tiefling', speed: 30, size: 'Medium', darkvision: 60, abilityScoreIncreases: {}, traits: [], languages: ['common'], subraces: [] }], classes: [] })
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /delete tiefling/i }))
    expect(useHomebrewStore.getState().races).toHaveLength(0)
  })

  it('save is blocked when race name is empty', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /add race/i }))
    expect(screen.getByRole('button', { name: /save race/i })).toBeDisabled()
  })
})
