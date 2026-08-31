import type { ReactNode } from 'react'

export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`container-page ${className}`}>{children}</div>
}

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.14em] uppercase ${
        dark ? 'text-brand-300' : 'text-brand-600'
      }`}
    >
      <span className={`h-px w-6 ${dark ? 'bg-brand-400/60' : 'bg-brand-400'}`} />
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  dark = false,
}: {
  eyebrow?: string
  title: ReactNode
  subtitle?: string
  align?: 'center' | 'left'
  dark?: boolean
}) {
  return (
    <div
      className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''} ${
        align === 'center' ? 'flex flex-col items-center' : ''
      }`}
    >
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <h2
        className={`mt-4 text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-balance sm:text-4xl md:text-[2.75rem] ${
          dark ? 'text-white' : 'text-ink-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-[17px] leading-relaxed text-pretty ${
            dark ? 'text-ink-300' : 'text-ink-500'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
