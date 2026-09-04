import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/shared/api/http-client'
import { createUserAccount, importStudentAccounts, listUserAccounts } from './user-accounts-api'

describe('user account API', () => {
  afterEach(() => vi.restoreAllMocks())

  it('sends server-side search, filters, and pagination', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: { users: [], page: 2, limit: 20, total: 0, totalPages: 0 },
    })
    const query = {
      role: 'student' as const,
      search: 'ayesha',
      programId: 'program-1',
      isActive: true,
      page: 2,
      limit: 20,
    }

    await listUserAccounts(query)

    expect(get).toHaveBeenCalledWith('/users', { params: query })
  })

  it('uploads student CSV data as multipart form data', async () => {
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue({
      data: { message: 'processed', summary: { total: 1, imported: 1, failed: 0 }, rows: [] },
    })
    const file = new File(['fullName,email'], 'students.csv', { type: 'text/csv' })

    await importStudentAccounts(file)

    const body = post.mock.calls[0]?.[1]
    expect(post).toHaveBeenCalledWith('/users/import', expect.any(FormData), {
      headers: { 'Content-Type': undefined },
    })
    const uploadedFile = (body as FormData).get('file')
    expect(uploadedFile).toBeInstanceOf(File)
    expect((uploadedFile as File).name).toBe('students.csv')
    expect((uploadedFile as File).type).toBe('text/csv')
  })

  it('sends profile picture URLs when creating accounts', async () => {
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue({
      data: { message: 'created', user: {}, temporaryPassword: '@Abc1234' },
    })
    const payload = {
      fullName: 'Sian Teacher',
      email: 'teacher@example.com',
      profilePictureUrl: 'https://example.com/teacher.jpg',
      role: 'teacher' as const,
      employeeId: 'EMP-001',
      departmentId: 'department-1',
      designation: 'Lecturer',
      isActive: true,
    }

    await createUserAccount(payload)

    expect(post).toHaveBeenCalledWith('/users', payload)
  })
})
