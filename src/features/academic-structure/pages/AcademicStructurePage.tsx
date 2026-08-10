import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Add01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast-manager'
import { programsQueryOptions } from '@/features/programs/api/programs-queries'
import type { Program } from '@/features/programs/types/program.types'
import {
  activateSemester,
  closeSemester,
  createBatch,
  createSection,
  createSemester,
  deleteBatch,
  deleteSection,
  deleteSemester,
  updateBatch,
  updateSection,
  updateSemester,
} from '../api/academic-structure-api'
import {
  academicStructureKeys,
  batchesQueryOptions,
  sectionsQueryOptions,
  semestersQueryOptions,
} from '../api/academic-structure-queries'
import { AcademicStructureFormSheet } from '../components/AcademicStructureFormSheet'
import { AcademicStructureTabs } from '../components/AcademicStructureTabs'
import { DeleteAcademicStructureDialog } from '../components/DeleteAcademicStructureDialog'
import {
  batchSchema,
  sectionSchema,
  semesterSchema,
  type BatchFormValues,
  type SectionFormValues,
  type SemesterFormValues,
} from '../schemas/academic-structure.schemas'
import type {
  AcademicStructureTab,
  Batch,
  DeleteAcademicStructureTarget,
  Section,
  Semester,
} from '../types/academic-structure.types'
import {
  batchValues,
  emptyBatchValues,
  emptySectionValues,
  emptySemesterValues,
  sectionValues,
  semesterValues,
  toBatchPayload,
  toSectionPayload,
  toSemesterPayload,
} from '../utils/academic-structure-mappers'

const EMPTY_PROGRAMS: Program[] = []
const EMPTY_BATCHES: Batch[] = []
const EMPTY_SEMESTERS: Semester[] = []
const EMPTY_SECTIONS: Section[] = []

