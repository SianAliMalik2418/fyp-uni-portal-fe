import type { AiConversationMessage } from '../schemas/ai-assistant.schemas'

const maximumHistoryMessages = 8
const maximumHistoryCharacters = 8_000

export function boundedConversation(
  messages: readonly AiConversationMessage[]
): AiConversationMessage[] {
  const latestMessages = messages.slice(-maximumHistoryMessages)
  let firstIncludedIndex = latestMessages.length
  let includedCharacters = 0

  for (let index = latestMessages.length - 2; index >= 0; index -= 2) {
    const userMessage = latestMessages[index]
    const assistantMessage = latestMessages[index + 1]
    if (userMessage?.role !== 'user' || assistantMessage?.role !== 'assistant') break

    const turnCharacters = userMessage.content.length + assistantMessage.content.length
    if (includedCharacters + turnCharacters > maximumHistoryCharacters) break
    includedCharacters += turnCharacters
    firstIncludedIndex = index
  }

  return latestMessages.slice(firstIncludedIndex).map(({ role, content }) => ({ role, content }))
}
