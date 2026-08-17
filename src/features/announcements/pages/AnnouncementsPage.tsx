import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Add01Icon, Megaphone01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast-manager'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { announcementKeys, announcementsQueryOptions } from '../api/announcement-queries'
import {
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
} from '../api/announcements-api'
import { AnnouncementFormSheet } from '../components/AnnouncementFormSheet'
import { AnnouncementsList } from '../components/AnnouncementsList'
import { DeleteAnnouncementDialog } from '../components/DeleteAnnouncementDialog'
import type { AnnouncementFormValues } from '../schemas/announcement.schemas'
import type { Announcement, AnnouncementStatus } from '../types/announcement.types'

const adminStatuses: Array<{ value: AnnouncementStatus; label: string }> = [
  { value: 'active', label: 'Active' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'expired', label: 'Expired' },
  { value: 'all', label: 'All' },
]

export function AnnouncementsPage({ title, user }: { title: string; user: PortalUser }) {
  const canManage = user.role === 'admin'
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<AnnouncementStatus>('active')
  const [page, setPage] = useState(1)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const announcementsQuery = useQuery(
    announcementsQueryOptions(canManage ? status : 'active', page)
  )
  const invalidateAnnouncements = () =>
    queryClient.invalidateQueries({ queryKey: announcementKeys.all })
  const saveMutation = useMutation({
    mutationFn: (values: AnnouncementFormValues) =>
      editingAnnouncement
        ? updateAnnouncement({ announcementId: editingAnnouncement.id, values })
        : createAnnouncement(values),
    onSuccess: async () => {
      toast.add({
        title: editingAnnouncement ? 'Announcement updated' : 'Announcement created',
        description: 'The announcement workspace is up to date.',
        type: 'success',
      })
      setEditingAnnouncement(null)
      setIsFormOpen(false)
      await invalidateAnnouncements()
    },
    onError: (error) =>
      toast.add({
        title: 'Announcement not saved',
        description: getApiErrorMessage(error, 'Unable to save the announcement.'),
        type: 'error',
      }),
  })
  const deleteMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: async () => {
      toast.add({
        title: 'Announcement deleted',
        description: 'The announcement was removed from the portal.',
        type: 'success',
      })
      setAnnouncementToDelete(null)
      await invalidateAnnouncements()
    },
    onError: (error) =>
      toast.add({
        title: 'Announcement not deleted',
        description: getApiErrorMessage(error, 'Unable to delete the announcement.'),
        type: 'error',
      }),
  })

  return (
    <div className="mx-auto grid max-w-5xl gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl leading-tight font-semibold">{title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {canManage
              ? 'Publish and manage university-wide notices.'
              : 'Read current university announcements and attached notices.'}
          </p>
        </div>
        {canManage ? (
          <Button
            type="button"
            onClick={() => {
              setEditingAnnouncement(null)
              setIsFormOpen(true)
            }}
          >
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
            Create announcement
          </Button>
        ) : null}
      </div>

      {canManage ? (
        <div className="flex flex-wrap gap-2" aria-label="Announcement status filter">
          {adminStatuses.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={status === option.value ? 'default' : 'outline'}
              onClick={() => {
                setStatus(option.value)
                setPage(1)
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      ) : null}

      {announcementsQuery.isPending ? (
        <div className="grid gap-3" aria-busy="true">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : announcementsQuery.isError ? (
        <Alert variant="destructive">
          <AlertTitle>Announcements unavailable</AlertTitle>
          <AlertDescription>
            {getApiErrorMessage(announcementsQuery.error, 'Unable to load announcements.')}
          </AlertDescription>
        </Alert>
      ) : announcementsQuery.data.announcements.length === 0 ? (
        <Card className="bg-background">
          <CardContent className="grid min-h-52 place-items-center text-center">
            <div className="grid max-w-sm justify-items-center gap-2">
              <span className="bg-muted text-muted-foreground grid size-11 place-items-center rounded-md">
                <HugeiconsIcon icon={Megaphone01Icon} strokeWidth={2} className="size-5" />
              </span>
              <p className="font-medium">No {status === 'all' ? '' : `${status} `}announcements.</p>
              <p className="text-muted-foreground text-sm">
                {canManage
                  ? 'Create an announcement when there is an update to share.'
                  : 'Current university notices will appear here.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <AnnouncementsList
          announcements={announcementsQuery.data.announcements}
          canManage={canManage}
          onEdit={(announcement) => {
            setEditingAnnouncement(announcement)
            setIsFormOpen(true)
          }}
          onDelete={setAnnouncementToDelete}
        />
      )}

      {announcementsQuery.data && announcementsQuery.data.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            Page {announcementsQuery.data.page} of {announcementsQuery.data.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= announcementsQuery.data.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      {canManage ? (
        <>
          <AnnouncementFormSheet
            announcement={editingAnnouncement}
            isOpen={isFormOpen}
            isSaving={saveMutation.isPending}
            onOpenChange={(open) => {
              setIsFormOpen(open)
              if (!open) setEditingAnnouncement(null)
            }}
            onSubmit={(values) => saveMutation.mutate(values)}
          />
          <DeleteAnnouncementDialog
            announcement={announcementToDelete}
            isDeleting={deleteMutation.isPending}
            onOpenChange={(open) => {
              if (!open) setAnnouncementToDelete(null)
            }}
            onConfirm={() => {
              if (announcementToDelete) deleteMutation.mutate(announcementToDelete.id)
            }}
          />
        </>
      ) : null}
    </div>
  )
}
