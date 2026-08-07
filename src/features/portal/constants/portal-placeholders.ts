import type { UserRole } from '@/features/auth/types/auth.types'
import type { ModulePlaceholderContent, ModulePlaceholderStat } from '../types/portal.types'

export const modulePlaceholderStats: Record<UserRole, ModulePlaceholderStat[]> = {
  student: [
    { label: 'Active courses', value: '0' },
    { label: 'Attendance alerts', value: '0' },
    { label: 'Pending fees', value: '0' },
  ],
  teacher: [
    { label: 'Assigned courses', value: '0' },
    { label: 'Attendance sheets', value: '0' },
    { label: 'Result drafts', value: '0' },
  ],
  hod: [
    { label: 'Department courses', value: '0' },
    { label: 'Teacher accounts', value: '0' },
    { label: 'Pending approvals', value: '0' },
  ],
  admin: [
    { label: 'Students', value: '0' },
    { label: 'Teachers', value: '0' },
    { label: 'Departments', value: '0' },
  ],
}

export const modulePlaceholderContent: ModulePlaceholderContent = {
  emptyTitle: 'No records yet',
  emptyDescription:
    'Backend data for this module will appear here once the workflow APIs are connected.',
  readinessTitle: 'Module readiness',
  readinessDescription:
    'The page shell, permissions check, and empty state are in place for this area.',
  nextIntegrationLabel: 'Next integration',
  nextIntegrationValue: 'API data',
}
