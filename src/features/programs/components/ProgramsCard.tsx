import { type ReactNode } from 'react'
import { Delete02Icon, Edit02Icon, Mortarboard01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Program } from '../types/program.types'

type ProgramsCardProps = {
  error: unknown
  isDeleting: boolean
  isError: boolean
  isPending: boolean
  onDelete: (program: Program) => void
  onEdit: (program: Program) => void
  programs: Program[]
}

export function ProgramsCard({
  error,
  isDeleting,
  isError,
  isPending,
  onDelete,
  onEdit,
  programs,
}: ProgramsCardProps) {
  let content: ReactNode

  if (isPending) {
    content = <TableSkeleton columns={5} />
  } else if (isError) {
    content = (
      <Alert variant="destructive">
        <AlertTitle>Programs unavailable</AlertTitle>
        <AlertDescription>{getApiErrorMessage(error, 'Unable to load programs')}</AlertDescription>
      </Alert>
    )
  } else if (programs.length) {
    content = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Program</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Structure</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-32 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((program) => (
            <TableRow key={program.id}>
              <TableCell>
                <span className="text-foreground block font-medium">{program.name}</span>
                <span className="text-muted-foreground mt-1 block text-sm">
                  {program.code}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-foreground block">{program.department.name}</span>
                <span className="text-muted-foreground block text-sm">
                  {program.department.code}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-foreground block">{program.totalSemesters} semesters</span>
                <span className="text-muted-foreground block text-sm">
                  {program.duration} {program.durationUnit}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground text-sm">
                  {program.isActive ? 'active' : 'inactive'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${program.name}`}
                    onClick={() => onEdit(program)}
                  >
                    <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${program.name}`}
                    disabled={isDeleting}
                    onClick={() => onDelete(program)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                  </Button>
                </div>
              </TableCell>
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
            <HugeiconsIcon icon={Mortarboard01Icon} strokeWidth={2} className="size-5" />
          </div>
          <p className="text-foreground text-sm font-medium">No programs yet</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Add a program after creating its department to continue the academic hierarchy.
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
