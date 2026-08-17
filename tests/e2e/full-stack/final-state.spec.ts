import { expect, test, type Page } from '@playwright/test'

const password = 'Password123!'

const accounts = {
  admin: 'admin.e2e@example.com',
  hod: 'hod.e2e@example.com',
  teacher: 'teacher.e2e@example.com',
  student: 'student.e2e@example.com',
}

test.describe.configure({ mode: 'serial' })

test.describe('full-stack final state', () => {
  test('admin sees implemented setup modules and unfinished placeholder modules', async ({
    page,
  }) => {
    await login(page, accounts.admin)

    await page.goto('/departments')
    await expect(page.getByRole('heading', { name: 'Departments' })).toBeVisible()
    await expect(page.getByText('Computer Science').first()).toBeVisible()

    await page.goto('/programs')
    await expect(page.getByRole('heading', { name: 'Programs' })).toBeVisible()
    await expect(page.getByText('BS Computer Science').first()).toBeVisible()

    await page.goto('/academic-structure')
    await expect(page.getByText('Active: Fall Semester')).toBeVisible()
    await expect(page.getByText('Fall 2026').first()).toBeVisible()

    await page.goto('/courses')
    await expect(page.getByRole('heading', { name: 'Courses' })).toBeVisible()
    await expect(page.getByText('Programming Fundamentals').first()).toBeVisible()
    await expect(page.getByText('Tayabba Teacher').first()).toBeVisible()

    await page.goto('/attendance')
    await expect(page.getByRole('heading', { name: 'Attendance Settings' })).toBeVisible()
    await expect(page.getByLabel('Minimum attendance percentage')).toHaveValue('75')

    await page.goto('/assessment-structure')
    await expect(page.getByLabel('Quizzes')).toHaveValue('10')
    await expect(page.getByLabel('Final')).toHaveValue('35')
    await expect(page.getByText('100%', { exact: true })).toBeVisible()

    await page.goto('/grading-scale')
    await expect(page.getByLabel('Minimum percentage for A', { exact: true })).toHaveValue('85')
    await expect(page.getByLabel('Grade point for A', { exact: true })).toHaveValue('4')

    await page.goto('/fees')
    await expect(page.getByText('Fees workspace', { exact: true })).toBeVisible()
    await expect(page.getByText('No fee batches available yet.')).toBeVisible()
  })

  test('teacher can use assigned course, attendance, assessment, and marks modules', async ({
    page,
  }) => {
    await login(page, accounts.teacher)

    await page.goto('/courses')
    await expect(page.getByRole('heading', { name: 'Courses' })).toBeVisible()
    await expect(page.getByText('Programming Fundamentals').first()).toBeVisible()
    await expect(page.getByText('BSCS · Fall Semester · A').first()).toBeVisible()

    await page.goto('/attendance')
    await expect(page.getByText('Ayesha Noor')).toBeVisible()
    await expect(page.getByText('NCBAE-2026-CS-001')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Save attendance' })).toBeEnabled()

    await page.goto('/assessments')
    await expect(page.getByLabel('Course section')).toContainText('PF - BSCS Fall Semester A')
    await expect(page.getByText('Quiz 1').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create assessment' })).toBeEnabled()

    await page.goto('/marks')
    await expect(page.getByText('Quiz 1').first()).toBeVisible()
    await expect(page.getByRole('spinbutton', { name: 'Marks for Ayesha Noor' })).toHaveValue('8')

    await page.goto('/results')
    await expect(page.getByText('Draft', { exact: true })).toBeVisible()
    await expect(page.getByText('Ayesha Noor')).toBeVisible()
    await page.getByRole('button', { name: 'Submit result' }).click()
    await expect(page.getByText('Pending HOD Approval')).toBeVisible()
  })

  test('student sees enrolled courses, attendance shortage, and published academic data', async ({
    page,
  }) => {
    await login(page, accounts.student)

    await page.goto('/dashboard')
    await expect(page.getByText('Low-attendance warning')).toBeVisible()
    await expect(page.getByText('Recent marks')).toBeVisible()
    await expect(page.getByText('Quiz 1').first()).toBeVisible()
    await expect(page.getByText('8 / 10')).toBeVisible()
    await expect(page.getByText('Academic summary')).toBeVisible()

    await page.goto('/courses')
    await expect(page.getByRole('heading', { name: 'Courses' })).toBeVisible()
    await expect(page.getByText('Programming Fundamentals').first()).toBeVisible()
    await expect(page.getByText('Tayabba Teacher').first()).toBeVisible()

    await page.goto('/attendance')
    await expect(page.getByText('Programming Fundamentals').first()).toBeVisible()
    await expect(page.getByText('50%')).toBeVisible()
    await expect(page.getByText('Required 75%')).toBeVisible()

    await page.goto('/results')
    await expect(page.getByText('No published results')).toBeVisible()
  })

  test('HOD sees final-state attendance shortage data and blocked admin-only routes', async ({
    page,
  }) => {
    await login(page, accounts.hod)

    await page.goto('/attendance')
    await expect(page.getByText('Ayesha Noor').first()).toBeVisible()
    await expect(page.getByText('NCBAE-2026-CS-001').first()).toBeVisible()
    await expect(page.getByText('Programming Fundamentals').first()).toBeVisible()
    await expect(page.getByText('50%')).toBeVisible()

    await page.goto('/results')
    await expect(page.getByText('Pending HOD Approval')).toBeVisible()
    await page.getByRole('button', { name: 'Approve result' }).click()
    await expect(page.getByText('Approved', { exact: true })).toBeVisible()

    await page.goto('/students')
    await expect(page.getByText('Access blocked')).toBeVisible()
    await expect(page.getByText(/HOD accounts cannot access "students"/)).toBeVisible()
  })

  test('student sees the HOD-approved course result and calculated GPA', async ({ page }) => {
    await login(page, accounts.student)
    await page.goto('/results')

    await expect(page.getByText('0.00 CGPA')).toBeVisible()
    await expect(page.getByText('GPA 0.00')).toBeVisible()
    await expect(page.getByText('Programming Fundamentals')).toBeVisible()

    await page.goto('/dashboard')
    await expect(page.getByText('Latest published result')).toBeVisible()
    await expect(page.getByText('Result published')).toBeVisible()
    await expect(page.getByText('0.00 GPA')).toBeVisible()
    await page.getByRole('button', { name: 'View result card' }).click()
    await expect(page.getByRole('dialog')).toContainText('Ayesha Noor')
    await expect(page.getByRole('dialog')).toContainText('Programming Fundamentals')
  })
})

async function login(page: Page, email: string) {
  await page.goto('/')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel(/^Password$/).fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page.getByRole('button', { name: 'Open profile menu' })).toBeVisible()
}
