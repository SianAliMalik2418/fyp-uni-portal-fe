import { format, isValid, parseISO } from 'date-fns'

const displayDatePattern = 'MMM d, yyyy'
const inputDatePattern = 'yyyy-MM-dd'

export function parseAppDate(value?: Date | string | null) {
  if (!value) {
    return null
  }

  const date = value instanceof Date ? value : parseISO(value)

  return isValid(date) ? date : null
}

export function formatAppDate(value?: Date | string | null, fallback = '-') {
  const date = parseAppDate(value)

  return date ? format(date, displayDatePattern) : fallback
}

export function formatInputDate(value?: Date | string | null) {
  const date = parseAppDate(value)

  return date ? format(date, inputDatePattern) : ''
}

export function formatDateRange(
  start?: Date | string | null,
  end?: Date | string | null,
  fallbackStart = 'No start',
  fallbackEnd = 'No end'
) {
  return `${formatAppDate(start, fallbackStart)} to ${formatAppDate(end, fallbackEnd)}`
}
