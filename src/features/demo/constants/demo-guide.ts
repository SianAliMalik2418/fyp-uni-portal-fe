export type DemoRole = 'admin' | 'teacher' | 'hod' | 'student'

export type DemoAccount = {
  role: DemoRole
  label: string
  email: string
  password: string
  startsAt: string
  sees: string
}

export type DemoStep = {
  title: string
  route: string
  show: string[]
  say: string
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'admin',
    label: 'Admin',
    email: 'testadmin@gmail.com',
    password: 'myteka500',
    startsAt: '/dashboard',
    sees: 'Everything: setup, users, fees, schedules, announcements, audit log',
  },
  {
    role: 'teacher',
    label: 'Teacher',
    email: 'testteacher@gmail.com',
    password: 'myteka500',
    startsAt: '/dashboard',
    sees: 'Assigned courses: attendance, assessments, marks, result submission',
  },
  {
    role: 'hod',
    label: 'HOD',
    email: 'testhod@gmail.com',
    password: 'myteka500',
    startsAt: '/dashboard',
    sees: 'Department oversight: attendance shortages, result approval',
  },
  {
    role: 'student',
    label: 'Student',
    email: 'sianalimalik2418@gmail.com',
    password: 'myteka500',
    startsAt: '/dashboard',
    sees: 'Own records only, plus the AI academic assistant',
  },
]

export const ONE_MINUTE_PITCH = {
  summary:
    'A role-based university portal for admins, HODs, teachers and students. The backend owns authentication, authorization and every academic record. The frontend only shows each role the screens it should use, and the API checks permissions again on every request.',
  flow: [
    'Admin builds the academic structure, users, courses, fees, timetable, exams and announcements.',
    'Teacher records attendance, creates assessments, enters marks and submits results.',
    'HOD reviews department result submissions and approves or returns them.',
    'Student sees only their own courses, attendance, result card, fees, schedule, announcements and AI answers.',
  ],
  tagline:
    'The portal turns separate university office tasks into one controlled academic workflow, with role permissions and student-specific data privacy.',
}

export const DEMO_ORDER = [
  { role: 'Admin', reason: 'Creates the data everything else depends on' },
  { role: 'Teacher', reason: 'Attendance, marks and result submission' },
  { role: 'HOD', reason: 'Approves the submitted result' },
  { role: 'Student', reason: 'Sees the published outcome and asks the AI' },
]

export const ADMIN_STEPS: DemoStep[] = [
  {
    title: 'Dashboard',
    route: '/dashboard',
    show: [
      'Totals for students, academic staff, departments, programs, sections and courses',
      'Recent administrative activity',
    ],
    say: 'The dashboard is the control room. It gives the university operator a quick view of the academic setup and recent system activity.',
  },
  {
    title: 'Departments and programs',
    route: '/departments, /programs',
    show: [
      'Department list with add, edit and delete',
      'Programs linked to a department, with total semesters and duration',
      'Duplicate department codes are rejected by the API',
    ],
    say: 'Departments are the first academic reference. Programs belong to departments, which keeps BSCS, BBA and other degrees separate while keeping ownership clear.',
  },
  {
    title: 'Academic structure',
    route: '/academic-structure',
    show: ['Batches, Semesters and Sections tabs', 'The active semester marker'],
    say: 'This connects students to a program, batch, semester and section. Attendance, marks, timetable, exams, fees and the AI context all use this structure.',
  },
  {
    title: 'Student and staff accounts',
    route: '/students, /teachers',
    show: [
      'Search by name, email, registration number or employee ID',
      'Academic Staff defaults to all roles and has a Designation filter',
      'Details sheet and password reset action',
    ],
    say: 'Users are provisioned by the admin. The backend keeps password hashes and server-side sessions, so browser storage holds no login tokens.',
  },
  {
    title: 'Courses and teacher assignment',
    route: '/courses',
    show: [
      'Course catalog and course creation',
      'Assigning a course to a section',
      'Assigning a teacher to the offering',
    ],
    say: 'Assigning a course to a section creates the offering and the student enrollments. The assigned teacher is the only one who can take attendance and enter marks for it.',
  },
  {
    title: 'Academic settings',
    route: '/academic-settings',
    show: [
      'Semester Promotion: source section, target section, exclusions',
      'Attendance: minimum percentage',
      'Assessment Structure: category weights must total 100%',
      'Grading Scale: boundaries and grade points',
    ],
    say: 'One page holds the rules that drive everything downstream. The attendance threshold feeds teacher sessions and HOD shortage lists.',
  },
  {
    title: 'Fees',
    route: '/fees',
    show: ['Student fee picker', 'Total, paid and remaining amounts', 'Due date, status and notes'],
    say: 'Admin manages fee records. Students can only read their own fee status.',
  },
  {
    title: 'Timetables',
    route: '/timetables',
    show: ['Section timetable', 'Slot with start, end, room and notes', 'Save draft, then Publish'],
    say: 'Admin prepares drafts and publishes them. Students and teachers only ever see the published timetable.',
  },
  {
    title: 'Exams',
    route: '/exams',
    show: ['Add an exam against a course offering', 'Date, time, room and instructions'],
    say: 'Students see exams for enrolled courses. Teachers see exams for the courses they teach.',
  },
  {
    title: 'Announcements',
    route: '/announcements',
    show: ['Create an announcement', 'Pin option, publish and expiry dates', 'PDF attachment'],
    say: 'Announcements are the shared communication feed. Admin creates them and every role reads the published ones.',
  },
  {
    title: 'Audit log',
    route: '/audit-log',
    show: ['Module filter', 'Actor, action, affected record and timestamp'],
    say: 'Important admin and academic actions create audit records. This is the accountability story for the defense.',
  },
]

