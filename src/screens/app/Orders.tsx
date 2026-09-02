import { useMemo, useState } from 'react'
import {
  Card,
  DataTable,
  EmptyState,
  FilterPill,
  NewChip,
  PageHeader,
  Pagination,
  Pill,
  Row,
  RowMenu,
  SectionLabel,
  Toolbar,
} from '../../components/app/Console'
import { cells } from '../../components/app/consoleUtils'
import { Button } from '../../components/ui/Button'
import { SelectField, TextAreaField, TextField } from '../../components/ui/Field'
import { Icon } from '../../components/ui/Icon'
import { ConsoleShell } from '../../layouts/ConsoleShell'
import {
  createOrder as co,
  filters,
  orderItems,
  purchaseOrders,
  salesOrders,
} from '../../data/appData'
import { useFlow } from '../../prototype/flowContext'
import { useSession } from '../../prototype/sessionContext'
import {
  formatIDR,
  grandTotalOf,
  newItem,
  newOrder,
  nextOrderNo,
  orderFinance,
  parseAmount,
  sendOrder,
  taxRate,
  type LineItem,
  type Order,
  type OrderKind,
} from '../../state/orders'
import { formatDayTime } from '../../state/settlements'

/**
 * Order list — Figma "Order List", node 4001:13925 (page "2. Order Management").
 * The sales and purchase lists are the same frame with a different party column,
 * so one component serves both.
 *
 * **The list starts empty** — `docs/order-open-questions.md` Q4. It is the
 * trainee's front door: the empty state carries the Create Order CTA, and rows
 * appear only once orders are actually created. Both demo users share the list,
 * so an order created by Sanders is visible to Dheana.
 */
function OrderList({
  kind,
  data,
  activeNav,
}: {
  kind: OrderKind
  data: typeof salesOrders | typeof purchaseOrders
  activeNav: string
}) {
  const { go } = useFlow()
  const { shared } = useSession()

  const rows = useMemo(
    () => shared.orders.filter((o) => o.kind === kind),
    [shared.orders, kind],
  )

  return (
    <ConsoleShell breadcrumb={data.breadcrumb} activeNav={activeNav}>
      <PageHeader title={data.title}>
        <Button variant="outline" onClick={() => go('order-report')}>
          <Icon name="file-check" className="size-4" />
          {data.buttons.report}
        </Button>
        <Button variant="outline">
          <Icon name="upload" className="size-4" />
          {data.buttons.upload}
        </Button>
        <Button onClick={() => go('order-new')}>{data.buttons.create}</Button>
      </PageHeader>

      <Toolbar searchPlaceholder={data.searchPlaceholder}>
        <FilterPill label={filters.allType} />
        <FilterPill label={filters.allStatus} />
        <FilterPill label={filters.newest} icon="filter" />
      </Toolbar>

      <Card padded={false}>
        <DataTable<Order>
          columns={data.columns}
          rows={rows}
          empty={
            <EmptyState
              title={data.emptyTitle}
              body={data.emptyBody}
              action={<Button onClick={() => go('order-new')}>{data.buttons.create}</Button>}
            />
          }
          render={(o, i) => {
            const f = orderFinance(o)
            const live = o.invoices.filter((inv) => inv.status !== 'Void').length
            return cells(
              `${i + 1}.`,
              <span className="flex items-center gap-s200 whitespace-nowrap">
                <span className="font-semibold">{o.no}</span>
                {o.isNew && <NewChip />}
              </span>,
              <span className="whitespace-nowrap">{o.createdBy}</span>,
              <span className="whitespace-nowrap">{o.billTo}</span>,
              <span className="whitespace-nowrap">{formatIDR(f.paid)}</span>,
              <span className="whitespace-nowrap">{formatIDR(o.grand)}</span>,
              live > 0 ? String(live) : '—',
              <span className="whitespace-nowrap">{formatDayTime(o.updated)}</span>,
              <Pill>{o.status}</Pill>,
              kind === 'purchase' && o.status === 'Invoiced' ? (
                <Button variant="outline" onClick={() => go('checkout')}>
                  Pay
                </Button>
              ) : (
                <RowMenu />
              ),
            )
          }}
          card={(o) => (
            <>
              <div className="mb-s200 flex items-center gap-s200">
                <span className="min-w-0 flex-1 truncate text-xs3 font-semibold">{o.no}</span>
                {o.isNew && <NewChip />}
                <Pill>{o.status}</Pill>
              </div>
              <Row label={data.columns[3]} value={o.billTo} />
              <Row label={data.columns[5]} value={formatIDR(o.grand)} strong />
              <Row label={data.columns[7]} value={formatDayTime(o.updated)} />
            </>
          )}
        />
        {rows.length > 0 && <Pagination noun={data.perPageNoun} />}
      </Card>
    </ConsoleShell>
  )
}

