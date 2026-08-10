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
import type { DeleteAcademicStructureTarget } from '../types/academic-structure.types'

type DeleteAcademicStructureDialogProps = {
  isDeleting: boolean
  onConfirm: (target: DeleteAcademicStructureTarget) => void
  onOpenChange: (open: boolean) => void
  target: DeleteAcademicStructureTarget | null
}

export function DeleteAcademicStructureDialog({
  isDeleting,
  onConfirm,
  onOpenChange,
  target,
}: DeleteAcademicStructureDialogProps) {
  return (
    <AlertDialog open={Boolean(target)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {target?.label}</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the record from the academic structure. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!target || isDeleting}
            onClick={() => target && onConfirm(target)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
