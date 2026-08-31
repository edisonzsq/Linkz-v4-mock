import { testimonials } from '../data/content'
import { Container, SectionHeading } from './ui/Section'

export function Testimonials() {
  return (
    <section id="customers" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Customers"
          title="The teams who stopped re-typing orders"
          subtitle="Three of the eighteen thousand businesses trading on Linkz today."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className={`flex flex-col rounded-2xl p-7 ring-1 transition-shadow duration-300 hover:shadow-[0_18px_40px_-26px_rgba(13,23,40,.45)] ${
                i === 0
                  ? 'bg-ink-900 ring-ink-900 lg:row-span-1'
                  : 'bg-ink-50/70 ring-ink-900/6'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`size-7 ${i === 0 ? 'text-brand-400' : 'text-brand-300'}`}
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.6 5.4c-3 1.5-5 4.4-5 8.1 0 3.1 1.8 5.1 4.3 5.1 2.2 0 3.9-1.6 3.9-3.8 0-2.1-1.5-3.6-3.4-3.6-.4 0-.8.1-1 .2.3-1.7 1.7-3.3 3.4-4.2Zm9.1 0c-3 1.5-5 4.4-5 8.1 0 3.1 1.8 5.1 4.3 5.1 2.2 0 3.9-1.6 3.9-3.8 0-2.1-1.5-3.6-3.4-3.6-.4 0-.8.1-1 .2.3-1.7 1.7-3.3 3.4-4.2Z" />
              </svg>

              <blockquote
                className={`mt-5 grow text-[16px] leading-relaxed text-pretty ${
                  i === 0 ? 'text-white' : 'text-ink-700'
                }`}
              >
                “{t.quote}”
              </blockquote>

              <figcaption className="mt-7 flex items-center gap-3">
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full text-[12px] font-semibold ${
                    i === 0
                      ? 'bg-white/10 text-white ring-1 ring-white/15'
                      : 'bg-white text-ink-700 ring-1 ring-ink-200'
                  }`}
                >
                  {t.initials}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block truncate text-[14px] font-semibold ${
                      i === 0 ? 'text-white' : 'text-ink-900'
                    }`}
                  >
                    {t.name}
                  </span>
                  <span
                    className={`block truncate text-[13px] ${i === 0 ? 'text-ink-300' : 'text-ink-500'}`}
                  >
                    {t.role}, {t.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  )
}
