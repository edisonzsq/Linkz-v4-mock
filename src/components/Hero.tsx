import { hero } from '../data/content'
import { ProductPreview } from './ProductPreview'
import { Button } from './ui/Button'
import { Icon } from './ui/Icon'
import { Container } from './ui/Section'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/70 via-white to-white" />
        <div className="mask-fade-b absolute inset-x-0 top-0 h-[560px] text-ink-400 bg-grid" />
        <div className="absolute -top-24 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-brand-400/18 blur-[120px]" />
        <div className="absolute top-40 right-[8%] h-[260px] w-[260px] rounded-full bg-signal-400/18 blur-[100px]" />
      </div>

      <Container>
        <div className="flex flex-col items-center text-center">
          <a
            href="#platform"
            className="group inline-flex items-center gap-2 rounded-full bg-white/80 py-1 pr-3 pl-1 text-[13px] ring-1 ring-ink-200/80 backdrop-blur transition-colors hover:ring-ink-300"
          >
            <span className="rounded-full bg-ink-900 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white">
              {hero.eyebrow}
            </span>
            <span className="hidden text-ink-600 sm:inline">{hero.eyebrowNote}</span>
            <Icon
              name="arrowRight"
              className="size-3.5 text-ink-400 transition-transform group-hover:translate-x-0.5"
            />
          </a>

          <h1 className="mt-7 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-ink-900 sm:text-6xl md:text-[4.25rem]">
            {hero.title}{' '}
            <span className="font-serif font-normal italic text-brand-600">{hero.titleAccent}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-pretty text-ink-500 sm:text-lg">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
              <Icon name="arrowRight" className="size-4" />
            </Button>
            <Button href={hero.secondaryCta.href} variant="secondary" size="lg">
              {hero.secondaryCta.label}
            </Button>
          </div>

          <p className="mt-4 text-[13px] text-ink-400">{hero.footnote}</p>
        </div>

        <div className="relative mx-auto mt-14 max-w-5xl sm:mt-16">
          <div
            aria-hidden="true"
            className="absolute -inset-x-6 -top-6 bottom-10 -z-10 rounded-[2.5rem] bg-gradient-to-b from-brand-500/12 to-transparent"
          />
          <ProductPreview />
        </div>
      </Container>
    </section>
  )
}
