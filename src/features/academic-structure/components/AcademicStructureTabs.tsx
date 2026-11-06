import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TablePagination } from '@/components/ui/table-pagination'
import type {
  AcademicStructureTab,
  Batch,
  DeleteAcademicStructureTarget,
  Section,
  Semester,
} from '../types/academic-structure.types'
import { BatchesCard } from './BatchesCard'
import { SectionsCard } from './SectionsCard'
import { SemestersCard } from './SemestersCard'

type QueryState = {
  error: unknown
  isError: boolean
  isPending: boolean
}

type PaginationState = {
  page: number
  totalPages: number
  total: number
  isFetching: boolean
  onPageChange: (page: number) => void
}

type AcademicStructureTabsProps = {
  activeTab: AcademicStructureTab
  batches: Batch[]
  batchesPagination: PaginationState
  batchesQuery: QueryState
  onActivateSemester: (semesterId: string) => void
  onCloseSemester: (semesterId: string) => void
  onDelete: (target: DeleteAcademicStructureTarget) => void
  onEditBatch: (batch: Batch) => void
  onEditSection: (section: Section) => void
  onEditSemester: (semester: Semester) => void
  onTabChange: (tab: AcademicStructureTab) => void
  sectionCountsByBatch: Map<string, number>
  sections: Section[]
  sectionsPagination: PaginationState
  sectionsQuery: QueryState
  semesters: Semester[]
  semestersPagination: PaginationState
  semestersQuery: QueryState
}

const tabButtonClass = 'min-w-28'

export function AcademicStructureTabs({
  activeTab,
  batches,
  batchesPagination,
  batchesQuery,
  onActivateSemester,
  onCloseSemester,
  onDelete,
  onEditBatch,
  onEditSection,
  onEditSemester,
  onTabChange,
  sectionCountsByBatch,
  sections,
  sectionsPagination,
  sectionsQuery,
  semesters,
  semestersPagination,
  semestersQuery,
}: AcademicStructureTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as AcademicStructureTab)}>
      <TabsList className="w-full justify-start overflow-x-auto" variant="line">
        <TabsTrigger className={tabButtonClass} value="batches">
          Batches
        </TabsTrigger>
        <TabsTrigger className={tabButtonClass} value="semesters">
          Semesters
        </TabsTrigger>
        <TabsTrigger className={tabButtonClass} value="sections">
          Sections
        </TabsTrigger>
      </TabsList>

      <TabsContent value="batches" className="grid gap-3">
        <BatchesCard
          batches={batches}
          query={batchesQuery}
          onDelete={onDelete}
          onEdit={onEditBatch}
          sectionCountsByBatch={sectionCountsByBatch}
        />
        <TablePagination
          page={batchesPagination.page}
          totalPages={batchesPagination.totalPages}
          total={batchesPagination.total}
          itemLabel="batches"
          isFetching={batchesPagination.isFetching}
          onPageChange={batchesPagination.onPageChange}
        />
      </TabsContent>

      <TabsContent value="semesters" className="grid gap-3">
        <SemestersCard
          query={semestersQuery}
          semesters={semesters}
          onActivate={onActivateSemester}
          onClose={onCloseSemester}
          onDelete={onDelete}
          onEdit={onEditSemester}
        />
        <TablePagination
          page={semestersPagination.page}
          totalPages={semestersPagination.totalPages}
          total={semestersPagination.total}
          itemLabel="semesters"
          isFetching={semestersPagination.isFetching}
          onPageChange={semestersPagination.onPageChange}
        />
      </TabsContent>

      <TabsContent value="sections" className="grid gap-3">
        <SectionsCard
          query={sectionsQuery}
          sections={sections}
          onDelete={onDelete}
          onEdit={onEditSection}
        />
        <TablePagination
          page={sectionsPagination.page}
          totalPages={sectionsPagination.totalPages}
          total={sectionsPagination.total}
          itemLabel="sections"
          isFetching={sectionsPagination.isFetching}
          onPageChange={sectionsPagination.onPageChange}
        />
      </TabsContent>
    </Tabs>
  )
}
