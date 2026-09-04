import { queryOptions } from '@tanstack/react-query'
import { getStaffDashboard } from './dashboard-api'

export const dashboardKeys = {
  all: ['dashboards'] as const,
  current: () => [...dashboardKeys.all, 'current'] as const,
}

export const staffDashboardQueryOptions = queryOptions({
  queryKey: dashboardKeys.current(),
  queryFn: getStaffDashboard,
})
