import { useEffect, useRef, type ReactNode } from 'react'
import { Icon } from './Icon'

export function LanguagePicker({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-s200 rounded-s200 border border-neutral-300 bg-white p-s200 ${className}`}
    >
      <Icon name="globe" className="size-4 text-text-secondary" />
      <span className="w-[70px] text-xs3 font-medium text-text-secondary">English</span>
      <Icon name="chevron-down" className="size-4 text-text-secondary" />
    </div>
  )
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
}) {
  return (
    <div role="tablist" className="flex w-full border-b border-neutral-200">
      {tabs.map((t) => {
        const active = t.id === value
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(t.id)}
            className={`h-8 flex-1 border-b-2 text-xs3 font-semibold transition-colors ${
              active
                ? 'border-primary-400 text-primary-400'
                : 'border-transparent text-neutral-500 hover:text-text-primary'
            }`}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

type AlertTone = 'info' | 'warning' | 'danger' | 'success'

const alertTones: Record<AlertTone, { wrap: string; icon: string }> = {
  info: { wrap: 'bg-neutral-100 text-text-secondary', icon: 'text-neutral-500' },
  warning: { wrap: 'bg-warning-bg text-warning', icon: 'text-warning' },
  danger: { wrap: 'bg-danger-bg text-danger', icon: 'text-danger' },
  success: { wrap: 'bg-success-bg text-success', icon: 'text-success' },
}

export function Alert({
  tone = 'info',
  children,
  className = '',
}: {
  tone?: AlertTone
  children: ReactNode
  className?: string
}) {
  const t = alertTones[tone]
  return (
    <div className={`flex items-start gap-s200 rounded-s200 px-s200 py-1.5 ${t.wrap} ${className}`}>
      <Icon
        name={tone === 'success' ? 'check' : tone === 'info' ? 'info' : 'alert-circle'}
        className={`mt-px size-4 shrink-0 ${t.icon}`}
      />
      <div className="text-xs3">{children}</div>
    </div>
  )
}

/**
 * Verification group (Figma I4001:76480;4013:3707): six 64 × 64 cells,
 * 8px gap, 8px radius, 1px #d0d5dd border, 424px total width.
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  invalid,
  autoFocus,
}: {
  value: string
  onChange: (v: string) => void
  length?: number
  invalid?: boolean
  autoFocus?: boolean
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  function setDigit(i: number, d: string) {
    const digits = value.padEnd(length, ' ').split('')
    digits[i] = d || ' '
    onChange(digits.join('').slice(0, length))
    if (d && i < length - 1) refs.current[i + 1]?.focus()
  }

  function paste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!text) return
    e.preventDefault()
    onChange(text.padEnd(length, ' ').slice(0, length))
    refs.current[Math.min(text.length, length - 1)]?.focus()
  }

  return (
    <div className="flex w-full max-w-[424px] gap-s200">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          autoFocus={autoFocus && i === 0}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          value={(value[i] ?? '').trim()}
          onPaste={paste}
          onChange={(e) => setDigit(i, e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !value[i]?.trim() && i > 0) refs.current[i - 1]?.focus()
          }}
          className={`aspect-square min-w-0 flex-1 rounded-s200 border bg-white px-4 py-1 text-center text-lg font-bold text-text-primary outline-none transition-colors focus:border-primary-400 ${
            invalid ? 'border-danger' : 'border-neutral-300'
          }`}
        />
      ))}
    </div>
  )
}

export function Modal({
  open,
  onClose,
  children,
  width = 500,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  width?: number
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-900/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: width }}
        className="relative w-full overflow-hidden rounded-s300 bg-white shadow-[0_24px_48px_-12px_rgba(16,24,40,.25)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 grid size-6 place-items-center rounded-full text-neutral-500 hover:bg-neutral-100"
        >
          <Icon name="x" className="size-4" />
        </button>
        {children}
      </div>
    </div>
  )
}

/** KYC progress stepper (Figma "Stepper", node 4001:90440). */
export function Stepper({
  steps,
  current,
}: {
  steps: { id: string; label: string }[]
  current: number
}) {
  return (
    <ol className="flex flex-col gap-s300">
      {steps.map((s, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={s.id} className="flex items-start gap-s200">
            <span className="flex flex-col items-center">
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full border text-xs4 font-bold ${
                  done
                    ? 'border-primary-400 bg-primary-400 text-white'
                    : active
                      ? 'border-primary-400 bg-white text-primary-400'
                      : 'border-neutral-300 bg-white text-neutral-400'
                }`}
              >
                {done ? <Icon name="check" strokeWidth={2.4} className="size-3.5" /> : i + 1}
              </span>
              {i < steps.length - 1 && (
                <span className={`h-6 w-px ${done ? 'bg-primary-400' : 'bg-neutral-300'}`} />
              )}
            </span>
            <span
              className={`pt-1 text-xs3 ${
                active ? 'font-bold text-text-primary' : 'text-text-secondary'
              }`}
            >
              {s.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
