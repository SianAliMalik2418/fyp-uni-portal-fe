import { z } from 'zod'
import { timetableDays, timetableSlotTypes } from '../types/timetable.types'

export const timetableEntrySchema = z
  .object({
    courseOfferingId: z.string().trim().min(1, 'Course offering is required'),
    dayOfWeek: z.enum(timetableDays),
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Start time must use HH:MM'),
    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'End time must use HH:MM'),
    room: z
      .string()
      .trim()
      .min(1, 'Room is required')
      .max(64, 'Room must be 64 characters or less'),
    slotType: z.enum(timetableSlotTypes),
    notes: z.string().trim().max(240, 'Notes must be 240 characters or less').optional(),
  })
  .refine((value) => value.startTime < value.endTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  })

export const timetableFormSchema = z.object({
  notes: z.string().trim().max(500, 'Notes must be 500 characters or less').optional(),
  entries: z.array(timetableEntrySchema).max(64, 'A timetable can contain at most 64 entries'),
})

export type TimetableFormValues = z.infer<typeof timetableFormSchema>
