import type { UserRole } from '@/features/auth/types/auth.types'

export type ProvisionedUserAccount = {
  id: string
  fullName: string
  email: string
  profilePictureUrl?: string
  phoneNumber?: string
  role: UserRole
  registrationNumber?: string
  employeeId?: string
  department?: AccountDepartment
  program?: AccountProgram
  batch?: AccountBatch
  semester?: AccountSemester
  section?: AccountSection
  academicStatus?: StudentAcademicStatus
  designation?: string
  accountStatus: 'active' | 'inactive'
  isActive: boolean
  passwordChangeRequired: boolean
  createdAt?: string
  updatedAt?: string
}

export type StudentAcademicStatus = 'active' | 'frozen' | 'repeating' | 'dropped' | 'graduated'

export type AccountDepartment = {
  id: string
  name: string
  code: string
  isActive: boolean
}

export type AccountProgram = AccountDepartment

export type AccountBatch = {
  id: string
  name: string
  startingYear: number
  expectedGraduationYear: number
  isActive: boolean
}

export type AccountSemester = {
  id: string
  name: string
  academicYear: string
  isActive: boolean
  isClosed: boolean
}

export type AccountSection = {
  id: string
  name: string
  isActive: boolean
}

export type UserAccountsResponse = {
  users: ProvisionedUserAccount[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export type UserAccountListQuery = {
  search?: string
  role?: UserRole | UserRole[]
  departmentId?: string
  programId?: string
  batchId?: string
  semesterId?: string
  sectionId?: string
  designation?: string
  isActive?: boolean
  page: number
  limit: number
}

export type CreateUserAccountPayload = {
  fullName: string
  email: string
  profilePictureUrl?: string
  role: UserRole
  phoneNumber?: string
  registrationNumber?: string
  employeeId?: string
  departmentId?: string
  programId?: string
  batchId?: string
  semesterId?: string
  sectionId?: string
  academicStatus?: StudentAcademicStatus
  designation?: string
  isActive: boolean
}

export type UpdateUserAccountPayload = CreateUserAccountPayload

export type CreateUserAccountResponse = {
  message: string
  user: ProvisionedUserAccount
  temporaryPassword: string
}

export type UserAccountResponse = {
  message: string
  user: ProvisionedUserAccount
}

export type StudentImportResult = {
  message: string
  summary: { total: number; imported: number; failed: number }
  rows: Array<{
    row: number
    email: string
    registrationNumber: string
    status: 'imported' | 'failed'
    error?: string
  }>
}
