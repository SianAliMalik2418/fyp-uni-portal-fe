import { QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { ShieldUserIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { logout } from '@/features/auth/api/auth-api'
import { authKeys, currentUserQueryOptions } from '@/features/auth/api/auth-queries'
import { LoginScreen } from '@/features/auth/components/LoginScreen'
import { PasswordChangeScreen } from '@/features/auth/components/PasswordChangeScreen'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { PortalShell } from '@/features/portal/components/PortalShell'
import { Toaster } from '@/components/ui/toast'
import { queryClient } from './query-client'

function AppRoutes() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const currentUserQuery = useQuery(currentUserQueryOptions)
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.removeQueries({ queryKey: authKeys.all })
      navigate('/', { replace: true })
    },
  })
  const user = currentUserQuery.data?.user ?? null

  function handleAuthenticated(user: PortalUser) {
    queryClient.setQueryData(authKeys.currentUser(), { user })
    navigate('/dashboard', { replace: true })
  }

  function handleLogout() {
    logoutMutation.mutate()
  }

  if (currentUserQuery.isPending) {
    return (
      <main className="bg-background flex min-h-svh items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <HugeiconsIcon icon={ShieldUserIcon} strokeWidth={2} className="size-4" />
          Checking session...
        </div>
      </main>
    )
  }

  if (!user) {
    return <LoginScreen onLogin={handleAuthenticated} />
  }

  if (user.passwordChangeRequired) {
    return (
      <PasswordChangeScreen user={user} onChanged={handleAuthenticated} onLogout={handleLogout} />
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/:sectionId" element={<PortalShell user={user} onLogout={handleLogout} />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Toaster>
    </QueryClientProvider>
  )
}

export default App
