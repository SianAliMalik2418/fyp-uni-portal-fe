import { queryOptions } from '@tanstack/react-query'
import { DEFAULT_TABLE_PAGE_SIZE, REFERENCE_LIST_LIMIT } from '@/shared/constants/pagination'
import { listBatches, listSections, listSemesters } from './academic-structure-api'

export const academicStructureKeys = {
  all: ['academic-structure'] as const,
  batches: () => [...academicStructureKeys.all, 'batches'] as const,
  batchesPage: (page: number) => [...academicStructureKeys.batches(), page] as const,
  sections: () => [...academicStructureKeys.all, 'sections'] as const,
  sectionsPage: (page: number) => [...academicStructureKeys.sections(), page] as const,
  semesters: () => [...academicStructureKeys.all, 'semesters'] as const,
  semestersPage: (page: number) => [...academicStructureKeys.semesters(), page] as const,
}

export const batchesQueryOptions = queryOptions({
  queryKey: academicStructureKeys.batches(),
  queryFn: () => listBatches({ page: 1, limit: REFERENCE_LIST_LIMIT }),
})

export const batchesTableQueryOptions = (page: number) =>
  queryOptions({
    queryKey: academicStructureKeys.batchesPage(page),
    queryFn: () => listBatches({ page, limit: DEFAULT_TABLE_PAGE_SIZE }),
  })

export const semestersQueryOptions = queryOptions({
  queryKey: academicStructureKeys.semesters(),
  queryFn: () => listSemesters({ page: 1, limit: REFERENCE_LIST_LIMIT }),
})

export const semestersTableQueryOptions = (page: number) =>
  queryOptions({
    queryKey: academicStructureKeys.semestersPage(page),
    queryFn: () => listSemesters({ page, limit: DEFAULT_TABLE_PAGE_SIZE }),
  })

export const sectionsQueryOptions = queryOptions({
  queryKey: academicStructureKeys.sections(),
  queryFn: () => listSections({ page: 1, limit: REFERENCE_LIST_LIMIT }),
})

export const sectionsTableQueryOptions = (page: number) =>
  queryOptions({
    queryKey: academicStructureKeys.sectionsPage(page),
    queryFn: () => listSections({ page, limit: DEFAULT_TABLE_PAGE_SIZE }),
  })