export function SalesOrders() {
  return <OrderList kind="sales" data={salesOrders} activeNav="sales-orders" />
}

export function PurchaseOrders() {
  return <OrderList kind="purchase" data={purchaseOrders} activeNav="purchase-orders" />
}

/** The design's sample basket, as real line items the totals can be computed from. */
function startingItems(): LineItem[] {
  return orderItems.map((it) => ({
    ...newItem(),
    sku: it.sku,
    name: it.product,
    qty: parseAmount(it.qty),
    price: parseAmount(it.price),
    discount: parseAmount(it.discount),
  }))
}

/**
 * Create Order — Figma "Create Sales Order", node 4001:11308.
 *
 * Writes a real order into the shared store, because Q4 makes the list start
 * empty: a create flow that added nothing would leave the prototype permanently
 * empty with no way in.
 *
 * This is the existing layout wired to `state/orders.ts`, not the §5 rebuild —
 * the Product & Service table, auto-save and the send dialogs are still to come.
 */
export function CreateOrder() {
  const { go } = useFlow()
  const { user, addOrder } = useSession()
  const [customer, setCustomer] = useState('')
  const [items, setItems] = useState<LineItem[]>(startingItems)
  const [sent, setSent] = useState(false)
  const [orderNo] = useState(() => nextOrderNo())

  /** The working document, so totals come from the same maths the model uses. */
  const doc = useMemo(
    () => ({
      kind: 'sales' as const,
      counterparty: customer || null,
      items,
      remarks: '',
      deliveryFee: 0,
      addDiscount: 0,
      addDiscountType: 'IDR' as const,
      // Matches the summary's "Tax (11%)" line in the frame.
      addTax: 'PPN 11%',
    }),
    [customer, items],
  )

  const subtotal = items.reduce((n, it) => n + it.qty * it.price, 0)
  const discount = items.reduce(
    (n, it) => n + (it.discountType === '%' ? (it.qty * it.price * it.discount) / 100 : it.discount),
    0,
  )
  const total = grandTotalOf(doc)
  const tax = total - (subtotal - discount)

  function build(): Order {
    const o = newOrder('sales', user?.name ?? 'Sanders')
    o.no = orderNo
    o.doc = doc
    o.billTo = customer
    return o
  }

  function saveDraft() {
    addOrder(build())
    go('sales-orders')
  }

  function send() {
    const o = build()
    // Commits the adjustment and raises the first invoice (§5.5).
    sendOrder(o)
    addOrder(o)
    setSent(true)
  }

  const blocked = !customer || items.length === 0

  if (sent) {
    return (
      <ConsoleShell breadcrumb={co.breadcrumb} back="sales-orders" activeNav="sales-orders">
        <Card className="mx-auto max-w-[520px] text-center">
          <span className="mx-auto mb-s300 grid size-12 place-items-center rounded-full bg-success-bg text-success">
            <Icon name="check" strokeWidth={2.4} className="size-6" />
          </span>
          <h2 className="text-md font-bold text-text-primary">{co.sentTitle}</h2>
          <p className="mt-s200 text-xs3 text-text-secondary">{co.sentBody}</p>
          <div className="mt-s400 flex justify-center gap-s200">
            <Button variant="outline" onClick={() => go('order-new')}>
              {co.title}
            </Button>
            <Button onClick={() => go('sales-orders')}>{co.sentCta}</Button>
          </div>
        </Card>
      </ConsoleShell>
    )
  }

  return (
    <ConsoleShell breadcrumb={co.breadcrumb} back="sales-orders" activeNav="sales-orders">
      <PageHeader title={co.title}>
        <Button variant="ghost" onClick={() => go('sales-orders')}>
          {co.cancel}
        </Button>
        <Button variant="outline" onClick={saveDraft}>
          {co.saveDraft}
        </Button>
        <Button onClick={send} disabled={blocked}>
          {co.submit}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-s300 xl:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-s300">
          <Card>
            <SectionLabel>{co.sections.party}</SectionLabel>
            <div className="grid grid-cols-1 gap-s300 sm:grid-cols-2">
              <SelectField
                name="customer"
                label={co.customerLabel}
                help={co.customerHelp}
                placeholder={co.customerPlaceholder}
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                options={co.customers.map((c) => ({ value: c, label: c }))}
                required
              />
              <TextField name="orderNo" label={co.orderNoLabel} value={orderNo} readOnly />
              <TextField
                name="orderDate"
                type="date"
                label={co.orderDateLabel}
                defaultValue={co.orderDate}
              />
              <TextField
                name="dueDate"
                type="date"
                label={co.dueDateLabel}
                defaultValue={co.dueDate}
              />
              <TextField
                name="currency"
                label={co.currencyLabel}
                defaultValue={co.currency}
                readOnly
              />
              <TextField
                name="reference"
                label={co.referenceLabel}
                placeholder={co.referencePlaceholder}
              />
            </div>
          </Card>

          <Card padded={false}>
            <div className="flex items-center gap-s200 p-s300 pb-s200">
              <SectionLabel>{co.sections.items}</SectionLabel>
              <div className="mb-s200 ml-auto">
                <Button variant="outline" onClick={() => setItems((v) => [...v, newItem()])}>
                  <Icon name="plus" className="size-4" />
                  {co.addItem}
                </Button>
              </div>
            </div>

            <DataTable<LineItem>
              columns={co.itemColumns}
              rows={items}
              empty={<EmptyState title="No items yet" body="Add a product to price this order." />}
              render={(it, i) => cells(
                `${i + 1}.`,
                <span>
                  <span className="block font-semibold">{it.name || 'New item'}</span>
                  <span className="block text-xs4 text-neutral-500">{it.sku || '—'}</span>
                </span>,
                it.qty,
                <span className="whitespace-nowrap">{formatIDR(it.price)}</span>,
                <span className="whitespace-nowrap">{formatIDR(it.discount)}</span>,
                <span className="font-semibold whitespace-nowrap">
                  {formatIDR(Math.max(0, it.qty * it.price - it.discount) * (1 + taxRate(it.tax)))}
                </span>,
                <button
                  type="button"
                  aria-label={`Remove ${it.name || 'item'}`}
                  onClick={() => setItems((v) => v.filter((r) => r.id !== it.id))}
                  className="grid size-8 place-items-center rounded-s200 text-neutral-500 hover:bg-neutral-100"
                >
                  <Icon name="trash" className="size-4" />
                </button>
              )}
              card={(it) => (
                <>
                  <p className="text-xs3 font-semibold">{it.name || 'New item'}</p>
                  <p className="mb-s200 text-xs4 text-neutral-500">{it.sku || '—'}</p>
                  <Row label={co.itemColumns[2]} value={String(it.qty)} />
                  <Row label={co.itemColumns[3]} value={formatIDR(it.price)} />
                  <Row
                    label={co.itemColumns[5]}
                    value={formatIDR(Math.max(0, it.qty * it.price - it.discount))}
                    strong
                  />
                </>
              )}
            />
          </Card>

          <Card>
            <TextAreaField
              name="notes"
              label={co.notesLabel}
              placeholder={co.notesPlaceholder}
              rows={3}
            />
          </Card>
        </div>

        <Card className="h-fit">
          <SectionLabel>{co.sections.summary}</SectionLabel>
          <Row label={co.summary.subtotal} value={formatIDR(subtotal)} />
          <Row label={co.summary.discount} value={formatIDR(discount)} />
          <Row label={co.summary.tax} value={formatIDR(tax)} />
          <div className="mt-s200 border-t border-neutral-200 pt-s200">
            <Row label={co.summary.total} value={formatIDR(total)} strong />
          </div>
          <div className="mt-s300 flex flex-col gap-s200">
            <Button onClick={send} disabled={blocked}>
              {co.submit}
            </Button>
            <Button variant="outline" onClick={saveDraft}>
              {co.saveDraft}
            </Button>
          </div>
          {blocked && (
            <p className="mt-s200 text-xs4 text-text-secondary">
              {!customer ? 'Choose a buyer to send this order.' : 'Add at least one product or service.'}
            </p>
          )}
        </Card>
      </div>
    </ConsoleShell>
  )
}
