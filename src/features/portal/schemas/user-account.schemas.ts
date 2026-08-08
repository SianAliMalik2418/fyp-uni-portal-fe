import { z } from 'zod'

export const createUserAccountSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name is required.'),
    email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
    role: z.enum(['student', 'teacher', 'hod', 'admin']),
    registrationNumber: z.string().trim().optional(),
    employeeId: z.string().trim().optional(),
    isActive: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.role === 'student' && !value.registrationNumber?.trim()) {
      context.addIssue({
        code: 'custom',
        message: 'Registration no. is required.',
        path: ['registrationNumber'],
      })
    }

    if ((value.role === 'teacher' || value.role === 'hod') && !value.employeeId?.trim()) {
      context.addIssue({
        code: 'custom',
        message: 'Employee ID is required.',
        path: ['employeeId'],
      })
    }
  })

export type CreateUserAccountFormValues = z.infer<typeof createUserAccountSchema>
