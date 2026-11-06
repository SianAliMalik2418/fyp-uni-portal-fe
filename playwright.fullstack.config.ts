import { createHash } from 'node:crypto'
import { defineConfig, devices } from '@playwright/test'

const apiPort = Number(process.env.PLAYWRIGHT_FULLSTACK_API_PORT ?? 5100)
const appPort = Number(process.env.PLAYWRIGHT_FULLSTACK_APP_PORT ?? 5174)
const runId = createHash('sha256')
  .update(`${import.meta.dirname}:${apiPort}:${appPort}`)
  .digest('hex')
  .slice(0, 32)
const mongoUri = `mongodb://127.0.0.1:27017/fyp_uni_portal_e2e_${runId}`

const backendEnv = {
  NODE_ENV: 'test',
  PORT: String(apiPort),
  CLIENT_ORIGIN: `http://127.0.0.1:${appPort}`,
  MONGODB_URI: mongoUri,
  DB_CONNECTION_TIMEOUT_MS: '5000',
  GEMINI_API_KEY: 'e2e-gemini-api-key',
  LOG_LEVEL: 'silent',
  UPLOAD_DIR: `uploads/e2e_${runId}`,
  AUTH_COOKIE_NAME: 'portal_session_e2e',
}

export default defineConfig({
  testDir: './tests/e2e/full-stack',
  metadata: { runId },
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report-full' }]],
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: `http://127.0.0.1:${appPort}`,
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'bunx tsx src/scripts/run-e2e-server.ts',
      cwd: '../BE',
      env: backendEnv,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 30_000 },
      url: `http://127.0.0.1:${apiPort}/api/health`,
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: `bun run build && bun run preview --host 127.0.0.1 --port ${appPort} --strictPort`,
      env: { VITE_API_BASE_URL: `http://127.0.0.1:${apiPort}/api` },
      url: `http://127.0.0.1:${appPort}`,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
