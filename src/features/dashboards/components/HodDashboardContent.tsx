import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { HodDashboardResponse } from '../types/dashboard.types'
import { DashboardStatGrid } from './DashboardStatGrid'

function percentage(value: number) {
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)}%`
}

export function HodDashboardContent({ data }: { data: HodDashboardResponse }) {
  return (
    <>
      <DashboardStatGrid
        stats={[
          { label: 'Students', value: data.summary.students },
          { label: 'Teachers', value: data.summary.teachers },
          { label: 'Courses', value: data.summary.courses },
          { label: 'Low attendance', value: data.summary.lowAttendance },
          { label: 'Pending approvals', value: data.summary.pendingApprovals },
          { label: 'Approved results', value: data.summary.recentlyApproved },
        ]}
      />

      <DashboardStatGrid
        stats={[
          { label: 'Approved result sets', value: data.academicSummary.approvedResults },
          { label: 'Students assessed', value: data.academicSummary.studentsAssessed },
          {
            label: 'Average percentage',
            value: percentage(data.academicSummary.averagePercentage),
          },
          { label: 'Pass rate', value: percentage(data.academicSummary.passRate) },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="bg-background">
          <CardHeader className="border-border border-b">
            <CardTitle>Attendance shortages</CardTitle>
            <CardDescription>Lowest department attendance records first.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {data.lowAttendance.length ? (
              data.lowAttendance.map((shortage) => (
                <div
                  key={`${shortage.student.id}-${shortage.offering.id}`}
                  className="flex items-center justify-between gap-3 rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium">{shortage.student.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {shortage.student.registrationNumber} · {shortage.offering.course.code}
                    </p>
                  </div>
                  <Badge variant="destructive">{percentage(shortage.attendancePercentage)}</Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No attendance shortages found.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="border-border border-b">
            <CardTitle>Recently approved results</CardTitle>
            <CardDescription>Latest department result approvals.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {data.recentlyApprovedResults.length ? (
              data.recentlyApprovedResults.map((result) => (
                <div key={result.id} className="rounded-md border p-3">
                  <p className="font-medium">{result.courseTitle}</p>
                  <p className="text-muted-foreground text-xs">
                    {result.courseCode} · {result.studentCount} students
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No approved results yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
