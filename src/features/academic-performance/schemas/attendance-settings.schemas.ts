import { z } from 'zod'

export const attendanceSettingsSchema = z.object({
  minimumAttendancePercentage: z
    .number({ error: 'Minimum attendance percentage is required' })
    .int('Minimum attendance percentage must be a whole number')
    .min(1, 'Minimum attendance percentage must be at least 1')
    .max(100, 'Minimum attendance percentage cannot exceed 100'),
})

export type AttendanceSettingsFormValues = z.infer<typeof attendanceSettingsSchema>
