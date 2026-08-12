import { apiClient } from '@/shared/api/http-client'
import type { StudentDashboardResponse } from '../types/student-dashboard.types'

export async function getStudentDashboard() {
  const { data } = await apiClient.get<StudentDashboardResponse>('/student-dashboard')
  return data
}
