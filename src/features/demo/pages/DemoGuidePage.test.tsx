import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DEMO_ACCOUNTS } from '@/features/demo/constants/demo-guide'
import { DemoGuidePage } from './DemoGuidePage'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('DemoGuidePage', () => {
  it('lists every demo account with its email and password', () => {
    render(<DemoGuidePage />)

    for (const account of DEMO_ACCOUNTS) {
      const card = screen.getByText(account.email).closest('[data-slot="card"]') as HTMLElement
      expect(within(card).getByText(account.label)).toBeInTheDocument()
      expect(within(card).getByText(account.password)).toBeInTheDocument()
    }
  })

  it('shows the demo flow for each role and switches between roles', async () => {
    const user = userEvent.setup()
    render(<DemoGuidePage />)

    expect(screen.getByText('Academic structure')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Student' }))
    expect(screen.getByText('Results and result card')).toBeInTheDocument()
  })

  it('asks the presenter to try a read-only refusal on the AI assistant', () => {
    render(<DemoGuidePage />)

    expect(screen.getByText('Change my attendance to 100 percent.')).toBeInTheDocument()
  })

  it('copies a credential to the clipboard', async () => {
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    render(<DemoGuidePage />)

    await user.click(screen.getByRole('button', { name: 'Copy Admin email' }))

    expect(writeText).toHaveBeenCalledWith('testadmin@gmail.com')
    expect(await screen.findByText('Copied')).toBeInTheDocument()
  })

  it('asks search engines not to index the page', () => {
    const { unmount } = render(<DemoGuidePage />)

    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex,nofollow'
    )
    unmount()
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull()
  })
})
