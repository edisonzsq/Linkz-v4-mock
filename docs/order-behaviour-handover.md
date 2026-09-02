<!--
  Received from Edison as the developer handover for the Order module.
  Stored verbatim except for the note below and the corrected Order Report
  node IDs in §9.

  FIGMA FILE KEY — every node ID in this document resolves in
  `eX8Lc53tVFuY2QEDW4t1QT` (V.4 Compilation (Edison)):
      https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=<node>
  Replace the `:` in a node ID with `-` in the URL, e.g. 4001:13592 -> 4001-13592.
-->

# Order module — behaviour handover

Specification for the Sales Order, Purchase Order and Order Report behaviour agreed in
prototype, written to be implemented in **`edisonzsq/Linkz-v4-landing-mock`** (the doc as received
named `Linkz-v4-mock`; this repo is the landing-mock).

**Reference prototype:** the behaviour described here is running and clickable. Walk it
before implementing — every rule below is observable there.

> This document specifies **behaviour and state**, not markup. Layout is already settled
> by the Figma frames cited per section; where the prototype and this repo differ visually,
> the Figma wins.

---

## 1. What this changes

The repo today is a **presentational mock**: `src/data/appData.ts` holds static rows,
`OrderList` renders them, and `CreateOrder` has a single `sent` boolean. There is no
concept of an invoice, no money model, and no state that survives a click.

This spec adds the **domain model underneath those screens**. The bulk of the work is not
UI — it is the order/invoice state machine in section 3, which every screen then reads.

| Area | Today | After |
| --- | --- | --- |
| Order list | Static rows, `RowMenu` is decorative | Rows from state; row menu mirrors each order's available actions |
| Create order | Generic form (order date, due date, currency, reference) | Figma layout: Buyer/Your Info, Product & Service, Remarks, Payment Details |
| Order detail | Does not exist | Editable after send; invoice table; adjustment flow |
| Invoices | Do not exist | First-class: issued per send, paid/voided, drive order status |
| Checkout | Static screen | Reached from a purchase invoice; settles it |
| Order Report | `NotBuilt` placeholder | Settlement + Payments tables with date-range filter |

---

## 2. Domain model

Suggested shapes. Names are the ones used throughout this document.

```ts
type OrderKind = 'sales' | 'purchase'
type OrderStatus = 'Draft' | 'Invoiced' | 'Overpaid' | 'Completed' | 'Cancelled'
type InvoiceStatus = 'Unpaid' | 'Paid' | 'Void' | 'Overpaid'

type LineItem = {
  sku: string; name: string; desc: string
  qty: number; uom: string; price: number
  discount: number; discountType: '123' | '%'   // nominal | percent
  tax: string                                    // 'NO TAX' | 'PPN 11%' | 'PPN 12%'
  touched?: boolean                              // edited this session — drives the warning highlight
}

type OrderDoc = {                 // the working document; what the form edits
  kind: OrderKind
  counterparty: Contact | null    // buyer on a sales order, seller on a purchase order
  items: LineItem[]
  remarks: string
  deliveryFee: number
  addDiscount: number; addDiscountType: '%' | 'IDR'
  addTax: string
}

type Invoice = {
  no: string                      // INV-001, INV-002 … per order
  issued: Date
  grand: number                   // ORDER TOTAL AT ISSUE — immutable, see §3.4
  payable: number
  status: InvoiceStatus
  reminded: boolean
}

type Order = {
  no: string                      // DDMMYY-0000001
  kind: OrderKind
  status: OrderStatus
  grand: number                   // COMMITTED total — only a send moves this, see §3.2
  doc: OrderDoc                   // the editable document
  invoices: Invoice[]
  createdBy: string; billTo: string
  updated: Date
  isNew: boolean
}
```

**Line total**
```
rowSubtotal = qty × price
rowDiscount = discountType === '%' ? rowSubtotal × discount/100 : discount
rowTotal    = max(0, rowSubtotal − rowDiscount) × (1 + taxRate)
```

**Order total** (drives the Payment Details panel)
```
subtotal    = Σ rowTotal
beforeDisc  = subtotal + deliveryFee
disc        = addDiscountType === '%' ? beforeDisc × addDiscount/100 : addDiscount
grandTotal  = max(0, beforeDisc − disc) × (1 + addTaxRate)
```

