import { Controller, useWatch, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import type { ProvisionedUserAccount } from '@/features/user-accounts/types/user-account.types'
import type { FeeFormValues } from '../schemas/fee.schemas'
import { formatCurrency } from '../utils/fee-formatters'

export function FeeForm({
  form,
  isSubmitting,
  onSubmit,
  student,
}: {
  form: UseFormReturn<FeeFormValues>
  isSubmitting: boolean
  onSubmit: (values: FeeFormValues) => void
  student: ProvisionedUserAccount
}) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = form
  const totalAmount = useWatch({ control, name: 'totalAmount' })
  const paidAmount = useWatch({ control, name: 'paidAmount' })
  const remainingAmount = Math.max(0, (Number(totalAmount) || 0) - (Number(paidAmount) || 0))

  return (
    <Card className="bg-background">
      <CardHeader className="border-b">
        <CardTitle>{student.fullName}</CardTitle>
        <CardDescription>
          {student.registrationNumber ?? 'No registration number'} ·{' '}
          {student.semester
            ? `${student.semester.name} (${student.semester.academicYear})`
            : 'No current semester'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" noValidate onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <AmountField
                control={control}
                error={errors.totalAmount}
                label="Total semester fee"
                name="totalAmount"
              />
              <AmountField
                control={control}
                error={errors.paidAmount}
                label="Paid amount"
                name="paidAmount"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <DateField
                control={control}
                error={errors.dueDate}
                label="Due date"
                name="dueDate"
                required
              />
              <DateField
                control={control}
                error={errors.paymentDate}
                label="Payment date"
                name="paymentDate"
              />
            </div>

            <Field data-invalid={Boolean(errors.notes)}>
              <FieldLabel htmlFor="feeNotes">Notes</FieldLabel>
              <Controller
                control={control}
                name="notes"
                render={({ field }) => (
                  <Textarea
                    id="feeNotes"
                    placeholder="Payment reference or installment details"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    aria-invalid={Boolean(errors.notes)}
                    aria-describedby={errors.notes ? 'feeNotes-error' : undefined}
                    ref={field.ref}
                  />
                )}
              />
              <FieldError id="feeNotes-error" errors={[errors.notes]} />
            </Field>
          </FieldGroup>

          <div className="bg-muted/40 flex flex-wrap items-center justify-between gap-3 rounded-md border px-4 py-3">
            <span className="text-muted-foreground text-sm">Calculated remaining amount</span>
            <span className="text-foreground font-semibold">{formatCurrency(remainingAmount)}</span>
          </div>

          <Button type="submit" className="justify-self-end" disabled={isSubmitting}>
            {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
            Save fee information
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

type FeeFieldName = 'totalAmount' | 'paidAmount'

function AmountField({
  control,
  error,
  label,
  name,
}: {
  control: UseFormReturn<FeeFormValues>['control']
  error: { message?: string } | undefined
  label: string
  name: FeeFieldName
}) {
  const id = `fee-${name}`

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
            type="number"
            min={0}
            step="0.01"
            placeholder="0"
            value={field.value || ''}
            onBlur={field.onBlur}
            onValueChange={(value) => field.onChange(value === '' ? 0 : Number(value))}
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

function DateField({
  control,
  error,
  label,
  name,
  required = false,
}: {
  control: UseFormReturn<FeeFormValues>['control']
  error: { message?: string } | undefined
  label: string
  name: 'dueDate' | 'paymentDate'
  required?: boolean
}) {
  const id = `fee-${name}`

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            id={id}
            type="date"
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
