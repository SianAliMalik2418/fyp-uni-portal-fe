import type { IconSvgElement } from '@hugeicons/react'
import type { UserRole } from '@/features/auth/types/auth.types'

export type NavItem = {
  id: string
  label: string
  icon: IconSvgElement
}

export type ModulePlaceholderStat = {
  label: string
  value: string
}

export type ModulePlaceholderContent = {
  emptyTitle: string
  emptyDescription: string
  readinessTitle: string
  readinessDescription: string
  nextIntegrationLabel: string
  nextIntegrationValue: string
}

export type ModulePlaceholderDetails = {
  stats?: Partial<Record<UserRole, ModulePlaceholderStat[]>>
  emptyStates?: Partial<
    Record<UserRole, Pick<ModulePlaceholderContent, 'emptyTitle' | 'emptyDescription'>>
  >
  readinessDescription?: string
  nextIntegrationValue?: string
}
