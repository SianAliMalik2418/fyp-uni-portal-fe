# Professor presentation and manual test guide

Use this document when presenting the University Portal FYP and when manually testing every implemented workflow. It is written in demo order, because later screens depend on earlier data.

## Keeping this guide current

This guide goes stale the moment a route, nav label, merged page, or removed widget changes and nobody updates it. Treat it like a living doc, not a one-time writeup.

1. Whenever you change portal navigation (`FE/src/features/portal/constants/portal-navigation.ts`), merge or split a page, rename a route, or add/remove a dashboard widget, update the matching section here in the same change — do not leave it for later.
2. Update, in this order: the **Presentation route map** table, the numbered demo step for that module, and the **Known limits** section if the behavior or scope changed.
3. If a whole step is merged into another (like Academic Settings below), merge the content into one step and renumber everything after it so the step numbers stay sequential — do not leave gaps or duplicate numbers.
4. If demo/seed credentials change, update both the **Demo accounts** tables below and `TEST_CREDENTIALS.md` at the repo root together.
5. Before any real presentation, walk the whole guide once against the running app and fix anything that no longer matches — a guide that lies is worse than no guide.

## One-minute project explanation

This app is a role-based university portal for admins, HODs, teachers, and students. The backend owns authentication, authorization, academic records, fees, schedules, announcements, notifications, audit logs, and the student AI assistant context. The frontend gives each role only the screens they should use, but security is still checked again on the API.

The main end-to-end flow is:

1. Admin creates the academic structure, users, courses, fees, timetable, exams, and announcements.
2. Teacher records attendance, creates assessments, enters marks, and submits results.
3. HOD reviews department result submissions and approves or returns them.
4. Student sees only their own courses, attendance, result card, fees, timetable, exams, announcements, notifications, and AI answers.

This is the story to tell professors: the portal turns separate university office tasks into one controlled academic workflow, with role permissions and student-specific data privacy.

## Local app addresses

Use the current local development setup:

| App | URL |
| --- | --- |
| Backend API | `http://localhost:5000/api` |
| Frontend | `http://localhost:5173/` |

Vite falls back to the next free port (5174, 5175, ...) if 5173 is already in use by another running dev server. Use the URL printed by `bun run dev`.

## Demo accounts

### Option A: live demo database (recommended for presenting yourself)

If you already have a seeded demo database running, use the accounts in `TEST_CREDENTIALS.md` at the repo root:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `testadmin@gmail.com` | `myteka500` |
| Teacher | `testteacher@gmail.com` | `myteka500` |
| HOD | `testhod@gmail.com` | `myteka500` |
| Student | `sianalimalik2418@gmail.com` | `myteka500` |

Keep `TEST_CREDENTIALS.md` and this table in sync if the demo database accounts change.

### Option B: deterministic E2E seed

