import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon, FileDownloadIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { studentResultCardQueryOptions } from '../api/academic-performance-queries'
import { downloadResultCard } from '../utils/download-result-card'

export function StudentResultCardDialog({
  semesterId,
  open,
  onOpenChange,
}: {
  semesterId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [isDownloading, setIsDownloading] = useState(false)
  const resultCardQuery = useQuery(studentResultCardQueryOptions(semesterId))
  const resultCard = resultCardQuery.data?.resultCard

  async function handleDownload() {
    if (!resultCard) return
    setIsDownloading(true)
    try {
      await downloadResultCard(resultCard)
      toast.add({
        title: 'Result card downloaded',
        description: 'Your approved semester result card was saved as a PDF.',
        type: 'success',
      })
    } catch {
      toast.add({
        title: 'Download failed',
        description: 'Unable to generate the result-card PDF. Please try again.',
        type: 'error',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Semester result card</DialogTitle>
          <DialogDescription>
            Official student copy containing HOD-approved course results only.
          </DialogDescription>
        </DialogHeader>

        {resultCardQuery.isPending ? <TableSkeleton columns={6} rows={5} /> : null}
        {resultCardQuery.isError ? (
          <Alert variant="destructive">
            <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
            <AlertTitle>Result card unavailable</AlertTitle>
            <AlertDescription>
              {getApiErrorMessage(
                resultCardQuery.error,
                'This semester does not have an approved result card.'
              )}
            </AlertDescription>
          </Alert>
        ) : null}
        {resultCard ? (
          <div className="grid gap-5">
            <div className="bg-muted/30 grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
              <ResultCardDetail label="Student" value={resultCard.student.name} />
              <ResultCardDetail
                label="Registration number"
                value={resultCard.student.registrationNumber}
              />
              <ResultCardDetail
                label="Program"
                value={`${resultCard.program.name} (${resultCard.program.code})`}
              />
              <ResultCardDetail
                label="Semester"
                value={`${resultCard.semester.name} · ${resultCard.semester.academicYear}`}
              />
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Course title</TableHead>
                    <TableHead className="text-right">Credit hours</TableHead>
                    <TableHead className="text-right">Marks</TableHead>
                    <TableHead className="text-right">Grade</TableHead>
                    <TableHead className="text-right">Grade point</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resultCard.courses.map((course) => (
                    <TableRow key={course.resultId}>
                      <TableCell className="font-medium">{course.code}</TableCell>
                      <TableCell>{course.title}</TableCell>
                      <TableCell className="text-right">{course.creditHours}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {course.marks.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right font-semibold">{course.grade}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {course.gradePoint.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-wrap justify-between gap-3 border-t pt-4">
              <p className="text-sm">
                Total credit hours: <strong>{resultCard.totalCreditHours}</strong>
              </p>
              <p className="text-lg font-semibold tabular-nums">
                Semester GPA {resultCard.gpa.toFixed(2)}
              </p>
            </div>
          </div>
        ) : null}

        <DialogFooter showCloseButton>
          <Button disabled={!resultCard || isDownloading} onClick={handleDownload}>
            {isDownloading ? (
              <Spinner />
            ) : (
              <HugeiconsIcon icon={FileDownloadIcon} strokeWidth={2} className="size-4" />
            )}
            Download result card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ResultCardDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  )
}
