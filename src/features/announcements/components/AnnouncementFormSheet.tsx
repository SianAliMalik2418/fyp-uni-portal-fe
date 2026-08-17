import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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
import {
  announcementFormSchema,
  type AnnouncementFormValues,
} from '../schemas/announcement.schemas'
import type { Announcement } from '../types/announcement.types'

const formId = 'announcement-form'

function toLocalDateTime(value: string) {
  const date = new Date(value)
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

function emptyValues(): AnnouncementFormValues {
  return {
    title: '',
    description: '',
    publishDate: toLocalDateTime(new Date().toISOString()),
    expiryDate: '',
    isPinned: false,
    isActive: true,
    attachment: undefined,
    removeAttachment: false,
  }
}

function valuesForAnnouncement(announcement: Announcement): AnnouncementFormValues {
  return {
    title: announcement.title,
    description: announcement.description,
    publishDate: toLocalDateTime(announcement.publishDate),
    expiryDate: announcement.expiryDate ? toLocalDateTime(announcement.expiryDate) : '',
    isPinned: announcement.isPinned,
    isActive: announcement.isActive,
    attachment: undefined,
    removeAttachment: false,
  }
}

export function AnnouncementFormSheet({
  announcement,
  isOpen,
  isSaving,
  onOpenChange,
  onSubmit,
}: {
  announcement: Announcement | null
  isOpen: boolean
  isSaving: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: AnnouncementFormValues) => void
}) {
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: emptyValues(),
  })
  const { control, handleSubmit, reset, setValue, formState } = form

  useEffect(() => {
    if (isOpen) reset(announcement ? valuesForAnnouncement(announcement) : emptyValues())
  }, [announcement, isOpen, reset])

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-xl" side="right">
        <SheetHeader className="border-b pr-14">
          <SheetTitle>{announcement ? 'Edit announcement' : 'Create announcement'}</SheetTitle>
          <SheetDescription>
            Publish a university notice and optionally pin, expire, or attach a document.
          </SheetDescription>
        </SheetHeader>
        <form
          id={formId}
          className="flex-1 space-y-5 overflow-y-auto p-4"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldGroup className="gap-4">
            <TextField
              control={control}
              name="title"
              label="Title"
              placeholder="Announcement title"
            />
            <Field data-invalid={Boolean(formState.errors.description)}>
              <FieldLabel htmlFor="announcement-description" required>
                Description
              </FieldLabel>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Textarea
                    id="announcement-description"
                    rows={6}
                    placeholder="Write the announcement details"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    aria-invalid={Boolean(formState.errors.description)}
                  />
                )}
              />
              <FieldError errors={[formState.errors.description]} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                control={control}
                name="publishDate"
                label="Publish date"
                type="datetime-local"
              />
              <TextField
                control={control}
                name="expiryDate"
                label="Expiry date"
                type="datetime-local"
              />
            </div>
            <Field>
              <FieldLabel htmlFor="announcement-attachment">Attachment</FieldLabel>
              <Input
                id="announcement-attachment"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                onChange={(event) => setValue('attachment', event.target.files?.[0])}
              />
              <FieldError errors={[formState.errors.attachment]} />
            </Field>
            {announcement?.attachment ? (
              <BooleanField
                control={control}
                name="removeAttachment"
                label={`Remove current attachment (${announcement.attachment.name})`}
              />
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <BooleanField control={control} name="isPinned" label="Pin announcement" />
              <BooleanField control={control} name="isActive" label="Active" />
            </div>
          </FieldGroup>
        </form>
        <SheetFooter className="border-t">
          <Button type="submit" form={formId} disabled={isSaving}>
            {isSaving ? <Spinner data-icon="inline-start" /> : null}
            {announcement ? 'Save changes' : 'Create announcement'}
          </Button>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function TextField({
  control,
  name,
  label,
  placeholder,
  type = 'text',
}: {
  control: ReturnType<typeof useForm<AnnouncementFormValues>>['control']
  name: 'title' | 'publishDate' | 'expiryDate'
  label: string
  placeholder?: string
  type?: string
}) {
  const id = `announcement-${name}`
  return (
    <Field>
      <FieldLabel htmlFor={id} required={name !== 'expiryDate'}>
        {label}
      </FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <Input
              id={id}
              type={type}
              placeholder={placeholder}
              value={field.value}
              onBlur={field.onBlur}
              onValueChange={field.onChange}
              aria-invalid={fieldState.invalid}
            />
            <FieldError errors={[fieldState.error]} />
          </>
        )}
      />
    </Field>
  )
}

function BooleanField({
  control,
  name,
  label,
}: {
  control: ReturnType<typeof useForm<AnnouncementFormValues>>['control']
  name: 'isPinned' | 'isActive' | 'removeAttachment'
  label: string
}) {
  return (
    <Field orientation="horizontal">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Checkbox
            id={`announcement-${name}`}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <FieldLabel htmlFor={`announcement-${name}`}>{label}</FieldLabel>
    </Field>
  )
}
