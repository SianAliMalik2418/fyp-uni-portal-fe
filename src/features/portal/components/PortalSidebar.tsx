import { NavLink } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { roleLabels, roleNavigation } from '@/features/portal/constants/portal-navigation'
import { portalBrand } from '@/shared/constants/branding'

export function PortalSidebar({ user }: { user: PortalUser }) {
  const navigation = roleNavigation[user.role]

  return (
    <aside className="border-border bg-card border-b md:border-r md:border-b-0">
      <div className="flex h-full flex-col">
        <div className="border-border border-b px-4 py-4 md:py-5">
          <div className="flex items-center gap-2">
            <span className="border-border bg-background flex size-8 items-center justify-center overflow-hidden rounded-md border">
              <img
                src={portalBrand.logoSrc}
                alt={portalBrand.logoAlt}
                className="size-full object-contain"
              />
            </span>
            <div className="min-w-0">
              <p className="text-card-foreground truncate text-sm font-medium">
                {portalBrand.name}
              </p>
              <p className="text-muted-foreground text-xs">{roleLabels[user.role]} workspace</p>
            </div>
          </div>
        </div>

        <nav
          className="grid max-h-64 gap-1 overflow-y-auto p-2 md:max-h-none"
          aria-label={`${roleLabels[user.role]} navigation`}
        >
          {navigation.map((item) => (
            <NavLink
              key={item.id}
              to={`/${item.id}`}
              className={({ isActive }) =>
                [
                  'text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring/30 flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-xs transition-colors outline-none focus-visible:ring-2',
                  isActive
                    ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                    : '',
                ].join(' ')
              }
            >
              <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-3.5" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
