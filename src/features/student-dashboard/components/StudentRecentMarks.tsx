import { AlertCircleIcon, ChartNoAxesColumnDecreasingIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { markStatusLabels } from '@/features/academic-performance/utils/academic-performance-labels'
import { getApiErrorMessage } from '@/shared/api/http-client'
import type { PublishedStudentMark } from '../types/student-dashboard.types'

function markValue(mark: PublishedStudentMark) {
  if (mark.status) {
    return markStatusLabels[mark.status]
  }

  return `${mark.obtainedMarks ?? 0} / ${mark.assessment.maximumMarks}`
}

export function StudentRecentMarks({
  marks = [],
  error,
  isError,
  isPending,
}: {
  marks?: PublishedStudentMark[]
  error: unknown
  isError: boolean
  isPending: boolean
}) {
  return (
    <Card className="bg-background">
      <CardHeader className="border-border border-b">
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon
            icon={ChartNoAxesColumnDecreasingIcon}
            strokeWidth={2}
            className="size-4"
          />
          Recent marks
        </CardTitle>
        <CardDescription>Your latest published assessment marks.</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="grid gap-2" aria-busy="true">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-10" />
            ))}
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
            <AlertTitle>Recent marks unavailable</AlertTitle>
            <AlertDescription>
              {getApiErrorMessage(error, 'Unable to load your recent marks.')}
            </AlertDescription>
          </Alert>
        ) : marks.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead className="text-right">Mark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marks.map((mark) => (
                <TableRow key={mark.assessment.id}>
                  <TableCell>
                    <p className="font-medium">{mark.offering.course.code}</p>
                    <p className="text-muted-foreground text-xs">{mark.offering.course.title}</p>
                  </TableCell>
                  <TableCell>{mark.assessment.name}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={mark.status === 'result_withheld' ? 'destructive' : 'outline'}>
                      {markValue(mark)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="bg-muted/30 grid min-h-32 place-items-center rounded-md border border-dashed px-4 text-center">
            <div>
              <p className="text-sm font-medium">No published marks</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Draft and unpublished marks are hidden from students.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
