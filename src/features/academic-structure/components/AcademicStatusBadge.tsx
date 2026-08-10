import { Badge } from '@/components/ui/badge'

export function AcademicStatusBadge({ active, closed }: { active: boolean; closed?: boolean }) {
  if (closed) {
    return <Badge variant="destructive">closed</Badge>
  }

  return <Badge variant={active ? 'outline' : 'secondary'}>{active ? 'active' : 'inactive'}</Badge>
}
