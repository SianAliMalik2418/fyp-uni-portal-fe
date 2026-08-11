import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Add01Icon, FloppyDiskIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { toast } from '@/components/ui/toast-manager'
import {
  academicStructureKeys,
  sectionsQueryOptions,
  semestersQueryOptions,
} from '@/features/academic-structure/api/academic-structure-queries'
import { departmentsQueryOptions } from '@/features/departments/api/departments-queries'
import { programsQueryOptions } from '@/features/programs/api/programs-queries'
import {
  assignCourseTeacher,
  assignSectionCourses,
  createCourse,
  deleteCourse,
  updateCourse,
} from '../api/courses-api'
import {
  assignableTeachersQueryOptions,
  courseKeys,
  courseOfferingsQueryOptions,
  coursesQueryOptions,
  sectionCourseOfferingsQueryOptions,
} from '../api/courses-queries'
import { CourseAssignmentCard } from '../components/CourseAssignmentCard'
import { CourseFormCard } from '../components/CourseFormCard'
import { CourseOfferingsCard } from '../components/CourseOfferingsCard'
import { CoursesCard } from '../components/CoursesCard'
import { DeleteCourseDialog } from '../components/DeleteCourseDialog'
import { courseSchema, type CourseFormValues } from '../schemas/course.schemas'
import type { Course } from '../types/course.types'
import { courseValues, emptyCourseValues, toCoursePayload } from '../utils/course-mappers'

const courseFormId = 'course-sheet-form'

