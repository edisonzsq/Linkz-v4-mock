import { describe, expect, it } from 'vitest'
import {
  filterByRange,
  formatClock,
  formatDay,
  groupByDay,
  inRange,
  newPaymentRow,
  newSettlementRow,
  seedPayments,
  seedSettlements,
  type SettlementRow,
} from './settlements'

const TODAY = new Date(2026, 5, 15, 12, 0) // 15 June 2026, midday

describe('Q3b — a new settlement row is always Pending', () => {
  it('creates rows at Pending, never Settled', () => {
    const row = newSettlementRow({
      order: '150626-0000001',
      customer: 'PT Maju Bersama',
      method: 'QRIS',
      amount: 750_000,
    })
    expect(row.status).toBe('Pending')
  })

  it('offers no way to create a Settled row', () => {
    // The transition belongs to the LINKZ admin panel, which this prototype
    // does not have. If a future change adds a `status` argument here, this
    // test should fail and the decision be revisited.
    const row = newSettlementRow({ order: 'x', customer: 'y', method: 'z', amount: 1 })
    expect(row.status).not.toBe('Settled')
  })

  it('stamps a payment row with the method chosen at checkout', () => {
    const row = newPaymentRow({
      order: '150626-0000001',
      invoice: 'INV-002',
      paidTo: 'Seller Co.',
      amount: 2_000_000,
      method: 'Virtual Account',
    })
    expect(row.method).toBe('Virtual Account')
  })
})

describe('Q6 — sample rows are seeded relative to today', () => {
  it('puts every seeded settlement inside the last 7 days', () => {
    const rows = seedSettlements(TODAY)
    const sevenDaysAgo = new Date(2026, 5, 9)
    for (const r of rows) {
      expect(inRange(r.at, sevenDaysAgo, TODAY)).toBe(true)
    }
  })

  it('puts the seeded payment inside the last 7 days too', () => {
    const rows = seedPayments(TODAY)
    expect(filterByRange(rows, new Date(2026, 5, 9), TODAY)).toHaveLength(1)
  })

  it('does not pin the sample data to June 2026', () => {
    // The bug this guards: rows hard-coded to a fixed month fall outside the
    // default range as soon as the calendar moves past it, and the report
    // opens empty.
    const rows = seedSettlements(new Date(2027, 0, 20))
    expect(rows.every((r) => new Date(r.at).getFullYear() === 2027)).toBe(true)
  })

  it('keeps two rows on the most recent day so grouping is visible', () => {
    const groups = groupByDay(seedSettlements(TODAY))
    expect(groups[0].rows).toHaveLength(2)
  })

  it('numbers each order after its own date, not a hard-coded one', () => {
    // Otherwise the table shows "2 September 2026" next to order 20260605-001.
    const rows = seedSettlements(TODAY)
    expect(rows.map((r) => r.order)).toEqual([
      '20260615-001',
      '20260615-002',
      '20260614-001',
      '20260613-001',
    ])
  })
})

describe('range filtering', () => {
  const rows = seedSettlements(TODAY)

  it('includes a row timestamped in the afternoon of the end day', () => {
    // `to` comes from a preset as midnight; without stretching it to end-of-day
    // every row after 00:00 on the last day disappears.
    const sameDay = new Date(2026, 5, 14)
    expect(filterByRange(rows, sameDay, sameDay).map((r) => r.id)).toEqual(['st-3'])
  })

  it('excludes rows before the start of the range', () => {
    expect(filterByRange(rows, new Date(2026, 5, 15), TODAY)).toHaveLength(2)
  })

  it('treats a null end as open-ended', () => {
    expect(filterByRange(rows, new Date(2026, 5, 1), null)).toHaveLength(4)
  })

  it('returns nothing for a range that predates every row', () => {
    expect(filterByRange(rows, new Date(2026, 4, 1), new Date(2026, 4, 31))).toHaveLength(0)
  })
})

describe('day grouping', () => {
  it('totals each day and orders newest first', () => {
    const groups = groupByDay(seedSettlements(TODAY))
    expect(groups.map((g) => g.label)).toEqual(['15 June 2026', '14 June 2026', '13 June 2026'])
    expect(groups[0].total).toBe(4_000_000)
  })

  it('reverses on ascending', () => {
    const groups = groupByDay(seedSettlements(TODAY), false)
    expect(groups[0].label).toBe('13 June 2026')
  })

  it('sorts across a month boundary by date, not by day number', () => {
    // The first cut sorted on `parseInt(dateString)`, which puts 30 April ahead
    // of 1 May.
    const rows: SettlementRow[] = [
      { id: 'a', at: new Date(2026, 3, 30, 9, 0).toISOString(), order: 'a', customer: '', method: '', amount: 1, status: 'Pending' },
      { id: 'b', at: new Date(2026, 4, 1, 9, 0).toISOString(), order: 'b', customer: '', method: '', amount: 1, status: 'Pending' },
    ]
    expect(groupByDay(rows).map((g) => g.label)).toEqual(['1 May 2026', '30 April 2026'])
  })

  it('groups by local calendar day, not the UTC date', () => {
    const lateEvening = new Date(2026, 5, 15, 23, 30)
    const groups = groupByDay([
      { id: 'a', at: lateEvening.toISOString(), order: 'a', customer: '', method: '', amount: 1, status: 'Pending' },
    ])
    expect(groups[0].label).toBe('15 June 2026')
  })
})

describe('display formatting', () => {
  it('formats the day as the frame does', () => {
    expect(formatDay(new Date(2026, 5, 5, 9, 15).toISOString())).toBe('5 June 2026')
  })

  it('formats midnight and midday as 12, not 00', () => {
    expect(formatClock(new Date(2026, 5, 5, 0, 5).toISOString())).toBe('12:05 AM')
    expect(formatClock(new Date(2026, 5, 5, 12, 5).toISOString())).toBe('12:05 PM')
  })

  it('pads the hour', () => {
    expect(formatClock(new Date(2026, 5, 5, 9, 15).toISOString())).toBe('09:15 AM')
  })
})
