export function AcademicStatusText({ active, closed }: { active: boolean; closed?: boolean }) {
  const label = closed ? 'closed' : active ? 'active' : 'inactive'

  return <span className="text-muted-foreground text-sm">{label}</span>
}
