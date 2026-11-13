<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- The customer site and admin panel are React + TypeScript (`src/App.tsx`, screens in `src/pages/`, shared components in `src/components/`). Each component keeps the original CSS class names and its own `styles.ts`; `src/styles/index.ts` composes them in a fixed cascade order, so keep the approved design intact when moving rules.
- All data access goes through `src/services/` (mock backend or the server functions in `src/lib/barber.functions.ts`); booking/slot validation lives in `src/lib/barber-rules.ts` (server) and `src/scripts/scheduling.ts` (UI), so it stays testable and server-enforced.
- Owner role is stored in `user_roles`; the first account ever created becomes owner via a database trigger.
- Bookings may hold several services: `serviceIds` (first also kept in `serviceId` for older rows); duration/price are always the sum, computed on both client and server rules.
