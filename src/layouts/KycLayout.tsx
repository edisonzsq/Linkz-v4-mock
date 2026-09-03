import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Logo } from '../components/ui/Logo'
import { LanguagePicker } from '../components/ui/Misc'
import { kycNav, kycPostLogin } from '../data/mock'
import { topBar } from '../data/appData'
import { useFlow } from '../prototype/flowContext'

/**
 * KYC shell (Figma 4001:84233 and siblings): a sticky TopNavBar over a 232px
 * "Verification progress" sub-menu and the form column.
 *
 * Note the KYC frames sit on top of the app sidebar rather than beside it, so
 * no 160px sidebar is drawn here — matching the design.
 */
export function KycLayout({
  active,
  sectionLabel,
  title,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled,
  secondaryLabel,
  onSecondary,
  children,
}: {
  active: 'business' | 'bank' | '2fa'
  sectionLabel: string
  title: string
  onContinue: () => void
  continueLabel?: string
  continueDisabled?: boolean
  /** Optional outline action beside the primary one — e.g. "Back" on Section 2. */
  secondaryLabel?: string
  onSecondary?: () => void
  children: ReactNode
}) {
  const { go, state } = useFlow()
  const activeIndex = kycNav.sections.findIndex((s) => s.id === active)

  // Verifying after login is a different journey from onboarding: you are
  // already in the app, so the shell keeps the console breadcrumb, offers
  // Cancel rather than "Skip for now", and never pretends this is sign-up.
  const postLogin = state.kycMode === 'post-login'

  return (
    <div className="flex min-h-screen items-stretch bg-neutral-100">
      <div className="flex min-w-0 flex-1 flex-col">
        {/* TopNavBar */}
        <header className="sticky top-0 z-20 flex w-full items-center justify-between gap-s300 border-b border-neutral-200 bg-white px-4 py-3">
          {postLogin ? (
            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-s200">
              {kycPostLogin.breadcrumb.map((b, i) => (
                <span key={b} className="flex items-center gap-s200">
                  {i > 0 && <span className="text-xs3 text-neutral-300">/</span>}
                  <span
                    className={`truncate text-xs3 ${
                      i === kycPostLogin.breadcrumb.length - 1
                        ? 'font-bold text-text-primary'
                        : 'text-text-secondary'
                    }`}
                  >
                    {b}
                  </span>
                </span>
              ))}
            </nav>
          ) : (
            <div className="flex w-[84px] items-center justify-center">
              <Logo />
            </div>
          )}
          <div className="flex shrink-0 items-center gap-s200">
            {postLogin && (
              <span className="hidden items-center gap-s200 rounded-s200 border border-neutral-300 px-s200 py-1 text-xs3 text-text-primary sm:flex">
                <span className="text-text-secondary">{topBar.companyLabel}</span>
                <span className="font-bold">{topBar.company}</span>
              </span>
            )}
            <LanguagePicker />
          </div>
        </header>

        <div className="flex w-full flex-1 items-stretch">
          {/* Sub Sidemenu — 232px */}
          <nav className="hidden w-[232px] shrink-0 flex-col gap-s300 border-r border-neutral-200 bg-white p-s300 lg:flex">
            <div className="flex min-h-px flex-1 flex-col items-start gap-s300">
              <p className="text-xs4 text-text-secondary">{kycNav.progressLabel}</p>

              <div className="flex w-[200px] flex-col items-start gap-s100 bg-white">
                {kycNav.sections.map((s, i) => {
                  const isActive = s.id === active
                  const isDone = i < activeIndex
                  return (
                    <div
                      key={s.id}
                      className={`relative flex w-full items-start gap-s200 rounded-s200 p-s200 ${
                        isActive ? 'bg-primary-25' : ''
                      }`}
                    >
                      <span
                        className={`flex size-5 shrink-0 flex-col items-center justify-center rounded-full border bg-white ${
                          isActive || isDone ? 'border-primary-400' : 'border-neutral-300'
                        }`}
                      >
                        {isActive ? (
                          <span className="flex size-6 flex-col items-center justify-center rounded-full border-2 border-primary-50 text-xs4 text-primary-400">
                            {i + 1}
                          </span>
                        ) : isDone ? (
                          <Icon name="check" className="size-3 text-primary-400" strokeWidth={2.4} />
                        ) : (
                          <span className="text-xs4 text-neutral-300">{i + 1}</span>
                        )}
                      </span>

                      <span className="flex w-[122px] flex-col items-start justify-center gap-s100">
                        <span
                          className={`text-xs3 font-bold ${
                            isActive || isDone ? 'text-text-primary' : 'text-neutral-300'
                          }`}
                        >
                          {s.label}
                        </span>
                        {isActive && (
                          <span className="text-center text-xs4 font-medium text-primary-500">
                            {kycNav.inProgress}
                          </span>
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>

              <p className="text-xs4 text-text-secondary">{kycNav.afterKyc}</p>

              {kycNav.afterItems.map((s) => {
                const isActive = s.id === active
                return (
                  <div
                    key={s.id}
                    className={`flex w-full items-center gap-s200 rounded-s200 p-s200 ${
                      isActive ? 'bg-primary-25' : ''
                    }`}
                  >
                    <span
                      className={`flex size-5 shrink-0 flex-col items-center justify-center rounded-full border bg-white ${
                        isActive ? 'border-primary-400' : 'border-neutral-300'
                      }`}
                    >
                      <Icon
                        name="lock"
                        className={`size-2.5 ${isActive ? 'text-primary-400' : 'text-neutral-300'}`}
                      />
                    </span>
                    <span className="flex w-[122px] items-center">
                      <span
                        className={`text-xs3 font-bold ${
                          isActive ? 'text-text-primary' : 'text-neutral-300'
                        }`}
                      >
                        {s.label}
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Skipping belongs to onboarding. After login you came here on
                purpose, so the way out is Cancel in the action bar. */}
            {!postLogin && (
              <>
                <div className="h-px w-full border-t border-neutral-200" />
                <p className="w-full text-xs4 text-text-secondary">{kycNav.skipNote}</p>
                <Button variant="outline" className="w-full" onClick={() => go('get-started')}>
                  {kycNav.skip}
                </Button>
              </>
            )}
          </nav>

          {/* Form column */}
          <div className="flex min-w-0 flex-1 flex-col bg-white">
            <div className="sticky top-[57px] z-10 flex w-full items-center justify-between border-b border-neutral-200 bg-white p-s300">
              <div className="flex flex-col items-start text-center">
                <p className="text-xs3 font-bold text-primary-500">{sectionLabel}</p>
                <p className="text-md font-bold text-text-primary">{title}</p>
              </div>
              {/* Actions group together on the right, as in the frames. */}
              <div className="flex shrink-0 items-center gap-s200">
                {secondaryLabel ? (
                  <Button variant="outline" onClick={onSecondary}>
                    {secondaryLabel}
                  </Button>
                ) : (
                  postLogin && (
                    <Button variant="outline" onClick={() => go('get-started')}>
                      {kycPostLogin.cancel}
                    </Button>
                  )
                )}
                <Button onClick={onContinue} disabled={continueDisabled}>
                  {continueLabel}
                </Button>
              </div>
            </div>

            <div className="flex w-full flex-col items-start gap-s400 bg-white p-s300">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Figma "Field" row: a 400px label/hint column beside a 400px control. */
export function KycField({
  label,
  hint,
  bold = true,
  children,
}: {
  label: string
  hint?: string
  bold?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex w-full flex-col items-start gap-s300 lg:flex-row">
      <div className="flex w-full flex-col items-start justify-center lg:w-[400px]">
        <p className={`text-xs3 text-text-primary ${bold ? 'font-bold' : 'font-semibold'}`}>
          {label}
        </p>
        {hint && <p className="text-xs4 text-neutral-500">{hint}</p>}
      </div>
      <div className="w-full lg:w-[400px]">{children}</div>
    </div>
  )
}

/** Figma "Uploaded / Upload" component (4001:90616). Mocked — no file is read. */
/**
 * Simulated document upload — Figma "Upload Document" component states.
 *
 * There is no file handling behind this: clicking **Upload File** moves the box
 * through `uploading` (a progress bar that fills over ~1.4s) to `uploaded`, which
 * names a stand-in file and offers Replace / Remove. That is enough to demo the
 * flow, and it means no file is ever read from or written to the user's machine.
 */
export function UploadBox({ label, fileName }: { label: string; fileName?: string }) {
  const [state, setState] = useState<'idle' | 'uploading' | 'uploaded'>('idle')
  const [progress, setProgress] = useState(0)

  // Drive the fake progress bar. Timing from a fixed start keeps the effect free
  // of synchronous state writes; `progress` is reset by the click that starts it.
  useEffect(() => {
    if (state !== 'uploading') return

    const startedAt = Date.now()
    const duration = 1400
    const tick = window.setInterval(() => {
      const pct = Math.min(100, Math.round(((Date.now() - startedAt) / duration) * 100))
      setProgress(pct)
      if (pct >= 100) setState('uploaded')
    }, 120)

    return () => window.clearInterval(tick)
  }, [state])

  const name = fileName ?? `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`

  if (state === 'uploading') {
    return (
      <div className="flex w-full flex-col gap-s200 rounded-s200 border border-neutral-300 bg-white p-s300">
        <div className="flex items-center gap-s200">
          <Icon name="upload" className="size-4 shrink-0 text-primary-400" />
          <span className="min-w-0 flex-1 truncate text-xs3 font-semibold text-text-primary">
            {name}
          </span>
          <span className="shrink-0 text-xs4 text-text-secondary">Uploading… {progress}%</span>
        </div>
        <span className="block h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
          <span
            style={{ width: `${progress}%` }}
            className="block h-full rounded-full bg-primary-400 transition-[width] duration-100"
          />
        </span>
      </div>
    )
  }

  if (state === 'uploaded') {
    return (
      <div className="flex w-full flex-wrap items-center gap-s200 rounded-s200 border border-primary-200 bg-primary-25 p-s300">
        <Icon name="circle-check" className="size-4 shrink-0 text-primary-400" />
        <span className="min-w-0 flex-1 truncate text-xs3 font-semibold text-text-primary">
          {name}
        </span>
        <span className="shrink-0 text-xs4 text-text-secondary">Uploaded</span>
        <button
          type="button"
          onClick={() => {
            setProgress(0)
            setState('uploading')
          }}
          className="shrink-0 rounded-s200 px-s200 py-1 text-xs4 font-semibold text-primary-500 hover:bg-primary-50"
        >
          Replace
        </button>
        <button
          type="button"
          onClick={() => setState('idle')}
          aria-label={`Remove ${label}`}
          className="grid size-7 shrink-0 place-items-center rounded-s200 text-neutral-500 hover:bg-neutral-100"
        >
          <Icon name="trash" className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col items-start rounded-s200 border border-neutral-300 bg-white p-s300">
      <div className="flex flex-wrap items-center gap-s400">
        <Button
          variant="outline"
          aria-label={`Upload ${label}`}
          onClick={() => {
            setProgress(0)
            setState('uploading')
          }}
        >
          <Icon name="upload" className="size-4" />
          Upload File
        </Button>
        <p className="text-xs4 text-text-secondary">JPEG, PNG, PDF, DOC · Max 10 MB</p>
      </div>
    </div>
  )
}
