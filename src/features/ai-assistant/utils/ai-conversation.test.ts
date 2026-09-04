import { describe, expect, it } from 'vitest'
import { boundedConversation } from './ai-conversation'

describe('boundedConversation', () => {
  it('keeps the newest complete turns within backend message and character limits', () => {
    const messages = Array.from({ length: 4 }, (_, index) => [
      { role: 'user' as const, content: `${index}${'u'.repeat(999)}` },
      { role: 'assistant' as const, content: `${index}${'a'.repeat(1_999)}`, grounded: true },
    ]).flat()

    const result = boundedConversation(messages)

    expect(result).toHaveLength(4)
    expect(result[0]?.content.startsWith('2')).toBe(true)
    expect(result.at(-1)?.content.startsWith('3')).toBe(true)
    expect(result.every((message) => !('grounded' in message))).toBe(true)
  })

  it('keeps at most four complete exchanges', () => {
    const messages = Array.from({ length: 5 }, (_, index) => [
      { role: 'user' as const, content: `Question ${index}` },
      { role: 'assistant' as const, content: `Answer ${index}` },
    ]).flat()

    expect(boundedConversation(messages)).toEqual(messages.slice(-8))
  })
})
