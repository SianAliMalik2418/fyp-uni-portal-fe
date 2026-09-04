import type {
  Batch,
  Section,
  Semester,
} from '@/features/academic-structure/types/academic-structure.types'
import type { Program } from '@/features/programs/types/program.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ResultStatus } from '../types/academic-performance.types'

export type AcademicRecordFilterField =
  'search' | 'studentSearch' | 'programId' | 'batchId' | 'semesterId' | 'sectionId' | 'resultStatus'

export type AcademicRecordFilterValues = Partial<
  Record<AcademicRecordFilterField, string | ResultStatus>
>

type FilterOption = { label: string; value: string }

export function AcademicRecordFilters({
  batches,
  mode,
  onChange,
  onClear,
  programs,
  sections,
  semesters,
  values,
}: {
  batches: Batch[]
  mode: 'results' | 'shortages'
  onChange: (field: AcademicRecordFilterField, value?: string) => void
  onClear: () => void
  programs: Program[]
  sections: Section[]
  semesters: Semester[]
  values: AcademicRecordFilterValues
}) {
  return (
    <div className="bg-muted/20 grid gap-3 rounded-md border p-3" aria-label="Academic filters">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {mode === 'shortages' ? (
          <FilterInput
            id="student-shortage-search"
            label="Student search"
            placeholder="Search students"
            value={values.studentSearch ?? ''}
            onChange={(value) => onChange('studentSearch', value || undefined)}
          />
        ) : null}
        <FilterInput
          id="academic-course-search"
          label="Course search"
          placeholder="Search courses"
          value={values.search ?? ''}
          onChange={(value) => onChange('search', value || undefined)}
        />
        {mode === 'results' ? (
          <FilterSelect
            id="result-status-filter"
            label="Result status filter"
            options={[
              { label: 'Draft', value: 'draft' },
              { label: 'Pending', value: 'pending' },
              { label: 'Returned', value: 'returned' },
              { label: 'Approved', value: 'approved' },
            ]}
            value={values.resultStatus ?? ''}
            onChange={(value) => onChange('resultStatus', value || undefined)}
          />
        ) : null}
        <FilterSelect
          id={`${mode}-program-filter`}
          label="Program filter"
          options={programs.map((program) => ({
            label: `${program.name} (${program.code})`,
            value: program.id,
          }))}
          value={values.programId ?? ''}
          onChange={(value) => onChange('programId', value || undefined)}
        />
        <FilterSelect
          id={`${mode}-batch-filter`}
          label="Batch filter"
          options={batches.map((batch) => ({ label: batch.name, value: batch.id }))}
          value={values.batchId ?? ''}
          onChange={(value) => onChange('batchId', value || undefined)}
        />
        <FilterSelect
          id={`${mode}-semester-filter`}
          label="Semester filter"
          options={semesters.map((semester) => ({
            label: `${semester.name} (${semester.academicYear})`,
            value: semester.id,
          }))}
          value={values.semesterId ?? ''}
          onChange={(value) => onChange('semesterId', value || undefined)}
        />
        <FilterSelect
          id={`${mode}-section-filter`}
          label="Section filter"
          options={sections.map((section) => ({
            label: `${section.program.code} - ${section.name}`,
            value: section.id,
          }))}
          value={values.sectionId ?? ''}
          onChange={(value) => onChange('sectionId', value || undefined)}
        />
      </div>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="justify-self-end"
        onClick={onClear}
      >
        Clear filters
      </Button>
    </div>
  )
}

function FilterInput({
  id,
  label,
  onChange,
  placeholder,
  value,
}: {
  id: string
  label: string
  onChange: (value: string) => void
  placeholder: string
  value: string
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} placeholder={placeholder} value={value} onValueChange={onChange} />
    </div>
  )
}

function FilterSelect({
  id,
  label,
  onChange,
  options,
  value,
}: {
  id: string
  label: string
  onChange: (value: string) => void
  options: FilterOption[]
  value: string
}) {
  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value || 'all'}
        onValueChange={(next) => onChange(next === 'all' ? '' : (next ?? ''))}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue>{selectedOption?.label ?? 'All'}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
