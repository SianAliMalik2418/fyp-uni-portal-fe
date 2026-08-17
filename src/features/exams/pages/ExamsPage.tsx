import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Add01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast-manager'
import { AcademicReferenceSelect } from '@/features/academic-structure/components/AcademicReferenceSelect'
import {
  sectionsQueryOptions,
  semestersQueryOptions,
} from '@/features/academic-structure/api/academic-structure-queries'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { courseOfferingsQueryOptions } from '@/features/courses/api/courses-queries'
import { programsQueryOptions } from '@/features/programs/api/programs-queries'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { createExam, deleteExam, updateExam } from '../api/exams-api'
import { adminSectionExamsQueryOptions, examKeys, roleExamsQueryOptions } from '../api/exam-queries'
import { DeleteExamDialog } from '../components/DeleteExamDialog'
import { ExamFormSheet } from '../components/ExamFormSheet'
import { ExamScheduleCard } from '../components/ExamScheduleCard'
import type { ExamFormValues } from '../schemas/exam.schemas'
import type { Exam, ExamPayload } from '../types/exam.types'

export function ExamsPage({ title, user }: { title: string; user: PortalUser }) {
  if (user.role === 'admin') {
    return <AdminExamsPage title={title} />
  }

  if (user.role === 'teacher') {
    return <RoleExamPage title={title} role="teacher" />
  }

  return <RoleExamPage title={title} role="student" />
}

function RoleExamPage({ title, role }: { title: string; role: 'student' | 'teacher' }) {
  const examsQuery = useQuery(roleExamsQueryOptions(role))
  const scheduleTitle = role === 'teacher' ? 'Teaching exam schedule' : 'Exam date sheet'
  const description =
    role === 'teacher'
      ? 'View exams for the course offerings assigned to you.'
      : 'View exams for your current course enrollments.'

  return (
    <PageShell title={title} description={description}>
      {examsQuery.isPending ? <ExamPageSkeleton /> : null}
      {examsQuery.isError ? (
        <QueryError
          title="Exam schedule unavailable"
          error={examsQuery.error}
          fallback="Unable to load exam schedule"
        />
      ) : null}
      {examsQuery.isSuccess ? (
        <ExamScheduleCard
          title={scheduleTitle}
          exams={examsQuery.data.exams}
          emptyMessage="No exams have been scheduled for your courses yet."
        />
      ) : null}
    </PageShell>
  )
}

