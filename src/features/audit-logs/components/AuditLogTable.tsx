import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { AuditLog } from '../types/audit-log.types'

type AuditLogTableProps = {
  auditLogs: AuditLog[]
}

const auditDateFormatter = new Intl.DateTimeFormat('en-PK', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function readable(value: string) {
  return value.replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase())
}

export function AuditLogTable({ auditLogs }: AuditLogTableProps) {
  return (
    <Table className="min-w-[760px]">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Module</TableHead>
          <TableHead>Record</TableHead>
          <TableHead>Reason</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auditLogs.map((auditLog) => (
          <TableRow key={auditLog.id}>
            <TableCell className="text-muted-foreground">
              <time dateTime={auditLog.createdAt}>
                {auditDateFormatter.format(new Date(auditLog.createdAt))}
              </time>
            </TableCell>
            <TableCell>
              <div className="font-medium">{auditLog.actor.name}</div>
              <div className="text-muted-foreground text-xs">{readable(auditLog.actor.role)}</div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{readable(auditLog.action)}</Badge>
            </TableCell>
            <TableCell>{readable(auditLog.module)}</TableCell>
            <TableCell>{auditLog.affectedRecord.label ?? auditLog.affectedRecord.id}</TableCell>
            <TableCell className="max-w-72 whitespace-normal">
              {auditLog.reason ?? <span className="text-muted-foreground">Not provided</span>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
