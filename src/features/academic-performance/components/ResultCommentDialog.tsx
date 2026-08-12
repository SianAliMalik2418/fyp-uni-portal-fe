import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { resultCommentSchema, type ResultCommentValues } from '../schemas/result.schemas'

type ResultCommentDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (values: ResultCommentValues) => void
}

export function ResultCommentDialog({
  open,
  title,
  description,
  confirmLabel,
  isPending,
  onOpenChange,
  onConfirm,
}: ResultCommentDialogProps) {
  const form = useForm<ResultCommentValues>({
    resolver: zodResolver(resultCommentSchema),
    defaultValues: { comment: '' },
  })

  useEffect(() => {
    if (!open) form.reset()
  }, [form, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form className="grid gap-5" onSubmit={form.handleSubmit(onConfirm)} noValidate>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="resultComment" required>
              Reason
            </Label>
            <Textarea
              id="resultComment"
              placeholder="Explain why this result needs correction"
              aria-invalid={Boolean(form.formState.errors.comment)}
              aria-describedby="resultCommentError"
              {...form.register('comment')}
            />
            <p id="resultCommentError" className="text-destructive min-h-4 text-xs">
              {form.formState.errors.comment?.message}
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? <Spinner /> : null}
              {confirmLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
