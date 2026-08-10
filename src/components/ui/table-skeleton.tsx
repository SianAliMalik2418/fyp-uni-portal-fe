import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type TableSkeletonProps = {
  columns: number
  rows?: number
  className?: string
}

function TableSkeleton({ columns, rows = 5, className }: TableSkeletonProps) {
  return (
    <Table aria-busy="true" aria-label="Loading table data" className={className}>
      <TableHeader>
        <TableRow>
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <TableHead key={columnIndex}>
              <Skeleton
                className={cn('h-4', columnIndex === columns - 1 ? 'ml-auto w-14' : 'w-24')}
              />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <TableCell key={columnIndex}>
                <Skeleton
                  className={cn(
                    'h-4',
                    columnIndex === 0 && 'w-40',
                    columnIndex > 0 && columnIndex < columns - 1 && 'w-24',
                    columnIndex === columns - 1 && 'ml-auto w-16'
                  )}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { TableSkeleton }
