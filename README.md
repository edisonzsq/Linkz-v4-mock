# LINKZ v4 — Prototype

A React prototype of the LINKZ v4 product, built from two Figma files:

| Area | Figma file | Pages |
| --- | --- | --- |
| Onboarding — sign-up, login, KYC | `9aWtR6gPo1PTqt1LbGr31g` | "1. Sign-Up & Login" |
| General features, finance, account management | `eX8Lc53tVFuY2QEDW4t1QT` — *V.4 Compilation (Edison)* | 13 pages, listed in [`FIGMA-PAGES.md`](./FIGMA-PAGES.md) |

It covers the **happy path through each area** at both the 1440px desktop and 375px
mobile sizes the designs are drawn at — not every frame. See
[Coverage](#coverage) for what is in and what is out.

**Everything is mocked.** There is no backend, no API calls, no analytics, no auth.
Forms validate and navigate locally; nothing leaves the browser.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # typecheck + production build
npm run preview  # serve the production build
npm run lint
npm run test     # unit tests for the order money model and date helpers
```

## Deploy to Vercel

The prototype is a static SPA — no server, no environment variables, no secrets.

**From the dashboard:** New Project → import `edisonzsq/Linkz-v4-landing-mock` → pick the
branch → Deploy. Vercel detects Vite and reads `vercel.json`; no settings to change.

**From the CLI:**

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production
```

`vercel.json` pins the parts worth pinning:

| Setting | Value | Why |
| --- | --- | --- |
| `framework` | `vite` | skips auto-detection |
| `installCommand` | `npm ci` | reproducible install from `package-lock.json` |
| `buildCommand` / `outputDirectory` | `npm run build` → `dist` | typecheck runs before the build |
| `rewrites` | `/(.*)` → `/index.html` | any URL loads the app (Vercel serves real files first, so `/assets/*` is untouched) |
| `headers` | immutable cache on `/assets/*` | filenames are content-hashed by Vite |

`engines.node` is set to `22.x` because Vite 8 requires Node `^20.19 || >=22.12`.

Fonts are self-hosted through `@fontsource-variable`, so the deployed page makes **no
third-party requests at runtime** — it renders identically behind a corporate proxy or on
a locked-down network.

> Continuing this work in a new session? Start with [`HANDOFF.md`](./HANDOFF.md).

## Demo credentials & test data

Nothing here is real and nothing leaves the browser — there is no backend, no auth
and no payment processing. These are the values to type during a training session.

### The two demo users

The prototype has **two identities**, each signing in through a different path, and they
**share one data set** — anything User A adds is visible to User B, and vice versa.

| | User A | User B |
| --- | --- | --- |
| Name | **Sanders** | **Dheana Titaura** |
| Signs in with | **Google SSO** | **Mobile OTP** |
| Email | `sanders@linkzasia.com` | `dheana@linkzasia.com` |
| Phone | `(+62)811-1509-265` | `(+62)812-3456-7890` |
| Role | Business Owner | Business Owner |

**Sign in as User A (Sanders):** from `#/login` press **Continue with Google**, pick
`sanders@linkzasia.com`, then **Continue**.

**Sign in as User B (Dheana):** from `#/login` stay on the **Phone** tab, enter any
number (e.g. `811 1509 265`), press **Send Code**, then enter **`123456`**.

To swap users mid-demo without walking a login flow, use the **Signed in as** toggle in
the screen switcher (bottom-right). The sidebar profile, the My Profile screen and the
"Added by" tags all follow whoever is signed in.

| Field | Value |
| --- | --- |
| Phone | any number, e.g. `811 1509 265` (dial code defaults to `+62` Indonesia) |
| Email | any valid-looking address |
| **OTP / verification code** | **`123456`** |
| Google SSO | click through — the account picker is mocked |

Any other 6-digit code is rejected and shows the designed error state, which is useful
to demonstrate deliberately. On the sign-up OTP screen the form submits itself on the
sixth digit — there is no button, matching the design.

Deep-linking to an in-app screen (e.g. `#/dashboard`) before signing in shows
**"Signed out"** in the sidebar. The screens still render; pick a user from the switcher
or walk a login path.

### Showing that both users share data

This is the demo worth rehearsing:

1. Sign in as **Sanders** (Google SSO).
2. Go to **Manage → My Profile → Address Book**, press **Add Address**, fill in a label,
   recipient and street, and save. The new row appears at the top of the list tagged
   **"Added by Sanders"**.
3. Switch to **Dheana** (switcher toggle, or Logout and sign in with the phone OTP).
4. Open the same **Address Book** — Sanders' row is there, still tagged **Added by
   Sanders**.
5. As Dheana, invite an employee under **Manage → My Employee**, then switch back to
   Sanders: the invite is visible, tagged **Added by Dheana**.

Four lists accept new entries and are shared between the two users:

| Screen | Add via | Stored as |
| --- | --- | --- |
| Address Book (`#/address-book`) | **Add Address** | `addresses` |
| My Employee (`#/employees`) | **Invite Employee** | `employees` |
| Business Contact (`#/contacts`) | **Add Contact** (saved to whichever tab you are on) | `contacts` |
| Master Products (`#/master-products`) | **Create Product** | `products` |

**How the sharing works, and its limits.** Added rows live in the browser's
`localStorage` under `linkz-v4-shared-data`, which is what lets them survive a sign-out,
a user switch and a page reload. It is still entirely local: **nothing is sent anywhere**,
and the two "users" share data only because they share a browser profile. A different
browser, a private window, or another machine starts empty — so this demonstrates
multi-user visibility, it does not implement it. Rows seeded from the design are always
present and carry no "Added by" tag. **Reset data** in the screen switcher clears
everything added during the session.

### Identities used in the mock

| Where | Value |
| --- | --- |
| Company on the top bar | LINKZ IN JOGJA |
| Dashboard greeting | "Welcome, Sanders" |
| Support contact | `support@linkzasia.com` · `(+62)811-1509-265` |

### KYC test data

| Field | Value to use |
| --- | --- |
| Company registration | `Personal Business (no Deed of Establishment)` or `Established Business (has Deed of Establishment)` — those are the only two options |
| Company name | anything, e.g. `Sinar Jaya Trading` |
| Industry | any option |
| Company size | `1 - 5` |
| State / Province | `DKI Jakarta` |
| Postal code | `12345` |
| Document uploads | buttons are inert — no file is read or stored |

### Payment details

Every payment screen is a mock. **No card is charged, no account is debited, no request
leaves the browser** — the "Proceed Payment" button just advances to the confirmation
state. Use these values so a training session shows the same numbers on every machine.

**Checkout** (`#/checkout` — reachable from Purchase Order → the **Pay** button on the
`Sent` row):

| Field | Value |
| --- | --- |
| Payable amount | `IDR 1.000.000,00` (Subtotal `IDR 1.000.000,00`, Delivery `IDR 0,00`, Discount `(IDR 0,00)`, Taxes `IDR 0,00`) |
| Item | `Hazmat Suit` · `SKU-001` · Qty 1 |
| Buyer | LINKZ Asia Jogja — Dheana Titaura, `+62 8310123456789`, `Dheana@email.com` |
| Seller | KFC Indonesia Co., Ltd. — Sanders, `Sanders@kfc.com` |

| Payment method | What to demo |
| --- | --- |
| **Cards Payment → BRI** | the default selection; the LINKZ partner processor |
| Cards Payment → Local Cards / Foreign Cards | Indonesian-issued vs overseas cards |
| QRIS | scan-to-pay |
| **Bank Transfer → VIMA Bank** | virtual account `8808 1509 2650 4471` |
| Bank Transfer → BCA | virtual account `7011 1509 2650 4471` |
| Offline Payment | pay the seller directly after confirmation |

> **No card number is needed anywhere.** The design has no card-entry form — selecting a
> method and pressing **Proceed Payment** is the whole flow. If someone asks for a test
> card, the honest answer is that this prototype never collects one.

**Credit and financing** (`#/spl`, `#/bpl`, `#/dashboard`):

| Field | Value |
| --- | --- |
| Biz Growth Fund limit | `IDR 20.000.000` total, shared between SPL and BPL |
| Available / Used | `IDR 20.000.000` / `IDR 0` |
| Disbursement account | VIMA Bank · `8808 1509 2650 4471` |
| SPL financing fee | 3% — on a `IDR 15.000,00` invoice: fee `IDR 450,00`, payout `IDR 14.550,00` |
| SPL request statuses | `Processing`, `Approved`, `Rejected` (one row each) |
| BPL bills | two `Outstanding`, one `Repaid`; 30-day terms |
| Settlement | next `IDR 1.000.000` on 20 Jul 2026 |

**Dashboard figures** (all `This month`): revenue `IDR 120.000.000` (+20%), spending
`IDR 80.000.000` (−14.3%), gross profit `IDR 40.000.000` at 33.3% margin, payable
`IDR 3.000.000`, receivable `IDR 8.500.000`.

### Referral code

| Field | Value |
| --- | --- |
| Referral code | `DHEANA-8241` |
| Referral link | `https://linkzasia.com/r/DHEANA-8241` |

The **Copy** buttons write to the real clipboard. A referral stays `Pending` until the
invited user's first transaction, then flips to `Completed` — the two sample rows show
one of each.

## Walking the prototype

A **screen switcher** sits in the bottom-right corner — jump to any screen without
walking the flow. Screens are also addressable by hash, e.g. `#/kyc-bank`.

The happy path runs end to end:

`#/create-account` → OTP → Basic Info → Account Created → Get Started → KYC
(Business → Bank → 2FA) → Submitted.

**Any OTP code in this prototype is `123456`.** Wrong codes burn an attempt and show
the designed error state.

| Hash | Screen | Figma node |
| --- | --- | --- |
| `#/create-account` | Create LINKZ Account | `4001:76309` |
| `#/otp-email` / `#/otp-phone` | Verification code | `4001:76466`, `4001:77314` |
| `#/basic-info` | Basic info form | `4001:76532` |
| `#/account-created` | Account created modal | `4001:76718` |
| `#/login` | Login (phone / email tabs) | `4001:77661`, `4001:77931` |
| `#/google-auth` | Google SSO choose + confirm | `4001:78216`, `4001:78300` |
| `#/get-started` | Get Started dashboard | `4001:77356` |
| `#/kyc-business` | KYC — Business overview | `4001:84233`, `4001:84868` |
| `#/kyc-bank` | KYC — Bank account details | `4001:84939` |
| `#/kyc-2fa` | KYC — Two-factor auth | `4001:85492`, `4001:85916` |
| `#/kyc-submitted` | KYC submitted | `4001:77400` |
| `#/popup-kyc-complete` | "KYC Documents Submitted" popup | `4001:85240` |
| `#/popup-2fa-complete` | "2FA Verified" popup | `4001:87636` |
| `#/popup-welcome` | "Welcome to LINKZ!" first-entry popup | `4001:77356` |

All five of these were built against the frames in **`eX8Lc53tVFuY2QEDW4t1QT`**, which
carries the same node IDs as the original onboarding file and is readable here.

### Document uploads are simulated

Every **Upload File** button — the three in KYC section 1 and the bank statement in
section 2 — runs `idle → uploading → uploaded` on click. **No file is chosen, read or
stored**; the progress bar is a timer and the file name is generated from the field
label. The uploaded state offers **Replace** (re-runs the animation) and **Remove**
(back to idle). Good for demoing the flow; there is nothing behind it.

### Popups and when they fire

| Popup | Fires when | Auto-closes |
| --- | --- | --- |
| KYC complete | leaving the KYC submitted screen via **Back to Get Started** | yes, ~7s |
| 2FA complete | pressing **Finish** on the 2-factor step | yes, ~7s |
| First entry | the first time a user reaches Get Started, whichever path they took in — skipped KYC, KYC without 2FA, or both | yes, ~7s |
| Change business type | changing the registration dropdown **after** answering something in KYC section 1 | **no** — it needs a decision |

The three success popups close themselves after ~7 seconds and carry a dismiss icon so a
reader who is done need not wait. The frames show a dismiss ✕ and nothing else — no
confirm button, no visible countdown — so the popups match that; the auto-close is
behaviour layered on top of the design. The business-type warning is deliberately excluded
from the rule: it asks whether to discard the form, so it waits for an answer.

If more than one success popup is queued — finishing 2FA and submitting KYC happen back
to back — they show **in turn** rather than overwriting each other. First entry is tracked
per user in `localStorage` (`linkz-v4-seen-popups`), so it fires once and stays dismissed
across reloads.

### V.4 Compilation — general features

| Hash | Screen | Figma node |
| --- | --- | --- |
| `#/dashboard` | Dashboard (overview, performance, order, finance, BI) | `4001:113931` |
| `#/sales-orders` | Sales Order list | `4001:13925` |
| `#/purchase-orders` | Purchase Order list | `4001:13925` |
| `#/order-new` | Create Order | `4001:11308` |
| `#/checkout` | Checkout — payment methods | `4001:18536` |
| `#/order-report` | Order Report — Settlement / Payments | `7017:1308`, `7017:1508`, `7017:1350` |
| `#/master-products` | Master Products | `4033:50119` |
| `#/product-new` | Create Product | `4033:50119` |

### V.4 Compilation — finance

| Hash | Screen | Figma node |
| --- | --- | --- |
| `#/spl` | Seller Pay Later — claim, requests, billings | `4001:187533` |
| `#/bpl` | Buyer Pay Later — billings, history | `4001:198717` |
| `#/bizloan` | Biz Loan landing | `4001:204677` |

### V.4 Compilation — account management

| Hash | Screen | Figma node |
| --- | --- | --- |
| `#/profile` | My Profile — Account Information | `4001:222163` |
| `#/address-book` | My Profile — Address Book | `4001:222917` |
| `#/company-list` | My Profile — Company List | `4001:223181` |
| `#/employees` | My Employee | `4001:246556` |
| `#/contacts` | Business Contact | `4001:253744` |
| `#/referrals` | Referrals — how it works + history | `4001:263130` |

**Sidebar behaviour:** clicking a group (Order, Catalogue, Finance, Manage) from outside
that section opens it *and* goes to its landing screen — Sales Order, Master Products,
Seller Pay Later and My Profile respectively. Clicking it while you are already inside
that section just collapses or expands the submenu. The same four entries on the
onboarding shell (Get Started, KYC) cross into those areas too.

Two sidebar destinations exist in the design but are **outside the built happy path** —
`#/my-catalogue` and `#/shared-catalogue`. They render an explicit
"not part of this mock" placeholder rather than dropping you on the sign-up screen
mid-demo.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 — no config file; the design tokens live in the `@theme` block
  at the top of `src/index.css`
- Plus Jakarta Sans self-hosted via `@fontsource-variable/plus-jakarta-sans`
  (no Google Fonts request at runtime)
- No router, no component library, no state library

## Layout

```
src/
├── App.tsx                     # screen switch
├── index.css                   # ⭐ design tokens transcribed from Figma
├── data/
│   ├── mock.ts                 # ⭐ onboarding copy and mock data
│   └── appData.ts              # ⭐ copy and mock data for the four V.4 areas
├── prototype/
│   ├── flow.tsx / flowContext.ts / screens.ts   # screen + mock signup state (hash-addressable)
│   ├── session.tsx / sessionContext.ts          # ⭐ two demo users + the shared data store
│   └── ScreenSwitcher.tsx      # prototype-only jump menu (not in the design)
├── layouts/
│   ├── AuthLayout.tsx          # split screen: brand column + white card
│   ├── AppShell.tsx            # onboarding/KYC shell
│   └── ConsoleShell.tsx        # in-app shell: sidebar 160 + breadcrumb top bar 56
├── components/
│   ├── BrandArtwork.tsx        # concentric rings + illustration
│   ├── app/                    # Console.tsx (card, table, toolbar, pager, empty
│   │                           #   state, tabs), consoleUtils.ts, AddedBy.tsx
│   └── ui/                     # Button, Field, Icon, Logo, Misc (tabs, OTP, modal…)
└── screens/
    ├── auth/                   # CreateAccount, Otp, BasicInfo, Login, GoogleAuth
    └── app/                    # GetStarted, Kyc, Dashboard, Orders, Checkout,
                                #   Products, Finance, Account, NotBuilt
tools/screenshot.mjs            # renders every screen at both sizes (see tools/README.md)
```

## Design tokens

Transcribed from the Figma variables, keeping Figma's names so they can be traced back:

| Figma variable | Token | Value |
| --- | --- | --- |
| `primary-color/400-[brand]` | `--color-primary-400` | `#499873` |
| `neutral-color/100…900` | `--color-neutral-*` | `#f2f4f7` … `#101828` |
| `text-color/primary` | `--color-text-primary` | `#101828` |
| `text-color/secondary` | `--color-text-secondary` | `#475467` |
| `font/size/xs3` | `--text-xs3` | `12px / 16px` |
| `font/size/xs2` | `--text-xs2` | `14px / 20px` |
| `font/size/xl` | `--text-xl` | `30px / 38px` |
| `spacings/100…400` | `--spacing-s100…s400` | `4 / 8 / 16 / 24px` |

## Fidelity notes

Read this before comparing side by side with Figma.

### Screen-by-screen status

| Screen | Figma node | Copy | Layout |
| --- | --- | --- | --- |
| Create Account | `4001:76309` | ✅ from Figma | ✅ verified against frame |
| OTP (email / phone) | `4001:76466`, `4001:77314` | ✅ from Figma | ✅ verified against frame |
| Basic Information | `4001:76532` | ✅ from Figma | ✅ verified against frame |
| Benefit / KYC intro | `4001:76792` | ✅ from Figma | ✅ verified against frame |
| Get Started dashboard | `4001:77356` | ✅ from Figma | ✅ verified against frame |
| KYC — Business Overview | `4001:84233` | ✅ from Figma | ✅ verified against frame |
| Account Created modal | `4001:76718` | ⚠️ placeholder | shell correct |
| Login (phone / email) | `4001:77661`, `4001:77931` | ⚠️ placeholder | shell correct |
| Google SSO | `4001:78216`, `4001:78300` | ⚠️ placeholder | approximate |
| KYC — Bank Account | `4001:84939` | ⚠️ placeholder | ✅ correct shell |
| KYC — 2FA | `4001:85492` | ⚠️ placeholder | ✅ correct shell |
| KYC — Submitted | `4001:77400` | ⚠️ placeholder | approximate |

Screens marked ⚠️ use copy written to match the design's voice; their Figma text has
not been read yet. `src/data/mock.ts` marks which strings came from the file.

#### V.4 Compilation areas

Every screen below was built against the rendered Figma frame, so labels, column
headings, tab names and button text are the design's own.

| Screen | Figma node | Copy | Layout |
| --- | --- | --- | --- |
| Dashboard | `4001:113931` | ✅ from frame | ✅ verified against frame |
| Sales / Purchase Order list | `4001:13925` | ✅ from frame | ✅ verified against frame |
| Checkout | `4001:18536` | ✅ from frame | ✅ verified against frame |
| Master Products | `4033:50119` | ✅ from frame | ✅ verified against frame |
| Seller Pay Later | `4001:187533` | ✅ from frame | ✅ verified against frame |
| My Profile — Account Information | `4001:222163` | ✅ from frame | ✅ verified against frame |
| Buyer Pay Later | `4001:198717` | ✅ headings from frame | ⚠️ built from the SPL frame's shape |
| Biz Loan | `4001:204677` | ✅ from metadata | ⚠️ banner photo is a stand-in |
| Referrals | `4001:263130` | ✅ from metadata | ⚠️ step illustrations are stand-ins |
| Create Order | `4001:11308` | ⚠️ field labels inferred | ⚠️ built from the list frame's conventions |
| Create Product | `4033:50119` | ⚠️ field labels inferred | ⚠️ form not rendered in the frames surveyed |
| Address Book / Company List | `4001:222917`, `4001:223181` | ⚠️ from metadata | ⚠️ list shape follows the other tables |
| My Employee | `4001:246556` | ⚠️ from metadata | ⚠️ list shape follows the other tables |
| Business Contact | `4001:253744` | ⚠️ from metadata | ⚠️ list shape follows the other tables |

**Table rows are invented.** The frames show one to three sample rows; the lists here
extend that pattern so tables, pagination, filters and empty states have something to
show. Every row is fictional — see the header comment in `src/data/appData.ts`.

### Assets could not be exported

The build environment blocks outbound requests to `figma.com` by **organization egress
policy** (`403 CONNECT tunnel failed`), so exported asset URLs cannot be fetched and no
logo, icon or photograph could be downloaded. These are stand-ins drawn to the **same
dimensions as the design** and should be swapped for the real exports:

(Frame *renders* can still be seen: `get_screenshot` with `enableBase64Response: true`
returns the PNG inline and bypasses the blocked egress. That is how the V.4 screens were
verified — but it returns a picture of the frame, not the underlying asset files.)

| Placeholder | Real asset | Designed box |
| --- | --- | --- |
| `ui/Logo.tsx` | LINKZ wordmark SVG (`4001:76332`) | 67.31 × 32 |
| `BrandArtwork.tsx` → `BlockIllustration` | `hand-climbing-wooden-blocks…` photo (`4001:76347`) | 721.41 × 481 |
| `GetStarted.tsx` → `DashboardIllustration` | "Dashboard Card Icons" (`4001:77361`) | 142 × 142 |
| `GetStarted.tsx` → `WelcomeArt` | modal "Welcome Image" | 500 × 308 |
| `ui/Icon.tsx`, `GoogleIcon`, `Captcha` Cloudflare mark | exported icon set | 16 × 16 / 75 × 25 |
| `Finance.tsx` → Biz Loan banner | `side-view-business-people-working-with-ipad` photo (`4001:204556`) | 304 × 219.66 |
| `Account.tsx` → Referral step art | `undraw_social-share`, `undraw_gift-card` (`4001:263149`, `4001:263318`) | 150 × 100 / 185 × 101 |
| `Products.tsx`, `Checkout.tsx` → product thumbnails | product photography | 40 × 40 / 56 × 56 |

**To fix:** export those layers from Figma (select layer → Export), drop the files
into `src/assets/figma/`, and replace the placeholder components with `<img>` tags at
the same dimensions. The concentric ring artwork is already faithful — reproduced at
its designed diameters (796.25 / 653.33 / 510.42 / 367.5 / 224.58) and opacities.

### Coverage

The V.4 Compilation file was surveyed page by page before building. It holds
**803 screen frames** across 13 pages, which fold to **181 distinct base screens** once
state variants and desktop/mobile pairs of the same screen are grouped:

| Area | Pages | Frames | Base screens | Built here |
| --- | ---: | ---: | ---: | ---: |
| Onboarding | 2 | 166 | 38 | 13 screens (from the older file) |
| General features | 3 | 249 | 63 | 7 |
| Finance | 4 | 160 | 41 | 3 |
| Account management | 4 | 228 | 39 | 6 |
| **Total** | **13** | **803** | **181** | **29** |

Per-page counts and the node IDs live in [`FIGMA-PAGES.md`](./FIGMA-PAGES.md).

**What is not built:** the error, empty-search and loading variants of each list; the
multi-step KYC flows inside the finance area (`4. Know Your Customer`, 55 frames); the
pop-up/modal frames (send order, delete confirmations, address pickers); Order Report,
My Catalogue and Shared with me; and the mobile-specific frames as transcriptions — the
app is responsive and was checked at 375px, but it is not a pixel copy of the 375px
designs. The older onboarding file's ~20 error variants and email/WhatsApp templates
also remain unbuilt.

**One page may be missing.** General Features numbers `1. Dashboard`,
`2. Order Management`, `4. Master Product` — there is no `3.`, while every other area
numbers consecutively. Either a page was skipped when the page links were collected or
one has not been shared.

### Verifying against the design

`tools/screenshot.mjs` renders every screen at 1440×900 and 375×824 and reports console
errors. Figma renders can be pulled for comparison with the MCP `get_screenshot` tool
using `enableBase64Response: true` — see the note in `FIGMA-PAGES.md`.

### Design tokens

Tokens are transcribed from the Figma variables and keep Figma's names, so any value
can be traced back — see the `@theme` block at the top of `src/index.css`.
