import { apiClient } from '@/shared/api/http-client'
import type {
  CreateUserAccountPayload,
  CreateUserAccountResponse,
  UpdateUserAccountPayload,
  UserAccountListQuery,
  UserAccountResponse,
  UserAccountsResponse,
  StudentImportResult,
} from '../types/user-account.types'

export async function listUserAccounts(query: UserAccountListQuery) {
  const { data } = await apiClient.get<UserAccountsResponse>('/users', { params: query })
  return data
}

export async function getOwnUserAccount() {
  const { data } = await apiClient.get<{ user: UserAccountsResponse['users'][number] }>('/users/me')
  return data
}

export async function createUserAccount(payload: CreateUserAccountPayload) {
  const { data } = await apiClient.post<CreateUserAccountResponse>('/users', payload)
  return data
}

export async function updateUserAccount({
  userId,
  payload,
}: {
  userId: string
  payload: UpdateUserAccountPayload
}) {
  const { data } = await apiClient.patch<UserAccountResponse>(`/users/${userId}`, payload)
  return data
}

export async function deleteUserAccount(userId: string) {
  const { data } = await apiClient.delete<{ message: string }>(`/users/${userId}`)
  return data
}

export async function resetUserAccountPassword(userId: string) {
  const { data } = await apiClient.patch<CreateUserAccountResponse>(
    `/users/${userId}/reset-password`
  )
  return data
}

export async function importStudentAccounts(file: File) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await apiClient.post<StudentImportResult>('/users/import', form, {
    headers: { 'Content-Type': undefined },
  })
  return data
}
