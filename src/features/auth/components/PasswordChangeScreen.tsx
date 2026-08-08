import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { LockPasswordIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useForm } from 'react-hook-form'
import { changePassword } from '@/features/auth/api/auth-api'
import { AuthShell } from '@/features/auth/components/AuthShell'
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '@/features/auth/schemas/auth.schemas'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Button } from '@/components/ui/button'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PasswordInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'

export function PasswordChangeScreen({
  user,
  onChanged,
  onLogout,
}: {
  user: PortalUser
  onChanged: (user: PortalUser) => void
  onLogout: () => void
}) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (response) => {
      toast.add({
        title: 'Password updated',
        description: 'You can now access the portal.',
        type: 'success',
      })
      onChanged(response.user)
    },
    onError: (error) => {
      toast.add({
        title: 'Password change failed',
        description: getApiErrorMessage(error, 'Password change failed'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  function submitPasswordChange(values: ChangePasswordFormValues) {
    changePasswordMutation.mutate(values)
  }

  return (
    <AuthShell supportingCopy="Temporary passwords must be replaced before portal modules are available. This keeps first login onboarding explicit and auditable.">
      <CardHeader>
        <CardTitle>Change temporary password</CardTitle>
        <CardDescription>
          {user.name}, update your password before entering the portal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" noValidate onSubmit={handleSubmit(submitPasswordChange)}>
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current temporary password</Label>
            <PasswordInput
              id="current-password"
              autoComplete="current-password"
              placeholder="Enter current password"
              aria-describedby={errors.currentPassword ? 'current-password-error' : undefined}
              aria-invalid={Boolean(errors.currentPassword)}
              {...register('currentPassword')}
            />
            {errors.currentPassword ? (
              <p id="current-password-error" className="text-destructive text-xs">
                {errors.currentPassword.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New password</Label>
            <PasswordInput
              id="new-password"
              autoComplete="new-password"
              placeholder="Enter new password"
              aria-describedby={errors.newPassword ? 'new-password-error' : undefined}
              aria-invalid={Boolean(errors.newPassword)}
              {...register('newPassword')}
            />
            {errors.newPassword ? (
              <p id="new-password-error" className="text-destructive text-xs">
                {errors.newPassword.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <PasswordInput
              id="confirm-password"
              autoComplete="new-password"
              placeholder="Confirm new password"
              aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword ? (
              <p id="confirm-password-error" className="text-destructive text-xs">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" onClick={onLogout}>
              Logout
            </Button>
            <Button type="submit" disabled={changePasswordMutation.isPending}>
              <HugeiconsIcon icon={LockPasswordIcon} strokeWidth={2} data-icon="inline-start" />
              {changePasswordMutation.isPending ? 'Updating...' : 'Update password'}
            </Button>
          </div>
        </form>
      </CardContent>
    </AuthShell>
  )
}
