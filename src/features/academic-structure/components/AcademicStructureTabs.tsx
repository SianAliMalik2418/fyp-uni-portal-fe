import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

type AcademicStructureTabsProps = {
  activeTab: AcademicStructureTab
  batches: Batch[]
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
  sectionsQuery: QueryState
  semesters: Semester[]
  semestersQuery: QueryState
}

const tabButtonClass = 'min-w-28'

export function AcademicStructureTabs({
  activeTab,
  batches,
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
  sectionsQuery,
  semesters,
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

      <TabsContent value="batches">
        <BatchesCard
          batches={batches}
          query={batchesQuery}
          onDelete={onDelete}
          onEdit={onEditBatch}
          sectionCountsByBatch={sectionCountsByBatch}
        />
      </TabsContent>

      <TabsContent value="semesters">
        <SemestersCard
          query={semestersQuery}
          semesters={semesters}
          onActivate={onActivateSemester}
          onClose={onCloseSemester}
          onDelete={onDelete}
          onEdit={onEditSemester}
        />
      </TabsContent>

      <TabsContent value="sections">
        <SectionsCard
          query={sectionsQuery}
          sections={sections}
          onDelete={onDelete}
          onEdit={onEditSection}
        />
      </TabsContent>
    </Tabs>
  )
}
