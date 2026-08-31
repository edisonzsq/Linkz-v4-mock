import { logos } from '../data/content'
import { Container } from './ui/Section'

export function LogoCloud() {
  return (
    <section className="border-y border-ink-100 bg-white py-10">
      <Container>
        <p className="text-center text-[13px] font-medium tracking-[0.14em] text-ink-400 uppercase">
          Trusted by distributors and manufacturers in 14 markets
        </p>
      </Container>

      <div className="relative mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee-track flex w-max gap-12 pr-12">
          {[...logos, ...logos].map((logo, i) => (
            <span
              key={`${logo}-${i}`}
              className="text-[15px] font-semibold tracking-[0.06em] whitespace-nowrap text-ink-300 uppercase"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
