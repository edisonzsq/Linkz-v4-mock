import type { ReactNode } from 'react'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Logo } from '../components/ui/Logo'
import { LanguagePicker } from '../components/ui/Misc'
import { kycNav } from '../data/mock'
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
  children,
}: {
  active: 'business' | 'bank' | '2fa'
  sectionLabel: string
  title: string
  onContinue: () => void
  continueLabel?: string
  continueDisabled?: boolean
  children: ReactNode
}) {
  const { go } = useFlow()
  const activeIndex = kycNav.sections.findIndex((s) => s.id === active)

  return (
    <div className="flex min-h-screen items-stretch bg-neutral-100">
      <div className="flex min-w-0 flex-1 flex-col">
        {/* TopNavBar */}
        <header className="sticky top-0 z-20 flex w-full items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
          <div className="flex w-[84px] items-center justify-center">
            <Logo />
          </div>
          <LanguagePicker />
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

            <div className="h-px w-full border-t border-neutral-200" />
            <p className="w-full text-xs4 text-text-secondary">{kycNav.skipNote}</p>
            <Button variant="outline" className="w-full" onClick={() => go('get-started')}>
              {kycNav.skip}
            </Button>
          </nav>

          {/* Form column */}
          <div className="flex min-w-0 flex-1 flex-col bg-white">
            <div className="sticky top-[57px] z-10 flex w-full items-center justify-between border-b border-neutral-200 bg-white p-s300">
              <div className="flex flex-col items-start text-center">
                <p className="text-xs3 font-bold text-primary-500">{sectionLabel}</p>
                <p className="text-md font-bold text-text-primary">{title}</p>
              </div>
              <Button onClick={onContinue} disabled={continueDisabled}>
                {continueLabel}
              </Button>
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
export function UploadBox({ label }: { label: string }) {
  return (
    <div className="flex w-full flex-col items-start rounded-s200 border border-neutral-300 bg-white p-s300">
      <div className="flex items-center gap-s400">
        <Button variant="outline" aria-label={`Upload ${label}`}>
          <Icon name="upload" className="size-4" />
          Upload File
        </Button>
        <p className="text-xs4 text-text-secondary">JPEG, PNG, PDF, DOC · Max 10 MB</p>
      </div>
    </div>
  )
}
