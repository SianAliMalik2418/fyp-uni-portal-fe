import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import type { AnnouncementListQuery, AnnouncementStatus } from '../types/announcement.types'
import { listAnnouncements } from './announcements-api'

export const announcementKeys = {
  all: ['announcements'] as const,
  list: (query: AnnouncementListQuery) => [...announcementKeys.all, 'list', query] as const,
}

export const announcementsQueryOptions = (
  status: AnnouncementStatus,
  page = 1,
  filters: Pick<AnnouncementListQuery, 'search' | 'isPinned'> = {}
) => {
  const query = { status, page, ...filters }
  return queryOptions({
    queryKey: announcementKeys.list(query),
    queryFn: () => listAnnouncements(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}
