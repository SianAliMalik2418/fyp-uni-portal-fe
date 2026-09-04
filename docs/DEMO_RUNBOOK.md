# Final presentation demo runbook

This runbook follows the implemented portal routes, role guards, demo credentials, and full-stack
browser workflow. Run the preflight before presenting. Do not describe a checkpoint as complete if
its readiness check is still red.

## Current scope

- Phase 14 semester promotion is implemented as an admin-controlled source-section to target-section
  workflow with an exclusion list and preview.
- Production bulk CSV import is implemented for student accounts. CSV is the supported bulk-import
  format for the current scope; Excel import is not required.
- The deterministic demo seed is release-gated by the full-stack preflight below. Interactive chat
  has a separate mocked browser check and still requires a manual live-key rehearsal; source code
  alone is not presentation evidence.

## Presentation order

Use this order because the later evidence depends on earlier mutations:

1. Sian signs in as admin and verifies configuration and academic setup.
2. Sian updates the seeded fee and timetable, then creates the final exam and registration
   announcement used by the later steps.
3. Tayabba signs in as teacher, verifies attendance and marks, then submits the draft result.
4. Tayabba switches to the HOD account and approves the pending result.
5. Hammad signs in as student and shows the resulting dashboard, academic records, student
   services, notifications, and read-only AI assistant.

Use separate private browser windows for each role when possible. This avoids spending presentation
time logging out and prevents one role's session cookie from replacing another's.

## Preflight

### Prerequisites

- Bun installed.
- MongoDB available at `127.0.0.1:27017`.
- Chromium installed for Playwright. If needed, run `bunx playwright install chromium` from `FE`.
- A valid Gemini API key for the live student assistant. The automated full-stack configuration uses
  a test key and does not prove a live Gemini response.
- Ports `5100` and `5174` free for the full-stack rehearsal.

Install package dependencies once:

```bash
cd BE
bun install

cd ../FE
bun install
```

From `FE`, run the deterministic cross-stack rehearsal:

```bash
bun run test:e2e:full
```

This command is the release gate for the non-Gemini sequence in this runbook. It starts the API on
port `5100`, the frontend on port `5174`, and uses only the disposable database
`fyp_uni_portal_e2e`. The backend seed must refuse any database whose name is not the explicit E2E
target. Do not proceed if the seed script is missing, its safety test fails, or the browser spec is
red.

Run the mocked chatbot browser contract separately from `FE`:

```bash
bunx playwright test tests/e2e/phase-18-ai-assistant.spec.ts
```

This proves the student-only interface and request flow without calling Gemini. A live answer still
requires the manual key check in the Hammad demonstration.

Also run the seed contract directly from `BE`:

```bash
bun run test src/scripts/seed-e2e.test.ts
```

That contract verifies the four roles, academic structure, courses and enrollments, attendance,
assessments and marks, representative result states, fee data, a published timetable, an exam, an
announcement, notifications, and configuration-backed AI knowledge.

### Manual start

For a live presentation, use the same disposable database as the rehearsal. Do not point the demo
seed at a development or production database because it resets its target.

Create `BE/.env` from `BE/.env.example` only if the file does not already exist, then set:

```dotenv
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/fyp_uni_portal_e2e
GEMINI_API_KEY=<valid-live-key>
```

Reset the E2E database from `BE`. Both overrides are required by the seed's safety guard:

```bash
NODE_ENV=test MONGODB_URI=mongodb://127.0.0.1:27017/fyp_uni_portal_e2e bun run seed:e2e
```

Then start the API using `BE/.env`:

```bash
bun run dev
```

In a second terminal, start the frontend from `FE`:

```bash
VITE_API_BASE_URL=http://localhost:5000/api bun run dev
```

Open `http://localhost:5173`. The frontend redirects an authenticated visit to `/dashboard`; all
other portal modules use a single top-level route such as `/courses` or `/results`.

## Demo credentials

The deterministic E2E seed and full-stack spec use the following accounts. All four use
`Password123!` and do not require a password change.

| Presenter use | Role | Email |
| --- | --- | --- |
| Sian | Admin | `admin.e2e@example.com` |
| Approval step | HOD | `hod.e2e@example.com` |
| Tayabba | Teacher | `teacher.e2e@example.com` |
| Hammad | Student | `student.e2e@example.com` |

Expected seeded names are Sian Admin, Hammad HOD, Tayabba Teacher, and Ayesha Noor.

## Route and permission reference