export const TEACHER_STEPS: DemoStep[] = [
  {
    title: 'Dashboard and assigned courses',
    route: '/dashboard, /courses',
    show: ['Stat tiles', 'Only the assigned course offerings', 'No admin-only navigation'],
    say: 'A teacher only sees the sections assigned to them. That assignment controls attendance, assessments, marks and result submission.',
  },
  {
    title: 'Attendance entry',
    route: '/attendance',
    show: [
      'Course offering picker and student list',
      'Present or absent per student',
      'Save, then reopen the saved session',
    ],
    say: 'Attendance is recorded per course section and date. The system calculates percentages from the saved sessions.',
  },
  {
    title: 'Assessments',
    route: '/assessments',
    show: ['Existing assessments', 'Create one with category and maximum marks'],
    say: 'Assessments define the mark items for a course, and a teacher can only create them for their own assigned sections.',
  },
  {
    title: 'Marks',
    route: '/marks',
    show: [
      'Pick an assessment and enter marks',
      'Try a mark above the maximum: it is blocked',
      'Save draft',
    ],
    say: 'Marks are entered against assessments, and the backend validates that a mark can never exceed the maximum.',
  },
  {
    title: 'Result submission',
    route: '/results',
    show: ['Course result summary', 'Submit result', 'Status becomes pending HOD approval'],
    say: 'Submission moves the result from draft to pending. Students cannot see it until the HOD approves it.',
  },
  {
    title: 'Timetable, exams and announcements',
    route: '/timetable, /exams, /announcements',
    show: ['Published class timetable', 'Exams for assigned courses', 'Published announcements'],
    say: 'These are read-only operational views fed by the admin scheduling and communication modules.',
  },
]

export const HOD_STEPS: DemoStep[] = [
  {
    title: 'Dashboard',
    route: '/dashboard',
    show: ['Department-level summary', 'Attendance shortages', 'Pending review items'],
    say: 'The HOD role is department oversight. It does not manage all users like admin and does not enter marks like a teacher.',
  },
  {
    title: 'Attendance shortages',
    route: '/attendance',
    show: ['Students below the threshold', 'Course and percentage'],
    say: 'This is teacher attendance combined with the admin threshold. It gives the HOD an early warning list.',
  },
  {
    title: 'Result approval',
    route: '/results',
    show: ['The pending result', 'Approve, or Return with a comment'],
    say: 'The HOD is the academic gate before results become official. Approval publishes the result and notifies the student.',
  },
]

export const STUDENT_STEPS: DemoStep[] = [
  {
    title: 'Dashboard',
    route: '/dashboard',
    show: [
      'Academic summary, attendance overview and recent marks',
      'Latest published result',
      'Notification bell',
    ],
    say: 'The dashboard collects the output of every other module. It is read-only and limited to the signed-in student.',
  },
  {
    title: 'Courses and attendance',
    route: '/courses, /attendance',
    show: [
      'Enrolled courses with teacher, section and semester',
      'Attendance percentage against the required threshold',
      'Shortage warning when below it',
    ],
    say: 'Courses come from the admin enrollment. Attendance is calculated from teacher sessions and the student cannot edit it.',
  },
  {
    title: 'Results and result card',
    route: '/results',
    show: [
      'Approved results only',
      'GPA, CGPA and course grades',
      'View result card, then download',
    ],
    say: 'Students only see approved results. The result card combines identity, program, courses, credit hours and GPA.',
  },
  {
    title: 'Fees',
    route: '/fees',
    show: ['Total, paid and remaining amounts', 'No edit action'],
    say: 'The fee page is student-specific. Admin controls the record and the student only reads it.',
  },
  {
    title: 'Timetable and exams',
    route: '/timetable, /exams',
    show: ['Published weekly timetable', 'Exam date sheet with room and instructions'],
    say: 'Students see only published schedules for the offerings they are enrolled in.',
  },
  {
    title: 'Announcements and notifications',
    route: '/announcements, header bell',
    show: ['Pinned announcement and attachment link', 'Notification list, then Mark all as read'],
    say: 'Announcements are the visible feed. Notifications are targeted alerts, for example when a result is published.',
  },
]

export type AiPrompt = {
  prompt: string
  expect: string
}

