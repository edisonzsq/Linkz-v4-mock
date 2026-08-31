import { type FormEvent, useState } from 'react'
import { finalCta } from '../data/content'
import { Icon } from './ui/Icon'
import { Container } from './ui/Section'

export function FinalCta() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  /** Mocked — nothing leaves the browser. */
  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSent(true)
  }

  return (
    <section id="cta" className="scroll-mt-20 bg-white pb-20 sm:pb-28">
      <Container>
        <div className="relative overflow-hidden rounded-4xl bg-ink-900 px-6 py-16 sm:px-14 sm:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 text-white bg-grid opacity-50" />
            <div className="absolute -top-24 -left-16 h-[340px] w-[420px] rounded-full bg-brand-500/30 blur-[110px]" />
            <div className="absolute -right-10 -bottom-24 h-[300px] w-[420px] rounded-full bg-signal-500/18 blur-[110px]" />
          </div>

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl leading-[1.1] font-semibold tracking-[-0.025em] text-balance text-white sm:text-[2.75rem]">
              {finalCta.title}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-pretty text-ink-300">
              {finalCta.subtitle}
            </p>

            {sent ? (
              <div
                role="status"
                className="mx-auto mt-9 flex max-w-md items-center justify-center gap-3 rounded-2xl bg-white/8 px-6 py-5 text-left ring-1 ring-white/15"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-signal-500 text-white">
                  <Icon name="check" className="size-4.5" />
                </span>
                <span>
                  <span className="block text-[15px] font-medium text-white">
                    Thanks — we’ll be in touch.
                  </span>
                  <span className="block text-[13px] text-ink-400">
                    Prototype only: nothing was actually submitted.
                  </span>
                </span>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="mx-auto mt-9 flex max-w-lg flex-col gap-2.5 sm:flex-row"
              >
                <label htmlFor="cta-email" className="sr-only">
                  Work email
                </label>
                <input
                  id="cta-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-12 flex-1 rounded-full bg-white/8 px-5 text-[15px] text-white ring-1 ring-white/15 transition-colors placeholder:text-ink-400 focus:bg-white/12 focus:ring-white/35 focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-12 rounded-full bg-white px-6 text-[15px] font-medium text-ink-900 transition-transform hover:-translate-y-px active:translate-y-0"
                >
                  {finalCta.primaryCta}
                </button>
              </form>
            )}

            <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {finalCta.reassurance.map((r) => (
                <li key={r} className="flex items-center gap-2 text-[13px] text-ink-400">
                  <Icon name="check" className="size-3.5 text-signal-400" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
