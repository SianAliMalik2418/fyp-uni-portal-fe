import { expect, test } from '@playwright/test'
import {
  course,
  mockAuthMe,
  mockCourses,
  mockReferenceData,
  offering,
  program,
  section,
  semester,
  users,
} from './helpers/portal-fixtures.js'

const exam = {
  id: 'exam-1',
  examType: 'Final',
  courseOfferingId: offering.id,
  course: { id: course.id, code: course.code, title: course.title },
  program: { id: program.id, name: program.name, code: program.code },
  semester: { id: semester.id, name: semester.name, academicYear: semester.academicYear },
  section: { id: section.id, name: section.name },
  examDate: '2026-12-18',
  startTime: '09:00',
  endTime: '12:00',
  room: 'Hall A',
  instructions: 'Bring your student card',
}

test('admin configures, edits, and deletes an exam entry', async ({ page }) => {
  await mockAuthMe(page, users.admin)
  await mockReferenceData(page)
  await mockCourses(page)
  let exams: (typeof exam)[] = []

  await page.route('**/api/exams/admin?sectionId=*', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ exams }),
    })
  })
  await page.route('**/api/exams', async (route) => {
    const payload = route.request().postDataJSON() as Record<string, string>
    expect(payload).toMatchObject({
      examType: 'Final',
      courseOfferingId: offering.id,
      examDate: '2026-12-18',
      room: 'Hall A',
    })
    exams = [{ ...exam }]
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Exam entry created', exam: exams[0] }),
    })
  })
  await page.route('**/api/exams/exam-1', async (route) => {
    if (route.request().method() === 'PUT') {
      exams = [{ ...exam, room: 'Hall B' }]
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Exam entry updated', exam: exams[0] }),
      })
      return
    }

    exams = []
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Exam entry deleted' }),
    })
  })

  await page.goto('/exams')

  await page.getByRole('button', { name: 'Add exam' }).click()
  await page.getByLabel('Exam type').fill('Final')
  await page.getByRole('combobox', { name: 'Course' }).click()
  await page.getByRole('option', { name: /programming fundamentals/i }).click()
  await page.getByLabel('Exam date').fill('2026-12-18')
  await page.getByLabel('Start time').fill('09:00')
  await page.getByLabel('End time').fill('12:00')
  await page.getByLabel('Room').fill('Hall A')
  await page.getByLabel('Instructions').fill('Bring your student card')
  await page.getByRole('button', { name: 'Create exam' }).click()

  await expect(page.getByRole('heading', { name: 'Exam created' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Programming Fundamentals' })).toBeVisible()
  await expect(page.getByText('Hall A')).toBeVisible()

  await page.getByRole('button', { name: 'Edit Final exam for Programming Fundamentals' }).click()
  await page.getByLabel('Room').fill('Hall B')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByText('Hall B')).toBeVisible()

  await page.getByRole('button', { name: 'Delete Final exam for Programming Fundamentals' }).click()
  await page.getByRole('button', { name: 'Delete exam' }).click()
  await expect(page.getByText('No exams are configured for this section yet.')).toBeVisible()
})

test('student sees only exams returned for current enrollments', async ({ page }) => {
  await mockAuthMe(page, users.student)
  await page.route('**/api/exams/me/student', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ exams: [exam] }),
    })
  })

  await page.goto('/exams')

  await expect(page.getByRole('heading', { name: 'Exams' })).toBeVisible()
  await expect(page.getByText('Exam date sheet')).toBeVisible()
  await expect(page.getByText('Programming Fundamentals')).toBeVisible()
  await expect(page.getByText('18 December 2026')).toBeVisible()
})

test('teacher sees only exams returned for assigned course offerings', async ({ page }) => {
  await mockAuthMe(page, users.teacher)
  await page.route('**/api/exams/me/teacher', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ exams: [exam] }),
    })
  })

  await page.goto('/exams')

  await expect(page.getByText('Teaching exam schedule')).toBeVisible()
  await expect(page.getByText('Programming Fundamentals')).toBeVisible()
  await expect(page.getByText('Section A')).toBeVisible()
})
