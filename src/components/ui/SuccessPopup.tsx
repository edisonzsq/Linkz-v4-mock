import { useEffect, useState, type ReactNode } from 'react'
import { Button } from './Button'
import { Icon } from './Icon'
import { Modal } from './Misc'

/** How long a success popup stays up before closing itself. */
export const AUTO_DISMISS_MS = 7000

/**
 * Success popup — KYC complete, 2FA complete, and first-time onboarding.
 *
 * These close themselves after ~7s and also carry the Modal's dismiss icon, so a
 * reader who is done does not have to wait it out. The rule is deliberately
 * limited to success popups: warnings (e.g. the business-registration change)
 * need a decision and must not disappear on their own.
 *
 * A thin bar across the top runs down as the timer does, so the dismissal is
 * predictable rather than abrupt.
 */
export function SuccessPopup({
  open,
  onClose,
  title,
  body,
  cta,
  onCta,
  icon = 'circle-check',
  art,
}: {
  open: boolean
  onClose: () => void
  title: string
  body: string
  cta?: string
  onCta?: () => void
  icon?: string
  /** Optional illustration shown instead of the icon badge. */
  art?: ReactNode
}) {
  const [remaining, setRemaining] = useState(AUTO_DISMISS_MS)

  useEffect(() => {
    if (!open) return

    // Time from a fixed start rather than decrementing, so the countdown stays
    // honest if the tab is throttled, and so nothing is set during the render
    // the effect runs in.
    const startedAt = Date.now()
    const tick = window.setInterval(() => {
      const left = Math.max(0, AUTO_DISMISS_MS - (Date.now() - startedAt))
      setRemaining(left)
      if (left === 0) onClose()
    }, 100)

    return () => window.clearInterval(tick)
  }, [open, onClose])

  const pct = (remaining / AUTO_DISMISS_MS) * 100

  return (
    <Modal open={open} onClose={onClose}>
      {/* Countdown to the auto-dismiss. */}
      <span className="block h-1 w-full bg-neutral-100">
        <span
          style={{ width: `${pct}%` }}
          className="block h-full bg-primary-400 transition-[width] duration-100 ease-linear"
        />
      </span>

      {art}

      <div className="flex flex-col items-center gap-s300 px-10 py-8 text-center">
        {!art && (
          <span className="grid size-14 place-items-center rounded-full bg-primary-25 text-primary-400">
            <Icon name={icon} className="size-7" />
          </span>
        )}
        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
        <p className="text-xs2 text-text-secondary">{body}</p>
        {cta && (
          <Button className="mt-2 min-w-[160px]" onClick={onCta ?? onClose}>
            {cta}
          </Button>
        )}
        <p className="text-xs4 text-neutral-400">
          Closes automatically in {Math.ceil(remaining / 1000)}s
        </p>
      </div>
    </Modal>
  )
}
