import { Link } from 'react-router-dom'
import { ArrowRight01Icon, FileViewIcon, SchoolReportCardIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { StudentDashboardResponse } from '../types/student-dashboard.types'

export function StudentLatestResult({
  results,
  isPending,
  onViewResultCard,
}: {
  results?: StudentDashboardResponse['results']
  isPending: boolean
  onViewResultCard: (semesterId: string) => void
}) {
  const latest = results?.latest

  return (
    <Card className="bg-background">
      <CardHeader className="border-border border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={SchoolReportCardIcon} strokeWidth={2} className="size-4" />
              Latest published result
            </CardTitle>
            <CardDescription>Your newest HOD-approved course result.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {latest ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewResultCard(latest.offering.course.semester.id)}
              >
                <HugeiconsIcon icon={FileViewIcon} strokeWidth={2} className="size-4" />
                View result card
              </Button>
            ) : null}
            <Link to="/results" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              View results
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} data-icon="inline-end" />
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="grid gap-3 sm:grid-cols-3" aria-busy="true">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        ) : latest ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="bg-muted/30 rounded-md border p-3 sm:col-span-2">
              <p className="font-medium">{latest.offering.course.title}</p>
              <p className="text-muted-foreground text-sm">{latest.offering.course.code}</p>
              <Badge className="mt-3" variant="outline">
                {latest.letterGrade} · {latest.finalPercentage}%
              </Badge>
            </div>
            <div className="bg-muted/30 rounded-md border p-3">
              <p className="text-muted-foreground text-xs font-medium">Semester / cumulative</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {results.gpa.toFixed(2)} GPA
              </p>
              <p className="text-muted-foreground mt-1 text-sm tabular-nums">
                {results.cgpa.toFixed(2)} CGPA
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-muted/30 grid min-h-28 place-items-center rounded-md border border-dashed px-4 text-center">
            <p className="text-muted-foreground text-sm">
              Your latest result will appear after HOD approval.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