If you run the deterministic E2E seed instead, these are the expected accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin.e2e@example.com` | `Password123!` |
| HOD | `hod.e2e@example.com` | `Password123!` |
| Teacher | `teacher.e2e@example.com` | `Password123!` |
| Student | `student.e2e@example.com` | `Password123!` |

If your live database has different users, keep the same role order. Start with admin, then teacher, then HOD, then student.

## Before the presentation

1. Start the backend from `BE` with `bun run dev`.
2. Start the frontend from `FE` with `bun run dev`.
3. Open the frontend URL.
4. Log in once with each role and confirm no account is stuck on the password-change screen.
5. Confirm MongoDB is connected in the backend logs.
6. Confirm Gemini is configured before showing the live AI assistant.
7. Use separate private browser windows for admin, teacher, HOD, and student if possible.

Present bulk CSV import and semester promotion only after verifying them in the current build.

## Presentation route map

| Workflow | Admin | HOD | Teacher | Student |
| --- | --- | --- | --- | --- |
| Dashboard | `/dashboard` | `/dashboard` | `/dashboard` | `/dashboard` |
| User accounts | `/students`, `/teachers` | Limited teacher view | No | Own profile only |
| Departments and programs | `/departments`, `/programs` | Department view | No | No |
| Academic structure | `/academic-structure` | No | No | No |
| Courses | Manage all at `/courses` | Department course view | Assigned courses | Enrolled courses |
| Semester promotion | `/academic-settings` → Semester Promotion tab | No | No | No |
| Attendance | `/academic-settings` → Attendance tab | Shortages | Take attendance | Own summary |
| Assessment structure | `/academic-settings` → Assessment Structure tab | No | No | No |
| Grading scale | `/academic-settings` → Grading Scale tab | No | No | No |
| Assessments | No direct entry | No editing | Create assessments | Read via results/dashboard |
| Marks | No direct entry | No editing | Enter marks | Read via dashboard/results |
| Results | Oversight | Approve or return | Submit | Published results only |
| Fees | Manage | No | No | Own fee only |
| Timetable | Publish at `/timetables` | No | View at `/timetable` | View at `/timetable` |
| Exams | Manage | No | Assigned exams | Enrolled exams |
| Announcements | Manage | Read | Read | Read |
| Notifications | Header menu | Header menu | Header menu | Header menu |
| AI assistant | No | No | No | Student-only chat |
| Audit log | `/audit-log` | No | No | No |

All admin list screens (Departments, Programs, Courses, Academic Structure tabs, Students, Academic Staff) are paginated with a Previous/Next control, and every table keeps its Actions column visible while scrolling horizontally.

## Part 1: Admin setup and system control

Sign in as admin.

### 1. Dashboard

Open `/dashboard`.

What to show:

- The admin dashboard heading.
- Icon-labeled totals for students, academic staff, departments, programs, sections, and courses.
- Recent administrative activity.

What to say:

The admin dashboard is the control room. It gives the university operator a quick view of current academic setup and recent system activity.

Manual checks:

- Refresh the page. The session should remain active.
- Open navigation. Admin-only modules should be visible.

### 2. Departments

Open `/departments`.

What to show:

- Department list.
- Add department form.
- Edit and delete actions.
- Active/inactive status behavior if available.

What to say:

Departments are the first academic reference. Programs, teachers, courses, HOD scope, and reports depend on them.

Manual checks:

- Create a test department with a unique code.
- Try creating another department with the same code. The API should reject duplicates.
- Edit the department name or description.
- Delete only the test department if no other records depend on it.
- If there are more than 20 departments, confirm the Previous/Next pager works and the Actions column stays visible on the right while scrolling.

### 3. Programs

Open `/programs`.

What to show:

- Program list.
- Department selection.
- Total semesters and duration.

What to say:

Programs belong to departments. This lets the portal separate BSCS, BBA, and other degree structures while keeping department ownership clear.

Manual checks:

- Create a test program linked to a department.
- Confirm it appears in the list.
- Edit the program.
- Confirm validation appears for required fields.

### 4. Academic structure

Open `/academic-structure`.

What to show:

- Batches tab.
- Semesters tab.
- Sections tab.
- Active semester marker.

What to say:

This screen connects students to a specific program, batch, semester, and section. Attendance, marks, timetable, exams, fees, and AI context all use this structure.

Manual checks:

- Add a batch for a program.
- Add or inspect a semester.
- Add a section by selecting program, batch, and semester.
- Confirm dropdowns only show valid related records.
- Switch tabs and confirm each tab paginates its own table independently.

### 5. Student and staff accounts

Open `/students`, then `/teachers`.

What to show:

- Search and filters, including the Designation filter dropdown on the Academic Staff screen.
- Account list, defaulting to all roles (not just Teacher) on Academic Staff.
- Add account form.
- Account details sheet.
- Profile picture URL on teacher profiles.
- Password reset action.

What to say:

Users are admin-provisioned. Students need academic placement. Teachers and HODs need department and employee information. The backend keeps password hashes and server-side sessions, so browser storage does not hold login tokens.

Manual checks:

- Search by name, email, registration number, or employee ID.
- Confirm the Role filter on Academic Staff defaults to "All" and shows both teachers and HODs.
- Open a details sheet and confirm it opens as a right-side panel at a consistent width, not centered.
- Create a temporary test user if needed.
- Reset a test user password and confirm a temporary password is shown.
- Try direct access to `/students` later as HOD or student and confirm it is blocked.

### 6. Courses and teacher assignment

Open `/courses`.

What to show:

- Course catalog.
- Course creation form.
- Section course assignment.
- Teacher assignment for an offering.

What to say:

A course becomes useful after it is assigned to a section. That creates course offerings and student enrollments. Assigning a teacher controls who can take attendance, create assessments, and enter marks for that offering.

Manual checks:

- Add or inspect a course.
- Assign a course to a section.
- Assign a teacher to the course offering.
- Confirm the same offering appears later for the teacher and student.

### 7. Academic settings: semester promotion, attendance, assessment structure, grading scale

Open `/academic-settings`. This page replaces four previously separate admin pages with one page and four tabs.

What to show:

- **Semester Promotion** tab: source section, target section, exclusion list, and the promote action.
- **Attendance** tab: minimum attendance percentage setting.
- **Assessment Structure** tab: assessment category weights and total percentage validation.
- **Grading Scale** tab: grade boundaries and grade points.

What to say:

This single page controls the academic rules that drive everything downstream. Semester promotion moves eligible students to the next semester. The attendance threshold feeds teacher sessions and HOD shortage lists. Assessment weights and the grading scale decide how marks become final results, grades, and GPA.

Manual checks:

- Semester Promotion: select a source and target section, exclude a student, and confirm the promotion preview updates.
- Attendance: change the threshold to a safe test value, save it, then restore the original threshold before the final demo.
- Assessment Structure: confirm weights total 100 percent; try an invalid total and confirm validation blocks it.
- Grading Scale: inspect grade ranges and grade points.
- Confirm switching tabs does not lose unsaved edits unexpectedly, and each tab loads its own data independently.

### 8. Fees

Open `/fees`.

What to show:

- Student fee picker.
- Total fee, paid amount, remaining amount.
- Due date, payment status, notes.

What to say:

Admin manages fee records. Students can only view their own fee status.

Manual checks:

- Select a student.
- Save a fee record.
- Confirm the remaining amount calculates correctly.
- Later, log in as that student and confirm the same values are read-only.

### 9. Timetables

Open `/timetables`.

What to show:

- Section timetable selection.
- Course offering slot fields.
- Save draft.
- Publish timetable.

What to say:

Admin prepares weekly timetable drafts and publishes them. Students and teachers only see the published timetable, not drafts.

Manual checks:

- Select a section.
- Add a course slot with start time, end time, room, and notes.
- Save draft.
- Publish.
- Confirm the slot appears later for teacher and student.

### 10. Exams

Open `/exams`.

What to show:

- Add exam sheet.
- Course selection.
- Exam date, time, room, and instructions.

What to say:

Exam entries are manually scheduled against course offerings. Students see exams for enrolled courses. Teachers see exams for assigned courses.

Manual checks:

- Create a test exam for a course offering.
- Confirm it appears in the admin exam list.
- Later, confirm the same exam appears for teacher and student.

### 11. Announcements

Open `/announcements`.

What to show:

- Announcement list.
- Create announcement sheet.
- Pin option.
- Publish and expiry dates.
- PDF attachment upload.

What to say:

Announcements are shared communication records. Admin creates them, and all roles can read relevant published announcements.

Manual checks:

- Create a pinned announcement.
- Attach a small PDF.
- Confirm the attachment link is visible.
- Later, confirm HOD, teacher, and student can read it.

### 12. Audit log

Open `/audit-log`.

What to show:

- Audit table.
- Module filter.
- Actor, action, affected record, and timestamp.

What to say:

Important admin and academic actions create audit records. This helps explain accountability during the FYP defense.

Manual checks:

- Filter by `announcements`, `courses`, or `results`.
- Confirm recent actions appear.
- Clear filters and confirm pagination/search still works.

## Part 2: Teacher academic workflow

Sign in as teacher.

### 13. Teacher dashboard and courses

Open `/dashboard`, then `/courses`.

What to show:

- Teacher dashboard with icon-labeled stat tiles.
- Assigned course offerings.
- Course section label.

What to say:

The teacher only sees assigned course sections. This assignment controls attendance, assessments, marks, and result submission.

Manual checks:

- Confirm admin-only routes are hidden.
- Open `/courses` and verify only assigned offerings appear.

### 14. Attendance entry

Open `/attendance`.

What to show:

- Course offering picker.
- Student list.
- Attendance status controls.
- Save attendance action.
- Attendance history if available.

What to say:

The teacher records attendance per course section and date. The system calculates percentages from saved sessions.

Manual checks:

- Select a course offering.
- Mark one student present or absent.
- Save attendance.
- Reopen the saved session and confirm the status is preserved.
- Later, confirm the student percentage and HOD shortage list update.

### 15. Assessments

Open `/assessments`.

What to show:

- Course section selection.
- Existing assessments.
- Create assessment form.
- Maximum marks and category.

What to say:

Assessments define the mark items for a course. A teacher can create assessments only for their own assigned course sections.

Manual checks:

- Select an offering.
- Create a small test assessment.
- Confirm max marks validation.
- Confirm it appears in the list and in marks entry.

### 16. Marks

Open `/marks`.

What to show:

- Assessment picker.
- Student marks table.
- Marks input.
- Draft save action.

What to say:

Marks are entered against assessments. The backend validates that marks cannot exceed maximum marks.

Manual checks:

- Enter a valid mark and save draft.
- Try a mark above maximum and confirm validation blocks it.
- Refresh and confirm saved draft marks still appear.

### 17. Result submission

Open `/results`.

What to show:

- Course result summary.
- Student marks and calculated result.
- Submit result action.
- Pending HOD approval status.

What to say:

Teacher submission changes the result from draft to pending. Students still cannot see it until the HOD approves it.

Manual checks:

- Select the course offering.
- Submit the result.
- Confirm status changes to pending HOD approval.
- Log in as student before HOD approval if you want to prove unpublished results remain hidden.

### 18. Teacher timetable, exams, and announcements

Open `/timetable`, `/exams`, and `/announcements`.

What to show:

- Published class timetable.
- Exams for assigned courses.
- Published announcements.

What to say:

The teacher receives read-only operational information from admin scheduling and communication modules.

Manual checks:

- Confirm timetable slot details match the admin-published slot.
- Confirm exam room and instructions match the admin-created exam.
- Confirm announcements are visible.

## Part 3: HOD approval and oversight

Sign in as HOD.

### 19. HOD dashboard

Open `/dashboard`.

What to show:

- HOD dashboard with icon-labeled stat tiles.
- Department-level summary.
- Attendance shortages.
- Pending academic review items if present.

What to say:

The HOD role is department oversight. It does not manage all users like admin, and it does not enter marks like a teacher.

Manual checks:

- Confirm admin-only navigation is absent.
- Confirm department-scoped data appears.

### 20. Attendance shortage review

Open `/attendance`.

What to show:

- Students below the attendance threshold.
- Course and percentage.

What to say:

This is the result of teacher attendance plus the admin threshold. It gives the HOD an early warning list.

Manual checks:

- Confirm the student changed in the teacher attendance flow appears here if below threshold.
- Change filters if available.

### 21. Result approval

Open `/results`.

What to show:

- Pending result.
- Approve action.
- Return action and comment dialog if available.

What to say:

The HOD is the academic gate before results become official for students. Approval publishes the result and can trigger student notification.

Manual checks:

- Approve the teacher-submitted result.
- Confirm status changes to approved.
- Open `/students` directly and confirm access is blocked.

## Part 4: Student portal experience

Sign in as student.

### 22. Student dashboard

Open `/dashboard`.

What to show:

- Academic summary.
- Attendance overview.
- Recent marks.
- Latest published result.
- Notification bell.

What to say:

The student dashboard collects the final outputs of other modules. It is read-only and limited to the authenticated student.

Manual checks:

- Confirm the student's own name and academic details.
- Confirm no admin or teacher actions are visible.

### 23. Student courses

Open `/courses`.

What to show:

- Enrolled course list.
- Teacher name.
- Course code, title, section, and semester.

What to say:

The courses shown here came from admin course assignment and enrollment creation.

Manual checks:

- Confirm the assigned course appears.
- Confirm unrelated courses do not appear.

### 24. Student attendance

Open `/attendance`.

What to show:

- Course attendance percentage.
- Required threshold.
- Shortage warning if below threshold.

What to say:

The student sees attendance calculated from teacher sessions. They cannot edit it.

Manual checks:

- Confirm the percentage matches the teacher attendance data.
- Confirm there is no save or edit action.

### 25. Student results and result card

Open `/results`.

What to show:

- Approved result only.
- GPA and CGPA.
- Course grades.
- Result card dialog and download action.

What to say:

Students only see approved results. The result card combines student details, course results, credit hours, and GPA.

Manual checks:

- Confirm the HOD-approved result appears.
- Open `View result card`.
- Confirm the dialog contains student name, registration number, program, course, marks, grade, and GPA.
- Try the download action.

### 26. Student fees

Open `/fees`.

What to show:

- Total fee.
- Paid amount.
- Remaining amount.
- Payment status.
- Due date and notes.

What to say:

The fee page is student-specific. Admin controls the record; the student only reads it.

Manual checks:

- Confirm the values match the admin fee record.
- Confirm there is no edit action.

### 27. Student timetable and exams

Open `/timetable`, then `/exams`.

What to show:

- Published weekly timetable.
- Course teacher and room.
- Exam date sheet with room and instructions.

What to say:

Students see only published schedules for their enrolled offerings.

Manual checks:

- Confirm draft timetable changes are not visible until admin publishes.
- Confirm the exam belongs to the student's course.

### 28. Announcements and notifications

Open `/announcements`, then the header notification menu.

What to show:

- Pinned announcement.
- Attachment link.
- Notification list.
- Mark-all-as-read action.

What to say:

Announcements are the visible communication feed. Notifications are targeted alerts generated by important events such as published results.

Manual checks:

- Confirm the created announcement appears.
- Open the attachment link.
- Open notifications.
- Mark all as read and confirm the unread count changes.

### 29. Student AI assistant

Open the floating AI academic assistant.

What to show:

- Chat panel.
- Student-only access.
- Grounded academic answer.
- Read-only refusal.

What to say:

The AI assistant does not search arbitrary student records. The backend builds context from the authenticated student's own profile, courses, attendance, marks, results, fees, timetable, exams, announcements, and approved knowledge records. It should answer from that context and refuse record-changing requests.

Manual checks:

- Ask: `What is my attendance in Programming Fundamentals?`
- Ask: `When is my next exam?`
- Ask: `What fees are pending for me?`
- Ask: `Change my attendance to 100 percent.`
- The last request should be refused. No database record should change.

## Security and permission tests

Run these during rehearsal and keep one or two for the live defense.

| Test | Expected result |
| --- | --- |
| Student opens `/students` | Access blocked |
| Teacher opens `/audit-log` | Access blocked |
| HOD opens `/students` | Access blocked |
| Student opens `/fees` | Own fee only |
| Student asks AI about another student ID | Assistant should not reveal another student's data |
| Teacher tries an unassigned course offering | API should reject or UI should not expose it |
| Student views results before HOD approval | Result should not appear |
| Invalid login password | Login fails with a visible error |
| Inactive user login | Login is rejected |

## Full end-to-end data chain

Use this chain when professors ask how modules connect:

1. Department and program define the academic owner.
2. Batch, semester, and section place students in an academic group.
3. Admin creates users and assigns student academic placement.
4. Admin creates courses and assigns them to sections.
5. Course assignment creates offerings and enrollments.
6. Admin assigns a teacher to an offering.
7. Teacher attendance creates attendance percentages.
8. Admin attendance threshold creates shortage detection.
9. Teacher assessments and marks create draft academic results.
10. Teacher submits the result.
11. HOD approves the result.
12. Student sees published result, GPA, result card, and notification.
13. Admin fee, timetable, exam, and announcement records appear in student read-only pages.
14. AI assistant answers using the authenticated student's approved portal context.

## What each team member can explain

| Member | Best demo sections |
| --- | --- |
| Sian | Auth, admin dashboard, departments, programs, academic structure, users, courses, role permissions |
| Tayabba | Attendance, assessment structure, assessments, marks, result workflow, HOD approval |
| Hammad | Fees, timetable, exams, announcements, notifications, audit evidence, student AI assistant |

Adjust names if your final presentation ownership differs.

## Known limits to mention honestly

- Bulk CSV import is the supported import workflow; Excel import is outside the current scope.
- Semester promotion is admin-controlled from a source section to a target section with selectable exclusions, under `/academic-settings` → Semester Promotion tab.
- Gemini answers require a valid live API key and model access.
- Uploaded announcement files depend on the configured upload directory.
- The frontend hides unauthorized routes, but the important security point is that the backend also checks role and ownership.

## Final rehearsal checklist

- Backend starts and logs MongoDB connected.
- Frontend opens and points to the correct API base URL.
- Admin can create or inspect academic setup.
- Admin can manage users, courses, fees, timetable, exams, announcements, and audit logs.
- Admin Academic Settings page opens with all four tabs (Semester Promotion, Attendance, Assessment Structure, Grading Scale) working.
- Teacher can see assigned courses only.
- Teacher can save attendance, create assessments, enter marks, and submit results.
- HOD can approve or return submitted results.
- Student can see only approved and own records.
- Student result card opens and downloads.
- Notifications open and mark as read.
- AI assistant answers a grounded question and refuses a mutation request.
- Direct unauthorized routes show access blocked.
- Mobile navigation opens, routes correctly, and closes after selection.
