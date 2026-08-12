import { expect, test } from '@playwright/test'
import {
  academicStudent,
  assessmentStructure,
  mockAuthMe,
  offering,
  users,
} from './helpers/portal-fixtures'

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
    await page.goto('/results')
    await expect(page.getByText('4.00 CGPA')).toBeVisible()
    await expect(page.getByText('GPA 4.00')).toBeVisible()
    await expect(page.getByText('Programming Fundamentals')).toBeVisible()
  })
})
