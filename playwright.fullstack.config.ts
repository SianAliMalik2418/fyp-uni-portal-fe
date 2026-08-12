import { defineConfig, devices } from '@playwright/test'

const apiPort = 5100
const appPort = 5174
const mongoUri = 'mongodb://127.0.0.1:27017/fyp_uni_portal_e2e'

const backendEnv = {
  NODE_ENV: 'test',
  PORT: String(apiPort),
  CLIENT_ORIGIN: `http://127.0.0.1:${appPort}`,
  MONGODB_URI: mongoUri,
  DB_CONNECTION_TIMEOUT_MS: '5000',
  GEMINI_API_KEY: 'e2e-gemini-api-key',
  LOG_LEVEL: 'silent',
  AUTH_COOKIE_NAME: 'portal_session_e2e',
}

const backendEnvCommand = Object.entries(backendEnv)
  .map(([key, value]) => `${key}=${value}`)
  .join(' ')

export default defineConfig({
  testDir: './tests/e2e/full-stack',
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report-full' }]],
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: `http://127.0.0.1:${appPort}`,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: `cd ../BE && ${backendEnvCommand} bun run seed:e2e && ${backendEnvCommand} bunx tsx src/server.ts`,
      url: `http://127.0.0.1:${apiPort}/api/health`,
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: `VITE_API_BASE_URL=http://127.0.0.1:${apiPort}/api bun run dev --host 127.0.0.1 --port ${appPort}`,
      url: `http://127.0.0.1:${appPort}`,
      reuseExistingServer: false,
      timeout: 30_000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
