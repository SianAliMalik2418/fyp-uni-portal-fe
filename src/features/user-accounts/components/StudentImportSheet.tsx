import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/components/ui/toast-manager'
import { importStudentAccounts } from '../api/user-accounts-api'
import { userAccountKeys } from '../api/user-accounts-queries'
import type { StudentImportResult } from '../types/user-account.types'

const template = [
  'fullName,email,registrationNumber,departmentCode,programCode,batchName,semesterName,academicYear,sectionName',
  'Ayesha Noor,ayesha@example.com,REG-001,CS,BSCS,Fall 2026,Fall Semester,2026-2027,A',
].join('\n')

export function StudentImportSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<StudentImportResult | null>(null)
  const mutation = useMutation({
    mutationFn: importStudentAccounts,
    onSuccess: async (response) => {
      setResult(response)
      toast.add({
        title: 'Student import processed',
        description: `${response.summary.imported} imported; ${response.summary.failed} failed.`,
        type: response.summary.failed ? 'warning' : 'success',
      })
      await queryClient.invalidateQueries({ queryKey: userAccountKeys.all })
    },
    onError: (error) =>
      toast.add({
        title: 'Import failed',
        description: getApiErrorMessage(error, 'Unable to process the CSV file'),
        type: 'error',
        priority: 'high',
      }),
  })

  function close(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (!nextOpen) {
      setFile(null)
      setResult(null)
      mutation.reset()
    }
  }

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-xl" side="right">
        <SheetHeader className="border-b">
          <SheetTitle>Import students from CSV</SheetTitle>
          <SheetDescription>
            Valid rows are imported independently. Academic codes and names must match active portal
            records.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 p-4">
          <div className="grid gap-5">
            <div className="bg-muted/40 grid gap-2 rounded-lg border p-4">
              <p className="font-medium">Required columns</p>
              <p className="text-muted-foreground text-xs leading-5">
                fullName, email, registrationNumber, departmentCode, programCode, batchName,
                semesterName, academicYear, sectionName
              </p>
              <a
                className="text-primary w-fit text-sm font-medium underline underline-offset-4"
                href={`data:text/csv;charset=utf-8,${encodeURIComponent(template)}`}
                download="student-import-template.csv"
              >
                Download CSV template
              </a>
            </div>
            <div className="grid gap-2">
              <label htmlFor="student-import-file" className="text-sm font-medium">
                CSV file
              </label>
              <Input
                id="student-import-file"
                type="file"
                accept=".csv,text/csv"
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null)
                  setResult(null)
                }}
              />
              <p className="text-muted-foreground text-xs">Maximum 500 rows and 2 MB.</p>
            </div>
            {result ? (
              <div className="grid gap-3">
                <div className="flex gap-2">
                  <Badge variant="secondary">{result.summary.imported} imported</Badge>
                  <Badge variant={result.summary.failed ? 'destructive' : 'outline'}>
                    {result.summary.failed} failed
                  </Badge>
                </div>
                <div className="divide-border overflow-hidden rounded-lg border">
                  {result.rows.map((row) => (
                    <div
                      key={`${row.row}-${row.email}`}
                      className="flex items-start justify-between gap-4 p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">
                          Row {row.row} · {row.email || 'Missing email'}
                        </p>
                        {row.error ? (
                          <p className="text-destructive mt-1 text-xs">{row.error}</p>
                        ) : null}
                      </div>
                      <Badge variant={row.status === 'imported' ? 'secondary' : 'destructive'}>
                        {row.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </ScrollArea>
        <SheetFooter className="border-t">
          <Button
            disabled={!file || mutation.isPending}
            onClick={() => file && mutation.mutate(file)}
          >
            {mutation.isPending ? <Spinner data-icon="inline-start" /> : null}
            Process import
          </Button>
          <Button variant="outline" onClick={() => close(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
