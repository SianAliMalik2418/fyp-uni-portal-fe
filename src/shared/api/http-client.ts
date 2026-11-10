import axios, { AxiosError } from 'axios'

type ApiErrorPayload = {
  message?: string
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export type ApiErrorKind = 'network' | 'server' | 'rate-limit' | 'request'

export function getApiErrorKind(error: unknown): ApiErrorKind {
  if (!(error instanceof AxiosError)) return 'request'
  if (!error.response) return 'network'
  if (error.response.status >= 500) return 'server'
  if (error.response.status === 429) return 'rate-limit'
  return 'request'
}

const friendlyMessages: Record<Exclude<ApiErrorKind, 'request'>, string> = {
  network: "We couldn't reach the server. Check your internet connection and try again.",
  server: 'Something went wrong on our side, not yours. Please try again in a moment.',
  'rate-limit': "You're doing that a little too fast. Please wait a moment and try again.",
}

/**
 * Connection problems, server crashes and rate limits get a plain-language message. Other
 * responses (validation, conflicts, permissions) keep the server's own explanation, because
 * it tells the person what to fix.
 */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong') {
  const kind = getApiErrorKind(error)
  if (kind !== 'request') return friendlyMessages[kind]

  if (error instanceof AxiosError) {
    const payload = error.response?.data as ApiErrorPayload | undefined
    return payload?.message ?? error.message ?? fallback
  }

  return error instanceof Error ? error.message : fallback
}
