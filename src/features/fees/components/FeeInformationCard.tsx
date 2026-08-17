import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatAppDate } from '@/shared/utils/date-format'
import type { StudentFee } from '../types/fee.types'
import { feeStatusLabels, formatCurrency } from '../utils/fee-formatters'
import { FeeStatusBadge } from './FeeStatusBadge'

export function FeeInformationCard({ fee }: { fee: StudentFee }) {
  const amounts = [
    { label: 'Total fee', value: fee.totalAmount },
    { label: 'Paid', value: fee.paidAmount },
    { label: 'Remaining', value: fee.remainingAmount },
  ]

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {amounts.map((amount) => (
          <Card key={amount.label} size="sm" className="bg-background">
            <CardHeader>
              <CardDescription>{amount.label}</CardDescription>
              <CardTitle className="text-xl">{formatCurrency(amount.value)}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="bg-background">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>{fee.semester.name}</CardTitle>
              <CardDescription>{fee.semester.academicYear}</CardDescription>
            </div>
            <FeeStatusBadge status={fee.status} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FeeDetail label="Due date" value={formatAppDate(fee.dueDate)} />
          <FeeDetail label="Payment date" value={formatAppDate(fee.paymentDate, 'Not recorded')} />
          <FeeDetail label="Payment status" value={feeStatusLabels[fee.status]} />
          <FeeDetail
            label="Payment information"
            value={fee.notes || 'No payment notes recorded.'}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function FeeDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <span className="text-muted-foreground text-xs font-medium uppercase">{label}</span>
      <span className="text-foreground text-sm capitalize">{value}</span>
    </div>
  )
}
