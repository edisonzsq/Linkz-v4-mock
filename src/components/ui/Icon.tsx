import type { SVGProps } from 'react'

/**
 * Inline stroke icons.
 *
 * NOTE: the Figma file exports its own icon SVGs, but this environment could not
 * download them (see README → "Assets"). These are visually equivalent stand-ins
 * drawn at the same 16px box the design uses; swap them for the real exports when
 * the Figma assets are available.
 */
const paths: Record<string, React.ReactNode> = {
  globe: (
    <>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M1.5 8h13" />
      <path d="M8 1.5c1.7 1.8 2.6 4 2.6 6.5S9.7 12.7 8 14.5C6.3 12.7 5.4 10.5 5.4 8S6.3 3.3 8 1.5Z" />
    </>
  ),
  'chevron-down': <path d="m4 6 4 4 4-4" />,
  'chevron-up': <path d="m4 10 4-4 4 4" />,
  'chevron-left': <path d="m10 4-4 4 4 4" />,
  'chevron-right': <path d="m6 4 4 4-4 4" />,
  'arrow-left': (
    <>
      <path d="M13 8H3" />
      <path d="m7 4-4 4 4 4" />
    </>
  ),
  check: <path d="m3 8.5 3.2 3.2L13 5" />,
  x: (
    <>
      <path d="m4 4 8 8" />
      <path d="M12 4 4 12" />
    </>
  ),
  plus: (
    <>
      <path d="M8 3v10" />
      <path d="M3 8h10" />
    </>
  ),
  info: (
    <>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 7.2v4" />
      <path d="M8 4.9h.01" />
    </>
  ),
  'alert-circle': (
    <>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4.8v3.6" />
      <path d="M8 11.2h.01" />
    </>
  ),
  shield: (
    <>
      <path d="M8 1.6 13.2 3.5v4.2c0 2.9-2.1 5.2-5.2 6.1-3.1-.9-5.2-3.2-5.2-6.1V3.5Z" />
      <path d="m5.9 7.9 1.4 1.4 2.8-2.8" />
    </>
  ),
  upload: (
    <>
      <path d="M2.5 10.5v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2" />
      <path d="M8 2.5v7.5" />
      <path d="m4.8 5.7 3.2-3.2 3.2 3.2" />
    </>
  ),
  mail: (
    <>
      <rect x="1.8" y="3.2" width="12.4" height="9.6" rx="1.4" />
      <path d="m2.4 4.2 5.6 4 5.6-4" />
    </>
  ),
  phone: (
    <path d="M5.4 2.3 6.7 5 5.4 6.3a8.6 8.6 0 0 0 4.3 4.3L11 9.3l2.7 1.3v2.1a1 1 0 0 1-1.1 1A11.4 11.4 0 0 1 2.3 3.4a1 1 0 0 1 1-1.1Z" />
  ),
  building: (
    <>
      <path d="M2.5 13.5h11" />
      <path d="M3.8 13.5V3.2a.7.7 0 0 1 .7-.7h5a.7.7 0 0 1 .7.7v10.3" />
      <path d="M10.2 13.5V6.3h1.8a.7.7 0 0 1 .7.7v6.5" />
      <path d="M5.8 5h2M5.8 7.5h2M5.8 10h2" />
    </>
  ),
  bank: (
    <>
      <path d="m8 1.9 5.8 3.1H2.2Z" />
      <path d="M3.7 6.6v5.1M6.6 6.6v5.1M9.4 6.6v5.1M12.3 6.6v5.1" />
      <path d="M2.2 13.5h11.6" />
    </>
  ),
  'file-check': (
    <>
      <path d="M9 1.8H4.6a1 1 0 0 0-1 1v10.4a1 1 0 0 0 1 1h6.8a1 1 0 0 0 1-1V5.2Z" />
      <path d="M9 1.8v3.4h3.4" />
      <path d="m6 9.6 1.4 1.4 2.6-2.8" />
    </>
  ),
  bell: (
    <>
      <path d="M4 6.6a4 4 0 1 1 8 0c0 3 1.2 4.1 1.2 4.1H2.8S4 9.6 4 6.6Z" />
      <path d="M6.6 13a1.6 1.6 0 0 0 2.8 0" />
    </>
  ),
  search: (
    <>
      <circle cx="7.2" cy="7.2" r="4.7" />
      <path d="m10.8 10.8 2.7 2.7" />
    </>
  ),
  menu: (
    <>
      <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />
    </>
  ),
  clock: (
    <>
      <circle cx="8" cy="8" r="6.3" />
      <path d="M8 4.5V8l2.4 1.4" />
    </>
  ),
  card: (
    <>
      <rect x="1.8" y="3.4" width="12.4" height="9.2" rx="1.6" />
      <path d="M1.8 6.6h12.4" />
      <path d="M4.4 10.2h2.4" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="8" cy="4.4" rx="5.4" ry="2.2" />
      <path d="M2.6 4.4v3.4c0 1.2 2.4 2.2 5.4 2.2s5.4-1 5.4-2.2V4.4" />
      <path d="M2.6 7.8v3.4c0 1.2 2.4 2.2 5.4 2.2s5.4-1 5.4-2.2V7.8" />
    </>
  ),
  save: (
    <>
      <path d="M2.6 3.6A1 1 0 0 1 3.6 2.6h7.2l2.6 2.6v7.2a1 1 0 0 1-1 1H3.6a1 1 0 0 1-1-1Z" />
      <path d="M5 2.6v3.6h5V2.6" />
      <path d="M5 13.4V9.4h6v4" />
    </>
  ),
  'shield-clock': (
    <>
      <circle cx="8" cy="8" r="6.2" />
      <path d="M8 4.6V8l2.3 1.4" />
    </>
  ),
  house: (
    <>
      <path d="M2.4 7 8 2.4 13.6 7v6a1 1 0 0 1-1 1H3.4a1 1 0 0 1-1-1Z" />
      <path d="M6.2 14V9.4h3.6V14" />
    </>
  ),
  book: (
    <>
      <path d="M2.6 3.2A1 1 0 0 1 3.6 2.2H7A1.8 1.8 0 0 1 8 3.6 1.8 1.8 0 0 1 9 2.2h3.4a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9a1.8 1.8 0 0 0-1 1.4 1.8 1.8 0 0 0-1-1.4H3.6a1 1 0 0 1-1-1Z" />
      <path d="M8 3.6v10.4" />
    </>
  ),
  'user-cog': (
    <>
      <circle cx="6.4" cy="5.2" r="2.6" />
      <path d="M2 13.6c0-2.1 2-3.8 4.4-3.8" />
      <circle cx="11.8" cy="11.4" r="2.1" />
      <path d="M11.8 8.6v.7M11.8 13.5v.7M14.1 11.4h-.7M10.2 11.4h-.7" />
    </>
  ),
  banknote: (
    <>
      <rect x="1.6" y="4" width="12.8" height="8" rx="1.4" />
      <circle cx="8" cy="8" r="1.8" />
      <path d="M4.2 8h.01M11.8 8h.01" />
    </>
  ),
  edit: (
    <>
      <path d="M11.2 2.6a1.7 1.7 0 0 1 2.4 2.4L5.5 13 2.5 13.5l.5-3Z" />
    </>
  ),
}

export function Icon({
  name,
  className = 'size-4',
  strokeWidth = 1.5,
  ...rest
}: { name: keyof typeof paths | string; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {paths[name] ?? null}
    </svg>
  )
}

/** Google's mark, drawn inline (the design uses an exported "Social Icon" asset). */
export function GoogleIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.1 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h11.8c-.5 2.7-2 5.1-4.4 6.7v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.4Z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.2 15.5 46 24 46Z"
      />
      <path
        fill="#FBBC05"
        d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-3 .7-4.3v-5.7H4.5A22 22 0 0 0 2 24c0 3.6.9 6.9 2.5 9.9l7.3-5.6Z"
      />
      <path
        fill="#EA4335"
        d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.1 29.9 2 24 2 15.5 2 8.1 6.8 4.5 13.8l7.3 5.7c1.7-5.2 6.5-8.8 12.2-8.8Z"
      />
    </svg>
  )
}