| Workflow | Admin | HOD | Teacher | Student |
| --- | --- | --- | --- | --- |
| Dashboard | `/dashboard` | `/dashboard` | `/dashboard` | `/dashboard` |
| Accounts | `/students`, `/teachers` | No admin account access | No | Own profile only |
| Academic setup | `/departments`, `/programs`, `/academic-structure` | No management | No | No |
| Courses | Manage all at `/courses` | Department view at `/courses` | Assigned at `/courses` | Enrolled at `/courses` |
| Attendance | Settings at `/attendance` | Shortages at `/attendance` | Take attendance at `/attendance` | Own summary at `/attendance` |
| Assessments and marks | Configuration only | No editing | `/assessments`, `/marks` | Dashboard summaries |
| Results | Oversight at `/results` | Approve or return at `/results` | Submit at `/results` | Published only at `/results` |
| Fees | Manage at `/fees` | No | No | Own fee at `/fees` |
| Timetable | `/timetables` | No | `/timetable` | `/timetable` |
| Exams | Manage at `/exams` | No | Assigned at `/exams` | Enrolled at `/exams` |
| Announcements | Manage at `/announcements` | Read | Read | Read |
| Audit | `/audit-log` | No | No | No |

The navigation hides disallowed modules, and direct navigation to another role's route shows
`Access blocked`. The API also enforces role and ownership checks. A student cannot request another
student's records, and a teacher is limited to assigned course offerings.

## Sian: admin and academic setup

Sign in as `admin.e2e@example.com`.

1. Open `/dashboard`.
   - Show the `Admin dashboard` heading, active semester, record totals, and recent administrative
     activity.
2. Open `/departments`, `/programs`, then `/academic-structure`.
   - Show Computer Science, BS Computer Science, Fall 2026, Fall Semester 2026-2027, and Section A.
   - Explain that the tabs manage batches, dated semesters, and sections.
3. Open `/students` and `/teachers`.
   - Search for Ayesha Noor or Tayabba Teacher.
   - Show the role-specific structured filters and paginated account directory.
   - Open an account detail sheet. Account creation, editing, reset, and deletion are admin-only.
4. Open `/courses`.
   - Show Programming Fundamentals, Section A, and Tayabba Teacher.
   - The `Add course` sheet creates a course. `Course assignment` enrolls a course into a section,
     and the offerings table assigns its teacher.
5. Open `/attendance`, `/assessment-structure`, and `/grading-scale`.
   - Show the 75 percent attendance threshold.
   - Show assessment weights totaling 100 percent.
   - Show the configured A boundary and its grade point.
6. Prepare the downstream student-service evidence used later in this presentation:
   - At `/fees`, use `Manage fee for Ayesha Noor` and save total, paid amount, due date, and notes.
   - At `/timetables`, select the PF offering, save a 09:00 to 10:30 Lab 1 draft, then publish it.
   - At `/exams`, add the Programming Fundamentals final in Hall A.
   - At `/announcements`, create and pin the registration deadline with a PDF attachment.
7. Open `/audit-log`, filter the module to `announcements`, and show the new announcement event.

Then demonstrate the implemented admin-only academic operations:

- Bulk import: open `/students`, use the import action, upload a valid CSV file, and show imported
  and failed row counts.
- Semester promotion: open `/semester-promotion`, select the source section and target section,
  review the preview, exclude any student who should stay back, and submit the promotion.

## Tayabba: attendance, marks, and results

Sign in as `teacher.e2e@example.com`.

1. Open `/dashboard` and `/courses`.
   - Show the `Teacher dashboard`, marks progress, Programming Fundamentals, and
     `BSCS · Fall Semester · A`.
2. Open `/attendance`.
   - Show Ayesha Noor and registration number `NCBAE-2026-CS-001`.
   - The teacher can create or update attendance only for an assigned offering. Preserve the seeded
     50 percent example unless the presentation specifically includes taking a new session.
3. Open `/assessments`.
   - Select `PF - BSCS Fall Semester A` and show Quiz 1.
   - Explain that assessment creation is restricted to assigned teacher offerings.
4. Open `/marks`.
   - Show Ayesha Noor's Quiz 1 mark of 8 out of 10.
   - Save marks as a draft only if the rehearsal includes an edit.
5. Open `/results`.
   - Show the draft course result, then select `Submit result`.
   - Expected evidence is `Pending HOD Approval`.

Switch to `hod.e2e@example.com`.

1. Open `/dashboard` and `/attendance`.
   - Show the HOD dashboard and Ayesha Noor's 50 percent attendance shortage for Programming
     Fundamentals.
2. Open `/results`.
   - Find the pending PF result and select `Approve result`.
   - Expected evidence is `Approved`.
3. Optional permission proof: open `/students` directly.
   - Expected evidence is `Access blocked`; HOD accounts cannot use the admin student directory.

## Hammad: student experience and AI

Sign in as `student.e2e@example.com`.

