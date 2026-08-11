import { z } from 'zod'

export const createUserAccountSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name is required.'),
    email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
    role: z.enum(['student', 'teacher', 'hod', 'admin']),
    phoneNumber: z.string().trim().optional(),
    registrationNumber: z.string().trim().optional(),
    employeeId: z.string().trim().optional(),
    departmentId: z.string().trim().optional(),
    programId: z.string().trim().optional(),
    batchId: z.string().trim().optional(),
    semesterId: z.string().trim().optional(),
    sectionId: z.string().trim().optional(),
    academicStatus: z.enum(['active', 'frozen', 'repeating', 'dropped', 'graduated']).optional(),
    designation: z.string().trim().optional(),
    isActive: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.role === 'student') {
      const requiredStudentFields = [
        ['registrationNumber', 'Registration no. is required.'],
        ['departmentId', 'Department is required.'],
        ['programId', 'Program is required.'],
        ['batchId', 'Batch is required.'],
        ['semesterId', 'Semester is required.'],
        ['sectionId', 'Section is required.'],
        ['academicStatus', 'Academic status is required.'],
      ] as const

      requiredStudentFields.forEach(([path, message]) => {
        if (!value[path]?.trim()) {
          context.addIssue({ code: 'custom', message, path: [path] })
        }
      })
    }

    if ((value.role === 'teacher' || value.role === 'hod') && !value.employeeId?.trim()) {
      context.addIssue({
        code: 'custom',
        message: 'Employee ID is required.',
        path: ['employeeId'],
      })
    }

    if ((value.role === 'teacher' || value.role === 'hod') && !value.departmentId?.trim()) {
      context.addIssue({
        code: 'custom',
        message: 'Department is required.',
        path: ['departmentId'],
      })
    }

    if (value.role === 'teacher' && !value.designation?.trim()) {
      context.addIssue({
        code: 'custom',
        message: 'Designation is required.',
        path: ['designation'],
      })
    }
  })

export type CreateUserAccountFormValues = z.infer<typeof createUserAccountSchema>
