import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast-manager'
import type { PortalUser } from '@/features/auth/types/auth.types'
import {
  sectionsQueryOptions,
  semestersQueryOptions,
} from '@/features/academic-structure/api/academic-structure-queries'
import { programsQueryOptions } from '@/features/programs/api/programs-queries'
import { AcademicReferenceSelect } from '@/features/academic-structure/components/AcademicReferenceSelect'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { publishSectionTimetable, saveSectionTimetableDraft } from '../api/timetable-api'
import {
  studentTimetableQueryOptions,
  teacherTimetablesQueryOptions,
  timetableKeys,
  timetableWorkspaceQueryOptions,
} from '../api/timetable-queries'
import { TimetableDraftEditor } from '../components/TimetableDraftEditor'
import { WeeklyTimetableBoard } from '../components/WeeklyTimetableBoard'
import { timetableFormSchema, type TimetableFormValues } from '../schemas/timetable.schemas'
import {
  emptyTimetableFormValues,
  formValuesToPayload,
  formatSectionLabel,
  timetableToFormValues,
} from '../utils/timetable-formatters'

export function TimetablePage({ title, user }: { title: string; user: PortalUser }) {
  if (user.role === 'admin') {
    return <AdminTimetablePage title={title} />
  }

  if (user.role === 'teacher') {
    return <TeacherTimetablePage title={title} />
  }

  return <StudentTimetablePage title={title} />
}

function StudentTimetablePage({ title }: { title: string }) {
  const timetableQuery = useQuery(studentTimetableQueryOptions)

  return (
    <PageShell
      title={title}
      description="View the published weekly class schedule for your enrolled section."
    >
      {timetableQuery.isPending ? <TimetablePageSkeleton /> : null}
      {timetableQuery.isError ? (
        <QueryErrorState
          title="Timetable unavailable"
          message={getApiErrorMessage(timetableQuery.error, 'Unable to load timetable')}
        />
      ) : null}
      {timetableQuery.isSuccess && timetableQuery.data.timetable ? (
        <WeeklyTimetableBoard timetable={timetableQuery.data.timetable} />
      ) : null}
      {timetableQuery.isSuccess && !timetableQuery.data.timetable ? (
        <EmptyState message="No published timetable is available for your section yet." />
      ) : null}
    </PageShell>
  )
}

function TeacherTimetablePage({ title }: { title: string }) {
  const timetablesQuery = useQuery(teacherTimetablesQueryOptions)

  return (
    <PageShell
      title={title}
      description="View only the published timetable slots assigned to your course offerings."
    >
      {timetablesQuery.isPending ? <TimetablePageSkeleton /> : null}
      {timetablesQuery.isError ? (
        <QueryErrorState
          title="Teaching timetable unavailable"
          message={getApiErrorMessage(timetablesQuery.error, 'Unable to load teaching timetable')}
        />
      ) : null}
      {timetablesQuery.isSuccess && timetablesQuery.data.timetables.length === 0 ? (
        <EmptyState message="No published timetable slots are assigned to you yet." />
      ) : null}
      {timetablesQuery.data?.timetables.map((timetable) => (
        <WeeklyTimetableBoard
          key={timetable.id}
          timetable={timetable}
          description={formatSectionLabel(timetable)}
          showTeacher={false}
        />
      ))}
    </PageShell>
  )
}

