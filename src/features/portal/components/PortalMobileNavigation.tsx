import { useState } from 'react'
import { Menu02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { PortalNavigation } from './PortalNavigation'

export function PortalMobileNavigation({ user }: { user: PortalUser }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button type="button" variant="ghost" size="icon-sm" className="md:hidden" />}
        aria-label="Open navigation"
      >
        <HugeiconsIcon icon={Menu02Icon} strokeWidth={2} />
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(20rem,88vw)] gap-0 p-0" showCloseButton>
        <SheetHeader className="sr-only">
          <SheetTitle>Portal navigation</SheetTitle>
          <SheetDescription>Navigate the protected portal workspace.</SheetDescription>
        </SheetHeader>
        <PortalNavigation user={user} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
