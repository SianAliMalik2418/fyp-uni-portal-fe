import { NotificationCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function NotificationPanel() {
  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <HugeiconsIcon icon={NotificationCircleIcon} strokeWidth={2} className="size-4" />
          Notifications
        </CardTitle>
        <CardDescription>0 unread updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/30 grid min-h-36 place-items-center rounded-md border border-dashed px-4 py-8 text-center">
          <div className="grid max-w-xs justify-items-center gap-2">
            <span className="border-border bg-background text-muted-foreground flex size-10 items-center justify-center rounded-md border">
              <HugeiconsIcon icon={NotificationCircleIcon} strokeWidth={2} className="size-5" />
            </span>
            <p className="text-foreground text-sm font-medium">No notifications yet.</p>
            <p className="text-muted-foreground text-sm leading-6">
              Fee, timetable, exam, material, and announcement alerts will appear here.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
