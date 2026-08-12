import { z } from 'zod'

export const assessmentFormSchema = z.object({
  name: z.string().trim().min(1, 'Assessment name is required').max(100),
  category: z.enum(['quiz', 'assignment', 'attendance', 'presentation', 'midterm', 'final']),
  maximumMarks: z.coerce
    .number<number>()
    .positive('Maximum marks must be greater than zero')
    .max(1000, 'Maximum marks cannot exceed 1000'),
})

export type AssessmentFormValues = z.infer<typeof assessmentFormSchema>
