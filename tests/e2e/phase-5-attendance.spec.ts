import { expect, test } from '@playwright/test'
import { academicStudent, course, mockAuthMe, offering, users } from './helpers/portal-fixtures'

test.describe('phase 5 - attendance management', () => {
  test('teacher marks attendance, student sees percentage, and HOD sees shortage', async ({
    page,
  }) => {
    let attendancePayload: unknown

    await mockAuthMe(page, users.teacher)
    await page.route('**/api/academic-performance/offerings', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ offerings: [offering] }),
      })
    })
    await page.route('**/api/academic-performance/offerings/*/students', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ offering, students: [academicStudent] }),
      })
    })
    await page.route('**/api/attendance/sessions?*', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ sessions: [] }),
      })
    })
    await page.route('**/api/attendance/sessions', async (route) => {
      attendancePayload = route.request().postDataJSON()
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Attendance saved successfully.',
          session: {
            id: 'attendance-session-1',
            offering,
            date: '2026-08-12',
            records: [{ student: academicStudent, status: 'present' }],
            studentCount: 1,
          },
        }),
      })
    })

    await page.goto('/attendance')
    await expect(page.getByText(academicStudent.name)).toBeVisible()
    await page.getByRole('button', { name: 'Save attendance' }).click()

    await expect(page.getByRole('heading', { name: 'Attendance saved' })).toBeVisible()
    expect(attendancePayload).toMatchObject({
      offeringId: offering.id,
      records: [{ studentId: academicStudent.id, status: 'present' }],
    })

    await page.unroute('**/api/auth/me')
    await mockAuthMe(page, users.student)
    await page.route('**/api/attendance/student', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          summaries: [
            {
              offering,
              totalClasses: 4,
              present: 2,
              absent: 2,
              leave: 0,
              attendancePercentage: 50,
              requiredPercentage: 75,
              isBelowThreshold: true,
            },
          ],
        }),
      })
    })

    await page.goto('/attendance')
    await expect(page.getByText(course.title).first()).toBeVisible()
    await expect(page.getByText('50%')).toBeVisible()
    await expect(page.getByText('Required 75%')).toBeVisible()

    await page.unroute('**/api/auth/me')
    await mockAuthMe(page, users.hod)
    await page.route('**/api/attendance/shortages', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          shortages: [
            {
              offering,
              student: academicStudent,
              totalClasses: 4,
              present: 2,
              absent: 2,
              leave: 0,
              attendancePercentage: 50,
              requiredPercentage: 75,
              isBelowThreshold: true,
            },
          ],
        }),
      })
    })

    await page.goto('/attendance')
    await expect(page.getByText(academicStudent.name).first()).toBeVisible()
    await expect(page.getByText(academicStudent.registrationNumber).first()).toBeVisible()
    await expect(page.getByText(course.title).first()).toBeVisible()
    await expect(page.getByText('75%')).toBeVisible()
  })
})
