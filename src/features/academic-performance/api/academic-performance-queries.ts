import { queryOptions } from '@tanstack/react-query'
import {
  getStudentAttendanceSummaries,
  getAttendanceConfiguration,
  getAcademicPerformanceContext,
  listAttendanceSessions,
  listAttendanceShortages,
  listAcademicPerformanceOfferingStudents,
  listAcademicPerformanceOfferings,
} from './academic-performance-api'

export const academicPerformanceKeys = {
  all: ['academic-performance'] as const,
  context: () => [...academicPerformanceKeys.all, 'context'] as const,
  offerings: () => [...academicPerformanceKeys.all, 'offerings'] as const,
  offeringStudents: (offeringId: string) =>
    [...academicPerformanceKeys.offerings(), offeringId, 'students'] as const,
  attendanceSessions: (offeringId?: string) =>
    [...academicPerformanceKeys.all, 'attendance-sessions', offeringId ?? 'all'] as const,
  studentAttendance: () => [...academicPerformanceKeys.all, 'student-attendance'] as const,
  attendanceShortages: () => [...academicPerformanceKeys.all, 'attendance-shortages'] as const,
  configuration: () => [...academicPerformanceKeys.all, 'attendance-configuration'] as const,
}

export const academicPerformanceContextQueryOptions = queryOptions({
  queryKey: academicPerformanceKeys.context(),
  queryFn: getAcademicPerformanceContext,
})

export const academicPerformanceOfferingsQueryOptions = queryOptions({
  queryKey: academicPerformanceKeys.offerings(),
  queryFn: listAcademicPerformanceOfferings,
})

export const academicPerformanceOfferingStudentsQueryOptions = (offeringId: string) =>
  queryOptions({
    queryKey: academicPerformanceKeys.offeringStudents(offeringId),
    queryFn: () => listAcademicPerformanceOfferingStudents(offeringId),
    enabled: Boolean(offeringId),
  })

export const attendanceSessionsQueryOptions = (offeringId?: string, enabled = true) =>
  queryOptions({
    queryKey: academicPerformanceKeys.attendanceSessions(offeringId),
    queryFn: () => listAttendanceSessions(offeringId),
    enabled,
  })

export const studentAttendanceQueryOptions = queryOptions({
  queryKey: academicPerformanceKeys.studentAttendance(),
  queryFn: getStudentAttendanceSummaries,
})

export const attendanceShortagesQueryOptions = queryOptions({
  queryKey: academicPerformanceKeys.attendanceShortages(),
  queryFn: listAttendanceShortages,
})

export const attendanceConfigurationQueryOptions = queryOptions({
  queryKey: academicPerformanceKeys.configuration(),
  queryFn: getAttendanceConfiguration,
})
