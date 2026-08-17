import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HugeiconsIcon } from '@hugeicons/react'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { StudentResultCardDialog } from '@/features/academic-performance/components/StudentResultCardDialog'
import { NotificationPanel } from '@/features/portal/components/NotificationPanel'
import { roleNavigation } from '@/features/portal/constants/portal-navigation'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  studentDashboardKeys,
  studentDashboardQueryOptions,
} from '../api/student-dashboard-queries'
import { markNotificationRead } from '@/features/notifications/api/notifications-api'
import { StudentAttendanceOverview } from '../components/StudentAttendanceOverview'
import { StudentAcademicSummary } from '../components/StudentAcademicSummary'
import { StudentRecentMarks } from '../components/StudentRecentMarks'
import { StudentLatestResult } from '../components/StudentLatestResult'
import { toast } from '@/components/ui/toast-manager'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { notificationKeys } from '@/features/notifications/api/notification-queries'

const studentDashboardStats = [
  { label: 'Due fees', value: '0', sectionId: 'fees' },
  { label: 'Today classes', value: '0', sectionId: 'timetable' },
  { label: 'Upcoming exams', value: '0', sectionId: 'exams' },
  { label: 'New materials', value: '0', sectionId: 'materials' },
]

export function StudentDashboardPage({ user }: { user: PortalUser }) {
  const [resultCardSemesterId, setResultCardSemesterId] = useState('')
  const queryClient = useQueryClient()
  const navigation = roleNavigation.student
  const dashboardQuery = useQuery(studentDashboardQueryOptions)
  const readMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: studentDashboardKeys.summary() })
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: 'Notification not updated',
        description: getApiErrorMessage(error, 'Unable to mark the notification as read.'),
        type: 'error',
      })
    },
  })

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
        <NotificationPanel
          notifications={dashboardQuery.data?.notifications}
          markingId={readMutation.isPending ? readMutation.variables : undefined}
          onMarkRead={(notificationId) => readMutation.mutate(notificationId)}
        />
      </div>

      <StudentLatestResult
        results={dashboardQuery.data?.results}
        isPending={dashboardQuery.isPending}
        onViewResultCard={setResultCardSemesterId}
      />
      <StudentResultCardDialog
        semesterId={resultCardSemesterId}
        open={Boolean(resultCardSemesterId)}
        onOpenChange={(open) => {
          if (!open) setResultCardSemesterId('')
        }}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <StudentRecentMarks
          marks={dashboardQuery.data?.academics?.recentMarks}
          error={dashboardQuery.error}
          isError={dashboardQuery.isError}
          isPending={dashboardQuery.isPending}
        />
        <StudentAcademicSummary
          summary={dashboardQuery.data?.academics?.summary}
          error={dashboardQuery.error}
          isError={dashboardQuery.isError}
          isPending={dashboardQuery.isPending}
        />
      </div>
    </div>
  )
}
