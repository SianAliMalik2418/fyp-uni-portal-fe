import { useQuery } from '@tanstack/react-query'
import { teacherCoursesQueryOptions } from '../api/courses-queries'
import { CourseOfferingsCard } from '../components/CourseOfferingsCard'

export function TeacherCoursesPage({ title }: { title: string }) {
  const coursesQuery = useQuery(teacherCoursesQueryOptions)

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div>
        <h1 className="text-foreground text-2xl leading-tight font-semibold">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Course sections assigned to your teacher account.
        </p>
      </div>
      <CourseOfferingsCard
        error={coursesQuery.error}
        isError={coursesQuery.isError}
        isPending={coursesQuery.isPending}
        offerings={coursesQuery.data?.offerings ?? []}
      />
    </div>
  )
}
