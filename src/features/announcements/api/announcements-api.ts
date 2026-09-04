import { apiClient } from '@/shared/api/http-client'
import type { AnnouncementFormValues } from '../schemas/announcement.schemas'
import type {
  Announcement,
  AnnouncementListQuery,
  AnnouncementsResponse,
} from '../types/announcement.types'

export async function listAnnouncements({
  status,
  search,
  isPinned,
  page = 1,
}: AnnouncementListQuery) {
  const { data } = await apiClient.get<AnnouncementsResponse>('/announcements', {
    params: { status, search, isPinned, page, limit: 20 },
  })
  return data
}

function announcementFormData(values: AnnouncementFormValues, canClearExpiry = false) {
  const formData = new FormData()
  formData.set('title', values.title)
  formData.set('description', values.description)
  formData.set('publishDate', new Date(values.publishDate).toISOString())
  if (values.expiryDate) formData.set('expiryDate', new Date(values.expiryDate).toISOString())
  if (canClearExpiry && !values.expiryDate) formData.set('clearExpiry', 'true')
  formData.set('isPinned', String(values.isPinned))
  formData.set('isActive', String(values.isActive))
  if (values.removeAttachment) formData.set('removeAttachment', 'true')
  if (values.attachment) formData.set('attachment', values.attachment)
  return formData
}

export async function createAnnouncement(values: AnnouncementFormValues) {
  const { data } = await apiClient.post<{ message: string; announcement: Announcement }>(
    '/announcements',
    announcementFormData(values),
    { headers: { 'Content-Type': undefined } }
  )
  return data
}

export async function updateAnnouncement({
  announcementId,
  values,
}: {
  announcementId: string
  values: AnnouncementFormValues
}) {
  const { data } = await apiClient.patch<{ message: string; announcement: Announcement }>(
    `/announcements/${announcementId}`,
    announcementFormData(values, true),
    { headers: { 'Content-Type': undefined } }
  )
  return data
}

export async function deleteAnnouncement(announcementId: string) {
  await apiClient.delete(`/announcements/${announcementId}`)
}

export function announcementAttachmentUrl(path: string) {
  return `${apiClient.defaults.baseURL ?? ''}${path}`
}
