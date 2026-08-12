import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ResultRecord } from '../types/academic-performance.types'
import { assessmentCategoryLabels } from '../utils/academic-performance-labels'

export function ResultRecordsTable({ records }: { records: ResultRecord[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Assessment totals</TableHead>
            <TableHead className="text-right">Final</TableHead>
            <TableHead className="text-right">Grade</TableHead>
            <TableHead className="text-right">Grade point</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.student.id}>
              <TableCell>
                <p className="font-medium">{record.student.name}</p>
                <p className="text-muted-foreground text-xs">{record.student.registrationNumber}</p>
              </TableCell>
              <TableCell>
                <div className="flex min-w-96 flex-wrap gap-x-3 gap-y-1">
                  {record.categories.map((category) => (
                    <span key={category.category} className="text-muted-foreground text-xs">
                      <span className="text-foreground font-medium">
                        {assessmentCategoryLabels[category.category]}:
                      </span>{' '}
                      {category.obtainedMarks}/{category.maximumMarks} · {category.weightedMarks}%
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {record.finalPercentage}%
              </TableCell>
              <TableCell className="text-right font-semibold">{record.letterGrade}</TableCell>
              <TableCell className="text-right tabular-nums">{record.gradePoint}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
