import { queryOptions } from '@tanstack/react-query'
import {
  getSectionTimetableWorkspace,
  getStudentTimetable,
  getTeacherTimetables,
} from './timetable-api'

export const timetableKeys = {
  all: ['timetable'] as const,
  student: () => [...timetableKeys.all, 'me', 'student'] as const,
  teacher: () => [...timetableKeys.all, 'me', 'teacher'] as const,
  workspace: (sectionId: string) => [...timetableKeys.all, 'sections', sectionId] as const,
}

export const studentTimetableQueryOptions = queryOptions({
  queryKey: timetableKeys.student(),
  queryFn: getStudentTimetable,
})

export const teacherTimetablesQueryOptions = queryOptions({
  queryKey: timetableKeys.teacher(),
  queryFn: getTeacherTimetables,
})

export const timetableWorkspaceQueryOptions = (sectionId: string) =>
  queryOptions({
    queryKey: timetableKeys.workspace(sectionId),
    queryFn: () => getSectionTimetableWorkspace(sectionId),
    enabled: Boolean(sectionId),
  })
