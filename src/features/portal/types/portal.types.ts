import type { IconSvgElement } from '@hugeicons/react'

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
