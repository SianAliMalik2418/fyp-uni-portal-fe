import { Add01Icon, Delete02Icon, Edit02Icon } from '@hugeicons/core-free-icons'
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
import type { DeleteAcademicStructureTarget, Section } from '../types/academic-structure.types'
import { AcademicQueryMessage } from './AcademicQueryMessage'
import { AcademicStatusBadge } from './AcademicStatusBadge'

type QueryState = {
  error: unknown
  isError: boolean
  isPending: boolean
}

type SectionsCardProps = {
  onDelete: (target: DeleteAcademicStructureTarget) => void
  onEdit: (section: Section) => void
  query: QueryState
  sections: Section[]
}

export function SectionsCard({ onDelete, onEdit, query, sections }: SectionsCardProps) {
  return (
    <Card className="bg-background">
      <CardContent>
        {sections.length && !query.isPending && !query.isError ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell className="font-medium">{section.name}</TableCell>
                  <TableCell>
                    <span className="block">{section.program.name}</span>
                    <span className="text-muted-foreground text-sm">{section.program.code}</span>
                  </TableCell>
                  <TableCell>{section.batch.name}</TableCell>
                  <TableCell>
                    <span className="block">{section.semester.name}</span>
                    <span className="text-muted-foreground text-sm">
                      {section.semester.academicYear}
                    </span>
                  </TableCell>
                  <TableCell>
                    <AcademicStatusBadge active={section.isActive} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${section.name}`}
                        onClick={() => onEdit(section)}
                      >
                        <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${section.name}`}
                        onClick={() =>
                          onDelete({
                            kind: 'section',
                            id: section.id,
                            label: section.name,
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
            title="Sections"
            query={query}
            emptyIcon={<HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-5" />}
            emptyTitle="No sections yet"
            emptyText="Create batches and semesters first, then add sections for each intake."
          />
        )}
      </CardContent>
    </Card>
  )
}
