import { expect, test } from '@playwright/test'

const adminUser = {
  id: 'admin-1',
  name: 'Sian Admin',
  email: 'admin@example.com',
  role: 'admin',
  accountStatus: 'active',
  isActive: true,
  passwordChangeRequired: false,
}

const studentUser = {
  ...adminUser,
  id: 'student-1',
  name: 'Hammad Student',
  email: 'student@example.com',
  role: 'student',
}

const teacherUser = {
  ...adminUser,
  id: 'teacher-1',
  name: 'Tayabba Teacher',
  email: 'teacher@example.com',
  role: 'teacher',
}

test('logs in with email/password and shows the admin portal shell', async ({ page }) => {
  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Authentication required' }),
    })
  })

  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        user: adminUser,
        expiresAt: '2030-01-01T00:00:00.000Z',
      }),
    })
  })

  await page.goto('/')

  await expect(page.getByLabel('Email')).toBeVisible()
  await page.getByLabel('Email').fill('admin@example.com')
  await page.getByLabel(/^Password$/).fill('temporary-password')
  await page.getByRole('button', { name: 'Login' }).click()

  await expect(page.getByRole('navigation', { name: 'Admin navigation' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Students' })).toBeVisible()
  await expect(page.getByText('Admin protected area')).toBeVisible()
})

test('opens the profile menu and logs out', async ({ page }) => {
  let isLoggedIn = true

  await page.route('**/api/auth/me', async (route) => {
    if (!isLoggedIn) {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Authentication required' }),
      })
      return
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ user: adminUser }),
    })
  })

  await page.route('**/api/auth/logout', async (route) => {
    isLoggedIn = false

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Logout successful' }),
    })
  })

  await page.goto('/')

  await expect(page.getByRole('navigation', { name: 'Admin navigation' })).toBeVisible()
  await page.getByRole('button', { name: 'Open profile menu' }).click()
  await page.getByText(/^Logout$/).click()

  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
})

test('updates the admin attendance threshold', async ({ page }) => {
  let minimumAttendancePercentage = 75

  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ user: adminUser }),
    })
  })

  await page.route('**/api/attendance/configuration', async (route) => {
    if (route.request().method() === 'PUT') {
      const payload = route.request().postDataJSON() as {
        minimumAttendancePercentage: number
      }
      minimumAttendancePercentage = payload.minimumAttendancePercentage
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Attendance settings updated.',
        configuration: { minimumAttendancePercentage },
      }),
    })
  })

  await page.goto('/attendance')

  const input = page.getByLabel('Minimum attendance percentage')
  await expect(input).toHaveValue('75')
  await input.fill('80')
  await page.getByRole('button', { name: 'Save setting' }).click()

  await expect(input).toHaveValue('80')
  await expect(page.getByText('The minimum attendance requirement is now 80%.')).toBeVisible()
  expect(minimumAttendancePercentage).toBe(80)
})

test('shows student attendance warnings and opens attendance details', async ({ page }) => {
  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ user: studentUser }),
    })
  })

  await page.route('**/api/student-dashboard', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        attendance: {
          summaries: [
            {
              offering: {
                id: 'offering-1',
                course: { code: 'PF', title: 'Programming Fundamentals' },
              },
              totalClasses: 8,
              present: 5,
              absent: 2,
              leave: 1,
              attendancePercentage: 62.5,
              requiredPercentage: 75,
              isBelowThreshold: true,
            },
          ],
        },
      }),
    })
  })

  await page.route('**/api/attendance/student', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ summaries: [] }),
    })
  })

  await page.goto('/dashboard')

  await expect(page.getByText('Low-attendance warning')).toBeVisible()
  await page.getByRole('link', { name: 'View attendance' }).click()
  await expect(page).toHaveURL(/\/attendance$/)
})

