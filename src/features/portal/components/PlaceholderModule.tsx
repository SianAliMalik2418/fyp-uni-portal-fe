import { ArrowRight01Icon, Database01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { PortalUser } from '@/features/auth/types/auth.types'
import {
  academicPerformancePlaceholders,
  modulePlaceholderContent,
  modulePlaceholderStats,
} from '../constants/portal-placeholders'
import { roleLabels } from '../constants/portal-navigation'
import type { NavItem } from '../types/portal.types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function PlaceholderModule({ user, item }: { user: PortalUser; item: NavItem }) {
  const moduleDetails = academicPerformancePlaceholders[item.id]
  const roleEmptyState = moduleDetails?.emptyStates?.[user.role]
  const stats = moduleDetails?.stats?.[user.role] ?? modulePlaceholderStats[user.role]
  const emptyTitle = roleEmptyState?.emptyTitle ?? modulePlaceholderContent.emptyTitle
  const emptyDescription =
    roleEmptyState?.emptyDescription ?? modulePlaceholderContent.emptyDescription
  const readinessDescription =
    moduleDetails?.readinessDescription ?? modulePlaceholderContent.readinessDescription
  const nextIntegrationValue =
    moduleDetails?.nextIntegrationValue ?? modulePlaceholderContent.nextIntegrationValue

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl leading-tight font-semibold">{item.label}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {roleLabels[user.role]} module access is ready for backend data.
          </p>
        </div>
        <Badge variant="outline">{user.accountStatus}</Badge>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} size="sm" className="bg-background">
            <CardHeader className="gap-2">
              <CardDescription>{stat.label}</CardDescription>
              <div className="flex items-end justify-between gap-3">
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
                <span className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
                  <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-4" />
                </span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="bg-background">
        <CardHeader className="border-border border-b">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>{item.label} workspace</CardTitle>
              <CardDescription>
                This protected area is available for {roleLabels[user.role].toLowerCase()} users.
              </CardDescription>
            </div>
            <span className="bg-primary text-primary-foreground hidden size-9 items-center justify-center rounded-md sm:flex">
              <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-4" />
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 grid min-h-56 place-items-center rounded-md border border-dashed px-4 py-10 text-center">
            <div className="grid max-w-sm justify-items-center gap-3">
              <span className="border-border bg-background text-muted-foreground flex size-11 items-center justify-center rounded-md border">
                <HugeiconsIcon icon={Database01Icon} strokeWidth={2} className="size-5" />
              </span>
              <div className="grid gap-1">
                <p className="text-foreground text-sm font-medium">{emptyTitle}</p>
                <p className="text-muted-foreground text-sm leading-6">{emptyDescription}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="text-base">{modulePlaceholderContent.readinessTitle}</CardTitle>
            <CardDescription>{readinessDescription}</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-background">
          <CardHeader>
            <CardDescription>{modulePlaceholderContent.nextIntegrationLabel}</CardDescription>
            <CardTitle className="flex items-center gap-2 text-base">
              {nextIntegrationValue}
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
