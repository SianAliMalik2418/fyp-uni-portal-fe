import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import type { PortalUser, UserRole } from '@/features/auth/types/auth.types'
import { dashboardKeys } from '../api/dashboard-queries'
import { AdminDashboardPage } from './AdminDashboardPage'
import { HodDashboardPage } from './HodDashboardPage'
import { TeacherDashboardPage } from './TeacherDashboardPage'

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

function renderDashboard(data: unknown, page: React.ReactNode) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  queryClient.setQueryData(dashboardKeys.current(), data)
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{page}</QueryClientProvider>
    </MemoryRouter>
  )
}

describe('role dashboards', () => {
  it('shows a teacher assigned-course and work-progress summary', () => {
    renderDashboard(
      {
        role: 'teacher',
        summary: {
          assignedCourses: 2,
          sections: 2,
          students: 54,
          attendanceSessions: 8,
          completedMarkSheets: 6,
          totalAssessments: 10,
          draftResults: 1,
          pendingResults: 2,
          returnedResults: 1,
        },
        assignedCourses: [
          {
            id: 'offering-1',
            course: { code: 'CS401', title: 'Software Engineering' },
            section: { id: 'section-1', name: 'A' },
            studentCount: 30,
          },
        ],
        attendanceActivity: [
          {
            id: 'session-1',
            date: '2026-08-24',
            courseCode: 'CS401',
            courseTitle: 'Software Engineering',
            sectionName: 'A',
            studentCount: 28,
          },
        ],
      },
      <TeacherDashboardPage user={portalUser('teacher')} />
    )

    expect(screen.getByRole('heading', { name: 'Teacher dashboard' })).toBeInTheDocument()
    expect(screen.getByText('54')).toBeInTheDocument()
    expect(screen.getByText('6 of 10')).toBeInTheDocument()
    expect(screen.getAllByText('Software Engineering').length).toBeGreaterThan(0)
    expect(screen.getByText('2 pending')).toBeInTheDocument()
  })

  it('shows department-scoped HOD approvals and attendance shortages', () => {
    renderDashboard(
      {
        role: 'hod',
        department: { id: 'department-1', name: 'Computer Science', code: 'CS' },
        summary: {
          students: 240,
          teachers: 18,
          courses: 32,
          lowAttendance: 4,
          pendingApprovals: 3,
          recentlyApproved: 11,
        },
        lowAttendance: [
          {
            student: { id: 'student-1', name: 'Ali Student', registrationNumber: 'BSCS-001' },
            offering: {
              id: 'offering-1',
              course: { code: 'CS401', title: 'Software Engineering' },
            },
            attendancePercentage: 61,
            requiredPercentage: 75,
          },
        ],
        recentlyApprovedResults: [
          {
            id: 'result-1',
            courseCode: 'CS401',
            courseTitle: 'Software Engineering',
            studentCount: 30,
          },
        ],
        academicSummary: {
          approvedResults: 11,
          studentsAssessed: 275,
          averagePercentage: 73.4,
          passRate: 91.2,
        },
      },
      <HodDashboardPage user={portalUser('hod')} />
    )

    expect(screen.getByRole('heading', { name: 'HOD dashboard' })).toBeInTheDocument()
    expect(screen.getByText('Computer Science')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Ali Student')).toBeInTheDocument()
    expect(screen.getByText('61%')).toBeInTheDocument()
    expect(screen.getByText('91.2%')).toBeInTheDocument()
  })

  it('shows live admin counts and recent administrative activity', () => {
    renderDashboard(
      {
        role: 'admin',
        summary: {
          students: 850,
          teachers: 65,
          departments: 6,
          programs: 14,
          sections: 42,
          courses: 120,
        },
        currentSemester: { id: 'semester-1', name: 'Fall', academicYear: '2026' },
        recentImports: [],
        recentActivity: [
          {
            id: 'user-1',
            label: 'Account created',
            detail: 'New Teacher · teacher',
            occurredAt: '2026-08-24T08:00:00.000Z',
          },
        ],
      },
      <AdminDashboardPage user={portalUser('admin')} />
    )

    expect(screen.getByRole('heading', { name: 'Admin dashboard' })).toBeInTheDocument()
    expect(screen.getByText('850')).toBeInTheDocument()
    expect(screen.getByText('New Teacher · teacher')).toBeInTheDocument()
  })
})
