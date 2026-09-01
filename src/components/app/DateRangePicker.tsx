import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { orderReport as rp } from '../../data/appData'
import {
  DOW,
  MONTHS,
  formatDMY,
  labelForPreset,
  maskDMY,
  monthGrid,
  parseDMY,
  rangeForPreset,
  sameDay,
  startOfDay,
  type DateRange,
  type PresetId,
} from './dateUtils'

/**
 * Date-range picker — Figma 7017:1350 (Order Report, picker open).
 *
 * Three rules from §9 of the handover, all of which this enforces:
 *
 *  1. **Nothing below the picker changes until Apply.** The in-progress choice
 *     lives in `pending*` state; only Apply lifts it to the caller. Cancel
 *     discards it and restores what was applied.
 *  2. **Typing in From / To switches the preset to Custom** without stealing
 *     focus mid-entry.
 *  3. **The fields stay in `dd/mm/yyyy`** — slashes inserted as you type,
 *     digits only, capped at 8. Validated on commit (`31/02` is rejected), the
 *     calendar jumps to the entered month, and inverted ends are swapped.
 */

export function DateRangePicker({
  preset,
  range,
  onApply,
}: {
  preset: PresetId
  range: DateRange
  onApply: (preset: PresetId, range: DateRange) => void
}) {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)

  // In-progress choice — never read by the caller until Apply.
  const [pendingPreset, setPendingPreset] = useState<PresetId>(preset)
  const [pendingRange, setPendingRange] = useState<DateRange>(range)
  const [fromText, setFromText] = useState(formatDMY(range.from))
  const [toText, setToText] = useState(formatDMY(range.to))
  const [month, setMonth] = useState(() => range.from ?? new Date(2026, 10, 1))

  function reset() {
    setPendingPreset(preset)
    setPendingRange(range)
    setFromText(formatDMY(range.from))
    setToText(formatDMY(range.to))
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) {
        reset()
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, preset, range])

  function choosePreset(id: PresetId) {
    setPendingPreset(id)
    if (id === 'custom') return
    const r = rangeForPreset(id)
    setPendingRange(r)
    setFromText(formatDMY(r.from))
    setToText(formatDMY(r.to))
    if (r.from) setMonth(r.from)
  }

  /** Clicking a day extends or restarts the range. */
  function pickDay(d: Date) {
    setPendingPreset('custom')
    const { from, to } = pendingRange
    let next: DateRange
    if (!from || (from && to)) next = { from: d, to: null }
    else next = d < from ? { from: d, to: from } : { from, to: d }
    setPendingRange(next)
    setFromText(formatDMY(next.from))
    setToText(formatDMY(next.to))
  }

  /** Typing switches to Custom without moving focus. */
  function typeEnd(which: 'from' | 'to', raw: string) {
    const masked = maskDMY(raw)
    if (which === 'from') setFromText(masked)
    else setToText(masked)
    setPendingPreset('custom')

    const d = parseDMY(masked)
    if (!d) return
    setMonth(d)
    setPendingRange((prev) => {
      const next = which === 'from' ? { ...prev, from: d } : { ...prev, to: d }
      // Swap if entered inverted.
      if (next.from && next.to && next.from > next.to) return { from: next.to, to: next.from }
      return next
    })
  }

  /** On blur, reject an invalid date by restoring the last good text. */
  function commitEnd(which: 'from' | 'to') {
    const text = which === 'from' ? fromText : toText
    if (text && !parseDMY(text)) {
      const good = formatDMY(which === 'from' ? pendingRange.from : pendingRange.to)
      if (which === 'from') setFromText(good)
      else setToText(good)
      return
    }
    const swapped =
      pendingRange.from && pendingRange.to && pendingRange.from > pendingRange.to
        ? { from: pendingRange.to, to: pendingRange.from }
        : pendingRange
    setFromText(formatDMY(swapped.from))
    setToText(formatDMY(swapped.to))
  }

  const days = monthGrid(month)

  const label = pendingPreset === 'custom' && !open ? 'Custom' : labelForPreset(preset)

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => {
          if (open) reset()
          setOpen((v) => !v)
        }}
        aria-expanded={open}
        className="flex h-9 items-center gap-s200 rounded-s200 border border-neutral-300 bg-white px-s300 text-xs3 text-text-primary hover:bg-neutral-50"
      >
        <Icon name="calendar" className="size-4 text-text-secondary" />
        <span className="min-w-[80px] text-left">{label}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} className="size-4 text-neutral-500" />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-40 flex w-[544px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-s300 border border-neutral-200 bg-white shadow-[0_16px_40px_-12px_rgba(16,24,40,.3)]">
          <div className="flex flex-col sm:flex-row">
            {/* Presets */}
            <div className="flex shrink-0 flex-row gap-s100 border-neutral-200 p-s200 sm:w-[140px] sm:flex-col sm:border-r">
              {rp.presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => choosePreset(p.id as PresetId)}
                  className={`rounded-s200 px-s300 py-s200 text-left text-xs3 transition-colors ${
                    pendingPreset === p.id
                      ? 'bg-primary-25 font-semibold text-primary-500'
                      : 'text-text-secondary hover:bg-neutral-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Calendar */}
            <div className="min-w-0 flex-1 p-s300">
              <div className="mb-s300 flex items-center justify-between">
                <p className="text-xs2 font-bold text-text-primary">
                  {MONTHS[month.getMonth()]} {month.getFullYear()}
                </p>
                <div className="flex items-center gap-s100">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                    className="grid size-7 place-items-center rounded-s200 text-neutral-600 hover:bg-neutral-100"
                  >
                    <Icon name="chevron-left" className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                    className="grid size-7 place-items-center rounded-s200 text-neutral-600 hover:bg-neutral-100"
                  >
                    <Icon name="chevron-right" className="size-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-y-1">
                {DOW.map((d) => (
                  <span key={d} className="pb-s200 text-center text-xs3 font-semibold text-text-secondary">
                    {d}
                  </span>
                ))}

                {days.map((d) => {
                  const inMonth = d.getMonth() === month.getMonth()
                  const { from, to } = pendingRange
                  const isEnd = sameDay(d, from) || sameDay(d, to)
                  const between = !!from && !!to && d > from && d < to
                  return (
                    <button
                      key={d.toISOString()}
                      type="button"
                      onClick={() => pickDay(startOfDay(d))}
                      aria-label={formatDMY(d)}
                      className={`h-9 text-xs2 transition-colors ${
                        isEnd
                          ? 'bg-primary-400 font-semibold text-white'
                          : between
                            ? 'bg-primary-50 text-text-primary'
                            : inMonth
                              ? 'text-text-primary hover:bg-neutral-100'
                              : 'text-neutral-300'
                      } ${sameDay(d, from) ? 'rounded-l-s200' : ''} ${sameDay(d, to) ? 'rounded-r-s200' : ''}`}
                    >
                      {d.getDate()}
                    </button>
                  )
                })}
              </div>

              <div className="mt-s300 grid grid-cols-2 gap-s300">
                {(['from', 'to'] as const).map((which) => (
                  <label key={which} className="flex flex-col gap-s100">
                    <span className="text-xs3 text-text-secondary">
                      {which === 'from' ? rp.picker.from : rp.picker.to}
                    </span>
                    <input
                      value={which === 'from' ? fromText : toText}
                      onChange={(e) => typeEnd(which, e.target.value)}
                      onBlur={() => commitEnd(which)}
                      placeholder="dd/mm/yyyy"
                      inputMode="numeric"
                      className="h-9 rounded-s200 border border-neutral-300 px-s200 text-xs3 text-text-primary outline-none focus:border-primary-400"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-neutral-200 p-s300">
            <Button
              variant="outline"
              onClick={() => {
                reset()
                setOpen(false)
              }}
            >
              {rp.picker.cancel}
            </Button>
            <Button
              onClick={() => {
                onApply(pendingPreset, pendingRange)
                setOpen(false)
              }}
            >
              {rp.picker.apply}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
