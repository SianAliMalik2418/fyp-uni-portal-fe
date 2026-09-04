import { apiClient } from '@/shared/api/http-client'
import type { StaffDashboardResponse } from '../types/dashboard.types'

export async function getStaffDashboard() {
  const { data } = await apiClient.get<StaffDashboardResponse>('/dashboards/me')
  return data
}
