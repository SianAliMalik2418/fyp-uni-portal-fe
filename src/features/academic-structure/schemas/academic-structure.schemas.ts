import { z } from 'zod'

const currentYear = new Date().getFullYear()

export const batchSchema = z
  .object({
    name: z.string().trim().min(2, 'Batch name is required.'),
    programId: z.string().trim().min(1, 'Select a program.'),
    startingYear: z
      .number()
      .int('Starting year must be a whole number.')
      .min(2000, 'Starting year must be 2000 or later.')
      .max(currentYear + 10, 'Starting year is too far in the future.'),
    expectedGraduationYear: z
      .number()
      .int('Expected graduation year must be a whole number.')
      .min(2000, 'Expected graduation year must be 2000 or later.')
      .max(currentYear + 20, 'Expected graduation year is too far in the future.'),
    isActive: z.boolean(),
  })
  .refine((value) => value.expectedGraduationYear >= value.startingYear, {
    message: 'Expected graduation year must be after starting year.',
    path: ['expectedGraduationYear'],
  })

export const semesterSchema = z
  .object({
    name: z.string().trim().min(2, 'Semester name is required.'),
    academicYear: z
      .string()
      .trim()
      .min(4, 'Academic year is required.')
      .max(16, 'Academic year must be 16 characters or less.'),
    startsAt: z.string().optional(),
    endsAt: z.string().optional(),
    isActive: z.boolean(),
    isClosed: z.boolean(),
  })
  .refine(
    (value) => {
      if (!value.startsAt || !value.endsAt) {
        return true
      }

      return new Date(value.endsAt) >= new Date(value.startsAt)
    },
    {
      message: 'End date must be after start date.',
      path: ['endsAt'],
    }
  )

export const sectionSchema = z.object({
  name: z.string().trim().min(1, 'Section name is required.').max(32, 'Section name is too long.'),
  programId: z.string().trim().min(1, 'Select a program.'),
  batchId: z.string().trim().min(1, 'Select a batch.'),
  semesterId: z.string().trim().min(1, 'Select a semester.'),
  isActive: z.boolean(),
})

export type BatchFormValues = z.infer<typeof batchSchema>
export type SemesterFormValues = z.infer<typeof semesterSchema>
export type SectionFormValues = z.infer<typeof sectionSchema>
