import { ShieldUserIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { roleLabels } from '@/shared/constants/user-roles'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function UnauthorizedSection({ user, section }: { user: PortalUser; section: string }) {
  return (
    <Alert variant="destructive" className="max-w-2xl">
      <HugeiconsIcon icon={ShieldUserIcon} strokeWidth={2} />
      <AlertTitle>Unauthorized page</AlertTitle>
      <AlertDescription>
        {roleLabels[user.role]} accounts cannot access "{section}". Use the role navigation to
        return to an allowed area.
      </AlertDescription>
    </Alert>
  )
}
