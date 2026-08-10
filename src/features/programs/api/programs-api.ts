import { apiClient } from '@/shared/api/http-client'
import type { ProgramPayload, ProgramResponse, ProgramsResponse } from '../types/program.types'

export async function listPrograms() {
  const { data } = await apiClient.get<ProgramsResponse>('/programs')
  return data
}

export async function createProgram(payload: ProgramPayload) {
  const { data } = await apiClient.post<ProgramResponse>('/programs', payload)
  return data
}

export async function updateProgram({
  programId,
  payload,
}: {
  programId: string
  payload: ProgramPayload
}) {
  const { data } = await apiClient.patch<ProgramResponse>(`/programs/${programId}`, payload)
  return data
}

export async function deleteProgram(programId: string) {
  const { data } = await apiClient.delete<{ message: string }>(`/programs/${programId}`)
  return data
}