---

## 3. The money model

This is the core. Everything else reads from it.

### 3.1 Derived figures

```ts
function financeFor(order, grand) {
  const paid     = sum(order.invoices.filter(i => i.status === 'Paid').map(i => i.payable))
  const invoiced = sum(order.invoices.filter(i => i.status !== 'Void').map(i => i.payable))
  return {
    grand, paid, invoiced,
    remaining:    Math.max(0, grand - invoiced),   // still billable
    over:         Math.max(0, paid - grand),       // collected beyond the order — OVERPAID
    overInvoiced: Math.max(0, invoiced - grand),   // billed beyond the order
  }
}
```

`remaining` subtracts **every live invoice, paid or not** — an open unpaid invoice already
claims its share of the order. Raising the order total increases what can be invoiced, less
whatever is already outstanding.

`over` and `overInvoiced` are distinct and both matter. `over` is money actually collected
above the order value; `overInvoiced` catches the case where the excess has been billed but
not yet paid. `over > 0` implies `overInvoiced > 0`, never the reverse.

### 3.2 Committed vs pending — the rule that is easiest to get wrong

**Editing a sent order does not change what the order is.** The edits only take effect when
the adjustment is **sent**.

```ts
orderFinance(o)   = financeFor(o, o.grand)                 // committed — as last sent
pendingFinance(o) = financeFor(o, grandTotalOf(o.doc))     // what a send would make it

function commitAdjustment(o) {        // called ONLY from a send
  o.grand   = grandTotalOf(o.doc)
  o.updated = new Date()
}
```

| Reads **committed** | Reads **pending** |
| --- | --- |
| Order status and completion | The overpaid / over-invoiced warnings |
| The order list row (total, status) | Send Order enabled state |
| `Set as Complete` visibility | Amount to Invoice / Amount to Pay dialog |
| | Payment Details panel (live preview as you type) |

Getting this wrong produces a specific bug: reduce a 5m order with a paid 3m invoice down to
3m, mark the invoice paid, and the order silently **completes without ever being sent**.
It also contradicts the Figma, where an in-progress edit (`4001:16261`) shows only a warning
and **no** `Set as Complete`, and the committed overpaid state (`4001:16370`) shows both.

### 3.3 Status derivation

Order statuses are exactly five — **`Draft` · `Invoiced` · `Overpaid` · `Completed` ·
`Cancelled`** (Figma `4001:14291`). There is no `Partially Paid` and no `Paid` at order
level; a part-paid order stays **`Invoiced`**.

```ts
function refreshStatus(o) {
  if (['Draft', 'Completed', 'Cancelled'].includes(o.status)) return   // set deliberately
  o.status = orderFinance(o).over > EPS ? 'Overpaid' : 'Invoiced'
}
```

Use an epsilon (`EPS = 0.005`) for every money comparison.

### 3.4 Invoices are immutable history

An invoice row records the state **at the moment it was issued** and never changes
afterwards, except for its `status`. In particular `invoice.grand` is the order total at
issue — it must **not** follow later edits to the order.

The Figma shows this directly: in `4001:16370`, INV-001 reads `IDR 5.000.000` while the
order itself is now `IDR 2.000.000`.

### 3.5 Completion — one path only

```ts
function completeOrder(o) {
  o.invoices.filter(i => i.status === 'Unpaid').forEach(i => { i.status = 'Void' })
  o.status = 'Completed'
  o.updated = new Date()
}
```

**A completed order can never hold an open invoice** — a closed order must not still be
asking the other party for money. Route every completion through this one function so the
invariant cannot drift.

Three routes reach it:

1. **Marking the last invoice paid** — when `!anyUnpaid && remaining ≤ 0 && over ≤ 0`.
2. **`Set as Complete`** — accepting an overpayment (§5.4).
3. **Even-out send** — adjusting the order to match what was paid (§5.5).

A **Completed** order is terminal: every section becomes read-only.

---

## 4. Order list

Figma `4001:13592` (sales) / `4001:13799` (purchase).

