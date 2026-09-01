# Handoff — continuing this prototype

Context for a fresh session picking this work up.

## Current state

The prototype now covers **two** Figma files:

| Area | Figma file | State |
| --- | --- | --- |
| Onboarding — sign-up, login, KYC | `9aWtR6gPo1PTqt1LbGr31g` | 13 screens; 6 verified against frames, 6 with correct shell but placeholder copy |
| General features, finance, account management | `eX8Lc53tVFuY2QEDW4t1QT` (*V.4 Compilation*) | 16 screens covering the happy path in each area |

**`README.md` → "Fidelity notes" has the screen-by-screen table** — read it before
trusting any screen. `README.md` → "Demo credentials & test data" has the login
credentials, payment details, credit limits and referral code for training sessions.

`npm run lint` and `npm run build` are clean; all 29 routes render at 1440 and 375 with
no console errors (`tools/screenshot.mjs`).

## Scope decisions already made

The V.4 file holds **803 screen frames / 181 base screens** — far more than one pass.
Edison chose **"happy path per area, both viewports"**, which is what is built. The
coverage table in `README.md` lists exactly what was left out and why.

If asked to go deeper, the highest-value next targets are, in order:

1. **Error / empty / loading variants** of the lists already built — cheap, because the
   `EmptyState` and `DataTable` primitives already handle them (`rows={[]}` renders the
   empty state).
2. **`4. Know Your Customer`** (`4001:205473`, 55 frames) — the only finance page with no
   representation at all.
3. **Pop-up frames** — send order, delete confirmation, address picker. `Modal` already
   exists in `components/ui/Misc.tsx`.
4. **Order Report, My Catalogue, Shared with me** — currently render the `NotBuilt`
   placeholder.

## Environment constraints found the hard way

- **The V.4 file's pages are invisible to the API.** `get_metadata` with no `nodeId`
  returns *only* `0:1 🖼 Cover` for `eX8Lc53tVFuY2QEDW4t1QT`, on repeated calls and across
  fresh MCP connections. The other 13 pages are reachable **only by direct node ID**.
  Edison supplied those IDs by hand; they are recorded in **`FIGMA-PAGES.md`** and
  **cannot be re-derived**. Do not delete that file.
- **Figma frame renders ARE readable here.** `get_screenshot` with
  `enableBase64Response: true` returns the PNG inline, bypassing the blocked egress. This
  is the single most useful tool for this repo — build against the render, not guesswork.
  (An earlier version of this file claimed the opposite. It was wrong.)
- **Asset *downloads* remain impossible.** The egress proxy blocks `figma.com`
  (`403 CONNECT tunnel failed`), so `download_assets` URLs cannot be fetched. Logos,
  photography and icons are stand-ins at the designed dimensions — README lists each with
  its node ID and box size. The fix is for a human to export them into `src/assets/figma/`.
- **`get_metadata` responses are huge** (up to 1.5 MB). They are written to a file instead
  of returned inline; parse them with a script rather than reading them into context.
  `component` internals are *not* expanded in metadata dumps — widget and cell copy has to
  come from `get_design_context` or a screenshot.
- **Figma MCP quota** is per seat: Full seat on Pro is ~200 calls/day, 15/min. The
  original file `9aWtR6gPo1PTqt1LbGr31g` sits on a **View** seat and its quota is
  exhausted — do not plan work that depends on reading it.
- **Use `eX8Lc53tVFuY2QEDW4t1QT` for onboarding frames too.** Edison's copy carries the
  *same node IDs* as the original onboarding file and is on a Full seat, so a link that
  fails on `9aWtR6gPo1PTqt1LbGr31g` usually works by swapping the file key. That is how
  KYC Section 2 (`4001:84939`) and the popup frames were finally read.
- **Playwright is deliberately not a dependency.** Vercel installs devDependencies during
  the build and Playwright's postinstall would download browsers there. Install it
  unsaved when you want to run `tools/screenshot.mjs` — see `tools/README.md`.

## Mocked multi-user session

`src/prototype/session.tsx` holds two identities — Sanders (Google SSO) and Dheana
(Mobile OTP) — and **one** shared record store they both read and write, so a row added
by one is visible to the other. It persists to `localStorage` (`linkz-v4-shared-data`),
which is what survives the sign-out / sign-in round trip a demo needs; every storage
access is wrapped in try/catch because it throws outright in some privacy-restricted
contexts.

