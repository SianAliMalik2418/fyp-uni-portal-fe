import { Component, lazy, Suspense, type ReactNode } from 'react'
import { PortalSkeleton } from '../components/PortalSkeleton'
import { useParams } from 'react-router-dom'
import { ShieldUserIcon, UserIcon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { PlaceholderModule } from '@/features/portal/components/PlaceholderModule'
import { FloatingChatbot } from '@/features/portal/components/FloatingChatbot'
import { PortalHeader } from '@/features/portal/components/PortalHeader'
import { PortalSidebar } from '@/features/portal/components/PortalSidebar'
import { UnauthorizedSection } from '@/features/portal/components/UnauthorizedSection'
import { roleNavigation } from '@/features/portal/constants/portal-navigation'
import type { NavItem } from '@/features/portal/types/portal.types'

const AcademicStructurePage = lazy(() =>
  import('@/features/academic-structure/pages/AcademicStructurePage').then((module) => ({
    default: module.AcademicStructurePage,
  }))
)
const AttendancePage = lazy(() =>
  import('@/features/academic-performance/pages/AttendancePage').then((module) => ({
    default: module.AttendancePage,
  }))
)
const AnnouncementsPage = lazy(() =>
  import('@/features/announcements/pages/AnnouncementsPage').then((module) => ({
    default: module.AnnouncementsPage,
  }))
)
const AuditLogsPage = lazy(() =>
  import('@/features/audit-logs/pages/AuditLogsPage').then((module) => ({
    default: module.AuditLogsPage,
  }))
)
const AssessmentsPage = lazy(() =>
  import('@/features/academic-performance/pages/AssessmentsPage').then((module) => ({
    default: module.AssessmentsPage,
  }))
)
const MarksPage = lazy(() =>
  import('@/features/academic-performance/pages/MarksPage').then((module) => ({
    default: module.MarksPage,
  }))
)
const ResultsPage = lazy(() =>
  import('@/features/academic-performance/pages/ResultsPage').then((module) => ({
    default: module.ResultsPage,
  }))
)
const AcademicSettingsPage = lazy(() =>
  import('@/features/academic-performance/pages/AcademicSettingsPage').then((module) => ({
    default: module.AcademicSettingsPage,
  }))
)
const CourseManagementPage = lazy(() =>
  import('@/features/courses/pages/CourseManagementPage').then((module) => ({
    default: module.CourseManagementPage,
  }))
)
const StudentCoursesPage = lazy(() =>
  import('@/features/courses/pages/StudentCoursesPage').then((module) => ({
    default: module.StudentCoursesPage,
  }))
)
const TeacherCoursesPage = lazy(() =>
  import('@/features/courses/pages/TeacherCoursesPage').then((module) => ({
    default: module.TeacherCoursesPage,
  }))
)
const DepartmentsPage = lazy(() =>
  import('@/features/departments/pages/DepartmentsPage').then((module) => ({
    default: module.DepartmentsPage,
  }))
)
const HodDepartmentPage = lazy(() =>
  import('@/features/departments/pages/HodDepartmentPage').then((module) => ({
    default: module.HodDepartmentPage,
  }))
)
const FeesPage = lazy(() =>
  import('@/features/fees/pages/FeesPage').then((module) => ({ default: module.FeesPage }))
)
const ExamsPage = lazy(() =>
  import('@/features/exams/pages/ExamsPage').then((module) => ({ default: module.ExamsPage }))
)
const ProgramsPage = lazy(() =>
  import('@/features/programs/pages/ProgramsPage').then((module) => ({
    default: module.ProgramsPage,
  }))
)
const StudentDashboardPage = lazy(() =>
  import('@/features/student-dashboard/pages/StudentDashboardPage').then((module) => ({
    default: module.StudentDashboardPage,
  }))
)
const AdminDashboardPage = lazy(() =>
  import('@/features/dashboards/pages/AdminDashboardPage').then((module) => ({
    default: module.AdminDashboardPage,
  }))
)
const HodDashboardPage = lazy(() =>
  import('@/features/dashboards/pages/HodDashboardPage').then((module) => ({
    default: module.HodDashboardPage,
  }))
)
const TeacherDashboardPage = lazy(() =>
  import('@/features/dashboards/pages/TeacherDashboardPage').then((module) => ({
    default: module.TeacherDashboardPage,
  }))
)
const TimetablePage = lazy(() =>
  import('@/features/timetable/pages/TimetablePage').then((module) => ({
    default: module.TimetablePage,
  }))
)
const CurrentUserProfilePage = lazy(() =>
  import('@/features/user-accounts/pages/CurrentUserProfilePage').then((module) => ({
    default: module.CurrentUserProfilePage,
  }))
)
const UserAccountsPage = lazy(() =>
  import('@/features/user-accounts/pages/UserAccountsPage').then((module) => ({
    default: module.UserAccountsPage,
  }))
)
const HodTeachersPage = lazy(() =>
  import('@/features/user-accounts/pages/HodTeachersPage').then((module) => ({
    default: module.HodTeachersPage,
  }))
)

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
    (user.role === 'student' || user.role === 'teacher' || user.role === 'hod')
  )
}

