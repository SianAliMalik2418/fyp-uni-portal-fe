import { defineConfig, devices } from '@playwright/test'

const appPort = Number(process.env.PLAYWRIGHT_PORT ?? 4173)
const appUrl = `http://127.0.0.1:${appPort}`

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: '**/full-stack/**',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: appUrl,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `bun run dev --host 127.0.0.1 --port ${appPort} --strictPort`,
    url: appUrl,
    reuseExistingServer: false,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
