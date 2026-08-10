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
    readinessDescription: 'The fees workspace is ready for challans, dues, and payment status.',
    nextIntegrationValue: 'Fees API',
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
    readinessDescription: 'The timetable workspace is ready for class slots and room details.',
    nextIntegrationValue: 'Timetable API',
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
    readinessDescription: 'The timetable administration workspace is ready for schedule setup.',
    nextIntegrationValue: 'Timetable API',
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
    readinessDescription: 'The exams workspace is ready for date sheets and exam notices.',
    nextIntegrationValue: 'Exams API',
  },
  materials: {
    stats: {
      student: [
        { label: 'Available files', value: '0' },
        { label: 'Course folders', value: '0' },
        { label: 'New uploads', value: '0' },
      ],
      teacher: [
        { label: 'Uploaded files', value: '0' },
        { label: 'Course folders', value: '0' },
        { label: 'Draft uploads', value: '0' },
      ],
    },
    emptyStates: {
      student: {
        emptyTitle: 'No course materials available yet.',
        emptyDescription: 'Lecture files, handouts, and shared resources will appear here.',
      },
      teacher: {
        emptyTitle: 'No materials uploaded yet.',
        emptyDescription: 'Teacher upload controls will appear after course assignments exist.',
      },
    },
    readinessDescription: 'The materials workspace is ready for course files and upload flows.',
    nextIntegrationValue: 'Materials API',
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
    readinessDescription: 'The announcements workspace is ready for notices and targeting.',
    nextIntegrationValue: 'Announcements API',
  },
}
