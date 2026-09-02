/**
 * Order / invoice domain model.
 *
 * Implements §2–3 of `docs/order-behaviour-handover.md`. Every screen in the
 * Order module reads from here; nothing in this file touches React or the DOM,
 * so the rules can be unit-tested on their own (`src/state/orders.test.ts`).
 *
 * The two rules that are easiest to get wrong, and that the tests pin down:
 *
 *   1. **Committed vs pending** (§3.2). Editing a sent order does not change
 *      what the order *is*. `order.grand` moves only on a send. Statuses and
 *      the list read committed figures; warnings and the send dialog read
 *      pending ones.
 *   2. **Invoices are immutable history** (§3.4). `invoice.grand` records the
 *      order total at issue and never follows later edits.
 */

/** Money comparisons are never exact — compare through this. */
export const EPS = 0.005

export type OrderKind = 'sales' | 'purchase'
export type OrderStatus = 'Draft' | 'Invoiced' | 'Overpaid' | 'Completed' | 'Cancelled'
export type InvoiceStatus = 'Unpaid' | 'Paid' | 'Void' | 'Overpaid'

export type DiscountType = '123' | '%'

export type LineItem = {
  id: string
  sku: string
  name: string
  desc: string
  qty: number
  uom: string
  price: number
  discount: number
  discountType: DiscountType
  /** 'NO TAX' | 'PPN 11%' | 'PPN 12%' */
  tax: string
  /** Edited this session — drives the overpaid highlight (§5.4). */
  touched?: boolean
}

export type OrderDoc = {
  kind: OrderKind
  counterparty: string | null
  items: LineItem[]
  remarks: string
  deliveryFee: number
  addDiscount: number
  addDiscountType: '%' | 'IDR'
  addTax: string
}

export type Invoice = {
  no: string
  issued: string
  /** Order total at issue — immutable (§3.4). */
  grand: number
  payable: number
  status: InvoiceStatus
  reminded: boolean
}

export type Order = {
  no: string
  kind: OrderKind
  status: OrderStatus
  /** Committed total. Only a send moves this (§3.2). */
  grand: number
  doc: OrderDoc
  invoices: Invoice[]
  createdBy: string
  billTo: string
  updated: string
  isNew: boolean
}

/* ---------------------------------------------------------------- amounts */

/**
 * Indonesian number format: `.` groups thousands, `,` is the decimal mark.
 *
 * Every dot is stripped before parsing. Treating a *single* dot as a decimal
 * point makes `'500.000'` parse as 500 while `'1.000.000'` parses correctly,
 * so the bug looks intermittent and corrupts invoice payable and paid amounts
 * together (§8.1).
 */
export function parseAmount(v: string | number | null | undefined): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  let s = String(v ?? '')
    .trim()
    .replace(/[^\d.,-]/g, '')
  if (!s) return 0
  const neg = s.startsWith('-')
  s = s.replace(/-/g, '').replace(/\./g, '').replace(',', '.')
  const n = parseFloat(s)
  return Number.isNaN(n) ? 0 : neg ? -n : n
}

