import {
  Calendar03Icon,
  ChartNoAxesColumnDecreasingIcon,
  CourseIcon,
  Layers01Icon,
  SchoolReportCardIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { TeacherDashboardResponse } from '../types/dashboard.types'
import { DashboardStatGrid } from './DashboardStatGrid'

export function TeacherDashboardContent({ data }: { data: TeacherDashboardResponse }) {
  const markProgress = data.summary.totalAssessments
    ? Math.round((data.summary.completedMarkSheets / data.summary.totalAssessments) * 100)
    : 0

  return (
    <>
      <DashboardStatGrid
        stats={[
          { label: 'Assigned courses', value: data.summary.assignedCourses, icon: CourseIcon },
          { label: 'Sections', value: data.summary.sections, icon: Layers01Icon },
          { label: 'Students', value: data.summary.students, icon: UserGroupIcon },
          {
            label: 'Attendance sessions',
            value: data.summary.attendanceSessions,
            icon: Calendar03Icon,
          },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="bg-background">
          <CardHeader className="border-border border-b">
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon
                icon={ChartNoAxesColumnDecreasingIcon}
                strokeWidth={2}
                className="size-4"
              />
              Marks progress
            </CardTitle>
            <CardDescription>Completed mark sheets across assigned assessments.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">
              {data.summary.completedMarkSheets} of {data.summary.totalAssessments}
            </p>
            <Progress value={markProgress} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="border-border border-b">
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={SchoolReportCardIcon} strokeWidth={2} className="size-4" />
              Result workflow
            </CardTitle>
            <CardDescription>Your current result submission states.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">{data.summary.draftResults} draft</Badge>
            <Badge variant="outline">{data.summary.pendingResults} pending</Badge>
            <Badge variant={data.summary.returnedResults ? 'destructive' : 'outline'}>
              {data.summary.returnedResults} returned
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="bg-background">
          <CardHeader className="border-border border-b">
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={CourseIcon} strokeWidth={2} className="size-4" />
              Assigned courses
            </CardTitle>
            <CardDescription>Active course and section assignments.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {data.assignedCourses.length ? (
              data.assignedCourses.map((offering) => (
                <div key={offering.id} className="flex justify-between gap-3 rounded-md border p-3">
                  <div>
                    <p className="font-medium">{offering.course.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {offering.course.code} · Section {offering.section.name}
                    </p>
                  </div>
                  <Badge variant="outline">{offering.studentCount} students</Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No active course assignments.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="border-border border-b">
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-4" />
              Attendance activity
            </CardTitle>
            <CardDescription>Recent attendance sessions you recorded.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {data.attendanceActivity.length ? (
              data.attendanceActivity.map((activity) => (
                <div key={activity.id} className="rounded-md border p-3">
                  <p className="font-medium">{activity.courseTitle}</p>
                  <p className="text-muted-foreground text-xs">
                    {activity.courseCode} · Section {activity.sectionName} · {activity.date} ·{' '}
                    {activity.studentCount} students
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No attendance activity recorded.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
