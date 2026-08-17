import { queryOptions } from '@tanstack/react-query'
import { listAdminSectionExams, listStudentExams, listTeacherExams } from './exams-api'

export const examKeys = {
  all: ['exams'] as const,
  adminSection: (sectionId: string) => [...examKeys.all, 'admin', sectionId] as const,
  student: () => [...examKeys.all, 'me', 'student'] as const,
  teacher: () => [...examKeys.all, 'me', 'teacher'] as const,
}

export const adminSectionExamsQueryOptions = (sectionId: string) =>
  queryOptions({
    queryKey: examKeys.adminSection(sectionId),
    queryFn: () => listAdminSectionExams(sectionId),
    enabled: Boolean(sectionId),
  })

export const roleExamsQueryOptions = (role: 'student' | 'teacher') =>
  queryOptions({
    queryKey: role === 'teacher' ? examKeys.teacher() : examKeys.student(),
    queryFn: role === 'teacher' ? listTeacherExams : listStudentExams,
  })
