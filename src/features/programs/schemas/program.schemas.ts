import { z } from 'zod'

export const programSchema = z.object({
  name: z.string().trim().min(2, 'Program name is required.'),
  code: z
    .string()
    .trim()
    .min(2, 'Program code is required.')
    .max(16, 'Program code must be 16 characters or less.')
    .regex(/^[A-Za-z0-9-]+$/, 'Use letters, numbers, and hyphens only.'),
  departmentId: z.string().trim().min(1, 'Select a department.'),
  totalSemesters: z
    .number()
    .int('Total semesters must be a whole number.')
    .min(1, 'Total semesters must be at least 1.')
    .max(16, 'Total semesters must be 16 or less.'),
  duration: z
    .number()
    .int('Duration must be a whole number.')
    .min(1, 'Duration must be at least 1.')
    .max(120, 'Duration must be 120 or less.'),
  durationUnit: z.enum(['years', 'months'], {
    error: 'Select years or months.',
  }),
  isActive: z.boolean(),
})

export type ProgramFormValues = z.infer<typeof programSchema>
