import { apiClient } from '@/shared/api/http-client'
import type {
  NotificationResponse,
  StudentDashboardResponse,
} from '../types/student-dashboard.types'

export async function getStudentDashboard() {
  const { data } = await apiClient.get<StudentDashboardResponse>('/student-dashboard')
  return data
}

export async function markNotificationRead(notificationId: string) {
  const { data } = await apiClient.patch<NotificationResponse>(
    `/notifications/${notificationId}/read`
  )
  return data
}
