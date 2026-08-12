import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertCircleIcon,
  ChartNoAxesColumnDecreasingIcon,
  CourseIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { toast } from '@/components/ui/toast-manager'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { saveMarkSheetDraft } from '../api/academic-performance-api'
import {
  academicPerformanceKeys,
  academicPerformanceOfferingsQueryOptions,
  assessmentsQueryOptions,
  markSheetQueryOptions,
} from '../api/academic-performance-queries'
import { CourseOfferingPicker } from '../components/CourseOfferingPicker'
import { MarksEntryTable } from '../components/MarksEntryTable'
import type { MarkSheetPayload } from '../types/academic-performance.types'
import { assessmentCategoryLabels } from '../utils/academic-performance-labels'

export function MarksPage({ title }: { title: string }) {
  const queryClient = useQueryClient()
  const offeringsQuery = useQuery(academicPerformanceOfferingsQueryOptions)
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>()
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>()
  const offerings = offeringsQuery.data?.offerings ?? []
  const activeOfferingId = selectedOfferingId ?? offerings[0]?.id ?? ''
  const assessmentsQuery = useQuery(assessmentsQueryOptions(activeOfferingId))
  const assessments = assessmentsQuery.data?.assessments ?? []
  const activeAssessmentId = assessments.some(
    (assessment) => assessment.id === selectedAssessmentId
  )
    ? selectedAssessmentId!
    : (assessments[0]?.id ?? '')
  const activeAssessment = assessments.find((assessment) => assessment.id === activeAssessmentId)
  const markSheetQuery = useQuery(markSheetQueryOptions(activeAssessmentId))
  const saveMutation = useMutation({
    mutationFn: (payload: MarkSheetPayload) => saveMarkSheetDraft(activeAssessmentId, payload),
    onSuccess: (response) => {
      queryClient.setQueryData(academicPerformanceKeys.markSheet(activeAssessmentId), response)
      toast.add({
        title: 'Marks draft saved',
        description: response.message ?? 'The draft is ready for further editing.',
        type: 'success',
      })
    },
    onError: (error) => {
      toast.add({
        title: 'Marks not saved',
        description: getApiErrorMessage(error, 'Unable to save the marks draft.'),
        type: 'error',
      })
    },
  })

  if (offeringsQuery.isError) {
    return (
      <Alert variant="destructive">
        <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
        <AlertTitle>Marks unavailable</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(offeringsQuery.error, 'Unable to load assigned course sections.')}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="bg-background">
      <CardHeader className="border-border border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <HugeiconsIcon
            icon={ChartNoAxesColumnDecreasingIcon}
            strokeWidth={2}
            className="size-4"
          />
          {title}
        </CardTitle>
        <CardDescription>
          Enter numeric marks or special statuses and keep incomplete sheets as drafts.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        {offeringsQuery.isPending ? (
          <TableSkeleton columns={4} rows={5} />
        ) : offerings.length ? (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <CourseOfferingPicker
                offerings={offerings}
                value={activeOfferingId}
                onChange={(offeringId) => {
                  setSelectedOfferingId(offeringId)
                  setSelectedAssessmentId(undefined)
                }}
              />
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="marksAssessment">
                  Assessment
                </label>
                <Select
                  value={activeAssessmentId}
                  onValueChange={(value) => setSelectedAssessmentId(value ?? undefined)}
                  disabled={!assessments.length}
                >
                  <SelectTrigger id="marksAssessment" className="w-full">
                    <SelectValue>
                      {activeAssessment
                        ? `${activeAssessment.name} · ${assessmentCategoryLabels[activeAssessment.category]} · ${activeAssessment.maximumMarks} marks`
                        : 'Select assessment'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent side="bottom" alignItemWithTrigger>
                    {assessments.map((assessment) => (
                      <SelectItem key={assessment.id} value={assessment.id}>
                        {assessment.name} · {assessment.maximumMarks} marks
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {assessmentsQuery.isError ? (
              <Alert variant="destructive">
                <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
                <AlertTitle>Assessments unavailable</AlertTitle>
                <AlertDescription>
                  {getApiErrorMessage(assessmentsQuery.error, 'Unable to load assessments.')}
                </AlertDescription>
              </Alert>
            ) : assessmentsQuery.isPending ? (
              <TableSkeleton columns={4} rows={5} />
            ) : !assessments.length ? (
              <div className="bg-muted/30 grid min-h-36 place-items-center rounded-md border border-dashed px-4 text-center">
                <div>
                  <p className="text-sm font-medium">No assessments available</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Create an assessment before entering student marks.
                  </p>
                </div>
              </div>
            ) : markSheetQuery.isPending ? (
              <TableSkeleton columns={4} rows={6} />
            ) : markSheetQuery.isError ? (
              <Alert variant="destructive">
                <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
                <AlertTitle>Mark sheet unavailable</AlertTitle>
                <AlertDescription>
                  {getApiErrorMessage(markSheetQuery.error, 'Unable to load the mark sheet.')}
                </AlertDescription>
              </Alert>
            ) : markSheetQuery.data ? (
              <MarksEntryTable
                key={`${activeAssessmentId}-${markSheetQuery.data.sheet.updatedAt ?? 'new'}`}
                sheet={markSheetQuery.data.sheet}
                isSaving={saveMutation.isPending}
                onSave={(payload) => saveMutation.mutate(payload)}
              />
            ) : null}
          </>
        ) : (
          <div className="bg-muted/30 grid min-h-44 place-items-center rounded-md border border-dashed px-4 text-center">
            <div className="grid justify-items-center gap-2">
              <HugeiconsIcon
                icon={CourseIcon}
                strokeWidth={2}
                className="text-muted-foreground size-8"
              />
              <p className="text-sm font-medium">No assigned course sections</p>
              <p className="text-muted-foreground max-w-sm text-sm">
                Marks entry becomes available after a course section is assigned.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
