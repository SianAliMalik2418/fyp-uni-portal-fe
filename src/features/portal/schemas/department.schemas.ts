import { z } from 'zod'

export const departmentSchema = z.object({
  name: z.string().trim().min(2, 'Department name is required.'),
  code: z
    .string()
    .trim()
    .min(2, 'Department code is required.')
    .max(12, 'Department code must be 12 characters or less.')
    .regex(/^[A-Za-z0-9-]+$/, 'Use letters, numbers, and hyphens only.'),
  description: z.string().trim().max(500, 'Description must be 500 characters or less.').optional(),
  isActive: z.boolean(),
})

export type DepartmentFormValues = z.infer<typeof departmentSchema>
