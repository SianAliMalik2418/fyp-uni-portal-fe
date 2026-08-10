import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Add01Icon, FloppyDiskIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { toast } from '@/components/ui/toast-manager'
import { createDepartment, deleteDepartment, updateDepartment } from '../api/departments-api'
import { departmentKeys, departmentsQueryOptions } from '../api/departments-queries'
import { DeleteDepartmentDialog } from '../components/DeleteDepartmentDialog'
import { DepartmentFormCard } from '../components/DepartmentFormCard'
import { DepartmentsCard } from '../components/DepartmentsCard'
import { departmentSchema, type DepartmentFormValues } from '../schemas/department.schemas'
import type { Department } from '../types/department.types'
import {
  departmentValues,
  emptyDepartmentValues,
  toDepartmentPayload,
} from '../utils/department-mappers'

const departmentFormId = 'department-sheet-form'

export function DepartmentsPage({ title }: { title: string }) {
  const queryClient = useQueryClient()
  const departmentsQuery = useQuery(departmentsQueryOptions)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
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
      setIsSheetOpen(false)
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
      setIsSheetOpen(false)
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

  function confirmDelete() {
    if (departmentToDelete) {
      deleteDepartmentMutation.mutate(departmentToDelete.id)
    }
  }

  function openCreateSheet() {
    setEditingDepartment(null)
    reset(emptyDepartmentValues)
    setIsSheetOpen(true)
  }

  function openEditSheet(department: Department) {
    setEditingDepartment(department)
    setIsSheetOpen(true)
  }

  function closeSheet() {
    setIsSheetOpen(false)
    setEditingDepartment(null)
    reset(emptyDepartmentValues)
  }

  const isSaving = createDepartmentMutation.isPending || updateDepartmentMutation.isPending
  const departments = departmentsQuery.data?.departments ?? []

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl leading-tight font-semibold">{title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Add, edit, deactivate, or remove departments used across academic records.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={openCreateSheet}>
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
            Add department
          </Button>
        </div>
      </div>

      <DepartmentsCard
        departments={departments}
        error={departmentsQuery.error}
        isDeleting={deleteDepartmentMutation.isPending}
        isError={departmentsQuery.isError}
        isPending={departmentsQuery.isPending}
        onDelete={setDepartmentToDelete}
        onEdit={openEditSheet}
      />

      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => (!open ? closeSheet() : setIsSheetOpen(true))}
      >
        <SheetContent className="flex w-full flex-col gap-0 space-y-0 sm:max-w-xl" side="right">
          <SheetHeader className="border-b pr-14">
            <SheetTitle>{editingDepartment ? 'Edit department' : 'Add department'}</SheetTitle>
            <SheetDescription>
              Department codes are used by programs, batches, sections, and reports.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-230px)] flex-1 grow py-4">
            <DepartmentFormCard formId={departmentFormId} form={form} onSubmit={submitDepartment} />
          </ScrollArea>
          <SheetFooter className="border-t">
            <Button type="submit" form={departmentFormId} disabled={isSaving}>
              {isSaving ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <HugeiconsIcon
                  icon={editingDepartment ? FloppyDiskIcon : Add01Icon}
                  strokeWidth={2}
                  data-icon="inline-start"
                />
              )}
              {editingDepartment ? 'Save changes' : 'Add department'}
            </Button>
            <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <DeleteDepartmentDialog
        department={departmentToDelete}
        isDeleting={deleteDepartmentMutation.isPending}
        onConfirm={confirmDelete}
        onOpenChange={(open) => {
          if (!open) {
            setDepartmentToDelete(null)
          }
        }}
      />
    </div>
  )
}
