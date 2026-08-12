import type { PortalUser } from '@/features/auth/types/auth.types'
import { HodAttendanceShortages } from '../components/HodAttendanceShortages'
import { StudentAttendanceSummary } from '../components/StudentAttendanceSummary'
import { TeacherAttendancePanel } from '../components/TeacherAttendancePanel'
import { AttendanceSettingsPage } from './AttendanceSettingsPage'

export function AttendancePage({ title, user }: { title: string; user: PortalUser }) {
  if (user.role === 'teacher') {
    return <TeacherAttendancePanel title={title} />
  }

  if (user.role === 'student') {
    return <StudentAttendanceSummary title={title} />
  }

  if (user.role === 'hod') {
    return <HodAttendanceShortages title={title} />
  }

  return <AttendanceSettingsPage title={title} />
}
