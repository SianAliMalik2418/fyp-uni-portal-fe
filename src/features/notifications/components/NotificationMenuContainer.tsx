import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/components/ui/toast-manager'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { markAllNotificationsRead, markNotificationRead } from '../api/notifications-api'
import { notificationKeys, notificationsQueryOptions } from '../api/notification-queries'
import { NotificationMenu } from './NotificationMenu'
import { studentDashboardKeys } from '@/features/student-dashboard/api/student-dashboard-queries'

export function NotificationMenuContainer() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const notificationsQuery = useQuery(notificationsQueryOptions)
  const invalidateNotifications = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
      queryClient.invalidateQueries({ queryKey: studentDashboardKeys.all }),
    ])
  }
  const readMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: invalidateNotifications,
    onError: (error) =>
      toast.add({
        title: 'Notification not updated',
        description: getApiErrorMessage(error, 'Unable to mark the notification as read.'),
        type: 'error',
      }),
  })
  const readAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: invalidateNotifications,
    onError: (error) =>
      toast.add({
        title: 'Notifications not updated',
        description: getApiErrorMessage(error, 'Unable to mark all notifications as read.'),
        type: 'error',
      }),
  })

  return (
    <NotificationMenu
      notifications={notificationsQuery.data?.notifications ?? []}
      isLoading={notificationsQuery.isPending}
      markingId={readMutation.isPending ? readMutation.variables : undefined}
      isMarkingAll={readAllMutation.isPending}
      onMarkRead={(notificationId) => readMutation.mutate(notificationId)}
      onMarkAllRead={() => readAllMutation.mutate()}
      onOpenResource={(resourcePath) => navigate(resourcePath)}
    />
  )
}
