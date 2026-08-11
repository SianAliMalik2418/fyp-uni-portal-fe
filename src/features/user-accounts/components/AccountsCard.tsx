import { type ReactNode } from 'react'
import {
  Delete02Icon,
  Edit02Icon,
  LockPasswordIcon,
  MoreVerticalIcon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { roleLabels } from '@/shared/constants/user-roles'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableSkeleton } from '@/components/ui/table-skeleton'
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
  onDelete: (account: ProvisionedUserAccount) => void
  onEdit: (account: ProvisionedUserAccount) => void
  onResetPassword: (account: ProvisionedUserAccount) => void
  onView: (account: ProvisionedUserAccount) => void
}

export function AccountsCard({
  accounts,
  error,
  identifierColumnLabel,
  isError,
  isPending,
  onDelete,
  onEdit,
  onResetPassword,
  onView,
}: AccountsCardProps) {
  let content: ReactNode

  if (isPending) {
    content = <TableSkeleton columns={7} />
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
            <TableHead>Department</TableHead>
            <TableHead>Academic profile</TableHead>
            <TableHead className="w-16 text-right">Actions</TableHead>
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
                <Badge variant={account.isActive ? 'secondary' : 'outline'}>
                  {account.accountStatus}
                </Badge>
              </TableCell>
              <TableCell>{identifierForAccount(account)}</TableCell>
              <TableCell>{account.department?.code ?? '-'}</TableCell>
              <TableCell>{profileSummary(account)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button type="button" variant="ghost" size="icon-sm" />}
                    aria-label={`Open actions for ${account.fullName}`}
                  >
                    <HugeiconsIcon icon={MoreVerticalIcon} strokeWidth={2} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => onView(account)}>
                        <HugeiconsIcon icon={UserIcon} strokeWidth={2} />
                        View profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(account)}>
                        <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onResetPassword(account)}>
                        <HugeiconsIcon icon={LockPasswordIcon} strokeWidth={2} />
                        Reset password
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => onDelete(account)}>
                        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  } else {
    content = (
      <div className="bg-muted/30 grid min-h-40 place-items-center rounded-md border border-dashed px-4 text-center">
        <p className="text-muted-foreground text-sm">No matching accounts found.</p>
      </div>
    )
  }

  return (
    <Card className="bg-background">
      <CardContent>{content}</CardContent>
    </Card>
  )
}

function profileSummary(account: ProvisionedUserAccount) {
  if (account.role === 'student') {
    return (
      [account.program?.code, account.batch?.name, account.semester?.name, account.section?.name]
        .filter(Boolean)
        .join(' / ') || '-'
    )
  }

  if (account.role === 'teacher') {
    return account.designation ?? '-'
  }

  if (account.role === 'hod') {
    return account.department ? `HOD - ${account.department.code}` : 'HOD'
  }

  return '-'
}
