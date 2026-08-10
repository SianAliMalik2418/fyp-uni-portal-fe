import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LockPasswordIcon, Login03Icon, Mail01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useForm } from 'react-hook-form'
import { login } from '@/features/auth/api/auth-api'
import { authKeys } from '@/features/auth/api/auth-queries'
import { AuthShell } from '@/features/auth/components/AuthShell'
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth.schemas'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Button } from '@/components/ui/button'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input, PasswordInput } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/components/ui/toast-manager'

export function LoginPage({ onLogin }: { onLogin: (user: PortalUser) => void }) {
  const queryClient = useQueryClient()
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      queryClient.setQueryData(authKeys.currentUser(), { user: response.user })
      onLogin(response.user)
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, 'Invalid login credentials')
      const isInactiveAccount = /inactive/i.test(message)

      toast.add({
        title: isInactiveAccount ? 'Inactive account' : 'Login failed',
        description: message,
        type: isInactiveAccount ? 'warning' : 'error',
        priority: 'high',
      })
    },
  })

  function submitLogin(values: LoginFormValues) {
    loginMutation.mutate(values)
  }

  return (
    <AuthShell supportingCopy="Use the email and temporary password provided by the administrator. Account access is checked against the backend session.">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Email and password are required.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" noValidate onSubmit={handleSubmit(submitLogin)}>
          <FieldGroup className="gap-4">
            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <div className="relative">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  strokeWidth={2}
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2"
                />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@example.com"
                  className="pl-7"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={Boolean(errors.email)}
                  {...register('email')}
                />
              </div>
              <FieldError id="email-error" errors={[errors.email]} />
            </Field>

            <Field data-invalid={Boolean(errors.password)}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <HugeiconsIcon
                  icon={LockPasswordIcon}
                  strokeWidth={2}
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2"
                />
                <PasswordInput
                  id="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="pl-7"
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  aria-invalid={Boolean(errors.password)}
                  {...register('password')}
                />
              </div>
              <FieldError id="password-error" errors={[errors.password]} />
            </Field>
          </FieldGroup>

          <Button type="submit" size="lg" disabled={loginMutation.isPending} className="w-full">
            {loginMutation.isPending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <HugeiconsIcon icon={Login03Icon} strokeWidth={2} data-icon="inline-start" />
            )}
            Login
          </Button>
        </form>
      </CardContent>
    </AuthShell>
  )
}
