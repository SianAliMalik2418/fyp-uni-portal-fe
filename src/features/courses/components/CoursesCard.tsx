import { type ReactNode } from 'react'
import { CourseIcon, Delete02Icon, Edit02Icon, MoreVerticalIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import type { Course } from '../types/course.types'

type CoursesCardProps = {
  canManage?: boolean
  courses: Course[]
  error: unknown
  isDeleting: boolean
  isError: boolean
  isPending: boolean
  onDelete: (course: Course) => void
  onEdit: (course: Course) => void
}

export function CoursesCard({
  canManage = true,
  courses,
  error,
  isDeleting,
  isError,
  isPending,
  onDelete,
  onEdit,
}: CoursesCardProps) {
  let content: ReactNode

  if (isPending) {
    content = <TableSkeleton columns={6} />
  } else if (isError) {
    content = (
      <Alert variant="destructive">
        <AlertTitle>Courses unavailable</AlertTitle>
        <AlertDescription>{getApiErrorMessage(error, 'Unable to load courses')}</AlertDescription>
      </Alert>
    )
  } else if (courses.length) {
    content = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Status</TableHead>
            {canManage ? <TableHead className="w-16 text-right">Actions</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>
                <span className="text-foreground block font-medium">{course.title}</span>
                <span className="text-muted-foreground block">{course.code}</span>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground text-sm">{course.program.name}</span>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground text-sm">{course.semester.name}</span>
              </TableCell>
              <TableCell>{course.creditHours}</TableCell>
              <TableCell>
                <span className="text-muted-foreground text-sm">
                  {course.isActive ? 'active' : 'inactive'}
                </span>
              </TableCell>
              {canManage ? (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button type="button" variant="ghost" size="icon-sm" />}
                      aria-label={`Open actions for ${course.title}`}
                    >
                      <HugeiconsIcon icon={MoreVerticalIcon} strokeWidth={2} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => onEdit(course)}>
                          <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          disabled={isDeleting}
                          onClick={() => onDelete(course)}
                        >
                          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
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
          <p className="text-foreground text-sm font-medium">No courses yet</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Add courses before assigning them to sections.
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
