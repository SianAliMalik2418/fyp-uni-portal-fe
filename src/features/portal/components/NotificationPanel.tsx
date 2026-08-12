import { NotificationCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import type { StudentNotification } from '@/features/student-dashboard/types/student-dashboard.types'

export function NotificationPanel({
  notifications = [],
  markingId,
  onMarkRead,
}: {
  notifications?: StudentNotification[]
  markingId?: string
  onMarkRead: (notificationId: string) => void
}) {
  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <HugeiconsIcon icon={NotificationCircleIcon} strokeWidth={2} className="size-4" />
          Notifications
        </CardTitle>
        <CardDescription>{unreadCount} unread updates</CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length ? (
          <div className="grid gap-2">
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-muted/30 grid gap-2 rounded-md border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-muted-foreground mt-1 text-sm leading-5">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.isRead ? (
                    <span
                      className="bg-primary mt-1 size-2 shrink-0 rounded-full"
                      aria-label="Unread"
                    />
                  ) : null}
                </div>
                {!notification.isRead ? (
                  <Button
                    className="justify-self-start"
                    variant="ghost"
                    size="xs"
                    disabled={markingId === notification.id}
                    onClick={() => onMarkRead(notification.id)}
                  >
                    {markingId === notification.id ? <Spinner /> : null}
                    Mark as read
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-muted/30 grid min-h-36 place-items-center rounded-md border border-dashed px-4 py-8 text-center">
            <div className="grid max-w-xs justify-items-center gap-2">
              <span className="border-border bg-background text-muted-foreground flex size-10 items-center justify-center rounded-md border">
                <HugeiconsIcon icon={NotificationCircleIcon} strokeWidth={2} className="size-5" />
              </span>
              <p className="text-foreground text-sm font-medium">No notifications yet.</p>
              <p className="text-muted-foreground text-sm leading-6">
                Result, fee, timetable, exam, material, and announcement alerts will appear here.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
