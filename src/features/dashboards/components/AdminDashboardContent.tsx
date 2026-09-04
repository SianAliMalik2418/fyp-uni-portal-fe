import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AdminDashboardResponse } from '../types/dashboard.types'
import { DashboardStatGrid } from './DashboardStatGrid'

export function AdminDashboardContent({ data }: { data: AdminDashboardResponse }) {
  const semester = data.currentSemester
    ? `${data.currentSemester.name}${data.currentSemester.academicYear ? ` ${data.currentSemester.academicYear}` : ''}`
    : 'Not set'

  return (
    <>
      <DashboardStatGrid
        stats={[
          { label: 'Students', value: data.summary.students },
          { label: 'Academic staff', value: data.summary.teachers },
          { label: 'Departments', value: data.summary.departments },
          { label: 'Programs', value: data.summary.programs },
          { label: 'Sections', value: data.summary.sections },
          { label: 'Courses', value: data.summary.courses },
          { label: 'Current semester', value: semester },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="bg-background">
          <CardHeader className="border-border border-b">
            <CardTitle>Recent imports</CardTitle>
            <CardDescription>Latest completed bulk account imports.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {data.recentImports.length ? (
              data.recentImports.map((item) => (
                <div key={item.id} className="rounded-md border p-3">
                  <p className="font-medium">{item.fileName}</p>
                  <p className="text-muted-foreground text-xs">
                    {item.importedCount} records · {item.importedAt}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No bulk imports recorded.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="border-border border-b">
            <CardTitle>Recent administrative activity</CardTitle>
            <CardDescription>Latest account provisioning events.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {data.recentActivity.length ? (
              data.recentActivity.map((activity) => (
                <div key={activity.id} className="rounded-md border p-3">
                  <p className="font-medium">{activity.label}</p>
                  <p className="text-muted-foreground text-xs">{activity.detail}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No administrative activity yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
