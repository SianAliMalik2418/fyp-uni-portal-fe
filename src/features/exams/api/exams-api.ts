import { apiClient } from '@/shared/api/http-client'
import type { ExamPayload, ExamResponse, ExamsResponse } from '../types/exam.types'

export async function listAdminSectionExams(sectionId: string) {
  const { data } = await apiClient.get<ExamsResponse>('/exams/admin', { params: { sectionId } })
  return data
}

export async function listStudentExams() {
  const { data } = await apiClient.get<ExamsResponse>('/exams/me/student')
  return data
}

export async function listTeacherExams() {
  const { data } = await apiClient.get<ExamsResponse>('/exams/me/teacher')
  return data
}

export async function createExam(payload: ExamPayload) {
  const { data } = await apiClient.post<ExamResponse>('/exams', payload)
  return data
}

export async function updateExam({ examId, payload }: { examId: string; payload: ExamPayload }) {
  const { data } = await apiClient.put<ExamResponse>(`/exams/${examId}`, payload)
  return data
}

export async function deleteExam(examId: string) {
  const { data } = await apiClient.delete<{ message: string }>(`/exams/${examId}`)
  return data
}
