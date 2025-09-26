import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils/test-utils'
import { Button } from '../button'

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary')
  })

  it('renders different variants', () => {
    render(<Button variant="destructive">Delete</Button>)

    const button = screen.getByRole('button', { name: 'Delete' })
    expect(button).toHaveClass('bg-destructive')
  })

  it('renders different sizes', () => {
    render(<Button size="lg">Large Button</Button>)

    const button = screen.getByRole('button', { name: 'Large Button' })
    expect(button).toHaveClass('min-h-12')
  })

  it('handles click events', () => {
    let clicked = false
    render(<Button onClick={() => { clicked = true }}>Click me</Button>)

    const button = screen.getByRole('button', { name: 'Click me' })
    button.click()

    expect(clicked).toBe(true)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)

    const button = screen.getByRole('button', { name: 'Disabled Button' })
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:opacity-50')
  })
})