# Linkz v4 — Landing Page Prototype

A React prototype of the Linkz v4 marketing site. **Everything is mocked** — there is no
backend, no API calls and no analytics. The form submit and the "order desk" preview are
presentational only.

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (via `@tailwindcss/vite`, no `tailwind.config.js` —
  design tokens live in the `@theme` block at the top of `src/index.css`)
- `oxlint` for linting
- Zero runtime dependencies beyond React

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

```bash
npm run build    # typecheck + production build to dist/
npm run preview  # serve the production build
npm run lint
```

## Where things are

```
src/
├── App.tsx                  # section order for the whole page
├── index.css                # design tokens (@theme) + base styles + utilities
├── data/content.ts          # ⭐ ALL copy and mock data
└── components/
    ├── Nav.tsx              # sticky header, scroll state, mobile sheet
    ├── Hero.tsx             # headline + CTAs + product preview
    ├── ProductPreview.tsx   # fake "order desk" UI (mock orders, sparkline)
    ├── LogoCloud.tsx        # CSS marquee of partner names
    ├── Features.tsx         # 6 feature cards + stat band
    ├── HowItWorks.tsx       # dark 4-step section
    ├── Testimonials.tsx     # 3 quotes
    ├── Pricing.tsx          # 3 plans, monthly/annual toggle
    ├── Faq.tsx              # accordion
    ├── FinalCta.tsx         # email capture (mocked, no network)
    ├── Footer.tsx
    └── ui/                  # Button, Container/Eyebrow/SectionHeading, Icon
```

### Changing the content

`src/data/content.ts` is the single source of truth for every string, price, statistic and
mock record on the page. Edit that file and the page re-skins itself — the components take
no hard-coded copy.

### Changing the look

Colour, font and radius tokens are defined once in the `@theme` block in `src/index.css`
(`--color-brand-*`, `--color-ink-*`, `--color-signal-*`). Change them there and the whole
page follows. The palette is an ink/indigo base with a green "signal" accent; typography is
Inter with Instrument Serif used for italic accents.

## What's interactive

Mocked but genuinely working in the browser:

- Sticky nav that changes on scroll, plus a mobile menu sheet
- Pricing monthly/annual toggle
- FAQ accordion
- Email capture that swaps to a success state (nothing is sent anywhere)
- Smooth-scrolling anchor navigation between sections

## Notes

Company names, logos, quotes, prices and metrics are invented placeholders for a prototype.
