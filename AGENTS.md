# Frontend Agent Instructions

## Required Reading

- Before frontend work, read `docs/TECHNICAL_OVERVIEW.md`.
- For phase ownership or product requirements, read the relevant files under `docs/`.

## Package Scope

- Work from the `FE/` directory for frontend package commands.
- Use Bun for frontend dependency and script execution.
- Keep `FE/bun.lock` as the frontend package lockfile.

## Frontend Architecture

- Follow the feature-based structure described in `docs/TECHNICAL_OVERVIEW.md`.
- Keep app providers and route wiring under `src/app`.
- Keep frontend API transport under `src/shared/api`.
- Keep cross-feature constants under `src/shared/constants`.
- Keep feature route-entry components under `src/features/*/pages`.
- Keep reusable feature/domain components under `src/features/*/components`, and have pages compose those components.
- Keep auth-specific API functions, TanStack Query options, schemas, types, pages, and components under `src/features/auth`.
- Keep portal-specific pages, shell components, navigation, constants, and types under `src/features/portal`.
- Keep reusable shadcn UI primitives under `src/components/ui`.
- Put feature/domain components outside `src/components/ui` so generated shadcn files stay easy to update.

## API, Routing, and Forms

- Use `react-router-dom` for frontend routing.
- Use TanStack Query for all server-state reads and mutations.
- Use the shared Axios client for HTTP transport.
- Use `react-hook-form` with Zod schemas for form validation.
- Use toasts from `src/components/ui/toast` for form submit success/failure feedback; do not render inline success/error alert blocks above forms for mutation results. Keep field-level validation errors inline by their inputs, and keep persistent page/query load errors inline when the user needs ongoing context.
- Give every user-facing text-like form input a clear placeholder.
- Use a password field with a show/hide option for every password input.
- Do not store sensitive auth tokens in browser storage.

## Design System

- Treat `components.json` and `src/index.css` as the source of truth for frontend design tokens.
- Use only design-system tokens for colors, borders, rings, backgrounds, foregrounds, radius, shadows, and semantic states.
- Do not introduce raw color values or arbitrary Tailwind color classes in application components unless they are already part of token definitions.
- Use only free Hugeicons for icons. Do not add Lucide or another icon library unless the user explicitly approves it.
- For any UI-related work, use the `design-taste-frontend` skill with the existing shadcn/Tailwind/Hugeicons system.
- Do not force marketing-page taste patterns onto dense dashboards, admin tables, forms, or backend-driven product workflows.

## Frontend Verification

- After frontend changes, run the relevant Bun-backed scripts from `FE/`, such as `bun run test`, `bun run build`, `bun run lint`, and `bun run format:check`.
- Run `bun run test:e2e` when a change affects routing, auth, critical user flows, or browser-only behavior.
- Always use the `simplify` skill before handing frontend work over for review.

## Frontend Testing

- Use Vitest for unit tests, React Testing Library for component behavior, and Playwright for critical end-to-end browser flows.
- Put frontend unit and component tests next to the code they cover using `*.test.ts` or `*.test.tsx`.
- Put Playwright specs under `tests/e2e`.
- Prefer behavior-focused tests based on user flows, validators, API contracts, accessibility roles, and edge cases.
- Mock only slow, external, nondeterministic, paid, or network-only services.
- Every test must have meaningful assertions.
