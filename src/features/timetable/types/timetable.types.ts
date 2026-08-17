import type { Section } from '@/features/academic-structure/types/academic-structure.types'

export const timetableDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

export type TimetableDay = (typeof timetableDays)[number]

export const timetableSlotTypes = ['lecture', 'lab', 'tutorial', 'seminar'] as const

export type TimetableSlotType = (typeof timetableSlotTypes)[number]

export type TimetableOffering = {
  id: string
  course: {
    id: string
    code: string
    title: string
    creditHours: number
  }
  teacher?: {
    id: string
    fullName: string
    email: string
    employeeId?: string
  }
  isActive: boolean
}

export type TimetableEntry = {
  id: string
  dayOfWeek: TimetableDay
  startTime: string
  endTime: string
  room: string
  slotType: TimetableSlotType
  notes?: string
  courseOffering: TimetableOffering
}

export type Timetable = {
  id: string
  section: Section
  status: 'draft' | 'published'
  version: number
  notes?: string
  publishedAt: string | null
  entries: TimetableEntry[]
  createdAt?: string
  updatedAt?: string
}

export type TimetableWorkspace = {
  section: Section
  availableCourseOfferings: TimetableOffering[]
  draftTimetable: Timetable | null
  publishedTimetable: Timetable | null
}

export type TimetableDraftEntryPayload = {
  courseOfferingId: string
  dayOfWeek: TimetableDay
  startTime: string
  endTime: string
  room: string
  slotType: TimetableSlotType
  notes?: string
}

export type TimetableDraftPayload = {
  notes?: string
  entries: TimetableDraftEntryPayload[]
}

export type TimetableWorkspaceResponse = TimetableWorkspace

export type TimetableResponse = {
  message: string
  timetable: Timetable
}

export type StudentTimetableResponse = {
  timetable: Timetable | null
}

export type TeacherTimetablesResponse = {
  timetables: Timetable[]
}
