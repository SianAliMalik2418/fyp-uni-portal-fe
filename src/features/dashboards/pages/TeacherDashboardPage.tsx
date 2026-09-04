import { useQuery } from '@tanstack/react-query'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { Skeleton } from '@/components/ui/skeleton'
import { staffDashboardQueryOptions } from '../api/dashboard-queries'
import { DashboardQueryError } from '../components/DashboardQueryError'
import { TeacherDashboardContent } from '../components/TeacherDashboardContent'

export function TeacherDashboardPage({ user }: { user: PortalUser }) {
  const query = useQuery(staffDashboardQueryOptions)

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div>
        <h1 className="text-foreground text-2xl leading-tight font-semibold">Teacher dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">Teaching summary for {user.name}.</p>
      </div>
      {query.isPending ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
      ) : query.isError ? (
        <DashboardQueryError error={query.error} />
      ) : query.data.role === 'teacher' ? (
        <TeacherDashboardContent data={query.data} />
      ) : (
        <DashboardQueryError error={new Error('Dashboard role does not match your account.')} />
      )}
    </div>
  )
}