Four lists accept additions: `addresses`, `employees`, `contacts`, `products`. Added rows
are prepended to the design's seeded rows and carry an `AddedBy` badge. To wire another
list, add its key to `Collection` in `sessionContext.ts`, call `add(collection, fields)`
from the form, and merge `shared.<collection>` ahead of the static rows.

Login paths set the user: `GoogleAuth.tsx` → `signIn('sanders')`, `Login.tsx`'s OTP
verify → `signIn('dheana')`. The screen switcher carries a user toggle and a
**Reset data** button so a trainer can swap without re-walking a flow.

## Popups and simulated uploads

`UploadBox` (in `layouts/KycLayout.tsx`) simulates `idle → uploading → uploaded` on a
timer — no file handling anywhere. `SuccessPopup` (`components/ui/SuccessPopup.tsx`)
auto-closes after `AUTO_DISMISS_MS` (7s) with a countdown bar; that rule is for success
popups only, and the business-registration warning deliberately does not use it.

Queued popups live in the session as `pendingPopups: PopupId[]` and show in turn, so
finishing 2FA and submitting KYC both get seen. The first-entry welcome is gated on
`hasSeen('welcome')`, persisted per user under `linkz-v4-seen-popups`.

**`App.tsx` keys the current screen on its id** (`<Fragment key={screen}>`). Without that,
two routes rendering the same component share its state — which is how a dismissed popup
stayed hidden on the next popup route. Keep the key if you touch the router.

## Order module

`docs/order-behaviour-handover.md` is the spec Edison supplied — read it before touching
Orders. Every Figma node ID in it resolves in `eX8Lc53tVFuY2QEDW4t1QT`.

**Built so far:**

- `src/state/orders.ts` — the money model (§2–3): line/order totals, `financeFor`,
  committed vs pending, status derivation, the single `completeOrder` path, send planning
  and `parseAmount`. Pure functions, no React. `src/state/orders.test.ts` pins the rules
  the spec calls out as costly to get wrong (37 tests).
- `src/screens/app/OrderReport.tsx` + `components/app/DateRangePicker.tsx` — §9, from
  Figma `7017:1308` / `7017:1508` / `7017:1350`. Date helpers live in
  `components/app/dateUtils.ts` with their own tests (12).

**Not built yet** (§4–8): the list reading from state, the rebuilt Create/Edit order,
`OrderDetail` with the invoice table, the overpaid flow, the send dialogs, and wiring
Checkout to settle an invoice. The state module already supports all of them — those
screens are UI over `orders.ts`.

**Open question** in §5.5, unanswered: on an even-out send the closing invoice currently
lands at `IDR 0,00`. Making it non-zero would mean restating an earlier invoice, which
contradicts §3.4. `sendOrder` implements the zero and flags it in a comment.

## Conventions

- Design tokens live in the `@theme` block at the top of `src/index.css` and keep Figma's
  variable names (`primary-color/400-[brand]` → `--color-primary-400`, etc.).
- Copy and mock data live in `src/data/mock.ts` (onboarding) and `src/data/appData.ts`
  (the four V.4 areas). Both mark which strings were read from Figma and which are
  invented; keep that honest.
- Screens are hash-addressable (`#/kyc-bank`, `#/checkout`) and registered in
  `src/prototype/screens.ts` **and** the switch in `src/App.tsx`. Registering in only one
  of the two is the easiest mistake to make — an unregistered hash silently falls back to
  the sign-up screen.
- Every screen component carries the Figma node ID it was built from in a doc comment.
  Node IDs differ between the two files; always say which file.
- In-app screens use `ConsoleShell` (sidebar + breadcrumb top bar); onboarding and KYC
  keep `AppShell`.
- Tables go through `DataTable`, which renders a real table from `md` up and stacked cards
  below — that is how one component serves both the 1440px and 375px frames.
- Prototype-only affordances (the screen switcher, demo-credential hints) stay out of the
  screens themselves. Note the switcher is fixed bottom-right and **will cover a sticky
  action bar** if the screen does not reserve room for it (see `Checkout.tsx`).
