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

**Assets could not be exported.** The Figma MCP allows 6 tool calls per month on a
View seat, and the build environment blocks outbound requests to `figma.com`, so no
image or icon asset could be downloaded. These are stand-ins drawn to the **same
dimensions as the design**, and should be swapped for the real exports:

| Placeholder | Real asset | Designed box |
| --- | --- | --- |
| `ui/Logo.tsx` | LINKZ wordmark SVG (`4001:76332`) | 67.31 × 32 |
| `BrandArtwork.tsx` → `BlockIllustration` | `hand-climbing-wooden-blocks…` photo (`4001:76347`) | 721.41 × 481 |
| `ui/Icon.tsx` | exported icon set | 16 × 16 |
| `GoogleIcon` | "Social Icon" export | 16 × 16 |

The concentric rings in the brand panel *are* faithful — reproduced at their designed
diameters (796.25 / 653.33 / 510.42 / 367.5 / 224.58) and opacities.

**Copy.** `Create Account` copy, the tagline, the support details and the legal links
were read from the Figma file and are exact. The other screens' text could not be read
before the MCP quota ran out, so it is written to match the design's voice — treat it
as placeholder. `src/data/mock.ts` marks which is which.

**Coverage.** The Figma page holds ~180 frames including every error and mobile variant.
This prototype implements the primary flows and their key states (empty, filled,
validation error, attempts-remaining, code-sent, success). It does not reproduce every
individual variant frame.

**Layout accuracy.** The auth shell is transcribed from the Figma geometry: card inset
`left: calc(25% + 43px)`, `right: 16px`, height 829, radius 16; brand column 281 wide at
`left: 100px`; 32px controls, 8px radius, 6px buttons. Below `lg` the brand column drops
and the logo moves into the card, matching the 375px mobile frames.
