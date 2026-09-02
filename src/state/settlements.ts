/**
 * Order Report rows — §9 of `docs/order-behaviour-handover.md`.
 *
 * Two decisions from `docs/order-open-questions.md` shape this file:
 *
 *  - **Q3b.** A settlement row is created as `Pending` when a sales invoice is
 *    settled, and is moved to `Settled` by a LINKZ admin from the admin panel —
 *    not by the user, and not on a timer. This prototype has no admin panel, so
 *    rows created here stay `Pending` for the life of the session and `Settled`
 *    appears only on the seeded sample rows.
 *  - **Q6.** The sample rows are seeded *relative to today* rather than pinned
 *    to June 2026, so the default "Last 7 days" range is always populated and
 *    the picker filters for real instead of only demonstrating the interaction.
 *
 * Rows carry an ISO timestamp (`at`) rather than a display string, because the
 * range filter and the day grouping both need a real date.
 */

export type SettlementStatus = 'Settled' | 'Pending' | 'Charge Back' | 'Cancelled'

export type SettlementRow = {
  id: string
  /** ISO timestamp. */
  at: string
  order: string
  customer: string
  method: string
  amount: number
  status: SettlementStatus
}

export type PaymentRow = {
  id: string
  at: string
  order: string
  invoice: string
  paidTo: string
  amount: number
  method: string
}

/* ------------------------------------------------------------- formatting */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** `5 June 2026` — the day label in the grouped settlement table. */
export function formatDay(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/** `09:15 AM`. Hand-rolled so it does not depend on the runtime's locale data. */
export function formatClock(iso: string): string {
  const d = new Date(iso)
  const h = d.getHours()
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${String(h12).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

/** `5 June 2026 06:00 AM` — the Payments table shows one combined column. */
export function formatDayTime(iso: string): string {
  return `${formatDay(iso)} ${formatClock(iso)}`
}

/* ----------------------------------------------------------------- seeding */

/** `daysAgo(2, 14, 30)` → 14:30 the day before yesterday. */
function daysAgo(n: number, hour: number, minute: number, today = new Date()): string {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - n, hour, minute)
  return d.toISOString()
}

/**
 * The four sample settlements from the frame (7017:1308), re-dated onto the
 * last three days so they always fall inside "Last 7 days". Two rows share the
 * most recent day, which is what makes the day-grouping visible.
 */
export function seedSettlements(today = new Date()): SettlementRow[] {
  const rows: Omit<SettlementRow, 'order'>[] = [
    { id: 'st-1', at: daysAgo(0, 9, 15, today), customer: 'PT Maju Bersama', method: 'Credit Card', amount: 2_500_000, status: 'Charge Back' },
    { id: 'st-2', at: daysAgo(0, 11, 30, today), customer: 'CV Sumber Rezeki', method: 'Bank Transfer', amount: 1_500_000, status: 'Pending' },
    { id: 'st-3', at: daysAgo(1, 14, 45, today), customer: 'PT Sentosa Abadi', method: 'Virtual Account', amount: 3_000_000, status: 'Settled' },
    { id: 'st-4', at: daysAgo(2, 16, 20, today), customer: 'PT Harmoni Jaya', method: 'QRIS', amount: 1_500_000, status: 'Cancelled' },
  ]
  // The frame numbers orders `YYYYMMDD-NNN` after their date. Now that the
  // dates move with today, the numbers have to move with them, or the table
  // reads "2 September 2026" against order 20260605-001.
  const seenPerDay = new Map<string, number>()
  return rows.map((r) => {
    const d = new Date(r.at)
    const day = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
    const n = (seenPerDay.get(day) ?? 0) + 1
    seenPerDay.set(day, n)
    return { ...r, order: `${day}-${String(n).padStart(3, '0')}` }
  })
}

export function seedPayments(today = new Date()): PaymentRow[] {
  return [
    { id: 'pm-1', at: daysAgo(0, 6, 0, today), order: '20225-0000001', invoice: 'INV-001', paidTo: 'Customer Company Ltd.', amount: 100_000_000, method: 'Credit Card' },
  ]
}

/* ---------------------------------------------------------------- creation */

/**
 * A settlement row for a sales invoice that has just been settled.
 *
 * Always `Pending` — see Q3b. There is deliberately no function here that
 * creates a row already `Settled`, because nothing in the user-facing
 * prototype is allowed to make that transition.
 */
export function newSettlementRow(fields: {
  order: string
  customer: string
  method: string
  amount: number
  at?: string
}): SettlementRow {
  return {
    id: `st-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: fields.at ?? new Date().toISOString(),
    order: fields.order,
    customer: fields.customer,
    method: fields.method,
    amount: fields.amount,
    status: 'Pending',
  }
}

/** A payment row for a purchase invoice paid at checkout. */
export function newPaymentRow(fields: {
  order: string
  invoice: string
  paidTo: string
  amount: number
  method: string
  at?: string
}): PaymentRow {
  return {
    id: `pm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: fields.at ?? new Date().toISOString(),
    ...fields,
  }
}

/* --------------------------------------------------------------- filtering */

/**
 * Inclusive on both ends, and on whole days — `to` is stretched to 23:59:59 so
 * a row timestamped in the afternoon is not dropped by a range whose end is
 * midnight (which is what every preset produces).
 */
export function inRange(iso: string, from: Date | null, to: Date | null): boolean {
  const t = new Date(iso).getTime()
  if (from && t < new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime()) {
    return false
  }
  if (to && t > new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999).getTime()) {
    return false
  }
  return true
}

export function filterByRange<T extends { at: string }>(
  rows: T[],
  from: Date | null,
  to: Date | null,
): T[] {
  return rows.filter((r) => inRange(r.at, from, to))
}

/* ---------------------------------------------------------------- grouping */

export type DayGroup = { key: string; label: string; rows: SettlementRow[]; total: number }

/** Settlements grouped by calendar day, newest first unless `desc` is false. */
export function groupByDay(rows: SettlementRow[], desc = true): DayGroup[] {
  const byDay = new Map<string, SettlementRow[]>()
  for (const r of rows) {
    const d = new Date(r.at)
    // Local calendar day, not the ISO date — a late-evening row must not be
    // grouped under the next day because UTC has already rolled over.
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    byDay.set(key, [...(byDay.get(key) ?? []), r])
  }
  return [...byDay.entries()]
    .sort((a, b) => (desc ? b[0].localeCompare(a[0]) : a[0].localeCompare(b[0])))
    .map(([key, group]) => ({
      key,
      label: formatDay(group[0].at),
      rows: [...group].sort((a, b) =>
        desc ? b.at.localeCompare(a.at) : a.at.localeCompare(b.at),
      ),
      total: group.reduce((n, r) => n + r.amount, 0),
    }))
}
