import { describe, expect, it } from 'vitest'
import { formatDMY, maskDMY, monthGrid, parseDMY, rangeForPreset, sameDay } from './dateUtils'

describe('dd/mm/yyyy field — §9', () => {
  it('masks digits into dd/mm/yyyy as you type', () => {
    expect(maskDMY('2')).toBe('2')
    expect(maskDMY('29')).toBe('29')
    expect(maskDMY('2911')).toBe('29/11')
    expect(maskDMY('29112026')).toBe('29/11/2026')
  })

  it('ignores non-digits and caps at 8 digits', () => {
    expect(maskDMY('29a/11b/2026c')).toBe('29/11/2026')
    expect(maskDMY('291120261234')).toBe('29/11/2026')
  })

  it('parses a valid date', () => {
    const d = parseDMY('29/11/2026')
    expect(d?.getDate()).toBe(29)
    expect(d?.getMonth()).toBe(10)
    expect(d?.getFullYear()).toBe(2026)
  })

  it('rejects an impossible date rather than rolling it over', () => {
    expect(parseDMY('31/02/2026')).toBeNull()
    expect(parseDMY('31/11/2026')).toBeNull()
    expect(parseDMY('00/01/2026')).toBeNull()
  })

  it('rejects incomplete input', () => {
    expect(parseDMY('29/11')).toBeNull()
    expect(parseDMY('')).toBeNull()
  })

  it('round-trips through formatDMY', () => {
    expect(formatDMY(parseDMY('01/02/2026'))).toBe('01/02/2026')
  })
})

describe('presets', () => {
  const today = new Date(2026, 10, 30)

  it('Today is a single day', () => {
    const r = rangeForPreset('today', today)
    expect(sameDay(r.from, r.to)).toBe(true)
    expect(r.from?.getDate()).toBe(30)
  })

  it('Yesterday is the day before', () => {
    const r = rangeForPreset('yesterday', today)
    expect(r.from?.getDate()).toBe(29)
    expect(sameDay(r.from, r.to)).toBe(true)
  })

  it('Last 7 days spans today and the six before it', () => {
    const r = rangeForPreset('last7', today)
    expect(r.from?.getDate()).toBe(24)
    expect(r.to?.getDate()).toBe(30)
  })

  it('Custom starts empty', () => {
    expect(rangeForPreset('custom', today)).toEqual({ from: null, to: null })
  })
})

describe('calendar grid', () => {
  it('is 42 cells starting on a Monday', () => {
    const grid = monthGrid(new Date(2026, 10, 1))
    expect(grid).toHaveLength(42)
    expect(grid[0].getDay()).toBe(1)
  })

  it('leads with the tail of the previous month when the 1st is not a Monday', () => {
    // 1 Nov 2026 is a Sunday, so the grid opens on 26 Oct.
    const grid = monthGrid(new Date(2026, 10, 1))
    expect(grid[0].getMonth()).toBe(9)
    expect(grid.some((d) => d.getMonth() === 10 && d.getDate() === 1)).toBe(true)
  })
})
