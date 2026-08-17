import { SchoolReportCardIcon, ViewIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PublishedStudentResultsResponse } from '../types/academic-performance.types'

export function StudentPublishedResults({
  data,
  onViewResultCard,
}: {
  data: PublishedStudentResultsResponse
  onViewResultCard: (semesterId: string) => void
}) {
  if (!data.semesters.length) {
    return (
      <div className="bg-muted/30 grid min-h-52 place-items-center rounded-md border border-dashed px-4 text-center">
        <div className="grid justify-items-center gap-2">
          <HugeiconsIcon
            icon={SchoolReportCardIcon}
            strokeWidth={2}
            className="text-muted-foreground size-8"
          />
          <p className="text-sm font-medium">No published results</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Course results appear here only after HOD approval.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-5">
      <Card className="bg-background">
        <CardHeader>
          <CardDescription>Cumulative grade point average</CardDescription>
          <CardTitle className="text-3xl tabular-nums">{data.cgpa.toFixed(2)} CGPA</CardTitle>
        </CardHeader>
      </Card>
      {data.semesters.map((semesterResult) => (
        <Card key={semesterResult.semester.id} className="bg-background">
          <CardHeader className="border-border border-b">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{semesterResult.semester.name}</CardTitle>
                <CardDescription>{semesterResult.semester.academicYear}</CardDescription>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <p className="text-lg font-semibold tabular-nums">
                  GPA {semesterResult.gpa.toFixed(2)}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewResultCard(semesterResult.semester.id)}
                >
                  <HugeiconsIcon icon={ViewIcon} strokeWidth={2} className="size-4" />
                  View result card
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right">Credit hours</TableHead>
                  <TableHead className="text-right">Marks</TableHead>
                  <TableHead className="text-right">Grade</TableHead>
                  <TableHead className="text-right">Grade point</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {semesterResult.courses.map((courseResult) => (
                  <TableRow key={courseResult.id}>
                    <TableCell>
                      <p className="font-medium">{courseResult.offering.course.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {courseResult.offering.course.code}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      {courseResult.offering.course.creditHours}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {courseResult.finalPercentage}%
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {courseResult.letterGrade}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {courseResult.gradePoint}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
