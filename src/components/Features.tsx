import { features, stats } from '../data/content'
import { Icon } from './ui/Icon'
import { Container, SectionHeading } from './ui/Section'

function Stats() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink-100 ring-1 ring-ink-100 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white px-5 py-6 sm:px-6 sm:py-8">
          <p className="text-3xl font-semibold tracking-[-0.03em] text-ink-900 sm:text-4xl">
            {s.value}
          </p>
          <p className="mt-2 text-[13px] leading-snug text-ink-500">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

export function Features() {
  return (
    <section id="platform" className="scroll-mt-20 bg-ink-50/60 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="The platform"
          title={
            <>
              Everything between a price list and a{' '}
              <span className="font-serif font-normal italic text-brand-600">paid invoice</span>
            </>
          }
          subtitle="Six pieces that replace the spreadsheet-and-inbox workflow your trading relationships currently run on."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <article
              key={f.id}
              className={`group relative flex flex-col rounded-2xl bg-white p-6 ring-1 ring-ink-900/6 transition-all duration-300 hover:-translate-y-0.5 hover:ring-brand-300/70 hover:shadow-[0_18px_40px_-24px_rgba(13,23,40,.4)] ${
                i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
                <Icon name={f.icon} className="size-5.5" />
              </span>

              <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.01em] text-ink-900">
                {f.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-500">{f.description}</p>

              <ul className="mt-5 flex flex-col gap-2 border-t border-ink-100 pt-4">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-[13px] text-ink-600">
                    <Icon name="check" className="size-3.5 shrink-0 text-signal-500" />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-16">
          <Stats />
        </div>
      </Container>
    </section>
  )
}
