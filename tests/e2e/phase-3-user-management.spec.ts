import { expect, test, type Page } from '@playwright/test'
import {
  academicStudent,
  department,
  mockAuthMe,
  mockReferenceData,
  selectByLabel,
  users,
} from './helpers/portal-fixtures'

test.describe('phase 3 - student, teacher, and HOD management', () => {
  test('admin provisions student, teacher, and HOD accounts with the right relationships', async ({
    page,
  }) => {
    const state = {
      users: [studentAccount()] as unknown[],
      payloads: [] as unknown[],
    }

    await mockAuthMe(page, users.admin)
    await mockReferenceData(page)
    await mockUserRoutes(page, state)

    await page.goto('/students')
    await expect(page.getByText(academicStudent.name).first()).toBeVisible()
    await expect(page.getByText(academicStudent.registrationNumber).first()).toBeVisible()

    await page.goto('/teachers')
    await page.locator('#root').getByRole('button', { name: 'Create account' }).first().click()
    await page.getByLabel('Full name').fill(users.teacher.name)
    await page.getByLabel('Email').fill(users.teacher.email)
    await page.getByLabel('Employee ID').fill('EMP-001')
    await selectByLabel(page, 'Department', /Computer Science \(CS\)/)
    await page.getByLabel('Designation').fill('Lecturer')
    await page.getByLabel('Create account').getByRole('button', { name: 'Create account' }).click()

    await expect(
      page.getByRole('heading', { name: 'Temporary password issued' }).first()
    ).toBeVisible()
    expect(state.payloads.at(-1)).toMatchObject({
      fullName: users.teacher.name,
      email: users.teacher.email,
      role: 'teacher',
      employeeId: 'EMP-001',
      departmentId: department.id,
      designation: 'Lecturer',
      isActive: true,
    })

    await page.locator('#root').getByRole('button', { name: 'Create account' }).first().click()
    await page.getByLabel('Full name').fill(users.hod.name)
    await page.getByLabel('Email').fill(users.hod.email)
    await selectByLabel(page, 'Account type', 'HOD')
    await page.getByLabel('Employee ID').fill('HOD-001')
    await selectByLabel(page, 'Department', /Computer Science \(CS\)/)
    await page.getByLabel('Create account').getByRole('button', { name: 'Create account' }).click()

    await expect(
      page.getByRole('heading', { name: 'Temporary password issued' }).first()
    ).toBeVisible()
    expect(state.payloads.at(-1)).toMatchObject({
      fullName: users.hod.name,
      email: users.hod.email,
      role: 'hod',
      employeeId: 'HOD-001',
      departmentId: department.id,
      isActive: true,
    })

    await expect(page.getByText(users.teacher.name).first()).toBeVisible()
    await expect(page.getByText(users.hod.name).first()).toBeVisible()
  })
})

async function mockUserRoutes(page: Page, state: { users: unknown[]; payloads: unknown[] }) {
  await page.route('**/api/users', async (route) => {
    if (route.request().method() === 'POST') {
      const payload = route.request().postDataJSON()
      state.payloads.push(payload)
      const createdUser = {
        id: `user-${state.users.length + 1}`,
        accountStatus: payload.isActive ? 'active' : 'inactive',
        passwordChangeRequired: true,
        ...payload,
      }
      state.users.push(createdUser)
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'User account created',
          temporaryPassword: '@Abc1234',
          user: createdUser,
        }),
      })
      return
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ users: state.users }),
    })
  })
}

function studentAccount() {
  return {
    id: academicStudent.id,
    fullName: academicStudent.name,
    email: 'ayesha.noor@example.com',
    role: 'student',
    registrationNumber: academicStudent.registrationNumber,
    department: department,
    program: { id: 'program-1', name: 'BS Computer Science', code: 'BSCS', isActive: true },
    batch: {
      id: 'batch-1',
      name: 'Fall 2026',
      startingYear: 2026,
      expectedGraduationYear: 2030,
      isActive: true,
    },
    semester: {
      id: 'semester-1',
      name: 'Fall Semester',
      academicYear: '2026-2027',
      isActive: true,
      isClosed: false,
    },
    section: { id: 'section-1', name: 'A', isActive: true },
    academicStatus: 'active',
    accountStatus: 'active',
    isActive: true,
    passwordChangeRequired: false,
  }
}
