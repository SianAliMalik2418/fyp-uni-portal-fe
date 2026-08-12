import { useQuery } from '@tanstack/react-query'
import { HugeiconsIcon } from '@hugeicons/react'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { NotificationPanel } from '@/features/portal/components/NotificationPanel'
import { roleNavigation } from '@/features/portal/constants/portal-navigation'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { studentDashboardQueryOptions } from '../api/student-dashboard-queries'
import { StudentAttendanceOverview } from '../components/StudentAttendanceOverview'

const studentDashboardStats = [
  { label: 'Due fees', value: '0', sectionId: 'fees' },
  { label: 'Today classes', value: '0', sectionId: 'timetable' },
  { label: 'Upcoming exams', value: '0', sectionId: 'exams' },
  { label: 'New materials', value: '0', sectionId: 'materials' },
]

export function StudentDashboardPage({ user }: { user: PortalUser }) {
  const navigation = roleNavigation.student
  const dashboardQuery = useQuery(studentDashboardQueryOptions)

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div>
        <div>
          <h1 className="text-foreground text-2xl leading-tight font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Student service summary for {user.name}.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {studentDashboardStats.map((stat) => {
          const item = navigation.find((item) => item.id === stat.sectionId)

          return (
            <Card key={stat.label} size="sm" className="bg-background">
              <CardHeader className="gap-2">
                <CardDescription>{stat.label}</CardDescription>
                <div className="flex items-end justify-between gap-3">
                  <CardTitle className="text-2xl">{stat.value}</CardTitle>
                  {item ? (
                    <span className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
                      <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-4" />
                    </span>
                  ) : null}
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <StudentAttendanceOverview
          summaries={dashboardQuery.data?.attendance.summaries}
          error={dashboardQuery.error}
          isError={dashboardQuery.isError}
          isPending={dashboardQuery.isPending}
        />
        <NotificationPanel />
      </div>
    </div>
  )
}
