import { z } from 'zod'

export const aiConversationMessageSchema = z
  .object({
    role: z.enum(['user', 'assistant']),
    content: z.string().trim().min(1).max(2_000),
  })
  .strict()

export const aiChatRequestSchema = z
  .object({
    message: z.string().trim().min(1).max(1_000),
    conversation: z.array(aiConversationMessageSchema).max(8),
  })
  .strict()

export const aiChatResponseSchema = z
  .object({
    answer: z.string().trim().min(1).max(2_000),
    grounded: z.boolean(),
    knowledgeKeys: z.array(z.string().trim().min(1)).max(5),
    contextSections: z
      .array(
        z.enum([
          'identity',
          'academic_structure',
          'courses',
          'attendance',
          'marks',
          'grades',
          'gpa',
          'results',
          'fee',
          'timetable',
          'exams',
          'announcements',
        ])
      )
      .max(6),
  })
  .strict()

export type AiConversationMessage = z.infer<typeof aiConversationMessageSchema>
export type AiChatRequest = z.infer<typeof aiChatRequestSchema>
export type AiChatResponse = z.infer<typeof aiChatResponseSchema>
