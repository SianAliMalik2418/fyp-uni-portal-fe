import { useQuery } from '@tanstack/react-query'
import { Alert02Icon, AlertCircleIcon, Calendar03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { attendanceShortagesQueryOptions } from '../api/academic-performance-queries'

function percentageLabel(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 2)}%`
}

export function HodAttendanceShortages({ title }: { title: string }) {
  const shortagesQuery = useQuery(attendanceShortagesQueryOptions)

  if (shortagesQuery.isPending) {
    return (
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Loading attendance shortage cases.</CardDescription>
        </CardHeader>
        <CardContent>
          <TableSkeleton columns={6} rows={5} />
        </CardContent>
      </Card>
    )
  }

  if (shortagesQuery.isError) {
    return (
      <Alert variant="destructive">
        <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
        <AlertTitle>Shortages unavailable</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(shortagesQuery.error, 'Unable to load attendance shortages.')}
        </AlertDescription>
      </Alert>
    )
  }

  const shortages = shortagesQuery.data.shortages

  return (
    <Card className="bg-background">
      <CardHeader className="border-border border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-4" />
              {title}
            </CardTitle>
            <CardDescription>Students below the required attendance percentage.</CardDescription>
          </div>
          <Badge variant={shortages.length ? 'destructive' : 'secondary'}>
            {shortages.length} shortage{shortages.length === 1 ? '' : 's'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {shortages.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Registration no.</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Required</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shortages.map((shortage) => (
                <TableRow key={`${shortage.offering.id}-${shortage.student.id}`}>
                  <TableCell className="font-medium">{shortage.student.name}</TableCell>
                  <TableCell>{shortage.student.registrationNumber}</TableCell>
                  <TableCell>
                    <span className="text-foreground block font-medium">
                      {shortage.offering.course.title}
                    </span>
                    <span className="text-muted-foreground block">
                      {shortage.offering.course.code}
                    </span>
                  </TableCell>
                  <TableCell>
                    {shortage.offering.section.program.code} - {shortage.offering.section.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">
                      <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} />
                      {percentageLabel(shortage.attendancePercentage)}
                    </Badge>
                  </TableCell>
                  <TableCell>{shortage.requiredPercentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="bg-muted/30 grid min-h-44 place-items-center rounded-md border border-dashed px-4 text-center">
            <p className="text-muted-foreground text-sm">
              No students are below the attendance threshold.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
