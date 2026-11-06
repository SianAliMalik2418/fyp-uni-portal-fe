import { Skeleton } from '@/components/ui/skeleton'

export function PortalSkeleton() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-5 p-4 md:p-6" aria-busy="true">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72 max-w-full" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-64" />
    </div>
  )
}
