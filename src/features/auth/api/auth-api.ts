import { apiClient } from '@/shared/api/http-client'
import type { AuthResponse, LoginResponse } from '../types/auth.types'

type LoginCredentials = {
  email: string
  password: string
}

type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export async function getCurrentUser() {
  const { data } = await apiClient.get<AuthResponse>('/auth/me')
  return data
}

export async function login(credentials: LoginCredentials) {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials)
  return data
}

export async function changePassword(payload: ChangePasswordPayload) {
  const { data } = await apiClient.post<AuthResponse>('/auth/change-password', payload)
  return data
}

export async function logout() {
  await apiClient.post('/auth/logout')
}
