import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Add01Icon, FloppyDiskIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { toast } from '@/components/ui/toast-manager'
import { departmentsQueryOptions } from '@/features/departments/api/departments-queries'
import { createProgram, deleteProgram, updateProgram } from '../api/programs-api'
import { programKeys, programsQueryOptions } from '../api/programs-queries'
import { DeleteProgramDialog } from '../components/DeleteProgramDialog'
import { ProgramFormCard } from '../components/ProgramFormCard'
import { ProgramsCard } from '../components/ProgramsCard'
import { programSchema, type ProgramFormValues } from '../schemas/program.schemas'
import type { Program } from '../types/program.types'
import { emptyProgramValues, programValues, toProgramPayload } from '../utils/program-mappers'

const programFormId = 'program-sheet-form'

export function ProgramsPage({ title }: { title: string }) {
  const queryClient = useQueryClient()
  const departmentsQuery = useQuery(departmentsQueryOptions)
  const programsQuery = useQuery(programsQueryOptions)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: emptyProgramValues,
  })
  const { reset } = form

  useEffect(() => {
    reset(editingProgram ? programValues(editingProgram) : emptyProgramValues)
  }, [editingProgram, reset])

  const createProgramMutation = useMutation({
    mutationFn: createProgram,
    onSuccess: async () => {
      toast.add({
        title: 'Program created',
        description: 'The program is now available for batches and sections.',
        type: 'success',
      })
      reset(emptyProgramValues)
      setIsSheetOpen(false)
      await queryClient.invalidateQueries({ queryKey: programKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: 'Program creation failed',
        description: getApiErrorMessage(error, 'Unable to create program'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const updateProgramMutation = useMutation({
    mutationFn: updateProgram,
    onSuccess: async () => {
      toast.add({
        title: 'Program updated',
        description: 'The program details were saved.',
        type: 'success',
      })
      setEditingProgram(null)
      setIsSheetOpen(false)
      await queryClient.invalidateQueries({ queryKey: programKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: 'Program update failed',
        description: getApiErrorMessage(error, 'Unable to update program'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const deleteProgramMutation = useMutation({
    mutationFn: deleteProgram,
    onSuccess: async () => {
      toast.add({
        title: 'Program deleted',
        description: 'The program was removed from the academic structure.',
        type: 'success',
      })
      setProgramToDelete(null)
      setEditingProgram((current) => (current?.id === programToDelete?.id ? null : current))
      await queryClient.invalidateQueries({ queryKey: programKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: 'Program deletion failed',
        description: getApiErrorMessage(error, 'Unable to delete program'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  function submitProgram(values: ProgramFormValues) {
    const payload = toProgramPayload(values)

    if (editingProgram) {
      updateProgramMutation.mutate({ programId: editingProgram.id, payload })
      return
    }

    createProgramMutation.mutate(payload)
  }

  function confirmDelete() {
    if (programToDelete) {
      deleteProgramMutation.mutate(programToDelete.id)
    }
  }

  function openCreateSheet() {
    setEditingProgram(null)
    reset(emptyProgramValues)
    setIsSheetOpen(true)
  }

  function openEditSheet(program: Program) {
    setEditingProgram(program)
    setIsSheetOpen(true)
  }

  function closeSheet() {
    setIsSheetOpen(false)
    setEditingProgram(null)
    reset(emptyProgramValues)
  }

  const departments = departmentsQuery.data?.departments ?? []
  const programs = programsQuery.data?.programs ?? []
  const hasActiveDepartments = departments.some((department) => department.isActive)
  const isSaving = createProgramMutation.isPending || updateProgramMutation.isPending

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl leading-tight font-semibold">{title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create programs, map them to departments, and maintain their academic structure.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Admin only</Badge>
          <Button type="button" onClick={openCreateSheet}>
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
            Add program
          </Button>
        </div>
      </div>

      <ProgramsCard
        error={programsQuery.error}
        isDeleting={deleteProgramMutation.isPending}
        isError={programsQuery.isError}
        isPending={programsQuery.isPending}
        onDelete={setProgramToDelete}
        onEdit={openEditSheet}
        programs={programs}
      />

      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeSheet()
            return
          }

          setIsSheetOpen(true)
        }}
      >
        <SheetContent className="flex w-full flex-col gap-0 space-y-0 sm:max-w-xl" side="right">
          <SheetHeader className="border-b pr-14">
            <SheetTitle>{editingProgram ? 'Edit program' : 'Add program'}</SheetTitle>
            <SheetDescription>
              Programs connect departments to batches, semesters, sections, and courses.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-230px)] flex-1 grow py-4">
            <div className="space-y-4 px-4">
              {departmentsQuery.isError ? (
                <Alert variant="destructive">
                  <AlertTitle>Departments unavailable</AlertTitle>
                  <AlertDescription>
                    {getApiErrorMessage(departmentsQuery.error, 'Unable to load departments')}
                  </AlertDescription>
                </Alert>
              ) : null}
              <ProgramFormCard
                departments={departments}
                formId={programFormId}
                form={form}
                onSubmit={submitProgram}
              />
            </div>
          </ScrollArea>
          <SheetFooter className="border-t">
            <Button
              type="submit"
              form={programFormId}
              disabled={isSaving || departmentsQuery.isPending || !hasActiveDepartments}
            >
              <HugeiconsIcon
                icon={editingProgram ? FloppyDiskIcon : Add01Icon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              {isSaving ? 'Saving...' : editingProgram ? 'Save changes' : 'Add program'}
            </Button>
            <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <DeleteProgramDialog
        program={programToDelete}
        isDeleting={deleteProgramMutation.isPending}
        onConfirm={confirmDelete}
        onOpenChange={(open) => {
          if (!open) {
            setProgramToDelete(null)
          }
        }}
      />
    </div>
  )
}
