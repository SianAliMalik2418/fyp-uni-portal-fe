import { Add01Icon, Delete02Icon, Edit02Icon, MoreVerticalIcon } from '@hugeicons/core-free-icons'
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
import type { DeleteAcademicStructureTarget, Section } from '../types/academic-structure.types'
import { AcademicQueryMessage } from './AcademicQueryMessage'
import { AcademicStatusText } from './AcademicStatusText'

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
                <TableHead className="w-16 text-right">Actions</TableHead>
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
                    <AcademicStatusText active={section.isActive} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button type="button" variant="ghost" size="icon-sm" />}
                        aria-label={`Open actions for ${section.name}`}
                      >
                        <HugeiconsIcon icon={MoreVerticalIcon} strokeWidth={2} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => onEdit(section)}>
                            <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              onDelete({
                                kind: 'section',
                                id: section.id,
                                label: section.name,
                              })
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
            title="Sections"
            query={query}
            skeletonColumns={6}
            emptyIcon={<HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-5" />}
            emptyTitle="No sections yet"
            emptyText="Create batches and semesters first, then add sections for each intake."
          />
        )}
      </CardContent>
    </Card>
  )
}
