import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { MarkSheet } from '../types/academic-performance.types'
import { MarksEntryTable } from './MarksEntryTable'

const sheet = {
  assessment: {
    id: 'assessment-1',
    offering: { id: 'offering-1' },
    name: 'Quiz 1',
    category: 'quiz',
    maximumMarks: 10,
  },
  records: [
    {
      student: {
        id: 'student-1',
        name: 'Ayesha Noor',
        registrationNumber: 'NCBAE-2026-CS-001',
        isActive: true,
        department: null,
        program: null,
        batch: null,
        semester: null,
        section: null,
      },
      missing: true,
    },
  ],
  isDraft: true,
  missingCount: 1,
} as MarkSheet

describe('MarksEntryTable', () => {
  it('blocks marks above the maximum and saves a corrected numeric draft', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<MarksEntryTable sheet={sheet} isSaving={false} onSave={onSave} />)

    const input = screen.getByRole('spinbutton', { name: /marks for ayesha noor/i })
    await user.type(input, '11')

    expect(screen.getByText(/cannot exceed 10/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save draft/i })).toBeDisabled()

    await user.clear(input)
    await user.type(input, '8.5')
    await user.click(screen.getByRole('button', { name: /save draft/i }))

    expect(onSave).toHaveBeenCalledWith({
      records: [{ studentId: 'student-1', obtainedMarks: 8.5, status: undefined }],
    })
  })
})
