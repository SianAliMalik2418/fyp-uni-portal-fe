import type { UserRole } from '@/features/auth/types/auth.types'
import type {
  ModulePlaceholderContent,
  ModulePlaceholderDetails,
  ModulePlaceholderStat,
} from '../types/portal.types'

export const modulePlaceholderStats: Record<UserRole, ModulePlaceholderStat[]> = {
  student: [
    { label: 'Active courses', value: '0' },
    { label: 'Attendance alerts', value: '0' },
    { label: 'Pending fees', value: '0' },
  ],
  teacher: [
    { label: 'Assigned courses', value: '0' },
    { label: 'Attendance sheets', value: '0' },
    { label: 'Result drafts', value: '0' },
  ],
  hod: [
    { label: 'Department courses', value: '0' },
    { label: 'Teacher accounts', value: '0' },
    { label: 'Pending approvals', value: '0' },
  ],
  admin: [
    { label: 'Students', value: '0' },
    { label: 'Teachers', value: '0' },
    { label: 'Departments', value: '0' },
  ],
}

export const modulePlaceholderContent: ModulePlaceholderContent = {
  emptyTitle: 'No records yet',
  emptyDescription:
    'Backend data for this module will appear here once the workflow APIs are connected.',
  readinessTitle: 'Module readiness',
  readinessDescription:
    'The page shell, permissions check, and empty state are in place for this area.',
  nextIntegrationLabel: 'Next integration',
  nextIntegrationValue: 'API data',
}

export const academicPerformancePlaceholders: Record<string, ModulePlaceholderDetails> = {
  attendance: {
    stats: {
      student: [
        { label: 'Attendance records', value: '0' },
        { label: 'Shortage alerts', value: '0' },
        { label: 'Courses tracked', value: '0' },
      ],
      teacher: [
        { label: 'Assigned courses', value: '0' },
        { label: 'Pending sheets', value: '0' },
        { label: 'Submitted sessions', value: '0' },
      ],
      hod: [
        { label: 'Sections monitored', value: '0' },
        { label: 'Shortage cases', value: '0' },
        { label: 'Teacher submissions', value: '0' },
      ],
    },
    emptyStates: {
      student: {
        emptyTitle: 'No attendance records available yet.',
        emptyDescription: 'Your course-wise attendance percentages will appear here.',
      },
      teacher: {
        emptyTitle: 'No assigned courses available yet.',
        emptyDescription: 'Attendance sheets will appear after course assignments are available.',
      },
      hod: {
        emptyTitle: 'No attendance summaries available yet.',
        emptyDescription: 'Department shortage and submission summaries will appear here.',
      },
    },
    readinessDescription:
      'The attendance workspace is ready for future tables, percentages, and shortage alerts.',
    nextIntegrationValue: 'Attendance API',
  },
  assessments: {
    stats: {
      teacher: [
        { label: 'Assessment plans', value: '0' },
        { label: 'Quiz slots', value: '0' },
        { label: 'Assignment slots', value: '0' },
      ],
    },
    emptyStates: {
      teacher: {
        emptyTitle: 'No assessment structure available yet.',
        emptyDescription: 'Quiz and assignment setup will appear once course data is connected.',
      },
    },
    readinessDescription: 'The assessment workspace can later hold quiz and assignment forms.',
    nextIntegrationValue: 'Assessment API',
  },
  marks: {
    stats: {
      teacher: [
        { label: 'Marks sheets', value: '0' },
        { label: 'Draft entries', value: '0' },
        { label: 'Submitted entries', value: '0' },
      ],
    },
    emptyStates: {
      teacher: {
        emptyTitle: 'No marks records available yet.',
        emptyDescription: 'Marks tables will appear after assessments and enrolled students exist.',
      },
    },
    readinessDescription: 'The marks workspace can later hold entry tables and submission status.',
    nextIntegrationValue: 'Marks API',
  },
  results: {
    stats: {
      student: [
        { label: 'Published results', value: '0' },
        { label: 'GPA records', value: '0' },
        { label: 'CGPA records', value: '0' },
      ],
      teacher: [
        { label: 'Result drafts', value: '0' },
        { label: 'Submitted results', value: '0' },
        { label: 'Returned results', value: '0' },
      ],
      hod: [
        { label: 'Pending approvals', value: '0' },
        { label: 'Approved results', value: '0' },
        { label: 'Result cards', value: '0' },
      ],
    },
    emptyStates: {
      student: {
        emptyTitle: 'No results available yet.',
        emptyDescription: 'Published result cards, GPA, and CGPA summaries will appear here.',
      },
      teacher: {
        emptyTitle: 'No result drafts available yet.',
        emptyDescription: 'Course result submissions will appear after marks entry is connected.',
      },
      hod: {
        emptyTitle: 'No results awaiting approval.',
        emptyDescription: 'Submitted result approvals will appear here.',
      },
    },
    readinessDescription:
      'The results workspace is ready for result submission, HOD approval, and result cards.',
    nextIntegrationValue: 'Results API',
  },
}
