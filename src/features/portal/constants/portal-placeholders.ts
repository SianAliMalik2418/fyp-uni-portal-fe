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
    { label: 'Academic Staff', value: '0' },
    { label: 'Departments', value: '0' },
  ],
}

export const modulePlaceholderContent: ModulePlaceholderContent = {
  emptyTitle: 'No records yet',
  emptyDescription: 'Your information will show up here once it is available.',
  readinessTitle: "What's coming",
  readinessDescription: 'This area is being prepared and will be available soon.',
  nextIntegrationLabel: 'Coming next',
  nextIntegrationValue: 'Your data',
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
      'Attendance tables, percentages, and shortage alerts will appear here soon.',
    nextIntegrationValue: 'Attendance records',
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
    readinessDescription: 'Quiz and assignment setup will appear here soon.',
    nextIntegrationValue: 'Assessment setup',
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
    readinessDescription: 'Marks entry tables and submission status will appear here soon.',
    nextIntegrationValue: 'Marks entry',
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
    readinessDescription: 'Result submission, approval, and result cards will appear here soon.',
    nextIntegrationValue: 'Results',
  },
}

export const studentServicePlaceholders: Record<string, ModulePlaceholderDetails> = {
  fees: {
    stats: {
      student: [
        { label: 'Outstanding balance', value: '0' },
        { label: 'Paid challans', value: '0' },
        { label: 'Due notices', value: '0' },
      ],
      admin: [
        { label: 'Fee batches', value: '0' },
        { label: 'Pending payments', value: '0' },
        { label: 'Challan drafts', value: '0' },
      ],
    },
    emptyStates: {
      student: {
        emptyTitle: 'No fee information available yet.',
        emptyDescription: 'Fee status, challans, and payment history will appear here.',
      },
      admin: {
        emptyTitle: 'No fee batches available yet.',
        emptyDescription: 'Admin fee setup and student challan records will appear here.',
      },
    },
    readinessDescription: 'Challans, dues, and payment status will appear here soon.',
    nextIntegrationValue: 'Fee details',
  },
  timetable: {
    stats: {
      student: [
        { label: 'Today classes', value: '0' },
        { label: 'Weekly slots', value: '0' },
        { label: 'Room changes', value: '0' },
      ],
      teacher: [
        { label: 'Teaching slots', value: '0' },
        { label: 'Sections', value: '0' },
        { label: 'Room changes', value: '0' },
      ],
    },
    emptyStates: {
      student: {
        emptyTitle: 'No timetable available yet.',
        emptyDescription: 'Your weekly class schedule will appear here.',
      },
      teacher: {
        emptyTitle: 'No teaching timetable available yet.',
        emptyDescription: 'Assigned class slots will appear after timetable setup.',
      },
    },
    readinessDescription: 'Class slots and room details will appear here soon.',
    nextIntegrationValue: 'Class schedule',
  },
  timetables: {
    stats: {
      admin: [
        { label: 'Published schedules', value: '0' },
        { label: 'Draft schedules', value: '0' },
        { label: 'Sections covered', value: '0' },
      ],
    },
    emptyStates: {
      admin: {
        emptyTitle: 'No timetables configured yet.',
        emptyDescription: 'Admin timetable setup and publishing controls will appear here.',
      },
    },
    readinessDescription: 'Schedule setup for the whole department will appear here soon.',
    nextIntegrationValue: 'Class schedule',
  },
  exams: {
    stats: {
      student: [
        { label: 'Upcoming papers', value: '0' },
        { label: 'Date sheets', value: '0' },
        { label: 'Exam notices', value: '0' },
      ],
      teacher: [
        { label: 'Invigilation slots', value: '0' },
        { label: 'Course exams', value: '0' },
        { label: 'Exam notices', value: '0' },
      ],
      admin: [
        { label: 'Published sheets', value: '0' },
        { label: 'Draft sheets', value: '0' },
        { label: 'Exam rooms', value: '0' },
      ],
    },
    emptyStates: {
      student: {
        emptyTitle: 'No exam date sheet available yet.',
        emptyDescription: 'Exam dates, rooms, and timings will appear here.',
      },
      teacher: {
        emptyTitle: 'No exam duties available yet.',
        emptyDescription: 'Course exam and invigilation details will appear here.',
      },
      admin: {
        emptyTitle: 'No exam schedule configured yet.',
        emptyDescription: 'Admin exam date sheet publishing controls will appear here.',
      },
    },
    readinessDescription: 'Date sheets and exam notices will appear here soon.',
    nextIntegrationValue: 'Exam schedule',
  },
  announcements: {
    stats: {
      student: [
        { label: 'Unread notices', value: '0' },
        { label: 'Pinned notices', value: '0' },
        { label: 'Department alerts', value: '0' },
      ],
      teacher: [
        { label: 'Unread notices', value: '0' },
        { label: 'Course notices', value: '0' },
        { label: 'Draft notices', value: '0' },
      ],
      hod: [
        { label: 'Department notices', value: '0' },
        { label: 'Pinned notices', value: '0' },
        { label: 'Draft notices', value: '0' },
      ],
      admin: [
        { label: 'Published notices', value: '0' },
        { label: 'Pinned notices', value: '0' },
        { label: 'Draft notices', value: '0' },
      ],
    },
    emptyStates: {
      student: {
        emptyTitle: 'No announcements available yet.',
        emptyDescription: 'University and department announcements will appear here.',
      },
      teacher: {
        emptyTitle: 'No announcements available yet.',
        emptyDescription: 'Relevant staff and course notices will appear here.',
      },
      hod: {
        emptyTitle: 'No department announcements available yet.',
        emptyDescription: 'Department notices and publishing controls will appear here.',
      },
      admin: {
        emptyTitle: 'No announcements published yet.',
        emptyDescription: 'Admin announcement publishing controls will appear here.',
      },
    },
    readinessDescription: 'Notices for the right audience will appear here soon.',
    nextIntegrationValue: 'Announcements',
  },
}
