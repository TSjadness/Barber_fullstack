# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Booking site + owner admin panel for a barbershop ("Barbearia Rafael Úzeda", product name BarberFlow). UI text, comments and commit messages are in Portuguese (pt-BR). Work happens on `dev`; `main` is the PR target.

## Commands

Frontend (`frontend/`, TanStack Start + React 19 + Vite, deployed to Vercel):
```bash
npm run dev          # vite dev
npm run build        # vite build (nitro uses the vercel preset when VERCEL is set)
npm run lint         # eslint .
npm run format       # prettier --write .
npm run test         # vitest run (jsdom); tests live in src/**/*.test.ts(x)
npm run test:secrets # production build + scan of src/public/.output for exposed credentials/secrets
npx vitest run src/test/barber-rules.test.ts   # single test file
```

Backend (`backend/`, local-only dev API, Node >= 22.16, zero dependencies — uses native `node:sqlite`):
```bash
npm run db:migrate && npm run db:seed && npm run dev   # API on http://127.0.0.1:3333
npm run db:status | db:reset
npm test                                   # node --test tests/*.test.mjs
node --test tests/sqlite-api.test.mjs      # single test file
```
Default local login: `admin@rafaeluzeda.com` / `Barbearia@2026` (override with `MOCK_USER`/`MOCK_PASSWORD` before seeding). `MOCK_ALLOW_PASSWORD_RESET=1` prints reset codes to the backend terminal. The server refuses to start with `NODE_ENV=production`. The login form pre-fills these only under `import.meta.env.DEV`; `src/test/secrets.test.ts` (stores only SHA-256 hashes) fails if they reach any other file or the production bundle — never write credentials or tokens in tests.

## Architecture

**Two data modes, selected by `VITE_API_MODE`** (see `frontend/env.local.example`):
- `supabase` (production): data access goes through TanStack server functions in `frontend/src/lib/barber.functions.ts`, which use the Supabase admin client (`src/integrations/supabase/client.server.ts`) plus `requireSupabaseAuth` middleware. Owner role is in `user_roles`; there is a single owner (the current account) with full access. Login never creates accounts and there is no automatic first-owner trigger (removed in `backend/drizzle/migrations/0001_remove_first_owner.sql`; public signups disabled). A new owner is only added by SQL (see that migration).
- `mock`: the browser calls the local `backend/src/server.mjs` REST API directly (`VITE_API_URL`, default `http://localhost:3333`). CORS allows only localhost:8080/5173.

**React app, one screen state machine.** The pathless layout `src/routes/_barber.tsx` mounts `src/App.tsx` once for both child routes (`_barber/index.tsx` → `/`, `_barber/login.tsx` → `/login`, which only set head meta and render nothing), so switching screens never remounts the app. `App` stacks the providers (`src/contexts/*`: navigation → preferences → overlay → data → admin state) and switches screens by `view` (`public` | `booking` | `admin`; admin without a session shows the login). Moving between screens does **not** use the router: the URL is swapped with `history.replaceState` (`useDocumentSync`). Screens live in `src/pages/` (Public, Booking, Login, Admin + one folder per admin section); `src/pages/` holds screen components, not routes.
- Data: `useBarberData()` exposes the loaded `AppState`; admin edits go through `update(draft => …, options?)`, which clones the state, applies the change and queues a full `PUT /admin/state` (401 → session expired → back to the public site). The server keeps bookings missing from the payload, so a real booking delete must pass `{ deletedBookingIds: [id] }`; paid/completed bookings (`isFinancialRecord`) and services in use can't be deleted. Deleting a client anonymizes its bookings (`customer: "Cliente removido"`, `phone: ""`, `anonymized: true`) — never cascade-delete. Saves use optimistic versioning: `GET /admin/state` returns `version` (`app_state.updated_at`), the provider sends it at send time and stores the returned one; a stale tab gets 409, its queued saves are dropped and the state is reloaded. Both backends implement the check (`backend/src/database/db.mjs` `saveState`, `saveAdminState` in `barber.functions.ts`); a payload without `version` is still accepted for compatibility. `updateLocal` changes only the local copy.
- API: `src/services/api/` maps the logical routes (`/public`, `/admin/state`, `/bookings`, `/login`, `/forgot`, `/reset`, `/logout`) to the mock backend (`mockClient.ts`) or to Supabase server functions/auth (`supabaseClient.ts`), with retries for transient failures. Domain wrappers: `stateService`, `authService`, `bookingService`.
- Business rules used by the UI (slots every 10 min, day availability, weekly hours, edit/manual-booking validation) are in `src/scripts/scheduling.ts`; blocks (`notices` with `type: "block"`) apply per day to the whole shop (`staffId: "all"`) or one professional, everywhere. Toasts go through `src/scripts/notifications.ts`: `notify()` hides non-error messages on mobile, so validation failures must use `notifyError()` (always shown).
- Public booking limits (site only, not admin): max 2 active future bookings per WhatsApp (`checkPhoneLimit`, phone compared without mask/`55`) and 5 bookings per IP per hour. Supabase stores an HMAC of the IP in `booking_rate_limits` (migration `0002`; if the table is missing the IP limit is skipped); the local server keeps it in memory. Limit refusals return 403 with `reason: "phone" | "ip"` (not 409, which sends the customer back to pick a time; not 429, which the API client retries); the booking screen then opens `BookingLimitDialog` with a "Falar com a barbearia" button linking to `wa.me/<shop.whatsapp>` with a prefilled message (`pages/Booking/bookingLimit.ts`), hidden when the shop has no WhatsApp.
- Server-side enforcement: public bookings use `checkSlot`; admin saves (`PUT /admin/state`) run `validateBookingChanges(previous, next)`, which re-checks only new or rescheduled bookings (hours, blocks, conflicts). Both live in `frontend/src/lib/barber-rules.ts` (Supabase) and `backend/src/rules.mjs` (local) — change them together (`backend/src/barber-rules.ts` is an unused copy).
- Modals/loading layers are rendered in `#overlay` via `useOverlay()` (`openModal`, `showBusy`, `show`, `closeModal`). Destructive admin actions use `useConfirm()` (`components/ConfirmDialog`), never `window.confirm`; per-item edit/delete buttons use `components/RowActions` (icon-only 44px on desktop, icon + label stacked on mobile lists).
- Security headers for every server response are in `src/lib/security-headers.ts`, applied in `src/server.ts`. The CSP intentionally omits `script-src`/`style-src` (TanStack hydration and styled-components inject inline code).

