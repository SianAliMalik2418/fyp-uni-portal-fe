import type { UserRole } from '@/features/auth/types/auth.types'

export const roleLabels: Record<UserRole, string> = {
  student: 'Student',
  teacher: 'Teacher',
  hod: 'HOD',
  admin: 'Admin',
}
