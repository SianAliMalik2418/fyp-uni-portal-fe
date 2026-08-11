import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import type { Section } from '@/features/academic-structure/types/academic-structure.types'
import type { Course } from '../types/course.types'

type CourseAssignmentCardProps = {
  courses: Course[]
  isSaving: boolean
  onSave: () => void
  onSelectedCourseIdsChange: (courseIds: string[]) => void
  onSectionChange: (sectionId: string) => void
  sections: Section[]
  selectedCourseIds: string[]
  selectedSectionId: string
}

export function CourseAssignmentCard({
  courses,
  isSaving,
  onSave,
  onSelectedCourseIdsChange,
  onSectionChange,
  sections,
  selectedCourseIds,
  selectedSectionId,
}: CourseAssignmentCardProps) {
  const selectedSection = sections.find((section) => section.id === selectedSectionId)
  const assignableCourses = selectedSection
    ? courses.filter(
        (course) =>
          course.isActive &&
          course.program.id === selectedSection.program.id &&
          course.semester.id === selectedSection.semester.id
      )
    : []

  function toggleCourse(courseId: string, checked: boolean) {
    const nextIds = checked
      ? [...selectedCourseIds, courseId]
      : selectedCourseIds.filter((selectedCourseId) => selectedCourseId !== courseId)
    onSelectedCourseIdsChange([...new Set(nextIds)])
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Course assignment</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4">
          <Field>
            <FieldLabel htmlFor="sectionAssignment">Section</FieldLabel>
            <Select
              value={selectedSectionId}
              onValueChange={(value) => onSectionChange(value ?? '')}
            >
              <SelectTrigger id="sectionAssignment" className="w-full">
                <SelectValue>
                  {selectedSection
                    ? `${selectedSection.program.code} · ${selectedSection.semester.name} · ${selectedSection.name}`
                    : 'Select section'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.program.code} · {section.semester.name} · {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid gap-2">
            {assignableCourses.length ? (
              assignableCourses.map((course) => (
                <Field key={course.id} orientation="horizontal">
                  <Checkbox
                    id={`course-${course.id}`}
                    checked={selectedCourseIds.includes(course.id)}
                    onCheckedChange={(checked) => toggleCourse(course.id, Boolean(checked))}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={`course-${course.id}`}>
                      {course.code} · {course.title}
                    </FieldLabel>
                    <p className="text-muted-foreground text-xs">{course.creditHours} credits</p>
                  </FieldContent>
                </Field>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                {selectedSection
                  ? 'No active courses match this section program and semester.'
                  : 'Select a section to choose courses.'}
              </p>
            )}
          </div>

          <div>
            <Button type="button" disabled={!selectedSectionId || isSaving} onClick={onSave}>
              {isSaving ? <Spinner data-icon="inline-start" /> : null}
              Save assignment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