- Starts **empty**; the empty state is the front door with a single **Create Order** CTA.
  There is no Download Template or Upload Order button.

  > **Confirmed — `docs/order-answers.md` Q4**, against the alternative of seeding the list
  > for training. The knock-on is accepted and intended: the Dashboard's order counts and the
  > Finance figures keep their own illustrative values and **do not reconcile against this
  > list**. Say so in a training session before someone reports it as a bug.
- Sales and purchase keep **separate lists** — filter by `kind`.
- Sales has Search / Type / Status / Sort; **purchase has no Type filter**.
- Status filter options are the five order statuses.
- Pagination: chevrons **disabled when there is nowhere to go**; row numbering continues
  across pages; rows-per-page works.

### Row menu mirrors the header CTAs

Derive both from one function so the list can never offer an action the order detail
doesn't support.

| Status | Menu |
| --- | --- |
| Draft | Duplicate Draft · Delete Draft |
| Invoiced | Duplicate as Draft · Download All PDF · Send Order · Cancel Order |
| Overpaid | Duplicate as Draft · Download All PDF · Send Order · **Set as Complete** |
| Completed | Duplicate as Draft · Download All PDF |
| Cancelled | Duplicate as Draft · Download All PDF |

`Cancel Order` disappears once the order is **closed or overpaid** — matching both overpaid
frames. `Send Order` appears only when `sendable` (§5.1).

Clicking a **Draft** row reopens it in the editor; any other row opens the order detail.

---

## 5. Create / edit order

Figma `4001:11308` (sales), `4001:11452` (purchase).

**Layout** — full-bleed sections on white, **not** a card: 24px side padding with inset
hairline dividers between Parties / Product & Service / Summary. The `Order Info` bar
(`4001:11956`) is **sticky** directly under the nav bar so the CTAs stay reachable.

**Sales vs purchase** is the same screen with the roles swapped:

| | Sales | Purchase |
| --- | --- | --- |
| Chip | green "Sales Order" | amber "Purchase Order" |
| Columns | Buyer left, You right | **You left, Seller right** |
| Counterparty extras | Buyer's Due (limit, outstanding) | Seller's **bank details** |
| Your Info | includes your bank | no bank — you are paying |

### 5.1 Send Order gating

```ts
sendable(o) = f.remaining > EPS || f.over > EPS || f.overInvoiced > EPS || evenMatch(o)
evenMatch(o) = f.paid > EPS && |f.grand − f.paid| ≤ EPS && f.remaining ≤ EPS
```
…all against **pending** figures. On a new draft, Send requires a counterparty, at least one
line item, and a grand total above zero; the disabled button explains which is missing.

### 5.2 Product & Service table

- Name / **SKU** / description are three stacked editable fields in one column
  (`4001:11951`). Enter moves down through them; Shift+Enter is a newline in the description.
- Picking from the catalogue fills all three; typing a name that isn't in the catalogue
  offers **Add "…" as a new item**. There is **no** standing "New Product or Service" button.
- Row menu (`4001:14176`): **Add to Master Product** · **Duplicate** (inserts an identical
  row below). The delete icon is **red at rest**.
- The table must not clip its own dropdowns — see §8.2.
- **Rows stay editable after the order is sent**, until it is Completed or Cancelled.
  Only **Buyer/Seller Info** locks on send.

### 5.3 Auto-save

The order is written to the list as a **Draft** as soon as there is anything worth keeping
(a counterparty, a product name, remarks, any amount) and updated in place thereafter.
**Save as Draft saves unconditionally**, even with nothing filled in. Sending converts that
same draft rather than creating a duplicate.

**Delete Draft** confirms first when anything has been entered.

### 5.4 Overpaid flow

Figma `4001:16261` (editing) → `4001:16370` (committed) → `4001:16646` (completed).

Overpaid arises only by **reducing an order after money has been collected**.

**While editing** — the affected rows' Total cell highlights amber with an inline note, and
a banner sits above the product table. Both are **live**: they recompute on every keystroke
and clear the moment the change is undone. Wording follows the situation:

| Condition | Cell note | Banner |
| --- | --- | --- |
| `over > 0` | `Overpaid by IDR X.` | `This change results in an overpaid amount by X. Please review before proceeding.` |
| `overInvoiced > 0` only | `IDR X more invoiced than this order is worth.` | `This change brings the order total below the X already invoiced, leaving Y over-invoiced.` |

