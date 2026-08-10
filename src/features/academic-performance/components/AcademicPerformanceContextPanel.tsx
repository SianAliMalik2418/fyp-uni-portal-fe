import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon, Books01Icon, Layers01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { academicPerformanceContextQueryOptions } from '../api/academic-performance-queries'
import type { AcademicPerformanceContext } from '../types/academic-performance.types'
import { getApiErrorMessage } from '@/shared/api/http-client'

function uniquePrograms(context: AcademicPerformanceContext) {
  const programs = new Map<string, string>()

  for (const section of context.activeSections) {
    programs.set(section.program.id, `${section.program.name} (${section.program.code})`)
  }

  return [...programs.values()]
}

function AcademicPerformanceContextSkeleton() {
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

function ContextMetric({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description: string
}) {
  return (
    <div className="border-border bg-muted/30 grid min-h-24 gap-2 rounded-md border p-4">
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      <p className="text-foreground text-sm font-semibold">{value}</p>
      <p className="text-muted-foreground text-xs leading-5">{description}</p>
    </div>
  )
}

export function AcademicPerformanceContextPanel() {
  const contextQuery = useQuery(academicPerformanceContextQueryOptions)

  if (contextQuery.isPending) {
    return <AcademicPerformanceContextSkeleton />
  }

  if (contextQuery.isError) {
    return (
      <Alert variant="destructive">
        <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
        <AlertTitle>Academic structure context unavailable</AlertTitle>
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
  const currentSemester = context.currentSemester
  const sectionLabel = context.studentSection
    ? `Section ${context.studentSection.name}`
    : `${context.activeSections.length} active section${context.activeSections.length === 1 ? '' : 's'}`

  return (
    <Card className="bg-background">
      <CardHeader className="border-border border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <HugeiconsIcon icon={Layers01Icon} strokeWidth={2} className="size-4" />
              Academic structure context
            </CardTitle>
            <CardDescription>
              Performance modules can read the current semester and section hierarchy.
            </CardDescription>
          </div>
          <Badge variant="outline">
            {context.canResolveStudentSection ? 'Student link ready' : 'Student link pending'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        <ContextMetric
          label="Program"
          value={programs.length > 0 ? programs.join(', ') : 'No active program sections'}
          description="Attendance and results can filter through section program relationships."
        />
        <ContextMetric
          label="Semester"
          value={
            currentSemester
              ? `${currentSemester.name} - ${currentSemester.academicYear}`
              : 'No active semester'
          }
          description="Later records can bind to the one active academic semester."
        />
        <ContextMetric
          label="Section"
          value={sectionLabel}
          description={
            context.studentSection
              ? 'The signed-in student section is available for student-owned records.'
              : 'Student-specific sections will resolve after student profiles are created.'
          }
        />
        <div className="border-border bg-muted/20 flex items-start gap-3 rounded-md border p-4 md:col-span-3">
          <span className="bg-background text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-md border">
            <HugeiconsIcon icon={Books01Icon} strokeWidth={2} className="size-4" />
          </span>
          <p className="text-muted-foreground text-sm leading-6">
            Program, semester, and section data is now visible from the academic-performance area
            without creating attendance or result records yet.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
