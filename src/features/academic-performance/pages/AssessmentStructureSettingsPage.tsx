import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircleIcon, ChartEvaluationIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast-manager'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { updateAssessmentStructure } from '../api/academic-performance-api'
import {
  academicPerformanceKeys,
  assessmentStructureQueryOptions,
} from '../api/academic-performance-queries'
import { AssessmentStructureForm } from '../components/AssessmentStructureForm'
import type { AssessmentStructureFormValues } from '../schemas/assessment-structure.schemas'

export function AssessmentStructureSettingsPage({ title }: { title: string }) {
  const queryClient = useQueryClient()
  const structureQuery = useQuery(assessmentStructureQueryOptions)
  const updateMutation = useMutation({
    mutationFn: updateAssessmentStructure,
    onSuccess: (response) => {
      queryClient.setQueryData(academicPerformanceKeys.assessmentStructure(), response)
      void queryClient.invalidateQueries({ queryKey: academicPerformanceKeys.all })
      toast.add({
        title: 'Assessment structure saved',
        description: response.message ?? 'The active university structure has been updated.',
        type: 'success',
      })
    },
    onError: (error) => {
      toast.add({
        title: 'Structure not saved',
        description: getApiErrorMessage(error, 'Unable to update the assessment structure.'),
        type: 'error',
      })
    },
  })

  if (structureQuery.isError) {
    return (
      <Alert variant="destructive">
        <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
        <AlertTitle>Assessment structure unavailable</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(structureQuery.error, 'Unable to load assessment settings.')}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="bg-background">
      <CardHeader className="border-border border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <HugeiconsIcon icon={ChartEvaluationIcon} strokeWidth={2} className="size-4" />
          {title}
        </CardTitle>
        <CardDescription>
          Set university-wide category weightages used by assessment entry and weighted results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {structureQuery.isPending ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-28 w-full" />
            ))}
          </div>
        ) : structureQuery.data ? (
          <AssessmentStructureForm
            key={structureQuery.data.structure.updatedAt ?? 'default'}
            structure={structureQuery.data.structure}
            isSaving={updateMutation.isPending}
            onSave={(values: AssessmentStructureFormValues) => updateMutation.mutate(values)}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}
