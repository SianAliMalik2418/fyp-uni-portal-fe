import { apiClient } from '@/shared/api/http-client'
import type {
  CourseOfferingResponse,
  CourseOfferingsResponse,
  CoursePayload,
  CourseResponse,
  CoursesResponse,
  AssignableTeachersResponse,
  SectionCourseAssignmentPayload,
  SectionCourseAssignmentResponse,
} from '../types/course.types'

export async function listCourses() {
  const { data } = await apiClient.get<CoursesResponse>('/courses')
  return data
}

export async function createCourse(payload: CoursePayload) {
  const { data } = await apiClient.post<CourseResponse>('/courses', payload)
  return data
}

export async function updateCourse({
  courseId,
  payload,
}: {
  courseId: string
  payload: CoursePayload
}) {
  const { data } = await apiClient.patch<CourseResponse>(`/courses/${courseId}`, payload)
  return data
}

export async function deleteCourse(courseId: string) {
  const { data } = await apiClient.delete<{ message: string }>(`/courses/${courseId}`)
  return data
}

export async function listSectionCourseOfferings(sectionId: string) {
  const { data } = await apiClient.get<CourseOfferingsResponse>(
    `/courses/sections/${sectionId}/offerings`
  )
  return data
}

export async function listCourseOfferings() {
  const { data } = await apiClient.get<CourseOfferingsResponse>('/courses/offerings')
  return data
}

export async function listAssignableTeachers() {
  const { data } = await apiClient.get<AssignableTeachersResponse>('/courses/teachers')
  return data
}

export async function assignSectionCourses({
  sectionId,
  payload,
}: {
  sectionId: string
  payload: SectionCourseAssignmentPayload
}) {
  const { data } = await apiClient.put<SectionCourseAssignmentResponse>(
    `/courses/sections/${sectionId}/offerings`,
    payload
  )
  return data
}

export async function assignCourseTeacher({
  offeringId,
  teacherId,
}: {
  offeringId: string
  teacherId: string | null
}) {
  const { data } = await apiClient.patch<CourseOfferingResponse>(
    `/courses/offerings/${offeringId}/teacher`,
    { teacherId }
  )
  return data
}

export async function listStudentCourses() {
  const { data } = await apiClient.get<CourseOfferingsResponse>('/courses/me/student')
  return data
}

export async function listTeacherCourses() {
  const { data } = await apiClient.get<CourseOfferingsResponse>('/courses/me/teacher')
  return data
}
