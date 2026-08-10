import { queryOptions } from '@tanstack/react-query'
import { listBatches, listSections, listSemesters } from './academic-structure-api'

export const academicStructureKeys = {
  all: ['academic-structure'] as const,
  batches: () => [...academicStructureKeys.all, 'batches'] as const,
  sections: () => [...academicStructureKeys.all, 'sections'] as const,
  semesters: () => [...academicStructureKeys.all, 'semesters'] as const,
}

export const batchesQueryOptions = queryOptions({
  queryKey: academicStructureKeys.batches(),
  queryFn: listBatches,
})

export const semestersQueryOptions = queryOptions({
  queryKey: academicStructureKeys.semesters(),
  queryFn: listSemesters,
})

export const sectionsQueryOptions = queryOptions({
  queryKey: academicStructureKeys.sections(),
  queryFn: listSections,
})
