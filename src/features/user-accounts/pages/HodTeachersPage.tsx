import { useDeferredValue, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { userAccountSearchQueryOptions } from '../api/user-accounts-queries'

export function HodTeachersPage() {
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search.trim())
  const query = useQuery(
    userAccountSearchQueryOptions({
      role: 'teacher',
      ...(deferredSearch ? { search: deferredSearch } : {}),
      page: 1,
      limit: 50,
    })
  )

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div>
        <h1 className="text-foreground text-2xl font-semibold">Department teachers</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Read-only staff directory. Department scope is enforced by the server.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Teacher directory</CardTitle>
          <CardDescription>
            {query.data
              ? `${query.data.total} matching teachers`
              : 'Search by name, email, employee ID, or designation.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            aria-label="Search department teachers"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search teachers"
            className="mb-4 max-w-sm"
          />
          {query.isPending ? (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Spinner /> Loading teachers…
            </div>
          ) : null}
          {query.isError ? (
            <p className="text-destructive text-sm">
              {getApiErrorMessage(query.error, 'Unable to load teachers')}
            </p>
          ) : null}
          {query.data ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data.users.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <span className="block font-medium">{teacher.fullName}</span>
                      <span className="text-muted-foreground text-xs">{teacher.email}</span>
                    </TableCell>
                    <TableCell>{teacher.employeeId ?? '—'}</TableCell>
                    <TableCell>{teacher.designation ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant={teacher.isActive ? 'secondary' : 'outline'}>
                        {teacher.accountStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
