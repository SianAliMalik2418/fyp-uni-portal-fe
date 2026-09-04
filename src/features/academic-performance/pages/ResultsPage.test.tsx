import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it, vi } from 'vitest'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { apiClient } from '@/shared/api/http-client'
import { ResultsPage } from './ResultsPage'

const hod: PortalUser = {
  id: 'hod-1',
  name: 'Department Head',
  email: 'hod@example.com',
  role: 'hod',
  accountStatus: 'active',
  isActive: true,
  passwordChangeRequired: false,
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

it('sends course and result-status filters to the offering query', async () => {
  const getSpy = vi.spyOn(apiClient, 'get').mockImplementation((url) => {
    if (url === '/academic-performance/offerings') {
      return Promise.resolve({ data: { offerings: [] } })
    }

    return Promise.resolve({ data: { programs: [], batches: [], semesters: [], sections: [] } })
  })
  const user = userEvent.setup()
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  render(
    <QueryClientProvider client={queryClient}>
      <ResultsPage title="Results" user={hod} />
    </QueryClientProvider>
  )

  await user.type(screen.getByPlaceholderText('Search courses'), 'programming')
  await user.click(screen.getByLabelText('Result status filter'))
  await user.click(await screen.findByRole('option', { name: 'Pending' }))

  await waitFor(() => {
    expect(getSpy).toHaveBeenCalledWith('/academic-performance/offerings', {
      params: { search: 'programming', resultStatus: 'pending', limit: 50 },
    })
  })
})
