import { expect, test, type Page } from '@playwright/test'
import {
  course,
  department,
  mockAuthMe,
  mockReferenceData,
  offering,
  program,
  section,
  selectByLabel,
  semester,
  users,
} from './helpers/portal-fixtures'

test.describe('phase 4 - courses, teacher assignment, and enrollment', () => {
  test('admin creates a course, assigns it to a section, and assigns the teacher', async ({
    page,
  }) => {
    const state = {
      courses: [] as unknown[],
      offerings: [] as unknown[],
      lastCoursePayload: undefined as unknown,
      lastAssignmentPayload: undefined as unknown,
      lastTeacherPayload: undefined as unknown,
    }

    await mockAuthMe(page, users.admin)
    await mockReferenceData(page)
    await mockCourseRoutes(page, state)

    await page.goto('/courses')
    await page.getByRole('button', { name: 'Add course' }).click()
    await page.getByLabel('Course code').fill(course.code)
    await page.getByLabel('Course title').fill(course.title)
    await page.getByLabel('Credit hours').fill(String(course.creditHours))
    await selectByLabel(page, 'Department', department.name)
    await selectByLabel(page, 'Program', program.name)
    await selectByLabel(page, 'Semester', /Fall Semester \(2026-2027\)/)
    await page.getByLabel('Description').fill(course.description)
    await page.getByRole('button', { name: 'Add course' }).click()

    await expect(page.getByText('Course created')).toBeVisible()
    expect(state.lastCoursePayload).toMatchObject({
      code: course.code,
      title: course.title,
      creditHours: course.creditHours,
      departmentId: department.id,
      programId: program.id,
      semesterId: semester.id,
      description: course.description,
      isActive: true,
    })

    await selectByLabel(page, 'Section', /BSCS .* Fall Semester .* A/)
    await page.getByLabel(`${course.code} · ${course.title}`).check()
    await page.getByRole('button', { name: 'Save assignment' }).click()

    await expect(page.getByText('Assignment saved')).toBeVisible()
    expect(state.lastAssignmentPayload).toEqual({ courseIds: [course.id] })

    await page.getByText('Unassigned').click()
    await page.getByRole('option', { name: users.teacher.name }).click()

    await expect(page.getByText('Teacher saved')).toBeVisible()
    expect(state.lastTeacherPayload).toEqual({ teacherId: users.teacher.id })
  })

  test('student and teacher only see their assigned course sections', async ({ page }) => {
    await mockAuthMe(page, users.student)
    await mockReadOnlyCourseRoutes(page)

    await page.goto('/courses')

    await expect(page.getByRole('heading', { name: 'Courses' })).toBeVisible()
    await expect(page.getByText(course.title).first()).toBeVisible()
    await expect(page.getByText(users.teacher.name).first()).toBeVisible()

    await page.unroute('**/api/auth/me')
    await mockAuthMe(page, users.teacher)
    await page.goto('/courses')

    await expect(page.getByRole('heading', { name: 'Courses' })).toBeVisible()
    await expect(page.getByText(course.title).first()).toBeVisible()
    await expect(page.getByText('1').first()).toBeVisible()
  })
})

async function mockCourseRoutes(page: Page, state: Record<string, unknown>) {
  await page.route('**/api/courses', async (route) => {
    if (route.request().method() === 'POST') {
      state.lastCoursePayload = route.request().postDataJSON()
      state.courses = [course]
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Course created', course }),
      })
      return
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ courses: state.courses }),
    })
  })

  await page.route('**/api/courses/sections/*/offerings', async (route) => {
    if (route.request().method() === 'PUT') {
      state.lastAssignmentPayload = route.request().postDataJSON()
      state.offerings = [{ ...offering, teacher: undefined }]
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Assignment saved', offerings: state.offerings }),
      })
      return
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ offerings: state.offerings }),
    })
  })

  await page.route('**/api/courses/teachers', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        teachers: [
          {
            id: users.teacher.id,
            fullName: users.teacher.name,
            email: users.teacher.email,
            employeeId: 'EMP-001',
            department,
          },
        ],
      }),
    })
  })

  await page.route('**/api/courses/offerings/*/teacher', async (route) => {
    state.lastTeacherPayload = route.request().postDataJSON()
    state.offerings = [offering]
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Teacher saved', offering }),
    })
  })

  await page.route('**/api/courses/offerings', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ offerings: state.offerings }),
    })
  })
}

async function mockReadOnlyCourseRoutes(page: Page) {
  await page.route('**/api/courses/me/student', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ offerings: [offering] }),
    })
  })
  await page.route('**/api/courses/me/teacher', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ offerings: [offering] }),
    })
  })
}
