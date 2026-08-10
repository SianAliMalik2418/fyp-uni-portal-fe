import { useParams } from 'react-router-dom'
import { ShieldUserIcon } from '@hugeicons/core-free-icons'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { DepartmentsPage } from '@/features/departments/pages/DepartmentsPage'
import { StudentDashboardPage } from '@/features/student-dashboard/pages/StudentDashboardPage'
import { UserAccountsPage } from '@/features/user-accounts/pages/UserAccountsPage'
import { PlaceholderModule } from '@/features/portal/components/PlaceholderModule'
import { FloatingChatbot } from '@/features/portal/components/FloatingChatbot'
import { PortalHeader } from '@/features/portal/components/PortalHeader'
import { PortalSidebar } from '@/features/portal/components/PortalSidebar'
import { UnauthorizedSection } from '@/features/portal/components/UnauthorizedSection'
import { roleNavigation } from '@/features/portal/constants/portal-navigation'
import type { NavItem } from '@/features/portal/types/portal.types'

function isAdminAccountSection(user: PortalUser, sectionId: string) {
  return user.role === 'admin' && (sectionId === 'students' || sectionId === 'teachers')
}

function isDepartmentsSection(user: PortalUser, sectionId: string) {
  return user.role === 'admin' && sectionId === 'departments'
}

function portalModuleFor(user: PortalUser, activeItem: NavItem) {
  if (user.role === 'student' && activeItem.id === 'dashboard') {
    return <StudentDashboardPage user={user} />
  }

  if (isAdminAccountSection(user, activeItem.id)) {
    return <UserAccountsPage sectionId={activeItem.id} title={activeItem.label} />
  }

  if (isDepartmentsSection(user, activeItem.id)) {
    return <DepartmentsPage title={activeItem.label} />
  }

  return <PlaceholderModule user={user} item={activeItem} />
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
          {activeItem ? (
            portalModuleFor(user, activeItem)
          ) : (
            <UnauthorizedSection user={user} section={activeSection} />
          )}
        </div>
      </section>
      {user.role === 'student' ? <FloatingChatbot /> : null}
    </main>
  )
}
