import { roleLabels } from '@/shared/constants/user-roles'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ProvisionedUserAccount } from '../types/user-account.types'
import { identifierForAccount } from '../utils/account-sections'

type UserAccountDetailsSheetProps = {
  account: ProvisionedUserAccount | null
  onOpenChange: (open: boolean) => void
}

export function UserAccountDetailsSheet({ account, onOpenChange }: UserAccountDetailsSheetProps) {
  return (
    <Sheet open={Boolean(account)} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex min-h-0 w-full flex-col gap-0 space-y-0 sm:max-w-lg"
        side="right"
      >
        <SheetHeader className="shrink-0 border-b pr-14">
          <SheetTitle>{account?.fullName ?? 'Account profile'}</SheetTitle>
          <SheetDescription>Read-only portal profile and academic assignment.</SheetDescription>
        </SheetHeader>
        {account ? (
          <ScrollArea className="min-h-0 flex-1 py-4">
            <div className="grid gap-5 px-4 pb-4">
              <div className="grid gap-1">
                <span className="text-muted-foreground text-sm">Account status</span>
                <Badge className="w-fit" variant={account.isActive ? 'secondary' : 'outline'}>
                  {account.accountStatus}
                </Badge>
              </div>
              <DetailGrid
                items={[
                  ['Email', account.email],
                  ['Phone', account.phoneNumber],
                  ['Role', roleLabels[account.role]],
                  ['Identifier', identifierForAccount(account)],
                  ['Password change', account.passwordChangeRequired ? 'Required' : 'Complete'],
                ]}
              />
              <DetailGrid
                items={[
                  [
                    'Department',
                    account.department
                      ? `${account.department.name} (${account.department.code})`
                      : undefined,
                  ],
                  [
                    'Program',
                    account.program
                      ? `${account.program.name} (${account.program.code})`
                      : undefined,
                  ],
                  ['Batch', account.batch?.name],
                  [
                    'Semester',
                    account.semester
                      ? `${account.semester.name} (${account.semester.academicYear})`
                      : undefined,
                  ],
                  ['Section', account.section?.name],
                  ['Academic status', account.academicStatus],
                  ['Designation', account.designation],
                ]}
              />
            </div>
          </ScrollArea>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function DetailGrid({ items }: { items: Array<[string, string | undefined]> }) {
  return (
    <dl className="grid gap-3 rounded-md border p-4">
      {items.map(([label, value]) => (
        <div key={label} className="grid gap-1">
          <dt className="text-muted-foreground text-xs font-medium">{label}</dt>
          <dd className="text-foreground text-sm">{value || '-'}</dd>
        </div>
      ))}
    </dl>
  )
}
