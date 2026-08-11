import { type ReactNode } from 'react'
import { CourseIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
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
import type { AssignableTeacher, CourseOffering } from '../types/course.types'

type CourseOfferingsCardProps = {
  canAssignTeacher?: boolean
  error: unknown
  isAssigningTeacher?: boolean
  isError: boolean
  isPending: boolean
  offerings: CourseOffering[]
  onAssignTeacher?: (offeringId: string, teacherId: string | null) => void
  teachers?: AssignableTeacher[]
}

export function CourseOfferingsCard({
  canAssignTeacher = false,
  error,
  isAssigningTeacher = false,
  isError,
  isPending,
  offerings,
  onAssignTeacher,
  teachers = [],
}: CourseOfferingsCardProps) {
  let content: ReactNode

  if (isPending) {
    content = <TableSkeleton columns={canAssignTeacher ? 6 : 5} />
  } else if (isError) {
    content = (
      <Alert variant="destructive">
        <AlertTitle>Course offerings unavailable</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(error, 'Unable to load course offerings')}
        </AlertDescription>
      </Alert>
    )
  } else if (offerings.length) {
    content = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Students</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offerings.map((offering) => {
            const teacherOptions = teachers.filter(
              (teacher) => teacher.department?.id === offering.course.department.id
            )
            return (
              <TableRow key={offering.id}>
                <TableCell>
                  <span className="text-foreground block font-medium">{offering.course.title}</span>
                  <span className="text-muted-foreground block">{offering.course.code}</span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {offering.section.program.code} · {offering.section.semester.name} ·{' '}
                    {offering.section.name}
                  </span>
                </TableCell>
                <TableCell>{offering.course.creditHours}</TableCell>
                <TableCell>
                  {canAssignTeacher && onAssignTeacher ? (
                    <Select
                      value={offering.teacher?.id ?? 'unassigned'}
                      disabled={isAssigningTeacher}
                      onValueChange={(value) =>
                        onAssignTeacher(offering.id, value === 'unassigned' ? null : value)
                      }
                    >
                      <SelectTrigger className="w-52">
                        <SelectValue>{offering.teacher?.fullName ?? 'Unassigned'}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {teacherOptions.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      {offering.teacher?.fullName ?? 'Unassigned'}
                    </span>
                  )}
                </TableCell>
                <TableCell>{offering.studentCount}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  } else {
    content = (
      <div className="bg-muted/30 grid min-h-48 place-items-center rounded-md border border-dashed px-4 text-center">
        <div className="grid justify-items-center gap-2">
          <div className="bg-background text-muted-foreground grid size-10 place-items-center rounded-md border">
            <HugeiconsIcon icon={CourseIcon} strokeWidth={2} className="size-5" />
          </div>
          <p className="text-foreground text-sm font-medium">No assigned courses</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Course offerings will appear here after section assignment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-background">
      <CardContent>{content}</CardContent>
    </Card>
  )
}
