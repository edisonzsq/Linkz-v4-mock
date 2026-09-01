# Handoff — continuing this prototype

Context for a fresh session picking this work up.

## Current state

The prototype covers the **sign-up / login / KYC** flows from the *original* Figma
file (`9aWtR6gPo1PTqt1LbGr31g`, page "1. Sign-Up & Login").

Six screens are built from real Figma content and verified against the frame render;
six more have the correct shell but placeholder copy. **`README.md` → "Fidelity notes"
has the screen-by-screen table** — read it before trusting any screen.

`npm run lint` and `npm run build` are clean; all 13 routes render without console
errors at 1440 and 375.

## What was asked for next

Build the **new** Figma file as a mock with mocked data:

> https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=0-1
>
> fileKey: `eX8Lc53tVFuY2QEDW4t1QT`

It is a duplicate into Edison's personal Figma account and contains four areas:
**onboarding, general features, finance, account management**.

Requirements:
1. All screens in those four areas, with mocked data (no backend, no integrations).
2. `README.md` must document **login credentials and payment details** to use during
   training. The credentials section exists already; the payment/finance test data is
   marked pending because those screens are not built.
3. Sanity test, then push to `main`.

Suggested first step: survey the file (`get_metadata` with no nodeId lists pages, then
per page) and report a real frame count per area before building — the previous file's
single page held 159 frames, so scope needs sizing before committing to a sequence.

## Environment constraints found the hard way

- **Figma asset downloads are impossible here.** This container's egress proxy blocks
  `figma.com` by organization policy (`403 CONNECT tunnel failed`), and no Figma MCP
  tool returns image bytes as text. `download_assets` returns URLs that cannot be
  fetched. The logo, photography and icon exports are therefore stand-ins drawn at the
  designed dimensions — README lists each one with its node ID and box size. The fix is
  for a human to export those layers from Figma into `src/assets/figma/`.
- **The Figma MCP connector binds at session start.** If its tools are missing, toggling
  the connector mid-session does not reliably attach them; start a new session instead.
- **Node IDs will differ** in the duplicated file. Code comments currently reference the
  original file's IDs (e.g. `4001:76309`); remap them as screens are rebuilt so the code
  stays traceable to the file actually in use.

## Conventions

- Design tokens live in the `@theme` block at the top of `src/index.css` and keep Figma's
  variable names (`primary-color/400-[brand]` → `--color-primary-400`, etc.).
- All copy and mock data lives in `src/data/mock.ts`, which marks which strings were read
  from Figma and which are placeholder.
- Screens are hash-addressable (`#/kyc-bank`) and registered in `src/prototype/screens.ts`.
- Prototype-only affordances (the screen switcher, demo-credential hints) must stay out of
  the screens themselves so each screen renders identically to the design.
