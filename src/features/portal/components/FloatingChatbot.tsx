import { useEffect, useRef, useState } from 'react'
import { AiChat02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { AiAssistantChat } from '@/features/ai-assistant/components/AiAssistantChat'

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const hasOpened = useRef(false)
  const openButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen && hasOpened.current) openButtonRef.current?.focus()
  }, [isOpen])

  function openAssistant() {
    hasOpened.current = true
    setIsOpen(true)
  }

  return (
    <aside className="fixed inset-x-3 bottom-3 z-40 grid justify-items-end gap-3 sm:right-4 sm:left-auto">
      <div hidden={!isOpen} className="w-full sm:w-auto">
        <AiAssistantChat onClose={() => setIsOpen(false)} />
      </div>
      <Button
        ref={openButtonRef}
        type="button"
        size="icon-lg"
        aria-label="Open AI academic assistant"
        aria-expanded={isOpen}
        hidden={isOpen}
        className="shadow-lg"
        onClick={openAssistant}
      >
        <HugeiconsIcon icon={AiChat02Icon} strokeWidth={2} className="size-5" />
      </Button>
    </aside>
  )
}
