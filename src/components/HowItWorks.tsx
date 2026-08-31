import { howItWorks } from '../data/content'
import { Container, SectionHeading } from './ui/Section'

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-20 overflow-hidden bg-ink-950 py-20 sm:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute inset-0 text-white bg-grid opacity-[0.6]" />
        <div className="absolute -top-32 left-1/4 h-[380px] w-[520px] rounded-full bg-brand-600/25 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-[280px] w-[380px] rounded-full bg-signal-600/15 blur-[110px]" />
      </div>

      <Container className="relative">
        <SectionHeading
          dark
          eyebrow={howItWorks.eyebrow}
          title={howItWorks.title}
          subtitle={howItWorks.subtitle}
        />

        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 md:grid-cols-2 lg:grid-cols-4">
          {howItWorks.steps.map((s) => (
            <li key={s.step} className="relative bg-ink-950/80 p-6 backdrop-blur-sm sm:p-7">
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl italic text-brand-400">{s.step}</span>
                <span className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-medium text-ink-300 ring-1 ring-white/10">
                  {s.duration}
                </span>
              </div>
              <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.01em] text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-300">{s.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
