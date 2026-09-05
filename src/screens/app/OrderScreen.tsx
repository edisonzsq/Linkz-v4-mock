import { useState } from 'react'
import { Card, Pagination, Pill } from '../../components/app/Console'
import { Button } from '../../components/ui/Button'
import { SelectField, TextField } from '../../components/ui/Field'
import { Icon } from '../../components/ui/Icon'
import { ConfirmDialog } from '../../components/ui/Misc'
import { ConsoleShell } from '../../layouts/ConsoleShell'
import { createOrder as co, orderScreen as os } from '../../data/appData'
import { useFlow } from '../../prototype/flowContext'
import { useSession } from '../../prototype/sessionContext'
import {
  actionsFor,
  cancelOrder,
  formatAmount,
  formatIDR,
  grandTotalOf,
  invoiceActionsFor,
  markInvoicePaid,
  newItem,
  newOrder,
  orderFinance,
  parseAmount,
  planSend,
  rowTotal,
  sendBlocker,
  sendOrder,
  voidInvoice,
  type LineItem,
  type Order,
  type OrderDoc,
} from '../../state/orders'
import { formatDayTime } from '../../state/settlements'

/**
 * Create Order and Order Detail — Figma `4001:11308` and `4001:12967`
 * (file `I7UK2KGWw5dRDEhcXaqFGC`).
 *
 * One component, because the frames are one screen: the detail view adds the
 * Invoice section above the parties and swaps the draft actions for the sent
 * ones. Every rule it enforces lives in `state/orders.ts` — nothing about
 * money, status or which actions are legal is decided here.
 */
