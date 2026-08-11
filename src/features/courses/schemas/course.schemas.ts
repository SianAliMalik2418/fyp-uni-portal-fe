import { z } from 'zod'

export const courseSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, 'Course code is required')
    .max(24, 'Course code must be 24 characters or less')
    .regex(/^[A-Za-z0-9-]+$/, 'Use letters, numbers, and hyphens only'),
  title: z.string().trim().min(2, 'Course title is required'),
  creditHours: z.number().int().min(1, 'Minimum 1 credit').max(6, 'Maximum 6 credits'),
  departmentId: z.string().trim().min(1, 'Department is required'),
  programId: z.string().trim().min(1, 'Program is required'),
  semesterId: z.string().trim().min(1, 'Semester is required'),
  description: z.string().trim().optional(),
  isActive: z.boolean(),
})

export type CourseFormValues = z.infer<typeof courseSchema>
