import type { Timetable, TimetableDay, TimetableSlotType } from '../types/timetable.types'
import type { TimetableFormValues } from '../schemas/timetable.schemas'

export const timetableDayLabels: Record<TimetableDay, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

export const timetableSlotTypeLabels: Record<TimetableSlotType, string> = {
  lecture: 'Lecture',
  lab: 'Lab',
  tutorial: 'Tutorial',
  seminar: 'Seminar',
}

export function emptyTimetableEntryValues() {
  return {
    courseOfferingId: '',
    dayOfWeek: 'monday' as const,
    startTime: '09:00',
    endTime: '10:00',
    room: '',
    slotType: 'lecture' as const,
    notes: '',
  }
}

export function emptyTimetableFormValues(): TimetableFormValues {
  return {
    notes: '',
    entries: [emptyTimetableEntryValues()],
  }
}

export function timetableToFormValues(timetable: Timetable): TimetableFormValues {
  return {
    notes: timetable.notes ?? '',
    entries:
      timetable.entries.length > 0
        ? timetable.entries.map((entry) => ({
            courseOfferingId: entry.courseOffering.id,
            dayOfWeek: entry.dayOfWeek,
            startTime: entry.startTime,
            endTime: entry.endTime,
            room: entry.room,
            slotType: entry.slotType,
            notes: entry.notes ?? '',
          }))
        : [emptyTimetableEntryValues()],
  }
}

export function formValuesToPayload(values: TimetableFormValues) {
  return {
    notes: values.notes?.trim() ? values.notes.trim() : undefined,
    entries: values.entries.map((entry) => ({
      courseOfferingId: entry.courseOfferingId,
      dayOfWeek: entry.dayOfWeek,
      startTime: entry.startTime,
      endTime: entry.endTime,
      room: entry.room.trim(),
      slotType: entry.slotType,
      notes: entry.notes?.trim() ? entry.notes.trim() : undefined,
    })),
  }
}

export function formatSectionLabel(timetable: Timetable) {
  return `${timetable.section.program.code} · ${timetable.section.semester.name} · ${timetable.section.name}`
}