export function CourseManagementPage({ title, user }: { title: string; user: PortalUser }) {
  const queryClient = useQueryClient()
  const isAdmin = user.role === 'admin'
  const departmentsQuery = useQuery({ ...departmentsQueryOptions, enabled: isAdmin })
  const programsQuery = useQuery({ ...programsQueryOptions, enabled: isAdmin })
  const semestersQuery = useQuery({ ...semestersQueryOptions, enabled: isAdmin })
  const sectionsQuery = useQuery({ ...sectionsQueryOptions, enabled: isAdmin })
  const coursesQuery = useQuery(coursesQueryOptions)
  const offeringsQuery = useQuery(courseOfferingsQueryOptions)
  const teachersQuery = useQuery(assignableTeachersQueryOptions)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [selectedCourseIdOverride, setSelectedCourseIdOverride] = useState<string[] | null>(null)
  const sectionOfferingsQuery = useQuery(sectionCourseOfferingsQueryOptions(selectedSectionId))
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: emptyCourseValues,
  })
  const { reset } = form

  useEffect(() => {
    reset(editingCourse ? courseValues(editingCourse) : emptyCourseValues)
  }, [editingCourse, reset])

  async function refreshCourses() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: courseKeys.all }),
      queryClient.invalidateQueries({ queryKey: academicStructureKeys.all }),
    ])
  }

  const saveCourseMutation = useMutation({
    mutationFn: (values: CourseFormValues) =>
      editingCourse
        ? updateCourse({ courseId: editingCourse.id, payload: toCoursePayload(values) })
        : createCourse(toCoursePayload(values)),
    onSuccess: async () => {
      toast.add({
        title: editingCourse ? 'Course updated' : 'Course created',
        description: 'Course details were saved.',
        type: 'success',
      })
      setEditingCourse(null)
      setIsSheetOpen(false)
      reset(emptyCourseValues)
      await refreshCourses()
    },
    onError: (error) => {
      toast.add({
        title: 'Course save failed',
        description: getApiErrorMessage(error, 'Unable to save course'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: async () => {
      toast.add({
        title: 'Course deleted',
        description: 'The course and its section assignments were removed.',
        type: 'success',
      })
      setCourseToDelete(null)
      await refreshCourses()
    },
    onError: (error) => {
      toast.add({
        title: 'Course deletion failed',
        description: getApiErrorMessage(error, 'Unable to delete course'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const assignCoursesMutation = useMutation({
    mutationFn: () =>
      assignSectionCourses({
        sectionId: selectedSectionId,
        payload: { courseIds: selectedCourseIds },
      }),
    onSuccess: async () => {
      toast.add({
        title: 'Assignment saved',
        description: 'Section courses and enrollments were updated.',
        type: 'success',
      })
      await refreshCourses()
    },
    onError: (error) => {
      toast.add({
        title: 'Assignment failed',
        description: getApiErrorMessage(error, 'Unable to save section courses'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const assignTeacherMutation = useMutation({
    mutationFn: assignCourseTeacher,
    onSuccess: async () => {
      toast.add({
        title: 'Teacher saved',
        description: 'The course offering teacher was updated.',
        type: 'success',
      })
      await queryClient.invalidateQueries({ queryKey: courseKeys.offerings() })
    },
    onError: (error) => {
      toast.add({
        title: 'Teacher assignment failed',
        description: getApiErrorMessage(error, 'Unable to assign teacher'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  function openCreateSheet() {
    setEditingCourse(null)
    reset(emptyCourseValues)
    setIsSheetOpen(true)
  }

  function openEditSheet(course: Course) {
    setEditingCourse(course)
    setIsSheetOpen(true)
  }

  function closeSheet() {
    setIsSheetOpen(false)
    setEditingCourse(null)
    reset(emptyCourseValues)
  }

  const courses = coursesQuery.data?.courses ?? []
  const offerings = offeringsQuery.data?.offerings ?? []
  const teachers = teachersQuery.data?.teachers ?? []
  const departments = departmentsQuery.data?.departments ?? []
  const programs = programsQuery.data?.programs ?? []
  const semesters = semestersQuery.data?.semesters ?? []
  const sections = sectionsQuery.data?.sections ?? []
  const assignedCourseIds =
    sectionOfferingsQuery.data?.offerings.map((offering) => offering.course.id) ?? []
  const selectedCourseIds = selectedCourseIdOverride ?? assignedCourseIds

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl leading-tight font-semibold">{title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage courses, assign them to sections, and connect course offerings to teachers.
          </p>
        </div>
        {isAdmin ? (
          <Button type="button" onClick={openCreateSheet}>
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
            Add course
          </Button>
        ) : null}
      </div>

      <CoursesCard
        canManage={isAdmin}
        courses={courses}
        error={coursesQuery.error}
        isDeleting={deleteCourseMutation.isPending}
        isError={coursesQuery.isError}
        isPending={coursesQuery.isPending}
        onDelete={setCourseToDelete}
        onEdit={openEditSheet}
      />

      {isAdmin ? (
        <CourseAssignmentCard
          courses={courses}
          isSaving={assignCoursesMutation.isPending}
          onSave={() => assignCoursesMutation.mutate()}
          onSelectedCourseIdsChange={setSelectedCourseIdOverride}
          onSectionChange={(sectionId) => {
            setSelectedSectionId(sectionId)
            setSelectedCourseIdOverride(null)
          }}
          sections={sections}
          selectedCourseIds={selectedCourseIds}
          selectedSectionId={selectedSectionId}
        />
      ) : null}

      <CourseOfferingsCard
        canAssignTeacher
        error={offeringsQuery.error}
        isAssigningTeacher={assignTeacherMutation.isPending}
        isError={offeringsQuery.isError}
        isPending={offeringsQuery.isPending}
        offerings={offerings}
        teachers={teachers}
        onAssignTeacher={(offeringId, teacherId) =>
          assignTeacherMutation.mutate({ offeringId, teacherId })
        }
      />

      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeSheet()
            return
          }

          setIsSheetOpen(true)
        }}
      >
        <SheetContent className="flex w-full flex-col gap-0 space-y-0 sm:max-w-xl" side="right">
          <SheetHeader className="border-b pr-14">
            <SheetTitle>{editingCourse ? 'Edit course' : 'Add course'}</SheetTitle>
            <SheetDescription>
              Courses are linked to a department, program, and semester before section assignment.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-230px)] flex-1 grow py-4">
            <div className="space-y-4 px-4">
              {departmentsQuery.isError || programsQuery.isError || semestersQuery.isError ? (
                <Alert variant="destructive">
                  <AlertTitle>Academic references unavailable</AlertTitle>
                  <AlertDescription>
                    {getApiErrorMessage(
                      departmentsQuery.error ?? programsQuery.error ?? semestersQuery.error,
                      'Unable to load academic references'
                    )}
                  </AlertDescription>
                </Alert>
              ) : null}
              <CourseFormCard
                departments={departments}
                form={form}
                formId={courseFormId}
                onSubmit={(values) => saveCourseMutation.mutate(values)}
                programs={programs}
                semesters={semesters}
              />
            </div>
          </ScrollArea>
          <SheetFooter className="border-t">
            <Button
              type="submit"
              form={courseFormId}
              disabled={
                saveCourseMutation.isPending ||
                departmentsQuery.isPending ||
                programsQuery.isPending ||
                semestersQuery.isPending
              }
            >
              {saveCourseMutation.isPending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <HugeiconsIcon
                  icon={editingCourse ? FloppyDiskIcon : Add01Icon}
                  strokeWidth={2}
                  data-icon="inline-start"
                />
              )}
              {editingCourse ? 'Save changes' : 'Add course'}
            </Button>
            <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <DeleteCourseDialog
        course={courseToDelete}
        isDeleting={deleteCourseMutation.isPending}
        onConfirm={() => {
          if (courseToDelete) {
            deleteCourseMutation.mutate(courseToDelete.id)
          }
        }}
        onOpenChange={(open) => {
          if (!open) {
            setCourseToDelete(null)
          }
        }}
      />
    </div>
  )
}
