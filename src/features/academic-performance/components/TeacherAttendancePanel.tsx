import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertCircleIcon,
  Calendar03Icon,
  CourseIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { toast } from '@/components/ui/toast-manager'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { formatAppDate, formatInputDate, parseAppDate } from '@/shared/utils/date-format'
import { saveAttendanceSession, updateAttendanceSession } from '../api/academic-performance-api'
import {
  academicPerformanceKeys,
  academicPerformanceOfferingStudentsQueryOptions,
  academicPerformanceOfferingsQueryOptions,
  attendanceSessionsQueryOptions,
} from '../api/academic-performance-queries'
import type {
  AttendanceSession,
  AttendanceSessionPayload,
  AttendanceStatus,
} from '../types/academic-performance.types'

const attendanceStatuses: AttendanceStatus[] = ['present', 'absent', 'leave']

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function offeringLabel(offering: AttendanceSession['offering']) {
  return `${offering.course.code} - ${offering.section.program.code} ${offering.section.semester.name} ${offering.section.name}`
}

function sessionTitle(session: AttendanceSession) {
  return `${session.offering.course.code} - ${session.offering.section.name}`
}

export function TeacherAttendancePanel({ title }: { title: string }) {
  const queryClient = useQueryClient()
  const offeringsQuery = useQuery(academicPerformanceOfferingsQueryOptions)
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>()
  const [date, setDate] = useState(todayKey)
  const [editingSessionId, setEditingSessionId] = useState<string>()
  const [statusByStudent, setStatusByStudent] = useState<Record<string, AttendanceStatus>>({})

  const offerings = offeringsQuery.data?.offerings ?? []
  const activeOfferingId = selectedOfferingId ?? offerings[0]?.id ?? ''
  const studentsQuery = useQuery(academicPerformanceOfferingStudentsQueryOptions(activeOfferingId))
  const sessionsQuery = useQuery(
    attendanceSessionsQueryOptions(activeOfferingId || undefined, Boolean(activeOfferingId))
  )
  const selectedOffering = offerings.find((offering) => offering.id === activeOfferingId)
  const selectedDate = parseAppDate(date) ?? undefined

  const records = useMemo(
    () =>
      (studentsQuery.data?.students ?? []).map((student) => ({
        studentId: student.id,
        status: statusByStudent[student.id] ?? 'present',
      })),
    [statusByStudent, studentsQuery.data?.students]
  )

  const saveMutation = useMutation({
    mutationFn: (payload: AttendanceSessionPayload) =>
      editingSessionId
        ? updateAttendanceSession(editingSessionId, payload)
        : saveAttendanceSession(payload),
    onSuccess: (response) => {
      toast.add({
        title: editingSessionId ? 'Attendance updated' : 'Attendance saved',
        description: response.message,
        type: 'success',
      })
      setEditingSessionId(undefined)
      void queryClient.invalidateQueries({ queryKey: academicPerformanceKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: 'Attendance not saved',
        description: getApiErrorMessage(error, 'Unable to save attendance.'),
        type: 'error',
      })
    },
  })

  function updateStatus(studentId: string, status: AttendanceStatus) {
    setStatusByStudent((current) => ({ ...current, [studentId]: status }))
  }

  function startEdit(session: AttendanceSession) {
    setEditingSessionId(session.id)
    setSelectedOfferingId(session.offering.id)
    setDate(session.date)
    setStatusByStudent(
      Object.fromEntries(session.records.map((record) => [record.student.id, record.status]))
    )
  }

  function resetForm() {
    setEditingSessionId(undefined)
    setDate(todayKey())
    setStatusByStudent(
      Object.fromEntries(
        (studentsQuery.data?.students ?? []).map((student) => [student.id, 'present'])
      )
    )
  }

  function submitAttendance() {
    if (!activeOfferingId) {
      toast.add({
        title: 'Select a course',
        description: 'Attendance requires an assigned course section.',
        type: 'warning',
      })
      return
    }

    saveMutation.mutate({ offeringId: activeOfferingId, date, records })
  }

  if (offeringsQuery.isPending) {
    return (
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Loading assigned course sections.</CardDescription>
        </CardHeader>
        <CardContent>
          <TableSkeleton columns={4} rows={4} />
        </CardContent>
      </Card>
    )
  }

  if (offeringsQuery.isError) {
    return (
      <Alert variant="destructive">
        <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
        <AlertTitle>Attendance unavailable</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(offeringsQuery.error, 'Unable to load assigned courses.')}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-5">
      <Card className="bg-background">
        <CardHeader className="border-border border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-4" />
                {editingSessionId ? 'Edit attendance session' : title}
              </CardTitle>
              <CardDescription>
                Mark present, absent, or leave for every enrolled student in the selected section.
              </CardDescription>
            </div>
            {selectedOffering ? (
              <Badge variant="outline">{selectedOffering.studentCount} students</Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          {offerings.length ? (
            <>
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                <div className="grid gap-2">
                  <label className="text-foreground text-sm font-medium" htmlFor="attendanceCourse">
                    Course section
                  </label>
                  <Select
                    value={activeOfferingId}
                    onValueChange={(value) => {
                      setSelectedOfferingId(value ?? undefined)
                      setEditingSessionId(undefined)
                      setStatusByStudent({})
                    }}
                  >
                    <SelectTrigger id="attendanceCourse" className="w-full">
                      <SelectValue>
                        {selectedOffering
                          ? offeringLabel(selectedOffering)
                          : 'Select course section'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent side="bottom" alignItemWithTrigger>
                      {offerings.map((offering) => (
                        <SelectItem key={offering.id} value={offering.id}>
                          {offeringLabel(offering)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-foreground text-sm font-medium" htmlFor="attendanceDate">
                    Attendance date
                  </label>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          id="attendanceDate"
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-4" />
                          {formatAppDate(date, 'Select date')}
                        </Button>
                      }
                    />
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(selectedDay) => {
                          setDate(formatInputDate(selectedDay))
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {studentsQuery.isPending ? <TableSkeleton columns={3} rows={5} /> : null}
              {studentsQuery.isError ? (
                <Alert variant="destructive">
                  <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
                  <AlertTitle>Students unavailable</AlertTitle>
                  <AlertDescription>
                    {getApiErrorMessage(studentsQuery.error, 'Unable to load enrolled students.')}
                  </AlertDescription>
                </Alert>
              ) : null}
              {studentsQuery.data ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Registration no.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsQuery.data.students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.registrationNumber}</TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>
                          <Select
                            value={statusByStudent[student.id] ?? 'present'}
                            onValueChange={(value) =>
                              updateStatus(student.id, value as AttendanceStatus)
                            }
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent side="bottom" alignItemWithTrigger>
                              {attendanceStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : null}

              <div className="flex flex-wrap justify-end gap-2">
                {editingSessionId ? (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel edit
                  </Button>
                ) : null}
                <Button
                  type="button"
                  disabled={saveMutation.isPending || records.length === 0}
                  onClick={submitAttendance}
                >
                  {saveMutation.isPending ? <Spinner /> : null}
                  {editingSessionId ? 'Update attendance' : 'Save attendance'}
                </Button>
              </div>
            </>
          ) : (
            <div className="bg-muted/30 grid min-h-44 place-items-center rounded-md border border-dashed px-4 text-center">
              <div className="grid justify-items-center gap-2">
                <HugeiconsIcon
                  icon={CourseIcon}
                  strokeWidth={2}
                  className="text-muted-foreground size-8"
                />
                <p className="text-foreground text-sm font-medium">No assigned course sections</p>
                <p className="text-muted-foreground max-w-sm text-sm">
                  Attendance can start after course sections are assigned to this teacher account.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-background">
        <CardHeader className="border-border border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} className="size-4" />
            Attendance history
          </CardTitle>
          <CardDescription>Open a previous session to update individual records.</CardDescription>
        </CardHeader>
        <CardContent>
          {sessionsQuery.isPending ? <TableSkeleton columns={4} rows={3} /> : null}
          {sessionsQuery.isError ? (
            <Alert variant="destructive">
              <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
              <AlertTitle>History unavailable</AlertTitle>
              <AlertDescription>
                {getApiErrorMessage(sessionsQuery.error, 'Unable to load attendance history.')}
              </AlertDescription>
            </Alert>
          ) : null}
          {sessionsQuery.data?.sessions.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Student count</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionsQuery.data.sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.date}</TableCell>
                    <TableCell>{sessionTitle(session)}</TableCell>
                    <TableCell>{session.studentCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(session)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
          {sessionsQuery.data && sessionsQuery.data.sessions.length === 0 ? (
            <div className="bg-muted/30 grid min-h-32 place-items-center rounded-md border border-dashed px-4 text-center">
              <p className="text-muted-foreground text-sm">No attendance sessions saved yet.</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
