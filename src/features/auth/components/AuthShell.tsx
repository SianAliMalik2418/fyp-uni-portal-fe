import type { ReactNode } from 'react'
import { portalBrand } from '@/shared/constants/branding'
import { Card } from '@/components/ui/card'

type AuthShellProps = {
  children: ReactNode
  supportingCopy: string
}

export function AuthShell({ children, supportingCopy }: AuthShellProps) {
  return (
    <main className="bg-muted/30 flex min-h-svh items-center justify-center px-4 py-8">
      <div className="bg-card text-card-foreground grid w-full max-w-5xl overflow-hidden rounded-lg border shadow-xs md:grid-cols-[minmax(0,1fr)_420px]">
        <section className="bg-background flex min-h-64 flex-col justify-between gap-8 border-b p-6 md:min-h-[560px] md:border-r md:border-b-0 md:p-8">
          <div className="flex items-center gap-3">
            <span className="border-border bg-card flex size-12 items-center justify-center overflow-hidden rounded-md border">
              <img
                src={portalBrand.logoSrc}
                alt={portalBrand.logoAlt}
                className="size-full object-contain"
              />
            </span>
            <div className="min-w-0">
              <p className="text-foreground truncate text-base font-semibold">{portalBrand.name}</p>
              <p className="text-muted-foreground text-sm">{portalBrand.tagline}</p>
            </div>
          </div>

          <div className="max-w-xl">
            <h1 className="text-foreground text-3xl leading-tight font-semibold md:text-4xl">
              Secure access for every academic role.
            </h1>
            <p className="text-muted-foreground mt-3 max-w-md text-sm leading-6">
              {supportingCopy}
            </p>
          </div>

          <div className="text-muted-foreground grid gap-2 text-xs sm:grid-cols-3">
            <StatusPoint label="Admin provisioned" />
            <StatusPoint label="Role protected" />
            <StatusPoint label="Session verified" />
          </div>
        </section>

        <section className="flex items-center justify-center p-4 md:p-6">
          <Card className="w-full border-0 shadow-none md:border md:shadow-xs">{children}</Card>
        </section>
      </div>
    </main>
  )
}

function StatusPoint({ label }: { label: string }) {
  return (
    <div className="border-border bg-muted/40 text-foreground flex min-h-9 items-center gap-2 rounded-md border px-3 py-2">
      <span className="bg-primary size-1.5 rounded-full" />
      <span className="truncate">{label}</span>
    </div>
  )
}
