import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon, CourseIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import type { PortalUser } from '@/features/auth/types/auth.types'
import type { CourseOffering } from '@/features/courses/types/course.types'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { academicPerformanceOfferingsQueryOptions } from '../api/academic-performance-queries'

const moduleCopy: Record<
  string,
  {
    title: string
    description: string
    emptyTitle: string
    emptyDescription: string
  }
> = {
  attendance: {
    title: 'Course offering selection',
    description: 'Attendance records will be scoped to these real course sections.',
    emptyTitle: 'No course offerings available',
    emptyDescription: 'Attendance can start after courses are assigned to sections.',
  },
  marks: {
    title: 'Marks course selection',
    description: 'Marks entry will be scoped to the assigned course section selected here.',
    emptyTitle: 'No assigned courses available',
    emptyDescription: 'Marks sheets can start after a teacher is assigned to course sections.',
  },
}

function offeringLabel(offering: CourseOffering) {
  return `${offering.course.code} - ${offering.section.program.code} ${offering.section.semester.name} ${offering.section.name}`
}

function roleScopeText(role: PortalUser['role']) {
  if (role === 'teacher') {
    return 'Only course sections assigned to your teacher account are shown.'
  }

  if (role === 'student') {
    return 'Only courses from your active enrollments are shown.'
  }

  if (role === 'hod') {
    return 'Only department course sections are shown.'
  }

  return 'All active course sections are shown for administration.'
}

function CourseOfferingRows({ offerings }: { offerings: CourseOffering[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Section</TableHead>
          <TableHead>Teacher</TableHead>
          <TableHead>Students</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {offerings.map((offering) => (
          <TableRow key={offering.id}>
            <TableCell>
              <span className="text-foreground block font-medium">{offering.course.title}</span>
              <span className="text-muted-foreground block">{offering.course.code}</span>
            </TableCell>
            <TableCell>
              <span className="text-foreground block font-medium">
                {offering.section.program.code} - Section {offering.section.name}
              </span>
              <span className="text-muted-foreground block">
                {offering.section.semester.name} {offering.section.semester.academicYear}
              </span>
            </TableCell>
            <TableCell>{offering.teacher?.fullName ?? 'Unassigned'}</TableCell>
            <TableCell>{offering.studentCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function AcademicPerformanceOfferingsPanel({
  moduleId,
  user,
}: {
  moduleId: string
  user: PortalUser
}) {
  const offeringsQuery = useQuery(academicPerformanceOfferingsQueryOptions)
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>()
  const copy = moduleCopy[moduleId] ?? moduleCopy.attendance

  if (offeringsQuery.isPending) {
    return (
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <HugeiconsIcon icon={CourseIcon} strokeWidth={2} className="size-4" />
            {copy.title}
          </CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <TableSkeleton columns={4} rows={3} />
        </CardContent>
      </Card>
    )
  }

  if (offeringsQuery.isError) {
    return (
      <Alert variant="destructive">
        <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
        <AlertTitle>Course offerings unavailable</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(offeringsQuery.error, 'Unable to load course offerings.')}
        </AlertDescription>
      </Alert>
    )
  }

  const offerings = offeringsQuery.data.offerings
  const selectedOffering =
    offerings.find((offering) => offering.id === selectedOfferingId) ?? offerings[0]

  return (
    <Card className="bg-background">
      <CardHeader className="border-border border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <HugeiconsIcon icon={CourseIcon} strokeWidth={2} className="size-4" />
              {copy.title}
            </CardTitle>
            <CardDescription>{copy.description}</CardDescription>
          </div>
          <span className="text-muted-foreground text-sm">{roleScopeText(user.role)}</span>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {offerings.length ? (
          <>
            <div className="grid gap-2">
              <label className="text-foreground text-sm font-medium" htmlFor="courseOffering">
                Course offering
              </label>
              <Select
                value={selectedOffering?.id}
                onValueChange={(value) => setSelectedOfferingId(value ?? undefined)}
              >
                <SelectTrigger id="courseOffering" className="w-full">
                  <SelectValue>
                    {selectedOffering ? offeringLabel(selectedOffering) : 'Select course offering'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger>
                  {offerings.map((offering) => (
                    <SelectItem key={offering.id} value={offering.id}>
                      {offeringLabel(offering)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <CourseOfferingRows offerings={offerings} />
          </>
        ) : (
          <div className="bg-muted/30 grid min-h-44 place-items-center rounded-md border border-dashed px-4 text-center">
            <div className="grid justify-items-center gap-2">
              <span className="border-border bg-background text-muted-foreground flex size-10 items-center justify-center rounded-md border">
                <HugeiconsIcon icon={CourseIcon} strokeWidth={2} className="size-5" />
              </span>
              <p className="text-foreground text-sm font-medium">{copy.emptyTitle}</p>
              <p className="text-muted-foreground max-w-sm text-sm">{copy.emptyDescription}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
