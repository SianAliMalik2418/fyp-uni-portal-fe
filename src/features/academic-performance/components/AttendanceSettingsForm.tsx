import { Controller, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { FloppyDiskIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { AttendanceSettingsFormValues } from '../schemas/attendance-settings.schemas'

type AttendanceSettingsFormProps = {
  form: UseFormReturn<AttendanceSettingsFormValues>
  isSaving: boolean
  onSubmit: (values: AttendanceSettingsFormValues) => void
}

export function AttendanceSettingsForm({
  form,
  isSaving,
  onSubmit,
}: AttendanceSettingsFormProps) {
  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
  } = form

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Attendance requirement</CardTitle>
        <CardDescription>
          This percentage is used for student warnings and HOD attendance shortages.
        </CardDescription>
      </CardHeader>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Field data-invalid={Boolean(errors.minimumAttendancePercentage)}>
            <FieldLabel htmlFor="minimumAttendancePercentage" required>
              Minimum attendance percentage
            </FieldLabel>
            <Controller
              control={control}
              name="minimumAttendancePercentage"
              render={({ field }) => (
                <div className="relative max-w-xs">
                  <Input
                    id="minimumAttendancePercentage"
                    type="number"
                    min={1}
                    max={100}
                    step={1}
                    className="pr-9"
                    placeholder="75"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(event) => field.onChange(event.target.valueAsNumber)}
                    aria-invalid={Boolean(errors.minimumAttendancePercentage)}
                    aria-describedby={
                      errors.minimumAttendancePercentage
                        ? 'minimumAttendancePercentage-error'
                        : 'minimumAttendancePercentage-description'
                    }
                    ref={field.ref}
                  />
                  <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm">
                    %
                  </span>
                </div>
              )}
            />
            <FieldDescription id="minimumAttendancePercentage-description">
              Enter a whole number from 1 to 100.
            </FieldDescription>
            <FieldError
              id="minimumAttendancePercentage-error"
              errors={[errors.minimumAttendancePercentage]}
            />
          </Field>
        </CardContent>
        <CardFooter className="mt-6 border-t">
          <Button type="submit" disabled={isSaving || !isDirty}>
            {isSaving ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} data-icon="inline-start" />
            )}
            Save setting
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
