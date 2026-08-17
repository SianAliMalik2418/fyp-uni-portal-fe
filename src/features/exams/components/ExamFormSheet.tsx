import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { AcademicReferenceSelect } from '@/features/academic-structure/components/AcademicReferenceSelect'
import type { CourseOffering } from '@/features/courses/types/course.types'
import { examFormSchema, type ExamFormValues } from '../schemas/exam.schemas'
import type { Exam } from '../types/exam.types'

const formId = 'exam-form'

const emptyValues: ExamFormValues = {
  examType: '',
  courseOfferingId: '',
  examDate: '',
  startTime: '09:00',
  endTime: '12:00',
  room: '',
  instructions: '',
}

function valuesForExam(exam: Exam): ExamFormValues {
  return {
    examType: exam.examType,
    courseOfferingId: exam.courseOfferingId,
    examDate: exam.examDate,
    startTime: exam.startTime,
    endTime: exam.endTime,
    room: exam.room,
    instructions: exam.instructions ?? '',
  }
}

export function ExamFormSheet({
  courseOfferings,
  exam,
  isOpen,
  isSaving,
  onOpenChange,
  onSubmit,
}: {
  courseOfferings: CourseOffering[]
  exam: Exam | null
  isOpen: boolean
  isSaving: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ExamFormValues) => void
}) {
  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: emptyValues,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = form

  useEffect(() => {
    if (isOpen) {
      reset(exam ? valuesForExam(exam) : emptyValues)
    }
  }, [exam, isOpen, reset])

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 space-y-0 sm:max-w-xl" side="right">
        <SheetHeader className="border-b pr-14">
          <SheetTitle>{exam ? 'Edit exam' : 'Add exam'}</SheetTitle>
          <SheetDescription>
            Choose an assigned course offering and enter the published exam details.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-230px)] flex-1 grow py-4">
          <form id={formId} className="space-y-4 px-4" noValidate onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <TextField
                control={control}
                error={errors.examType}
                label="Exam type"
                name="examType"
                placeholder="Midterm or Final"
              />

              <Field data-invalid={Boolean(errors.courseOfferingId)}>
                <Controller
                  control={control}
                  name="courseOfferingId"
                  render={({ field }) => (
                    <AcademicReferenceSelect
                      id="exam-course"
                      label="Course"
                      value={field.value}
                      options={courseOfferings.map((offering) => ({
                        value: offering.id,
                        label: `${offering.course.code} · ${offering.course.title}`,
                      }))}
                      onValueChange={field.onChange}
                      disabled={courseOfferings.length === 0}
                      placeholder="Select an assigned course"
                    />
                  )}
                />
                <FieldError id="exam-course-error" errors={[errors.courseOfferingId]} />
              </Field>

              <TextField
                control={control}
                error={errors.examDate}
                label="Exam date"
                name="examDate"
                type="date"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  control={control}
                  error={errors.startTime}
                  label="Start time"
                  name="startTime"
                  type="time"
                />
                <TextField
                  control={control}
                  error={errors.endTime}
                  label="End time"
                  name="endTime"
                  type="time"
                />
              </div>

              <TextField
                control={control}
                error={errors.room}
                label="Room"
                name="room"
                placeholder="Hall A"
              />

              <Field data-invalid={Boolean(errors.instructions)}>
                <FieldLabel htmlFor="exam-instructions">Instructions</FieldLabel>
                <Controller
                  control={control}
                  name="instructions"
                  render={({ field }) => (
                    <Textarea
                      id="exam-instructions"
                      placeholder="Optional instructions for students and teachers"
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      aria-invalid={Boolean(errors.instructions)}
                      aria-describedby={errors.instructions ? 'exam-instructions-error' : undefined}
                      ref={field.ref}
                    />
                  )}
                />
                <FieldError id="exam-instructions-error" errors={[errors.instructions]} />
              </Field>
            </FieldGroup>
          </form>
        </ScrollArea>
        <SheetFooter className="border-t">
          <Button type="submit" form={formId} disabled={isSaving}>
            {isSaving ? <Spinner data-icon="inline-start" /> : null}
            {exam ? 'Save changes' : 'Create exam'}
          </Button>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function TextField({
  control,
  error,
  label,
  name,
  placeholder,
  type = 'text',
}: {
  control: ReturnType<typeof useForm<ExamFormValues>>['control']
  error?: { message?: string }
  label: string
  name: 'examType' | 'examDate' | 'startTime' | 'endTime' | 'room'
  placeholder?: string
  type?: string
}) {
  const id = `exam-${name}`

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id} required>
        {label}
      </FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            id={id}
            type={type}
            placeholder={placeholder}
            value={field.value}
            onBlur={field.onBlur}
            onValueChange={field.onChange}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            ref={field.ref}
          />
        )}
      />
      <FieldError id={`${id}-error`} errors={[error]} />
    </Field>
  )
}
