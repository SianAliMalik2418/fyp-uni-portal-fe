import { Notification02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import type { PortalNotification } from '../types/notification.types'

export function NotificationMenu({
  notifications,
  isLoading = false,
  markingId,
  isMarkingAll = false,
  onMarkRead,
  onMarkAllRead,
  onOpenResource,
}: {
  notifications: PortalNotification[]
  isLoading?: boolean
  markingId?: string
  isMarkingAll?: boolean
  onMarkRead: (notificationId: string) => void
  onMarkAllRead: () => void
  onOpenResource?: (resourcePath: string) => void
}) {
  const unreadCount = notifications.reduce(
    (count, notification) => count + (notification.isRead ? 0 : 1),
    0
  )

  return (
    <Popover>
      <PopoverTrigger
        render={<Button type="button" variant="ghost" size="icon-sm" className="relative" />}
        aria-label={`Notifications, ${unreadCount} unread`}
      >
        <HugeiconsIcon icon={Notification02Icon} strokeWidth={2} />
        {unreadCount > 0 ? (
          <span className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 grid min-w-4 place-items-center rounded-full px-1 text-[10px] leading-4">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(24rem,calc(100vw-2rem))] gap-0 p-0">
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div>
            <p className="font-medium">Notifications</p>
            <p className="text-muted-foreground text-xs">{unreadCount} unread</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={unreadCount === 0 || isMarkingAll}
            onClick={onMarkAllRead}
          >
            {isMarkingAll ? <Spinner /> : null}
            Mark all as read
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {isLoading ? (
            <p className="text-muted-foreground px-2 py-8 text-center text-sm">Loading updates…</p>
          ) : notifications.length === 0 ? (
            <p className="text-muted-foreground px-2 py-8 text-center text-sm">
              No notifications yet.
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'grid gap-2 rounded-md px-3 py-2.5',
                  notification.isRead ? 'text-muted-foreground' : 'bg-muted/60 text-foreground'
                )}
              >
                <button
                  type="button"
                  className="grid gap-1 text-left"
                  disabled={!notification.resourcePath}
                  onClick={() => {
                    if (notification.resourcePath) onOpenResource?.(notification.resourcePath)
                  }}
                >
                  <span className="text-sm font-medium">{notification.title}</span>
                  <span className="text-xs leading-5">{notification.message}</span>
                </button>
                {!notification.isRead ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    className="justify-self-start"
                    aria-label={`Mark ${notification.title} as read`}
                    disabled={markingId === notification.id}
                    onClick={() => onMarkRead(notification.id)}
                  >
                    {markingId === notification.id ? <Spinner /> : null}
                    Mark as read
                  </Button>
                ) : null}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
