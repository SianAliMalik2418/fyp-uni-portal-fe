import { expect, test, type Page } from '@playwright/test'
import {
  academicStudent,
  department,
  mockAuthMe,
  offering,
  semester,
  users,
} from './helpers/portal-fixtures.js'

test.describe('phase 13 - role dashboards', () => {
  test('admin sees system totals and recent activity', async ({ page }) => {
    await mockDashboard(page, users.admin, {
      role: 'admin',
      summary: {
        students: 128,
        teachers: 18,
        departments: 4,
        programs: 7,
        sections: 12,
        courses: 32,
      },
      currentSemester: {
        id: semester.id,
        name: semester.name,
        academicYear: semester.academicYear,
      },
      recentImports: [
        {
          id: 'import-1',
          fileName: 'fall-students.csv',
          importedAt: '2026-08-24T08:00:00.000Z',
          importedCount: 24,
        },
      ],
      recentActivity: [
        {
          id: 'activity-1',
          label: 'Teacher account created',
          detail: 'Tayabba Teacher',
          occurredAt: '2026-08-24T09:00:00.000Z',
        },
      ],
    })

    await page.goto('/dashboard')

    await expect(page.getByRole('heading', { name: 'Admin dashboard' })).toBeVisible()
    await expect(page.getByText('128', { exact: true })).toBeVisible()
    await expect(page.getByText('fall-students.csv')).toBeVisible()
    await expect(page.getByText('Teacher account created')).toBeVisible()
  })

  test('teacher sees assignments, marks progress, and result workflow', async ({ page }) => {
    await mockDashboard(page, users.teacher, {
      role: 'teacher',
      summary: {
        assignedCourses: 1,
        sections: 1,
        students: 24,
        attendanceSessions: 6,
        completedMarkSheets: 3,
        totalAssessments: 4,
        draftResults: 1,
        pendingResults: 2,
        returnedResults: 1,
      },
      assignedCourses: [offering],
      attendanceActivity: [
        {
          id: 'session-1',
          date: '2026-08-24',
          courseCode: offering.course.code,
          courseTitle: offering.course.title,
          sectionName: offering.section.name,
          studentCount: 24,
        },
      ],
    })

    await page.goto('/dashboard')

    await expect(page.getByRole('heading', { name: 'Teacher dashboard' })).toBeVisible()
    await expect(page.getByText('3 of 4')).toBeVisible()
    await expect(page.getByText('Programming Fundamentals').first()).toBeVisible()
    await expect(page.getByText('1 returned')).toBeVisible()
  })

  test('HOD sees attendance shortages and academic summary', async ({ page }) => {
    await mockDashboard(page, users.hod, {
      role: 'hod',
      department,
      summary: {
        students: 96,
        teachers: 12,
        courses: 20,
        lowAttendance: 1,
        pendingApprovals: 3,
        recentlyApproved: 2,
      },
      lowAttendance: [
        {
          student: {
            id: academicStudent.id,
            name: academicStudent.name,
            registrationNumber: academicStudent.registrationNumber,
          },
          offering: {
            id: offering.id,
            course: { code: offering.course.code, title: offering.course.title },
          },
          attendancePercentage: 62.5,
          requiredPercentage: 75,
        },
      ],
      recentlyApprovedResults: [
        {
          id: 'result-1',
          courseCode: offering.course.code,
          courseTitle: offering.course.title,
          approvedAt: '2026-08-24T08:00:00.000Z',
          studentCount: 24,
        },
      ],
      academicSummary: {
        approvedResults: 8,
        studentsAssessed: 86,
        averagePercentage: 74.5,
        passRate: 91,
      },
    })

    await page.goto('/dashboard')

    await expect(page.getByRole('heading', { name: 'HOD dashboard' })).toBeVisible()
    await expect(page.getByText('Attendance shortages')).toBeVisible()
    await expect(page.getByText(academicStudent.name)).toBeVisible()
    await expect(page.getByText('91%')).toBeVisible()
  })
})

async function mockDashboard(page: Page, user: (typeof users)[keyof typeof users], data: unknown) {
  await mockAuthMe(page, user)
  await page.route('**/api/dashboards/me', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(data),
    })
  })
}
