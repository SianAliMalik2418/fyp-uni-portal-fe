import { useEffect, useState, type ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DIRECTORY_PASSWORD,
  DIRECTORY_STAFF,
  DIRECTORY_STUDENTS,
  UNIVERSITY_SUMMARY,
} from '@/features/demo/constants/demo-directory'
import {
  ADMIN_STEPS,
  AI_NOTES,
  AI_PROMPTS,
  BEFORE_YOU_PRESENT,
  DATA_CHAIN,
  DEMO_ACCOUNTS,
  DEMO_ORDER,
  HOD_STEPS,
  KNOWN_LIMITS,
  ONE_MINUTE_PITCH,
  PERMISSION_TESTS,
  STUDENT_STEPS,
  TEACHER_STEPS,
  TEAM_SPLIT,
  type DemoStep,
} from '@/features/demo/constants/demo-guide'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'

const SECTIONS = [
  { id: 'accounts', label: 'Accounts' },
  { id: 'directory', label: 'Directory' },
  { id: 'pitch', label: 'Pitch' },
  { id: 'flows', label: 'Demo flow' },
  { id: 'ai', label: 'AI assistant' },
  { id: 'security', label: 'Security' },
  { id: 'chain', label: 'Data chain' },
  { id: 'checklist', label: 'Before you present' },
]

