import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/shared/api/http-client'
import { askStudentAssistant } from './ai-assistant-api'

describe('AI assistant API', () => {
  afterEach(() => vi.restoreAllMocks())

  it('sends the current question with complete conversation history', async () => {
    const response = {
      answer: 'Your CGPA is 3.1.',
      grounded: true,
      knowledgeKeys: [],
      contextSections: ['gpa'],
    }
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue({ data: response })
    const request = {
      message: 'What is my CGPA?',
      conversation: [
        { role: 'user' as const, content: 'How are my results?' },
        { role: 'assistant' as const, content: 'Which result should I explain?' },
      ],
    }

    await expect(askStudentAssistant(request)).resolves.toEqual(response)
    expect(post).toHaveBeenCalledWith('/ai-assistant/chat', request)
  })

  it('rejects an invalid provider response at the API boundary', async () => {
    vi.spyOn(apiClient, 'post').mockResolvedValue({
      data: {
        answer: 'Untrusted response',
        grounded: true,
        knowledgeKeys: [],
        contextSections: ['private_database'],
      },
    })

    await expect(
      askStudentAssistant({ message: 'What is my GPA?', conversation: [] })
    ).rejects.toThrow()
  })
})
