# LINKZ v4 — Sign-up, Login & KYC Prototype

A React prototype built from the LINKZ v4 Figma file
(`9aWtR6gPo1PTqt1LbGr31g`, page **"1. Sign-Up & Login"**).

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
├── data/mock.ts                # ⭐ all copy and mock data
├── prototype/
│   ├── flow.tsx / flowContext.ts / screens.ts   # screen + mock signup state (hash-addressable)
│   └── ScreenSwitcher.tsx      # prototype-only jump menu (not in the design)
├── layouts/
│   ├── AuthLayout.tsx          # split screen: brand column + white card
│   └── AppShell.tsx            # sidebar 160 + topnav 64 + sub-menu 232
├── components/
│   ├── BrandArtwork.tsx        # concentric rings + illustration
│   └── ui/                     # Button, Field, Icon, Logo, Misc (tabs, OTP, modal…)
└── screens/
    ├── auth/                   # CreateAccount, Otp, BasicInfo, Login, GoogleAuth
    └── app/                    # GetStarted, Kyc (4 steps)
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

### Assets could not be exported

The build environment blocks outbound requests to `figma.com` by **organization
egress policy** (`403 CONNECT tunnel failed`), and no Figma MCP tool returns image
bytes as text — so no logo, icon or photograph could be downloaded. These are
stand-ins drawn to the **same dimensions as the design** and should be swapped for
the real exports:

| Placeholder | Real asset | Designed box |
| --- | --- | --- |
| `ui/Logo.tsx` | LINKZ wordmark SVG (`4001:76332`) | 67.31 × 32 |
| `BrandArtwork.tsx` → `BlockIllustration` | `hand-climbing-wooden-blocks…` photo (`4001:76347`) | 721.41 × 481 |
| `GetStarted.tsx` → `DashboardIllustration` | "Dashboard Card Icons" (`4001:77361`) | 142 × 142 |
| `GetStarted.tsx` → `WelcomeArt` | modal "Welcome Image" | 500 × 308 |
| `ui/Icon.tsx`, `GoogleIcon`, `Captcha` Cloudflare mark | exported icon set | 16 × 16 / 75 × 25 |

**To fix:** export those layers from Figma (select layer → Export), drop the files
into `src/assets/figma/`, and replace the placeholder components with `<img>` tags at
the same dimensions. The concentric ring artwork is already faithful — reproduced at
its designed diameters (796.25 / 653.33 / 510.42 / 367.5 / 224.58) and opacities.

### Coverage

The Figma page holds 159 frames excluding flow-strip annotations: 71 desktop,
71 mobile, 3 email/WhatsApp templates and 14 loose components. This prototype
implements the primary desktop flows. Not yet built: the ~20 error/empty variant
frames, the SSO-specific onboarding frames, the email/WhatsApp templates, and the
mobile-specific frames (the app is responsive, but it is not a transcription of the
375px designs).

### Design tokens

Tokens are transcribed from the Figma variables and keep Figma's names, so any value
can be traced back — see the `@theme` block at the top of `src/index.css`.
