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
import { Spinner } from '@/components/ui/spinner'
import type { Course } from '../types/course.types'

type DeleteCourseDialogProps = {
  course: Course | null
  isDeleting: boolean
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}

export function DeleteCourseDialog({
  course,
  isDeleting,
  onConfirm,
  onOpenChange,
}: DeleteCourseDialogProps) {
  return (
    <AlertDialog open={Boolean(course)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete course?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes {course?.code ?? 'this course'} and its section assignments from the
            portal.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={isDeleting} onClick={onConfirm}>
            {isDeleting ? <Spinner data-icon="inline-start" /> : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
