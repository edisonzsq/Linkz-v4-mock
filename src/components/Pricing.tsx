import { useState } from 'react'
import { pricing } from '../data/content'
import { Button } from './ui/Button'
import { Icon } from './ui/Icon'
import { Container, SectionHeading } from './ui/Section'

export function Pricing() {
  const [annual, setAnnual] = useState(true)

  return (
    <section id="pricing" className="scroll-mt-20 bg-ink-50/60 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Priced per team, not per transaction"
          subtitle={pricing.note}
        />

        {/* Billing toggle */}
        <div className="mt-8 flex justify-center">
          <div
            role="group"
            aria-label="Billing period"
            className="inline-flex items-center rounded-full bg-white p-1 ring-1 ring-ink-200"
          >
            {(['monthly', 'annual'] as const).map((mode) => {
              const active = (mode === 'annual') === annual
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAnnual(mode === 'annual')}
                  aria-pressed={active}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-medium capitalize transition-colors ${
                    active ? 'bg-ink-900 text-white' : 'text-ink-500 hover:text-ink-800'
                  }`}
                >
                  {mode}
                  {mode === 'annual' && (
                    <span className={`ml-1.5 ${active ? 'text-signal-400' : 'text-signal-600'}`}>
                      −20%
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-12 grid items-start gap-5 lg:grid-cols-3">
          {pricing.plans.map((plan) => {
            const price = annual ? plan.annual : plan.monthly
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl p-7 ${
                  plan.featured
                    ? 'bg-ink-900 text-white ring-1 ring-ink-900 shadow-[0_30px_60px_-30px_rgba(13,23,40,.65)] lg:-mt-4 lg:pb-9'
                    : 'bg-white ring-1 ring-ink-900/8'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-7 rounded-full bg-brand-500 px-3 py-1 text-[11px] font-semibold tracking-wide text-white">
                    Most popular
                  </span>
                )}

                <h3
                  className={`text-[15px] font-semibold tracking-[0.02em] ${
                    plan.featured ? 'text-white' : 'text-ink-900'
                  }`}
                >
                  {plan.name}
                </h3>
                <p className={`mt-1.5 text-[13px] ${plan.featured ? 'text-ink-300' : 'text-ink-500'}`}>
                  {plan.blurb}
                </p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  {price === null ? (
                    <span
                      className={`text-4xl font-semibold tracking-[-0.03em] ${
                        plan.featured ? 'text-white' : 'text-ink-900'
                      }`}
                    >
                      Let’s talk
                    </span>
                  ) : (
                    <>
                      <span
                        className={`text-[40px] leading-none font-semibold tracking-[-0.035em] tabular-nums ${
                          plan.featured ? 'text-white' : 'text-ink-900'
                        }`}
                      >
                        ${price}
                      </span>
                      <span className={plan.featured ? 'text-ink-400' : 'text-ink-400'}>/mo</span>
                    </>
                  )}
                </div>
                <p className={`mt-1.5 text-[12px] ${plan.featured ? 'text-ink-400' : 'text-ink-400'}`}>
                  {price === null ? plan.priceNote : `${plan.priceNote}${annual ? ', billed yearly' : ''}`}
                </p>

                <Button
                  href="#cta"
                  size="lg"
                  variant={plan.featured ? 'inverse' : 'secondary'}
                  className="mt-6 w-full"
                >
                  {plan.cta}
                </Button>

                <ul
                  className={`mt-7 flex flex-col gap-3 border-t pt-6 text-[13.5px] ${
                    plan.featured ? 'border-white/12' : 'border-ink-100'
                  }`}
                >
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Icon
                        name="check"
                        className={`mt-0.5 size-4 shrink-0 ${
                          plan.featured ? 'text-signal-400' : 'text-signal-500'
                        }`}
                      />
                      <span className={plan.featured ? 'text-ink-200' : 'text-ink-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
