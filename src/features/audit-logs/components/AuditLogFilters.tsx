import type { ChangeEvent } from 'react'
import {
  auditActions,
  auditActorRoles,
  auditModules,
  type AuditAction,
  type AuditActorRole,
  type AuditModule,
} from '../types/audit-log.types'

type AuditLogFiltersProps = {
  action?: AuditAction
  actorRole?: AuditActorRole
  module?: AuditModule
  onActionChange: (action?: AuditAction) => void
  onActorRoleChange: (role?: AuditActorRole) => void
  onModuleChange: (module?: AuditModule) => void
}

const fieldClassName =
  'border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 min-w-40 rounded-md border px-2.5 text-sm shadow-xs outline-none focus-visible:ring-3'

function optionalValue<T extends string>(event: ChangeEvent<HTMLSelectElement>) {
  return event.target.value ? (event.target.value as T) : undefined
}

function labelFor(value: string) {
  return value.replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase())
}

export function AuditLogFilters({
  action,
  actorRole,
  module,
  onActionChange,
  onActorRoleChange,
  onModuleChange,
}: AuditLogFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3" aria-label="Audit log filters">
      <label className="text-foreground grid gap-1.5 text-sm font-medium">
        Module
        <select
          className={fieldClassName}
          value={module ?? ''}
          onChange={(event) => onModuleChange(optionalValue<AuditModule>(event))}
        >
          <option value="">All modules</option>
          {auditModules.map((value) => (
            <option key={value} value={value}>
              {labelFor(value)}
            </option>
          ))}
        </select>
      </label>
      <label className="text-foreground grid gap-1.5 text-sm font-medium">
        Action
        <select
          className={fieldClassName}
          value={action ?? ''}
          onChange={(event) => onActionChange(optionalValue<AuditAction>(event))}
        >
          <option value="">All actions</option>
          {auditActions.map((value) => (
            <option key={value} value={value}>
              {labelFor(value)}
            </option>
          ))}
        </select>
      </label>
      <label className="text-foreground grid gap-1.5 text-sm font-medium">
        Role
        <select
          className={fieldClassName}
          value={actorRole ?? ''}
          onChange={(event) => onActorRoleChange(optionalValue<AuditActorRole>(event))}
        >
          <option value="">All roles</option>
          {auditActorRoles.map((value) => (
            <option key={value} value={value}>
              {labelFor(value)}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