function usePageMeta() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Demo guide'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex,nofollow'
    document.head.appendChild(robots)

    return () => {
      document.title = previousTitle
      robots.remove()
    }
  }, [])
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Button type="button" variant="outline" size="xs" onClick={copy} aria-label={`Copy ${label}`}>
      {copied ? 'Copied' : 'Copy'}
    </Button>
  )
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid scroll-mt-20 gap-4">
      <div className="grid gap-1">
        <h2 id={`${id}-title`} className="text-xl font-semibold tracking-tight">
          {title}
        </h2>
        {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

function StepList({ steps }: { steps: DemoStep[] }) {
  return (
    <ol className="grid gap-3">
      {steps.map((step, index) => (
        <li key={step.title}>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground tabular-nums">{index + 1}.</span>
                {step.title}
                <Badge variant="outline" className="font-mono font-normal">
                  {step.route}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="grid gap-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Show
                </p>
                <ul className="list-disc space-y-0.5 pl-5">
                  {step.show.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Say
                </p>
                <p>{step.say}</p>
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ol>
  )
}

export function DemoGuidePage() {
  usePageMeta()

  return (
    <div className="bg-background text-foreground min-h-svh">
      <header className="bg-background/90 z-10 border-b backdrop-blur sm:sticky sm:top-0">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <p className="font-semibold">Portal demo guide</p>
          <nav aria-label="Sections" className="flex flex-1 flex-wrap gap-x-3 gap-y-1 text-sm">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {section.label}
              </a>
            ))}
          </nav>
          <a href="/" className={buttonVariants({ size: 'sm' })}>
            Open the portal
          </a>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-10 px-4 py-8 sm:px-6">
        <div className="grid gap-3">
          <Badge variant="secondary" className="w-fit">
            Test accounts only
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight">
            University Portal: live demo guide
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Everything you need to present the FYP: the production logins, the order to demo each
            role, what to show and say on every screen, and what can go wrong on the day.
          </p>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-lg border p-3">
              <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Frontend
              </dt>
              <dd className="font-mono break-all">{window.location.origin}</dd>
            </div>
            <div className="rounded-lg border p-3">
              <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Backend API
              </dt>
              <dd className="font-mono break-all">{API_BASE_URL}</dd>
            </div>
          </dl>
        </div>

        <Section
          id="accounts"
          title="Demo accounts"
          description="All four use the same password. Log in once per role before you present so nothing is cold."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {DEMO_ACCOUNTS.map((account) => (
              <Card key={account.role} size="sm">
                <CardHeader>
                  <CardTitle>{account.label}</CardTitle>
                  <CardDescription>{account.sees}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-muted-foreground text-xs">Email</p>
                      <p className="font-mono break-all">{account.email}</p>
                    </div>
                    <CopyButton value={account.email} label={`${account.label} email`} />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-muted-foreground text-xs">Password</p>
                      <p className="font-mono">{account.password}</p>
                    </div>
                    <CopyButton value={account.password} label={`${account.label} password`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            Demo order: {DEMO_ORDER.map((item) => item.role).join(' → ')}. Later steps depend on
            data created in earlier ones.
          </p>
        </Section>

        <Section
          id="directory"
          title="University directory"
          description={`A full university is loaded in the database. Every account below uses the password ${DIRECTORY_PASSWORD}.`}
        >
          <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-6">
            {UNIVERSITY_SUMMARY.map((item) => (
              <div key={item.label} className="rounded-lg border p-3">
                <dd className="text-2xl font-semibold tabular-nums">{item.value}</dd>
                <dt className="text-muted-foreground text-xs">{item.label}</dt>
              </div>
            ))}
          </dl>
          <Tabs defaultValue="staff">
            <TabsList>
              <TabsTrigger value="staff">Staff ({DIRECTORY_STAFF.length})</TabsTrigger>
              <TabsTrigger value="students">Students by program</TabsTrigger>
            </TabsList>
            <TabsContent value="staff">
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-medium">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-2 font-medium">
                        Role
                      </th>
                      <th scope="col" className="px-3 py-2 font-medium">
                        Department
                      </th>
                      <th scope="col" className="px-3 py-2 font-medium">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {DIRECTORY_STAFF.map((member) => (
                      <tr key={member.email} className="border-t align-top">
                        <td className="px-3 py-2">
                          {member.name}
                          <span className="text-muted-foreground block text-xs">
                            {member.designation}
                            {member.courses ? `, ${member.courses} courses` : ''}
                          </span>
                        </td>
                        <td className="px-3 py-2 capitalize">
                          {member.role === 'hod' ? 'HOD' : member.role}
                        </td>
                        <td className="px-3 py-2">{member.department ?? 'Administration'}</td>
                        <td className="px-3 py-2">
                          <span className="flex items-center justify-between gap-2">
                            <span className="font-mono break-all">{member.email}</span>
                            <CopyButton value={member.email} label={`${member.name} email`} />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="students">
              <p className="text-muted-foreground mb-2 text-sm">
                One student per program to start with. Each has 5 current courses, attendance,
                marks, a fee record and last term&apos;s approved results. Other students follow the
                same pattern: change the first part of the registration number.
              </p>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-medium">
                        Student
                      </th>
                      <th scope="col" className="px-3 py-2 font-medium">
                        Program
                      </th>
                      <th scope="col" className="px-3 py-2 font-medium">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {DIRECTORY_STUDENTS.map((student) => (
                      <tr key={student.email} className="border-t align-top">
                        <td className="px-3 py-2">
                          {student.name}
                          <span className="text-muted-foreground block text-xs">
                            {student.registrationNumber}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          {student.program}
                          <span className="text-muted-foreground block text-xs">
                            {student.batch}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="flex items-center justify-between gap-2">
                            <span className="font-mono break-all">{student.email}</span>
                            <CopyButton value={student.email} label={`${student.name} email`} />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </Section>

        <Section id="pitch" title="The one-minute pitch">
          <Card>
            <CardContent className="grid gap-4 text-sm">
              <p>{ONE_MINUTE_PITCH.summary}</p>
              <ol className="list-decimal space-y-1 pl-5">
                {ONE_MINUTE_PITCH.flow.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              <p className="font-medium">{ONE_MINUTE_PITCH.tagline}</p>
            </CardContent>
          </Card>
          <ul className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {DEMO_ORDER.map((item, index) => (
              <li key={item.role} className="rounded-lg border p-3">
                <p className="font-medium">
                  {index + 1}. {item.role}
                </p>
                <p className="text-muted-foreground">{item.reason}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="flows"
          title="Demo flow by role"
          description="Each step lists the route, what to show and what to say."
        >
          <Tabs defaultValue="admin">
            <TabsList className="flex-wrap">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
              <TabsTrigger value="hod">HOD</TabsTrigger>
              <TabsTrigger value="student">Student</TabsTrigger>
            </TabsList>
            <TabsContent value="admin">
              <StepList steps={ADMIN_STEPS} />
            </TabsContent>
            <TabsContent value="teacher">
              <StepList steps={TEACHER_STEPS} />
            </TabsContent>
            <TabsContent value="hod">
              <StepList steps={HOD_STEPS} />
            </TabsContent>
            <TabsContent value="student">
              <StepList steps={STUDENT_STEPS} />
            </TabsContent>
          </Tabs>
        </Section>

        <Section
          id="ai"
          title="AI academic assistant"
          description="Log in as the student and open the floating chat button."
        >
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Ask
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    What should happen
                  </th>
                </tr>
              </thead>
              <tbody>
                {AI_PROMPTS.map((item) => (
                  <tr key={item.prompt} className="border-t align-top">
                    <td className="px-3 py-2 font-mono">{item.prompt}</td>
                    <td className="px-3 py-2">{item.expect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {AI_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Section>

        <Section
          id="security"
          title="Security and permission tests"
          description="Keep one or two of these for the live defense."
        >
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Test
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Expected result
                  </th>
                </tr>
              </thead>
              <tbody>
                {PERMISSION_TESTS.map((item) => (
                  <tr key={item.test} className="border-t">
                    <td className="px-3 py-2">{item.test}</td>
                    <td className="px-3 py-2">{item.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          id="chain"
          title="The full data chain"
          description="Use this when someone asks how the modules connect."
        >
          <ol className="grid gap-2 text-sm sm:grid-cols-2">
            {DATA_CHAIN.map((item, index) => (
              <li key={item} className="flex gap-3 rounded-lg border p-3">
                <span className="text-muted-foreground tabular-nums">{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          id="checklist"
          title="Before you present"
          description="Things specific to the live deployment that can bite on the day."
        >
          <ul className="grid gap-3">
            {BEFORE_YOU_PRESENT.map((item) => (
              <li key={item.title} className="rounded-lg border p-3 text-sm">
                <p className="font-medium">{item.title}</p>
                <p className="text-muted-foreground mt-1">{item.detail}</p>
              </li>
            ))}
          </ul>

          <div className="grid gap-4 md:grid-cols-2">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Known limits to mention honestly</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {KNOWN_LIMITS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardTitle>Who presents what</CardTitle>
                <CardDescription>Adjust if your final split differs.</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-2 text-sm">
                  {TEAM_SPLIT.map((item) => (
                    <div key={item.member}>
                      <dt className="font-medium">{item.member}</dt>
                      <dd className="text-muted-foreground">{item.sections}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </Section>

        <footer className="text-muted-foreground border-t pt-4 text-xs">
          This page is public and lists test accounts only. It is not linked from the portal and is
          excluded from search engines.
        </footer>
      </main>
    </div>
  )
}
