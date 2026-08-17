# Frontend Agent Instructions

The frontend is a React 19 and TypeScript portal built with Vite, TanStack Query, React Router, React Hook Form, Zod, shadcn/Tailwind, and Hugeicons.

## Required Reading and Scope

- Before frontend work, read `docs/TECHNICAL_OVERVIEW.md` from `FE/`.
- For phase ownership or product requirements, read only the relevant files under `docs/`.
- Work from `FE/` for frontend package commands. Use Bun and keep `FE/bun.lock` as the package lockfile.
- For Git-only requests, do only the requested Git workflow. Do not run checks unless the user asks for verification.

## Ask Before You Assume

- Ask when a request could reasonably target different screens, roles, navigation behavior, API behavior, or failure states.
- Ask before changing routes, public API payloads, auth/session behavior, role visibility, design tokens, or shared UI primitives.
- Do not invent copy, empty-state behavior, permissions, or responsive behavior when requirements and existing patterns do not resolve them.
- Do not expand a page redesign into adjacent pages or refactor unrelated feature code without authorization.

## Frontend Architecture

The request path is: route page → feature component/hook → TanStack Query → feature API function → shared Axios client → backend.

- Keep providers and route wiring under `src/app`.
- Keep cross-feature HTTP transport under `src/shared/api` and constants under `src/shared/constants`.
- Keep route-entry components under `src/features/*/pages`.
- Keep reusable domain UI under `src/features/*/components`, schemas under `schemas`, API calls/query options under `api`, domain types under `types`, and mappers under `utils`.
- Route pages orchestrate queries, mutations, routing state, and high-level layout. They do not contain large forms, tables, dialogs, or repeated domain UI.
- Prefer one focused component per file once it grows beyond a small helper.
- Keep auth code under `src/features/auth` and portal shell/navigation code under `src/features/portal`.
- Keep reusable shadcn primitives under `src/components/ui`; feature/domain components do not belong there.
- Inspect a comparable completed feature such as `departments`, `programs`, or `user-accounts` before creating a new structure or interaction pattern.

Before handoff, confirm that route pages compose feature components, feature code lives with its owner, forms use schemas and typed payload mappers, and equivalent pages retain equivalent layout patterns.

## API, State, Routing, and Forms

- Use `react-router-dom` for routing and TanStack Query for every server-state read or mutation.
- Use the shared Axios client in `src/shared/api/http-client.ts`; do not create feature-specific Axios instances.
- Treat backend responses as untrusted boundary data. Define explicit domain/API types and narrow unknown error payloads instead of using `any` or blind casts.
- When an HTTP contract changes, update the backend validator/controller, frontend API function/types, and relevant tests together.
- Use React Hook Form with feature-owned Zod schemas for forms. Use typed mappers instead of ad hoc inline payload shaping.
- Use toasts from `src/components/ui/toast` for mutation success/failure. Keep field errors inline and persistent query/page errors visible where ongoing context is needed.
- Give user-facing text inputs clear placeholders and every password input a show/hide control.
- Do not store sensitive auth tokens in browser storage. Authentication relies on backend-managed HTTP-only cookies.

## Type Safety and Naming

- Type errors are failures. Do not weaken TypeScript configuration or lint rules.
- Do not introduce `any`, unsafe non-null assertions, or casts used only to silence an error. Use `unknown`, schemas, type guards, and proper narrowing.
- Do not duplicate a handwritten type next to a schema when it can be inferred safely from that schema.
- Components and files use UpperCamelCase (`UserAccountsPage.tsx`); hooks use `use...`; booleans read as assertions (`isLoading`, `hasAccess`, `canEdit`).
- Pages end in `Page`; reusable UI names describe their domain role (`UserAccountForm`, `CoursesTable`, `DeleteProgramDialog`). Avoid vague names such as `Data`, `Thing`, or `handleData`.
- User-facing copy uses sentence case and existing portal vocabulary. Reuse established role and academic-domain labels instead of coining synonyms.
- Test files sit beside source as `*.test.ts` or `*.test.tsx`; Playwright specs live under `tests/e2e`.

## Design System and UI Quality

- Treat `components.json` and `src/index.css` as the source of truth for design tokens.
- Use token-based colors, borders, rings, backgrounds, foregrounds, radii, shadows, and semantic states. Do not add raw colors or arbitrary Tailwind palette classes in application components.
- Use the existing shadcn/Tailwind system and only free Hugeicons. Ask before adding another icon or UI library.
- Use skeletons for page, section, card, and table loading. Use spinners for brief button-level actions. Do not replace structured UI with plain `Loading...`, `Saving...`, or `Deleting...` text.
- Every changed screen includes deliberate loading, empty, error, disabled, and success behavior as applicable.
- Do not apply marketing-page patterns to dense dashboards, tables, or operational forms.
- For lists large enough to affect responsiveness, paginate or virtualize based on the established API/UI pattern; do not render an unbounded server collection.

## Verification and Testing

Use the smallest relevant command while iterating and complete the affected loop before handoff:

```bash
bun run build
bun run lint
bun run format:check
bun run test
bun run test:e2e       # routing, auth, critical flows, browser-only behavior
bun run test:e2e:full  # live frontend + backend + MongoDB final state
```

- Start meaningful behavior changes with a failing Vitest/component/Playwright test when that layer can express the behavior.
- Use Vitest for pure logic, React Testing Library for component behavior, and Playwright for critical user flows.
- Cover forms, permissions, routing, dialogs, loading/error/empty states, and important edge cases at the smallest useful layer.
- Keep the default mocked e2e suite fast. Update the full-stack seed/spec when frontend work changes a cross-stack objective.
- Mock only slow, external, nondeterministic, paid, or network-only services. Every test needs meaningful behavior-focused assertions.
- Never skip or weaken a test to get green. If a test expectation is wrong, explain the contract change before updating it.
- Do not use `bun run dev`, `bun run preview`, or watch mode as final verification.
- Do not require manual visual QA, browser walkthroughs, or screenshots unless the user explicitly requests them.
- Always use the `simplify` skill after the implementation and automated checks are green, before handoff.
- Check from skills installed globally in system and see what could be used in your speciifc scenario and use it

## Frontend Failure Log

- Do not place feature forms, tables, or dialogs in `src/components/ui`; keep generated primitives separate from domain UI.
- Do not show mutation outcomes as inline page banners; use the established toast system while retaining field validation and persistent query errors inline.
- Do not persist session tokens in local or session storage; the backend owns the HTTP-only session cookie.
- Do not use plain loading text for structured content; use skeletons, and reserve spinners for short inline actions.