function AdminTimetablePage({ title }: { title: string }) {
  const queryClient = useQueryClient()
  const programsQuery = useQuery(programsQueryOptions)
  const semestersQuery = useQuery(semestersQueryOptions)
  const sectionsQuery = useQuery(sectionsQueryOptions)
  const [programIdSelection, setProgramIdSelection] = useState('')
  const [semesterIdSelection, setSemesterIdSelection] = useState('')
  const [sectionIdSelection, setSectionIdSelection] = useState('')
  const form = useForm<TimetableFormValues>({
    resolver: zodResolver(timetableFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: emptyTimetableFormValues(),
  })
  const { reset } = form

  const programs = programsQuery.data?.programs ?? []
  const semesters = semestersQuery.data?.semesters ?? []
  const sections = sectionsQuery.data?.sections ?? []
  const selectedProgramId = programs.some((program) => program.id === programIdSelection)
    ? programIdSelection
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
    (semester) => semester.id === semesterIdSelection
  )
    ? semesterIdSelection
    : (availableSemesters[0]?.id ?? '')
  const visibleSections = sections.filter(
    (section) =>
      section.isActive &&
      section.program.id === selectedProgramId &&
      section.semester.id === selectedSemesterId
  )
  const selectedSectionId = visibleSections.some((section) => section.id === sectionIdSelection)
    ? sectionIdSelection
    : (visibleSections[0]?.id ?? '')

  const workspaceQuery = useQuery(timetableWorkspaceQueryOptions(selectedSectionId))
  const workspace = workspaceQuery.data

  useEffect(() => {
    if (!workspaceQuery.isSuccess) {
      return
    }

    const baseline = workspace?.draftTimetable ?? workspace?.publishedTimetable
    reset(baseline ? timetableToFormValues(baseline) : emptyTimetableFormValues())
  }, [reset, workspace, workspaceQuery.isSuccess])

  const selectedProgram = programs.find((program) => program.id === selectedProgramId)
  const selectedSemester = semesters.find((semester) => semester.id === selectedSemesterId)
  const selectedSection = sections.find((section) => section.id === selectedSectionId)
  const isReferenceDataPending =
    programsQuery.isPending || semestersQuery.isPending || sectionsQuery.isPending
  const referenceDataError =
    programsQuery.error ?? semestersQuery.error ?? sectionsQuery.error ?? null

  const saveDraftMutation = useMutation({
    mutationFn: (values: TimetableFormValues) =>
      saveSectionTimetableDraft({
        sectionId: selectedSectionId,
        payload: formValuesToPayload(values),
      }),
    onSuccess: async () => {
      toast.add({
        title: 'Timetable draft saved',
        description: 'Draft changes were saved without affecting published schedules.',
        type: 'success',
      })
      await queryClient.invalidateQueries({ queryKey: timetableKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: 'Draft save failed',
        description: getApiErrorMessage(error, 'Unable to save timetable draft'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const publishMutation = useMutation({
    mutationFn: () => publishSectionTimetable(selectedSectionId),
    onSuccess: async () => {
      toast.add({
        title: 'Timetable published',
        description: 'Students and teachers now see the latest published schedule.',
        type: 'success',
      })
      await queryClient.invalidateQueries({ queryKey: timetableKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: 'Publish failed',
        description: getApiErrorMessage(error, 'Unable to publish timetable'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  return (
    <PageShell
      title={title}
      description="Configure draft and published timetables by program, semester, and section."
    >
      {isReferenceDataPending ? (
        <TimetablePageSkeleton />
      ) : referenceDataError ? (
        <QueryErrorState
          title="Timetable setup unavailable"
          message={getApiErrorMessage(referenceDataError, 'Unable to load timetable setup data')}
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Card className="bg-background self-start">
            <CardHeader className="border-b">
              <CardTitle>Schedule scope</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <AcademicReferenceSelect
                id="timetable-program"
                label="Program"
                value={selectedProgramId}
                options={programs.map((program) => ({
                  value: program.id,
                  label: `${program.name} (${program.code})`,
                }))}
                onValueChange={(value) => {
                  setProgramIdSelection(value)
                  setSemesterIdSelection('')
                  setSectionIdSelection('')
                }}
              />

              <AcademicReferenceSelect
                id="timetable-semester"
                label="Semester"
                value={selectedSemesterId}
                options={availableSemesters.map((semester) => ({
                  value: semester.id,
                  label: `${semester.name} (${semester.academicYear})`,
                }))}
                onValueChange={(value) => {
                  setSemesterIdSelection(value)
                  setSectionIdSelection('')
                }}
                disabled={availableSemesters.length === 0}
              />

              <AcademicReferenceSelect
                id="timetable-section"
                label="Section"
                value={selectedSectionId}
                options={visibleSections.map((section) => ({
                  value: section.id,
                  label: `${section.name} · ${section.batch.name}`,
                }))}
                onValueChange={(value) => {
                  setSectionIdSelection(value)
                  const matchingSection = sections.find((section) => section.id === value)

                  if (matchingSection) {
                    setProgramIdSelection(matchingSection.program.id)
                    setSemesterIdSelection(matchingSection.semester.id)
                  }
                }}
                disabled={visibleSections.length === 0}
              />

              {selectedProgram && selectedSemester && selectedSection ? (
                <div className="text-muted-foreground grid gap-1 text-sm">
                  <p>Program: {selectedProgram.name}</p>
                  <p>Semester: {selectedSemester.name}</p>
                  <p>Section: {selectedSection.name}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {!selectedSectionId ? (
            <EmptyState message="Select an active section to configure its timetable." />
          ) : workspaceQuery.isPending ? (
            <TimetablePageSkeleton />
          ) : workspaceQuery.isError ? (
            <QueryErrorState
              title="Timetable workspace unavailable"
              message={getApiErrorMessage(
                workspaceQuery.error,
                'Unable to load timetable workspace'
              )}
            />
          ) : workspace ? (
            <div className="grid gap-5">
              <TimetableDraftEditor
                availableCourseOfferings={workspace.availableCourseOfferings}
                form={form}
                hasDraftTimetable={Boolean(workspace.draftTimetable)}
                hasPublishedTimetable={Boolean(workspace.publishedTimetable)}
                isPublishing={publishMutation.isPending}
                isSaving={saveDraftMutation.isPending}
                onPublish={() => publishMutation.mutate()}
                onSubmit={(values) => saveDraftMutation.mutate(values)}
                sectionName={workspace.section.name}
              />

              {workspace.publishedTimetable ? (
                <WeeklyTimetableBoard
                  timetable={workspace.publishedTimetable}
                  title="Current published timetable"
                  description="This is what students and teachers currently see."
                />
              ) : (
                <EmptyState message="No timetable has been published for this section yet." />
              )}
            </div>
          ) : null}
        </div>
      )}
    </PageShell>
  )
}

function PageShell({
  children,
  description,
  title,
}: {
  children: React.ReactNode
  description: string
  title: string
}) {
  return (
    <div className="mx-auto grid max-w-7xl gap-5">
      <div>
        <h1 className="text-foreground text-2xl leading-tight font-semibold">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      {children}
    </div>
  )
}

function TimetablePageSkeleton() {
  return (
    <div className="grid gap-4" aria-busy="true">
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}

function QueryErrorState({ message, title }: { message: string; title: string }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="bg-background">
      <CardContent className="grid min-h-52 place-items-center text-center">
        <p className="text-muted-foreground text-sm">{message}</p>
      </CardContent>
    </Card>
  )
}
