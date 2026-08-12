import { apiClient } from '@/shared/api/http-client'
import type {
  AcademicPerformanceContext,
  AcademicPerformanceOfferingStudentsResponse,
  AcademicPerformanceOfferingsResponse,
  AttendanceConfigurationPayload,
  AttendanceConfigurationResponse,
  AttendanceSessionPayload,
  AttendanceSessionResponse,
  AttendanceSessionsResponse,
  AttendanceShortagesResponse,
  StudentAttendanceResponse,
} from '../types/academic-performance.types'

export async function getAttendanceConfiguration() {
  const { data } = await apiClient.get<AttendanceConfigurationResponse>('/attendance/configuration')
  return data
}

export async function updateAttendanceConfiguration(payload: AttendanceConfigurationPayload) {
  const { data } = await apiClient.put<AttendanceConfigurationResponse>(
    '/attendance/configuration',
    payload
  )
  return data
}

export async function getAcademicPerformanceContext() {
  const { data } = await apiClient.get<AcademicPerformanceContext>('/academic-performance/context')
  return data
}

export async function listAcademicPerformanceOfferings() {
  const { data } = await apiClient.get<AcademicPerformanceOfferingsResponse>(
    '/academic-performance/offerings'
  )
  return data
}

export async function listAcademicPerformanceOfferingStudents(offeringId: string) {
  const { data } = await apiClient.get<AcademicPerformanceOfferingStudentsResponse>(
    `/academic-performance/offerings/${offeringId}/students`
  )
  return data
}

export async function listAttendanceSessions(offeringId?: string) {
  const { data } = await apiClient.get<AttendanceSessionsResponse>('/attendance/sessions', {
    params: { offeringId },
  })
  return data
}

export async function saveAttendanceSession(payload: AttendanceSessionPayload) {
  const { data } = await apiClient.post<AttendanceSessionResponse>('/attendance/sessions', payload)
  return data
}

export async function updateAttendanceSession(
  sessionId: string,
  payload: AttendanceSessionPayload
) {
  const { data } = await apiClient.put<AttendanceSessionResponse>(
    `/attendance/sessions/${sessionId}`,
    payload
  )
  return data
}

export async function getStudentAttendanceSummaries() {
  const { data } = await apiClient.get<StudentAttendanceResponse>('/attendance/student')
  return data
}

export async function listAttendanceShortages() {
  const { data } = await apiClient.get<AttendanceShortagesResponse>('/attendance/shortages')
  return data
}
