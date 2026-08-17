import { Controller, useFieldArray, type UseFormReturn } from 'react-hook-form'
import {
  Add01Icon,
  Delete02Icon,
  Megaphone01Icon,
  SaveEnergy01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { TimetableOffering } from '../types/timetable.types'
import {
  emptyTimetableEntryValues,
  timetableDayLabels,
  timetableSlotTypeLabels,
} from '../utils/timetable-formatters'
import type { TimetableFormValues } from '../schemas/timetable.schemas'

type TimetableDraftEditorProps = {
  availableCourseOfferings: TimetableOffering[]
  form: UseFormReturn<TimetableFormValues>
  hasDraftTimetable: boolean
  hasPublishedTimetable: boolean
  isPublishing: boolean
  isSaving: boolean
  onPublish: () => void
  onSubmit: (values: TimetableFormValues) => void
  sectionName: string
  workspaceError?: unknown
}

export function TimetableDraftEditor({
  availableCourseOfferings,
  form,
  hasDraftTimetable,
  hasPublishedTimetable,
  isPublishing,
  isSaving,
  onPublish,
  onSubmit,
  sectionName,
  workspaceError,
}: TimetableDraftEditorProps) {
  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
  } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'entries',
  })

  return (
    <Card className="bg-background">
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Schedule editor</CardTitle>
            <CardDescription>
              Configure recurring class slots for section {sectionName}.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => append(emptyTimetableEntryValues())}
              disabled={isSaving || isPublishing || availableCourseOfferings.length === 0}
            >
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
              Add slot
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
            >
              <HugeiconsIcon icon={SaveEnergy01Icon} strokeWidth={2} data-icon="inline-start" />
              Save draft
            </Button>
            <Button
              type="button"
              onClick={onPublish}
              disabled={isPublishing || isSaving || !hasDraftTimetable || isDirty}
            >
              <HugeiconsIcon icon={Megaphone01Icon} strokeWidth={2} data-icon="inline-start" />
              Publish timetable
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-5">
        {workspaceError ? (
          <Alert variant="destructive">
            <AlertTitle>Workspace unavailable</AlertTitle>
            <AlertDescription>
              The section timetable workspace could not be loaded.
            </AlertDescription>
          </Alert>
        ) : null}

        {!availableCourseOfferings.length ? (
          <Alert>
            <AlertTitle>No course offerings available</AlertTitle>
            <AlertDescription>
              Assign courses and teachers to this section before configuring its timetable.
            </AlertDescription>
          </Alert>
        ) : null}

        {hasPublishedTimetable ? (
          <Alert>
            <AlertTitle>Published timetable remains live</AlertTitle>
            <AlertDescription>
              Saving this form updates the draft only. Students and teachers keep seeing the current
              published timetable until you publish again.
            </AlertDescription>
          </Alert>
        ) : null}

        {!hasDraftTimetable ? (
          <Alert>
            <AlertTitle>Save a draft before publishing</AlertTitle>
            <AlertDescription>
              Review the schedule, save it as a draft, then publish it for students and teachers.
            </AlertDescription>
          </Alert>
        ) : null}

        {hasDraftTimetable && isDirty ? (
          <Alert>
            <AlertTitle>Save your latest changes</AlertTitle>
            <AlertDescription>
              Publishing is available after the current edits have been saved to the draft.
            </AlertDescription>
          </Alert>
        ) : null}

        <form className="grid gap-4" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Field data-invalid={Boolean(errors.notes)}>
            <FieldLabel htmlFor="timetableNotes">Timetable notes</FieldLabel>
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <Textarea
                  id="timetableNotes"
                  placeholder="Optional notes for students and teachers."
                  value={field.value ?? ''}
                  onBlur={field.onBlur}
                  onChange={(event) => field.onChange(event.target.value)}
                  aria-invalid={Boolean(errors.notes)}
                  aria-describedby={errors.notes ? 'timetableNotes-error' : undefined}
                  ref={field.ref}
                />
              )}
            />
            <FieldError id="timetableNotes-error" errors={[errors.notes]} />
          </Field>

          <FieldGroup className="gap-4">
            {fields.map((field, index) => {
              const entryErrors = errors.entries?.[index]

              return (
                <Card key={field.id} className="bg-muted/20 border-dashed">
                  <CardHeader className="border-b pb-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <CardTitle className="text-base">Slot {index + 1}</CardTitle>
                        <CardDescription>Choose a course offering, time, and room.</CardDescription>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          strokeWidth={2}
                          data-icon="inline-start"
                        />
                        Remove
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <Field data-invalid={Boolean(entryErrors?.courseOfferingId)}>
                      <FieldLabel htmlFor={`timetableOffering-${index}`} required>
                        Course offering {index + 1}
                      </FieldLabel>
                      <Controller
                        control={control}
                        name={`entries.${index}.courseOfferingId`}
                        render={({ field: entryField }) => {
                          const selectedOffering = availableCourseOfferings.find(
                            (offering) => offering.id === entryField.value
                          )

                          return (
                            <Select
                              value={entryField.value}
                              onValueChange={(value) => entryField.onChange(value ?? '')}
                              disabled={!availableCourseOfferings.length}
                            >
                              <SelectTrigger
                                id={`timetableOffering-${index}`}
                                className="w-full"
                                onBlur={entryField.onBlur}
                                aria-invalid={Boolean(entryErrors?.courseOfferingId)}
                                aria-describedby={
                                  entryErrors?.courseOfferingId
                                    ? `timetableOffering-${index}-error`
                                    : undefined
                                }
                                ref={entryField.ref}
                              >
                                <SelectValue>
                                  {selectedOffering
                                    ? `${selectedOffering.course.code} · ${selectedOffering.course.title}`
                                    : 'Select course offering'}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {availableCourseOfferings.map((offering) => (
                                  <SelectItem key={offering.id} value={offering.id}>
                                    {offering.course.code} · {offering.course.title}
                                    {offering.teacher
                                      ? ` · ${offering.teacher.fullName}`
                                      : ' · Teacher needed'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )
                        }}
                      />
                      <FieldError
                        id={`timetableOffering-${index}-error`}
                        errors={[entryErrors?.courseOfferingId]}
                      />
                    </Field>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <Field data-invalid={Boolean(entryErrors?.dayOfWeek)}>
                        <FieldLabel htmlFor={`timetableDay-${index}`} required>
                          Day
                        </FieldLabel>
                        <Controller
                          control={control}
                          name={`entries.${index}.dayOfWeek`}
                          render={({ field: entryField }) => (
                            <Select
                              value={entryField.value}
                              onValueChange={(value) => entryField.onChange(value ?? 'monday')}
                            >
                              <SelectTrigger
                                id={`timetableDay-${index}`}
                                className="w-full"
                                onBlur={entryField.onBlur}
                                ref={entryField.ref}
                              >
                                <SelectValue>{timetableDayLabels[entryField.value]}</SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(timetableDayLabels).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FieldError errors={[entryErrors?.dayOfWeek]} />
                      </Field>

                      <Field data-invalid={Boolean(entryErrors?.startTime)}>
                        <FieldLabel htmlFor={`timetableStart-${index}`} required>
                          Start time
                        </FieldLabel>
                        <Controller
                          control={control}
                          name={`entries.${index}.startTime`}
                          render={({ field: entryField }) => (
                            <Input
                              id={`timetableStart-${index}`}
                              type="time"
                              value={entryField.value}
                              onBlur={entryField.onBlur}
                              onValueChange={entryField.onChange}
                              aria-invalid={Boolean(entryErrors?.startTime)}
                              ref={entryField.ref}
                            />
                          )}
                        />
                        <FieldError errors={[entryErrors?.startTime]} />
                      </Field>

                      <Field data-invalid={Boolean(entryErrors?.endTime)}>
                        <FieldLabel htmlFor={`timetableEnd-${index}`} required>
                          End time
                        </FieldLabel>
                        <Controller
                          control={control}
                          name={`entries.${index}.endTime`}
                          render={({ field: entryField }) => (
                            <Input
                              id={`timetableEnd-${index}`}
                              type="time"
                              value={entryField.value}
                              onBlur={entryField.onBlur}
                              onValueChange={entryField.onChange}
                              aria-invalid={Boolean(entryErrors?.endTime)}
                              ref={entryField.ref}
                            />
                          )}
                        />
                        <FieldError errors={[entryErrors?.endTime]} />
                      </Field>

                      <Field data-invalid={Boolean(entryErrors?.slotType)}>
                        <FieldLabel htmlFor={`timetableSlotType-${index}`} required>
                          Slot type
                        </FieldLabel>
                        <Controller
                          control={control}
                          name={`entries.${index}.slotType`}
                          render={({ field: entryField }) => (
                            <Select
                              value={entryField.value}
                              onValueChange={(value) => entryField.onChange(value ?? 'lecture')}
                            >
                              <SelectTrigger
                                id={`timetableSlotType-${index}`}
                                className="w-full"
                                onBlur={entryField.onBlur}
                                ref={entryField.ref}
                              >
                                <SelectValue>
                                  {timetableSlotTypeLabels[entryField.value]}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(timetableSlotTypeLabels).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FieldError errors={[entryErrors?.slotType]} />
                      </Field>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field data-invalid={Boolean(entryErrors?.room)}>
                        <FieldLabel htmlFor={`timetableRoom-${index}`} required>
                          Room
                        </FieldLabel>
                        <Controller
                          control={control}
                          name={`entries.${index}.room`}
                          render={({ field: entryField }) => (
                            <Input
                              id={`timetableRoom-${index}`}
                              placeholder="Lab 1"
                              value={entryField.value}
                              onBlur={entryField.onBlur}
                              onValueChange={entryField.onChange}
                              aria-invalid={Boolean(entryErrors?.room)}
                              ref={entryField.ref}
                            />
                          )}
                        />
                        <FieldError errors={[entryErrors?.room]} />
                      </Field>

                      <Field data-invalid={Boolean(entryErrors?.notes)}>
                        <FieldLabel htmlFor={`timetableEntryNotes-${index}`}>Slot notes</FieldLabel>
                        <Controller
                          control={control}
                          name={`entries.${index}.notes`}
                          render={({ field: entryField }) => (
                            <Input
                              id={`timetableEntryNotes-${index}`}
                              placeholder="Optional note"
                              value={entryField.value ?? ''}
                              onBlur={entryField.onBlur}
                              onValueChange={entryField.onChange}
                              aria-invalid={Boolean(entryErrors?.notes)}
                              ref={entryField.ref}
                            />
                          )}
                        />
                        <FieldError errors={[entryErrors?.notes]} />
                      </Field>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
