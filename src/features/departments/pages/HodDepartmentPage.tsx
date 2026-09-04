import { useQuery } from '@tanstack/react-query'
import { staffDashboardQueryOptions } from '@/features/dashboards/api/dashboard-queries'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

export function HodDepartmentPage() {
  const query = useQuery(staffDashboardQueryOptions)

  if (query.isPending)
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Spinner /> Loading department…
      </div>
    )
  if (query.isError || query.data?.role !== 'hod')
    return (
      <p className="text-destructive text-sm">
        {getApiErrorMessage(query.error, 'Department overview is unavailable')}
      </p>
    )
  const data = query.data

  const stats = [
    ['Students', data.summary.students],
    ['Teachers', data.summary.teachers],
    ['Courses', data.summary.courses],
    ['Attendance shortages', data.summary.lowAttendance],
    ['Pending result approvals', data.summary.pendingApprovals],
    ['Approved result sets', data.academicSummary.approvedResults],
  ] as const

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div>
        <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
          {data.department?.code ?? 'Department'}
        </p>
        <h1 className="text-foreground mt-1 text-2xl font-semibold">
          {data.department?.name ?? 'Assigned department'}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          A read-only operational view scoped to your department.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(([label, value]) => (
          <Card key={label}>
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Academic health</CardTitle>
          <CardDescription>Published department results only.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Metric label="Students assessed" value={data.academicSummary.studentsAssessed} />
          <Metric
            label="Average percentage"
            value={`${data.academicSummary.averagePercentage.toFixed(2)}%`}
          />
          <Metric label="Pass rate" value={`${data.academicSummary.passRate.toFixed(2)}%`} />
        </CardContent>
      </Card>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-muted/40 rounded-lg border p-4">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
    </div>
  )
}
