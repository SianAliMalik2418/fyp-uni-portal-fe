import { apiClient } from '@/shared/api/http-client'
import type {
  StudentTimetableResponse,
  TeacherTimetablesResponse,
  TimetableDraftPayload,
  TimetableResponse,
  TimetableWorkspaceResponse,
} from '../types/timetable.types'

export async function getSectionTimetableWorkspace(sectionId: string) {
  const { data } = await apiClient.get<TimetableWorkspaceResponse>(
    `/timetable/sections/${sectionId}`
  )
  return data
}

export async function saveSectionTimetableDraft({
  sectionId,
  payload,
}: {
  sectionId: string
  payload: TimetableDraftPayload
}) {
  const { data } = await apiClient.put<TimetableResponse>(
    `/timetable/sections/${sectionId}/draft`,
    payload
  )
  return data
}

export async function publishSectionTimetable(sectionId: string) {
  const { data } = await apiClient.post<TimetableResponse>(
    `/timetable/sections/${sectionId}/publish`
  )
  return data
}

export async function getStudentTimetable() {
  const { data } = await apiClient.get<StudentTimetableResponse>('/timetable/me/student')
  return data
}

export async function getTeacherTimetables() {
  const { data } = await apiClient.get<TeacherTimetablesResponse>('/timetable/me/teacher')
  return data
}
