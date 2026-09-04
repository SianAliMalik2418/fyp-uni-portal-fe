import { useQuery } from '@tanstack/react-query'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { Skeleton } from '@/components/ui/skeleton'
import { staffDashboardQueryOptions } from '../api/dashboard-queries'
import { AdminDashboardContent } from '../components/AdminDashboardContent'
import { DashboardQueryError } from '../components/DashboardQueryError'

export function AdminDashboardPage({ user }: { user: PortalUser }) {
  const query = useQuery(staffDashboardQueryOptions)

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div>
        <h1 className="text-foreground text-2xl leading-tight font-semibold">Admin dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">System summary for {user.name}.</p>
      </div>
      {query.isPending ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
          {Array.from({ length: 7 }, (_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
      ) : query.isError ? (
        <DashboardQueryError error={query.error} />
      ) : query.data.role === 'admin' ? (
        <AdminDashboardContent data={query.data} />
      ) : (
        <DashboardQueryError error={new Error('Dashboard role does not match your account.')} />
      )}
    </div>
  )
}
