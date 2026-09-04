import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import type { PortalUser, UserRole } from '@/features/auth/types/auth.types'
import { auditLogKeys } from '@/features/audit-logs/api/audit-log-queries'
import { dashboardKeys } from '@/features/dashboards/api/dashboard-queries'
import { notificationKeys } from '@/features/notifications/api/notification-queries'
import { PortalPage } from './PortalPage'

afterEach(cleanup)

function portalUser(role: UserRole): PortalUser {
  return {
    id: `${role}-1`,
    name: `${role} user`,
    email: `${role}@example.com`,
    role,
    accountStatus: 'active',
    isActive: true,
    passwordChangeRequired: false,
  }
}

function renderPortal(user: PortalUser, dashboard: unknown) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  queryClient.setQueryData(dashboardKeys.current(), dashboard)
  queryClient.setQueryData(notificationKeys.list(), { notifications: [], unreadCount: 0 })
  queryClient.setQueryData(auditLogKeys.list({ page: 1, limit: 20 }), {
    auditLogs: [],
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/:sectionId?" element={<PortalPage user={user} onLogout={() => {}} />} />
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>
  )
}

describe('PortalPage', () => {
  it.each([
    [
      'teacher' as const,
      {
        role: 'teacher',
        summary: {
          assignedCourses: 0,
          sections: 0,
          students: 0,
          attendanceSessions: 0,
          completedMarkSheets: 0,
          totalAssessments: 0,
          draftResults: 0,
          pendingResults: 0,
          returnedResults: 0,
        },
        assignedCourses: [],
        attendanceActivity: [],
      },
      'Teacher dashboard',
    ],
    [
      'hod' as const,
      {
        role: 'hod',
        department: { id: 'department-1', name: 'Computer Science', code: 'CS' },
        summary: {
          students: 0,
          teachers: 0,
          courses: 0,
          lowAttendance: 0,
          pendingApprovals: 0,
          recentlyApproved: 0,
        },
        lowAttendance: [],
        recentlyApprovedResults: [],
        academicSummary: {
          approvedResults: 0,
          studentsAssessed: 0,
          averagePercentage: 0,
          passRate: 0,
        },
      },
      'HOD dashboard',
    ],
    [
      'admin' as const,
      {
        role: 'admin',
        summary: {
          students: 0,
          teachers: 0,
          departments: 0,
          programs: 0,
          sections: 0,
          courses: 0,
        },
        currentSemester: null,
        recentImports: [],
        recentActivity: [],
      },
      'Admin dashboard',
    ],
  ])('renders the live %s dashboard instead of a placeholder', (role, data, heading) => {
    renderPortal(portalUser(role), data)

    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
    expect(screen.queryByText(/module access is ready for backend data/i)).not.toBeInTheDocument()
  })

  it('opens a mobile navigation drawer, reaches the audit log, and closes the drawer', async () => {
    const user = userEvent.setup()
    renderPortal(portalUser('admin'), {
      role: 'admin',
      summary: {
        students: 0,
        teachers: 0,
        departments: 0,
        programs: 0,
        sections: 0,
        courses: 0,
      },
      currentSemester: null,
      recentImports: [],
      recentActivity: [],
    })

    expect(screen.getAllByRole('navigation', { name: /admin navigation/i })).toHaveLength(1)
    expect(screen.queryByRole('link', { name: 'Materials' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open navigation' }))

    const drawer = screen.getByRole('dialog', { name: 'Portal navigation' })
    expect(drawer).toBeInTheDocument()
    await user.click(screen.getAllByRole('link', { name: 'Audit log' }).at(-1)!)

    expect(await screen.findByRole('heading', { name: 'Audit log' })).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Portal navigation' })).not.toBeInTheDocument()
    })
  })
})
