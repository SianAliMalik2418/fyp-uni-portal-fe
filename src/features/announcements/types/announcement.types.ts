export type AnnouncementAttachment = {
  name: string
  mimeType: string
  size: number
  url: string
}

export type Announcement = {
  id: string
  title: string
  description: string
  publishDate: string
  expiryDate?: string
  attachment?: AnnouncementAttachment
  isPinned: boolean
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export type AnnouncementStatus = 'active' | 'expired' | 'scheduled' | 'all'

export type AnnouncementsResponse = {
  announcements: Announcement[]
  page: number
  limit: number
  total: number
  totalPages: number
}
