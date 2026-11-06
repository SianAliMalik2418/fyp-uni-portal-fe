import { Button } from '@/components/ui/button'

type TablePaginationProps = {
  page: number
  totalPages: number
  total: number
  itemLabel: string
  isFetching?: boolean
  onPageChange: (page: number) => void
}

export function TablePagination({
  page,
  totalPages,
  total,
  itemLabel,
  isFetching = false,
  onPageChange,
}: TablePaginationProps) {
  if (!totalPages || totalPages <= 1) return null

  return (
    <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
      <p className="text-muted-foreground text-sm">
        Page {page} of {totalPages} · {total} {itemLabel}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page === 1 || isFetching}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages || isFetching}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
