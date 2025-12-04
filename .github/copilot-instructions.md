# Copilot Instructions — Fluxor Frontend

Purpose: Make AI coding agents immediately productive in this Vite + React + TypeScript app by documenting the real project architecture, workflows, and conventions used here.

## Overview
- Stack: Vite (rolldown-vite), React 19, TypeScript (strict), Tailwind CSS v4, Radix UI primitives, TanStack Query + Form, Zustand (with Immer), three.js via @react-three/fiber + drei, Plotly/Recharts.
- App shell: `src/main.tsx` mounts `AppBrowserRouter` with an `ErrorBoundary` and loads global CSS.
- Routing: `src/components/app-browser-router.tsx` uses React Router with `/` → `App` and `/*` → `AppNotFound`.
- Providers: `src/components/providers/providers.tsx` wraps Query, Theme, Tour, and Sidebar providers around the app.
- Deployment: Vercel SPA rewrite via `vercel.json`. Analytics via `@vercel/analytics` in `AppLayout`.

## Run, Build, Lint
- Package manager: pnpm (repo includes `pnpm-lock.yaml`).
- Commands:
  - Dev: `pnpm dev`
  - Build: `pnpm build` (runs `tsc -b` then `vite build`)
  - Preview: `pnpm preview`
  - Lint: `pnpm lint`
- Env: Set `VITE_API_BASE_URL` (e.g., in `.env.local`). Required by API modules.

## Module Resolution & Style
- Alias: `@` → `src` (see `vite.config.ts`), prefer absolute imports like `@/components/...`.
- TypeScript: strict enabled (`tsconfig.app.json`). Avoid `any`; keep types in `src/types/**`.
- Formatting: Prettier + `prettier-plugin-tailwindcss`; Tailwind v4 utilities in `src/index.css`.

## Data Fetching & Validation
- Pattern: API modules in `src/api/**` build URLs from `import.meta.env.VITE_API_BASE_URL` and validate responses with Zod schemas in `src/types/**`.
- Example: `src/api/health.api.ts` and `src/types/health.type.ts`; `src/api/simulation.api.ts` posts to `/simulations/run` and validates with `SimulationResultEntitySchema`.
- Consumption: Use TanStack Query `useQuery`/`useMutation` within components, wrapped by `QueryProvider`. Devtools auto-loaded in dev (`query-provider.tsx`).

## State Management (Zustand + Immer)
- Global simulation state in `src/hooks/use-simulation-store.ts` with a selector helper `createSelectors` from `src/lib/utils.ts`.
- Access pattern: `const ts = useSimulationStore.use.ts()`; setters exposed similarly (e.g., `setAll`, `setAnimationStatus`).
- Keys: `ts,xs,ys,zs,bxs,bys,bzs,bs` plus animation controls (`animationStatus`, `progress`, `speed`, etc.) and `canvasReady`.

## Forms (TanStack React Form)
- Hook factory in `src/hooks/use-simulation-config-form.ts` uses `createFormHook` and default values from `src/lib/defaults.ts`.
- Wrap forms with `withForm(...)` and pass `form` to field components. See `simulation-config-form.tsx` and related inputs.
- Config schema and presets: `src/types/simulation.type.ts` contains Zod `SimulationConfigDtoSchema` and wind function presets.

## 3D Viewport & Animation
- three.js scene via `@react-three/fiber` `Canvas` in `viewport-animation-player.tsx` composing camera, ground, lights, path, target.
- Animation lifecycle updates Zustand: play/pause/end, replay increments `animationResetKey`.
- Keyboard: `f` focus camera, `space` play/pause (when playable), `r` replay.
- Set `canvasReady` in `Canvas.onCreated` before showing the scene; a loading overlay is displayed until ready.

## UI & Styling
- UI primitives live in `src/components/ui/**` (Radix wrappers + class-variance-authority). Use `cn` from `src/lib/utils.ts` for merging classes.
- Tabs, Button, Dialog, etc. are project-tailored; prefer composing these rather than raw Radix/Tailwind.
- The header includes theme toggle and an info dialog; theme state via `ThemeProvider` writing to `localStorage`.

## Charts & Lazy Loading
- Charts mount lazily: `viewport.tsx` switches Tabs and lazy-loads `viewport-charts`. Provide suspense fallbacks when adding new lazy modules.

## Tours
- Onboarding tour in `src/components/tour.tsx` with `TourProvider` context and `TOUR_STEP_IDS` from `src/lib/tour-constants.ts`.
- To add/modify steps, update the `steps` array in `AppContent` and reference stable element IDs.

## Conventions To Follow
- New network calls: add `src/api/<feature>.api.ts` + Zod schemas under `src/types/`, then query via TanStack Query in components.
- Keep state in stores (Zustand); avoid passing deeply through props for simulation data.
- Prefer `@/...` imports, colocate feature components under `src/components/**` and hooks under `src/hooks/**`.
- Respect strict TS, ESLint (`eslint.config.ts`), and Prettier config.

Questions or gaps? If any section feels incomplete (e.g., missing env details or backend URLs), ask for the exact values and I’ll refine this.
