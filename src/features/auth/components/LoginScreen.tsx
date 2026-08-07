import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { LockPasswordIcon, Login03Icon, Mail01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useForm } from 'react-hook-form'
import { login } from '@/features/auth/api/auth-api'
import { AuthShell } from '@/features/auth/components/AuthShell'
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth.schemas'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginScreen({ onLogin }: { onLogin: (user: PortalUser) => void }) {
  const [error, setError] = useState('')
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
    onSuccess: (response) => onLogin(response.user),
    onError: (error) => setError(getApiErrorMessage(error, 'Invalid login credentials')),
  })

  function submitLogin(values: LoginFormValues) {
    setError('')
    loginMutation.mutate(values)
  }

  const isInactiveAccount = /inactive/i.test(error)

  return (
    <AuthShell supportingCopy="Use the email and temporary password provided by the administrator. Account access is checked against the backend session.">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Email and password are required.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" noValidate onSubmit={handleSubmit(submitLogin)}>
          {error ? (
            <Alert variant={isInactiveAccount ? 'destructive' : 'default'}>
              <AlertTitle>{isInactiveAccount ? 'Inactive account' : 'Login failed'}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
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
                className="pl-7"
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />
            </div>
            {errors.email ? (
              <p id="email-error" className="text-destructive text-xs">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <HugeiconsIcon
                icon={LockPasswordIcon}
                strokeWidth={2}
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2"
              />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                className="pl-7"
                aria-describedby={errors.password ? 'password-error' : undefined}
                aria-invalid={Boolean(errors.password)}
                {...register('password')}
              />
            </div>
            {errors.password ? (
              <p id="password-error" className="text-destructive text-xs">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" size="lg" disabled={loginMutation.isPending} className="w-full">
            <HugeiconsIcon icon={Login03Icon} strokeWidth={2} data-icon="inline-start" />
            {loginMutation.isPending ? 'Signing in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </AuthShell>
  )
}
