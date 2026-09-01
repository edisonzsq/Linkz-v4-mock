import { describe, expect, it } from 'vitest'
import {
  actionsFor,
  cancelOrder,
  commitAdjustment,
  completeOrder,
  evenMatch,
  formatAmount,
  grandTotalOf,
  markInvoicePaid,
  newItem,
  newOrder,
  orderFinance,
  parseAmount,
  pendingFinance,
  planSend,
  refreshStatus,
  rowTotal,
  sendOrder,
  sendable,
  voidInvoice,
  type Invoice,
  type Order,
} from './orders'

/** An order sitting at `grand`, with the invoices given. */
function orderAt(grand: number, invoices: Partial<Invoice>[] = []): Order {
  const o = newOrder('sales', 'Sanders')
  o.status = 'Invoiced'
  o.grand = grand
  const item = newItem()
  item.qty = 1
  item.price = grand
  o.doc.items = [item]
  o.invoices = invoices.map((i, n) => ({
    no: i.no ?? `INV-${String(n + 1).padStart(3, '0')}`,
    issued: new Date().toISOString(),
    grand: i.grand ?? grand,
    payable: i.payable ?? 0,
    status: i.status ?? 'Unpaid',
    reminded: false,
  }))
  return o
}

/** Move the working document to a new total without committing it. */
function editTo(o: Order, total: number) {
  o.doc.items = [{ ...newItem(), qty: 1, price: total, touched: true }]
}

describe('parseAmount — §8.1', () => {
  it('reads a single dot as a thousands group, not a decimal point', () => {
    expect(parseAmount('500.000')).toBe(500000)
  })

  it('reads multiple groups', () => {
    expect(parseAmount('1.000.000')).toBe(1000000)
  })

  it('reads the comma as the decimal mark', () => {
    expect(parseAmount('1.500.000,50')).toBe(1500000.5)
  })

  it('strips currency and stray characters', () => {
    expect(parseAmount('IDR 2.500.000,00')).toBe(2500000)
  })

  it('handles negatives, blanks and rubbish', () => {
    expect(parseAmount('-1.000')).toBe(-1000)
    expect(parseAmount('')).toBe(0)
    expect(parseAmount('abc')).toBe(0)
    expect(parseAmount(null)).toBe(0)
  })

  it('round-trips through formatAmount', () => {
    expect(parseAmount(formatAmount(1500000))).toBe(1500000)
  })
})

describe('line and order totals — §2', () => {
  it('applies a nominal discount then tax', () => {
    const it0 = { ...newItem(), qty: 2, price: 100, discount: 50, discountType: '123' as const, tax: 'PPN 11%' }
    // (200 - 50) * 1.11
    expect(rowTotal(it0)).toBeCloseTo(166.5, 6)
  })

  it('applies a percentage discount', () => {
    const it0 = { ...newItem(), qty: 2, price: 100, discount: 10, discountType: '%' as const, tax: 'NO TAX' }
    expect(rowTotal(it0)).toBeCloseTo(180, 6)
  })

  it('never lets a discount drive a row negative', () => {
    const it0 = { ...newItem(), qty: 1, price: 100, discount: 500, discountType: '123' as const, tax: 'NO TAX' }
    expect(rowTotal(it0)).toBe(0)
  })

  it('adds delivery, then the order discount, then order tax', () => {
    const o = newOrder('sales', 'Sanders')
    o.doc.items = [{ ...newItem(), qty: 1, price: 1000, tax: 'NO TAX' }]
    o.doc.deliveryFee = 200
    o.doc.addDiscount = 10
    o.doc.addDiscountType = '%'
    o.doc.addTax = 'PPN 11%'
    // (1000 + 200) * 0.9 * 1.11
    expect(grandTotalOf(o.doc)).toBeCloseTo(1198.8, 6)
  })
})

describe('finance — §3.1', () => {
  it('remaining subtracts open unpaid invoices, not just paid ones', () => {
    const o = orderAt(5_000_000, [{ payable: 2_000_000, status: 'Unpaid' }])
    const f = orderFinance(o)
    expect(f.paid).toBe(0)
    expect(f.invoiced).toBe(2_000_000)
    expect(f.remaining).toBe(3_000_000)
  })

  it('ignores voided invoices', () => {
    const o = orderAt(5_000_000, [
      { payable: 2_000_000, status: 'Void' },
      { payable: 1_000_000, status: 'Paid' },
    ])
    const f = orderFinance(o)
    expect(f.invoiced).toBe(1_000_000)
    expect(f.remaining).toBe(4_000_000)
  })

  it('separates over from overInvoiced', () => {
    // Billed 5m, paid 3m, order worth 2m.
    const o = orderAt(2_000_000, [
      { payable: 3_000_000, status: 'Paid' },
      { payable: 2_000_000, status: 'Unpaid' },
    ])
    const f = orderFinance(o)
    expect(f.over).toBe(1_000_000)
    expect(f.overInvoiced).toBe(3_000_000)
  })

  it('over > 0 implies overInvoiced > 0, never the reverse', () => {
    const o = orderAt(1_000_000, [{ payable: 2_000_000, status: 'Unpaid' }])
    const f = orderFinance(o)
    expect(f.over).toBe(0)
    expect(f.overInvoiced).toBe(1_000_000)
  })
})

