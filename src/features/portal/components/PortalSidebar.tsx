import type { PortalUser } from '@/features/auth/types/auth.types'
import { PortalNavigation } from './PortalNavigation'

export function PortalSidebar({ user }: { user: PortalUser }) {
  return (
    <aside className="border-border bg-card sticky top-0 hidden h-dvh border-r md:block">
      <PortalNavigation user={user} />
    </aside>
  )
}
