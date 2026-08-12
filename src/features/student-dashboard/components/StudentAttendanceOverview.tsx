import { Link } from 'react-router-dom'
import {
  Alert02Icon,
  AlertCircleIcon,
  ArrowRight01Icon,
  Calendar03Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import type { AttendanceCourseSummary } from '@/features/academic-performance/types/academic-performance.types'
import { getApiErrorMessage } from '@/shared/api/http-client'

type StudentAttendanceOverviewProps = {
  summaries?: AttendanceCourseSummary[]
  error: unknown
  isError: boolean
  isPending: boolean
}

function percentageLabel(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 2)}%`
}

function overallAttendance(summaries: AttendanceCourseSummary[]) {
  let present = 0
  let total = 0

  for (const summary of summaries) {
    present += summary.present
    total += summary.totalClasses
  }

  return total ? Math.round((present / total) * 10000) / 100 : 0
}

function AttendanceSkeleton() {
  return (
    <CardContent className="grid gap-4" aria-busy="true">
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <Skeleton className="h-28" />
    </CardContent>
  )
}

export function StudentAttendanceOverview({
  summaries = [],
  error,
  isError,
  isPending,
}: StudentAttendanceOverviewProps) {
  const overallPercentage = overallAttendance(summaries)
  const shortages = summaries.filter((summary) => summary.isBelowThreshold)

  return (
    <Card className="bg-background">
      <CardHeader className="border-border border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-4" />
              Attendance summary
            </CardTitle>
            <CardDescription>Current attendance across your enrolled courses.</CardDescription>
          </div>
          <Link to="/attendance" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            View attendance
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} data-icon="inline-end" />
          </Link>
        </div>
      </CardHeader>

      {isPending ? (
        <AttendanceSkeleton />
      ) : isError ? (
        <CardContent>
          <Alert variant="destructive">
            <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
            <AlertTitle>Attendance summary unavailable</AlertTitle>
            <AlertDescription>
              {getApiErrorMessage(error, 'Unable to load your attendance summary.')}
            </AlertDescription>
          </Alert>
        </CardContent>
      ) : summaries.length ? (
        <CardContent className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="bg-muted/30 rounded-md border p-3">
              <p className="text-muted-foreground text-xs font-medium">Overall attendance</p>
              <p className="text-foreground mt-1 text-xl font-semibold">
                {percentageLabel(overallPercentage)}
              </p>
              <Progress className="mt-2" value={overallPercentage} />
            </div>
            <div className="bg-muted/30 rounded-md border p-3">
              <p className="text-muted-foreground text-xs font-medium">Courses tracked</p>
              <p className="text-foreground mt-1 text-xl font-semibold">{summaries.length}</p>
            </div>
            <div className="bg-muted/30 rounded-md border p-3">
              <p className="text-muted-foreground text-xs font-medium">Below requirement</p>
              <p className="text-foreground mt-1 text-xl font-semibold">{shortages.length}</p>
            </div>
          </div>

          {shortages.length ? (
            <Alert variant="destructive">
              <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4" />
              <AlertTitle>Low-attendance warning</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 grid gap-1">
                  {shortages.map((summary) => (
                    <li key={summary.offering.id}>
                      {summary.offering.course.code}:{' '}
                      {percentageLabel(summary.attendancePercentage)}, required{' '}
                      {summary.requiredPercentage}%
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-2 sm:grid-cols-2">
            {summaries.map((summary) => (
              <div
                key={summary.offering.id}
                className="flex items-center justify-between gap-3 rounded-md border p-3"
              >
                <div className="min-w-0">
                  <p className="text-foreground truncate text-sm font-medium">
                    {summary.offering.course.title}
                  </p>
                  <p className="text-muted-foreground text-xs">{summary.offering.course.code}</p>
                </div>
                <Badge variant={summary.isBelowThreshold ? 'destructive' : 'secondary'}>
                  {percentageLabel(summary.attendancePercentage)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      ) : (
        <CardContent>
          <div className="bg-muted/30 grid min-h-28 place-items-center rounded-md border border-dashed px-4 text-center">
            <p className="text-muted-foreground text-sm">
              Attendance will appear after your first class is marked.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
