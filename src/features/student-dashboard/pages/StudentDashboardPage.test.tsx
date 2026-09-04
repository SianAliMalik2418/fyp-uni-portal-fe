import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, it } from 'vitest'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { studentDashboardKeys } from '../api/student-dashboard-queries'
import { StudentDashboardPage } from './StudentDashboardPage'

const user: PortalUser = {
  id: 'student-1',
  name: 'Ali Student',
  email: 'student@example.com',
  role: 'student',
  accountStatus: 'active',
  isActive: true,
  passwordChangeRequired: false,
}

it('renders live student service statistics and academic identity', () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  queryClient.setQueryData(studentDashboardKeys.summary(), {
    role: 'student',
    student: {
      id: 'student-1',
      name: 'Ali Student',
      registrationNumber: 'BSCS-001',
      department: { id: 'department-1', name: 'Computer Science', code: 'CS' },
      program: { id: 'program-1', name: 'BS Computer Science', code: 'BSCS' },
      semester: { id: 'semester-1', name: 'Fall', academicYear: '2026' },
      section: { id: 'section-1', name: 'A' },
    },
    currentSemester: { id: 'semester-1', name: 'Fall', academicYear: '2026' },
    courses: [{ id: 'offering-1' }],
    attendance: { summaries: [] },
    academics: {
      recentMarks: [],
      summary: {
        publishedAssessments: 0,
        coursesWithMarks: 0,
        averagePercentage: 0,
        weightedPercentage: 0,
      },
    },
    results: { latest: null, gpa: 0, cgpa: 0 },
    fee: { remainingAmount: 12500 },
    todayClasses: [{ id: 'entry-1' }],
    upcomingExams: [{ id: 'exam-1' }, { id: 'exam-2' }],
    announcements: [
      {
        id: 'announcement-1',
        title: 'Semester registration opens',
        description: 'Complete registration by Friday.',
        publishDate: '2026-08-24',
        isPinned: true,
        isActive: true,
      },
    ],
    notifications: [],
  })

  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <StudentDashboardPage user={user} />
      </QueryClientProvider>
    </MemoryRouter>
  )

  expect(screen.getByText('BSCS-001')).toBeInTheDocument()
  expect(screen.getByText('Fall 2026')).toBeInTheDocument()
  expect(screen.getByText('PKR 12,500')).toBeInTheDocument()
  expect(
    screen.getByText('1', { selector: '[data-dashboard-stat="today-classes"]' })
  ).toBeInTheDocument()
  expect(
    screen.getByText('2', { selector: '[data-dashboard-stat="upcoming-exams"]' })
  ).toBeInTheDocument()
  expect(screen.getByText('Semester registration opens')).toBeInTheDocument()
})