/** `1500000` → `1.500.000,00`. */
export function formatAmount(n: number, decimals = 2): string {
  const neg = n < 0
  const fixed = Math.abs(n).toFixed(decimals)
  const [int, dec] = fixed.split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${neg ? '-' : ''}${grouped}${dec ? `,${dec}` : ''}`
}

export function formatIDR(n: number): string {
  return `IDR ${formatAmount(n)}`
}

/** 'PPN 11%' → 0.11; anything unrecognised (incl. 'NO TAX') → 0. */
export function taxRate(tax: string): number {
  const m = /(\d+(?:[.,]\d+)?)\s*%/.exec(tax ?? '')
  return m ? parseFloat(m[1].replace(',', '.')) / 100 : 0
}

/* ------------------------------------------------------------- line maths */

export function rowSubtotal(it: LineItem): number {
  return it.qty * it.price
}

export function rowDiscount(it: LineItem): number {
  const sub = rowSubtotal(it)
  return it.discountType === '%' ? (sub * it.discount) / 100 : it.discount
}

export function rowTotal(it: LineItem): number {
  return Math.max(0, rowSubtotal(it) - rowDiscount(it)) * (1 + taxRate(it.tax))
}

/** Grand total of the working document — drives the Payment Details panel. */
export function grandTotalOf(doc: OrderDoc): number {
  const subtotal = doc.items.reduce((n, it) => n + rowTotal(it), 0)
  const beforeDisc = subtotal + doc.deliveryFee
  const disc =
    doc.addDiscountType === '%' ? (beforeDisc * doc.addDiscount) / 100 : doc.addDiscount
  return Math.max(0, beforeDisc - disc) * (1 + taxRate(doc.addTax))
}

/* ---------------------------------------------------------------- finance */

export type Finance = {
  grand: number
  paid: number
  invoiced: number
  /** Still billable. */
  remaining: number
  /** Collected beyond the order — drives Overpaid. */
  over: number
  /** Billed beyond the order, whether or not it has been paid. */
  overInvoiced: number
}

const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0)

export function financeFor(order: Pick<Order, 'invoices'>, grand: number): Finance {
  const paid = sum(order.invoices.filter((i) => i.status === 'Paid').map((i) => i.payable))
  // Every live invoice claims its share, paid or not.
  const invoiced = sum(order.invoices.filter((i) => i.status !== 'Void').map((i) => i.payable))
  return {
    grand,
    paid,
    invoiced,
    remaining: Math.max(0, grand - invoiced),
    over: Math.max(0, paid - grand),
    overInvoiced: Math.max(0, invoiced - grand),
  }
}

/** Committed — the order as last sent. */
export function orderFinance(o: Order): Finance {
  return financeFor(o, o.grand)
}

/** Pending — what a send would make it. */
export function pendingFinance(o: Order): Finance {
  return financeFor(o, grandTotalOf(o.doc))
}

/* ----------------------------------------------------------- transitions */

const now = () => new Date().toISOString()

/** Called ONLY from a send (§3.2). */
export function commitAdjustment(o: Order): void {
  o.grand = grandTotalOf(o.doc)
  o.updated = now()
}

/**
 * Derive status from committed figures. Draft / Completed / Cancelled are set
 * deliberately and are never derived. A part-paid order stays `Invoiced` —
 * there is no `Partially Paid` and no order-level `Paid` (§3.3).
 */
export function refreshStatus(o: Order): void {
  if (o.status === 'Draft' || o.status === 'Completed' || o.status === 'Cancelled') return
  o.status = orderFinance(o).over > EPS ? 'Overpaid' : 'Invoiced'
}

/**
 * The single completion path (§3.5). A completed order can never hold an open
 * invoice — a closed order must not still be asking for money. Route every
 * completion through here so the invariant cannot drift.
 */
export function completeOrder(o: Order): void {
  o.invoices.forEach((i) => {
    if (i.status === 'Unpaid') i.status = 'Void'
  })
  o.status = 'Completed'
  o.updated = now()
}

/**
 * Whether the order can still be cancelled.
 *
 * Answered in `docs/order-open-questions.md` Q8: an order that already has a
 * paid invoice against it cannot be cancelled. Money has changed hands, so the
 * way out is completion (or a refund handled outside this flow), not erasure.
 * The handover's §6 allowed cancelling at any point before completion; this
 * narrows it.
 */
export function canCancel(o: Order): boolean {
  if (o.status === 'Completed' || o.status === 'Cancelled' || o.status === 'Draft') return false
  return !o.invoices.some((i) => i.status === 'Paid')
}

/** No-ops when {@link canCancel} is false, so no caller can route around it. */
export function cancelOrder(o: Order): void {
  if (!canCancel(o)) return
  o.invoices.forEach((i) => {
    if (i.status === 'Unpaid') i.status = 'Void'
  })
  o.status = 'Cancelled'
  o.updated = now()
}

export function anyUnpaid(o: Order): boolean {
  return o.invoices.some((i) => i.status === 'Unpaid')
}

/**
 * Marking an invoice paid. Completes the order when nothing is left open and
 * nothing is owed or over-collected — completion route 1 of 3 (§3.5).
 */
export function markInvoicePaid(o: Order, invoiceNo: string): void {
  const inv = o.invoices.find((i) => i.no === invoiceNo)
  if (!inv || inv.status !== 'Unpaid') return
  inv.status = 'Paid'
  o.updated = now()

  const f = orderFinance(o)
  if (!anyUnpaid(o) && f.remaining <= EPS && f.over <= EPS) completeOrder(o)
  else refreshStatus(o)
}

export function voidInvoice(o: Order, invoiceNo: string): void {
  const inv = o.invoices.find((i) => i.no === invoiceNo)
  if (!inv || inv.status === 'Void') return
  inv.status = 'Void'
  o.updated = now()
  // A sent order must never fall back to Draft when its invoices are voided.
  refreshStatus(o)
}

/* ---------------------------------------------------------------- sending */

/** Whether the even-out case applies — a send would exactly match what was paid. */
export function evenMatch(o: Order): boolean {
  const f = pendingFinance(o)
  return f.paid > EPS && Math.abs(f.grand - f.paid) <= EPS && f.remaining <= EPS
}

/** §5.1 — all against pending figures. */
export function sendable(o: Order): boolean {
  const f = pendingFinance(o)
  return f.remaining > EPS || f.over > EPS || f.overInvoiced > EPS || evenMatch(o)
}

/** Why Send is disabled on a fresh draft, or null when it is ready. */
export function sendBlocker(o: Order): string | null {
  if (!o.doc.counterparty) {
    return o.kind === 'sales' ? 'Choose a buyer to send this order.' : 'Choose a seller to send this order.'
  }
  if (o.doc.items.length === 0) return 'Add at least one product or service.'
  if (grandTotalOf(o.doc) <= EPS) return 'The order total must be above zero.'
  if (!sendable(o)) return 'There is nothing left to invoice on this order.'
  return null
}

export type SendPlan =
  | { kind: 'normal'; amount: number }
  | { kind: 'overpaid'; amount: number; already: number; over: number }
  | { kind: 'over-invoiced'; voidCount: number; correctedRemaining: number }
  | { kind: 'even-out'; paid: number; voidCount: number }

/**
 * What a send will actually do, so the confirmation can be assembled from it
 * rather than guessed at (§5.5).
 */
export function planSend(o: Order): SendPlan {
  const f = pendingFinance(o)
  if (evenMatch(o)) {
    return {
      kind: 'even-out',
      paid: f.paid,
      voidCount: o.invoices.filter((i) => i.status === 'Unpaid').length,
    }
  }
  if (f.overInvoiced > EPS && f.over <= EPS) {
    const voidable = o.invoices.filter((i) => i.status === 'Unpaid')
    const afterVoid = financeFor(
      { invoices: o.invoices.filter((i) => i.status !== 'Unpaid') },
      f.grand,
    )
    return {
      kind: 'over-invoiced',
      voidCount: voidable.length,
      correctedRemaining: afterVoid.remaining,
    }
  }
  if (f.over > EPS) {
    return { kind: 'overpaid', amount: 0, already: f.paid, over: f.over }
  }
  return { kind: 'normal', amount: f.remaining }
}

function nextInvoiceNo(o: Order): string {
  return `INV-${String(o.invoices.length + 1).padStart(3, '0')}`
}

/**
 * Every send raises an invoice; the invoice table is the audit trail and
 * nothing is rewritten retroactively (§5.5).
 *
 * `amount` overrides the payable for the normal case, where the user can set
 * the amount to invoice. It is ignored for the other cases, whose payable is
 * determined by the situation.
 */
export function sendOrder(o: Order, amount?: number): SendPlan {
  const plan = planSend(o)

  // A draft leaves Draft on its first send. `refreshStatus` deliberately never
  // derives *out* of Draft (§3.3), so the send is what has to say so — without
  // this a sent order keeps showing as a draft while carrying a live invoice.
  if (o.status === 'Draft') o.status = 'Invoiced'

  if (plan.kind === 'over-invoiced') {
    // Void the open invoices, commit, and let the caller reopen the amount
    // dialog at the corrected remaining.
    o.invoices.forEach((i) => {
      if (i.status === 'Unpaid') i.status = 'Void'
    })
    commitAdjustment(o)
    refreshStatus(o)
    return plan
  }

  commitAdjustment(o)

  if (plan.kind === 'even-out') {
    o.invoices.push({
      no: nextInvoiceNo(o),
      issued: now(),
      grand: o.grand,
      // Nothing is left to bill — the paid invoices already cover the adjusted
      // total. Answered in `docs/order-open-questions.md` Q1: issue the closing
      // invoice at zero and mark it Paid, so every send still raises an invoice
      // and the table stays a complete record of what was sent, without
      // restating an earlier invoice (§3.4).
      payable: 0,
      status: 'Paid',
      reminded: false,
    })
    completeOrder(o)
    return plan
  }

  const payable =
    plan.kind === 'overpaid' ? 0 : Math.max(0, amount ?? orderFinance(o).remaining)

  o.invoices.push({
    no: nextInvoiceNo(o),
    issued: now(),
    grand: o.grand,
    payable,
    status: plan.kind === 'overpaid' ? 'Overpaid' : 'Unpaid',
    reminded: false,
  })
  refreshStatus(o)
  return plan
}

/* ------------------------------------------------------------- row menus */

/**
 * One source for the row menu and the detail header, so the list can never
 * offer an action the order detail does not support (§4).
 */
export function actionsFor(o: Order): string[] {
  if (o.status === 'Draft') return ['Duplicate Draft', 'Delete Draft']

  const actions = ['Duplicate as Draft', 'Download All PDF']
  if (sendable(o)) actions.push('Send Order')
  if (o.status === 'Overpaid') actions.push('Set as Complete')
  // Cancel disappears once the order is closed, overpaid, or has taken money.
  if (o.status === 'Invoiced' && canCancel(o)) actions.push('Cancel Order')
  return actions
}

/**
 * Row actions for one invoice inside an order (§6).
 *
 * Answered in `docs/order-open-questions.md` Q7: purchase invoices gain **Void
 * Invoice** but deliberately not Mark as Paid. A buyer must not be able to
 * settle a seller's invoice by fiat — payment happens only at checkout — but an
 * invoice raised in error has to be retractable, or the order can never close.
 * The handover's §6 gave purchase invoices a download icon and nothing else.
 */
export function invoiceActionsFor(o: Order, inv: Invoice): string[] {
  const actions = ['Download PDF']
  // A closed invoice is history; a closed order is not up for editing.
  const settled = inv.status === 'Void' || inv.status === 'Paid'
  const closed = o.status === 'Completed' || o.status === 'Cancelled'
  if (settled || closed) return actions

  if (o.kind === 'sales') actions.push('Mark as Paid')
  actions.push('Void Invoice')
  return actions
}

/* ------------------------------------------------------- overpaid wording */

/** §5.4 — the cell note and banner follow the situation. */
export function overpaidWarning(o: Order): { cell: string; banner: string } | null {
  const f = pendingFinance(o)
  if (f.over > EPS) {
    return {
      cell: `Overpaid by ${formatIDR(f.over)}.`,
      banner: `This change results in an overpaid amount by ${formatIDR(f.over)}. Please review before proceeding.`,
    }
  }
  if (f.overInvoiced > EPS) {
    return {
      cell: `${formatIDR(f.overInvoiced)} more invoiced than this order is worth.`,
      banner: `This change brings the order total below the ${formatIDR(f.invoiced)} already invoiced, leaving ${formatIDR(f.overInvoiced)} over-invoiced.`,
    }
  }
  return null
}

/* ------------------------------------------------------------- factories */

export function emptyDoc(kind: OrderKind): OrderDoc {
  return {
    kind,
    counterparty: null,
    items: [],
    remarks: '',
    deliveryFee: 0,
    addDiscount: 0,
    addDiscountType: 'IDR',
    addTax: 'NO TAX',
  }
}

let seq = 0

/** Order numbers are `DDMMYY-0000001`. */
export function nextOrderNo(d = new Date()): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yy = String(d.getFullYear()).slice(2)
  seq += 1
  return `${dd}${mm}${yy}-${String(seq).padStart(7, '0')}`
}

export function newOrder(kind: OrderKind, createdBy: string): Order {
  return {
    no: nextOrderNo(),
    kind,
    status: 'Draft',
    grand: 0,
    doc: emptyDoc(kind),
    invoices: [],
    createdBy,
    billTo: '',
    updated: new Date().toISOString(),
    isNew: true,
  }
}

export function newItem(): LineItem {
  return {
    id: `li-${Math.random().toString(36).slice(2, 9)}`,
    sku: '',
    name: '',
    desc: '',
    qty: 1,
    uom: 'pcs',
    price: 0,
    discount: 0,
    discountType: '123',
    tax: 'NO TAX',
  }
}
