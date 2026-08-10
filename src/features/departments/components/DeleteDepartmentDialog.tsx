import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Department } from '../types/department.types'

type DeleteDepartmentDialogProps = {
  department: Department | null
  isDeleting: boolean
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}

export function DeleteDepartmentDialog({
  department,
  isDeleting,
  onConfirm,
  onOpenChange,
}: DeleteDepartmentDialogProps) {
  return (
    <AlertDialog open={Boolean(department)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete department?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes {department?.name ?? 'this department'} from the portal. Continue only if
            it is not used by active academic records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={isDeleting} onClick={onConfirm}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
