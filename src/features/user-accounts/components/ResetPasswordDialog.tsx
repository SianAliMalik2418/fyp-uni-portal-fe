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
import type { ProvisionedUserAccount } from '../types/user-account.types'

type ResetPasswordDialogProps = {
  account: ProvisionedUserAccount | null
  isResetting: boolean
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}

export function ResetPasswordDialog({
  account,
  isResetting,
  onConfirm,
  onOpenChange,
}: ResetPasswordDialogProps) {
  return (
    <AlertDialog open={Boolean(account)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset password?</AlertDialogTitle>
          <AlertDialogDescription>
            A new temporary password will be issued for {account?.fullName ?? 'this user'} and
            password change will be required on the next login.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isResetting} onClick={onConfirm}>
            Reset password
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
