import { Calendar03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useWatch, type UseFormReturn } from 'react-hook-form'
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
    control,
    formState: { errors },
    setValue,
  } = form
  const startsAt = useWatch({ control, name: 'startsAt' })
  const endsAt = useWatch({ control, name: 'endsAt' })
  const selectedRange: DateRange = {
    from: parseAppDate(startsAt) ?? undefined,
    to: parseAppDate(endsAt) ?? undefined,
  }
  const hasDateError = Boolean(errors.startsAt) || Boolean(errors.endsAt)

  function setDateRange(start?: Date, end?: Date) {
    setValue('startsAt', formatInputDate(start), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    setValue('endsAt', formatInputDate(end), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  function handleDayClick(selectedDay: Date) {
    const currentStart = parseAppDate(startsAt) ?? undefined
    const currentEnd = parseAppDate(endsAt) ?? undefined

    if (!currentStart || currentEnd) {
      setDateRange(selectedDay)
      return
    }

    if (selectedDay.getTime() < currentStart.getTime()) {
      setDateRange(selectedDay, currentStart)
      return
    }

    setDateRange(currentStart, selectedDay)
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
          <Calendar mode="range" selected={selectedRange} onDayClick={handleDayClick} />
        </PopoverContent>
      </Popover>
      <FieldError id="semesterDateRange-error" errors={[errors.startsAt, errors.endsAt]} />
    </Field>
  )
}
