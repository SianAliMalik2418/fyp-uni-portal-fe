import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { FloatingChatbot } from './FloatingChatbot'

describe('FloatingChatbot', () => {
  it('opens and closes the assistant without dropping the current session draft', async () => {
    const user = userEvent.setup()
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={queryClient}>
        <FloatingChatbot />
      </QueryClientProvider>
    )

    expect(screen.queryByRole('dialog', { name: 'AI academic assistant' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open AI academic assistant' }))
    expect(screen.getByRole('dialog', { name: 'AI academic assistant' })).toBeInTheDocument()

    await user.type(screen.getByLabelText('Ask the AI academic assistant'), 'What is my GPA?')
    await user.click(screen.getByRole('button', { name: 'Close AI academic assistant' }))
    expect(screen.queryByRole('dialog', { name: 'AI academic assistant' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open AI academic assistant' })).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Open AI academic assistant' }))
    expect(screen.getByLabelText('Ask the AI academic assistant')).toHaveValue('What is my GPA?')
  })
})
