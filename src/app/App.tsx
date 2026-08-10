import { QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { logout } from '@/features/auth/api/auth-api'
import { authKeys, currentUserQueryOptions } from '@/features/auth/api/auth-queries'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { PasswordChangePage } from '@/features/auth/pages/PasswordChangePage'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { PortalPage } from '@/features/portal/pages/PortalPage'
import { Skeleton } from '@/components/ui/skeleton'
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
      <main className="bg-background flex min-h-svh items-center justify-center" aria-busy="true">
        <div className="grid w-full max-w-sm gap-4 px-6">
          <Skeleton className="mx-auto size-14 rounded-md" />
          <div className="grid gap-2">
            <Skeleton className="mx-auto h-5 w-48" />
            <Skeleton className="mx-auto h-4 w-64 max-w-full" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </main>
    )
  }

  if (!user) {
    return <LoginPage onLogin={handleAuthenticated} />
  }

  if (user.passwordChangeRequired) {
    return (
      <PasswordChangePage user={user} onChanged={handleAuthenticated} onLogout={handleLogout} />
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/:sectionId" element={<PortalPage user={user} onLogout={handleLogout} />} />
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
