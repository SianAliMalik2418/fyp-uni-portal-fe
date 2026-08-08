import type { UserRole } from '@/features/auth/types/auth.types'

export type ProvisionedUserAccount = {
  id: string
  fullName: string
  email: string
  role: UserRole
  registrationNumber?: string
  employeeId?: string
  accountStatus: 'active' | 'inactive'
  isActive: boolean
  passwordChangeRequired: boolean
  createdAt?: string
  updatedAt?: string
}

export type UserAccountsResponse = {
  users: ProvisionedUserAccount[]
}

export type CreateUserAccountPayload = {
  fullName: string
  email: string
  role: UserRole
  registrationNumber?: string
  employeeId?: string
  isActive: boolean
}

export type CreateUserAccountResponse = {
  message: string
  user: ProvisionedUserAccount
  temporaryPassword: string
}
