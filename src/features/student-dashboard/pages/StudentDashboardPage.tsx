import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Calendar03Icon,
  CourseIcon,
  File02Icon,
  Invoice01Icon,
  Megaphone01Icon,
  UserAccountIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { StudentResultCardDialog } from '@/features/academic-performance/components/StudentResultCardDialog'
import { NotificationPanel } from '@/features/portal/components/NotificationPanel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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

function formatFee(value: number) {
  return `PKR ${new Intl.NumberFormat('en-PK', { maximumFractionDigits: 2 }).format(value)}`
}

export function StudentDashboardPage({ user }: { user: PortalUser }) {
  const [resultCardSemesterId, setResultCardSemesterId] = useState('')
  const queryClient = useQueryClient()
  const dashboardQuery = useQuery(studentDashboardQueryOptions)
  const dashboard = dashboardQuery.data
  const studentDashboardStats = [
    {
      label: 'Due fees',
      value: formatFee(dashboard?.fee?.remainingAmount ?? 0),
      id: 'due-fees',
      icon: Invoice01Icon,
    },
    {
      label: 'Today classes',
      value: dashboard?.todayClasses.length ?? 0,
      id: 'today-classes',
      icon: Calendar03Icon,
    },
    {
      label: 'Upcoming exams',
      value: dashboard?.upcomingExams.length ?? 0,
      id: 'upcoming-exams',
      icon: File02Icon,
    },
    {
      label: 'Current courses',
      value: dashboard?.courses.length ?? 0,
      id: 'current-courses',
      icon: CourseIcon,
    },
  ]
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
        <h1 className="text-foreground text-2xl leading-tight font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Student service summary for {user.name}.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {studentDashboardStats.map((stat) => {
          return (
            <Card key={stat.label} size="sm" className="bg-background">
              <CardHeader className="gap-2">
                <CardDescription>{stat.label}</CardDescription>
                <div className="flex items-end justify-between gap-3">
                  {dashboardQuery.isPending ? <Skeleton className="h-8 w-20" /> : null}
                  {!dashboardQuery.isPending ? (
                    <CardTitle className="text-2xl tabular-nums" data-dashboard-stat={stat.id}>
                      {stat.value}
                    </CardTitle>
                  ) : null}
                  <span className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
                    <HugeiconsIcon icon={stat.icon} strokeWidth={2} className="size-4" />
                  </span>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="bg-background">
          <CardHeader className="border-border border-b">
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={UserAccountIcon} strokeWidth={2} className="size-4" />
              Student information
            </CardTitle>
            <CardDescription>Your active academic placement.</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardQuery.isPending ? (
              <div className="grid gap-2 sm:grid-cols-2" aria-busy="true">
                {Array.from({ length: 4 }, (_, index) => (
                  <Skeleton key={index} className="h-14" />
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Registration number</p>
                  <p className="mt-1 font-medium">{dashboard?.student.registrationNumber ?? '-'}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Current semester</p>
                  <p className="mt-1 font-medium">
                    {dashboard?.currentSemester
                      ? `${dashboard.currentSemester.name}${dashboard.currentSemester.academicYear ? ` ${dashboard.currentSemester.academicYear}` : ''}`
                      : 'Not assigned'}
                  </p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Program</p>
                  <p className="mt-1 font-medium">{dashboard?.student.program?.name ?? '-'}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Section</p>
                  <p className="mt-1 font-medium">{dashboard?.student.section?.name ?? '-'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="border-border border-b">
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Megaphone01Icon} strokeWidth={2} className="size-4" />
              Announcements
            </CardTitle>
            <CardDescription>Latest active university announcements.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {dashboardQuery.isPending ? (
              Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-16" />)
            ) : dashboard?.announcements.length ? (
              dashboard.announcements.map((announcement) => (
                <div key={announcement.id} className="rounded-md border p-3">
                  <p className="font-medium">{announcement.title}</p>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                    {announcement.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No active announcements.</p>
            )}
          </CardContent>
        </Card>
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
