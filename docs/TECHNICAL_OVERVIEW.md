# Frontend Technical Overview

This document summarizes the frontend technical choices for the University Portal FYP and explains why each package or tool is present.

## Runtime and Build

- `bun`: Package manager and script runner for this workspace.
- `vite`: Development server and production bundler for the React app.
- `typescript`: Static typing for application code, configuration, and tests.
- `@vitejs/plugin-react`: Vite React integration.
- `@rolldown/plugin-babel` and `babel-plugin-react-compiler`: Enables the React Compiler preset used in `vite.config.ts`.
- `@tailwindcss/vite` and `tailwindcss`: Tailwind CSS v4 integration for utility-first styling.

## Application Framework

- `react` and `react-dom`: Core UI library and browser renderer.
- `react-router-dom`: Client-side routing for auth entry, protected portal routes, and role module paths such as `/dashboard`, `/students`, and `/teachers`.
- `@tanstack/react-query`: Server-state management for API reads, mutations, caching, loading states, and auth-session cache updates.
- `axios`: HTTP transport for backend API calls. The shared Axios instance lives in `src/shared/api/http-client.ts`.
- `zustand`: Lightweight client state for UI/session-adjacent state that should not live in server cache.

Routing is implemented with `react-router-dom` because that is the agreed routing library for this phase. `@tanstack/react-router` is not part of the current frontend dependency set.

## Frontend Architecture

The frontend uses a feature-based structure so domain code stays close to the screens and API contracts it supports.

```text
src/
  app/
    App.tsx
    query-client.ts
  features/
    auth/
      api/
      components/
      schemas/
      types/
    portal/
      components/
      constants/
      types/
  shared/
    api/
    constants/
  components/
    ui/
```

- `src/app`: Application composition, providers, route wiring, and app-level clients.
- `src/features/auth`: Auth request functions, TanStack Query options, login/password screens, Zod schemas, and auth types.
- `src/features/portal`: Protected shell, role navigation, role labels, demo stat definitions, and portal-specific types.
- `src/shared/api`: Cross-feature HTTP client configuration and API error normalization.
- `src/shared/constants`: Shared product branding such as portal name, tagline, and logo path.
- `src/components/ui`: shadcn-generated reusable UI primitives only. Feature/domain components should not be added here.

## API and Server State

All current frontend API usage follows this pattern:

```text
Screen component -> useQuery/useMutation -> feature API function -> shared Axios client -> backend
```

Current auth endpoints:

- `/auth/me`: `useQuery(currentUserQueryOptions)` reads the current backend-verified session.
- `/auth/login`: `useMutation({ mutationFn: login })` signs in and writes the authenticated user into the auth query cache.
- `/auth/change-password`: `useMutation({ mutationFn: changePassword })` completes temporary-password onboarding and updates the auth query cache.
- `/auth/logout`: `useMutation({ mutationFn: logout })` clears auth queries and returns to the login route.

Query keys are centralized in `features/auth/api/auth-queries.ts` using hierarchical keys:

- `authKeys.all`
- `authKeys.currentUser()`

The Query Client is configured in `src/app/query-client.ts` with short session freshness, disabled retry for predictable auth failures, and disabled window-focus refetching.

## UI and Design System

- `@shadcn/react`, `shadcn`, and `components.json`: shadcn-based component workflow and design-system configuration.
- `@base-ui/react`: Accessible unstyled primitives used by generated or composed UI components.
- `@hugeicons/react` and `@hugeicons/core-free-icons`: Icon system approved for this frontend.
- `class-variance-authority`: Variant-based component styling for reusable UI primitives.
- `clsx` and `tailwind-merge`: Class composition helpers. The local `cn` helper combines both so conditional classes and Tailwind conflict resolution stay consistent.
- `cmdk`: Command/menu primitives.
- `sonner`: Toast notifications.
- `date-fns`: Date formatting and manipulation.
- `react-day-picker`: Calendar/date-picker UI behavior.
- `embla-carousel-react`: Carousel behavior.
- `input-otp`: OTP input UI package already present in the frontend stack. It is not part of the planned Better Auth sign-in flow because app authentication is email/password-only.
- `react-resizable-panels`: Resizable layout panels.
- `recharts`: Charts for dashboards and academic analytics.
- `tw-animate-css`: Tailwind-compatible animation utilities.

Design direction for the current screens is intentionally operational, not marketing-led: quiet role-based portal surfaces, restrained spacing, semantic design tokens, one icon family, and compact dashboard information hierarchy.

Branding uses `src/shared/constants/branding.ts` and the public `ncba&e-logo.webp` asset. The larger PNG remains in `public`, but the frontend points to the smaller webp file for faster loading.

## Forms and Validation

- `react-hook-form`: Form state and validation lifecycle.
- `@hookform/resolvers`: Adapter between form validation and schema validators.
- `zod`: Shared-style runtime validation for form schemas and API payload boundaries.

Auth forms currently use:

- `loginSchema`: validates required email, valid email format, and required password.
- `changePasswordSchema`: validates current password, minimum 8-character new password, confirm password, and matching new/confirm passwords.

Forms use `noValidate` so browser-native validation does not bypass the Zod validation path. Field-level errors are rendered below inputs and connected with `aria-describedby` and `aria-invalid`.

## Authentication Direction

Authentication will use Better Auth as the app-level authentication framework.

The only supported sign-in method for this app will be Better Auth email/password login. The frontend should expose sign-in, forgot-password, and reset-password flows only; it should not expose public signup, OTP login, magic links, passkeys, Google, GitHub, Microsoft, or any OAuth provider unless the project requirements change.

Account creation is admin-provisioned. A developer-created super admin creates initial admin accounts, and admins create teacher, HOD, student, and other role accounts. Newly created users receive the default temporary password `@Abc1234`, stored only as a secure hash, and must complete the forgot/reset password flow before normal portal access.

The Better Auth documentation MCP server is configured at the repository root in `mcp.json` so AI-capable development tools can query current Better Auth docs while implementation work is happening.

Better Auth agent skills are also installed under `.agents/skills`:

- `better-auth-best-practices`
- `create-auth`
- `better-auth-security-best-practices`
- `email-and-password-best-practices`
- `organization-best-practices`
- `two-factor-authentication-best-practices`

The current frontend has an email/password auth UI wired to backend `/auth/*` endpoints through Axios and TanStack Query. It treats the backend session as the source of truth and does not store sensitive tokens in browser storage. Protected screens rely on backend-verified session state, role data, account status, and temporary-password onboarding state.

When the Better Auth client package is introduced, it should preserve the same product contract: email/password-only access, no public signup, no OAuth/passkey/magic-link UI unless requirements change, backend-owned session security, and role-aware protected routes.

## Testing and Quality

- `vitest`: Unit and component test runner.
- `jsdom`: Browser-like DOM environment for Vitest.
- `@testing-library/react`, `@testing-library/jest-dom`, and `@testing-library/user-event`: User-focused component tests and DOM assertions.
- `@playwright/test`: End-to-end browser testing for routing, auth, and critical workflows.
- `@vitest/coverage-v8`: Coverage reporting.
- `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, and `globals`: Linting for TypeScript and React rules.
- `prettier` and `prettier-plugin-tailwindcss`: Formatting and Tailwind class ordering.

## Project Requirements Context

The requirements docs define the frontend as the user-facing portal for students, teachers, HODs, admins, and chatbot interactions. Key frontend concerns include role-specific navigation, form-heavy academic workflows, upload flows, dashboards, responsive layouts, and clear error/loading states. Security-sensitive decisions remain backend-owned.
