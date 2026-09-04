export type PromotionSelection = {
  sourceSectionId: string
  targetSectionId: string
}

export type PromotionStudent = {
  id: string
  fullName: string
  registrationNumber?: string
  academicStatus?: string
  isActive: boolean
  eligible: boolean
  reason?: string
}

export type PromotionSectionSummary = {
  id: string
  name: string
  semester: { id: string; name: string; academicYear: string }
}

export type PromotionCandidatesResponse = {
  source: PromotionSectionSummary
  target: PromotionSectionSummary
  students: PromotionStudent[]
  summary: { total: number; eligible: number; blocked: number }
}

export type PromotionResponse = Omit<PromotionCandidatesResponse, 'students' | 'summary'> & {
  message: string
  promoted: PromotionStudent[]
  excluded: PromotionStudent[]
  blocked: PromotionStudent[]
  summary: { total: number; promoted: number; excluded: number; blocked: number }
}

export type PromotionRequest = PromotionSelection & { excludedStudentIds: string[] }
