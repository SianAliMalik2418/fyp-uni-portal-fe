import type { UserRole } from '@/features/auth/types/auth.types'
import type { CreateUserAccountFormValues } from '../schemas/user-account.schemas'
import type { ProvisionedUserAccount } from '../types/user-account.types'

const roleOptions: UserRole[] = ['student', 'teacher', 'hod', 'admin']

export type AccountSectionKind = 'students' | 'teachers' | 'all'

export function roleOptionsForSection(sectionId: string): UserRole[] {
  if (sectionId === 'students') {
    return ['student']
  }

  if (sectionId === 'teachers') {
    return ['teacher', 'hod']
  }

  return roleOptions
}

export function defaultRoleForSection(sectionId: string): UserRole {
  if (sectionId === 'teachers') {
    return 'teacher'
  }

  return 'student'
}

export function accountMatchesSection(account: ProvisionedUserAccount, sectionId: string) {
  if (sectionId === 'students') {
    return account.role === 'student'
  }

  if (sectionId === 'teachers') {
    return account.role === 'teacher' || account.role === 'hod'
  }

  return true
}

export function cleanOptional(value?: string) {
  const cleaned = value?.trim()
  return cleaned ? cleaned : undefined
}

export function identifierLabelForSection(sectionId: string) {
  if (sectionId === 'students') {
    return 'Registration no.'
  }

  if (sectionId === 'teachers') {
    return 'Employee ID'
  }

  return 'Identifier'
}

export function identifierForAccount(account: ProvisionedUserAccount) {
  if (account.role === 'student') {
    return account.registrationNumber ?? '-'
  }

  if (account.role === 'teacher' || account.role === 'hod') {
    return account.employeeId ?? '-'
  }

  return account.registrationNumber ?? account.employeeId ?? '-'
}

export function defaultAccountValues(sectionId: string): CreateUserAccountFormValues {
  return {
    fullName: '',
    email: '',
    role: defaultRoleForSection(sectionId),
    registrationNumber: '',
    employeeId: '',
    isActive: true,
  }
}

export function accountSectionKind(sectionId: string): AccountSectionKind {
  if (sectionId === 'students' || sectionId === 'teachers') {
    return sectionId
  }

  return 'all'
}
