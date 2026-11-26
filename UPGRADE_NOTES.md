# Dependency Upgrade Notes

Branch: `chore/upgrade-deps` (based on `dev`)
Toolchain: Node 26.12.1, pnpm 10.14.0 (unchanged `packageManager`)

## Summary

- Upgraded web, admin, Convex backend, i18n (no deps), root tooling, and the
  pnpm catalog.
- Aligned shared packages in `apps/native` (better-auth, convex, convex-helpers,
  @convex-dev/*, @tanstack/*, zod, zustand, tailwind-merge, tailwindcss,
  typescript, @types/*) without upgrading Expo/React Native/heroui-native/
  nativewind/uniwind.
- Three intentional holds: React (Expo-pinned), TypeScript 7 (tooling JS API),
  and the Polar SDK/better-auth pair (Convex Polar component compatibility).
  Details below.
- All required verify commands pass. `convex codegen` is not offline and was
  not completed (see Verification).

## Root and pnpm catalog

| Package | Old | New |
| --- | --- | --- |
| turbo | 2.9.18 | 2.11.13 |
| @babel/traverse (aliased `@babel/traverse--for-generate-function-map`) | 7.29.0 | 7.29.7 |
| pnpm (packageManager) | 10.14.0 | 10.14.0 (held) |

Catalog (`pnpm-workspace.yaml`):

| Package | Old | New |
| --- | --- | --- |
| convex | ^1.35.1 | ^1.51.0 |
| better-auth | 1.3.27 | 1.7.27 |
| @convex-dev/better-auth | ^0.9.1 | ^0.13.1 |
| @types/node | ^20 | ^26.6.6 |
| typescript | ^5 | ^6.0.3 |

## apps/web

| Package | Old | New |
| --- | --- | --- |
| @base-ui/react | 1.6.0 | 1.9.0 |
| @convex-dev/agent | 0.3.2 | 0.7.11 |
| @convex-dev/better-auth | 0.9.11 | 0.13.1 |
| @convex-dev/polar | 0.6.4 | 0.9.2 |
| @convex-dev/r2 | 0.8.1 | 0.10.4 |
| @heroui/react | 3.0.0-beta.2 | 3.2.8 |
| @heroui/styles | 3.0.0-beta.2 | 3.2.8 |
| @polar-sh/better-auth | 1.8.4 | 1.8.4 (range pinned to ^1.8.4) |
| @polar-sh/checkout | 0.2.1 | 0.6.0 |
| @polar-sh/nextjs | 0.7.0 | 1.1.1 |
| @polar-sh/sdk | 0.40.3 | 0.47.1 |
| @radix-ui/react-avatar | 1.2.0 | 1.3.1 |
| @radix-ui/react-dialog | 1.1.17 | 1.3.1 |
| @radix-ui/react-progress | 1.1.10 | 1.2.1 |
| @radix-ui/react-scroll-area | 1.2.12 | 1.4.0 |
| @radix-ui/react-select | 2.3.1 | 2.4.1 |
| @radix-ui/react-separator | 1.1.10 | 1.2.0 |
| @radix-ui/react-slider | 1.4.1 | 1.6.1 |
| @radix-ui/react-slot | 1.3.0 | 1.5.0 |
| @radix-ui/react-tabs | 1.1.15 | 1.2.1 |
| @radix-ui/react-tooltip | 1.2.10 | 1.4.1 |
| @tanstack/react-form | 1.33.0 | 1.33.5 |
| @tanstack/react-query | 5.101.0 | 5.108.3 |
| better-auth | 1.3.27 | 1.7.27 |
| convex | 1.41.0 | 1.51.0 |
| eslint | 9.39.4 | 10.15.0 |
| eslint-config-next | 16.0.10 | 16.4.6 |
| lucide-react | 0.546.0 | 1.77.0 |
| motion | 12.40.0 | 14.14.0 |
| next | 16.0.10 | 16.4.6 |
| next-intl | 4.13.0 | 4.15.3 |
| radix-ui | 1.6.0 | 1.8.1 |
| shadcn | 4.11.0 | 4.23.0 |
| sonner | 2.0.7 | 2.0.8 |
| tailwind-merge | 3.6.0 | 3.7.1 |
| tailwindcss | 4.3.1 | 4.3.5 |
| @tailwindcss/postcss | 4.3.1 | 4.3.5 |
| typescript | 5.9.3 | 6.0.3 |
| @types/node | 20.19.43 | 26.6.6 |
| @types/react-dom | 19.1.11 | 19.2.7 |
| yet-another-react-lightbox | 3.32.0 | 3.33.1 |
| zod | 4.4.3 | 4.6.7 |

Held: react/react-dom 19.2.3, @types/react 19.2.14.

## apps/admin

| Package | Old | New |
| --- | --- | --- |
| @convex-dev/agent | 0.3.2 | 0.7.11 |
| @convex-dev/better-auth | 0.9.11 | 0.13.1 |
| @convex-dev/polar | 0.6.4 | 0.9.2 |
| @convex-dev/r2 | 0.8.1 | 0.10.4 |
| @hugeicons/core-free-icons | 4.2.1 | 4.4.0 |
| @hugeicons/react | 1.1.7 | 1.1.10 |
| @polar-sh/better-auth | 1.8.4 | 1.8.4 (range pinned to ^1.8.4) |
| @polar-sh/nextjs | 0.7.0 | 1.1.1 |
| @polar-sh/sdk | 0.40.3 | 0.47.1 |
| @radix-ui/react-avatar | 1.2.0 | 1.3.1 |
| @radix-ui/react-dialog | 1.1.17 | 1.3.1 |
| @radix-ui/react-scroll-area | 1.2.12 | 1.4.0 |
| @radix-ui/react-select | 2.3.1 | 2.4.1 |
| @radix-ui/react-separator | 1.1.10 | 1.2.0 |
| @radix-ui/react-slider | 1.4.1 | 1.6.1 |
| @radix-ui/react-slot | 1.3.0 | 1.5.0 |
| @radix-ui/react-switch | 1.3.1 | 1.4.1 |
| @radix-ui/react-tooltip | 1.2.10 | 1.4.1 |
| @tanstack/react-form | 1.33.0 | 1.33.5 |
| @tanstack/react-query | 5.101.0 | 5.108.3 |
| better-auth | 1.3.27 | 1.7.27 |
| convex | 1.41.0 | 1.51.0 |
| lucide-react | 0.546.0 | 1.77.0 |
| next | 16.0.10 | 16.4.6 |
| radix-ui | 1.6.0 | 1.8.1 |
| shadcn | 4.11.0 | 4.23.0 |
| sonner | 2.0.7 | 2.0.8 |
| tailwind-merge | 3.6.0 | 3.7.1 |
| tailwindcss | 4.3.1 | 4.3.5 |
| @tailwindcss/postcss | 4.3.1 | 4.3.5 |
| typescript | 5.9.3 | 6.0.3 |
| @types/node | 20.19.43 | 26.6.6 |
| @types/react-dom | 19.1.11 | 19.2.7 |
| yet-another-react-lightbox | 3.32.0 | 3.33.1 |
| zod | 4.4.3 | 4.6.7 |

Held: react/react-dom 19.2.3, @types/react 19.2.14.

## packages/backend (Convex)

| Package | Old | New |
| --- | --- | --- |
| @better-auth/expo | 1.3.27 | 1.7.27 |
| @convex-dev/agent | 0.3.2 | 0.7.11 |
| @convex-dev/better-auth | 0.9.11 | 0.13.1 |
| @convex-dev/expo-push-notifications | 0.3.1 | 0.4.2 |
| @convex-dev/polar | 0.6.4 | 0.9.2 |
| @convex-dev/r2 | 0.8.1 | 0.10.4 |
| @convex-dev/rate-limiter | 0.3.2 | 0.4.3 |
| @polar-sh/better-auth | 1.8.4 | removed (unused by backend code) |
| @polar-sh/sdk | 0.40.3 | 0.47.1 |
| ai | 5.0.204 | 7.0.179 |
| better-auth | 1.3.27 | 1.7.27 |
| convex | 1.41.0 | 1.51.0 |
| convex-helpers | (not declared) | 0.1.136 |
| typescript | 5.9.3 | 6.0.3 |
| @types/node | 20.19.43 | 26.6.6 |
| vitest | 3.2.7 | 5.1.1 |
| zod | 4.4.3 | 4.6.7 |

## apps/native (shared packages only)

| Package | Old | New |
| --- | --- | --- |
| @better-auth/expo | 1.3.27 | 1.7.27 |
| @convex-dev/agent | 0.3.2 | 0.7.11 |
| @convex-dev/better-auth | 0.9.11 | 0.13.1 |
| @tanstack/react-form | 1.33.0 | 1.33.5 |
| @tanstack/react-query | 5.101.0 | 5.108.3 |
| better-auth | 1.3.27 | 1.7.27 |
| convex | 1.41.0 | 1.51.0 |
| convex-helpers | 0.1.119 | 0.1.136 |
| expo-network | (not declared) | 56.0.5 (added peer for @better-auth/expo 1.7) |
| i18n-js | 4.5.3 | 4.5.4 |
| lucide-react-native | 0.548.0 | 1.77.0 |
| tailwind-merge | 3.6.0 | 3.7.1 |
| tailwindcss | 4.3.1 | 4.3.5 |
| typescript | 6.0.3 | 6.0.3 (moved to catalog) |
| zustand | 5.0.14 | 5.1.0 |
| @types/react-dom | 19.2.3 | 19.2.7 |

## packages/i18n

No dependencies; nothing to upgrade.

## Intentionally held back

| Package | Current | Latest | Reason |
| --- | --- | --- | --- |
| react / react-dom | 19.2.3 | 19.3.1 | Expo SDK 56 / RN 0.85.3 `bundledNativeModules` pins react and react-dom to 19.2.3. Web and admin stay on the same version. |
| @types/react | 19.2.14 | 19.3.0 | Must match the React 19.2 typings used by Expo SDK 56. |
| @types/react-dom | 19.2.7 | 19.3.0 | Kept on the React 19.2 typings line for the same reason as @types/react. |
| typescript | 6.0.3 | 7.0.2 | TS 7 is the native compiler and ships an incomplete JS API (`require("typescript")` exposes only version metadata). `typescript-eslint` 8.x (used by eslint-config-next) peers on `<6.1.0`, so ESLint cannot run. 6.0.3 is the newest usable TypeScript for this toolchain. |
| @polar-sh/sdk | 0.47.1 | 1.3.2 | `@convex-dev/polar` 0.9.2 (latest) bundles imports of `@polar-sh/sdk/core.js` and `@polar-sh/sdk/funcs/*.js`, which exist only in the 0.x export map. The 1.x SDK restructured exports, so the Convex component cannot be bundled at all with 1.x. 0.47.1 is the newest SDK that satisfies both `@convex-dev/polar` (`>=0.45.0`) and `@polar-sh/better-auth` 1.8.4 (`^0.47.0`). |
| @polar-sh/better-auth | 1.8.4 | 2.1.5 | 2.x peer-requires `@polar-sh/sdk ^1.x`, which cannot be installed alongside the Convex Polar component (see above). 1.8.4 still supports better-auth 1.7 and is the newest 0.x-compatible release. |
| dotenv-expand | 11.0.7 | 1000.0.0 | Not imported anywhere in native source; native-only tooling dependency. The 1000.x major is unrelated in scope and not required by this upgrade. |
| @babel/traverse (alias) | 7.29.7 | 8.1.3 | React Native 0.85 build toolchain is on Babel 7; the alias is only used for `generate-function-map`. |
| pnpm (`packageManager`) | 10.14.0 | 12.21.0 | Separate toolchain migration; out of scope. Lockfile stays on the current pnpm format. |
| Expo / React Native / native-only | SDK 56 pins | SDK 58 / newer | Explicit scope: `expo-*`, `@expo/*`, `react-native-*`, `nativewind`, `uniwind`, `heroui-native`, `react-aria`, `react-stately`, `tailwind-variants`, `@shopify/flash-list`, async-storage, keyboard-controller, purchases, reanimated, worklets, screens, svg, gesture-handler, safe-area-context stay on SDK 56. `npx expo install --check` also reports patch drift inside SDK 56 (`expo` 56.0.12 -> ~56.0.24, `expo-router` ~56.2.11 -> ~56.2.22, etc.); those are deliberately not upgraded per instructions. |

## Breaking changes fixed

1. **better-auth 1.3 -> 1.7 and @convex-dev/better-auth 0.9 -> 0.13**
   - Replaced the legacy auth config with `getAuthConfigProvider()` (`customJwt`, RS256) in `packages/backend/convex/auth.config.ts`.
   - `convex()` plugin now requires the auth config:
     `convex({ authConfig, jwksRotateOnTokenGenerationError: true })`.
   - Removed the `optionsOnly` parameter from `createAuth`.
   - Removed the duplicate legacy provider entry. Convex rejects multiple
     providers with `applicationID: "convex"` ("Multiple auth providers with
     applicationID 'convex' detected"); this surfaced during the codegen attempt.
   - Replaced removed Next.js helpers (`nextJsHandler`, `getToken`) with
     `convexBetterAuthNextJs({ convexUrl, convexSiteUrl })` in both apps and
     route handlers now export `handler.GET/POST`.

2. **Polar SDK / Next.js router**
   - `@polar-sh/nextjs` 1.x renamed `server` to `environment` in `Checkout` and
     `CustomerPortal` configs.
   - Kept the 0.x `Polar` client and `{ result: { items } }` response shape on
     the product-list routes because of the Convex Polar compatibility hold
     above.

3. **Browser bundling of Polar**
   - `polarClient` is now imported from `@polar-sh/better-auth/client`. The
     package root also exports server code that pulls `@polar-sh/sdk`'s
     `node:timers/promises` into the client graph, which panicked Turbopack
     ("chunking context does not support external modules").

4. **Next.js 16.4 + ESLint 10**
   - `apps/web` had no ESLint config, so `pnpm lint:web` failed immediately on
     ESLint 10. Added `apps/web/eslint.config.mjs` using
     `eslint-config-next/core-web-vitals` flat config.
   - Fixed a real hoisting bug in `customer-portal.tsx` and removed
     `Math.random()` during render in the sidebar skeleton.
   - Disabled `react/no-unescaped-entities` (docs prose) and
     `react-hooks/set-state-in-effect` (intentional client-only hydration
     effects) in that config; edited files remain otherwise unchanged.

5. **TypeScript**
   - Experimented with TypeScript 7.0.2: it type-checks the repo, but ESLint
     cannot load `@typescript-eslint/typescript-estree`. Reverted to 6.0.3.
   - Added `"types": ["node"]` to `packages/backend/convex/tsconfig.json` so TS
     finds hoisted `@types/node` (needed after the @types/node 26 upgrade with
     the hoisted node linker).

6. **AI SDK 7 / @convex-dev/agent 0.7**
   - `englishTutor.ts` already uses `instructions` and the current thread/
     stream helpers, so no code changes were needed. Added the
     `convex-helpers` peer to the backend.
   - Also added `expo-network` (SDK 56) because `@better-auth/expo` 1.7 declares
     it as a peer.

7. **No code changes required** for radix-ui 1.8, lucide 1.x, motion 14,
   next-intl 4.15, zod 4.6, tailwind 4.3.5, vitest 5.

## Verification

| Command | Result |
| --- | --- |
| `pnpm install` | pass |
| `pnpm install --frozen-lockfile` | pass (lockfile consistent) |
| `pnpm -F @convex-starter/backend exec tsc --noEmit -p convex/tsconfig.json` | pass (exit 0) |
| `pnpm -F @convex-starter/backend test` | pass, 1 file / 4 tests (vitest 5.1.1) |
| `pnpm -F web build` | pass (Next.js 16.4.6, 20 routes) |
| `pnpm -F admin build` | pass (Next.js 16.4.6, 17 routes) |
| `pnpm lint:web` | pass (0 errors, 2 pre-existing warnings: `<img>` usage and `window.location.assign`) |
| `pnpm -F native exec tsc --noEmit` | pass (exit 0) |
| `npx expo install --check` (native) | reports SDK 56 patch drift on native-only packages only; react/react-native match SDK 56 |
| `pnpm -F @convex-starter/backend exec convex codegen` | not completed: `convex codegen` is not offline. It bundles locally and then pushes the function graph to the configured deployment. The attempted run reached the push stage against the dev deployment (`judicious-dolphin-947.convex.cloud`) and was rejected with HTTP 400 before applying anything (`InvalidModules: Multiple auth providers ...`). After fixing that auth config it was intentionally not re-run, because a successful run would update the dev deployment, which this task forbids. Local component bundling did succeed after pinning `@polar-sh/sdk` to 0.47.1; only the deployment push remains unverified. |

No production deployment, push, merge, or `.env` change was made.

## Known residual warnings

- `pnpm install` reports unmet peer warnings for the (unused) `@heroui/react`
  entry in `apps/web`: it wants `react-aria` 3.53 / `react-aria-components`
  1.22, while `apps/native` must stay on the React Aria versions required by
  SDK 56 / heroui-native. Nothing imports `@heroui/react` in web today, so the
  build is unaffected.
- `pnpm lint:web` exits 0 with two warnings (`<img>` in the uploads page,
  `window.location.assign` in the Polar embed hook). They pre-date this
  upgrade.
- Before this branch, `pnpm -F web build` and `pnpm -F admin build` were already
  failing: the installed `@polar-sh/better-auth` 1.8.4 client types were
  incompatible with better-auth 1.3.27, so `authClient` lost most of its API.
  Aligning better-auth to 1.7.27 fixed that baseline failure.
