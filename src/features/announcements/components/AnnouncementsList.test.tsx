import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AnnouncementsList } from './AnnouncementsList'

const announcement = {
  id: 'announcement-1',
  title: 'Registration deadline',
  description: 'Complete your registration before Friday.',
  publishDate: '2026-08-17T08:00:00.000Z',
  expiryDate: '2026-08-25T08:00:00.000Z',
  isPinned: true,
  isActive: true,
}

describe('AnnouncementsList', () => {
  it('renders pinned announcement details without management actions for viewers', () => {
    render(<AnnouncementsList announcements={[announcement]} canManage={false} />)

    expect(screen.getByText('Registration deadline')).toBeInTheDocument()
    expect(screen.getByText('Pinned')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Edit Registration deadline' })).toBeNull()
  })

  it('exposes edit and delete actions to administrators', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(
      <AnnouncementsList
        announcements={[announcement]}
        canManage
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Edit Registration deadline' }))
    fireEvent.click(screen.getByRole('button', { name: 'Delete Registration deadline' }))
    expect(onEdit).toHaveBeenCalledWith(announcement)
    expect(onDelete).toHaveBeenCalledWith(announcement)
  })
})
