import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it, vi } from 'vitest'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { apiClient } from '@/shared/api/http-client'
import { AnnouncementsPage } from './AnnouncementsPage'

const admin: PortalUser = {
  id: 'admin-1',
  name: 'Portal Admin',
  email: 'admin@example.com',
  role: 'admin',
  accountStatus: 'active',
  isActive: true,
  passwordChangeRequired: false,
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

it('sends text and pinned filters to the announcement list query', async () => {
  const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
    data: { announcements: [], page: 1, limit: 20, total: 0, totalPages: 0 },
  })
  const user = userEvent.setup()
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  render(
    <QueryClientProvider client={queryClient}>
      <AnnouncementsPage title="Announcements" user={admin} />
    </QueryClientProvider>
  )

  await user.type(screen.getByPlaceholderText('Search announcements'), 'registration')
  await user.click(screen.getByRole('button', { name: 'Pinned only' }))

  await waitFor(() => {
    expect(getSpy).toHaveBeenCalledWith('/announcements', {
      params: {
        status: 'active',
        search: 'registration',
        isPinned: true,
        page: 1,
        limit: 20,
      },
    })
  })
})
