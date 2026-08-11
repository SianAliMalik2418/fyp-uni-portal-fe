import { useQuery } from '@tanstack/react-query'
import { studentCoursesQueryOptions } from '../api/courses-queries'
import { CourseOfferingsCard } from '../components/CourseOfferingsCard'

export function StudentCoursesPage({ title }: { title: string }) {
  const coursesQuery = useQuery(studentCoursesQueryOptions)

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div>
        <h1 className="text-foreground text-2xl leading-tight font-semibold">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Courses assigned to your current section.
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
