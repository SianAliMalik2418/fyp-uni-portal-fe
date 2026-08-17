export type NotificationType =
  | 'account_created'
  | 'course_assigned'
  | 'attendance_updated'
  | 'result_returned'
  | 'result_approved'
  | 'result_published'

export type PortalNotification = {
  id: string
  type: NotificationType
  title: string
  message: string
  resultId?: string
  resourcePath?: string
  isRead: boolean
  createdAt?: string
}

export type NotificationsResponse = { notifications: PortalNotification[] }
