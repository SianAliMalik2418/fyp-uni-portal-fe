import { useDeferredValue, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Alert02Icon, Calendar03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  batchesQueryOptions,
  sectionsQueryOptions,
  semestersQueryOptions,
} from '@/features/academic-structure/api/academic-structure-queries'
import { programsQueryOptions } from '@/features/programs/api/programs-queries'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { filteredAttendanceShortagesQueryOptions } from '../api/academic-performance-queries'
import type { AttendanceShortagesQuery } from '../types/academic-performance.types'
import { AcademicRecordFilters, type AcademicRecordFilterField } from './AcademicRecordFilters'
import { QueryErrorState } from '@/components/ui/query-error-state'

function percentageLabel(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 2)}%`
}

export function HodAttendanceShortages({ title }: { title: string }) {
  const [filters, setFilters] = useState<AttendanceShortagesQuery>({ page: 1, limit: 20 })
  const deferredStudentSearch = useDeferredValue(filters.studentSearch)
  const deferredCourseSearch = useDeferredValue(filters.search)
  const shortageQuery = {
    ...filters,
    ...(deferredStudentSearch?.trim()
      ? { studentSearch: deferredStudentSearch.trim() }
      : { studentSearch: undefined }),
    ...(deferredCourseSearch?.trim()
      ? { search: deferredCourseSearch.trim() }
      : { search: undefined }),
  }
  const shortagesQuery = useQuery(filteredAttendanceShortagesQueryOptions(shortageQuery))
  const programsQuery = useQuery(programsQueryOptions)
  const batchesQuery = useQuery(batchesQueryOptions)
  const semestersQuery = useQuery(semestersQueryOptions)
  const sectionsQuery = useQuery(sectionsQueryOptions)
  const shortages = shortagesQuery.data?.shortages ?? []

  function updateFilter(field: AcademicRecordFilterField, value?: string) {
    if (field === 'resultStatus') return

    setFilters((current) => {
      const next = { ...current, page: 1 }
      if (value) next[field] = value
      else delete next[field]
      return next
    })
  }

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
          <Badge variant={shortagesQuery.data?.total ? 'destructive' : 'secondary'}>
            {shortagesQuery.data?.total ?? 0} shortage
            {shortagesQuery.data?.total === 1 ? '' : 's'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <AcademicRecordFilters
          batches={batchesQuery.data?.batches ?? []}
          mode="shortages"
          onChange={updateFilter}
          onClear={() => setFilters({ page: 1, limit: 20 })}
          programs={programsQuery.data?.programs ?? []}
          sections={sectionsQuery.data?.sections ?? []}
          semesters={semestersQuery.data?.semesters ?? []}
          values={filters}
        />
        {shortagesQuery.isPending ? (
          <TableSkeleton columns={6} rows={5} />
        ) : shortagesQuery.isError ? (
          <QueryErrorState resource="shortages" error={shortagesQuery.error} />
        ) : shortages.length ? (
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
      {shortagesQuery.data && shortagesQuery.data.totalPages > 1 ? (
        <CardFooter className="flex-col items-stretch justify-between gap-3 border-t sm:flex-row sm:items-center">
          <p className="text-muted-foreground text-sm">
            Page {shortagesQuery.data.page} of {shortagesQuery.data.totalPages}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={filters.page === 1 || shortagesQuery.isFetching}
              onClick={() =>
                setFilters((current) => ({ ...current, page: Math.max(1, current.page - 1) }))
              }
            >
              Previous
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={filters.page >= shortagesQuery.data.totalPages || shortagesQuery.isFetching}
              onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      ) : null}
    </Card>
  )
}
