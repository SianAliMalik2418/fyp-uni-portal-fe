# Frontend Agent Instructions

## Required Reading

- Before frontend work, read `docs/TECHNICAL_OVERVIEW.md`.
- For phase ownership or product requirements, read the relevant files under `docs/`.

## Package Scope

- Work from the `FE/` directory for frontend package commands.
- Use Bun for frontend dependency and script execution.
- Keep `FE/bun.lock` as the frontend package lockfile.
- For git-only requests such as commit, push, or commit and push, do only the requested Git workflow. Do not run lint, tests, builds, or format checks unless the user explicitly asks for verification.

## Frontend Architecture

- Follow the feature-based structure described in `docs/TECHNICAL_OVERVIEW.md`.
- Keep app providers and route wiring under `src/app`.
- Keep frontend API transport under `src/shared/api`.
- Keep cross-feature constants under `src/shared/constants`.
- Keep feature route-entry components under `src/features/*/pages`.
- Keep reusable feature/domain components under `src/features/*/components`, and have pages compose those components.
- Do not dump feature UI, forms, tables, dialogs, or helper components into a single page file. Route pages should orchestrate data, mutations, routing state, and high-level layout only.
- When a page needs a form, table/list card, sheet/dialog, empty/loading/error state, or repeated domain UI, create a focused component under that feature's `components/` directory.
- Prefer one clear component per file once a component grows beyond a small helper. For example, use `BatchForm.tsx`, `BatchesCard.tsx`, and `DeleteBatchDialog.tsx` instead of one large `AcademicStructurePage.tsx` or one catch-all component file.
- Keep feature schemas under `src/features/*/schemas`, API calls under `src/features/*/api`, TanStack Query options under `src/features/*/api`, domain types under `src/features/*/types`, and payload/form mappers under `src/features/*/utils`.
- Reuse existing components, shared helpers, feature utilities, and established UI patterns before creating new ones. Add a new frontend component, helper, or interaction pattern only when the codebase does not already provide a suitable option.
- Before adding frontend code, inspect a similar completed feature such as `departments`, `programs`, or `user-accounts`, and mirror its structure unless the current feature has a concrete reason to differ.
- Keep auth-specific API functions, TanStack Query options, schemas, types, pages, and components under `src/features/auth`.
- Keep portal-specific pages, shell components, navigation, constants, and types under `src/features/portal`.
- Keep reusable shadcn UI primitives under `src/components/ui`.
- Put feature/domain components outside `src/components/ui` so generated shadcn files stay easy to update.

## Frontend Structure Checklist

Before handing off frontend work, verify:

- Route pages under `src/features/*/pages` compose feature components instead of containing most markup directly.
- No page file contains large inline forms, data tables, confirmation dialogs, or repeated UI blocks that should be feature components.
- New components live in the owning feature's `components/` directory, not in `src/components/ui` unless they are reusable shadcn-style primitives.
- Forms use feature schemas, payload mappers, and typed API functions instead of ad hoc inline payload shaping.
- The implementation still matches the layout pattern already used by equivalent pages, such as the list card plus right-side sheet pattern used by departments and programs.

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
- Use the existing shadcn/Tailwind/Hugeicons system.
- Use skeletons for page, section, card, and table content loading states. Use spinners for short-lived inline actions such as form submits, deletes, uploads, or blocking button actions. Avoid replacing UI with plain loading text such as `Loading...`, `Saving...`, or `Deleting...`.
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
