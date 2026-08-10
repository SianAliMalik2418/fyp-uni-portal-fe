import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Badge } from '@/components/ui/badge'
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

export function DepartmentsPage({ title }: { title: string }) {
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
          <h1 className="text-foreground text-2xl leading-tight font-semibold">{title}</h1>
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
          onCancelEdit={() => setEditingDepartment(null)}
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