Only rows **actually edited this session** highlight. Adding an empty row does **not**
highlight it — it flags once something is entered that moves the total.

**Once committed** (i.e. sent) the order becomes `Overpaid`: the mid-edit banner gives way
to a top banner — *"This order is overpaid by X. Please reconcile the excess payment outside
of LINKZ."* — `Set as Complete` appears and `Cancel Order` disappears.

**Set as Complete** accepts the excess and closes the order. Confirm first, stating the
overpaid figure and how many open invoices will be voided. The banner afterwards reads
*"…and is now marked as complete."*

### 5.5 Send Order — dialogs and consequences

**Every Send raises an invoice.** The invoice table is the audit trail; nothing is rewritten
retroactively.

Assemble one confirmation from what the send will actually do:

| Situation | Dialog | Effect |
| --- | --- | --- |
| Normal | *Amount to Invoice* (sales) / *Amount to Pay* (purchase) | New invoice, `Unpaid` |
| Overpaid | Same dialog, `Already Paid` row, remaining `IDR 0,00`, amber *"Sending this order will create an overpayment…"* | New invoice, payable `0`, status `Overpaid` |
| Over-invoiced | **"Void Open Invoice?"** — *N open invoice(s) exceed the order total and will be voided* | Voids them, commits the adjustment, reopens the amount dialog at the corrected remaining |
| Even-out | **"Complete Order?"** (`4001:14990`) — *Sending this order will match the paid amount and automatically mark it as complete*, plus the voiding sentence when applicable | Commits, issues a closing invoice marked `Paid`, completes |

**Amount to Pay** (purchase, `4001:10618`) relabels the summary rows: *Already Paid* /
*Remaining to Pay* / *Set Amount to Pay*.

> **Answered — `docs/order-answers.md` Q1.** On an even-out send the closing invoice is
> raised at **IDR 0,00, with status Paid**, and the order is completed. Making it non-zero
> would mean restating the earlier invoice, which §3.4 forbids. Every send still raises an
> invoice, so the table stays a complete record of what was sent.

---

## 6. Order detail

Adds an **Invoice** section above the parties.

Columns: No. · Invoice No. · Issue Date · Grand Total Amount · Payable Amount · Status ·
*(payment column)*.

| | Sales | Purchase |
| --- | --- | --- |
| Last column | `Payment Link` → **Send Reminder** | `Payment` → **Make Payment** |
| Row actions | ⋮ menu: Download PDF · Mark as Paid · Void Invoice | ~~download icon only (no menu)~~ Download PDF · **Void Invoice** |

> **Superseded — `docs/order-answers.md` Q7.** Purchase invoices also get **Void Invoice**,
> though still no Mark as Paid: a buyer must not settle a seller's invoice by fiat, but an
> invoice raised in error has to be retractable or the order can never be closed.
> Implemented by `invoiceActionsFor()` in `src/state/orders.ts`.

**When a menu would hold only Download, render the icon directly** instead of a one-item
menu — that is why settled sales invoices also show the bare icon.

- **Mark as Paid** confirms, stating whether it will complete the order.
- **Void Invoice** confirms; the order stays open and can be re-invoiced. A sent order must
  **never** fall back to `Draft` when its invoices are voided.
- **Make Payment** (purchase) opens Checkout — §7.

**Header CTAs:** Cancel Order · Duplicate as Draft · All PDF · Send Order, becoming
`Order Completed ✓` (green) or `Order Cancelled ⊘` (red) once closed. **Duplicate as Draft**
creates a separate Draft copy and leaves the original untouched.

**Cancel Order** confirms (`4001:14986`), voids open invoices and locks the order
(`4001:16814`).

> **Narrowed — `docs/order-answers.md` Q8.** An order that already has a **paid** invoice
> against it **cannot be cancelled** at all; the way out of it is completion. `canCancel()`
> gates this and `cancelOrder()` refuses when it is false, so the row menu and the header
> CTA cannot disagree.

**Completed / Cancelled:** every field `disabled` (not read-only) so values still show but
grey out — including Remarks and the Payment Details inputs.

