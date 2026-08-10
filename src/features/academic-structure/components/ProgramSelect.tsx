import type { Ref } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Program } from '@/features/programs/types/program.types'

type ProgramSelectProps = {
  error?: { message?: string }
  field: {
    name: string
    onBlur: () => void
    onChange: (value: string) => void
    ref: Ref<HTMLButtonElement>
    value: string
  }
  id: string
  programs: Program[]
}

export function ProgramSelect({ error, field, id, programs }: ProgramSelectProps) {
  const { onBlur, onChange, ref, value } = field
  const activePrograms = programs.filter((program) => program.isActive)
  const selectedProgram = programs.find((program) => program.id === value)
  const selectedLabel = selectedProgram
    ? `${selectedProgram.name} (${selectedProgram.code})`
    : 'Select program'

  return (
    <Select
      value={value}
      disabled={!activePrograms.length}
      onValueChange={(nextValue) => onChange(nextValue ?? '')}
    >
      <SelectTrigger
        id={id}
        className="w-full"
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        ref={ref}
      >
        <SelectValue>{selectedLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {activePrograms.map((program) => (
          <SelectItem key={program.id} value={program.id}>
            {program.name} ({program.code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
