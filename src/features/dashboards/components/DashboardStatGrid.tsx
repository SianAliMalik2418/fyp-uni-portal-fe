import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export type DashboardStat = {
  label: string
  value: string | number
  detail?: string
}

export function DashboardStatGrid({
  stats,
  isPending = false,
}: {
  stats: DashboardStat[]
  isPending?: boolean
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} size="sm" className="bg-background">
          <CardHeader className="gap-2">
            <CardDescription>{stat.label}</CardDescription>
            {isPending ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <CardTitle className="text-2xl tabular-nums">{stat.value}</CardTitle>
            )}
            {stat.detail ? <p className="text-muted-foreground text-xs">{stat.detail}</p> : null}
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
