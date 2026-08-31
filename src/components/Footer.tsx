import { footer, site } from '../data/content'
import { Container } from './ui/Section'

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-50/60 pt-14 pb-10">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))]">
          <div>
            <div className="flex items-center gap-2.5">
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
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink-500">{footer.blurb}</p>
            <a
              href="#cta"
              className="mt-4 inline-block text-[14px] font-medium text-brand-600 underline underline-offset-4"
            >
              {site.email}
            </a>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[13px] font-semibold tracking-[0.1em] text-ink-900 uppercase">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#top"
                      className="text-[14px] text-ink-500 transition-colors hover:text-ink-900"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-ink-400">
            © {new Date().getFullYear()} {site.name}. {footer.legal}
          </p>
          <p className="text-[13px] text-ink-400">Built as a React prototype — no backend, no data.</p>
        </div>
      </Container>
    </footer>
  )
}