export function AcademicStructurePage({ title }: { title: string }) {
  const queryClient = useQueryClient()
  const programsQuery = useQuery(programsQueryOptions)
  const batchesQuery = useQuery(batchesQueryOptions)
  const semestersQuery = useQuery(semestersQueryOptions)
  const sectionsQuery = useQuery(sectionsQueryOptions)
  const [activeTab, setActiveTab] = useState<AcademicStructureTab>('batches')
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null)
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DeleteAcademicStructureTarget | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const programs = programsQuery.data?.programs ?? EMPTY_PROGRAMS
  const batches = batchesQuery.data?.batches ?? EMPTY_BATCHES
  const semesters = semestersQuery.data?.semesters ?? EMPTY_SEMESTERS
  const sections = sectionsQuery.data?.sections ?? EMPTY_SECTIONS
  const activeSemester = semesters.find((semester) => semester.isActive)

  const batchForm = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: emptyBatchValues,
  })
  const semesterForm = useForm<SemesterFormValues>({
    resolver: zodResolver(semesterSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: emptySemesterValues,
  })
  const sectionForm = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: emptySectionValues,
  })

  useEffect(() => {
    batchForm.reset(editingBatch ? batchValues(editingBatch) : emptyBatchValues)
  }, [batchForm, editingBatch])

  useEffect(() => {
    semesterForm.reset(editingSemester ? semesterValues(editingSemester) : emptySemesterValues)
  }, [semesterForm, editingSemester])

  useEffect(() => {
    sectionForm.reset(editingSection ? sectionValues(editingSection) : emptySectionValues)
  }, [sectionForm, editingSection])

  const sectionCountsByBatch = useMemo(() => {
    const counts = new Map<string, number>()
    sections.forEach((section) => {
      counts.set(section.batch.id, (counts.get(section.batch.id) ?? 0) + 1)
    })
    return counts
  }, [sections])

  async function refreshAcademicStructure() {
    await queryClient.invalidateQueries({ queryKey: academicStructureKeys.all })
  }

  function clearForms() {
    setEditingBatch(null)
    setEditingSemester(null)
    setEditingSection(null)
    batchForm.reset(emptyBatchValues)
    semesterForm.reset(emptySemesterValues)
    sectionForm.reset(emptySectionValues)
  }

  function closeSheet() {
    setIsSheetOpen(false)
    clearForms()
  }

  function openCreateSheet(tab: AcademicStructureTab = activeTab) {
    clearForms()
    setActiveTab(tab)
    setIsSheetOpen(true)
  }

  function openBatchEditSheet(batch: Batch) {
    clearForms()
    setEditingBatch(batch)
    setActiveTab('batches')
    setIsSheetOpen(true)
  }

  function openSemesterEditSheet(semester: Semester) {
    clearForms()
    setEditingSemester(semester)
    setActiveTab('semesters')
    setIsSheetOpen(true)
  }

  function openSectionEditSheet(section: Section) {
    clearForms()
    setEditingSection(section)
    setActiveTab('sections')
    setIsSheetOpen(true)
  }

  const batchMutation = useMutation({
    mutationFn: (values: BatchFormValues) =>
      editingBatch
        ? updateBatch({ batchId: editingBatch.id, payload: toBatchPayload(values) })
        : createBatch(toBatchPayload(values)),
    onSuccess: async () => {
      toast.add({ title: 'Batch saved', description: 'Batch details were saved.', type: 'success' })
      closeSheet()
      await refreshAcademicStructure()
    },
    onError: (error) => {
      toast.add({
        title: 'Batch save failed',
        description: getApiErrorMessage(error, 'Unable to save batch'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const semesterMutation = useMutation({
    mutationFn: (values: SemesterFormValues) =>
      editingSemester
        ? updateSemester({ semesterId: editingSemester.id, payload: toSemesterPayload(values) })
        : createSemester(toSemesterPayload(values)),
    onSuccess: async () => {
      toast.add({
        title: 'Semester saved',
        description: 'Semester details were saved.',
        type: 'success',
      })
      closeSheet()
      await refreshAcademicStructure()
    },
    onError: (error) => {
      toast.add({
        title: 'Semester save failed',
        description: getApiErrorMessage(error, 'Unable to save semester'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const sectionMutation = useMutation({
    mutationFn: (values: SectionFormValues) =>
      editingSection
        ? updateSection({ sectionId: editingSection.id, payload: toSectionPayload(values) })
        : createSection(toSectionPayload(values)),
    onSuccess: async () => {
      toast.add({
        title: 'Section saved',
        description: 'Section details were saved.',
        type: 'success',
      })
      closeSheet()
      await refreshAcademicStructure()
    },
    onError: (error) => {
      toast.add({
        title: 'Section save failed',
        description: getApiErrorMessage(error, 'Unable to save section'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const activateSemesterMutation = useMutation({
    mutationFn: activateSemester,
    onSuccess: async () => {
      toast.add({
        title: 'Semester activated',
        description: 'Only this semester is active now.',
        type: 'success',
      })
      await refreshAcademicStructure()
    },
    onError: (error) => {
      toast.add({
        title: 'Semester activation failed',
        description: getApiErrorMessage(error, 'Unable to activate semester'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const closeSemesterMutation = useMutation({
    mutationFn: closeSemester,
    onSuccess: async () => {
      toast.add({
        title: 'Semester closed',
        description: 'The semester was closed and preserved.',
        type: 'success',
      })
      await refreshAcademicStructure()
    },
    onError: (error) => {
      toast.add({
        title: 'Semester close failed',
        description: getApiErrorMessage(error, 'Unable to close semester'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (target: DeleteAcademicStructureTarget) => {
      if (target.kind === 'batch') {
        return deleteBatch(target.id)
      }

      if (target.kind === 'semester') {
        return deleteSemester(target.id)
      }

      return deleteSection(target.id)
    },
    onSuccess: async (_data, target) => {
      toast.add({
        title: `${target.kind[0]?.toUpperCase()}${target.kind.slice(1)} deleted`,
        description: `${target.label} was removed from the academic structure.`,
        type: 'success',
      })
      setDeleteTarget(null)
      await refreshAcademicStructure()
    },
    onError: (error) => {
      toast.add({
        title: 'Delete failed',
        description: getApiErrorMessage(error, 'Unable to delete record'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const formTitle =
    activeTab === 'batches'
      ? editingBatch
        ? 'Edit batch'
        : 'Add batch'
      : activeTab === 'semesters'
        ? editingSemester
          ? 'Edit semester'
          : 'Add semester'
        : editingSection
          ? 'Edit section'
          : 'Add section'
  const formDescription =
    activeTab === 'batches'
      ? 'Associate a student intake with a program.'
      : activeTab === 'semesters'
        ? 'Keep one semester active for current academic work.'
        : 'Connect a program, batch, and semester to a section.'
  const formId =
    activeTab === 'batches'
      ? 'batch-form'
      : activeTab === 'semesters'
        ? 'semester-form'
        : 'section-form'
  const isSaving =
    activeTab === 'batches'
      ? batchMutation.isPending
      : activeTab === 'semesters'
        ? semesterMutation.isPending
        : sectionMutation.isPending
  const isSaveDisabled =
    isSaving ||
    (activeTab === 'batches' && !programs.some((program) => program.isActive)) ||
    (activeTab === 'sections' &&
      (!batches.some((batch) => batch.isActive) ||
        !semesters.some((semester) => !semester.isClosed)))

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl leading-tight font-semibold">{title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage batches, semesters, and sections after departments and programs are defined.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Admin only</Badge>
          {activeSemester ? (
            <Badge variant="secondary">Active: {activeSemester.name}</Badge>
          ) : (
            <Badge variant="destructive">No active semester</Badge>
          )}
          <Button type="button" onClick={() => openCreateSheet()}>
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
            {activeTab === 'batches'
              ? 'Add batch'
              : activeTab === 'semesters'
                ? 'Add semester'
                : 'Add section'}
          </Button>
        </div>
      </div>

      <AcademicStructureTabs
        activeTab={activeTab}
        batches={batches}
        batchesQuery={batchesQuery}
        onActivateSemester={(semesterId) => activateSemesterMutation.mutate(semesterId)}
        onCloseSemester={(semesterId) => closeSemesterMutation.mutate(semesterId)}
        onDelete={setDeleteTarget}
        onEditBatch={openBatchEditSheet}
        onEditSection={openSectionEditSheet}
        onEditSemester={openSemesterEditSheet}
        onTabChange={setActiveTab}
        sectionCountsByBatch={sectionCountsByBatch}
        sections={sections}
        sectionsQuery={sectionsQuery}
        semesters={semesters}
        semestersQuery={semestersQuery}
      />

      <AcademicStructureFormSheet
        activeTab={activeTab}
        batches={batches}
        batchForm={batchForm}
        formDescription={formDescription}
        formId={formId}
        formTitle={formTitle}
        isOpen={isSheetOpen}
        isSaveDisabled={isSaveDisabled}
        isSaving={isSaving}
        onClose={closeSheet}
        onSubmitBatch={(values) => batchMutation.mutate(values)}
        onSubmitSection={(values) => sectionMutation.mutate(values)}
        onSubmitSemester={(values) => semesterMutation.mutate(values)}
        programs={programs}
        programsError={programsQuery.error}
        programsHaveError={programsQuery.isError}
        sectionForm={sectionForm}
        semesterForm={semesterForm}
        semesters={semesters}
      />

      <DeleteAcademicStructureDialog
        target={deleteTarget}
        isDeleting={deleteMutation.isPending}
        onConfirm={(target) => deleteMutation.mutate(target)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
          }
        }}
      />
    </div>
  )
}
