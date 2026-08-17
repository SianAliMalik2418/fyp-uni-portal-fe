import { apiClient } from '@/shared/api/http-client'
import type { NotificationsResponse, PortalNotification } from '../types/notification.types'

export async function listNotifications() {
  const { data } = await apiClient.get<NotificationsResponse>('/notifications')
  return data
}

export async function markNotificationRead(notificationId: string) {
  const { data } = await apiClient.patch<{ message: string; notification: PortalNotification }>(
    `/notifications/${notificationId}/read`
  )
  return data
}

export async function markAllNotificationsRead() {
  const { data } = await apiClient.patch<{ message: string; updatedCount: number }>(
    '/notifications/read-all'
  )
  return data
}
