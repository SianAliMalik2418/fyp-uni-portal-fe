import { AlertCircleIcon, ChartEvaluationIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { getApiErrorMessage } from '@/shared/api/http-client'
import type { StudentAcademicSummary as AcademicSummary } from '../types/student-dashboard.types'

function percentage(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 2)}%`
}

export function StudentAcademicSummary({
  summary,
  error,
  isError,
  isPending,
}: {
  summary?: AcademicSummary
  error: unknown
  isError: boolean
  isPending: boolean
}) {
  return (
    <Card className="bg-background">
      <CardHeader className="border-border border-b">
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={ChartEvaluationIcon} strokeWidth={2} className="size-4" />
          Academic summary
        </CardTitle>
        <CardDescription>Summary calculated from your published assessment marks.</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="grid gap-3 sm:grid-cols-2" aria-busy="true">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-20" />
            ))}
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
            <AlertTitle>Academic summary unavailable</AlertTitle>
            <AlertDescription>
              {getApiErrorMessage(error, 'Unable to load your academic summary.')}
            </AlertDescription>
          </Alert>
        ) : summary?.publishedAssessments ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="bg-muted/30 rounded-md border p-3">
              <p className="text-muted-foreground text-xs font-medium">Average score</p>
              <p className="mt-1 text-xl font-semibold">{percentage(summary.averagePercentage)}</p>
              <Progress className="mt-2" value={summary.averagePercentage} />
            </div>
            <div className="bg-muted/30 rounded-md border p-3">
              <p className="text-muted-foreground text-xs font-medium">Weighted progress</p>
              <p className="mt-1 text-xl font-semibold">{percentage(summary.weightedPercentage)}</p>
              <Progress className="mt-2" value={summary.weightedPercentage} />
            </div>
            <div className="bg-muted/30 rounded-md border p-3">
              <p className="text-muted-foreground text-xs font-medium">Published assessments</p>
              <p className="mt-1 text-xl font-semibold">{summary.publishedAssessments}</p>
            </div>
            <div className="bg-muted/30 rounded-md border p-3">
              <p className="text-muted-foreground text-xs font-medium">Courses with marks</p>
              <p className="mt-1 text-xl font-semibold">{summary.coursesWithMarks}</p>
            </div>
          </div>
        ) : (
          <div className="bg-muted/30 grid min-h-32 place-items-center rounded-md border border-dashed px-4 text-center">
            <div>
              <p className="text-sm font-medium">No published academic summary</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Your summary will appear after assessment results are published.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
