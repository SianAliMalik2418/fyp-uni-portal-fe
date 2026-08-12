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
  AssessmentStructurePayload,
  AssessmentStructureResponse,
  AssessmentPayload,
  AssessmentResponse,
  AssessmentsResponse,
  MarkSheetPayload,
  MarkSheetResponse,
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

export async function getAssessmentStructure() {
  const { data } = await apiClient.get<AssessmentStructureResponse>('/assessments/structure')
  return data
}

export async function updateAssessmentStructure(payload: AssessmentStructurePayload) {
  const { data } = await apiClient.put<AssessmentStructureResponse>(
    '/assessments/structure',
    payload
  )
  return data
}

export async function listAssessments(offeringId: string) {
  const { data } = await apiClient.get<AssessmentsResponse>('/assessments', {
    params: { offeringId },
  })
  return data
}

export async function createAssessment(payload: AssessmentPayload) {
  const { data } = await apiClient.post<AssessmentResponse>('/assessments', payload)
  return data
}

export async function getMarkSheet(assessmentId: string) {
  const { data } = await apiClient.get<MarkSheetResponse>(`/marks/${assessmentId}`)
  return data
}

export async function saveMarkSheetDraft(assessmentId: string, payload: MarkSheetPayload) {
  const { data } = await apiClient.put<MarkSheetResponse>(`/marks/${assessmentId}/draft`, payload)
  return data
}
