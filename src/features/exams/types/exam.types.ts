export type Exam = {
  id: string
  examType: string
  courseOfferingId: string
  course: { id: string; code: string; title: string }
  program: { id: string; name: string; code: string }
  semester: { id: string; name: string; academicYear: string }
  section: { id: string; name: string }
  examDate: string
  startTime: string
  endTime: string
  room: string
  instructions?: string
  createdAt?: string
  updatedAt?: string
}

export type ExamPayload = {
  examType: string
  courseOfferingId: string
  examDate: string
  startTime: string
  endTime: string
  room: string
  instructions?: string
}

export type ExamsResponse = { exams: Exam[] }
export type ExamResponse = { message: string; exam: Exam }
