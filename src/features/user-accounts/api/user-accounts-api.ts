import { apiClient } from '@/shared/api/http-client'
import type {
  CreateUserAccountPayload,
  CreateUserAccountResponse,
  UserAccountsResponse,
} from '../types/user-account.types'

export async function listUserAccounts() {
  const { data } = await apiClient.get<UserAccountsResponse>('/users')
  return data
}

export async function createUserAccount(payload: CreateUserAccountPayload) {
  const { data } = await apiClient.post<CreateUserAccountResponse>('/users', payload)
  return data
}
