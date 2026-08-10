import { useParams } from 'react-router-dom'
import { ShieldUserIcon } from '@hugeicons/core-free-icons'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { AdminAccountProvisioning } from '@/features/portal/components/AdminAccountProvisioning'
import { PlaceholderModule } from '@/features/portal/components/PlaceholderModule'
import { PortalHeader } from '@/features/portal/components/PortalHeader'
import { PortalSidebar } from '@/features/portal/components/PortalSidebar'
import { UnauthorizedSection } from '@/features/portal/components/UnauthorizedSection'
import { roleNavigation } from '@/features/portal/constants/portal-navigation'

function isAdminAccountSection(user: PortalUser, sectionId: string) {
  return user.role === 'admin' && (sectionId === 'students' || sectionId === 'teachers')
}

export function PortalPage({ user, onLogout }: { user: PortalUser; onLogout: () => void }) {
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
          {activeItem && isAdminAccountSection(user, activeItem.id) ? (
            <AdminAccountProvisioning item={activeItem} />
          ) : activeItem ? (
            <PlaceholderModule user={user} item={activeItem} />
          ) : (
            <UnauthorizedSection user={user} section={activeSection} />
          )}
        </div>
      </section>
    </main>
  )
}
