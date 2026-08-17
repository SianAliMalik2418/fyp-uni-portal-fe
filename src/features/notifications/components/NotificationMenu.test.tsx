import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { NotificationMenu } from './NotificationMenu'

const notifications = [
  {
    id: 'notification-1',
    type: 'attendance_updated' as const,
    title: 'Attendance updated',
    message: 'Your attendance for 2026-08-17 has been updated.',
    resourcePath: '/attendance',
    isRead: false,
  },
  {
    id: 'notification-2',
    type: 'course_assigned' as const,
    title: 'Course assigned',
    message: 'Artificial Intelligence has been assigned to you.',
    isRead: true,
  },
]

describe('NotificationMenu', () => {
  it('shows unread count and supports marking one or all notifications read', () => {
    const onMarkRead = vi.fn()
    const onMarkAllRead = vi.fn()
    render(
      <NotificationMenu
        notifications={notifications}
        onMarkRead={onMarkRead}
        onMarkAllRead={onMarkAllRead}
      />
    )

    expect(screen.getByLabelText('Notifications, 1 unread')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Notifications, 1 unread'))
    fireEvent.click(screen.getByRole('button', { name: 'Mark all as read' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mark Attendance updated as read' }))

    expect(onMarkAllRead).toHaveBeenCalledOnce()
    expect(onMarkRead).toHaveBeenCalledWith('notification-1')
  })
})