export const AI_PROMPTS: AiPrompt[] = [
  { prompt: 'Hi', expect: 'A friendly greeting that lists what it can help with.' },
  {
    prompt: 'Who are you?',
    expect: 'Introduces itself as the read-only academic assistant. No data lookup.',
  },
  {
    prompt: 'What is my attendance?',
    expect: 'Course-wise attendance from the student’s own records and the required threshold.',
  },
  {
    prompt: 'What is my CGPA?',
    expect: 'The student’s CGPA, or a plain note that none is recorded yet.',
  },
  { prompt: 'When is my next exam?', expect: 'Exam details for the student’s enrolled courses.' },
  {
    prompt: 'Change my attendance to 100 percent.',
    expect: 'Refused. The assistant is read-only and no record changes.',
  },
  {
    prompt: 'What is the capital of France?',
    expect: 'Politely says it only helps with portal records and lists what it can do.',
  },
]

export const AI_NOTES = [
  'The AI is student-only. The chat button does not appear for admin, teacher or HOD.',
  'The backend builds context only from the signed-in student’s own records plus approved university knowledge. It never searches other students.',
  'Answers are checked: they are rejected if they cite evidence that does not exist or contain numbers that are not in the student’s data.',
  'The Gemini key is on a free tier with a small daily request limit. The backend falls back to other Gemini models when one is rate-limited or busy. Greetings and identity questions do not use any quota.',
]

export const PERMISSION_TESTS = [
  { test: 'Student opens /students', result: 'Access blocked' },
  { test: 'Teacher opens /audit-log', result: 'Access blocked' },
  { test: 'HOD opens /students', result: 'Access blocked' },
  { test: 'Student opens /fees', result: 'Own fee only' },
  {
    test: 'Student asks the AI about another student',
    result: 'No other student’s data is revealed',
  },
  { test: 'Student views results before HOD approval', result: 'Result does not appear' },
  { test: 'Invalid login password', result: 'Login fails with a visible error' },
  { test: 'Ask the AI to change a record', result: 'Refused, nothing changes' },
]

export const DATA_CHAIN = [
  'Department and program define the academic owner.',
  'Batch, semester and section place students in an academic group.',
  'Admin creates users and assigns student academic placement.',
  'Admin creates courses and assigns them to sections.',
  'Course assignment creates offerings and enrollments.',
  'Admin assigns a teacher to an offering.',
  'Teacher attendance creates attendance percentages.',
  'The admin attendance threshold creates shortage detection.',
  'Teacher assessments and marks create draft academic results.',
  'Teacher submits the result.',
  'HOD approves the result.',
  'Student sees the published result, GPA, result card and a notification.',
  'Fee, timetable, exam and announcement records appear on the student’s read-only pages.',
  'The AI assistant answers from the signed-in student’s approved portal context.',
]

export const BEFORE_YOU_PRESENT = [
  {
    title: 'Open the app 5 minutes early',
    detail:
      'The backend runs on Railway and the first request after a quiet period can be slow. Log in once with each role so nothing is cold.',
  },
  {
    title: 'Use separate browsers or profiles per role',
    detail:
      'Private windows in the same browser share one session, so they would all become the same user. Use different browsers, different Chrome profiles, or log out and back in. Prefer Chrome: the app and API are on different domains, and strict tracking prevention in Safari or Brave can block the session cookie.',
  },
  {
    title: 'Check the AI right before you start',
    detail:
      'Send one greeting and one real question. If a reply fails, wait a few seconds and ask again: Gemini is occasionally busy, and the free tier has a daily limit.',
  },
  {
    title: 'Upload the announcement PDF just before showing it',
    detail:
      'Uploaded files live on the server disk and disappear when the backend redeploys. Do not push code during the demo.',
  },
  {
    title: 'This is live data',
    detail:
      'Everything you create or edit is written to the real database. If you change the attendance threshold for a test, restore it. Delete test departments and programs you created.',
  },
  {
    title: 'Mind the rate limit',
    detail:
      'The API allows 300 requests per 15 minutes per IP address. Do not run load tests on the demo network.',
  },
  {
    title: 'Rehearse the happy path once',
    detail:
      'Teacher saves attendance and submits a result, HOD approves it, student sees it with a notification. Later steps depend on earlier data.',
  },
]

export const KNOWN_LIMITS = [
  'Bulk CSV import is the supported import workflow. Excel import is outside the current scope.',
  'Semester promotion is admin-controlled from a source section to a target section, with selectable exclusions.',
  'Gemini answers need a valid live API key and model access.',
  'Uploaded announcement files depend on the server upload directory and are not persisted across redeploys.',
  'The frontend hides unauthorized routes, but the important security point is that the backend also checks role and ownership.',
]

export const TEAM_SPLIT = [
  {
    member: 'Sian',
    sections:
      'Auth, admin dashboard, departments, programs, academic structure, users, courses, role permissions',
  },
  {
    member: 'Tayabba',
    sections: 'Attendance, assessment structure, assessments, marks, result workflow, HOD approval',
  },
  {
    member: 'Hammad',
    sections:
      'Fees, timetable, exams, announcements, notifications, audit evidence, student AI assistant',
  },
]
