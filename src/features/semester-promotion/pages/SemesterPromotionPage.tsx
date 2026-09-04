import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sectionsQueryOptions } from '@/features/academic-structure/api/academic-structure-queries'
import { AcademicReferenceSelect } from '@/features/academic-structure/components/AcademicReferenceSelect'
import { userAccountKeys } from '@/features/user-accounts/api/user-accounts-queries'
import { getApiErrorMessage } from '@/shared/api/http-client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/components/ui/toast-manager'
import { getPromotionCandidates, promoteStudents } from '../api/semester-promotion-api'

export function SemesterPromotionPage() {
  const queryClient = useQueryClient()
  const [sourceSectionId, setSourceSectionId] = useState('')
  const [targetSectionId, setTargetSectionId] = useState('')
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set())
  const [confirmOpen, setConfirmOpen] = useState(false)
  const sectionsQuery = useQuery(sectionsQueryOptions)
  const source = sectionsQuery.data?.sections.find((section) => section.id === sourceSectionId)
  const targetOptions = useMemo(
    () =>
      (sectionsQuery.data?.sections ?? []).filter(
        (section) =>
          section.id !== sourceSectionId &&
          section.isActive &&
          !section.semester.isClosed &&
          (!source ||
            (section.program.id === source.program.id &&
              section.batch.id === source.batch.id &&
              section.semester.id !== source.semester.id))
      ),
    [sectionsQuery.data?.sections, source, sourceSectionId]
  )
  const selectionReady = Boolean(sourceSectionId && targetSectionId)
  const candidatesQuery = useQuery({
    queryKey: ['semester-promotion', sourceSectionId, targetSectionId],
    queryFn: () => getPromotionCandidates({ sourceSectionId, targetSectionId }),
    enabled: selectionReady,
  })
  const promotionMutation = useMutation({
    mutationFn: promoteStudents,
    onSuccess: async (result) => {
      setConfirmOpen(false)
      setExcludedIds(new Set())
      toast.add({
        title: 'Semester promotion completed',
        description: `${result.summary.promoted} ${result.summary.promoted === 1 ? 'student' : 'students'} promoted; ${result.summary.excluded} excluded; ${result.summary.blocked} blocked.`,
        type: 'success',
      })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['semester-promotion'] }),
        queryClient.invalidateQueries({ queryKey: userAccountKeys.all }),
      ])
    },
    onError: (error) =>
      toast.add({
        title: 'Promotion failed',
        description: getApiErrorMessage(error, 'Unable to promote this section'),
        type: 'error',
        priority: 'high',
      }),
  })
  const includedCount = (candidatesQuery.data?.summary.eligible ?? 0) - excludedIds.size

  function selectSource(value: string) {
    setSourceSectionId(value)
    setTargetSectionId('')
    setExcludedIds(new Set())
  }

  function toggleExclusion(studentId: string, include: boolean) {
    setExcludedIds((current) => {
      const next = new Set(current)
      if (include) next.delete(studentId)
      else next.add(studentId)
      return next
    })
  }

  const sectionLabel = (section: NonNullable<typeof source>) =>
    `${section.program.code} · ${section.batch.name} · ${section.semester.name} ${section.semester.academicYear} · Section ${section.name}`

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div>
        <h1 className="text-foreground text-2xl font-semibold">Semester promotion</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Preview a section, exclude exceptions, and move eligible students to a selected next
          semester.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promotion path</CardTitle>
          <CardDescription>
            Source and target must belong to the same program and batch.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <AcademicReferenceSelect
            id="promotion-source"
            label="Current section"
            value={sourceSectionId}
            onValueChange={selectSource}
            options={(sectionsQuery.data?.sections ?? []).map((section) => ({
              value: section.id,
              label: sectionLabel(section),
            }))}
          />
          <AcademicReferenceSelect
            id="promotion-target"
            label="Target section"
            value={targetSectionId}
            onValueChange={(value) => {
              setTargetSectionId(value)
              setExcludedIds(new Set())
            }}
            disabled={!sourceSectionId}
            options={targetOptions.map((section) => ({
              value: section.id,
              label: sectionLabel(section),
            }))}
          />
        </CardContent>
      </Card>

      {candidatesQuery.isFetching ? (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Spinner /> Loading candidates…
        </div>
      ) : null}
      {candidatesQuery.isError ? (
        <p className="text-destructive text-sm">
          {getApiErrorMessage(candidatesQuery.error, 'Unable to load candidates')}
        </p>
      ) : null}
      {candidatesQuery.data ? (
        <Card>
          <CardHeader>
            <CardTitle>Student review</CardTitle>
            <CardDescription>
              {candidatesQuery.data.summary.eligible} eligible ·{' '}
              {candidatesQuery.data.summary.blocked} blocked · {excludedIds.size} excluded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-border overflow-hidden rounded-lg border">
              {candidatesQuery.data.students.map((student) => (
                <div key={student.id} className="flex items-center justify-between gap-4 p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Checkbox
                      aria-label={`Include ${student.fullName}`}
                      checked={student.eligible && !excludedIds.has(student.id)}
                      disabled={!student.eligible}
                      onCheckedChange={(checked) => toggleExclusion(student.id, checked)}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{student.fullName}</p>
                      <p className="text-muted-foreground text-xs">
                        {student.registrationNumber ?? 'No registration number'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={student.eligible ? 'secondary' : 'destructive'}>
                    {student.eligible ? 'Eligible' : student.reason}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <Button disabled={includedCount === 0} onClick={() => setConfirmOpen(true)}>
                Review promotion ({includedCount})
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Promote {includedCount} {includedCount === 1 ? 'student' : 'students'}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Current enrollments will be closed and matching active offerings in the target section
              will be assigned. Historical attendance and results remain unchanged.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={promotionMutation.isPending}
              onClick={() =>
                promotionMutation.mutate({
                  sourceSectionId,
                  targetSectionId,
                  excludedStudentIds: [...excludedIds],
                })
              }
            >
              {promotionMutation.isPending ? 'Promoting…' : 'Confirm promotion'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
