import { z } from 'zod'

export const resultCommentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(3, 'Enter a reason of at least 3 characters.')
    .max(1000, 'The reason cannot exceed 1000 characters.'),
})

export type ResultCommentValues = z.infer<typeof resultCommentSchema>
