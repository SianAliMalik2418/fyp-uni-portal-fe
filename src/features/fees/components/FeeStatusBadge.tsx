import { Badge } from '@/components/ui/badge'
import type { FeeStatus } from '../types/fee.types'
import { feeStatusLabels } from '../utils/fee-formatters'

export function FeeStatusBadge({ status }: { status: FeeStatus }) {
  const variant = status === 'overdue' ? 'destructive' : status === 'paid' ? 'secondary' : 'outline'

  return <Badge variant={variant}>{feeStatusLabels[status]}</Badge>
}