function AdminExamsPage({ title }: { title: string }) {
  const queryClient = useQueryClient()
  const programsQuery = useQuery(programsQueryOptions)
  const semestersQuery = useQuery(semestersQueryOptions)
  const sectionsQuery = useQuery(sectionsQueryOptions)
  const offeringsQuery = useQuery(courseOfferingsQueryOptions)
  const [programSelection, setProgramSelection] = useState('')
  const [semesterSelection, setSemesterSelection] = useState('')
  const [sectionSelection, setSectionSelection] = useState('')
  const [editingExam, setEditingExam] = useState<Exam | null>(null)
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const programs = programsQuery.data?.programs ?? []
  const semesters = semestersQuery.data?.semesters ?? []
  const sections = sectionsQuery.data?.sections ?? []
  const offerings = offeringsQuery.data?.offerings ?? []
  const selectedProgramId = programs.some((program) => program.id === programSelection)
    ? programSelection
    : (programs[0]?.id ?? '')
  const availableSemesters = semesters.filter((semester) =>
    sections.some(
      (section) =>
        section.isActive &&
        section.program.id === selectedProgramId &&
        section.semester.id === semester.id
    )
  )
  const selectedSemesterId = availableSemesters.some(
    (semester) => semester.id === semesterSelection
  )
    ? semesterSelection
    : (availableSemesters[0]?.id ?? '')
  const availableSections = sections.filter(
    (section) =>
      section.isActive &&
      section.program.id === selectedProgramId &&
      section.semester.id === selectedSemesterId
  )
  const selectedSectionId = availableSections.some((section) => section.id === sectionSelection)
    ? sectionSelection
    : (availableSections[0]?.id ?? '')
  const sectionOfferings = offerings.filter(
    (offering) => offering.isActive && offering.section.id === selectedSectionId
  )
  const examsQuery = useQuery(adminSectionExamsQueryOptions(selectedSectionId))
  const referenceError =
    programsQuery.error ?? semestersQuery.error ?? sectionsQuery.error ?? offeringsQuery.error
  const isReferencePending =
    programsQuery.isPending ||
    semestersQuery.isPending ||
    sectionsQuery.isPending ||
    offeringsQuery.isPending

  const saveMutation = useMutation({
    mutationFn: (values: ExamFormValues) => {
      const payload = toExamPayload(values)
      return editingExam ? updateExam({ examId: editingExam.id, payload }) : createExam(payload)
    },
    onSuccess: async () => {
      toast.add({
        title: editingExam ? 'Exam updated' : 'Exam created',
        description: 'The exam date sheet was updated for the linked course offering.',
        type: 'success',
      })
      setEditingExam(null)
      setIsFormOpen(false)
      await queryClient.invalidateQueries({ queryKey: examKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: 'Exam save failed',
        description: getApiErrorMessage(error, 'Unable to save exam entry'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteExam,
    onSuccess: async () => {
      toast.add({
        title: 'Exam deleted',
        description: 'The entry was removed from student and teacher date sheets.',
        type: 'success',
      })
      setExamToDelete(null)
      await queryClient.invalidateQueries({ queryKey: examKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: 'Exam deletion failed',
        description: getApiErrorMessage(error, 'Unable to delete exam entry'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  return (
    <PageShell
      title={title}
      description="Configure exam date sheets by program, semester, section, and assigned course."
      action={
        <Button
          type="button"
          disabled={!selectedSectionId || sectionOfferings.length === 0}
          onClick={() => {
            setEditingExam(null)
            setIsFormOpen(true)
          }}
        >
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
          Add exam
        </Button>
      }
    >
      {isReferencePending ? (
        <ExamPageSkeleton />
      ) : referenceError ? (
        <QueryError
          title="Exam setup unavailable"
          error={referenceError}
          fallback="Unable to load academic reference data"
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Card className="bg-background self-start">
            <CardHeader className="border-b">
              <CardTitle>Exam scope</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <AcademicReferenceSelect
                id="exam-program"
                label="Program"
                value={selectedProgramId}
                options={programs.map((program) => ({
                  value: program.id,
                  label: `${program.name} (${program.code})`,
                }))}
                onValueChange={(value) => {
                  setProgramSelection(value)
                  setSemesterSelection('')
                  setSectionSelection('')
                }}
              />
              <AcademicReferenceSelect
                id="exam-semester"
                label="Semester"
                value={selectedSemesterId}
                options={availableSemesters.map((semester) => ({
                  value: semester.id,
                  label: `${semester.name} (${semester.academicYear})`,
                }))}
                onValueChange={(value) => {
                  setSemesterSelection(value)
                  setSectionSelection('')
                }}
                disabled={availableSemesters.length === 0}
              />
              <AcademicReferenceSelect
                id="exam-section"
                label="Section"
                value={selectedSectionId}
                options={availableSections.map((section) => ({
                  value: section.id,
                  label: `${section.name} · ${section.batch.name}`,
                }))}
                onValueChange={setSectionSelection}
                disabled={availableSections.length === 0}
              />
              <p className="text-muted-foreground text-sm">
                {sectionOfferings.length} assigned course
                {sectionOfferings.length === 1 ? '' : 's'} available.
              </p>
            </CardContent>
          </Card>

          {!selectedSectionId ? (
            <EmptyCard message="Select an active section to configure its exam date sheet." />
          ) : examsQuery.isPending ? (
            <ExamPageSkeleton />
          ) : examsQuery.isError ? (
            <QueryError
              title="Section exams unavailable"
              error={examsQuery.error}
              fallback="Unable to load section exams"
            />
          ) : (
            <ExamScheduleCard
              canManage
              title="Section exam schedule"
              exams={examsQuery.data?.exams ?? []}
              emptyMessage="No exams are configured for this section yet."
              onEdit={(exam) => {
                setEditingExam(exam)
                setIsFormOpen(true)
              }}
              onDelete={setExamToDelete}
            />
          )}
        </div>
      )}

      <ExamFormSheet
        courseOfferings={sectionOfferings}
        exam={editingExam}
        isOpen={isFormOpen}
        isSaving={saveMutation.isPending}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) {
            setEditingExam(null)
          }
        }}
        onSubmit={(values) => saveMutation.mutate(values)}
      />
      <DeleteExamDialog
        exam={examToDelete}
        isDeleting={deleteMutation.isPending}
        onConfirm={() => {
          if (examToDelete) {
            deleteMutation.mutate(examToDelete.id)
          }
        }}
        onOpenChange={(open) => {
          if (!open) {
            setExamToDelete(null)
          }
        }}
      />
    </PageShell>
  )
}

function toExamPayload(values: ExamFormValues): ExamPayload {
  return {
    ...values,
    instructions: values.instructions.trim() || undefined,
  }
}

function PageShell({
  action,
  children,
  description,
  title,
}: {
  action?: React.ReactNode
  children: React.ReactNode
  description: string
  title: string
}) {
  return (
    <div className="mx-auto grid max-w-7xl gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl leading-tight font-semibold">{title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function QueryError({
  error,
  fallback,
  title,
}: {
  error: unknown
  fallback: string
  title: string
}) {
  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{getApiErrorMessage(error, fallback)}</AlertDescription>
    </Alert>
  )
}

function ExamPageSkeleton() {
  return (
    <div className="grid gap-4" aria-busy="true">
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}

function EmptyCard({ message }: { message: string }) {
  return (
    <Card className="bg-background">
      <CardContent className="grid min-h-52 place-items-center text-center">
        <p className="text-muted-foreground text-sm">{message}</p>
      </CardContent>
    </Card>
  )
}
