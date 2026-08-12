import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircleIcon, SchoolReportCardIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { toast } from '@/components/ui/toast-manager'
import { getApiErrorMessage } from '@/shared/api/http-client'
import {
  approveCourseResult,
  reopenCourseResult,
  returnCourseResult,
  submitCourseResult,
} from '../api/academic-performance-api'
import {
  academicPerformanceKeys,
  academicPerformanceOfferingsQueryOptions,
  courseResultQueryOptions,
  studentResultsQueryOptions,
} from '../api/academic-performance-queries'
import { CourseOfferingPicker } from '../components/CourseOfferingPicker'
import { ResultCommentDialog } from '../components/ResultCommentDialog'
import { ResultRecordsTable } from '../components/ResultRecordsTable'
import { ResultStatisticsCards } from '../components/ResultStatisticsCards'
import { ResultStatusBadge } from '../components/ResultStatusBadge'
import { StudentPublishedResults } from '../components/StudentPublishedResults'
import type {
  CourseResultResponse,
  ResultCommentPayload,
} from '../types/academic-performance.types'

type CommentAction = 'return' | 'reopen' | null

export function ResultsPage({ title, user }: { title: string; user: PortalUser }) {
  if (user.role === 'student') {
    return <StudentResultsPage title={title} />
  }

  return <ManagedResultsPage title={title} user={user} />
}

function StudentResultsPage({ title }: { title: string }) {
  const resultsQuery = useQuery(studentResultsQueryOptions)

  if (resultsQuery.isPending) return <TableSkeleton columns={5} rows={5} />
  if (resultsQuery.isError) {
    return (
      <Alert variant="destructive">
        <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
        <AlertTitle>Published results unavailable</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(resultsQuery.error, 'Unable to load your published results.')}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <section className="grid gap-5">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-muted-foreground text-sm">
          Approved course grades, semester GPA, and CGPA.
        </p>
      </div>
      <StudentPublishedResults data={resultsQuery.data} />
    </section>
  )
}

function ManagedResultsPage({ title, user }: { title: string; user: PortalUser }) {
  const queryClient = useQueryClient()
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>()
  const [commentAction, setCommentAction] = useState<CommentAction>(null)
  const offeringsQuery = useQuery(academicPerformanceOfferingsQueryOptions)
  const offerings = offeringsQuery.data?.offerings ?? []
  const activeOfferingId = selectedOfferingId ?? offerings[0]?.id ?? ''
  const resultQuery = useQuery(courseResultQueryOptions(activeOfferingId))
  const result = resultQuery.data?.result

  function handleSuccess(response: CourseResultResponse) {
    queryClient.setQueryData(academicPerformanceKeys.courseResult(activeOfferingId), response)
    setCommentAction(null)
    toast.add({
      title: response.message ?? 'Result updated',
      description: `The result is now ${response.result.status}.`,
      type: 'success',
    })
  }

  function handleError(error: unknown) {
    toast.add({
      title: 'Result not updated',
      description: getApiErrorMessage(error, 'Unable to update the course result.'),
      type: 'error',
    })
  }

  const submitMutation = useMutation({
    mutationFn: () => submitCourseResult(activeOfferingId),
    onSuccess: handleSuccess,
    onError: handleError,
  })
  const approveMutation = useMutation({
    mutationFn: () => approveCourseResult(result!.id!),
    onSuccess: handleSuccess,
    onError: handleError,
  })
  const commentMutation = useMutation({
    mutationFn: (payload: ResultCommentPayload) =>
      commentAction === 'return'
        ? returnCourseResult(result!.id!, payload)
        : reopenCourseResult(result!.id!, payload),
    onSuccess: handleSuccess,
    onError: handleError,
  })

  if (offeringsQuery.isError) {
    return (
      <Alert variant="destructive">
        <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
        <AlertTitle>Results unavailable</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(offeringsQuery.error, 'Unable to load course sections.')}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="bg-background">
      <CardHeader className="border-border border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <HugeiconsIcon icon={SchoolReportCardIcon} strokeWidth={2} className="size-4" />
              {title}
            </CardTitle>
            <CardDescription>
              Review calculated grades and manage the course-section approval workflow.
            </CardDescription>
          </div>
          {result ? <ResultStatusBadge status={result.status} /> : null}
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        {offeringsQuery.isPending ? (
          <TableSkeleton columns={5} rows={5} />
        ) : offerings.length ? (
          <>
            <CourseOfferingPicker
              offerings={offerings}
              value={activeOfferingId}
              onChange={setSelectedOfferingId}
            />
            {resultQuery.isPending ? (
              <TableSkeleton columns={5} rows={6} />
            ) : resultQuery.isError ? (
              <Alert variant="destructive">
                <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
                <AlertTitle>Course result unavailable</AlertTitle>
                <AlertDescription>
                  {getApiErrorMessage(resultQuery.error, 'Unable to calculate this result.')}
                </AlertDescription>
              </Alert>
            ) : result ? (
              <>
                {result.hodComment ? (
                  <Alert variant={result.status === 'returned' ? 'destructive' : 'default'}>
                    <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
                    <AlertTitle>
                      {result.reopenReason ? 'Result reopened' : 'HOD review comment'}
                    </AlertTitle>
                    <AlertDescription>{result.hodComment}</AlertDescription>
                  </Alert>
                ) : null}
                <ResultStatisticsCards statistics={result.statistics} />
                <ResultRecordsTable records={result.records} />
                <div className="flex flex-wrap justify-end gap-2">
                  {user.role === 'teacher' &&
                  (result.status === 'draft' || result.status === 'returned') ? (
                    <Button
                      disabled={!result.submissionReady || submitMutation.isPending}
                      onClick={() => submitMutation.mutate()}
                    >
                      {submitMutation.isPending ? <Spinner /> : null}
                      Submit result
                    </Button>
                  ) : null}
                  {user.role === 'hod' && result.status === 'pending' && result.id ? (
                    <>
                      <Button variant="outline" onClick={() => setCommentAction('return')}>
                        Return with comments
                      </Button>
                      <Button
                        disabled={approveMutation.isPending}
                        onClick={() => approveMutation.mutate()}
                      >
                        {approveMutation.isPending ? <Spinner /> : null}
                        Approve result
                      </Button>
                    </>
                  ) : null}
                  {(user.role === 'hod' || user.role === 'admin') &&
                  result.status === 'approved' &&
                  result.id ? (
                    <Button variant="destructive" onClick={() => setCommentAction('reopen')}>
                      Reopen result
                    </Button>
                  ) : null}
                </div>
                {user.role === 'teacher' && !result.submissionReady ? (
                  <p className="text-muted-foreground text-right text-sm">
                    Complete every assessment mark before submitting this result.
                  </p>
                ) : null}
                <ResultCommentDialog
                  open={Boolean(commentAction)}
                  title={commentAction === 'return' ? 'Return this result?' : 'Reopen this result?'}
                  description={
                    commentAction === 'return'
                      ? 'The teacher will be able to correct marks and submit the result again.'
                      : 'The approved result will stop being visible to students until it is approved again.'
                  }
                  confirmLabel={commentAction === 'return' ? 'Return result' : 'Reopen result'}
                  isPending={commentMutation.isPending}
                  onOpenChange={(open) => {
                    if (!open) setCommentAction(null)
                  }}
                  onConfirm={(payload) => commentMutation.mutate(payload)}
                />
              </>
            ) : null}
          </>
        ) : (
          <div className="bg-muted/30 grid min-h-44 place-items-center rounded-md border border-dashed px-4 text-center">
            <p className="text-muted-foreground text-sm">No course sections are available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
