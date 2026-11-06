import { queryOptions } from '@tanstack/react-query'
import { DEFAULT_TABLE_PAGE_SIZE, REFERENCE_LIST_LIMIT } from '@/shared/constants/pagination'
import {
  listCourses,
  listAssignableTeachers,
  listCourseOfferings,
  listSectionCourseOfferings,
  listStudentCourses,
  listTeacherCourses,
} from './courses-api'

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  listPage: (page: number) => [...courseKeys.lists(), page] as const,
  offerings: () => [...courseKeys.all, 'offerings'] as const,
  teachers: () => [...courseKeys.all, 'teachers'] as const,
  sectionOfferings: (sectionId: string) => [...courseKeys.all, 'sections', sectionId] as const,
  studentOfferings: () => [...courseKeys.all, 'me', 'student'] as const,
  teacherOfferings: () => [...courseKeys.all, 'me', 'teacher'] as const,
}

export const coursesQueryOptions = queryOptions({
  queryKey: courseKeys.lists(),
  queryFn: () => listCourses({ page: 1, limit: REFERENCE_LIST_LIMIT }),
})

export const coursesTableQueryOptions = (page: number) =>
  queryOptions({
    queryKey: courseKeys.listPage(page),
    queryFn: () => listCourses({ page, limit: DEFAULT_TABLE_PAGE_SIZE }),
  })

export const courseOfferingsQueryOptions = queryOptions({
  queryKey: courseKeys.offerings(),
  queryFn: listCourseOfferings,
})

export const assignableTeachersQueryOptions = queryOptions({
  queryKey: courseKeys.teachers(),
  queryFn: listAssignableTeachers,
})

export const sectionCourseOfferingsQueryOptions = (sectionId: string) =>
  queryOptions({
    queryKey: courseKeys.sectionOfferings(sectionId),
    queryFn: () => listSectionCourseOfferings(sectionId),
    enabled: Boolean(sectionId),
  })

export const studentCoursesQueryOptions = queryOptions({
  queryKey: courseKeys.studentOfferings(),
  queryFn: listStudentCourses,
})

export const teacherCoursesQueryOptions = queryOptions({
  queryKey: courseKeys.teacherOfferings(),
  queryFn: listTeacherCourses,
})