---

## 7. Checkout (purchase orders)

Figma `4001:18102`. Reached from **Make Payment** on a purchase invoice.
Breadcrumb: *Purchase Order / Order Details / Checkout*.

- **Shipping Destination** (your company) with New Address / Change Address
- **Payment Method** — accordion: Cards Payment (BRI, Local Cards, Foreign Cards), QRIS,
  Bank Transfer (virtual accounts), Offline Payment
- **Seller Information** and **Order Summary** (line items, subtotal, delivery, discount,
  taxes, Payable Amount)
- Sticky footer: total + **Proceed Payment**, disabled until a method is chosen

Proceeding settles that invoice through the same path as Mark as Paid, so the completion
rules in §3.5 apply unchanged.

---

## 8. Cross-cutting behaviours

### 8.1 Money parsing — the bug worth reading twice

Indonesian format: `.` groups thousands, `,` is the decimal mark.

```ts
function parseAmount(v: string): number {
  let s = String(v ?? '').trim().replace(/[^\d.,-]/g, '')
  if (!s) return 0
  const neg = s.startsWith('-')
  s = s.replace(/-/g, '').replace(/\./g, '').replace(',', '.')   // strip ALL dots
  const n = parseFloat(s)
  return isNaN(n) ? 0 : (neg ? -n : n)
}
```

Treating a **single** dot as a decimal point makes `"500.000"` parse as **500**, while
`"1.000.000"` parses correctly — so it looks intermittent. It corrupts the invoice payable
and the paid amount together.

The **Amount to Invoice / Amount to Pay** field formats as you type (`1500000` → `1.500.000`)
and keeps the caret in place relative to the surrounding digits.

### 8.2 Dropdowns and menus must not be clipped

The product picker and row menus render in a **body-level layer positioned with fixed
coordinates**, not inside the table. Keeping them in-flow forces the table to stay wide,
because any `overflow` on an ancestor clips them.

Consequences to handle:
- Dismiss on page scroll and resize — **but ignore scroll events originating inside the
  dropdown or menu**, otherwise the product list closes the moment the user scrolls it.
- Exclude the layer from the outside-click handler, or a click on a menu item dismisses it
  before it registers.

### 8.3 Re-render safety

Two bugs worth avoiding whatever the implementation:

- **Uncommitted input must live in state, not only in the DOM.** Typed text held only in
  the input is destroyed by any re-render — Add Row, Duplicate, a totals refresh.
- **A teardown blur must not commit.** Replacing the DOM blurs the focused field, firing its
  commit handler with a stale value — which silently wipes a product just picked from the
  dropdown. Guard field writes while a render is in progress.

React with controlled inputs avoids both by construction; noted so they aren't reintroduced.

### 8.4 Confirmation dialogs

Amber `!` icon, title, body, two buttons (`4001:14986`). **Which button carries the action
varies** — Cancel Order puts the destructive choice on the outline button; Complete Order
puts the confirming choice on the green one. Support both slots.

### 8.5 Buttons

Secondary outline buttons are **green** (`#499873` border and text) — Duplicate Draft, Save
as Draft, All PDF, Change Address. Grey means **disabled** only. Red outline is reserved for
Delete Draft and Cancel Order.

### 8.6 Add New Contact

Two-pane modal (`4001:14992`). The side nav **scrolls the form** to Basic Information /
Other Information, and scrolling the form moves the highlight back — they stay in step.
Shared by both modules: a contact is a buyer on a sales order and a seller on a purchase
order.

---

## 9. Order Report

Figma `7017:1308` (Settlement), `7017:1508` (Payments), `7017:1350` (date picker open).

> The node IDs originally cited here (`4072:*`) do not exist in
> `eX8Lc53tVFuY2QEDW4t1QT`; the Order Report was added later under section
> `7017:1065`. The IDs above are the live ones and are what this repo was built
> against.
Built — `src/screens/app/OrderReport.tsx`, rows in `src/state/settlements.ts`.

