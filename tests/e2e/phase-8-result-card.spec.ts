import { expect, test } from '@playwright/test'
import {
  academicStudent,
  mockAuthMe,
  offering,
  program,
  semester,
  users,
} from './helpers/portal-fixtures'

test.describe('phase 8 - student result card', () => {
  test('student views and downloads an approved semester result card', async ({ page }) => {
    await mockAuthMe(page, users.student)
    await page.route('**/api/results/student', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          cgpa: 4,
          semesters: [
            {
              semester,
              gpa: 4,
              courses: [
                {
                  id: 'result-1',
                  offering,
                  finalPercentage: 86.5,
                  letterGrade: 'A',
                  gradePoint: 4,
                },
              ],
            },
          ],
        }),
      })
    })
    await page.route('**/api/results/student/result-card/*', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          resultCard: {
            student: {
              name: academicStudent.name,
              registrationNumber: academicStudent.registrationNumber,
            },
            program: { id: program.id, name: program.name, code: program.code },
            semester,
            courses: [
              {
                resultId: 'result-1',
                code: offering.course.code,
                title: offering.course.title,
                creditHours: offering.course.creditHours,
                marks: 86.5,
                grade: 'A',
                gradePoint: 4,
              },
            ],
            totalCreditHours: 3,
            gpa: 4,
          },
        }),
      })
    })

    await page.goto('/results')
    await page.getByRole('button', { name: 'View result card' }).click()

    await expect(page.getByRole('dialog')).toContainText(academicStudent.name)
    await expect(page.getByRole('dialog')).toContainText(academicStudent.registrationNumber)
    await expect(page.getByRole('dialog')).toContainText(program.name)
    await expect(page.getByRole('dialog')).toContainText('Programming Fundamentals')
    await expect(page.getByRole('dialog')).toContainText('Semester GPA 4.00')

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download result card' }).click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toBe('NCBAE-2026-CS-001-Fall-Semester-result-card.pdf')
    await expect(page.getByRole('heading', { name: 'Result card downloaded' })).toBeVisible()
  })
})
