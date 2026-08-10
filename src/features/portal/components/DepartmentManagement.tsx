import { useEffect, useState, type ComponentProps, type ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Add01Icon,
  Building01Icon,
  Delete02Icon,
  Edit02Icon,
  FloppyDiskIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'
import { getApiErrorMessage } from '@/shared/api/http-client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast-manager'
import { createDepartment, deleteDepartment, updateDepartment } from '../api/departments-api'
import { departmentKeys, departmentsQueryOptions } from '../api/departments-queries'
import { departmentSchema, type DepartmentFormValues } from '../schemas/department.schemas'
import type { NavItem } from '../types/portal.types'
import type { Department, DepartmentPayload } from '../types/department.types'

const emptyDepartmentValues: DepartmentFormValues = {
  name: '',
  code: '',
  description: '',
  isActive: true,
}

function normalizeOptional(value?: string) {
  const normalized = value?.trim()
  return normalized ? normalized : undefined
}

function departmentValues(department: Department): DepartmentFormValues {
  return {
    name: department.name,
    code: department.code,
    description: department.description ?? '',
    isActive: department.isActive,
  }
}

function toDepartmentPayload(values: DepartmentFormValues): DepartmentPayload {
  return {
    name: values.name.trim(),
    code: values.code.trim().toUpperCase(),
    description: normalizeOptional(values.description),
    isActive: values.isActive,
  }
}

function RequiredLabel({ children, ...props }: ComponentProps<typeof FieldLabel>) {
  return (
    <FieldLabel {...props}>
      {children}
      <span className="text-destructive -ml-1" aria-hidden="true">
        *
      </span>
    </FieldLabel>
  )
}

type DepartmentFormCardProps = {
  editingDepartment: Department | null
  form: UseFormReturn<DepartmentFormValues>
  isSaving: boolean
  onCancelEdit: () => void
  onSubmit: (values: DepartmentFormValues) => void
}

function DepartmentFormCard({
  editingDepartment,
  form,
  isSaving,
  onCancelEdit,
  onSubmit,
}: DepartmentFormCardProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = form

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>{editingDepartment ? 'Edit department' : 'Add department'}</CardTitle>
        <CardDescription>
          Department codes are used by programs, batches, sections, and reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" noValidate onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Field data-invalid={Boolean(errors.name)}>
              <RequiredLabel htmlFor="departmentName">Department name</RequiredLabel>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    id="departmentName"
                    placeholder="Computer Science"
                    value={field.value}
                    onBlur={field.onBlur}
                    onValueChange={field.onChange}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'departmentName-error' : undefined}
                    ref={field.ref}
                  />
                )}
              />
              <FieldError id="departmentName-error" errors={[errors.name]} />
            </Field>

            <Field data-invalid={Boolean(errors.code)}>
              <RequiredLabel htmlFor="departmentCode">Department code</RequiredLabel>
              <Controller
                control={control}
                name="code"
                render={({ field }) => (
                  <Input
                    id="departmentCode"
                    placeholder="CS"
                    value={field.value}
                    onBlur={field.onBlur}
                    onValueChange={field.onChange}
                    aria-invalid={Boolean(errors.code)}
                    aria-describedby={errors.code ? 'departmentCode-error' : undefined}
                    ref={field.ref}
                  />
                )}
              />
              <FieldError id="departmentCode-error" errors={[errors.code]} />
            </Field>

            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="departmentDescription">Description</FieldLabel>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Textarea
                    id="departmentDescription"
                    placeholder="Short administrative description"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    aria-invalid={Boolean(errors.description)}
                    aria-describedby={
                      errors.description ? 'departmentDescription-error' : undefined
                    }
                    ref={field.ref}
                  />
                )}
              />
              <FieldError id="departmentDescription-error" errors={[errors.description]} />
            </Field>

            <Field orientation="horizontal">
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Switch
                    id="departmentIsActive"
                    checked={field.value}
                    disabled={field.disabled}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <FieldContent>
                <FieldLabel htmlFor="departmentIsActive">Active department</FieldLabel>
              </FieldContent>
            </Field>
          </FieldGroup>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={isSaving}>
              <HugeiconsIcon
                icon={editingDepartment ? FloppyDiskIcon : Add01Icon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              {isSaving ? 'Saving...' : editingDepartment ? 'Save changes' : 'Add department'}
            </Button>
            {editingDepartment ? (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

type DepartmentsCardProps = {
  departments: Department[]
  error: unknown
  isDeleting: boolean
  isError: boolean
  isPending: boolean
  onDelete: (department: Department) => void
  onEdit: (department: Department) => void
}

function DepartmentsCard({
  departments,
  error,
  isDeleting,
  isError,
  isPending,
  onDelete,
  onEdit,
}: DepartmentsCardProps) {
  let content: ReactNode

  if (isPending) {
    content = <p className="text-muted-foreground text-sm">Loading departments...</p>
  } else if (isError) {
    content = (
      <Alert variant="destructive">
        <AlertTitle>Departments unavailable</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(error, 'Unable to load departments')}
        </AlertDescription>
      </Alert>
    )
  } else if (departments.length) {
    content = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Department</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-32 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.id}>
              <TableCell>
                <span className="text-foreground block font-medium">{department.name}</span>
                <span className="text-muted-foreground block">
                  {department.description ?? 'No description'}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{department.code}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={department.isActive ? 'outline' : 'destructive'}>
                  {department.isActive ? 'active' : 'inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${department.name}`}
                    onClick={() => onEdit(department)}
                  >
                    <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${department.name}`}
                    disabled={isDeleting}
                    onClick={() => onDelete(department)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  } else {
    content = (
      <div className="bg-muted/30 grid min-h-48 place-items-center rounded-md border border-dashed px-4 text-center">
        <div className="grid justify-items-center gap-2">
          <div className="bg-background text-muted-foreground grid size-10 place-items-center rounded-md border">
            <HugeiconsIcon icon={Building01Icon} strokeWidth={2} className="size-5" />
          </div>
          <p className="text-foreground text-sm font-medium">No departments yet</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Add the first department to start building the academic hierarchy.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Department list</CardTitle>
        <CardDescription>Manage the academic departments available to admins.</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}

export function DepartmentManagement({ item }: { item: NavItem }) {
  const queryClient = useQueryClient()
  const departmentsQuery = useQuery(departmentsQueryOptions)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null)
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: emptyDepartmentValues,
  })
  const { reset } = form

  useEffect(() => {
    reset(editingDepartment ? departmentValues(editingDepartment) : emptyDepartmentValues)
  }, [editingDepartment, reset])

  const createDepartmentMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: async () => {
      toast.add({
        title: 'Department created',
        description: 'The department is now available for academic setup.',
        type: 'success',
      })
      reset(emptyDepartmentValues)
      await queryClient.invalidateQueries({ queryKey: departmentKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: 'Department creation failed',
        description: getApiErrorMessage(error, 'Unable to create department'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const updateDepartmentMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: async () => {
      toast.add({
        title: 'Department updated',
        description: 'The department details were saved.',
        type: 'success',
      })
      setEditingDepartment(null)
      await queryClient.invalidateQueries({ queryKey: departmentKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: 'Department update failed',
        description: getApiErrorMessage(error, 'Unable to update department'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const deleteDepartmentMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: async () => {
      toast.add({
        title: 'Department deleted',
        description: 'The department was removed from the academic structure.',
        type: 'success',
      })
      setDepartmentToDelete(null)
      setEditingDepartment((current) => (current?.id === departmentToDelete?.id ? null : current))
      await queryClient.invalidateQueries({ queryKey: departmentKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: 'Department deletion failed',
        description: getApiErrorMessage(error, 'Unable to delete department'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  function submitDepartment(values: DepartmentFormValues) {
    const payload = toDepartmentPayload(values)

    if (editingDepartment) {
      updateDepartmentMutation.mutate({ departmentId: editingDepartment.id, payload })
      return
    }

    createDepartmentMutation.mutate(payload)
  }

  function cancelEdit() {
    setEditingDepartment(null)
  }

  function confirmDelete() {
    if (departmentToDelete) {
      deleteDepartmentMutation.mutate(departmentToDelete.id)
    }
  }

  const isSaving = createDepartmentMutation.isPending || updateDepartmentMutation.isPending
  const departments = departmentsQuery.data?.departments ?? []

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl leading-tight font-semibold">{item.label}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Add, edit, deactivate, or remove departments used across academic records.
          </p>
        </div>
        <Badge variant="outline">Admin only</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <DepartmentFormCard
          editingDepartment={editingDepartment}
          form={form}
          isSaving={isSaving}
          onCancelEdit={cancelEdit}
          onSubmit={submitDepartment}
        />
        <DepartmentsCard
          departments={departments}
          error={departmentsQuery.error}
          isDeleting={deleteDepartmentMutation.isPending}
          isError={departmentsQuery.isError}
          isPending={departmentsQuery.isPending}
          onDelete={setDepartmentToDelete}
          onEdit={setEditingDepartment}
        />
      </div>

      <AlertDialog
        open={Boolean(departmentToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setDepartmentToDelete(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete department?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {departmentToDelete?.name ?? 'this department'} from the portal. Continue
              only if it is not used by active academic records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteDepartmentMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteDepartmentMutation.isPending}
              onClick={confirmDelete}
            >
              {deleteDepartmentMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
