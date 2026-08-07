export type UserRole = 'student' | 'teacher' | 'hod' | 'admin'

export type PortalUser = {
  id: string
  name: string
  email: string
  role: UserRole
  accountStatus: 'active' | 'inactive'
  isActive: boolean
  passwordChangeRequired: boolean
}

export type AuthResponse = {
  user: PortalUser
}

export type LoginResponse = AuthResponse & {
  expiresAt: string
}
