import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/shared/api/http-client'
import { createAnnouncement, listAnnouncements } from './announcements-api'

describe('announcement API', () => {
  afterEach(() => vi.restoreAllMocks())

  it('sends attachments as multipart form data so the backend receives a file', async () => {
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue({
      data: {
        message: 'Announcement created.',
        announcement: {
          id: 'announcement-1',
          title: 'Registration deadline',
          description: 'Complete registration before Friday.',
          publishDate: '2026-08-17T08:00:00.000Z',
          isPinned: false,
          isActive: true,
        },
      },
    })
    const attachment = new File(['notice'], 'notice.pdf', { type: 'application/pdf' })

    await createAnnouncement({
      title: 'Registration deadline',
      description: 'Complete registration before Friday.',
      publishDate: '2026-08-17T08:00',
      expiryDate: '',
      isPinned: false,
      isActive: true,
      attachment,
      removeAttachment: false,
    })

    expect(post).toHaveBeenCalledWith('/announcements', expect.any(FormData), {
      headers: { 'Content-Type': undefined },
    })
    const body = post.mock.calls[0]?.[1]
    expect(body).toBeInstanceOf(FormData)
    expect((body as FormData).get('attachment')).toBe(attachment)
  })

  it('sends text and pinned filters with announcement pagination', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: { announcements: [], page: 2, limit: 20, total: 0, totalPages: 0 },
    })

    await listAnnouncements({
      status: 'all',
      search: 'registration',
      isPinned: true,
      page: 2,
    })

    expect(get).toHaveBeenCalledWith('/announcements', {
      params: {
        status: 'all',
        search: 'registration',
        isPinned: true,
        page: 2,
        limit: 20,
      },
    })
  })
})
