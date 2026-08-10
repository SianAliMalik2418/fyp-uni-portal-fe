import { Calendar03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { UseFormReturn } from 'react-hook-form'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDateRange, formatInputDate, parseAppDate } from '@/shared/utils/date-format'
import type { SemesterFormValues } from '../schemas/academic-structure.schemas'

type SemesterDateRangeFieldProps = {
  form: UseFormReturn<SemesterFormValues>
}

export function SemesterDateRangeField({ form }: SemesterDateRangeFieldProps) {
  const {
    formState: { errors },
    setValue,
    watch,
  } = form
  const startsAt = watch('startsAt')
  const endsAt = watch('endsAt')
  const selectedRange: DateRange = {
    from: parseAppDate(startsAt) ?? undefined,
    to: parseAppDate(endsAt) ?? undefined,
  }
  const hasDateError = Boolean(errors.startsAt) || Boolean(errors.endsAt)

  function handleRangeChange(range?: DateRange) {
    setValue('startsAt', formatInputDate(range?.from), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    setValue('endsAt', formatInputDate(range?.to), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  return (
    <Field data-invalid={hasDateError}>
      <FieldLabel htmlFor="semesterDateRange">Date range</FieldLabel>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              id="semesterDateRange"
              type="button"
              variant="outline"
              className="w-full justify-start text-left font-normal"
              aria-invalid={hasDateError}
              aria-describedby={hasDateError ? 'semesterDateRange-error' : undefined}
            >
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-4" />
              {formatDateRange(startsAt, endsAt)}
            </Button>
          }
        />
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar mode="range" selected={selectedRange} onSelect={handleRangeChange} />
        </PopoverContent>
      </Popover>
      <FieldError id="semesterDateRange-error" errors={[errors.startsAt, errors.endsAt]} />
    </Field>
  )
}
