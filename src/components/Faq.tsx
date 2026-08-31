import { useState } from 'react'
import { faqs } from '../data/content'
import { Icon } from './ui/Icon'
import { Container, Eyebrow } from './ui/Section'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-4 text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-ink-900 sm:text-4xl">
              Questions we get on the first call
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-500">
              Still stuck on something?{' '}
              <a href="#cta" className="font-medium text-brand-600 underline underline-offset-4">
                Ask us directly
              </a>{' '}
              — a real person answers.
            </p>
          </div>

          <div className="divide-y divide-ink-100 border-y border-ink-100">
            {faqs.map((f, i) => {
              const isOpen = open === i
              return (
                <div key={f.q}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left"
                    >
                      <span
                        className={`text-[16px] font-medium transition-colors ${
                          isOpen ? 'text-brand-700' : 'text-ink-900'
                        }`}
                      >
                        {f.q}
                      </span>
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full ring-1 transition-all duration-300 ${
                          isOpen
                            ? 'rotate-180 bg-brand-500 text-white ring-brand-500'
                            : 'text-ink-400 ring-ink-200'
                        }`}
                      >
                        <Icon name="chevronDown" className="size-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-ink-500">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
