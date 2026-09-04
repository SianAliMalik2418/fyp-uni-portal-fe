import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AccountDirectoryFilters } from './AccountDirectoryFilters'

describe('account directory filters', () => {
  afterEach(cleanup)

  it('shows student academic filters and reports search changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <AccountDirectoryFilters
        batches={[]}
        departments={[]}
        kind="students"
        onChange={onChange}
        onClear={vi.fn()}
        programs={[]}
        sections={[]}
        semesters={[]}
        values={{ search: '', role: 'student' }}
      />
    )

    expect(screen.getByLabelText('Department filter')).toBeInTheDocument()
    expect(screen.getByLabelText('Program filter')).toBeInTheDocument()
    expect(screen.getByLabelText('Batch filter')).toBeInTheDocument()
    expect(screen.getByLabelText('Semester filter')).toBeInTheDocument()
    expect(screen.getByLabelText('Section filter')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Search students'), 'ayesha')

    expect(onChange).toHaveBeenLastCalledWith('search', 'a')
  })

  it('shows teacher filters and clears them from one action', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()

    render(
      <AccountDirectoryFilters
        batches={[]}
        departments={[]}
        kind="teachers"
        onChange={vi.fn()}
        onClear={onClear}
        programs={[]}
        sections={[]}
        semesters={[]}
        values={{ search: 'lecturer', role: 'teacher', designation: 'Lecturer' }}
      />
    )

    expect(screen.getByLabelText('Designation filter')).toBeInTheDocument()
    expect(screen.getByLabelText('Role filter')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(onClear).toHaveBeenCalledOnce()
  })
})
