import { Badge } from '@/components/ui/badge'
import type { ResultStatus } from '../types/academic-performance.types'

const labels: Record<ResultStatus, string> = {
  draft: 'Draft',
  pending: 'Pending HOD Approval',
  returned: 'Returned',
  approved: 'Approved',
}

export function ResultStatusBadge({ status }: { status: ResultStatus }) {
  const variant =
    status === 'approved' ? 'default' : status === 'returned' ? 'destructive' : 'secondary'

  return <Badge variant={variant}>{labels[status]}</Badge>
}
