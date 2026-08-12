import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import type { Assessment } from '../types/academic-performance.types'
import { assessmentCategoryLabels } from '../utils/academic-performance-labels'

export function AssessmentsTable({
  assessments,
  isLoading,
}: {
  assessments: Assessment[]
  isLoading: boolean
}) {
  if (isLoading) {
    return <TableSkeleton columns={3} rows={4} />
  }

  if (!assessments.length) {
    return (
      <div className="bg-muted/30 grid min-h-32 place-items-center rounded-md border border-dashed px-4 text-center">
        <div>
          <p className="text-sm font-medium">No assessments created</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Add a quiz, assignment, midterm, or final for this course section.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Assessment</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Maximum marks</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assessments.map((assessment) => (
          <TableRow key={assessment.id}>
            <TableCell className="font-medium">{assessment.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{assessmentCategoryLabels[assessment.category]}</Badge>
            </TableCell>
            <TableCell className="text-right tabular-nums">{assessment.maximumMarks}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
