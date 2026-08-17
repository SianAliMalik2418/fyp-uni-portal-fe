import { format } from 'date-fns'
import { Attachment01Icon, Edit02Icon, PinIcon, Delete02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { announcementAttachmentUrl } from '../api/announcements-api'
import type { Announcement } from '../types/announcement.types'

export function AnnouncementsList({
  announcements,
  canManage,
  onEdit,
  onDelete,
}: {
  announcements: Announcement[]
  canManage: boolean
  onEdit?: (announcement: Announcement) => void
  onDelete?: (announcement: Announcement) => void
}) {
  return (
    <div className="grid gap-3">
      {announcements.map((announcement) => (
        <Card key={announcement.id} className="bg-background">
          <CardHeader className="gap-2 border-b">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="grid gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle>{announcement.title}</CardTitle>
                  {announcement.isPinned ? (
                    <Badge variant="secondary">
                      <HugeiconsIcon icon={PinIcon} strokeWidth={2} data-icon="inline-start" />
                      Pinned
                    </Badge>
                  ) : null}
                  {!announcement.isActive ? <Badge variant="outline">Inactive</Badge> : null}
                </div>
                <p className="text-muted-foreground text-xs">
                  Published {format(new Date(announcement.publishDate), 'PPP p')}
                  {announcement.expiryDate
                    ? ` · Expires ${format(new Date(announcement.expiryDate), 'PPP p')}`
                    : ''}
                </p>
              </div>
              {canManage ? (
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${announcement.title}`}
                    onClick={() => onEdit?.(announcement)}
                  >
                    <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${announcement.title}`}
                    onClick={() => onDelete?.(announcement)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                  </Button>
                </div>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <p className="text-sm leading-6 whitespace-pre-wrap">{announcement.description}</p>
            {announcement.attachment ? (
              <a
                href={announcementAttachmentUrl(announcement.attachment.url)}
                className="text-primary inline-flex w-fit items-center gap-2 text-sm font-medium hover:underline"
              >
                <HugeiconsIcon icon={Attachment01Icon} strokeWidth={2} className="size-4" />
                {announcement.attachment.name}
              </a>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