test('teacher enters assessment marks and saves a draft', async ({ page }) => {
  const offering = {
    id: 'offering-1',
    course: {
      id: 'course-1',
      code: 'PF',
      title: 'Programming Fundamentals',
      creditHours: 3,
      department: { id: 'department-1', name: 'Computer Science', code: 'CS', isActive: true },
      program: { id: 'program-1', name: 'BS Computer Science', code: 'BSCS', isActive: true },
      semester: {
        id: 'semester-1',
        name: 'Fall Semester',
        academicYear: '2026-2027',
        isActive: true,
        isClosed: false,
      },
      isActive: true,
    },
    section: {
      id: 'section-1',
      name: 'A',
      program: { id: 'program-1', name: 'BS Computer Science', code: 'BSCS', isActive: true },
      semester: {
        id: 'semester-1',
        name: 'Fall Semester',
        academicYear: '2026-2027',
        isActive: true,
        isClosed: false,
      },
      isActive: true,
    },
    studentCount: 1,
    isActive: true,
  }
  const assessment = {
    id: 'assessment-1',
    offering,
    name: 'Quiz 1',
    category: 'quiz',
    maximumMarks: 10,
  }
  let savedMarks: unknown

  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ user: teacherUser }),
    })
  })
  await page.route('**/api/academic-performance/offerings', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ offerings: [offering] }),
    })
  })
  await page.route('**/api/assessments?*', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ assessments: [assessment] }),
    })
  })
  await page.route('**/api/marks/assessment-1/draft', async (route) => {
    savedMarks = route.request().postDataJSON()
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Marks draft saved successfully.',
        sheet: {
          assessment,
          records: [
            {
              student: {
                id: 'student-1',
                name: 'Ayesha Noor',
                registrationNumber: 'NCBAE-2026-CS-001',
              },
              obtainedMarks: 8.5,
              missing: false,
            },
          ],
          isDraft: true,
          missingCount: 0,
          updatedAt: '2026-08-12T00:00:00.000Z',
        },
      }),
    })
  })
  await page.route('**/api/marks/assessment-1', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        sheet: {
          assessment,
          records: [
            {
              student: {
                id: 'student-1',
                name: 'Ayesha Noor',
                registrationNumber: 'NCBAE-2026-CS-001',
              },
              missing: true,
            },
          ],
          isDraft: true,
          missingCount: 1,
        },
      }),
    })
  })

  await page.goto('/marks')
  await page.getByRole('spinbutton', { name: 'Marks for Ayesha Noor' }).fill('8.5')
  await page.getByRole('button', { name: 'Save draft' }).click()

  await expect(page.getByText('Marks draft saved successfully.')).toBeVisible()
  expect(savedMarks).toEqual({
    records: [{ studentId: 'student-1', obtainedMarks: 8.5 }],
  })
})

test('admin updates the university assessment structure with a 100 percent total', async ({
  page,
}) => {
  const categories = [
    { id: 'quiz', label: 'Quizzes', weightPercentage: 10 },
    { id: 'assignment', label: 'Assignments', weightPercentage: 10 },
    { id: 'attendance', label: 'Attendance', weightPercentage: 10 },
    { id: 'presentation', label: 'Presentation', weightPercentage: 10 },
    { id: 'midterm', label: 'Midterm', weightPercentage: 25 },
    { id: 'final', label: 'Final', weightPercentage: 35 },
  ]
  let savedStructure: unknown

  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ user: adminUser }),
    })
  })
  await page.route('**/api/assessments/structure', async (route) => {
    if (route.request().method() === 'PUT') {
      savedStructure = route.request().postDataJSON()
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Assessment structure updated.',
        structure: { categories, totalPercentage: 100 },
      }),
    })
  })

  await page.goto('/assessment-structure')

  await expect(page.getByText('Total weightage')).toBeVisible()
  await expect(page.getByText('100%', { exact: true })).toBeVisible()

  await page.getByLabel('Final').fill('30')
  await expect(page.getByRole('button', { name: 'Save structure' })).toBeDisabled()
  await expect(page.getByText('95%')).toBeVisible()

  await page.getByLabel('Presentation').fill('15')
  await page.getByRole('button', { name: 'Save structure' }).click()

  await expect(page.getByText('Assessment structure updated.')).toBeVisible()
  expect(savedStructure).toEqual({
    categories: [
      { id: 'quiz', weightPercentage: 10 },
      { id: 'assignment', weightPercentage: 10 },
      { id: 'attendance', weightPercentage: 10 },
      { id: 'presentation', weightPercentage: 15 },
      { id: 'midterm', weightPercentage: 25 },
      { id: 'final', weightPercentage: 30 },
    ],
  })
})
