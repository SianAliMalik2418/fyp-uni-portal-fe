import { apiClient } from '@/shared/api/http-client'
import type { FeeResponse, SaveFeePayload, SaveFeeResponse } from '../types/fee.types'

export async function getOwnFee() {
  const { data } = await apiClient.get<FeeResponse>('/fees/me')
  return data
}

export async function getStudentFee(studentId: string) {
  const { data } = await apiClient.get<FeeResponse>(`/fees/students/${studentId}`)
  return data
}

export async function saveStudentFee({
  studentId,
  payload,
}: {
  studentId: string
  payload: SaveFeePayload
}) {
  const { data } = await apiClient.put<SaveFeeResponse>(`/fees/students/${studentId}`, payload)
  return data
}
