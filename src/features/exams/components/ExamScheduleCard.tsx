import { format, parseISO } from 'date-fns'
import { Delete02Icon, Edit02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Exam } from '../types/exam.types'

export function ExamScheduleCard({
  canManage = false,
  emptyMessage,
  exams,
  onDelete,
  onEdit,
  title,
}: {
  canManage?: boolean
  emptyMessage: string
  exams: Exam[]
  onDelete?: (exam: Exam) => void
  onEdit?: (exam: Exam) => void
  title: string
}) {
  return (
    <Card className="bg-background">
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {exams.length} scheduled exam{exams.length === 1 ? '' : 's'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {exams.length === 0 ? (
          <div className="grid min-h-44 place-items-center text-center">
            <p className="text-muted-foreground text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {exams.map((exam) => (
              <article key={exam.id} className="border-border rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{exam.examType}</Badge>
                      <span className="text-muted-foreground text-xs">{exam.course.code}</span>
                    </div>
                    <h3 className="text-foreground mt-2 font-medium">{exam.course.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {format(parseISO(exam.examDate), 'd MMMM yyyy')} · {exam.startTime}–
                      {exam.endTime}
                    </p>
                  </div>
                  {canManage ? (
                    <div className="flex shrink-0 gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${exam.examType} exam for ${exam.course.title}`}
                        onClick={() => onEdit?.(exam)}
                      >
                        <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${exam.examType} exam for ${exam.course.title}`}
                        onClick={() => onDelete?.(exam)}
                      >
                        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                      </Button>
                    </div>
                  ) : null}
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground text-xs">Room</dt>
                    <dd>{exam.room}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">Section</dt>
                    <dd>Section {exam.section.name}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-muted-foreground text-xs">Program and semester</dt>
                    <dd>
                      {exam.program.code} · {exam.semester.name} ({exam.semester.academicYear})
                    </dd>
                  </div>
                  {exam.instructions ? (
                    <div className="col-span-2 border-t pt-2">
                      <dt className="text-muted-foreground text-xs">Instructions</dt>
                      <dd className="mt-1 whitespace-pre-wrap">{exam.instructions}</dd>
                    </div>
                  ) : null}
                </dl>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