**Styles are class-based CSS split per component** (migrated from the old `public/barber/app.css`). Each component/page has `styles.ts` exporting a styled-components `css` block whose selectors are the original class names, so JSX must keep those `className`s. `src/styles/index.ts` composes them into one `createGlobalStyle` **in a fixed cascade order** — when adding/moving rules, keep equal-specificity overrides after the rules they override. `themeCss`/`animationsCss`/`globalCss` (`src/styles/theme.ts`, `animations.ts`, `global.ts`) are injected into `<head>` by the routes (`src/routes/-shared/head.ts`) so the dark background and loader render before hydration.

**Data model is a single state document**: `app_state` row id=1 holds JSON columns `shop`, `services`, `staff`, `notices`, `payments`; `bookings` is a separate table where each row stores the full booking in a `data` JSON column. The admin panel loads the whole state (`GET /admin/state`) and saves it back whole (`PUT /admin/state`, validated by `validateState`). The public endpoint strips customer names/phones and payments.

**Booking rules are duplicated and must stay in sync**: `frontend/src/lib/barber-rules.ts` (server-enforced in Supabase mode, tested in `src/test/barber-rules.test.ts`), `backend/src/rules.mjs` (used by the SQLite server, tested in `backend/tests/blocks.test.mjs`) and the UI copy in `frontend/src/scripts/scheduling.ts`. Bookings can hold several services: `serviceIds` (first also stored in `serviceId` for older rows); duration and price are always the sum.

**Migrations/seed**: Supabase/Drizzle schema in `backend/drizzle/` (`drizzle.config.ts`, `schema.ts`); local SQLite migrations in `backend/src/database/migrations/*.sql`, DB file at `backend/data/barberflow.sqlite` (gitignored, override with `BARBER_DB_PATH`). `db:seed` reads `frontend/src/mock/db.json` and only seeds when no state exists — editing it won't change an existing DB without `db:reset`.

**Static assets**: the logo is `public/assets/images/logo_rafael_uzeda.png`. Staff photos stay at `public/barber/assets/` because saved data (seed and Supabase rows) stores those URLs.

**Legacy backend files (not used)**: `backend/server.js`, `backend/src/store.js`, `backend/src/rules.js` (old CommonJS server; it cannot run under the package's `"type": "module"`).

## Conventions

- Routing is TanStack file-based in `frontend/src/routes/` (`__root.tsx` is the only root layout; `routeTree.gen.ts` is generated — don't edit; folders prefixed with `-` are ignored by the route generator). Don't introduce Next.js/Remix-style `app/layout.tsx`.
- React components use folder-per-component (`Name/index.tsx`, `styles.ts` with styled-components, `types.ts` when needed); shadcn/Radix primitives live in `src/components/ui/` (not used by the barber screens). Context hooks live in `src/hooks/` (`useBarberData`, `useNavigation`, `useOverlay`, …); context objects/providers in `src/contexts/<name>/{context.ts,Provider.tsx}`. Path alias `@/` → `frontend/src/`.
- Icons: `<Icon name="…" />` (`src/components/Icon`) maps the old icon names to lucide-react components.
- TypeScript is strict with `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`; prefer `unknown` + validation for API data (`parseAppState`).
- The project is connected to Lovable: never rewrite pushed history (no force-push, amend/rebase/squash of pushed commits), and keep the branch in a working state since pushes sync back to Lovable. Leave files under `frontend/.lovable/` alone.
