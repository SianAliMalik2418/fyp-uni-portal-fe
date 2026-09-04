import type { PortalUser } from '@/features/auth/types/auth.types'
import type { NavItem } from '@/features/portal/types/portal.types'
import { roleLabels } from '@/shared/constants/user-roles'
import { ProfileMenu } from './ProfileMenu'
import { NotificationMenuContainer } from '@/features/notifications/components/NotificationMenuContainer'
import { PortalMobileNavigation } from './PortalMobileNavigation'

export function PortalHeader({
  displayItem,
  isAuthorized,
  user,
  onLogout,
}: {
  displayItem: Pick<NavItem, 'label'>
  isAuthorized: boolean
  user: PortalUser
  onLogout: () => void
}) {
  return (
    <header className="border-border bg-background/80 flex min-h-14 items-center justify-between gap-3 border-b px-4">
      <div className="flex min-w-0 items-center gap-2">
        <PortalMobileNavigation user={user} />
        <div className="min-w-0">
          <p className="text-foreground truncate text-sm font-medium">{displayItem.label}</p>
          <p className="text-muted-foreground truncate text-xs">
            {isAuthorized ? `${roleLabels[user.role]} protected area` : 'Access blocked'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <NotificationMenuContainer />
        <ProfileMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  )
}
