import { useQuery } from '@tanstack/react-query'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { Skeleton } from '@/components/ui/skeleton'
import { staffDashboardQueryOptions } from '../api/dashboard-queries'
import { DashboardQueryError } from '../components/DashboardQueryError'
import { HodDashboardContent } from '../components/HodDashboardContent'

export function HodDashboardPage({ user }: { user: PortalUser }) {
  const query = useQuery(staffDashboardQueryOptions)

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div>
        <h1 className="text-foreground text-2xl leading-tight font-semibold">HOD dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {query.data?.role === 'hod' && query.data.department
            ? query.data.department.name
            : `Department summary for ${user.name}.`}
        </p>
      </div>
      {query.isPending ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
      ) : query.isError ? (
        <DashboardQueryError error={query.error} />
      ) : query.data.role === 'hod' ? (
        <HodDashboardContent data={query.data} />
      ) : (
        <DashboardQueryError error={new Error('Dashboard role does not match your account.')} />
      )}
    </div>
  )
}