function portalModuleFor(user: PortalUser, activeItem: NavItem) {
  if (activeItem.id === 'profile') {
    return <CurrentUserProfilePage />
  }

  if (user.role === 'student' && activeItem.id === 'dashboard') {
    return <StudentDashboardPage user={user} />
  }

  if (user.role === 'teacher' && activeItem.id === 'dashboard') {
    return <TeacherDashboardPage user={user} />
  }

  if (user.role === 'hod' && activeItem.id === 'dashboard') {
    return <HodDashboardPage user={user} />
  }

  if (user.role === 'admin' && activeItem.id === 'dashboard') {
    return <AdminDashboardPage user={user} />
  }

  if (user.role === 'admin' && activeItem.id === 'audit-log') {
    return <AuditLogsPage />
  }

  if (user.role === 'hod' && activeItem.id === 'department') {
    return <HodDepartmentPage />
  }

  if (user.role === 'hod' && activeItem.id === 'teachers') {
    return <HodTeachersPage />
  }

  if (isAdminAccountSection(user, activeItem.id)) {
    return (
      <UserAccountsPage key={activeItem.id} sectionId={activeItem.id} title={activeItem.label} />
    )
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

  if (user.role === 'admin' && activeItem.id === 'academic-settings') {
    return <AcademicSettingsPage title={activeItem.label} />
  }

  if (user.role === 'teacher' && activeItem.id === 'assessments') {
    return <AssessmentsPage title={activeItem.label} />
  }

  if (user.role === 'teacher' && activeItem.id === 'marks') {
    return <MarksPage title={activeItem.label} />
  }

  if (activeItem.id === 'results') {
    return <ResultsPage title={activeItem.label} user={user} />
  }

  if (activeItem.id === 'fees' && (user.role === 'admin' || user.role === 'student')) {
    return <FeesPage user={user} />
  }

  if (
    (activeItem.id === 'timetable' && (user.role === 'student' || user.role === 'teacher')) ||
    (activeItem.id === 'timetables' && user.role === 'admin')
  ) {
    return <TimetablePage title={activeItem.label} user={user} />
  }

  if (
    activeItem.id === 'exams' &&
    (user.role === 'admin' || user.role === 'student' || user.role === 'teacher')
  ) {
    return <ExamsPage title={activeItem.label} user={user} />
  }

  if (activeItem.id === 'announcements') {
    return <AnnouncementsPage title={activeItem.label} user={user} />
  }

  return <PlaceholderModule user={user} item={activeItem} />
}

class PortalModuleBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div
        role="alert"
        className="bg-muted/30 flex flex-col items-center gap-4 rounded-lg border border-dashed px-6 py-10 text-center"
      >
        <div className="grid max-w-md gap-1">
          <p className="text-foreground text-sm font-medium">This page didn&apos;t load</p>
          <p className="text-muted-foreground text-sm">
            Something interrupted it, and your data is safe. Reload the page and try opening this
            section again.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => window.location.reload()}>
          Reload page
        </Button>
      </div>
    )
  }
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
    <main className="bg-muted/20 grid min-h-dvh text-left md:grid-cols-[248px_minmax(0,1fr)]">
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
            <PortalModuleBoundary key={activeItem.id}>
              <Suspense fallback={<PortalSkeleton />}>{portalModuleFor(user, activeItem)}</Suspense>
            </PortalModuleBoundary>
          ) : (
            <UnauthorizedSection user={user} section={activeSection} />
          )}
        </div>
      </section>
      {user.role === 'student' ? <FloatingChatbot /> : null}
    </main>
  )
}
