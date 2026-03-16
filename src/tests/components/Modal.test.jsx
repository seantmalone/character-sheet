import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../../components/Modal/Modal'

describe('Modal', () => {
  it('renders children when open', () => {
    render(<Modal open title="Test Modal"><p>Content</p></Modal>)
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
  it('renders nothing when closed', () => {
    render(<Modal open={false} title="Test Modal"><p>Content</p></Modal>)
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
  })
  it('calls onClose when backdrop clicked', async () => {
    const onClose = vi.fn()
    render(<Modal open title="Test" onClose={onClose}><p>hi</p></Modal>)
    await userEvent.click(screen.getByTestId('modal-backdrop'))
    expect(onClose).toHaveBeenCalled()
  })
})
