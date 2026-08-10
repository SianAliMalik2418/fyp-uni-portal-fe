import { type ReactNode } from 'react'
import { Building01Icon, Delete02Icon, Edit02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
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
import type { Department } from '../types/department.types'

type DepartmentsCardProps = {
  departments: Department[]
  error: unknown
  isDeleting: boolean
  isError: boolean
  isPending: boolean
  onDelete: (department: Department) => void
  onEdit: (department: Department) => void
}

export function DepartmentsCard({
  departments,
  error,
  isDeleting,
  isError,
  isPending,
  onDelete,
  onEdit,
}: DepartmentsCardProps) {
  let content: ReactNode

  if (isPending) {
    content = <TableSkeleton columns={4} />
  } else if (isError) {
    content = (
      <Alert variant="destructive">
        <AlertTitle>Departments unavailable</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(error, 'Unable to load departments')}
        </AlertDescription>
      </Alert>
    )
  } else if (departments.length) {
    content = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Department</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-32 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.id}>
              <TableCell>
                <span className="text-foreground block font-medium">{department.name}</span>
                <span className="text-muted-foreground block">
                  {department.description ?? 'No description'}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{department.code}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={department.isActive ? 'outline' : 'destructive'}>
                  {department.isActive ? 'active' : 'inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${department.name}`}
                    onClick={() => onEdit(department)}
                  >
                    <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${department.name}`}
                    disabled={isDeleting}
                    onClick={() => onDelete(department)}
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
            <HugeiconsIcon icon={Building01Icon} strokeWidth={2} className="size-5" />
          </div>
          <p className="text-foreground text-sm font-medium">No departments yet</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Add the first department to start building the academic hierarchy.
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
