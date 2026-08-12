import { ChartEvaluationIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { AssessmentCategoryDefinition } from '../types/academic-performance.types'

export function AssessmentCategoriesCard({
  categories,
  isLoading,
}: {
  categories: AssessmentCategoryDefinition[]
  isLoading: boolean
}) {
  return (
    <Card className="bg-background">
      <CardHeader className="border-border border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <HugeiconsIcon icon={ChartEvaluationIcon} strokeWidth={2} className="size-4" />
          Assessment categories
        </CardTitle>
        <CardDescription>
          University-defined categories and their contribution to the semester result.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="h-20 w-full" />
              ))
            : categories.map((category) => (
                <div key={category.id} className="bg-muted/30 rounded-md border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{category.label}</p>
                    <Badge variant="secondary">{category.weightPercentage}%</Badge>
                  </div>
                  <p className="text-muted-foreground mt-2 text-xs">Multiple assessments allowed</p>
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  )
}
