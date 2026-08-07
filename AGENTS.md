# Agent Instructions

## Package Management

- Use Bun for package management and package execution in this repo.
- Prefer `bun install`, `bun add`, `bun add -d`, and `bunx --bun`.
- Do not use npm, pnpm, or yarn unless the user explicitly asks for it.
- Keep `bun.lock` as the package lockfile.

## Starting Work

- When the user asks to start something, do not begin implementation immediately.
- First understand the requirements, propose counterarguments when valid, call out relevant edge cases, and ask any useful questions even if the task seems simple.
- If the request is fully straightforward and no meaningful question applies, say the agent is ready to kickoff and is waiting for the user's input.

## Project Ownership

- This is a group final-year project divided between three members from `docs/Portal_Phases_requirements.md`: Sian, Tayabba, and Hammad.
- Follow the phase ownership and responsibility split in the phase plan when choosing implementation scope.
- After a phase is completed and verified by the user, push only when the user explicitly asks to push.
- Before committing or pushing phase work, verify that the Git author name/email and the active GitHub account match the respective member responsible for that work. The account should already be logged in; do not assume it is correct without checking.

## Git Workflow

- Divide commits by feature or coherent implementation chunk. Do not dump unrelated or whole-phase work into one large commit.
- Use industry-standard conventional commit messages, such as `feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `chore:`, and `build:`.
- Keep each commit focused on one behavior, feature slice, test group, or documentation update.
- Include relevant tests or verification changes in the same commit as the behavior they validate when practical.

## Design System

- Treat `components.json` and `src/index.css` as the source of truth for the frontend design system.
- Use only design-system tokens for colors, borders, rings, backgrounds, foregrounds, radius, shadows, and semantic states.
- Do not introduce raw color values such as hex, rgb, hsl, oklch, named colors, or arbitrary Tailwind color classes in application components unless they are already part of the design-system token definitions.
- Prefer semantic token classes such as `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `border-border`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `bg-secondary`, `bg-muted`, `bg-accent`, `text-destructive`, and `ring-ring`.
- Keep components visually consistent with the installed shadcn preset.
- Use only free Hugeicons for icons. Do not add Lucide or another icon library unless the user explicitly approves it.

## UI Taste Guidance

- Recommended for UI-heavy work: read `.agents/skills/design-taste-frontend/SKILL.md` before designing or redesigning landing pages, marketing pages, portfolios, public-facing flows, or visually prominent application screens.
- Use the Taste Skill v2 guidance to shape layout quality, hierarchy, motion, density, and anti-generic UI checks.
- Apply it in combination with this repo's design system rules. The local shadcn preset, semantic tokens, and Hugeicons remain the implementation source of truth.
- Do not force Taste Skill patterns onto dense dashboards, admin tables, forms, or backend-driven product workflows when the existing application conventions are a better fit.

## Component Policy

- Before creating a new UI component, check whether the component already exists in shadcn/ui.
- If shadcn/ui provides the component, install or use the shadcn version instead of building a custom primitive.
- Create custom UI only when shadcn does not provide the needed component or when project-specific composition is required.
- Keep reusable shadcn UI primitives under `src/components/ui`.
- Put feature/domain components outside `src/components/ui` so generated shadcn files stay easy to update.

## Verification

- After frontend changes, run the relevant Bun-backed scripts, such as `bun run test`, `bun run build`, `bun run lint`, and `bun run format:check`.
- Run `bun run test:e2e` when a change affects routing, auth, critical user flows, or browser-only behavior.

## Testing Guidelines

- Add or update tests for meaningful behavior changes. Do not add tests that only mirror the current implementation.
- Prefer behavior-focused tests based on requirements, user flows, validators, API contracts, accessibility roles, and edge cases.
- Use Vitest for unit tests, React Testing Library for component behavior, and Playwright for critical end-to-end browser flows.
- Put frontend unit and component tests next to the code they cover using `*.test.ts` or `*.test.tsx`.
- Put Playwright specs under `tests/e2e`.
- Avoid excessive mocking. Prefer real components, real hooks, realistic fixtures, and user-level interactions when practical.
- Mock only slow, external, nondeterministic, paid, or network-only services.
- Every test must have meaningful assertions. Avoid weak assertions such as only checking that a value exists unless existence is the actual requirement.
- Cover happy paths, invalid input, permission failures, loading states, empty states, and important regressions.
- Before calling work done, run the relevant test/build/lint commands and report any failures clearly.
