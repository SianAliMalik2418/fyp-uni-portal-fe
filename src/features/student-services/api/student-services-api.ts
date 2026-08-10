import { apiClient } from '@/shared/api/http-client'
import type { StudentServiceContext } from '../types/student-services.types'

export async function getStudentServiceContext() {
  const { data } = await apiClient.get<StudentServiceContext>('/student-services/context')
  return data
}
