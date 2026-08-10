import { type ReactNode } from 'react'
import { roleLabels } from '@/shared/constants/user-roles'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ProvisionedUserAccount } from '../types/user-account.types'
import { identifierForAccount } from '../utils/account-sections'

type AccountsCardProps = {
  accounts: ProvisionedUserAccount[]
  error: unknown
  identifierColumnLabel: string
  isError: boolean
  isPending: boolean
}

export function AccountsCard({
  accounts,
  error,
  identifierColumnLabel,
  isError,
  isPending,
}: AccountsCardProps) {
  let content: ReactNode

  if (isPending) {
    content = <p className="text-muted-foreground text-sm">Loading accounts...</p>
  } else if (isError) {
    content = (
      <Alert variant="destructive">
        <AlertTitle>Accounts unavailable</AlertTitle>
        <AlertDescription>{getApiErrorMessage(error, 'Unable to load accounts')}</AlertDescription>
      </Alert>
    )
  } else if (accounts.length) {
    content = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>{identifierColumnLabel}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>
                <span className="text-foreground block font-medium">{account.fullName}</span>
                <span className="text-muted-foreground block">{account.email}</span>
              </TableCell>
              <TableCell>{roleLabels[account.role]}</TableCell>
              <TableCell>
                <Badge variant={account.isActive ? 'outline' : 'destructive'}>
                  {account.accountStatus}
                </Badge>
              </TableCell>
              <TableCell>{identifierForAccount(account)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  } else {
    content = (
      <div className="bg-muted/30 grid min-h-40 place-items-center rounded-md border border-dashed px-4 text-center">
        <p className="text-muted-foreground text-sm">No accounts have been created yet.</p>
      </div>
    )
  }

  return (
    <Card className="bg-background">
      <CardContent>{content}</CardContent>
    </Card>
  )
}
