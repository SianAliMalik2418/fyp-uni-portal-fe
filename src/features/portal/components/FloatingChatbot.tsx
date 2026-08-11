import { useQuery } from '@tanstack/react-query'
import { AiChat02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { studentServiceContextQueryOptions } from '@/features/student-services/api/student-services-queries'

export function FloatingChatbot() {
  const contextQuery = useQuery(studentServiceContextQueryOptions)
  const courseCount = contextQuery.data?.enrolledCourses.length ?? 0
  const firstTeacher = contextQuery.data?.enrolledCourses.find((course) => course.teacher)?.teacher
  const contextText = contextQuery.isPending
    ? 'Loading student course context.'
    : `${courseCount} enrolled course${courseCount === 1 ? '' : 's'} ready for future AI context.`

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
              {contextText}
              {firstTeacher ? ` Assigned teacher: ${firstTeacher.fullName}.` : ''}
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
