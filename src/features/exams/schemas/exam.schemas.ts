import { z } from 'zod'

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/

export const examFormSchema = z
  .object({
    examType: z.string().trim().min(1, 'Exam type is required').max(64),
    courseOfferingId: z.string().min(1, 'Course is required'),
    examDate: z.iso.date('Enter a valid exam date'),
    startTime: z.string().regex(timePattern, 'Enter a valid start time'),
    endTime: z.string().regex(timePattern, 'Enter a valid end time'),
    room: z.string().trim().min(1, 'Room is required').max(64),
    instructions: z.string().trim().max(1000),
  })
  .refine((value) => value.startTime < value.endTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  })

export type ExamFormValues = z.infer<typeof examFormSchema>
