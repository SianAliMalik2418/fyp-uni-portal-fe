import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SemesterPromotionPage } from '@/features/semester-promotion/pages/SemesterPromotionPage'
import { AssessmentStructureSettingsPage } from './AssessmentStructureSettingsPage'
import { AttendanceSettingsPage } from './AttendanceSettingsPage'
import { GradingScaleSettingsPage } from './GradingScaleSettingsPage'

type AcademicSettingsTab =
  'semester-promotion' | 'attendance' | 'assessment-structure' | 'grading-scale'

const tabButtonClass = 'min-w-36'

export function AcademicSettingsPage({ title }: { title: string }) {
  const [activeTab, setActiveTab] = useState<AcademicSettingsTab>('semester-promotion')

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div>
        <h1 className="text-foreground text-2xl leading-tight font-semibold">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Promote students between semesters and configure attendance, assessment, and grading
          rules.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AcademicSettingsTab)}>
        <TabsList className="w-full justify-start overflow-x-auto" variant="line">
          <TabsTrigger className={tabButtonClass} value="semester-promotion">
            Semester Promotion
          </TabsTrigger>
          <TabsTrigger className={tabButtonClass} value="attendance">
            Attendance
          </TabsTrigger>
          <TabsTrigger className={tabButtonClass} value="assessment-structure">
            Assessment Structure
          </TabsTrigger>
          <TabsTrigger className={tabButtonClass} value="grading-scale">
            Grading Scale
          </TabsTrigger>
        </TabsList>

        <TabsContent value="semester-promotion">
          <SemesterPromotionPage />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceSettingsPage />
        </TabsContent>

        <TabsContent value="assessment-structure">
          <AssessmentStructureSettingsPage title="Assessment structure" />
        </TabsContent>

        <TabsContent value="grading-scale">
          <GradingScaleSettingsPage title="Grading scale" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
