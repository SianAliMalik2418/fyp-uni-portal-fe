import { expect, test } from '@playwright/test'
import {
  academicStudent,
  assessmentStructure,
  mockAuthMe,
  offering,
  users,
} from './helpers/portal-fixtures.js'

const categories = assessmentStructure.categories.map((category) => ({
  category: category.id,
  obtainedMarks: category.weightPercentage,
  maximumMarks: category.weightPercentage,
  percentage: 100,
  weightedMarks: category.weightPercentage,
}))

const record = {
  student: academicStudent,
  categories,
  finalPercentage: 86.5,
  letterGrade: 'A',
  gradePoint: 4,
}

const gradingScale = {
  ranges: [
    { minimumPercentage: 85, maximumPercentage: 100, letterGrade: 'A', gradePoint: 4 },
    { minimumPercentage: 80, maximumPercentage: 84.99, letterGrade: 'A-', gradePoint: 3.7 },
    { minimumPercentage: 0, maximumPercentage: 79.99, letterGrade: 'F', gradePoint: 0 },
  ],
}

function courseResult(status: 'draft' | 'pending' | 'returned' | 'approved', comment?: string) {
  return {
    id: status === 'draft' ? undefined : 'result-1',
    offering,
    status,
    records: [record],
    statistics: {
      studentCount: 1,
      averagePercentage: 86.5,
      highestPercentage: 86.5,
      lowestPercentage: 86.5,
      passCount: 1,
    },
    submissionReady: true,
    hodComment: comment,
  }
}

test.describe('phase 7 - result approval and publishing', () => {
  test('teacher submits, HOD returns and approves, then student sees GPA', async ({ page }) => {
    let currentResult = courseResult('draft')
    let returnPayload: unknown
    let gradingPayload: unknown
    let readNotificationId: string | undefined

    await mockAuthMe(page, users.admin)
    await page.route('**/api/results/grading-scale', async (route) => {
      if (route.request().method() === 'PUT') gradingPayload = route.request().postDataJSON()
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Grading scale updated.', gradingScale }),
      })
    })
    await page.goto('/grading-scale')
    await expect(page.getByLabel('Minimum percentage for A', { exact: true })).toHaveValue('85')
    await page.getByRole('button', { name: 'Save grading scale' }).click()
    await expect(page.getByRole('heading', { name: 'Grading scale saved' })).toBeVisible()
    expect(gradingPayload).toEqual(gradingScale)

    await page.unroute('**/api/auth/me')
    await mockAuthMe(page, users.teacher)
    await page.route('**/api/academic-performance/offerings', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ offerings: [offering] }),
      })
    })
    await page.route('**/api/results/course/**', async (route) => {
      if (route.request().url().endsWith('/submit')) currentResult = courseResult('pending')
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Result workflow updated.', result: currentResult }),
      })
    })
    await page.route('**/api/results/result-1/**', async (route) => {
      if (route.request().url().endsWith('/return')) {
        returnPayload = route.request().postDataJSON()
        currentResult = courseResult('returned', 'Verify the final assessment marks.')
      } else if (route.request().url().endsWith('/approve')) {
        currentResult = courseResult('approved')
      }
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Result workflow updated.', result: currentResult }),
      })
    })

    await page.goto('/results')
    await expect(page.getByText('86.5%', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('A', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Submit result' }).click()
    await expect(page.getByText('Pending HOD Approval')).toBeVisible()

    await page.unroute('**/api/auth/me')
    await mockAuthMe(page, users.hod)
    await page.goto('/results')
    await page.getByRole('button', { name: 'Return with comments' }).click()
    await page.getByLabel('Reason').fill('Verify the final assessment marks.')
    await page.getByRole('button', { name: 'Return result' }).click()
    await expect(page.getByText('Returned', { exact: true })).toBeVisible()
    expect(returnPayload).toEqual({ comment: 'Verify the final assessment marks.' })

    currentResult = courseResult('pending')
    await page.reload()
    await page.getByRole('button', { name: 'Approve result' }).click()
    await expect(page.getByText('Approved', { exact: true })).toBeVisible()

    await page.unroute('**/api/auth/me')
    await mockAuthMe(page, users.student)
    await page.route('**/api/results/student', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          cgpa: 4,
          semesters: [
            {
              semester: offering.course.semester,
              gpa: 4,
              courses: [{ id: 'result-1', offering, ...record }],
            },
          ],
        }),
      })
    })
    await page.route('**/api/student-dashboard', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
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
          results: {
            latest: { id: 'result-1', offering, ...record },
            gpa: 4,
            cgpa: 4,
          },
          notifications: [
            {
              id: 'notification-1',
              type: 'result_published',
              title: 'Result published',
              message: 'Programming Fundamentals has been approved. Your grade is A.',
              resultId: 'result-1',
              isRead: false,
            },
          ],
        }),
      })
    })
    await page.route('**/api/notifications/*/read', async (route) => {
      readNotificationId = route.request().url().split('/').at(-2)
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Notification marked as read.' }),
      })
    })
    await page.goto('/results')
    await expect(page.getByText('4.00 CGPA')).toBeVisible()
    await expect(page.getByText('GPA 4.00')).toBeVisible()
    await expect(page.getByText('Programming Fundamentals')).toBeVisible()

    await page.goto('/dashboard')
    await expect(page.getByText('Latest published result')).toBeVisible()
    await expect(page.getByText('4.00 GPA')).toBeVisible()
    await expect(page.getByText('Result published')).toBeVisible()
    await page.getByRole('button', { name: 'Mark as read' }).click()
    expect(readNotificationId).toBe('notification-1')
  })
})
