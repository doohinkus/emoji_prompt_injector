// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<App />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('allows tabbing through emoji buttons', async () => {
    render(<App />)
    const buttons = screen.getAllByRole('option')
    expect(buttons.length).toBeGreaterThan(0)
    buttons[0].focus()
    expect(buttons[0]).toHaveFocus()
    await userEvent.keyboard('[ArrowRight]')
    expect(buttons[1]).toHaveFocus()
  })

  it('marks selected emoji with aria-selected', async () => {
    render(<App />)
    const button = screen.getByRole('option', { name: 'Sparkles' })
    expect(button).toHaveAttribute('aria-selected', 'true')
  })

  it('has a labelled emoji grid', () => {
    render(<App />)
    const grid = screen.getByRole('listbox')
    expect(grid).toHaveAttribute('aria-labelledby', 'emoji-grid-label')
  })

  it('has accessible textareas', () => {
    render(<App />)
    const textareas = screen.getAllByRole('textbox')
    expect(textareas.length).toBe(2)
    textareas.forEach((ta) => expect(ta).toHaveAccessibleName())
  })
})
