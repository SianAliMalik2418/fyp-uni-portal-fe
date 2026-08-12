import { useState } from 'react'
import { AlertCircleIcon, FloppyDiskIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import type { MarkSheet, MarkSheetPayload, MarkStatus } from '../types/academic-performance.types'
import { markStatusLabels } from '../utils/academic-performance-labels'

type EditableMark = {
  studentId: string
  value: string
  status?: MarkStatus
}

const specialStatuses: MarkStatus[] = ['absent', 'exempted', 'result_withheld']

function initialEntries(sheet: MarkSheet): EditableMark[] {
  return sheet.records.map((record) => ({
    studentId: record.student.id,
    value: record.obtainedMarks === undefined ? '' : String(record.obtainedMarks),
    status: record.status,
  }))
}

export function MarksEntryTable({
  sheet,
  isSaving,
  onSave,
}: {
  sheet: MarkSheet
  isSaving: boolean
  onSave: (payload: MarkSheetPayload) => void
}) {
  const [entries, setEntries] = useState(() => initialEntries(sheet))
  const maximumMarks = sheet.assessment.maximumMarks
  const entriesByStudent = new Map(entries.map((entry) => [entry.studentId, entry]))

  function updateEntry(studentId: string, update: Partial<EditableMark>) {
    setEntries((current) =>
      current.map((entry) => (entry.studentId === studentId ? { ...entry, ...update } : entry))
    )
  }

  function validationMessage(entry: EditableMark) {
    if (!entry.value) return null
    const marks = Number(entry.value)

    if (!Number.isFinite(marks) || marks < 0) return 'Enter zero or a positive number.'
    if (marks > maximumMarks) return `Cannot exceed ${maximumMarks}.`
    return null
  }

  const hasErrors = entries.some((entry) => validationMessage(entry))
  const missingCount = entries.filter((entry) => !entry.value && !entry.status).length

  function saveDraft() {
    if (hasErrors) return

    onSave({
      records: entries.map((entry) => ({
        studentId: entry.studentId,
        obtainedMarks: entry.value ? Number(entry.value) : undefined,
        status: entry.status,
      })),
    })
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium">{sheet.assessment.name}</p>
          <p className="text-muted-foreground text-sm">
            Enter numeric marks up to {maximumMarks}, or select a special status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Maximum: {maximumMarks}</Badge>
          <Badge variant={missingCount ? 'secondary' : 'outline'}>{missingCount} missing</Badge>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration no.</TableHead>
              <TableHead>Student</TableHead>
              <TableHead className="min-w-44">Numeric marks</TableHead>
              <TableHead className="min-w-48">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sheet.records.map((record) => {
              const entry = entriesByStudent.get(record.student.id)!
              const error = validationMessage(entry)
              const isMissing = !entry.value && !entry.status

              return (
                <TableRow key={record.student.id} className={isMissing ? 'bg-muted/20' : undefined}>
                  <TableCell className="tabular-nums">
                    {record.student.registrationNumber}
                  </TableCell>
                  <TableCell className="font-medium">{record.student.name}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max={maximumMarks}
                      step="0.5"
                      placeholder={`0 - ${maximumMarks}`}
                      value={entry.value}
                      disabled={Boolean(entry.status)}
                      aria-label={`Marks for ${record.student.name}`}
                      aria-invalid={Boolean(error)}
                      onChange={(event) =>
                        updateEntry(record.student.id, {
                          value: event.target.value,
                          status: undefined,
                        })
                      }
                    />
                    {error ? <p className="text-destructive mt-1 text-xs">{error}</p> : null}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={entry.status ?? 'numeric'}
                      onValueChange={(value) =>
                        updateEntry(record.student.id, {
                          status: value === 'numeric' ? undefined : (value as MarkStatus),
                          value: value === 'numeric' ? entry.value : '',
                        })
                      }
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-label={`Status for ${record.student.name}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent side="bottom" alignItemWithTrigger>
                        <SelectItem value="numeric">Numeric marks</SelectItem>
                        {specialStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {markStatusLabels[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {hasErrors ? (
        <p className="text-destructive flex items-center gap-2 text-sm">
          <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
          Correct the highlighted marks before saving.
        </p>
      ) : null}
      <div className="flex justify-end">
        <Button type="button" disabled={isSaving || hasErrors} onClick={saveDraft}>
          {isSaving ? (
            <Spinner />
          ) : (
            <HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} data-icon="inline-start" />
          )}
          Save draft
        </Button>
      </div>
    </div>
  )
}
