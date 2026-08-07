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
- `@tanstack/react-router`: Planned client-side routing for portal areas such as student, teacher, HOD, admin, and public/auth flows.
- `@tanstack/react-query`: Server-state management for API reads, mutations, caching, loading states, and retries.
- `axios`: HTTP client for backend API calls.
- `zustand`: Lightweight client state for UI/session-adjacent state that should not live in server cache.

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

## Forms and Validation

- `react-hook-form`: Form state and validation lifecycle.
- `@hookform/resolvers`: Adapter between form validation and schema validators.
- `zod`: Shared-style runtime validation for form schemas and API payload boundaries.

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

The current frontend package list does not yet include a Better Auth client package or auth screens. When auth is implemented, frontend code should use Better Auth's client session helpers for the email/password-only flow, treat the backend session as the source of truth, and avoid storing sensitive tokens in browser storage. Protected screens should rely on backend-verified session state, role data, account status, and password-reset onboarding state.

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
