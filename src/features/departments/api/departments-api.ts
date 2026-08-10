import { apiClient } from '@/shared/api/http-client'
import type {
  DepartmentPayload,
  DepartmentResponse,
  DepartmentsResponse,
} from '../types/department.types'

export async function listDepartments() {
  const { data } = await apiClient.get<DepartmentsResponse>('/departments')
  return data
}

export async function createDepartment(payload: DepartmentPayload) {
  const { data } = await apiClient.post<DepartmentResponse>('/departments', payload)
  return data
}

export async function updateDepartment({
  departmentId,
  payload,
}: {
  departmentId: string
  payload: DepartmentPayload
}) {
  const { data } = await apiClient.patch<DepartmentResponse>(
    `/departments/${departmentId}`,
    payload
  )
  return data
}

export async function deleteDepartment(departmentId: string) {
  const { data } = await apiClient.delete<{ message: string }>(`/departments/${departmentId}`)
  return data
}
