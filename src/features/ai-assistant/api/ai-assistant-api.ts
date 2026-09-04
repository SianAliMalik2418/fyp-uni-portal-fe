import { apiClient } from '@/shared/api/http-client'
import {
  aiChatRequestSchema,
  aiChatResponseSchema,
  type AiChatRequest,
} from '../schemas/ai-assistant.schemas'

export async function askStudentAssistant(request: AiChatRequest) {
  const payload = aiChatRequestSchema.parse(request)
  const { data } = await apiClient.post<unknown>('/ai-assistant/chat', payload)
  return aiChatResponseSchema.parse(data)
}
