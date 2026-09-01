import { useEffect } from 'react'
import { Modal } from './Misc'

/** How long a success popup stays up before closing itself. */
export const AUTO_DISMISS_MS = 7000

/**
 * Success popup — KYC Documents Submitted (Figma 4001:85240), 2FA Verified
 * (4001:87636) and the first-entry welcome (4001:77356).
 *
 * The frames carry a dismiss ✕ and nothing else — no confirm button and no
 * visible countdown — so this matches them. The ~7s auto-close is behaviour
 * asked for on top of the design, and is deliberately limited to success
 * popups: the business-type warning needs a decision and must not vanish.
 *
 * Layout differs between the frames: KYC and 2FA put the title above the
 * artwork, the welcome frame puts its illustration first.
 */
export function SuccessPopup({
  open,
  onClose,
  title,
  body,
  art,
  artFirst = false,
}: {
  open: boolean
  onClose: () => void
  title: string
  /** May contain newlines; each becomes its own line, as in the frames. */
  body: string
  art?: React.ReactNode
  /** true = illustration above the title (the welcome frame). */
  artFirst?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(onClose, AUTO_DISMISS_MS)
    return () => window.clearTimeout(t)
  }, [open, onClose])

  const heading = (
    <h2 className="text-lg font-bold text-text-primary">{title}</h2>
  )

  return (
    <Modal open={open} onClose={onClose} width={440}>
      <div className="flex flex-col items-center gap-s400 px-10 pt-10 pb-8 text-center">
        {artFirst ? (
          <>
            {art}
            {heading}
          </>
        ) : (
          <>
            {heading}
            {art}
          </>
        )}

        <p className="text-xs2 text-text-secondary">
          {body.split('\n').map((line, i) => (
            <span key={line} className="block">
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      </div>
    </Modal>
  )
}

/**
 * The green tick with confetti used by the KYC and 2FA frames. The design uses
 * an exported illustration; this redraws it at the same 128px box — see
 * README → "Assets could not be exported".
 */
export function ConfettiCheck() {
  const bits = [
    { x: 12, y: 30, r: -20, c: '#a855f7', w: 7, h: 3 },
    { x: 20, y: 62, r: 15, c: '#22d3ee', w: 6, h: 6, round: true },
    { x: 16, y: 84, r: 40, c: '#fbbf24', w: 7, h: 7, star: true },
    { x: 34, y: 16, r: 0, c: '#a855f7', w: 6, h: 6, star: true },
    { x: 96, y: 22, r: 25, c: '#22d3ee', w: 8, h: 3 },
    { x: 108, y: 52, r: -30, c: '#fbbf24', w: 7, h: 7, star: true },
    { x: 100, y: 86, r: 10, c: '#a855f7', w: 7, h: 3 },
    { x: 60, y: 104, r: 0, c: '#22d3ee', w: 6, h: 6, round: true },
    { x: 40, y: 100, r: -15, c: '#fbbf24', w: 6, h: 6, star: true },
  ]

  return (
    <svg viewBox="0 0 128 128" className="size-32" aria-hidden="true">
      <circle cx="64" cy="64" r="34" className="fill-primary-400" />
      <path
        d="M50 64.5 60 74.5 79 55"
        className="stroke-white"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {bits.map((b, i) =>
        b.star ? (
          <path
            key={i}
            d={`M${b.x} ${b.y - b.h / 2} L${b.x + b.w / 5} ${b.y - b.h / 5} L${b.x + b.w / 2} ${b.y} L${b.x + b.w / 5} ${b.y + b.h / 5} L${b.x} ${b.y + b.h / 2} L${b.x - b.w / 5} ${b.y + b.h / 5} L${b.x - b.w / 2} ${b.y} L${b.x - b.w / 5} ${b.y - b.h / 5} Z`}
            fill={b.c}
          />
        ) : b.round ? (
          <circle key={i} cx={b.x} cy={b.y} r={b.w / 2} fill={b.c} />
        ) : (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx={b.h / 2}
            fill={b.c}
            transform={`rotate(${b.r} ${b.x} ${b.y})`}
          />
        ),
      )}
    </svg>
  )
}
