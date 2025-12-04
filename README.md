# Fluxor — Frontend

Interactive web app for simulating and visualizing a drone’s flight through a wind field. Configure parameters, run the simulation via a backend API, and explore results in a 3D viewport and charts.

## Features

- Simulation config: starting position, drone speed, time step, steps, and wind velocity functions (presets or custom).
- 3D viewport: animated path with camera controls, target marker, gizmos, and lights (three.js via react-three-fiber).
- Charts: time-series of position and velocity components, lazy-loaded for performance.
- Server status: periodic health check indicator.
- Theming: light/dark with persistence.
- Onboarding tour: highlights core UI areas.

## Quick Start

Prerequisites: Node 20+, pnpm 10+, a running backend exposing health and simulation endpoints.

1) Install deps

```sh
pnpm install
```

2) Set environment
Create `.env.local` with your backend base URL:

```sh
VITE_API_BASE_URL=http://localhost:8000
```

3) Run dev server

```sh
pnpm dev
```

4) Build and preview

```sh
pnpm build
pnpm preview
```

## Environment Variables

- `VITE_API_BASE_URL` (required): Base URL of the backend (e.g. <http://localhost:8000>). Used by `src/api/health.api.ts` and `src/api/simulation.api.ts`.

## Architecture

- Bundler: Vite (rolldown-vite). Alias `@` → `src`.
- UI: React 19 + Tailwind CSS v4 + Radix UI wrappers in `src/components/ui/**`.
- State: Zustand (+ Immer) store in `src/hooks/use-simulation-store.ts` with selector helper `createSelectors`.
- Data fetching: TanStack Query in `QueryProvider` with devtools auto-enabled in development.
- Validation: Zod schemas in `src/types/**` ensure runtime safety of API payloads.
- Forms: TanStack React Form via `createFormHook` with defaults in `src/lib/defaults.ts`.
- 3D/Charts: `@react-three/fiber` + `@react-three/drei`, Plotly/Recharts (charts lazy-loaded).
- Routing: React Router with SPA rewrite (`vercel.json`).

Data flow (typical):

1) User adjusts config in the sidebar form.
2) Frontend posts config to `${VITE_API_BASE_URL}/simulations/run`.
3) Response is validated (Zod) and stored in Zustand.
4) Viewport and charts render from store arrays (`ts,xs,ys,zs,bxs,bys,bzs,bs`).

## Keyboard Shortcuts (Viewport)

- `space`: Play/Pause (when animation is playable)
- `r`: Replay
- `f`: Focus/reset camera

## Scripts

- `pnpm dev`: Start dev server
- `pnpm build`: Type-check then build
- `pnpm preview`: Preview production build
- `pnpm lint`: Run ESLint

## Project Structure (abridged)

```sh
src/
  api/                 # fetch + Zod-validated API calls
  components/          # UI, layout, viewport, providers, tour
  hooks/               # Zustand store, form and utility hooks
  lib/                 # defaults, form contexts, utils, tour constants
  types/               # Zod schemas and shared types
  index.css            # Tailwind v4 theme and base styles
```

Key files:

- `src/components/providers/providers.tsx`: App-wide providers (Query, Theme, Tour, Sidebar)
- `src/components/body/viewport/viewport-animation-player.tsx`: 3D scene & controls
- `src/hooks/use-simulation-store.ts`: Global simulation state + selectors
- `src/api/simulation.api.ts`: Runs simulation; validates with `SimulationResultEntitySchema`
- `src/types/simulation.type.ts`: DTO schema and wind velocity presets

## Deployment

- Vercel-ready SPA: `vercel.json` rewrites all routes to `index.html`.
- Set `VITE_API_BASE_URL` in your hosting environment.

## Contributing

- Use `@` alias imports (`@/…`).
- Keep types/Zod schemas in `src/types/**` and API modules in `src/api/**`.
- Follow repo ESLint/Prettier configs (Tailwind plugin included).

## Credits

- Author: <https://github.com/6ixB>
