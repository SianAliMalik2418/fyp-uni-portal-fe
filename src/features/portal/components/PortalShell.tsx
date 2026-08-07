import { useParams } from 'react-router-dom'
import { ShieldUserIcon } from '@hugeicons/core-free-icons'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { roleNavigation } from '@/features/portal/constants/portal-navigation'
import { PlaceholderModule } from './PlaceholderModule'
import { PortalHeader } from './PortalHeader'
import { PortalSidebar } from './PortalSidebar'
import { UnauthorizedSection } from './UnauthorizedSection'

export function PortalShell({ user, onLogout }: { user: PortalUser; onLogout: () => void }) {
  const params = useParams()
  const activeSection = params.sectionId ?? 'dashboard'
  const navigation = roleNavigation[user.role]
  const activeItem = navigation.find((item) => item.id === activeSection)
  const isAuthorized = Boolean(activeItem)
  const displayItem = activeItem ?? {
    id: 'unauthorized',
    label: 'Unauthorized',
    icon: ShieldUserIcon,
  }

  return (
    <main className="bg-muted/20 grid min-h-svh text-left md:grid-cols-[248px_minmax(0,1fr)]">
      <PortalSidebar user={user} />

      <section className="min-w-0">
        <PortalHeader
          displayItem={displayItem}
          isAuthorized={isAuthorized}
          user={user}
          onLogout={onLogout}
        />

        <div className="p-4 md:p-6">
          {activeItem ? (
            <PlaceholderModule user={user} item={activeItem} />
          ) : (
            <UnauthorizedSection user={user} section={activeSection} />
          )}
        </div>
      </section>
    </main>
  )
}
