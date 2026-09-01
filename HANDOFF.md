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
- **Playwright is deliberately not a dependency.** Vercel installs devDependencies during
  the build and Playwright's postinstall would download browsers there. Install it
  unsaved when you want to run `tools/screenshot.mjs` — see `tools/README.md`.

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
