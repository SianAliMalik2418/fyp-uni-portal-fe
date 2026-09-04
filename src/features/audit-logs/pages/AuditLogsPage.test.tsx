import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { auditLogKeys } from '../api/audit-log-queries'
import { AuditLogsPage } from './AuditLogsPage'

it('renders audit entries and updates the module filter', () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  queryClient.setQueryData(auditLogKeys.list({ page: 1, limit: 20 }), {
    auditLogs: [
      {
        id: 'audit-1',
        actor: { id: 'admin-1', name: 'Portal Admin', role: 'admin' },
        action: 'updated',
        module: 'fees',
        affectedRecord: { id: 'fee-1', label: 'Student fee' },
        createdAt: '2026-08-24T08:00:00.000Z',
      },
    ],
    page: 1,
    limit: 20,
    total: 1,
    totalPages: 1,
  })

  render(
    <QueryClientProvider client={queryClient}>
      <AuditLogsPage />
    </QueryClientProvider>
  )

  expect(screen.getByRole('heading', { name: 'Audit log' })).toBeInTheDocument()
  expect(screen.getByText('Portal Admin')).toBeInTheDocument()
  expect(screen.getByText('Student fee')).toBeInTheDocument()

  fireEvent.change(screen.getByLabelText('Module'), { target: { value: 'fees' } })
  expect(screen.getByLabelText('Module')).toHaveValue('fees')
})
