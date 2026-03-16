import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PipTracker from '../../components/PipTracker/PipTracker'

describe('PipTracker', () => {
  it('renders correct number of pips', () => {
    render(<PipTracker total={4} used={2} onChange={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(4)
  })
  it('marks used pips as filled', () => {
    render(<PipTracker total={3} used={2} onChange={() => {}} />)
    const pips = screen.getAllByRole('button')
    expect(pips[0]).toHaveAttribute('aria-pressed', 'true')
    expect(pips[1]).toHaveAttribute('aria-pressed', 'true')
    expect(pips[2]).toHaveAttribute('aria-pressed', 'false')
  })
  it('calls onChange with new used count on pip click', async () => {
    const onChange = vi.fn()
    render(<PipTracker total={3} used={1} onChange={onChange} />)
    await userEvent.click(screen.getAllByRole('button')[2])
    expect(onChange).toHaveBeenCalledWith(3)
  })
})
