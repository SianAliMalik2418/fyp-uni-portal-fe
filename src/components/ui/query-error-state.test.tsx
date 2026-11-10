import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, AxiosHeaders } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { QueryErrorState } from './query-error-state'

function apiError(status: number, message: string) {
  return new AxiosError('failed', 'ERR_BAD_RESPONSE', undefined, undefined, {
    status,
    statusText: '',
    data: { message },
    headers: {},
    config: { headers: new AxiosHeaders() },
  })
}

afterEach(cleanup)

describe('getApiErrorMessage', () => {
  it('hides raw server crashes behind a plain-language message', () => {
    const message = getApiErrorMessage(apiError(500, 'Internal server error'))

    expect(message).not.toMatch(/internal server error/i)
    expect(message).toMatch(/our side/i)
  })

  it('explains connection problems', () => {
    const message = getApiErrorMessage(new AxiosError('Network Error', 'ERR_NETWORK'))

    expect(message).toMatch(/internet connection/i)
  })

  it('keeps the server explanation for errors the person can act on', () => {
    expect(getApiErrorMessage(apiError(409, "This department can't be deleted"))).toBe(
      "This department can't be deleted"
    )
    expect(getApiErrorMessage(apiError(401, 'Invalid login credentials'))).toBe(
      'Invalid login credentials'
    )
  })
})

describe('QueryErrorState', () => {
  it('shows a friendly message instead of the raw error', () => {
    render(<QueryErrorState resource="programs" error={apiError(500, 'Internal server error')} />)

    expect(screen.getByRole('alert')).toHaveTextContent("We couldn't load programs")
    expect(screen.queryByText(/internal server error/i)).not.toBeInTheDocument()
  })

  it('lets the person try again', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn().mockResolvedValue(undefined)
    render(<QueryErrorState resource="programs" error={apiError(500, 'x')} onRetry={onRetry} />)

    await user.click(screen.getByRole('button', { name: /try again/i }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
