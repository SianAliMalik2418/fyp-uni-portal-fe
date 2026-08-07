import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { queryClient } from './app/query-client'
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

describe('App', () => {
  let getSpy: ReturnType<typeof vi.spyOn>
  let postSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    getSpy = vi.spyOn(apiClient, 'get')
    postSpy = vi.spyOn(apiClient, 'post')
    window.history.pushState(null, '', '/')
  })

  afterEach(() => {
    cleanup()
    queryClient.clear()
    vi.restoreAllMocks()
    window.history.pushState(null, '', '/')
  })

  it('shows email/password login and signs in with the backend auth contract', async () => {
    const user = userEvent.setup()
    getSpy.mockRejectedValueOnce(new Error('Authentication required'))
    postSpy.mockResolvedValueOnce({
      data: { user: activeAdmin, expiresAt: '2030-01-01T00:00:00.000Z' },
    })

    render(<App />)

    await screen.findByLabelText(/email/i)
    await user.type(screen.getByLabelText(/email/i), 'admin@example.com')
    await user.type(screen.getByLabelText(/password/i), 'temporary-password')
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
    await user.type(screen.getByLabelText(/password/i), 'temporary-password')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/inactive account/i)).toBeInTheDocument()
    })
  })
})