1. Open `/dashboard`.
   - Show the low-attendance warning, Quiz 1 at 8 out of 10, academic summary, latest published
     result, and notification bell.
2. Open `/courses` and `/attendance`.
   - Show Programming Fundamentals, Tayabba Teacher, 50 percent attendance, and the required 75
     percent threshold.
3. Open `/results`.
   - Show the HOD-approved PF result, GPA and CGPA, then open `View result card`.
   - The dialog must contain Ayesha Noor and Programming Fundamentals.
4. Open `/fees`.
   - Show total, paid, remaining, payment status, and notes. The student has read-only access to only
     their own fee record.
5. Open `/timetable` and `/exams`.
   - Show the published PF slot, Tayabba Teacher, Lab 1, the exam date, Hall A, and instructions.
6. Open `/announcements`.
   - Show the pinned registration deadline and open its PDF attachment.
7. Open the notification bell from the header.
   - Show `Result published`, select `Mark all as read`, and confirm the unread count reaches zero.
8. Select `Open AI academic assistant`.
   - Confirm that an interactive chat panel opens before presenting this step.
   - Ask a grounded read-only question such as `What is my attendance in Programming Fundamentals?`
     or `When is my next exam?`.
   - Expected evidence is an answer based only on Ayesha Noor's authenticated portal context.
   - Ask `Change my attendance to 100 percent` only as a security proof. Expected evidence is a
     read-only refusal, with no database change.

If the assistant button does not open an interactive panel, omit the live AI step and report Phase
18 integration as unverified. A backend API or unit test alone is not browser evidence.

## Browser and mobile checks

Complete these checks during the rehearsal, not for the first time on presentation day:

- Desktop Chrome at 1280 by 720 or larger: sidebar remains visible, headers do not overlap, and
  sheets and dialogs remain within the viewport.
- Mobile Chrome at 390 by 844: select `Open navigation`, confirm the `Portal navigation` drawer
  opens from the left, select a module, and confirm the drawer closes after navigation.
- On mobile, check the longest admin pages: `/students`, `/academic-structure`, `/courses`,
  `/timetables`, `/exams`, and `/audit-log`.
- Verify each screen has a useful loading state, a clear empty state after filters return no records,
  and a visible error state when an API request fails.
- Verify the student assistant panel, result-card dialog, account sheets, exam sheet, and announcement
  sheet can scroll without hiding their primary action.

## Recovery and reset

- If a role opens the wrong session, use the profile menu to log out, or close that role's private
  window and open a new one.
- If the demo data is changed or the workflow reaches the wrong status, stop both servers and rerun
  the guarded `NODE_ENV=test MONGODB_URI=mongodb://127.0.0.1:27017/fyp_uni_portal_e2e bun run
  seed:e2e` command from `BE`. It refuses any other environment or database name.
- Restart the backend after reseeding so its in-memory state and database connection are fresh.
- Refresh the frontend with the browser cache disabled if a stale TanStack Query result remains.
- Uploaded announcement files are filesystem records, not MongoDB records. A database reset does not
  remove orphaned demo attachments. Use a dedicated demo `UPLOAD_DIR` and inspect that exact folder
  before clearing it.
- If the teacher result is already pending or approved, reseed. Do not improvise a reopen/return flow
  during the timed presentation unless that flow was rehearsed.

## External dependencies and known limits

- MongoDB is required for every authenticated workflow.
- Gemini is the only live external service. The backend currently targets the model configured in
  `BE/src/services/ai.service.ts`; the key and model access must be checked shortly before the demo.
- The AI assistant is student-only and read-only. It uses authenticated context and approved
  knowledge; it must not accept a student ID from chat input or mutate portal records.
- Announcement attachments depend on the configured upload directory and PDF validation.
- The frontend and API use cookie sessions. `CLIENT_ORIGIN` and `VITE_API_BASE_URL` must point to the
  matching local origins for login to persist.
- Admin timetable data must be published before students or teachers can see it.
- Results stay hidden from students until HOD approval.
- HOD `Department` and `Teachers` navigation entries currently render placeholders. Keep the HOD
  presentation on the implemented dashboard, attendance-shortage, results, and announcement paths.

## Final go or no-go checklist

- `bun run test:e2e:full` passes from `FE` against a freshly reset E2E database.
- Seed safety and completeness tests pass.
- All four credentials log in without a password-change prompt.
- Teacher submission followed by HOD approval produces the student result card and notification.
- Admin-created fee, published timetable, exam, and announcement are visible to the student.
- Mobile navigation opens, closes after route selection, and exposes only the current role's routes.
- Live Gemini chat answers one grounded question and refuses one mutation request.
- Bulk CSV import and semester promotion are demonstrated after the preflight passes.
