# University Portal frontend

React, TypeScript and Vite frontend for the Express API in the sibling `BE/` checkout.
Read [AGENTS.md](AGENTS.md) and [the technical overview](docs/TECHNICAL_OVERVIEW.md) before making changes.

## Setup

Install Bun and Node.js, then run `bun install --frozen-lockfile` from this directory.
Copy `.env.example` to `.env` when connecting to a separately running backend.
Run `bun run dev` for interactive development.

## Verification

`bun run verify` runs the build, lint, formatting check, unit tests, mocked browser tests,
and full-stack browser tests. Each step stops on failure.

For smaller checks during development:

```sh
bun run test src/features/announcements/pages/AnnouncementsPage.test.tsx
bun run test:e2e tests/e2e/phase-9-fees.spec.ts
bun run test:e2e:full
```

Install the browser once with `bunx playwright install chromium`. The mocked suite starts
its own Vite server and needs no backend. The full-stack suite requires dependencies in
`../BE/` and MongoDB at `127.0.0.1:27017`. It seeds its own database, builds the frontend
against its test API, and serves the production build. It does not call Gemini.

Full-stack runs create a database named `fyp_uni_portal_e2e_<32 hexadecimal characters>`
and a matching backend upload directory. The run ID is based on the frontend checkout
path and selected ports, so concurrent worktrees do not share fixtures. The backend
test runner removes both after Playwright gracefully stops the API server. If the test
process is forcibly killed, cleanup may not run. The backend seed command supports
`--cleanup` for removing the exact test database under the same test-only target guard.

Failures retain Playwright traces. Open `playwright-report/index.html` or
`playwright-report-full/index.html`, or run `bunx playwright show-trace <trace.zip>`.
Reports and test results are ignored by Git.

## Worktrees

Keep `FE/` and `BE/` as siblings in each working directory. Install dependencies in each
checkout. The full-stack runner resolves the backend relative to the frontend checkout.
For concurrent browser runs in one checkout, assign different ports:

```sh
PLAYWRIGHT_PORT=4273 bun run test:e2e
PLAYWRIGHT_FULLSTACK_API_PORT=5200 PLAYWRIGHT_FULLSTACK_APP_PORT=5274 bun run test:e2e:full
```

Do not reuse a server from another checkout. Both browser configurations enforce this.
Compare production chunk sizes with `bun run build`; use browser network traces when
evaluating actual requests. Unit-test timing is not a browser performance measurement.
