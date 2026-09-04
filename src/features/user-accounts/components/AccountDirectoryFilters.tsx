import type {
  Batch,
  Section,
  Semester,
} from '@/features/academic-structure/types/academic-structure.types'
import type { Department } from '@/features/departments/types/department.types'
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
import type { UserAccountListQuery } from '../types/user-account.types'

type FilterField = Exclude<keyof UserAccountListQuery, 'page' | 'limit'>
type FilterValues = Partial<UserAccountListQuery>
type FilterOption = { label: string; value: string }

export function AccountDirectoryFilters({
  batches,
  departments,
  kind,
  onChange,
  onClear,
  programs,
  sections,
  semesters,
  values,
}: {
  batches: Batch[]
  departments: Department[]
  kind: 'students' | 'teachers' | 'all'
  onChange: (field: FilterField, value: string | boolean | undefined) => void
  onClear: () => void
  programs: Program[]
  sections: Section[]
  semesters: Semester[]
  values: FilterValues
}) {
  const isStudentList = kind === 'students'
  const isTeacherList = kind === 'teachers'
  const searchLabel = isStudentList
    ? 'Search students'
    : isTeacherList
      ? 'Search teachers'
      : 'Search accounts'

  return (
    <div className="bg-background grid gap-3 rounded-lg border p-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="account-directory-search">{searchLabel}</Label>
          <Input
            id="account-directory-search"
            placeholder={searchLabel}
            value={values.search ?? ''}
            onValueChange={(value) => onChange('search', value || undefined)}
          />
        </div>

        <FilterSelect
          id="account-status-filter"
          label="Account status filter"
          options={[
            { label: 'Active', value: 'true' },
            { label: 'Inactive', value: 'false' },
          ]}
          value={values.isActive === undefined ? '' : String(values.isActive)}
          onChange={(value) => onChange('isActive', value ? value === 'true' : undefined)}
        />

        {isTeacherList || kind === 'all' ? (
          <FilterSelect
            id="account-role-filter"
            label="Role filter"
            options={[
              { label: 'Teacher', value: 'teacher' },
              { label: 'HOD', value: 'hod' },
            ]}
            value={values.role ?? ''}
            onChange={(value) => onChange('role', value || undefined)}
          />
        ) : null}

        <FilterSelect
          id="account-department-filter"
          label="Department filter"
          options={departments.map((item) => ({
            label: `${item.name} (${item.code})`,
            value: item.id,
          }))}
          value={values.departmentId ?? ''}
          onChange={(value) => onChange('departmentId', value || undefined)}
        />

        {isStudentList || kind === 'all' ? (
          <>
            <FilterSelect
              id="account-program-filter"
              label="Program filter"
              options={programs.map((item) => ({
                label: `${item.name} (${item.code})`,
                value: item.id,
              }))}
              value={values.programId ?? ''}
              onChange={(value) => onChange('programId', value || undefined)}
            />
            <FilterSelect
              id="account-batch-filter"
              label="Batch filter"
              options={batches.map((item) => ({ label: item.name, value: item.id }))}
              value={values.batchId ?? ''}
              onChange={(value) => onChange('batchId', value || undefined)}
            />
            <FilterSelect
              id="account-semester-filter"
              label="Semester filter"
              options={semesters.map((item) => ({
                label: `${item.name} (${item.academicYear})`,
                value: item.id,
              }))}
              value={values.semesterId ?? ''}
              onChange={(value) => onChange('semesterId', value || undefined)}
            />
            <FilterSelect
              id="account-section-filter"
              label="Section filter"
              options={sections.map((item) => ({
                label: `${item.program.code} - ${item.name}`,
                value: item.id,
              }))}
              value={values.sectionId ?? ''}
              onChange={(value) => onChange('sectionId', value || undefined)}
            />
          </>
        ) : null}

        {isTeacherList || kind === 'all' ? (
          <div className="grid gap-1.5">
            <Label htmlFor="account-designation-filter">Designation filter</Label>
            <Input
              id="account-designation-filter"
              placeholder="Lecturer"
              value={values.designation ?? ''}
              onValueChange={(value) => onChange('designation', value || undefined)}
            />
          </div>
        ) : null}
      </div>

      <div className="flex justify-end">
        <Button type="button" size="sm" variant="ghost" onClick={onClear}>
          Clear filters
        </Button>
      </div>
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
