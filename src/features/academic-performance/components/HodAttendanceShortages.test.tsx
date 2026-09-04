import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it, vi } from 'vitest'
import { apiClient } from '@/shared/api/http-client'
import { HodAttendanceShortages } from './HodAttendanceShortages'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

it('sends student and academic search filters to the shortage query', async () => {
  const getSpy = vi.spyOn(apiClient, 'get').mockImplementation((url) => {
    if (url === '/attendance/shortages') {
      return Promise.resolve({
        data: { shortages: [], page: 1, limit: 20, total: 0, totalPages: 0 },
      })
    }

    return Promise.resolve({ data: { programs: [], batches: [], semesters: [], sections: [] } })
  })
  const user = userEvent.setup()
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  render(
    <QueryClientProvider client={queryClient}>
      <HodAttendanceShortages title="Attendance" />
    </QueryClientProvider>
  )

  await user.type(screen.getByPlaceholderText('Search students'), 'ayesha')
  await user.type(screen.getByPlaceholderText('Search courses'), 'programming')

  await waitFor(() => {
    expect(getSpy).toHaveBeenCalledWith('/attendance/shortages', {
      params: {
        studentSearch: 'ayesha',
        search: 'programming',
        page: 1,
        limit: 20,
      },
    })
  })
})
