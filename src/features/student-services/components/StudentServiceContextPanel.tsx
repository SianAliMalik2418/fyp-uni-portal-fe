import { useQuery } from '@tanstack/react-query'
import {
  AlertCircleIcon,
  AiMagicIcon,
  Calendar03Icon,
  SchoolReportCardIcon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { studentServiceContextQueryOptions } from '../api/student-services-queries'
import type {
  StudentServiceContext,
  StudentServiceRelation,
  StudentServiceStudentContext,
  StudentServiceStructureScope,
} from '../types/student-services.types'

function uniquePrograms(context: StudentServiceContext) {
  const programs = new Map<string, string>()

  for (const section of context.availableSections) {
    programs.set(section.program.id, `${section.program.name} (${section.program.code})`)
  }

  return [...programs.values()]
}

function scopeLabel(scope: StudentServiceStructureScope) {
  const readyCount = [
    scope.canReferenceProgram,
    scope.canReferenceSemester,
    scope.canReferenceSection,
  ].filter(Boolean).length

  return `${readyCount}/3 references ready`
}

function relationLabel(relation: StudentServiceRelation | null) {
  if (!relation) {
    return 'Pending'
  }

  if (relation.code) {
    return `${relation.name} (${relation.code})`
  }

  return relation.academicYear ? `${relation.name} - ${relation.academicYear}` : relation.name
}

function StudentServiceContextSkeleton() {
  return (
    <Card className="bg-background">
      <CardHeader>
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </CardContent>
    </Card>
  )
}

function ServiceScopeCard({
  icon,
  label,
  scope,
}: {
  icon: typeof Calendar03Icon
  label: string
  scope: StudentServiceStructureScope
}) {
  return (
    <div className="border-border bg-muted/30 grid gap-3 rounded-md border p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-foreground flex items-center gap-2 text-sm font-semibold">
          <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4" />
          {label}
        </p>
        <span className="text-muted-foreground text-xs">{scopeLabel(scope)}</span>
      </div>
      <div className="grid gap-2 text-xs">
        <span className="text-muted-foreground">
          Program: {scope.canReferenceProgram ? 'ready' : 'pending'}
        </span>
        <span className="text-muted-foreground">
          Semester: {scope.canReferenceSemester ? 'ready' : 'pending'}
        </span>
        <span className="text-muted-foreground">
          Section: {scope.canReferenceSection ? 'ready' : 'pending'}
        </span>
      </div>
    </div>
  )
}

function StudentIdentityCard({ student }: { student: StudentServiceStudentContext | null }) {
  if (!student) {
    return (
      <div className="border-border bg-muted/20 rounded-md border p-4 md:col-span-3">
        <p className="text-muted-foreground text-sm">
          Student identity will resolve here for signed-in student accounts.
        </p>
      </div>
    )
  }

  return (
    <div className="border-border grid gap-4 rounded-md border p-4 md:col-span-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
            <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-foreground text-sm font-semibold">{student.name}</p>
            <p className="text-muted-foreground truncate text-sm">{student.email}</p>
          </div>
        </div>
        <Badge variant="outline">{student.registrationNumber ?? 'No registration no.'}</Badge>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <p className="text-muted-foreground text-xs font-medium">Program</p>
          <p className="text-foreground mt-1 text-sm font-semibold">
            {relationLabel(student.program)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-medium">Semester</p>
          <p className="text-foreground mt-1 text-sm font-semibold">
            {relationLabel(student.semester)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-medium">Section</p>
          <p className="text-foreground mt-1 text-sm font-semibold">
            {relationLabel(student.section)}
          </p>
        </div>
      </div>
    </div>
  )
}

export function StudentServiceContextPanel() {
  const contextQuery = useQuery(studentServiceContextQueryOptions)

  if (contextQuery.isPending) {
    return <StudentServiceContextSkeleton />
  }

  if (contextQuery.isError) {
    return (
      <Alert variant="destructive">
        <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
        <AlertTitle>Student-service context unavailable</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(
            contextQuery.error,
            'Program, semester, and section context failed to load.'
          )}
        </AlertDescription>
      </Alert>
    )
  }

  const context = contextQuery.data
  const programs = uniquePrograms(context)
  const semesterLabel = context.currentSemester
    ? `${context.currentSemester.name} - ${context.currentSemester.academicYear}`
    : 'No active semester'

  return (
    <Card className="bg-background">
      <CardHeader className="border-border border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Student-service structure context</CardTitle>
            <CardDescription>
              Timetable, exam, and AI modules can reference program, semester, and section data.
            </CardDescription>
          </div>
          <span className="text-muted-foreground text-sm">
            {context.availableSections.length} active sections
          </span>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <StudentIdentityCard student={context.student} />
        <div className="grid gap-3 md:grid-cols-3">
          <ServiceScopeCard
            icon={Calendar03Icon}
            label="Timetable"
            scope={context.timetableScope}
          />
          <ServiceScopeCard icon={SchoolReportCardIcon} label="Exams" scope={context.examScope} />
          <ServiceScopeCard icon={AiMagicIcon} label="AI assistant" scope={context.aiScope} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="border-border rounded-md border p-4">
            <p className="text-muted-foreground text-xs font-medium">Program filters</p>
            <p className="text-foreground mt-2 text-sm font-semibold">
              {programs.length > 0 ? programs.join(', ') : 'No active program sections'}
            </p>
          </div>
          <div className="border-border rounded-md border p-4">
            <p className="text-muted-foreground text-xs font-medium">Semester filter</p>
            <p className="text-foreground mt-2 text-sm font-semibold">{semesterLabel}</p>
          </div>
          <div className="border-border rounded-md border p-4">
            <p className="text-muted-foreground text-xs font-medium">Section filters</p>
            <p className="text-foreground mt-2 text-sm font-semibold">
              {context.availableSections.length} available
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
