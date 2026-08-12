import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircleIcon, ChartEvaluationIcon, CourseIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/toast-manager'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { createAssessment } from '../api/academic-performance-api'
import {
  academicPerformanceKeys,
  academicPerformanceOfferingsQueryOptions,
  assessmentStructureQueryOptions,
  assessmentsQueryOptions,
} from '../api/academic-performance-queries'
import { AssessmentCategoriesCard } from '../components/AssessmentCategoriesCard'
import { AssessmentCreationForm } from '../components/AssessmentCreationForm'
import { AssessmentsTable } from '../components/AssessmentsTable'
import { CourseOfferingPicker } from '../components/CourseOfferingPicker'
import type { AssessmentFormValues } from '../schemas/assessment.schemas'

export function AssessmentsPage({ title }: { title: string }) {
  const queryClient = useQueryClient()
  const offeringsQuery = useQuery(academicPerformanceOfferingsQueryOptions)
  const structureQuery = useQuery(assessmentStructureQueryOptions)
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>()
  const offerings = offeringsQuery.data?.offerings ?? []
  const activeOfferingId = selectedOfferingId ?? offerings[0]?.id ?? ''
  const assessmentsQuery = useQuery(assessmentsQueryOptions(activeOfferingId))
  const categories = structureQuery.data?.structure.categories ?? []
  const createMutation = useMutation({
    mutationFn: createAssessment,
    onSuccess: (response) => {
      toast.add({
        title: 'Assessment created',
        description: response.message,
        type: 'success',
      })
      void queryClient.invalidateQueries({
        queryKey: academicPerformanceKeys.assessments(activeOfferingId),
      })
    },
    onError: (error) => {
      toast.add({
        title: 'Assessment not created',
        description: getApiErrorMessage(error, 'Unable to create the assessment.'),
        type: 'error',
      })
    },
  })

  function handleCreate(values: AssessmentFormValues, reset: () => void) {
    createMutation.mutate({ offeringId: activeOfferingId, ...values }, { onSuccess: reset })
  }

  if (offeringsQuery.isError || structureQuery.isError) {
    return (
      <Alert variant="destructive">
        <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
        <AlertTitle>Assessments unavailable</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(
            offeringsQuery.error ?? structureQuery.error,
            'Unable to load the assessment workspace.'
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-5">
      <AssessmentCategoriesCard categories={categories} isLoading={structureQuery.isPending} />

      <Card className="bg-background">
        <CardHeader className="border-border border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <HugeiconsIcon icon={ChartEvaluationIcon} strokeWidth={2} className="size-4" />
            {title}
          </CardTitle>
          <CardDescription>
            Create multiple assessments within each category for an assigned course section.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          {offeringsQuery.isPending ? (
            <div className="bg-muted h-9 animate-pulse rounded-md" />
          ) : offerings.length ? (
            <>
              <CourseOfferingPicker
                offerings={offerings}
                value={activeOfferingId}
                onChange={setSelectedOfferingId}
              />
              <AssessmentCreationForm
                categories={categories}
                disabled={!activeOfferingId || !categories.length}
                isSubmitting={createMutation.isPending}
                onSubmit={handleCreate}
              />
              {assessmentsQuery.isError ? (
                <Alert variant="destructive">
                  <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
                  <AlertTitle>Assessment list unavailable</AlertTitle>
                  <AlertDescription>
                    {getApiErrorMessage(assessmentsQuery.error, 'Unable to load assessments.')}
                  </AlertDescription>
                </Alert>
              ) : (
                <AssessmentsTable
                  assessments={assessmentsQuery.data?.assessments ?? []}
                  isLoading={assessmentsQuery.isPending}
                />
              )}
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
                  Assessments can be created after a course section is assigned to this teacher.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
