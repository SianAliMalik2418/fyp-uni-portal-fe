import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { queryClient } from './app/query-client'
import { toast } from './components/ui/toast-manager'
import { apiClient } from './shared/api/http-client'

type MockUser = {
  id: string
  name: string
  email: string
  role: 'student' | 'teacher' | 'hod' | 'admin'
  accountStatus: 'active' | 'inactive'
  isActive: boolean
  passwordChangeRequired: boolean
}

const activeAdmin: MockUser = {
  id: 'admin-1',
  name: 'Sian Admin',
  email: 'admin@example.com',
  role: 'admin',
  accountStatus: 'active',
  isActive: true,
  passwordChangeRequired: false,
}

const temporaryStudent: MockUser = {
  id: 'student-1',
  name: 'Sian Student',
  email: 'student@example.com',
  role: 'student',
  accountStatus: 'active',
  isActive: true,
  passwordChangeRequired: true,
}

const activeTeacher: MockUser = {
  id: 'teacher-1',
  name: 'Tayabba Teacher',
  email: 'teacher@example.com',
  role: 'teacher',
  accountStatus: 'active',
  isActive: true,
  passwordChangeRequired: false,
}

describe('App', () => {
  let getSpy: ReturnType<typeof vi.spyOn>
  let patchSpy: ReturnType<typeof vi.spyOn>
  let postSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    toast.close()
    getSpy = vi.spyOn(apiClient, 'get')
    patchSpy = vi.spyOn(apiClient, 'patch')
    postSpy = vi.spyOn(apiClient, 'post')
    window.history.pushState(null, '', '/')
  })

  afterEach(() => {
    toast.close()
    cleanup()
    queryClient.clear()
    vi.restoreAllMocks()
    window.history.pushState(null, '', '/')
  })

  async function openCreateAccountSheet(user: ReturnType<typeof userEvent.setup>) {
    await user.click(await screen.findByRole('button', { name: /create account/i }))
    return within(await screen.findByRole('dialog', { name: /create account/i }))
  }

  function mockAdminUserAccountGets(initialUsers: unknown[], refreshedUsers = initialUsers) {
    let usersRequestCount = 0

    getSpy.mockImplementation((url) => {
      if (url === '/auth/me') {
        return Promise.resolve({ data: { user: activeAdmin } })
      }

      if (url === '/users') {
        usersRequestCount += 1
        return Promise.resolve({
          data: { users: usersRequestCount === 1 ? initialUsers : refreshedUsers },
        })
      }

      if (url === '/departments') {
        return Promise.resolve({
          data: {
            departments: [
              { id: 'department-1', name: 'Computer Science', code: 'CS', isActive: true },
            ],
          },
        })
      }

      if (url === '/programs') {
        return Promise.resolve({
          data: {
            programs: [
              {
                id: 'program-1',
                name: 'BS Computer Science',
                code: 'BSCS',
                department: {
                  id: 'department-1',
                  name: 'Computer Science',
                  code: 'CS',
                  isActive: true,
                },
                totalSemesters: 8,
                duration: 4,
                durationUnit: 'years',
                isActive: true,
              },
            ],
          },
        })
      }

      if (url === '/batches') {
        return Promise.resolve({
          data: {
            batches: [
              {
                id: 'batch-1',
                name: 'Fall 2026',
                program: {
                  id: 'program-1',
                  name: 'BS Computer Science',
                  code: 'BSCS',
                  isActive: true,
                },
                startingYear: 2026,
                expectedGraduationYear: 2030,
                isActive: true,
              },
            ],
          },
        })
      }

      if (url === '/semesters') {
        return Promise.resolve({
          data: {
            semesters: [
              {
                id: 'semester-1',
                name: 'Fall Semester',
                academicYear: '2026-2027',
                isActive: true,
                isClosed: false,
              },
            ],
          },
        })
      }

      if (url === '/sections') {
        return Promise.resolve({
          data: {
            sections: [
              {
                id: 'section-1',
                name: 'A',
                program: {
                  id: 'program-1',
                  name: 'BS Computer Science',
                  code: 'BSCS',
                  isActive: true,
                },
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
                isActive: true,
              },
            ],
          },
        })
      }

      return Promise.reject(new Error(`Unexpected GET ${url}`))
    })
  }

  async function selectStudentAcademicProfile(
    user: ReturnType<typeof userEvent.setup>,
    sheet: ReturnType<typeof within>
  ) {
    await user.click(sheet.getByRole('combobox', { name: /department/i }))
    await user.click(await screen.findByRole('option', { name: /computer science \(cs\)/i }))
    await user.click(sheet.getByRole('combobox', { name: /program/i }))
    await user.click(await screen.findByRole('option', { name: /bs computer science \(bscs\)/i }))
    await user.click(sheet.getByRole('combobox', { name: /batch/i }))
    await user.click(await screen.findByRole('option', { name: /fall 2026/i }))
    await user.click(sheet.getByRole('combobox', { name: /^semester$/i }))
    await user.click(await screen.findByRole('option', { name: /fall semester/i }))
    await user.click(sheet.getByRole('combobox', { name: /section/i }))
    await user.click(await screen.findByRole('option', { name: /^a$/i }))
  }

  it('shows email/password login and signs in with the backend auth contract', async () => {
    const user = userEvent.setup()
    getSpy.mockRejectedValueOnce(new Error('Authentication required'))
    postSpy.mockResolvedValueOnce({
      data: { user: activeAdmin, expiresAt: '2030-01-01T00:00:00.000Z' },
    })

    render(<App />)

    await screen.findByLabelText(/email/i)
    await user.type(screen.getByLabelText(/email/i), 'admin@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'temporary-password')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await screen.findByText(/admin workspace/i)

    expect(postSpy).toHaveBeenCalledWith('/auth/login', {
      email: 'admin@example.com',
      password: 'temporary-password',
    })
  })

  it('validates login fields with zod before calling the backend', async () => {
    const user = userEvent.setup()
    getSpy.mockRejectedValueOnce(new Error('Authentication required'))

    render(<App />)

    await screen.findByLabelText(/email/i)
    await user.type(screen.getByLabelText(/email/i), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    expect(postSpy).not.toHaveBeenCalled()
  })

  it('requires temporary-password users to change password before portal access', async () => {
    const user = userEvent.setup()
    getSpy.mockRejectedValueOnce(new Error('Authentication required'))
    postSpy
      .mockResolvedValueOnce({
        data: { user: temporaryStudent, expiresAt: '2030-01-01T00:00:00.000Z' },
      })
      .mockResolvedValueOnce({
        data: { user: { ...temporaryStudent, passwordChangeRequired: false } },
      })

    render(<App />)

    await screen.findByLabelText(/email/i)
    await user.type(screen.getByLabelText(/email/i), 'student@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'temporary-password')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await screen.findByText('Change temporary password')
    await user.type(screen.getByLabelText(/current temporary password/i), 'temporary-password')
    await user.type(screen.getByLabelText(/^new password$/i), 'new-password')
    await user.type(screen.getByLabelText(/confirm password/i), 'new-password')
    await user.click(screen.getByRole('button', { name: /update password/i }))

    await screen.findByText(/student workspace/i)

    expect(postSpy).toHaveBeenCalledWith('/auth/change-password', {
      currentPassword: 'temporary-password',
      newPassword: 'new-password',
      confirmPassword: 'new-password',
    })
  })

  it('validates password change fields with zod before calling the backend', async () => {
    const user = userEvent.setup()
    getSpy.mockRejectedValueOnce(new Error('Authentication required'))
    postSpy.mockResolvedValueOnce({
      data: { user: temporaryStudent, expiresAt: '2030-01-01T00:00:00.000Z' },
    })

    render(<App />)

    await screen.findByLabelText(/email/i)
    await user.type(screen.getByLabelText(/email/i), 'student@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'temporary-password')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await screen.findByText('Change temporary password')
    await user.type(screen.getByLabelText(/current temporary password/i), 'temporary-password')
    await user.type(screen.getByLabelText(/^new password$/i), 'short')
    await user.type(screen.getByLabelText(/confirm password/i), 'different-password')
    await user.click(screen.getByRole('button', { name: /update password/i }))

    expect(
      await screen.findByText(/new password must be at least 8 characters/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    expect(postSpy).toHaveBeenCalledTimes(1)
  })

  it('renders role navigation for the authenticated admin', async () => {
    getSpy.mockResolvedValueOnce({ data: { user: activeAdmin } })

    render(<App />)

    await screen.findByRole('navigation', { name: /admin navigation/i })

    expect(screen.getByRole('link', { name: /students/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /academic structure/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /announcements/i })).toBeInTheDocument()
  })

  it('renders the Sian phase 2 academic structure workspace', async () => {
    window.history.pushState(null, '', '/academic-structure')
    getSpy.mockImplementation((url) => {
      if (url === '/auth/me') {
        return Promise.resolve({ data: { user: activeAdmin } })
      }

      if (url === '/programs') {
        return Promise.resolve({
          data: {
            programs: [
              {
                id: 'program-1',
                name: 'BS Computer Science',
                code: 'BSCS',
                department: {
                  id: 'department-1',
                  name: 'Computer Science',
                  code: 'CS',
                  isActive: true,
                },
                totalSemesters: 8,
                duration: 4,
                durationUnit: 'years',
                isActive: true,
              },
            ],
          },
        })
      }

      if (url === '/batches') {
        return Promise.resolve({
          data: {
            batches: [
              {
                id: 'batch-1',
                name: 'Fall 2026',
                program: {
                  id: 'program-1',
                  name: 'BS Computer Science',
                  code: 'BSCS',
                  isActive: true,
                },
                startingYear: 2026,
                expectedGraduationYear: 2030,
                isActive: true,
              },
            ],
          },
        })
      }

      if (url === '/semesters') {
        return Promise.resolve({
          data: {
            semesters: [
              {
                id: 'semester-1',
                name: 'Fall Semester',
                academicYear: '2026-2027',
                startsAt: '2026-09-01T00:00:00.000Z',
                endsAt: '2027-01-15T00:00:00.000Z',
                isActive: false,
                isClosed: false,
              },
            ],
          },
        })
      }

      if (url === '/sections') {
        return Promise.resolve({
          data: {
            sections: [
              {
                id: 'section-1',
                name: 'A',
                program: {
                  id: 'program-1',
                  name: 'BS Computer Science',
                  code: 'BSCS',
                  isActive: true,
                },
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
                  isActive: false,
                  isClosed: false,
                },
                isActive: true,
              },
            ],
          },
        })
      }

      return Promise.reject(new Error(`Unhandled GET ${url}`))
    })
    patchSpy.mockResolvedValueOnce({
      data: {
        message: 'Semester activated',
        semester: {
          id: 'semester-1',
          name: 'Fall Semester',
          academicYear: '2026-2027',
          isActive: true,
          isClosed: false,
        },
      },
    })

    render(<App />)

    expect(await screen.findByRole('heading', { name: /academic structure/i })).toBeInTheDocument()
    expect(screen.getByText(/no active semester/i)).toBeInTheDocument()
    expect(await screen.findByText('Fall 2026')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('tab', { name: /semesters/i }))
    await userEvent.click(screen.getByRole('button', { name: /open actions for fall semester/i }))
    await userEvent.click(await screen.findByRole('menuitem', { name: /activate/i }))

    await waitFor(() => {
      expect(patchSpy).toHaveBeenCalledWith('/semesters/semester-1/activate')
    })
  })

  it('renders Tayabba phase 1 academic performance placeholders for teachers', async () => {
    window.history.pushState(null, '', '/marks')
    getSpy.mockImplementation((url) => {
      if (url === '/auth/me') {
        return Promise.resolve({ data: { user: activeTeacher } })
      }

      if (url === '/academic-performance/context') {
        return Promise.resolve({
          data: {
            currentSemester: null,
            activeSections: [],
            studentSection: null,
            students: [],
            canResolveStudentSection: false,
          },
        })
      }

      if (url === '/academic-performance/offerings') {
        return Promise.resolve({
          data: {
            offerings: [
              {
                id: 'offering-1',
                course: {
                  id: 'course-1',
                  code: 'PF',
                  title: 'Programming Fundamentals',
                  creditHours: 3,
                  department: {
                    id: 'department-1',
                    name: 'Computer Science',
                    code: 'CS',
                    isActive: true,
                  },
                  program: {
                    id: 'program-1',
                    name: 'BS Computer Science',
                    code: 'BSCS',
                    isActive: true,
                  },
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
                  program: {
                    id: 'program-1',
                    name: 'BS Computer Science',
                    code: 'BSCS',
                    isActive: true,
                  },
                  semester: {
                    id: 'semester-1',
                    name: 'Fall Semester',
                    academicYear: '2026-2027',
                    isActive: true,
                    isClosed: false,
                  },
                  isActive: true,
                },
                teacher: {
                  id: activeTeacher.id,
                  fullName: activeTeacher.name,
                  email: activeTeacher.email,
                },
                studentCount: 28,
                isActive: true,
              },
            ],
          },
        })
      }

      return Promise.reject(new Error(`Unexpected GET ${url}`))
    })

    render(<App />)

    await screen.findByRole('navigation', { name: /teacher navigation/i })

    expect(screen.getByRole('link', { name: /attendance/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /assessments/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /marks/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /results/i })).toBeInTheDocument()
    expect(screen.getByText(/no marks records available yet/i)).toBeInTheDocument()
    expect(await screen.findByText(/programming fundamentals/i)).toBeInTheDocument()
    expect(
      screen.getByText(/only course sections assigned to your teacher account/i)
    ).toBeInTheDocument()
  })

  it('opens the profile menu and logs out from the portal shell', async () => {
    const user = userEvent.setup()
    getSpy.mockResolvedValueOnce({ data: { user: activeAdmin } })
    postSpy.mockResolvedValueOnce({ data: { message: 'Logout successful' } })

    render(<App />)

    await screen.findByRole('navigation', { name: /admin navigation/i })
    await user.click(screen.getByRole('button', { name: /open profile menu/i }))
    await user.click(await screen.findByText(/^logout$/i))

    await screen.findByRole('button', { name: /login/i })

    expect(postSpy).toHaveBeenCalledWith('/auth/logout')
  })

  it('lets admins provision accounts with a temporary password', async () => {
    const user = userEvent.setup()
    window.history.pushState(null, '', '/students')
    mockAdminUserAccountGets(
      [],
      [
        {
          id: 'student-2',
          fullName: 'New Student',
          email: 'new.student@example.com',
          role: 'student',
          registrationNumber: 'REG-001',
          accountStatus: 'active',
          isActive: true,
          passwordChangeRequired: true,
        },
      ]
    )
    postSpy.mockResolvedValueOnce({
      data: {
        message: 'User account created',
        temporaryPassword: '@Abc1234',
        user: {
          id: 'student-2',
          fullName: 'New Student',
          email: 'new.student@example.com',
          role: 'student',
          accountStatus: 'active',
          isActive: true,
          passwordChangeRequired: true,
        },
      },
    })

    render(<App />)

    const sheet = await openCreateAccountSheet(user)
    expect(screen.queryByRole('combobox', { name: /role/i })).not.toBeInTheDocument()
    expect(sheet.getByRole('textbox', { name: /role/i })).toHaveValue('Student')
    expect(sheet.getByRole('textbox', { name: /role/i })).toBeDisabled()
    expect(screen.queryByRole('option', { name: /admin/i })).not.toBeInTheDocument()
    expect(sheet.getByLabelText(/registration no/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/employee id/i)).not.toBeInTheDocument()
    await user.type(sheet.getByLabelText(/full name/i), 'New Student')
    await user.type(sheet.getByLabelText(/email/i), 'new.student@example.com')
    await user.type(sheet.getByLabelText(/registration no/i), 'REG-001')
    await selectStudentAcademicProfile(user, sheet)
    await user.click(sheet.getByRole('button', { name: /create account/i }))

    await screen.findByText(/temporary password issued/i)

    expect(postSpy).toHaveBeenCalledWith('/users', {
      fullName: 'New Student',
      email: 'new.student@example.com',
      role: 'student',
      phoneNumber: undefined,
      registrationNumber: 'REG-001',
      employeeId: undefined,
      departmentId: 'department-1',
      programId: 'program-1',
      batchId: 'batch-1',
      semesterId: 'semester-1',
      sectionId: 'section-1',
      academicStatus: 'active',
      designation: undefined,
      isActive: true,
    })
    expect(screen.getByText(/@Abc1234/i)).toBeInTheDocument()
    expect(
      await screen.findByRole('columnheader', { name: /registration no/i })
    ).toBeInTheDocument()
    expect(screen.getByText('REG-001')).toBeInTheDocument()
  })

  it('clears required account errors after visible form values are entered', async () => {
    const user = userEvent.setup()
    window.history.pushState(null, '', '/students')
    mockAdminUserAccountGets([])
    postSpy.mockResolvedValueOnce({
      data: {
        message: 'User account created',
        temporaryPassword: '@Abc1234',
        user: {
          id: 'student-3',
          fullName: 'Sian Malik',
          email: 'sianalimalik2418@gmail.com',
          role: 'student',
          accountStatus: 'active',
          isActive: true,
          passwordChangeRequired: true,
        },
      },
    })

    render(<App />)

    const sheet = await openCreateAccountSheet(user)
    await user.click(sheet.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/email is required|valid email/i)).toBeInTheDocument()
    expect(await screen.findByText(/registration no. is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/department is required/i)).toBeInTheDocument()

    await user.type(sheet.getByLabelText(/full name/i), 'Sian Malik')
    expect(screen.queryByText(/full name is required/i)).not.toBeInTheDocument()
    await user.type(sheet.getByLabelText(/email/i), 'sianalimalik2418@gmail.com')
    expect(screen.queryByText(/email is required|valid email/i)).not.toBeInTheDocument()
    await user.type(sheet.getByLabelText(/registration no/i), 'BSCS-F22-51')
    expect(screen.queryByText(/registration no. is required/i)).not.toBeInTheDocument()
    await selectStudentAcademicProfile(user, sheet)
    expect(screen.queryByText(/department is required/i)).not.toBeInTheDocument()
    await user.click(sheet.getByRole('button', { name: /create account/i }))

    await screen.findByText(/temporary password issued/i)

    expect(postSpy).toHaveBeenCalledWith('/users', {
      fullName: 'Sian Malik',
      email: 'sianalimalik2418@gmail.com',
      role: 'student',
      phoneNumber: undefined,
      registrationNumber: 'BSCS-F22-51',
      employeeId: undefined,
      departmentId: 'department-1',
      programId: 'program-1',
      batchId: 'batch-1',
      semesterId: 'semester-1',
      sectionId: 'section-1',
      academicStatus: 'active',
      designation: undefined,
      isActive: true,
    })
  })

  it('limits teacher page account roles to teacher and HOD', async () => {
    const user = userEvent.setup()
    window.history.pushState(null, '', '/teachers')
    getSpy.mockResolvedValueOnce({ data: { user: activeAdmin } }).mockResolvedValueOnce({
      data: {
        users: [
          {
            id: 'teacher-2',
            fullName: 'Visible Teacher',
            email: 'visible.teacher@example.com',
            role: 'teacher',
            employeeId: 'EMP-002',
            accountStatus: 'active',
            isActive: true,
            passwordChangeRequired: false,
          },
        ],
      },
    })

    render(<App />)

    expect(await screen.findByRole('columnheader', { name: /employee id/i })).toBeInTheDocument()
    expect(screen.getByText('EMP-002')).toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: /password/i })).not.toBeInTheDocument()

    await user.click(await screen.findByRole('button', { name: /create account/i }))
    const sheet = within(await screen.findByRole('dialog', { name: /create account/i }))
    const accountTypeSelect = sheet.getByRole('combobox', { name: /account type/i })

    expect(accountTypeSelect).toHaveTextContent(/teacher/i)
    await user.click(accountTypeSelect)
    expect(await screen.findByRole('option', { name: /teacher/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /hod/i })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /student/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /admin/i })).not.toBeInTheDocument()
    expect(sheet.getByLabelText(/employee id/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/registration no/i)).not.toBeInTheDocument()
  })

  it('requires an employee ID before creating teacher accounts', async () => {
    const user = userEvent.setup()
    window.history.pushState(null, '', '/teachers')
    getSpy
      .mockResolvedValueOnce({ data: { user: activeAdmin } })
      .mockResolvedValueOnce({ data: { users: [] } })

    render(<App />)

    const sheet = await openCreateAccountSheet(user)
    await user.type(sheet.getByLabelText(/full name/i), 'New Teacher')
    await user.type(sheet.getByLabelText(/email/i), 'new.teacher@example.com')
    await user.click(sheet.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/employee id is required/i)).toBeInTheDocument()
    await user.type(sheet.getByLabelText(/employee id/i), 'EMP-001')
    expect(screen.queryByText(/employee id is required/i)).not.toBeInTheDocument()
    expect(postSpy).not.toHaveBeenCalledWith('/users', expect.anything())
  })

  it('shows unauthorized handling when the URL targets another role area', async () => {
    window.history.pushState(null, '', '/teachers')
    getSpy.mockResolvedValueOnce({
      data: { user: { ...temporaryStudent, passwordChangeRequired: false } },
    })

    render(<App />)

    await screen.findByText(/unauthorized page/i)

    expect(screen.getByText(/student accounts cannot access "teachers"/i)).toBeInTheDocument()
  })

  it('shows inactive-account state from the login API', async () => {
    const user = userEvent.setup()
    getSpy.mockRejectedValueOnce(new Error('Authentication required'))
    postSpy.mockRejectedValueOnce(new Error('Account is inactive'))

    render(<App />)

    await screen.findByLabelText(/email/i)
    await user.type(screen.getByLabelText(/email/i), 'inactive@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'temporary-password')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getAllByText(/inactive account/i).length).toBeGreaterThan(0)
    })
  })
})