export function OrderScreen({ mode }: { mode: 'create' | 'detail' }) {
  const { go, state, set } = useFlow()
  const { user, shared, addOrder, updateOrder } = useSession()
  const detail = mode === 'detail'

  const stored = shared.orders.find((o) => o.no === state.viewingOrder) ?? null

  /** A create-mode draft lives here until it is saved or sent. */
  const [draft, setDraft] = useState<Order>(() => {
    const o = newOrder('sales', user?.name ?? 'Sanders')
    o.doc.items = [newItem()]
    return o
  })

  const order = detail ? stored : draft
  const [confirmSend, setConfirmSend] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [reminded, setReminded] = useState<string[]>([])

  /** Edits go to the store in detail mode and to local state while drafting. */
  function edit(mutate: (o: Order) => void) {
    if (detail && stored) updateOrder(stored.no, mutate)
    else
      setDraft((prev) => {
        const next = structuredClone(prev)
        mutate(next)
        return next
      })
  }

  const doc: OrderDoc | null = order?.doc ?? null
  const pendingTotal = doc ? grandTotalOf(doc) : 0
  const finance = order ? orderFinance(order) : null

  const blocker = order ? sendBlocker(order) : 'No order loaded.'
  // Not memoised: the order is mutated in place by the transitions, so a
  // dependency-keyed cache would hand back a stale plan.
  const plan = order && !blocker ? planSend(order) : null

  if (!order || !doc) {
    return (
      <ConsoleShell breadcrumb={os.detailBreadcrumb} back="sales-orders" activeNav="sales-orders">
        <Card>
          <p className="text-xs3 text-text-secondary">
            That order is no longer in the list. Pick another from Sales Order.
          </p>
        </Card>
      </ConsoleShell>
    )
  }

  const isSales = order.kind === 'sales'
  const closed = order.status === 'Completed' || order.status === 'Cancelled'
  const menu = actionsFor(order)

  function updateItem(id: string, patch: Partial<LineItem>) {
    edit((o) => {
      const item = o.doc.items.find((i) => i.id === id)
      if (item) Object.assign(item, patch, { touched: true })
    })
  }

  function send() {
    edit((o) => {
      sendOrder(o)
    })
    if (!detail) {
      // Committing a draft moves it into the shared list, then opens it.
      const sent = structuredClone(draft)
      sendOrder(sent)
      addOrder(sent)
      set({ viewingOrder: sent.no })
      go('order-detail')
    }
    setConfirmSend(false)
  }

  return (
    <ConsoleShell
      breadcrumb={detail ? os.detailBreadcrumb : os.createBreadcrumb}
      back="sales-orders"
      activeNav={isSales ? 'sales-orders' : 'purchase-orders'}
    >
      {/* ------------------------------------------------- sticky order bar */}
      <div className="mb-s400 flex flex-wrap items-start gap-s300 border-b border-neutral-200 pb-s300">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-s200">
            <Pill tone={isSales ? 'success' : 'warning'}>
              {isSales ? os.salesChip : os.purchaseChip}
            </Pill>
            <h1 className="text-md font-bold text-text-primary">
              {os.orderNo}{' '}
              <span className={detail ? '' : 'text-neutral-300'}>
                {detail ? order.no : os.placeholderNo}
              </span>
            </h1>
          </div>
          <p className="mt-s100 text-xs4 text-text-secondary">
            {os.lastUpdated} <span className="font-semibold">{formatDayTime(order.updated)}</span>
          </p>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-s200">
          {detail ? (
            <>
              {menu.includes('Cancel Order') && (
                <Button variant="danger-outline" onClick={() => setConfirmCancel(true)}>
                  {os.cancelOrder}
                </Button>
              )}
              <Button variant="outline">{os.duplicateAsDraft}</Button>
              <Button variant="outline">
                <Icon name="save" className="size-4" />
                {os.allPdf}
              </Button>
            </>
          ) : (
            <>
              <Button variant="danger-outline" onClick={() => go('sales-orders')}>
                {os.deleteDraft}
              </Button>
              <Button variant="outline">{os.duplicateDraft}</Button>
              <Button
                variant="outline"
                onClick={() => {
                  addOrder(draft)
                  go('sales-orders')
                }}
              >
                {os.saveDraft}
              </Button>
            </>
          )}
          <Button onClick={() => setConfirmSend(true)} disabled={!!blocker || closed}>
            {os.sendOrder}
          </Button>
        </div>
      </div>

      {blocker && !closed && (
        <p className="mb-s300 text-xs4 text-text-secondary">{blocker}</p>
      )}

      {/* ------------------------------------------------------- invoices */}
      {detail && order.invoices.length > 0 && (
        <Section icon="file-check" title={os.invoiceSection}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-200">
                  {os.invoiceColumns.map((c) => (
                    <th
                      key={c}
                      scope="col"
                      className="px-s300 py-s200 text-xs3 font-bold whitespace-nowrap text-text-primary"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.invoices.map((inv, i) => {
                  const actions = invoiceActionsFor(order, inv)
                  return (
                    <tr key={inv.no} className="border-b border-neutral-200 last:border-0">
                      <td className="px-s300 py-s300 text-xs3">{i + 1}.</td>
                      <td className="px-s300 py-s300 text-xs3 font-semibold whitespace-nowrap">
                        {inv.no}
                      </td>
                      <td className="px-s300 py-s300 text-xs3 whitespace-nowrap">
                        {formatDayTime(inv.issued)}
                      </td>
                      <td className="px-s300 py-s300 text-xs3 whitespace-nowrap">
                        {formatIDR(inv.grand)}
                      </td>
                      <td className="px-s300 py-s300 text-xs3 whitespace-nowrap">
                        {formatIDR(inv.payable)}
                      </td>
                      <td className="px-s300 py-s300">
                        <Pill>{inv.status}</Pill>
                      </td>
                      <td className="px-s300 py-s300">
                        {inv.status === 'Unpaid' &&
                          (isSales ? (
                            <Button
                              onClick={() => setReminded((r) => [...new Set([...r, inv.no])])}
                            >
                              {reminded.includes(inv.no) ? os.reminderSent : os.sendReminder}
                            </Button>
                          ) : (
                            <Button onClick={() => go('checkout')}>{os.makePayment}</Button>
                          ))}
                      </td>
                      <td className="px-s300 py-s300">
                        {/* One action renders as a bare icon rather than a
                            one-item menu, as the frames do. */}
                        {actions.length === 1 ? (
                          <button
                            type="button"
                            aria-label={`${actions[0]} ${inv.no}`}
                            className="grid size-8 place-items-center rounded-s200 text-neutral-500 hover:bg-neutral-100"
                          >
                            <Icon name="save" className="size-4" />
                          </button>
                        ) : (
                          <InvoiceMenu
                            actions={actions}
                            onAction={(a) => {
                              if (a === 'Mark as Paid') edit((o) => markInvoicePaid(o, inv.no))
                              if (a === 'Void Invoice') edit((o) => voidInvoice(o, inv.no))
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Pagination noun={os.invoiceNoun} />
        </Section>
      )}

      {/* --------------------------------------------------------- parties */}
      <div className="grid grid-cols-1 gap-s400 lg:grid-cols-2">
        <div className="flex flex-col gap-s400 lg:border-r lg:border-neutral-200 lg:pr-s400">
          <Section icon="users" title={isSales ? os.buyerInfo : os.sellerInfo} required>
            {order.billTo ? (
              <Party
                company={order.billTo}
                name={co.customers.includes(order.billTo) ? 'Dheana Titaura' : '—'}
                phone="123456789"
                email="dheana@linkzasia.com"
                address={'Gg. Masjid Albarokah, Dusun Mudal, Karang Moko,\nSariharjo, Ngaglik, Sleman, DI Yogyakarta'}
                postal="55581"
              />
            ) : (
              <SelectField
                name="buyer"
                placeholder={isSales ? os.searchBuyer : os.searchSeller}
                value=""
                onChange={(e) =>
                  edit((o) => {
                    o.billTo = e.target.value
                    o.doc.counterparty = e.target.value
                  })
                }
                options={co.customers.map((c) => ({ value: c, label: c }))}
              />
            )}
          </Section>

          <Section icon="coins" title={os.buyersDue}>
            {order.billTo ? (
              <div className="flex flex-wrap items-start gap-s300">
                <div className="min-w-0 flex-1 text-xs3">
                  <Line label={os.outstandingLimit} value="IDR 1.000.000.000,00" />
                  <Line label={os.outstandingPayment} value="IDR 90.000.000,00" strong />
                </div>
                <Button variant="outline">
                  <Icon name="bell" className="size-4" />
                  {os.sendReminders}
                </Button>
              </div>
            ) : (
              <div className="rounded-s200 bg-neutral-50 p-s300">
                <p className="text-xs3 font-semibold text-text-primary">{os.noBuyerTitle}</p>
                <p className="mt-s100 text-xs4 text-text-secondary">{os.noBuyerBody}</p>
              </div>
            )}
          </Section>
        </div>

        <Section icon="building" title={os.yourInfo} required>
          <Party
            company={os.yourCompany.company}
            name={os.yourCompany.name}
            phone={os.yourCompany.phone}
            email={os.yourCompany.email}
            address={os.yourCompany.address}
            bank
          />
        </Section>
      </div>

      {/* ----------------------------------------------- product & service */}
      <div className="mt-s400">
        <Section icon="package" title={os.productSection} required>
          <div className="overflow-x-auto rounded-s200 border border-neutral-200">
            {/* Fixed layout with a colgroup: under auto layout the full-width
                inputs decide the column widths and push Total off the edge. */}
            <table className="w-full min-w-[1060px] table-fixed border-collapse text-left">
              <colgroup>
                {['44px', 'auto', '78px', '110px', '140px', '204px', '118px', '132px', '52px'].map(
                  (w, i) => (
                    <col key={i} style={{ width: w }} />
                  ),
                )}
              </colgroup>
              <thead>
                <tr className="border-b border-neutral-200">
                  {os.productColumns.map((c, i) => (
                    <th
                      key={c || i}
                      scope="col"
                      className={`px-s200 py-s200 text-xs3 font-bold whitespace-nowrap text-text-primary ${
                        c === 'Total' ? 'text-right' : ''
                      }`}
                    >
                      {c}
                      {['Product or Service Details', 'Quantity', 'Unit of Measure', 'Price', 'Tax'].includes(c) && (
                        <span className="text-danger">*</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {doc.items.map((it, i) => (
                  <tr key={it.id} className="border-b border-neutral-200 last:border-0 align-top">
                    <td className="px-s200 py-s300 text-xs3">{i + 1}.</td>
                    <td className="px-s200 py-s200">
                      <TextField
                        name={`item-name-${it.id}`}
                        placeholder={os.productPlaceholder}
                        value={it.name}
                        onChange={(e) => updateItem(it.id, { name: e.target.value })}
                      />
                      {it.sku && <p className="mt-s100 text-xs4 text-neutral-500">{it.sku}</p>}
                    </td>
                    <td className="px-s200 py-s200">
                      <TextField
                        name={`item-qty-${it.id}`}
                        inputMode="numeric"
                        value={String(it.qty)}
                        onChange={(e) =>
                          updateItem(it.id, { qty: parseAmount(e.target.value.replace(/\D/g, '')) })
                        }
                      />
                    </td>
                    <td className="px-s200 py-s200">
                      <TextField
                        name={`item-uom-${it.id}`}
                        placeholder={os.uomPlaceholder}
                        value={it.uom}
                        onChange={(e) => updateItem(it.id, { uom: e.target.value })}
                      />
                    </td>
                    <td className="px-s200 py-s200">
                      <TextField
                        name={`item-price-${it.id}`}
                        leading={<span className="text-xs3 text-text-secondary">IDR</span>}
                        placeholder="0,00"
                        value={it.price ? formatAmount(it.price, 0) : ''}
                        onChange={(e) => updateItem(it.id, { price: parseAmount(e.target.value) })}
                      />
                    </td>
                    <td className="px-s200 py-s200">
                      <div className="flex items-end gap-s100">
                        {/* min-w-0 flex-1 so the amount yields to the type
                            select; FieldShell's w-full otherwise wins. */}
                        <div className="min-w-0 flex-1">
                          <TextField
                            name={`item-disc-${it.id}`}
                            leading={<span className="text-xs3 text-text-secondary">IDR</span>}
                            placeholder="0,00"
                            value={it.discount ? formatAmount(it.discount, 0) : ''}
                            onChange={(e) =>
                              updateItem(it.id, { discount: parseAmount(e.target.value) })
                            }
                          />
                        </div>
                        <div className="w-[62px] shrink-0">
                          <SelectField
                            name={`item-disctype-${it.id}`}
                            value={it.discountType}
                            onChange={(e) =>
                              updateItem(it.id, { discountType: e.target.value as '123' | '%' })
                            }
                            options={[
                              { value: '123', label: '123' },
                              { value: '%', label: '%' },
                            ]}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-s200 py-s200">
                      <SelectField
                        name={`item-tax-${it.id}`}
                        value={it.tax}
                        onChange={(e) => updateItem(it.id, { tax: e.target.value })}
                        options={os.taxOptions.map((t) => ({ value: t, label: t }))}
                      />
                    </td>
                    <td className="px-s200 py-s300 text-right text-xs3 font-bold whitespace-nowrap">
                      {formatIDR(rowTotal(it))}
                    </td>
                    <td className="px-s200 py-s300">
                      <button
                        type="button"
                        aria-label={`${os.removeRow} ${i + 1}`}
                        onClick={() =>
                          edit((o) => {
                            o.doc.items = o.doc.items.filter((x) => x.id !== it.id)
                          })
                        }
                        className="grid size-8 place-items-center rounded-s200 text-danger hover:bg-danger-bg"
                      >
                        <Icon name="trash" className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <Button
              variant="outline"
              onClick={() =>
                edit((o) => {
                  o.doc.items = [...o.doc.items, newItem()]
                })
              }
            >
              {os.addRow}
            </Button>
          </div>
        </Section>
      </div>

      {/* ----------------------------------------- remarks + payment panel */}
      <div className="mt-s400 grid grid-cols-1 gap-s400 lg:grid-cols-2">
        <Section icon="edit" title={os.remarks}>
          <div className="overflow-hidden rounded-s200 border border-neutral-300">
            <textarea
              name="remarks"
              rows={4}
              maxLength={500}
              placeholder={os.remarksPlaceholder}
              value={doc.remarks}
              onChange={(e) =>
                edit((o) => {
                  o.doc.remarks = e.target.value
                })
              }
              className="w-full resize-y px-s300 py-s200 text-xs3 outline-none placeholder:text-neutral-400"
            />
            <p className="px-s300 pb-s200 text-right text-xs4 text-text-secondary">
              {os.remarksCounter(doc.remarks.length)}
            </p>
          </div>
        </Section>

        <section className="flex flex-col gap-s300 rounded-s300 bg-primary-25 p-s400">
          <h2 className="text-xs2 font-bold text-text-primary">{os.payment}</h2>
          <Line
            label={os.subtotal}
            value={formatIDR(doc.items.reduce((n, it) => n + rowTotal(it), 0))}
            strong
          />
          <div className="flex items-center gap-s300">
            <span className="min-w-0 flex-1 text-xs3 text-text-primary">{os.deliveryFee}</span>
            {/* FieldShell hardcodes w-full, so the width has to live on a
                wrapper or the control grows over its own label. */}
            <div className="w-[200px] shrink-0">
              <TextField
                name="deliveryFee"
                leading={<span className="text-xs3 text-text-secondary">IDR</span>}
                placeholder="0,00"
                value={doc.deliveryFee ? formatAmount(doc.deliveryFee, 0) : ''}
                onChange={(e) =>
                  edit((o) => {
                    o.doc.deliveryFee = parseAmount(e.target.value)
                  })
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-s300">
            <span className="min-w-0 flex-1 text-xs3 text-text-primary">
              {os.additionalDiscount}
            </span>
            <div className="flex w-[200px] shrink-0 items-end gap-s100">
              <div className="min-w-0 flex-1">
                <TextField
                  name="addDiscount"
                  placeholder="0,00"
                  value={doc.addDiscount ? formatAmount(doc.addDiscount, 0) : ''}
                  onChange={(e) =>
                    edit((o) => {
                      o.doc.addDiscount = parseAmount(e.target.value)
                    })
                  }
                />
              </div>
              <div className="w-[72px] shrink-0">
                <SelectField
                  name="addDiscountType"
                  value={doc.addDiscountType}
                  onChange={(e) =>
                    edit((o) => {
                      o.doc.addDiscountType = e.target.value as '%' | 'IDR'
                    })
                  }
                  options={[
                    { value: '%', label: '%' },
                    { value: 'IDR', label: 'IDR' },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-s300">
            <span className="min-w-0 flex-1 text-xs3 text-text-primary">{os.additionalTax}</span>
            <div className="w-[200px] shrink-0">
              <SelectField
                name="addTax"
                value={doc.addTax}
                onChange={(e) =>
                  edit((o) => {
                    o.doc.addTax = e.target.value
                  })
                }
                options={os.taxOptions.map((t) => ({ value: t, label: t }))}
              />
            </div>
          </div>
          <div className="border-t border-dashed border-neutral-300 pt-s300">
            <Line label={os.grandTotal} value={formatIDR(pendingTotal)} strong />
            <Line label={os.paidAmount} value={`(${formatIDR(finance?.paid ?? 0)})`} />
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirmSend}
        title={plan ? os.sendTitles[plan.kind] : os.sendTitles.normal}
        body={sendBody(plan, pendingTotal)}
        confirmLabel={os.sendOrder}
        onCancel={() => setConfirmSend(false)}
        onConfirm={send}
      />

      <ConfirmDialog
        open={confirmCancel}
        title={os.cancelOrder}
        body="Cancelling voids every open invoice and locks the order. This cannot be undone."
        confirmLabel={os.cancelOrder}
        confirmVariant="danger"
        onCancel={() => setConfirmCancel(false)}
        onConfirm={() => {
          edit((o) => cancelOrder(o))
          setConfirmCancel(false)
        }}
      />
    </ConsoleShell>
  )
}

export const CreateOrder = () => <OrderScreen mode="create" />
export const OrderDetail = () => <OrderScreen mode="detail" />

/** §5.5 — the confirmation says what the send will actually do. */
function sendBody(plan: ReturnType<typeof planSend> | null, total: number): string {
  if (!plan) return ''
  if (plan.kind === 'even-out') {
    return `Sending this order will match the ${formatIDR(plan.paid)} already paid and automatically mark it as complete.`
  }
  if (plan.kind === 'over-invoiced') {
    return `${plan.voidCount} open invoice(s) exceed the order total and will be voided.`
  }
  if (plan.kind === 'overpaid') {
    return `This order has been overpaid by ${formatIDR(plan.over)}. Sending records the adjustment without billing anything further.`
  }
  return `An invoice for ${formatIDR(plan.amount || total)} will be raised and sent.`
}

/* ------------------------------------------------------------ sub-blocks */

function Section({
  icon,
  title,
  required,
  children,
}: {
  icon: string
  title: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-s300 py-s300">
      <div className="flex items-center gap-s200">
        <Icon name={icon} className="size-4 text-text-primary" />
        <h2 className="text-xs2 font-bold text-text-primary">
          {title}
          {required && <span className="text-danger"> *</span>}
        </h2>
      </div>
      {children}
    </section>
  )
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-s300 py-0.5">
      <span className="text-xs3 text-text-primary">{label}</span>
      <span className={`text-xs3 whitespace-nowrap ${strong ? 'font-bold' : ''}`}>{value}</span>
    </div>
  )
}

function Party({
  company,
  name,
  phone,
  email,
  address,
  postal,
  bank,
}: {
  company: string
  name: string
  phone: string
  email: string
  address: string
  postal?: string
  bank?: boolean
}) {
  return (
    <div className="text-xs3">
      <p className="mb-s200 font-bold text-text-primary">{company}</p>
      <Field label={os.fields.name} value={name} />
      <Field label={os.fields.phone} value={phone} />
      <Field label={os.fields.email} value={email} />
      <Field label={os.fields.address} value={address} />
      {postal && <Field label={os.fields.postal} value={postal} />}
      {bank && (
        <>
          <div className="h-s200" />
          <Field label={os.fields.bankName} value="-" />
          <Field label={os.fields.accountNo} value="-" />
          <Field label={os.fields.accountHolder} value="-" />
        </>
      )}
      <button type="button" className="mt-s200 text-xs3 text-primary-400 underline">
        {os.seeLess}
      </button>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-s300 py-0.5">
      <span className="w-[130px] shrink-0 text-text-secondary">{label}</span>
      <span className="min-w-0 whitespace-pre-line text-text-primary">{value}</span>
    </div>
  )
}

function InvoiceMenu({
  actions,
  onAction,
}: {
  actions: string[]
  onAction: (action: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Invoice actions"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid size-8 place-items-center rounded-s200 text-neutral-500 hover:bg-neutral-100"
      >
        <span className="text-xs2 leading-none">⋮</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 z-30 mt-1 flex w-[176px] flex-col overflow-hidden rounded-s200 border border-neutral-200 bg-white py-1 shadow-[0_12px_24px_-8px_rgba(16,24,40,.2)]">
          {actions.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                onAction(a)
                setOpen(false)
              }}
              className={`px-s300 py-s200 text-left text-xs3 hover:bg-neutral-50 ${
                a === 'Void Invoice' ? 'text-danger' : 'text-text-primary'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
