import {
  Delete02Icon,
  Edit02Icon,
  MoreVerticalIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
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
import type { Batch, DeleteAcademicStructureTarget } from '../types/academic-structure.types'
import { AcademicQueryMessage } from './AcademicQueryMessage'
import { AcademicStatusText } from './AcademicStatusText'

type QueryState = {
  error: unknown
  isError: boolean
  isPending: boolean
}

type BatchesCardProps = {
  batches: Batch[]
  query: QueryState
  onDelete: (target: DeleteAcademicStructureTarget) => void
  onEdit: (batch: Batch) => void
  sectionCountsByBatch: Map<string, number>
}

export function BatchesCard({
  batches,
  query,
  onDelete,
  onEdit,
  sectionCountsByBatch,
}: BatchesCardProps) {
  return (
    <Card className="bg-background">
      <CardContent>
        {batches.length && !query.isPending && !query.isError ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Years</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-16 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.name}</TableCell>
                  <TableCell>
                    <span className="block">{batch.program.name}</span>
                    <span className="text-muted-foreground text-sm">{batch.program.code}</span>
                  </TableCell>
                  <TableCell>
                    {batch.startingYear}-{batch.expectedGraduationYear}
                  </TableCell>
                  <TableCell>{sectionCountsByBatch.get(batch.id) ?? 0}</TableCell>
                  <TableCell>
                    <AcademicStatusText active={batch.isActive} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button type="button" variant="ghost" size="icon-sm" />}
                        aria-label={`Open actions for ${batch.name}`}
                      >
                        <HugeiconsIcon icon={MoreVerticalIcon} strokeWidth={2} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => onEdit(batch)}>
                            <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              onDelete({ kind: 'batch', id: batch.id, label: batch.name })
                            }
                          >
                            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <AcademicQueryMessage
            title="Batches"
            query={query}
            skeletonColumns={6}
            emptyIcon={<HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} className="size-5" />}
            emptyTitle="No batches yet"
            emptyText="Add a batch after creating at least one active program."
          />
        )}
      </CardContent>
    </Card>
  )
}
