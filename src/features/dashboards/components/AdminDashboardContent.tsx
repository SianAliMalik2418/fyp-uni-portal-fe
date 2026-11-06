import {
  Building01Icon,
  ClipboardListIcon,
  CourseIcon,
  Layers01Icon,
  Mortarboard01Icon,
  TeacherIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AdminDashboardResponse } from '../types/dashboard.types'
import { DashboardStatGrid } from './DashboardStatGrid'

export function AdminDashboardContent({ data }: { data: AdminDashboardResponse }) {
  return (
    <>
      <DashboardStatGrid
        stats={[
          { label: 'Students', value: data.summary.students, icon: UserGroupIcon },
          { label: 'Academic staff', value: data.summary.teachers, icon: TeacherIcon },
          { label: 'Departments', value: data.summary.departments, icon: Building01Icon },
          { label: 'Programs', value: data.summary.programs, icon: Mortarboard01Icon },
          { label: 'Sections', value: data.summary.sections, icon: Layers01Icon },
          { label: 'Courses', value: data.summary.courses, icon: CourseIcon },
        ]}
      />

      <Card className="bg-background">
        <CardHeader className="border-border border-b">
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={ClipboardListIcon} strokeWidth={2} className="size-4" />
            Recent administrative activity
          </CardTitle>
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
    </>
  )
}
