import { useQuery } from '@tanstack/react-query'
import { UserIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { roleLabels } from '@/shared/constants/user-roles'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ownUserAccountQueryOptions } from '../api/user-accounts-queries'
import type { ProvisionedUserAccount } from '../types/user-account.types'
import { identifierForAccount } from '../utils/account-sections'

export function CurrentUserProfilePage() {
  const profileQuery = useQuery(ownUserAccountQueryOptions)

  if (profileQuery.isPending) {
    return (
      <div className="mx-auto grid max-w-4xl gap-5">
        <Skeleton className="h-8 w-48" />
        <Card className="bg-background">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (profileQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Profile unavailable</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(profileQuery.error, 'Unable to load account profile')}
        </AlertDescription>
      </Alert>
    )
  }

  const account = profileQuery.data.user

  return (
    <div className="mx-auto grid max-w-4xl gap-5">
      <div>
        <h1 className="text-foreground text-2xl leading-tight font-semibold">Account profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your portal identity and academic assignment are read-only.
        </p>
      </div>

      <Card className="bg-background">
        <CardHeader className="border-border border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-5" />
                {account.fullName}
              </CardTitle>
              <CardDescription>{account.email}</CardDescription>
            </div>
            <Badge variant={account.isActive ? 'secondary' : 'outline'}>
              {account.accountStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <ProfileField label="Role" value={roleLabels[account.role]} />
          <ProfileField label="Identifier" value={identifierForAccount(account)} />
          <ProfileField label="Phone" value={account.phoneNumber} />
          <ProfileField
            label="Password change"
            value={account.passwordChangeRequired ? 'Required' : 'Complete'}
          />
          <ProfileField label="Department" value={departmentLabel(account)} />
          <ProfileField label="Program" value={programLabel(account)} />
          <ProfileField label="Batch" value={account.batch?.name} />
          <ProfileField label="Semester" value={semesterLabel(account)} />
          <ProfileField label="Section" value={account.section?.name} />
          <ProfileField label="Academic status" value={account.academicStatus} />
          <ProfileField label="Designation" value={account.designation} />
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="border-border rounded-md border p-4">
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      <p className="text-foreground mt-2 text-sm font-semibold">{value || '-'}</p>
    </div>
  )
}

function departmentLabel(account: ProvisionedUserAccount) {
  return account.department ? `${account.department.name} (${account.department.code})` : undefined
}

function programLabel(account: ProvisionedUserAccount) {
  return account.program ? `${account.program.name} (${account.program.code})` : undefined
}

function semesterLabel(account: ProvisionedUserAccount) {
  return account.semester
    ? `${account.semester.name} (${account.semester.academicYear})`
    : undefined
}
