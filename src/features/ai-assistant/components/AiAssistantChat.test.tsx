import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { askStudentAssistant } from '../api/ai-assistant-api'
import { AiAssistantChat } from './AiAssistantChat'

vi.mock('../api/ai-assistant-api', () => ({ askStudentAssistant: vi.fn() }))

afterEach(() => {
  cleanup()
  vi.mocked(askStudentAssistant).mockReset()
})

function renderChat(onClose = vi.fn()) {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  })
  return {
    onClose,
    ...render(
      <QueryClientProvider client={queryClient}>
        <AiAssistantChat onClose={onClose} />
      </QueryClientProvider>
    ),
  }
}

describe('AiAssistantChat', () => {
  it('sends a suggested question and includes the complete exchange in a follow-up', async () => {
    const user = userEvent.setup()
    vi.mocked(askStudentAssistant)
      .mockResolvedValueOnce({
        answer: 'Your CGPA is 3.1.',
        grounded: true,
        knowledgeKeys: [],
        contextSections: ['gpa'],
      })
      .mockResolvedValueOnce({
        answer: 'Your latest semester GPA is 3.2.',
        grounded: true,
        knowledgeKeys: [],
        contextSections: ['gpa'],
      })
    renderChat()

    expect(screen.getByText(/signed-in portal records/i)).toBeInTheDocument()
    expect(screen.getByText(/cannot change records/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'What is my CGPA?' }))

    expect(await screen.findByText('Your CGPA is 3.1.')).toBeInTheDocument()
    await user.type(screen.getByLabelText('Ask the AI academic assistant'), 'What about this term?')
    await user.click(screen.getByRole('button', { name: 'Send question' }))

    await waitFor(() => expect(askStudentAssistant).toHaveBeenCalledTimes(2))
    expect(vi.mocked(askStudentAssistant).mock.calls.at(-1)?.[0]).toEqual({
      message: 'What about this term?',
      conversation: [
        { role: 'user', content: 'What is my CGPA?' },
        { role: 'assistant', content: 'Your CGPA is 3.1.' },
      ],
    })
    expect(await screen.findByText('Your latest semester GPA is 3.2.')).toBeInTheDocument()
  })

  it('shows progress, then lets the student clear temporary history', async () => {
    const user = userEvent.setup()
    let resolveAnswer:
      ((value: Awaited<ReturnType<typeof askStudentAssistant>>) => void) | undefined
    vi.mocked(askStudentAssistant).mockReturnValue(
      new Promise((resolve) => {
        resolveAnswer = resolve
      })
    )
    renderChat()

    await user.type(screen.getByLabelText('Ask the AI academic assistant'), 'When is my exam?')
    await user.click(screen.getByRole('button', { name: 'Send question' }))

    expect(screen.getByText('Checking your portal records')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send question' })).toBeDisabled()
    resolveAnswer?.({
      answer: 'Your final exam is listed for December 10.',
      grounded: true,
      knowledgeKeys: [],
      contextSections: ['exams'],
    })
    expect(
      await screen.findByText('Your final exam is listed for December 10.')
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear conversation' }))
    expect(screen.queryByText('Your final exam is listed for December 10.')).not.toBeInTheDocument()
    expect(screen.getByText('Ask about your academic information')).toBeInTheDocument()
  })

  it('keeps provider errors visible and surfaces the controlled fallback', async () => {
    const user = userEvent.setup()
    vi.mocked(askStudentAssistant).mockRejectedValueOnce(
      new Error('The AI provider is temporarily unavailable.')
    )
    renderChat()

    await user.type(screen.getByLabelText('Ask the AI academic assistant'), 'What is my GPA?')
    await user.click(screen.getByRole('button', { name: 'Send question' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The AI provider is temporarily unavailable.'
    )

    vi.mocked(askStudentAssistant).mockResolvedValueOnce({
      answer: "I don't have enough trusted information to answer that question.",
      grounded: false,
      knowledgeKeys: [],
      contextSections: [],
    })
    await user.click(screen.getByRole('button', { name: 'Send question' }))

    expect(
      await screen.findByText("I don't have enough trusted information to answer that question.")
    ).toBeInTheDocument()
    expect(screen.getByText('No trusted answer found')).toBeInTheDocument()
  })

  it('offers accessible close and clear controls', async () => {
    const user = userEvent.setup()
    const { onClose } = renderChat()

    expect(screen.getByRole('dialog', { name: 'AI academic assistant' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Close AI academic assistant' }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
