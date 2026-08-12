import type { ResultStatistics } from '../types/academic-performance.types'

export function ResultStatisticsCards({ statistics }: { statistics: ResultStatistics }) {
  const items = [
    ['Class average', `${statistics.averagePercentage}%`],
    ['Highest', `${statistics.highestPercentage}%`],
    ['Lowest', `${statistics.lowestPercentage}%`],
    ['Passed', `${statistics.passCount} / ${statistics.studentCount}`],
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, value]) => (
        <div key={label} className="bg-muted/30 rounded-md border p-3">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {label}
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
        </div>
      ))}
    </div>
  )
}
