import { UserGroupIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
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
import type { AcademicPerformanceStudent } from '../types/academic-performance.types'

type AcademicPerformanceStudentTableProps = {
  moduleLabel: string
  students: AcademicPerformanceStudent[]
}

function relationLabel(relation: AcademicPerformanceStudent['semester']) {
  if (!relation) {
    return '-'
  }

  return relation.academicYear ? `${relation.name} - ${relation.academicYear}` : relation.name
}

function academicProfileLabel(student: AcademicPerformanceStudent) {
  return [student.program?.code, student.batch?.name].filter(Boolean).join(' / ') || '-'
}

export function AcademicPerformanceStudentTable({
  moduleLabel,
  students,
}: AcademicPerformanceStudentTableProps) {
  return (
    <Card className="bg-background">
      <CardHeader className="border-border border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} className="size-4" />
              Student information table
            </CardTitle>
            <CardDescription>
              {moduleLabel} can now read real student identity and academic placement fields.
            </CardDescription>
          </div>
          <Badge variant="outline">
            {students.length} student{students.length === 1 ? '' : 's'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {students.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Registration no.</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Academic profile</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.registrationNumber}</TableCell>
                  <TableCell>{relationLabel(student.semester)}</TableCell>
                  <TableCell>{relationLabel(student.section)}</TableCell>
                  <TableCell>{academicProfileLabel(student)}</TableCell>
                  <TableCell>
                    <Badge variant={student.isActive ? 'secondary' : 'outline'}>
                      {student.isActive ? 'active' : 'inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="bg-muted/30 grid min-h-40 place-items-center rounded-md border border-dashed px-4 text-center">
            <p className="text-muted-foreground text-sm">
              Student records will appear here after admin-created student profiles exist.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