describe('committed vs pending — §3.2', () => {
  it('editing a sent order does not move order.grand', () => {
    const o = orderAt(5_000_000, [{ payable: 3_000_000, status: 'Paid' }])
    editTo(o, 3_000_000)
    expect(o.grand).toBe(5_000_000)
    expect(pendingFinance(o).grand).toBe(3_000_000)
  })

  it('the documented bug: reducing to match a paid invoice must not complete the order', () => {
    const o = orderAt(5_000_000, [{ payable: 3_000_000, status: 'Paid' }])
    editTo(o, 3_000_000)
    refreshStatus(o)
    expect(o.status).toBe('Invoiced')
    expect(o.status).not.toBe('Completed')
  })

  it('only a send commits the adjustment', () => {
    const o = orderAt(5_000_000, [{ payable: 3_000_000, status: 'Paid' }])
    editTo(o, 2_000_000)
    expect(orderFinance(o).over).toBe(0)
    commitAdjustment(o)
    expect(o.grand).toBe(2_000_000)
    expect(orderFinance(o).over).toBe(1_000_000)
  })
})

describe('status derivation — §3.3', () => {
  it('a part-paid order stays Invoiced', () => {
    const o = orderAt(5_000_000, [
      { payable: 2_000_000, status: 'Paid' },
      { payable: 3_000_000, status: 'Unpaid' },
    ])
    refreshStatus(o)
    expect(o.status).toBe('Invoiced')
  })

  it('over-collection makes it Overpaid', () => {
    const o = orderAt(2_000_000, [{ payable: 3_000_000, status: 'Paid' }])
    refreshStatus(o)
    expect(o.status).toBe('Overpaid')
  })

  it('never overrides a deliberate status', () => {
    for (const status of ['Draft', 'Completed', 'Cancelled'] as const) {
      const o = orderAt(2_000_000, [{ payable: 3_000_000, status: 'Paid' }])
      o.status = status
      refreshStatus(o)
      expect(o.status).toBe(status)
    }
  })
})

describe('invoices are immutable history — §3.4', () => {
  it('invoice.grand does not follow later edits to the order', () => {
    const o = orderAt(5_000_000)
    o.doc.items = [{ ...newItem(), qty: 1, price: 5_000_000 }]
    sendOrder(o, 5_000_000)
    expect(o.invoices[0].grand).toBe(5_000_000)

    editTo(o, 2_000_000)
    sendOrder(o)
    // The first invoice still records the total at issue.
    expect(o.invoices[0].grand).toBe(5_000_000)
    expect(o.grand).toBe(2_000_000)
  })
})

describe('completion — §3.5', () => {
  it('completing voids every open invoice', () => {
    const o = orderAt(5_000_000, [
      { payable: 2_000_000, status: 'Paid' },
      { payable: 3_000_000, status: 'Unpaid' },
    ])
    completeOrder(o)
    expect(o.status).toBe('Completed')
    expect(o.invoices.filter((i) => i.status === 'Unpaid')).toHaveLength(0)
  })

  it('route 1 — marking the last invoice paid completes the order', () => {
    const o = orderAt(1_000_000, [{ no: 'INV-001', payable: 1_000_000, status: 'Unpaid' }])
    markInvoicePaid(o, 'INV-001')
    expect(o.status).toBe('Completed')
  })

  it('route 1 does not fire on a partial payment', () => {
    const o = orderAt(5_000_000, [
      { no: 'INV-001', payable: 2_000_000, status: 'Unpaid' },
      { no: 'INV-002', payable: 3_000_000, status: 'Unpaid' },
    ])
    markInvoicePaid(o, 'INV-001')
    expect(o.status).toBe('Invoiced')
  })

  it('route 2 — Set as Complete on an overpaid order', () => {
    const o = orderAt(2_000_000, [
      { payable: 3_000_000, status: 'Paid' },
      { payable: 1_000_000, status: 'Unpaid' },
    ])
    refreshStatus(o)
    expect(o.status).toBe('Overpaid')
    completeOrder(o)
    expect(o.status).toBe('Completed')
    expect(o.invoices.some((i) => i.status === 'Unpaid')).toBe(false)
  })

  it('route 3 — an even-out send completes and leaves nothing open', () => {
    const o = orderAt(5_000_000, [
      { payable: 3_000_000, status: 'Paid' },
      { payable: 2_000_000, status: 'Unpaid' },
    ])
    editTo(o, 3_000_000)
    expect(evenMatch(o)).toBe(true)
    sendOrder(o)
    expect(o.status).toBe('Completed')
    expect(o.invoices.some((i) => i.status === 'Unpaid')).toBe(false)
  })

  it('no completed order holds an Unpaid invoice, across all three routes', () => {
    const builders = [
      () => {
        const o = orderAt(1_000_000, [{ no: 'INV-001', payable: 1_000_000, status: 'Unpaid' }])
        markInvoicePaid(o, 'INV-001')
        return o
      },
      () => {
        const o = orderAt(2_000_000, [
          { payable: 3_000_000, status: 'Paid' },
          { payable: 1_000_000, status: 'Unpaid' },
        ])
        completeOrder(o)
        return o
      },
      () => {
        const o = orderAt(5_000_000, [
          { payable: 3_000_000, status: 'Paid' },
          { payable: 2_000_000, status: 'Unpaid' },
        ])
        editTo(o, 3_000_000)
        sendOrder(o)
        return o
      },
    ]
    for (const build of builders) {
      const o = build()
      expect(o.status).toBe('Completed')
      expect(o.invoices.filter((i) => i.status === 'Unpaid')).toHaveLength(0)
    }
  })

  it('voiding invoices never drops a sent order back to Draft', () => {
    const o = orderAt(5_000_000, [{ no: 'INV-001', payable: 5_000_000, status: 'Unpaid' }])
    voidInvoice(o, 'INV-001')
    expect(o.status).toBe('Invoiced')
  })

  it('cancelling voids open invoices', () => {
    const o = orderAt(5_000_000, [{ payable: 5_000_000, status: 'Unpaid' }])
    cancelOrder(o)
    expect(o.status).toBe('Cancelled')
    expect(o.invoices.some((i) => i.status === 'Unpaid')).toBe(false)
  })
})