> **Three rulings apply here (`docs/order-answers.md`).**
> **Q2** — four status chips, not the five in the designer's note; the two "pending"
> conditions are one and the same to the user.
> **Q3b** — a settlement row is created **Pending** and is only moved to Settled by a LINKZ
> admin, which this prototype has no panel for; `Settled` therefore appears only on seeded
> rows, and `newSettlementRow()` offers no way to construct one.
> **Q6** — the date range **filters for real**, and the sample rows are seeded relative to
> today so "Last 7 days" is never empty.

Header: title + **Export as .XLSX**. Tabs: **Settlement** | **Payments**.
Toolbar: date-range picker (left), Status filter and Descending/Ascending sort (right).

**The two tables are shaped differently — Payments is not a relabelled Settlement.**

| | Settlement | Payments |
| --- | --- | --- |
| Columns | Payment Success Date · Order Number · Customer · Payment Method · Settlement Amount · Status | No. · Order Number · Invoice Number · Paid to · Payment Date · Amount Paid · Payment Method |
| Grouping | **By day**, header row per day with `Total: IDR X` and `N orders` | **None** — flat numbered ledger |
| Status column | Yes — Settled / Pending / Charge Back / Cancelled | **No** |
| Pager noun | "order per page" | "payment per page" |

Recommend feeding both from real activity: settling a sales invoice writes a Settlement row;
paying a purchase invoice writes a Payment row carrying the method chosen at checkout. That
makes the report a genuine record of what the user did.

### Date range picker

Presets **Today / Yesterday / Last 7 days / Custom** down the left; month calendar with
‹ › navigation, weeks starting **Monday**; range selection renders both ends solid green with
the days between tinted; From / To fields; **Cancel** and **Apply**.

Three rules:

1. **Nothing below the picker changes until Apply.** Keep the in-progress choice in separate
   pending state; Apply is the only thing that moves the applied range. Cancel discards it.
2. **Typing in From / To switches the preset to Custom** — without stealing focus mid-entry.
3. **The fields stay in `dd/mm/yyyy`** — slashes inserted as you type, digits only, capped at
   8. Validate properly on commit (reject `31/02`), jump the calendar to that month, and swap
   From/To if they are entered inverted.

---

## 10. Landing this in the repo

Existing primitives cover most of it — `Card`, `DataTable`, `EmptyState`, `Pill`, `TabBar`,
`Pagination`, `RowMenu`, `PageHeader`, `Toolbar`, `Modal` (`components/ui/Misc.tsx`).

| File | Change |
| --- | --- |
| `src/data/appData.ts` | Orders become seed data for state, not the render source. Add contacts (with bank details), catalogue, payment methods |
| **new** `src/state/orders.ts` | §2–3: the model, `financeFor`, `pendingFinance`, `commitAdjustment`, `refreshStatus`, `completeOrder`, send handlers. **Build and test this first** |
| `src/screens/app/Orders.tsx` | List reads state; row menu from §4; `CreateOrder` rebuilt to the Figma layout |
| **new** `src/screens/app/OrderDetail.tsx` | §6 — invoice table, editable-after-send, adjustment flow |
| `src/screens/app/Checkout.tsx` | Wire to an invoice; Proceed Payment settles it (§7) |
| **new** `src/screens/app/OrderReport.tsx` | §9, replacing `NotBuilt` |
| `src/components/app/consoleUtils.ts` | `statusTone`: add `Overpaid` → warning, `Void` → neutral, `Charge Back` → info; **remove** `Sent` |
| `src/prototype/screens.ts` | Add `order-detail`; move `order-report` out of "Not built" |
| `src/components/app/Console.tsx` | Date-range picker; day-group row for Settlement |

**Suggested order of work** — ① state module with unit tests for §3 → ② order detail
(invoices, mark paid, void) → ③ create/edit + send dialogs → ④ overpaid flow → ⑤ list + row
menus → ⑥ checkout → ⑦ Order Report.

### Worth unit-testing

The rules that cost the most to get wrong:

- Partial payment leaves the order **Invoiced**, never Completed
- Editing a sent order does **not** change `order.grand` until a send (§3.2)
- `invoice.grand` never changes after issue (§3.4)
- No Completed order holds an `Unpaid` invoice — across all three completion routes
- `remaining` subtracts open unpaid invoices
- `parseAmount('500.000') === 500000`
