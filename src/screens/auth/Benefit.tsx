import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { Logo } from '../../components/ui/Logo'
import { LanguagePicker } from '../../components/ui/Misc'
import { benefit as copy } from '../../data/mock'
import { useFlow } from '../../prototype/flowContext'

/**
 * Figma: "Phone Email Onboarding 3 - Benefit" (4001:76792) and the SSO variant
 * "SSO Onboarding 5 - Benefit" (4001:77055). Frame is 1440 x 768.
 *
 * Unlike the other onboarding screens this one has no card — it sits on white,
 * with the ring artwork rotated into the bottom-left corner.
 */
export function Benefit() {
  const { go } = useFlow()

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Ring artwork, rotated 180° into the bottom-left (Figma 4001:77047) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[542px] overflow-hidden lg:block"
      >
        <div className="absolute top-0 left-0 h-full w-[390px] rotate-180">
          {[
            { size: 768.125, opacity: 0.4 },
            { size: 630.257, opacity: 0.5 },
            { size: 492.388, opacity: 0.7 },
            { size: 354.519, opacity: 0.8 },
            { size: 216.651, opacity: 1 },
          ].map((r) => (
            <div
              key={r.size}
              style={{ width: r.size, height: r.size, opacity: r.opacity }}
              className="absolute top-1/2 left-[calc(50%+189px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-neutral-400/60"
            />
          ))}
        </div>
      </div>

      <header className="relative flex items-center justify-between px-6 pt-[59px] lg:px-[100px]">
        <Logo />
        <LanguagePicker />
      </header>

      <div className="relative grid gap-10 px-6 pb-16 lg:grid-cols-[minmax(0,420px)_600px] lg:gap-16 lg:px-[185px] lg:pb-0">
        {/* Left copy */}
        <div className="flex flex-col gap-s200 pt-8 lg:pt-[57px]">
          <h1 className="text-lg font-bold text-text-primary">{copy.title}</h1>
          <p className="max-w-[357px] text-xs2 text-text-secondary">{copy.subtitle}</p>
        </div>

        {/* Right column */}
        <div className="flex w-full max-w-[600px] flex-col gap-s300 lg:justify-self-end lg:pt-8">
          <div className="flex flex-col gap-s300">
            {copy.cards.map((c) => (
              <div
                key={c.title}
                className="flex flex-col items-start gap-s200 rounded-s300 border border-neutral-200 bg-white p-s400 sm:flex-row"
              >
                <Icon name={c.icon} className="size-6 shrink-0 text-primary-400" />
                <p className="w-[200px] shrink-0 text-xs font-bold text-text-primary">{c.title}</p>
                <p className="text-xs2 text-text-secondary">{c.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-center gap-s300 rounded-s300 bg-container p-s300">
            <div className="flex flex-wrap items-start justify-between gap-s200">
              <div className="flex flex-col gap-s300">
                <p className="text-xs2 font-bold text-text-primary">{copy.checklistTitle}</p>
                <ol className="flex flex-col gap-s200">
                  {copy.checklist.map((item, i) => (
                    <li key={item.label} className="flex items-center gap-s200">
                      <span className="flex size-5 shrink-0 flex-col items-center justify-center rounded-full border border-neutral-200 bg-white text-xs4 text-text-secondary">
                        {i + 1}
                      </span>
                      <span className="text-xs3 text-text-primary">{item.label}</span>
                      {item.note && <span className="text-xs3 text-neutral-400">{item.note}</span>}
                    </li>
                  ))}
                </ol>
              </div>

              <span className="flex items-center justify-center gap-s100 rounded-[4px] border border-neutral-200 bg-neutral-50 px-1.5 py-1 text-xs3 font-semibold text-text-secondary">
                <Icon name="shield-clock" className="size-3" />
                {copy.duration}
              </span>
            </div>

            <div className="h-px w-full border-t border-neutral-200" />

            <div className="flex items-center gap-s200">
              <Icon name="save" className="size-4 shrink-0 text-text-secondary" />
              <p className="flex-1 text-xs3 text-text-secondary">{copy.saveNote}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-[10px] py-s300">
            <Button className="w-[240px]" onClick={() => go('kyc-business')}>
              {copy.primaryCta}
            </Button>
            <Button variant="outline" className="w-[240px]" onClick={() => go('get-started')}>
              {copy.secondaryCta}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
