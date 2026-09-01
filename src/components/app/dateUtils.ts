import { orderReport as rp } from '../../data/appData'

/**
 * Date helpers for the Order Report range picker (§9 of the handover).
 * Kept out of the component file so they can be unit-tested directly.
 */

export type DateRange = { from: Date | null; to: Date | null }
export type PresetId = 'today' | 'yesterday' | 'last7' | 'custom'

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** Weeks start Monday, as in the frame. */
export const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export const sameDay = (a: Date | null, b: Date | null) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export function formatDMY(d: Date | null): string {
  if (!d) return ''
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

/** Digits only, slashes inserted as you type, capped at 8 digits. */
export function maskDMY(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean)
  return parts.join('/')
}

/** Strict parse — rejects 31/02 and friends by round-tripping the parts. */
export function parseDMY(s: string): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s.trim())
  if (!m) return null
  const [, dd, mm, yyyy] = m
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
  if (
    d.getDate() !== Number(dd) ||
    d.getMonth() !== Number(mm) - 1 ||
    d.getFullYear() !== Number(yyyy)
  ) {
    return null
  }
  return d
}

export function rangeForPreset(id: PresetId, today = new Date()): DateRange {
  const t = startOfDay(today)
  if (id === 'today') return { from: t, to: t }
  if (id === 'yesterday') {
    const y = new Date(t)
    y.setDate(y.getDate() - 1)
    return { from: y, to: y }
  }
  if (id === 'last7') {
    const f = new Date(t)
    f.setDate(f.getDate() - 6)
    return { from: f, to: t }
  }
  return { from: null, to: null }
}

export function labelForPreset(id: PresetId): string {
  return rp.presets.find((p) => p.id === id)?.label ?? 'Custom'
}

/** 42-cell Monday-first grid for the month containing `month`. */
export function monthGrid(month: Date): Date[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const lead = (first.getDay() + 6) % 7
  const start = new Date(first)
  start.setDate(start.getDate() - lead)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    return d
  })
}
