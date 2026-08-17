import { queryOptions } from '@tanstack/react-query'
import { getOwnFee, getStudentFee } from './fees-api'

export const feeKeys = {
  all: ['fees'] as const,
  own: () => [...feeKeys.all, 'me'] as const,
  student: (studentId: string) => [...feeKeys.all, 'student', studentId] as const,
}

export const ownFeeQueryOptions = queryOptions({
  queryKey: feeKeys.own(),
  queryFn: getOwnFee,
})

export const studentFeeQueryOptions = (studentId: string) =>
  queryOptions({
    queryKey: feeKeys.student(studentId),
    queryFn: () => getStudentFee(studentId),
    enabled: Boolean(studentId),
  })
