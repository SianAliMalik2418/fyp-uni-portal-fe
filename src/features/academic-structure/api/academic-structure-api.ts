import { apiClient } from '@/shared/api/http-client'
import type {
  BatchPayload,
  BatchResponse,
  BatchesResponse,
  SectionPayload,
  SectionResponse,
  SectionsResponse,
  SemesterPayload,
  SemesterResponse,
  SemestersResponse,
} from '../types/academic-structure.types'

export async function listBatches() {
  const { data } = await apiClient.get<BatchesResponse>('/batches')
  return data
}

export async function createBatch(payload: BatchPayload) {
  const { data } = await apiClient.post<BatchResponse>('/batches', payload)
  return data
}

export async function updateBatch({
  batchId,
  payload,
}: {
  batchId: string
  payload: BatchPayload
}) {
  const { data } = await apiClient.patch<BatchResponse>(`/batches/${batchId}`, payload)
  return data
}

export async function deleteBatch(batchId: string) {
  const { data } = await apiClient.delete<{ message: string }>(`/batches/${batchId}`)
  return data
}

export async function listSemesters() {
  const { data } = await apiClient.get<SemestersResponse>('/semesters')
  return data
}

export async function createSemester(payload: SemesterPayload) {
  const { data } = await apiClient.post<SemesterResponse>('/semesters', payload)
  return data
}

export async function updateSemester({
  semesterId,
  payload,
}: {
  semesterId: string
  payload: SemesterPayload
}) {
  const { data } = await apiClient.patch<SemesterResponse>(`/semesters/${semesterId}`, payload)
  return data
}

export async function activateSemester(semesterId: string) {
  const { data } = await apiClient.patch<SemesterResponse>(`/semesters/${semesterId}/activate`)
  return data
}

export async function closeSemester(semesterId: string) {
  const { data } = await apiClient.patch<SemesterResponse>(`/semesters/${semesterId}/close`)
  return data
}

export async function deleteSemester(semesterId: string) {
  const { data } = await apiClient.delete<{ message: string }>(`/semesters/${semesterId}`)
  return data
}

export async function listSections() {
  const { data } = await apiClient.get<SectionsResponse>('/sections')
  return data
}

export async function createSection(payload: SectionPayload) {
  const { data } = await apiClient.post<SectionResponse>('/sections', payload)
  return data
}

export async function updateSection({
  sectionId,
  payload,
}: {
  sectionId: string
  payload: SectionPayload
}) {
  const { data } = await apiClient.patch<SectionResponse>(`/sections/${sectionId}`, payload)
  return data
}

export async function deleteSection(sectionId: string) {
  const { data } = await apiClient.delete<{ message: string }>(`/sections/${sectionId}`)
  return data
}
