import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SchoolReportCardIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast-manager'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { updateGradingScale } from '../api/academic-performance-api'
import {
  academicPerformanceKeys,
  gradingScaleQueryOptions,
} from '../api/academic-performance-queries'
import { GradingScaleForm } from '../components/GradingScaleForm'
import type { GradingScaleFormValues } from '../schemas/grading-scale.schemas'
import { QueryErrorState } from '@/components/ui/query-error-state'

export function GradingScaleSettingsPage({ title }: { title: string }) {
  const queryClient = useQueryClient()
  const gradingScaleQuery = useQuery(gradingScaleQueryOptions)
  const updateMutation = useMutation({
    mutationFn: updateGradingScale,
    onSuccess: (response) => {
      queryClient.setQueryData(academicPerformanceKeys.gradingScale(), response)
      void queryClient.invalidateQueries({ queryKey: academicPerformanceKeys.courseResults() })
      toast.add({
        title: 'Grading scale saved',
        description: response.message ?? 'Future result calculations will use this scale.',
        type: 'success',
      })
    },
    onError: (error) => {
      toast.add({
        title: 'Grading scale not saved',
        description: getApiErrorMessage(error, 'Unable to update the grading scale.'),
        type: 'error',
      })
    },
  })

  if (gradingScaleQuery.isError) {
    return <QueryErrorState resource="grading scale" error={gradingScaleQuery.error} />
  }

  return (
    <Card className="bg-background">
      <CardHeader className="border-border border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <HugeiconsIcon icon={SchoolReportCardIcon} strokeWidth={2} className="size-4" />
          {title}
        </CardTitle>
        <CardDescription>
          Define the percentage ranges and grade points used for result calculations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {gradingScaleQuery.isPending ? (
          <div className="grid gap-3">
            {Array.from({ length: 8 }, (_, index) => (
              <Skeleton key={index} className="h-14" />
            ))}
          </div>
        ) : gradingScaleQuery.data ? (
          <GradingScaleForm
            key={gradingScaleQuery.data.gradingScale.updatedAt ?? 'default'}
            gradingScale={gradingScaleQuery.data.gradingScale}
            isSaving={updateMutation.isPending}
            onSave={(values: GradingScaleFormValues) => updateMutation.mutate(values)}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}
