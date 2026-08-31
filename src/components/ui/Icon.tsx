type IconProps = {
  name: string
  className?: string
}

/** Inline stroke icons — no icon library dependency. */
const paths: Record<string, React.ReactNode> = {
  catalogue: (
    <>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2 2 2 0 0 1 2-2h4.5A1.5 1.5 0 0 1 20 5.5v11a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 0 0-2 2 2 2 0 0 0-2-2H5.5A1.5 1.5 0 0 1 4 16.5Z" />
      <path d="M12 6v14" />
    </>
  ),
  orders: (
    <>
      <path d="M6 3.5h9l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1-1.5Z" />
      <path d="M14.5 3.5V8H19" />
      <path d="m8.5 14 2 2 4-4.5" />
    </>
  ),
  inventory: (
    <>
      <path d="M3.5 8.5 12 4l8.5 4.5v7L12 20l-8.5-4.5Z" />
      <path d="M3.5 8.5 12 13l8.5-4.5M12 13v7" />
    </>
  ),
  partners: (
    <>
      <circle cx="8.5" cy="8" r="3" />
      <circle cx="16.5" cy="10.5" r="2.5" />
      <path d="M3.5 19c0-2.6 2.2-4.5 5-4.5s5 1.9 5 4.5" />
      <path d="M15 14.6c2.9-.4 5.5 1.2 5.5 4.4" />
    </>
  ),
  automation: (
    <>
      <path d="M13 3 5.5 13H11l-1 8 7.5-10H12Z" />
    </>
  ),
  insights: (
    <>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="m7.5 15 3.5-4 3 2.5 4.5-6" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  arrowRight: (
    <>
      <path d="M4.5 12h14" />
      <path d="m13 6.5 5.5 5.5-5.5 5.5" />
    </>
  ),
  chevronDown: <path d="m6 9.5 6 6 6-6" />,
  sparkle: (
    <>
      <path d="M12 3.5 13.8 9 19.5 10.8 13.8 12.6 12 18.1 10.2 12.6 4.5 10.8 10.2 9Z" />
      <path d="M18.5 16.5 19.3 18.7 21.5 19.5 19.3 20.3 18.5 22.5 17.7 20.3 15.5 19.5 17.7 18.7Z" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  bolt: <path d="M13 3 5.5 13H11l-1 8 7.5-10H12Z" />,
  shield: (
    <>
      <path d="M12 3.5 19 6v6c0 4-3 7.2-7 8.5-4-1.3-7-4.5-7-8.5V6Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  plug: (
    <>
      <path d="M9 3v5M15 3v5" />
      <path d="M6.5 8h11v3a5.5 5.5 0 0 1-11 0Z" />
      <path d="M12 16.5V21" />
    </>
  ),
}

export function Icon({ name, className = 'size-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] ?? null}
    </svg>
  )
}
