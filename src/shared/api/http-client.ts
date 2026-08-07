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

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (error instanceof AxiosError) {
    const payload = error.response?.data as ApiErrorPayload | undefined
    return payload?.message ?? error.message ?? fallback
  }

  return error instanceof Error ? error.message : fallback
}
