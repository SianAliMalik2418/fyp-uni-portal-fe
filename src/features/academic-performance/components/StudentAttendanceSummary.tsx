import { useQuery } from '@tanstack/react-query'
import { Alert02Icon, AlertCircleIcon, Calendar03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { studentAttendanceQueryOptions } from '../api/academic-performance-queries'

function percentageLabel(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 2)}%`
}

export function StudentAttendanceSummary({ title }: { title: string }) {
  const attendanceQuery = useQuery(studentAttendanceQueryOptions)

  if (attendanceQuery.isPending) {
    return (
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Loading course-wise attendance.</CardDescription>
        </CardHeader>
        <CardContent>
          <TableSkeleton columns={7} rows={4} />
        </CardContent>
      </Card>
    )
  }

  if (attendanceQuery.isError) {
    return (
      <Alert variant="destructive">
        <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
        <AlertTitle>Attendance unavailable</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(attendanceQuery.error, 'Unable to load attendance summaries.')}
        </AlertDescription>
      </Alert>
    )
  }

  const summaries = attendanceQuery.data.summaries
  const shortageCount = summaries.filter((summary) => summary.isBelowThreshold).length

  return (
    <Card className="bg-background">
      <CardHeader className="border-border border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-4" />
              {title}
            </CardTitle>
            <CardDescription>Course-wise totals and shortage warnings.</CardDescription>
          </div>
          <Badge variant={shortageCount ? 'destructive' : 'secondary'}>
            {shortageCount} warning{shortageCount === 1 ? '' : 's'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {summaries.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Absent</TableHead>
                <TableHead>Leave</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaries.map((summary) => (
                <TableRow key={summary.offering.id}>
                  <TableCell>
                    <span className="text-foreground block font-medium">
                      {summary.offering.course.title}
                    </span>
                    <span className="text-muted-foreground block">
                      {summary.offering.course.code}
                    </span>
                  </TableCell>
                  <TableCell>{summary.totalClasses}</TableCell>
                  <TableCell>{summary.present}</TableCell>
                  <TableCell>{summary.absent}</TableCell>
                  <TableCell>{summary.leave}</TableCell>
                  <TableCell className="min-w-36">
                    <div className="grid gap-1">
                      <span>{percentageLabel(summary.attendancePercentage)}</span>
                      <Progress value={summary.attendancePercentage} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={summary.isBelowThreshold ? 'destructive' : 'secondary'}>
                      {summary.isBelowThreshold ? (
                        <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} />
                      ) : null}
                      Required {summary.requiredPercentage}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="bg-muted/30 grid min-h-44 place-items-center rounded-md border border-dashed px-4 text-center">
            <p className="text-muted-foreground text-sm">
              Course attendance will appear after enrollments and attendance sessions exist.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
