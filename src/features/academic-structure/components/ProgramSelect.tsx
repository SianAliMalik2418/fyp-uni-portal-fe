import type { ChangeEvent, Ref } from 'react'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import type { Program } from '@/features/programs/types/program.types'

type ProgramSelectProps = {
  error?: { message?: string }
  field: {
    name: string
    onBlur: () => void
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void
    ref: Ref<HTMLSelectElement>
    value: string
  }
  id: string
  programs: Program[]
}

export function ProgramSelect({ error, field, id, programs }: ProgramSelectProps) {
  const { onBlur, onChange, ref, value } = field
  const activePrograms = programs.filter((program) => program.isActive)

  return (
    <NativeSelect
      id={id}
      className="w-full"
      value={value}
      disabled={!activePrograms.length}
      onBlur={onBlur}
      onChange={onChange}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      ref={ref}
    >
      <NativeSelectOption value="">Select program</NativeSelectOption>
      {activePrograms.map((program) => (
        <NativeSelectOption key={program.id} value={program.id}>
          {program.name} ({program.code})
        </NativeSelectOption>
      ))}
    </NativeSelect>
  )
}
