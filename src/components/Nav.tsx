import { useEffect, useState } from 'react'
import { nav, site } from '../data/content'
import { Button } from './ui/Button'
import { Icon } from './ui/Icon'
import { Container } from './ui/Section'

function Wordmark() {
  return (
    <a href="#top" className="flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-lg bg-ink-900">
        <svg viewBox="0 0 24 24" className="size-4.5" aria-hidden="true">
          <path
            d="M6.5 13.5a3.5 3.5 0 0 1 0-5l2-2a3.5 3.5 0 0 1 5 0"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M17.5 10.5a3.5 3.5 0 0 1 0 5l-2 2a3.5 3.5 0 0 1-5 0"
            fill="none"
            stroke="var(--color-brand-400)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-[17px] font-semibold tracking-[-0.02em] text-ink-900">
        {site.name}
        <span className="ml-1 align-super text-[10px] font-medium text-ink-400">{site.version}</span>
      </span>
    </a>
  )
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-ink-100/80 bg-white/85 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Wordmark />

          <nav className="hidden items-center gap-1 md:flex">
            {nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3 py-2 text-[14px] font-medium text-ink-500 transition-colors hover:bg-ink-100/70 hover:text-ink-900"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button href={nav.secondaryCta.href} variant="ghost">
              {nav.secondaryCta.label}
            </Button>
            <Button href={nav.cta.href}>{nav.cta.label}</Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-lg text-ink-700 ring-1 ring-ink-200 md:hidden"
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </Container>

      {/* Mobile sheet */}
      {open && (
        <div className="border-t border-ink-100 bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-[15px] font-medium text-ink-700 hover:bg-ink-50"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Button href={nav.secondaryCta.href} variant="secondary" size="lg" onClick={() => setOpen(false)}>
                {nav.secondaryCta.label}
              </Button>
              <Button href={nav.cta.href} size="lg" onClick={() => setOpen(false)}>
                {nav.cta.label}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}
