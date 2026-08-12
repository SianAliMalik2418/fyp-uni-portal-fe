import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast-manager'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { updateAttendanceConfiguration } from '../api/academic-performance-api'
import {
  academicPerformanceKeys,
  attendanceConfigurationQueryOptions,
} from '../api/academic-performance-queries'
import { AttendanceSettingsForm } from '../components/AttendanceSettingsForm'
import {
  attendanceSettingsSchema,
  type AttendanceSettingsFormValues,
} from '../schemas/attendance-settings.schemas'

const defaultAttendanceSettings: AttendanceSettingsFormValues = {
  minimumAttendancePercentage: 75,
}

export function AttendanceSettingsPage({ title }: { title: string }) {
  const queryClient = useQueryClient()
  const configurationQuery = useQuery(attendanceConfigurationQueryOptions)
  const form = useForm<AttendanceSettingsFormValues>({
    resolver: zodResolver(attendanceSettingsSchema),
    defaultValues: defaultAttendanceSettings,
  })
  const { reset } = form
  const configuredPercentage =
    configurationQuery.data?.configuration.minimumAttendancePercentage

  useEffect(() => {
    if (configuredPercentage !== undefined) {
      reset({ minimumAttendancePercentage: configuredPercentage })
    }
  }, [configuredPercentage, reset])

  const updateConfigurationMutation = useMutation({
    mutationFn: updateAttendanceConfiguration,
    onSuccess: async (response) => {
      queryClient.setQueryData(attendanceConfigurationQueryOptions.queryKey, response)
      reset({
        minimumAttendancePercentage: response.configuration.minimumAttendancePercentage,
      })
      toast.add({
        title: 'Attendance setting saved',
        description: `The minimum attendance requirement is now ${response.configuration.minimumAttendancePercentage}%.`,
        type: 'success',
      })
      await queryClient.invalidateQueries({ queryKey: academicPerformanceKeys.configuration() })
    },
    onError: (error) => {
      toast.add({
        title: 'Attendance setting update failed',
        description: getApiErrorMessage(error, 'Unable to update the attendance setting'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  function submitSettings(values: AttendanceSettingsFormValues) {
    updateConfigurationMutation.mutate(values)
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div>
        <h1 className="text-foreground text-2xl leading-tight font-semibold">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Set the university-wide attendance threshold used throughout the active semester.
        </p>
      </div>

      {configurationQuery.isPending ? (
        <div className="grid max-w-2xl gap-4 rounded-xl border p-6" aria-busy="true">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-9 w-full max-w-xs" />
          <Skeleton className="h-9 w-32" />
        </div>
      ) : configurationQuery.isError ? (
        <Alert variant="destructive">
          <AlertTitle>Attendance setting unavailable</AlertTitle>
          <AlertDescription>
            {getApiErrorMessage(
              configurationQuery.error,
              'Unable to load the attendance setting'
            )}
          </AlertDescription>
        </Alert>
      ) : (
        <AttendanceSettingsForm
          form={form}
          isSaving={updateConfigurationMutation.isPending}
          onSubmit={submitSettings}
        />
      )}
    </div>
  )
}
