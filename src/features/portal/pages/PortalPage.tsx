import { useParams } from 'react-router-dom'
import { ShieldUserIcon, UserIcon } from '@hugeicons/core-free-icons'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { AcademicStructurePage } from '@/features/academic-structure/pages/AcademicStructurePage'
import { AttendancePage } from '@/features/academic-performance/pages/AttendancePage'
import { AssessmentsPage } from '@/features/academic-performance/pages/AssessmentsPage'
import { AssessmentStructureSettingsPage } from '@/features/academic-performance/pages/AssessmentStructureSettingsPage'
import { MarksPage } from '@/features/academic-performance/pages/MarksPage'
import { CourseManagementPage } from '@/features/courses/pages/CourseManagementPage'
import { StudentCoursesPage } from '@/features/courses/pages/StudentCoursesPage'
import { TeacherCoursesPage } from '@/features/courses/pages/TeacherCoursesPage'
import { DepartmentsPage } from '@/features/departments/pages/DepartmentsPage'
import { ProgramsPage } from '@/features/programs/pages/ProgramsPage'
import { StudentDashboardPage } from '@/features/student-dashboard/pages/StudentDashboardPage'
import { CurrentUserProfilePage } from '@/features/user-accounts/pages/CurrentUserProfilePage'
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

function isProgramsSection(user: PortalUser, sectionId: string) {
  return user.role === 'admin' && sectionId === 'programs'
}

function isAcademicStructureSection(user: PortalUser, sectionId: string) {
  return user.role === 'admin' && sectionId === 'academic-structure'
}

function isCoursesSection(user: PortalUser, sectionId: string) {
  return (
    sectionId === 'courses' &&
    (user.role === 'admin' ||
      user.role === 'hod' ||
      user.role === 'student' ||
      user.role === 'teacher')
  )
}

function isAttendanceSection(user: PortalUser, sectionId: string) {
  return (
    sectionId === 'attendance' &&
    (user.role === 'student' ||
      user.role === 'teacher' ||
      user.role === 'hod' ||
      user.role === 'admin')
  )
}

function portalModuleFor(user: PortalUser, activeItem: NavItem) {
  if (activeItem.id === 'profile') {
    return <CurrentUserProfilePage />
  }

  if (user.role === 'student' && activeItem.id === 'dashboard') {
    return <StudentDashboardPage user={user} />
  }

  if (isAdminAccountSection(user, activeItem.id)) {
    return <UserAccountsPage sectionId={activeItem.id} title={activeItem.label} />
  }

  if (isDepartmentsSection(user, activeItem.id)) {
    return <DepartmentsPage title={activeItem.label} />
  }

  if (isProgramsSection(user, activeItem.id)) {
    return <ProgramsPage title={activeItem.label} />
  }

  if (isAcademicStructureSection(user, activeItem.id)) {
    return <AcademicStructurePage title={activeItem.label} />
  }

  if (isCoursesSection(user, activeItem.id)) {
    if (user.role === 'student') {
      return <StudentCoursesPage title={activeItem.label} />
    }

    if (user.role === 'teacher') {
      return <TeacherCoursesPage title={activeItem.label} />
    }

    return <CourseManagementPage title={activeItem.label} user={user} />
  }

  if (isAttendanceSection(user, activeItem.id)) {
    return <AttendancePage title={activeItem.label} user={user} />
  }

  if (user.role === 'admin' && activeItem.id === 'assessment-structure') {
    return <AssessmentStructureSettingsPage title={activeItem.label} />
  }

  if (user.role === 'teacher' && activeItem.id === 'assessments') {
    return <AssessmentsPage title={activeItem.label} />
  }

  if (user.role === 'teacher' && activeItem.id === 'marks') {
    return <MarksPage title={activeItem.label} />
  }

  return <PlaceholderModule user={user} item={activeItem} />
}

export function PortalPage({ user, onLogout }: { user: PortalUser; onLogout: () => void }) {
  const params = useParams()
  const activeSection = params.sectionId ?? 'dashboard'
  const navigation = roleNavigation[user.role]
  const profileItem = { id: 'profile', label: 'Account profile', icon: UserIcon }
  const activeItem =
    activeSection === 'profile' ? profileItem : navigation.find((item) => item.id === activeSection)
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
