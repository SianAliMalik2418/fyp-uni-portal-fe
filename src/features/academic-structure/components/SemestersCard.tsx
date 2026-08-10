import { Calendar03Icon, Delete02Icon, Edit02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { DeleteAcademicStructureTarget, Semester } from '../types/academic-structure.types'
import { AcademicQueryMessage } from './AcademicQueryMessage'
import { AcademicStatusBadge } from './AcademicStatusBadge'

type QueryState = {
  error: unknown
  isError: boolean
  isPending: boolean
}

type SemestersCardProps = {
  onActivate: (semesterId: string) => void
  onClose: (semesterId: string) => void
  onDelete: (target: DeleteAcademicStructureTarget) => void
  onEdit: (semester: Semester) => void
  query: QueryState
  semesters: Semester[]
}

export function SemestersCard({
  onActivate,
  onClose,
  onDelete,
  onEdit,
  query,
  semesters,
}: SemestersCardProps) {
  return (
    <Card className="bg-background">
      <CardContent>
        {semesters.length && !query.isPending && !query.isError ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Semester</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-56 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semesters.map((semester) => (
                <TableRow key={semester.id}>
                  <TableCell>
                    <span className="block font-medium">{semester.name}</span>
                    <span className="text-muted-foreground text-sm">{semester.academicYear}</span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {semester.startsAt?.slice(0, 10) ?? 'No start'} to{' '}
                    {semester.endsAt?.slice(0, 10) ?? 'No end'}
                  </TableCell>
                  <TableCell>
                    <AcademicStatusBadge active={semester.isActive} closed={semester.isClosed} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap justify-end gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={semester.isActive || semester.isClosed}
                        onClick={() => onActivate(semester.id)}
                      >
                        Activate
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={semester.isClosed}
                        onClick={() => onClose(semester.id)}
                      >
                        Close
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${semester.name}`}
                        onClick={() => onEdit(semester)}
                      >
                        <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${semester.name}`}
                        onClick={() =>
                          onDelete({
                            kind: 'semester',
                            id: semester.id,
                            label: semester.name,
                          })
                        }
                      >
                        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <AcademicQueryMessage
            title="Semesters"
            query={query}
            emptyIcon={<HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-5" />}
            emptyTitle="No semesters yet"
            emptyText="Create a semester and activate it before assigning sections."
          />
        )}
      </CardContent>
    </Card>
  )
}
