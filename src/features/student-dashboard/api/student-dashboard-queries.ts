import { queryOptions } from '@tanstack/react-query'
import { getStudentDashboard } from './student-dashboard-api'

export const studentDashboardKeys = {
  all: ['student-dashboard'] as const,
  summary: () => [...studentDashboardKeys.all, 'summary'] as const,
}

export const studentDashboardQueryOptions = queryOptions({
  queryKey: studentDashboardKeys.summary(),
  queryFn: getStudentDashboard,
})
