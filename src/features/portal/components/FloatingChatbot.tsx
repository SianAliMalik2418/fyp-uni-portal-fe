import { AiChat02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'

export function FloatingChatbot() {
  return (
    <aside className="fixed right-4 bottom-4 z-30 grid justify-items-end gap-2">
      <div className="border-border bg-popover text-popover-foreground w-[min(20rem,calc(100vw-2rem))] rounded-md border p-3 shadow-md">
        <div className="flex items-start gap-3">
          <span className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
            <HugeiconsIcon icon={AiChat02Icon} strokeWidth={2} className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium">AI Academic Assistant</p>
            <p className="text-muted-foreground mt-1 text-xs leading-5">
              Chat is closed for phase 1.
            </p>
          </div>
        </div>
      </div>
      <Button size="icon-lg" aria-label="Open AI academic assistant">
        <HugeiconsIcon icon={AiChat02Icon} strokeWidth={2} className="size-5" />
      </Button>
    </aside>
  )
}
