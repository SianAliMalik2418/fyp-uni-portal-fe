import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import type { SemesterFormValues } from '../schemas/academic-structure.schemas'
import { emptySemesterValues } from '../utils/academic-structure-mappers'
import { SemesterDateRangeField } from './SemesterDateRangeField'

function DateRangeFieldTest() {
  const form = useForm<SemesterFormValues>({
    defaultValues: emptySemesterValues,
  })

  return <SemesterDateRangeField form={form} />
}

describe('SemesterDateRangeField', () => {
  it('updates the displayed range when start and end dates are selected', async () => {
    const user = userEvent.setup()
    render(<DateRangeFieldTest />)

    await user.click(screen.getByRole('button', { name: /date range/i }))
    await user.click(within(screen.getByRole('grid')).getByRole('button', { name: /august 12/i }))
    expect(screen.getByText(/aug 12, 2026 to no end/i)).toBeVisible()

    await user.click(within(screen.getByRole('grid')).getByRole('button', { name: /august 15/i }))

    expect(screen.getByText(/aug 12, 2026 to aug 15, 2026/i)).toBeVisible()
  })
})
