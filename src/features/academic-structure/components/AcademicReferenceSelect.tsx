import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type AcademicReferenceOption = {
  value: string
  label: string
}

export function AcademicReferenceSelect({
  disabled = false,
  id,
  label,
  onValueChange,
  options,
  placeholder,
  value,
}: {
  disabled?: boolean
  id: string
  label: string
  onValueChange: (value: string) => void
  options: AcademicReferenceOption[]
  placeholder?: string
  value: string
}) {
  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <Select
        value={value}
        onValueChange={(nextValue) => onValueChange(nextValue ?? '')}
        disabled={disabled}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue>
            {selectedOption?.label ?? placeholder ?? `Select ${label.toLowerCase()}`}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
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
