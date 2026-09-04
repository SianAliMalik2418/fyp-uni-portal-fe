import { expect, test } from '@playwright/test'
import { mockAuthMe, users } from './helpers/portal-fixtures.js'

test.describe('phase 15 - audit log', () => {
  test('admin filters important activity by module', async ({ page }) => {
    await mockAuthMe(page, users.admin)
    await page.route('**/api/audit-logs?*', async (route) => {
      const module = new URL(route.request().url()).searchParams.get('module')
      const auditLogs =
        module === 'results'
          ? [auditLog('result-audit', 'approved', 'results', 'PF Fall result')]
          : [auditLog('fee-audit', 'updated', 'fees', 'Student fee')]

      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ auditLogs, page: 1, limit: 20, total: 1, totalPages: 1 }),
      })
    })

    await page.goto('/audit-log')

    await expect(page.getByRole('heading', { name: 'Audit log' })).toBeVisible()
    await expect(page.getByText('Student fee')).toBeVisible()
    await page.getByLabel('Module').selectOption('results')
    await expect(page.getByText('PF Fall result')).toBeVisible()
    await expect(page.getByText('Student fee')).toBeHidden()
  })

  test('non-admin cannot open the audit log', async ({ page }) => {
    await mockAuthMe(page, users.teacher)

    await page.goto('/audit-log')

    await expect(page.getByText('Access blocked')).toBeVisible()
  })
})

function auditLog(id: string, action: string, module: string, label: string) {
  return {
    id,
    actor: { id: users.admin.id, name: users.admin.name, role: 'admin' },
    action,
    module,
    affectedRecord: { id: `${id}-record`, label },
    createdAt: '2026-08-24T08:00:00.000Z',
  }
}
