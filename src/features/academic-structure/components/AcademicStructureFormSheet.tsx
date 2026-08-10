import type { UseFormReturn } from 'react-hook-form'
import { FloppyDiskIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import type { Program } from '@/features/programs/types/program.types'
import type {
  BatchFormValues,
  SectionFormValues,
  SemesterFormValues,
} from '../schemas/academic-structure.schemas'
import type { AcademicStructureTab, Batch, Semester } from '../types/academic-structure.types'
import { BatchForm } from './BatchForm'
import { SectionForm } from './SectionForm'
import { SemesterForm } from './SemesterForm'

type AcademicStructureFormSheetProps = {
  activeTab: AcademicStructureTab
  batches: Batch[]
  batchForm: UseFormReturn<BatchFormValues>
  formDescription: string
  formId: string
  formTitle: string
  isOpen: boolean
  isSaveDisabled: boolean
  isSaving: boolean
  onClose: () => void
  onSubmitBatch: (values: BatchFormValues) => void
  onSubmitSection: (values: SectionFormValues) => void
  onSubmitSemester: (values: SemesterFormValues) => void
  programs: Program[]
  programsError: unknown
  programsHaveError: boolean
  sectionForm: UseFormReturn<SectionFormValues>
  semesterForm: UseFormReturn<SemesterFormValues>
  semesters: Semester[]
}

export function AcademicStructureFormSheet({
  activeTab,
  batches,
  batchForm,
  formDescription,
  formId,
  formTitle,
  isOpen,
  isSaveDisabled,
  isSaving,
  onClose,
  onSubmitBatch,
  onSubmitSection,
  onSubmitSemester,
  programs,
  programsError,
  programsHaveError,
  sectionForm,
  semesterForm,
  semesters,
}: AcademicStructureFormSheetProps) {
  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <SheetContent className="flex w-full flex-col gap-0 space-y-0 sm:max-w-xl" side="right">
        <SheetHeader className="border-b pr-14">
          <SheetTitle>{formTitle}</SheetTitle>
          <SheetDescription>{formDescription}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-230px)] flex-1 grow py-4">
          <div className="space-y-4 px-4">
            {programsHaveError && activeTab !== 'semesters' ? (
              <Alert variant="destructive">
                <AlertTitle>Programs unavailable</AlertTitle>
                <AlertDescription>
                  {getApiErrorMessage(programsError, 'Unable to load programs')}
                </AlertDescription>
              </Alert>
            ) : null}
            {activeTab === 'batches' ? (
              <BatchForm
                form={batchForm}
                formId={formId}
                onSubmit={onSubmitBatch}
                programs={programs}
              />
            ) : null}
            {activeTab === 'semesters' ? (
              <SemesterForm form={semesterForm} formId={formId} onSubmit={onSubmitSemester} />
            ) : null}
            {activeTab === 'sections' ? (
              <SectionForm
                batches={batches}
                form={sectionForm}
                formId={formId}
                onSubmit={onSubmitSection}
                programs={programs}
                semesters={semesters}
              />
            ) : null}
          </div>
        </ScrollArea>
        <SheetFooter className="border-t">
          <Button type="submit" form={formId} disabled={isSaveDisabled}>
            {isSaving ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} data-icon="inline-start" />
            )}
            {formTitle}
          </Button>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