describe('send gating and plans — §5.1 / §5.5', () => {
  it('nothing left to invoice is not sendable', () => {
    const o = orderAt(1_000_000, [{ payable: 1_000_000, status: 'Paid' }])
    editTo(o, 1_000_000)
    // fully invoiced and fully paid, and grand === paid so even-out does apply
    expect(sendable(o)).toBe(evenMatch(o))
  })

  it('remaining balance is sendable', () => {
    const o = orderAt(5_000_000, [{ payable: 2_000_000, status: 'Unpaid' }])
    expect(sendable(o)).toBe(true)
    expect(planSend(o)).toEqual({ kind: 'normal', amount: 3_000_000 })
  })

  it('an over-invoiced edit plans a void-then-correct', () => {
    const o = orderAt(5_000_000, [{ payable: 4_000_000, status: 'Unpaid' }])
    editTo(o, 2_000_000)
    const plan = planSend(o)
    expect(plan.kind).toBe('over-invoiced')
    if (plan.kind === 'over-invoiced') {
      expect(plan.voidCount).toBe(1)
      expect(plan.correctedRemaining).toBe(2_000_000)
    }
  })

  it('an overpaid send issues a zero-payable invoice and marks the order Overpaid', () => {
    const o = orderAt(5_000_000, [{ payable: 3_000_000, status: 'Paid' }])
    editTo(o, 2_000_000)
    const plan = sendOrder(o)
    expect(plan.kind).toBe('overpaid')
    expect(o.status).toBe('Overpaid')
    const last = o.invoices[o.invoices.length - 1]
    expect(last.payable).toBe(0)
    expect(last.status).toBe('Overpaid')
  })

  it('every send raises exactly one invoice', () => {
    const o = orderAt(9_000_000)
    o.doc.items = [{ ...newItem(), qty: 1, price: 9_000_000 }]
    sendOrder(o, 4_000_000)
    sendOrder(o, 5_000_000)
    expect(o.invoices).toHaveLength(2)
    expect(o.invoices.map((i) => i.no)).toEqual(['INV-001', 'INV-002'])
  })
})

describe('row menu mirrors the header — §4', () => {
  it('Draft offers only draft actions', () => {
    const o = orderAt(1_000_000)
    o.status = 'Draft'
    expect(actionsFor(o)).toEqual(['Duplicate Draft', 'Delete Draft'])
  })

  it('Cancel Order disappears once overpaid', () => {
    const o = orderAt(2_000_000, [{ payable: 3_000_000, status: 'Paid' }])
    refreshStatus(o)
    const actions = actionsFor(o)
    expect(actions).toContain('Set as Complete')
    expect(actions).not.toContain('Cancel Order')
  })

  it('closed orders offer neither Send nor Cancel', () => {
    for (const status of ['Completed', 'Cancelled'] as const) {
      const o = orderAt(1_000_000, [{ payable: 1_000_000, status: 'Paid' }])
      o.status = status
      const actions = actionsFor(o)
      expect(actions).not.toContain('Cancel Order')
      expect(actions).not.toContain('Set as Complete')
    }
  })
})
