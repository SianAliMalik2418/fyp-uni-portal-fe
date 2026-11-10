import { QueryErrorState } from '@/components/ui/query-error-state'

export function DashboardQueryError({ error }: { error: unknown }) {
  return <QueryErrorState resource="dashboard" error={error} />
}
