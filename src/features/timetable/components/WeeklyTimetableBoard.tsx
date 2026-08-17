import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Timetable, TimetableDay } from '../types/timetable.types'
import {
  formatSectionLabel,
  timetableDayLabels,
  timetableSlotTypeLabels,
} from '../utils/timetable-formatters'

const orderedDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const satisfies TimetableDay[]

type WeeklyTimetableBoardProps = {
  timetable: Timetable
  title?: string
  description?: string
  showTeacher?: boolean
}

export function WeeklyTimetableBoard({
  timetable,
  title,
  description,
  showTeacher = true,
}: WeeklyTimetableBoardProps) {
  return (
    <Card className="bg-background">
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{title ?? 'Weekly timetable'}</CardTitle>
            <CardDescription>{description ?? formatSectionLabel(timetable)}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={timetable.status === 'published' ? 'secondary' : 'outline'}>
              {timetable.status === 'published' ? 'Published' : 'Draft'} v{timetable.version}
            </Badge>
            {timetable.publishedAt ? (
              <Badge variant="outline">
                Published {new Date(timetable.publishedAt).toLocaleDateString()}
              </Badge>
            ) : null}
          </div>
        </div>
        {timetable.notes ? (
          <p className="text-muted-foreground text-sm">{timetable.notes}</p>
        ) : null}
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {orderedDays.map((day) => {
          const entries = timetable.entries.filter((entry) => entry.dayOfWeek === day)

          return (
            <section key={day} className="border-border rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{timetableDayLabels[day]}</h3>
                <Badge variant="outline">{entries.length} slots</Badge>
              </div>

              {entries.length === 0 ? (
                <p className="text-muted-foreground text-sm">No classes scheduled.</p>
              ) : (
                <div className="grid gap-3">
                  {entries.map((entry) => (
                    <article key={entry.id} className="bg-muted/35 rounded-md border p-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">
                            {entry.courseOffering.course.code} · {entry.courseOffering.course.title}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {entry.startTime} - {entry.endTime}
                          </p>
                        </div>
                        <Badge variant="outline">{timetableSlotTypeLabels[entry.slotType]}</Badge>
                      </div>
                      <div className="text-muted-foreground mt-2 grid gap-1 text-sm">
                        <p>Room: {entry.room}</p>
                        {showTeacher && entry.courseOffering.teacher ? (
                          <p>Teacher: {entry.courseOffering.teacher.fullName}</p>
                        ) : null}
                        {entry.notes ? <p>{entry.notes}</p> : null}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </CardContent>
    </Card>
  )
}
