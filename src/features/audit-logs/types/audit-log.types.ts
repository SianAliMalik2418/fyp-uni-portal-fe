export const auditModules = [
  'users',
  'departments',
  'programs',
  'batches',
  'semesters',
  'sections',
  'courses',
  'attendance',
  'assessments',
  'marks',
  'results',
  'fees',
  'timetable',
  'exams',
  'announcements',
] as const

export const auditActions = [
  'created',
  'updated',
  'deleted',
  'activated',
  'closed',
  'assigned',
  'reset_password',
  'saved',
  'submitted',
  'approved',
  'returned',
  'reopened',
  'published',
  'promoted',
] as const

export const auditActorRoles = ['admin', 'hod', 'teacher', 'student'] as const

export type AuditModule = (typeof auditModules)[number]
export type AuditAction = (typeof auditActions)[number]
export type AuditActorRole = (typeof auditActorRoles)[number]

export type AuditLog = {
  id: string
  actor: {
    id: string
    name: string
    role: AuditActorRole
  }
  action: AuditAction
  module: AuditModule
  affectedRecord: {
    id: string
    label?: string
  }
  reason?: string
  createdAt: string
}

export type AuditLogListQuery = {
  module?: AuditModule
  action?: AuditAction
  actorRole?: AuditActorRole
  page?: number
  limit?: number
}

export type AuditLogsResponse = {
  auditLogs: AuditLog[]
  page: number
  limit: number
  total: number
  totalPages: number
}
