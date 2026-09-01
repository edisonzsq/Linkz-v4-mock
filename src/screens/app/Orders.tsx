import { useState } from 'react'
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
  orderTotals,
  purchaseOrders,
  salesOrders,
} from '../../data/appData'
import { useFlow } from '../../prototype/flowContext'

type OrderRow = (typeof salesOrders.rows)[number]

/**
 * Order list — Figma "Order List", node 4001:13925 (page "2. Order Management").
 * The sales and purchase lists are the same frame with a different party column,
 * so one component serves both.
 */
function OrderList({
  data,
  activeNav,
}: {
  data: typeof salesOrders | typeof purchaseOrders
  activeNav: string
}) {
  const { go } = useFlow()

  return (
    <ConsoleShell breadcrumb={data.breadcrumb} activeNav={activeNav}>
      <PageHeader title={data.title}>
        <Button variant="outline">
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
        <DataTable<OrderRow>
          columns={data.columns}
          rows={data.rows}
          empty={<EmptyState title={data.emptyTitle} body={data.emptyBody} />}
          render={(r, i) => cells(
            `${i + 1}.`,
            <span className="flex items-center gap-s200 whitespace-nowrap">
              <span className="font-semibold">{r.no}</span>
              {r.isNew && <NewChip />}
            </span>,
            <span className="whitespace-nowrap">{r.createdBy}</span>,
            <span className="whitespace-nowrap">{r.billTo}</span>,
            <span className="whitespace-nowrap">{r.paid}</span>,
            <span className="whitespace-nowrap">{r.total}</span>,
            r.invoice,
            <span className="whitespace-nowrap">{r.updated}</span>,
            <Pill>{r.status}</Pill>,
            activeNav === 'purchase-orders' && r.status === 'Invoiced' ? (
              <Button variant="outline" onClick={() => go('checkout')}>
                Pay
              </Button>
            ) : (
              <RowMenu />
            )
          )}
          card={(r) => (
            <>
              <div className="mb-s200 flex items-center gap-s200">
                <span className="min-w-0 flex-1 truncate text-xs3 font-semibold">{r.no}</span>
                {r.isNew && <NewChip />}
                <Pill>{r.status}</Pill>
              </div>
              <Row label={data.columns[3]} value={r.billTo} />
              <Row label={data.columns[5]} value={r.total} strong />
              <Row label={data.columns[7]} value={r.updated} />
            </>
          )}
        />
        <Pagination noun={data.perPageNoun} />
      </Card>
    </ConsoleShell>
  )
}

export function SalesOrders() {
  return <OrderList data={salesOrders} activeNav="sales-orders" />
}

export function PurchaseOrders() {
  return <OrderList data={purchaseOrders} activeNav="purchase-orders" />
}

/** Create Order — Figma "Create Sales Order", node 4001:11308. */
export function CreateOrder() {
  const { go } = useFlow()
  const [customer, setCustomer] = useState('')
  const [sent, setSent] = useState(false)

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
            <Button variant="outline" onClick={() => setSent(false)}>
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
        <Button variant="outline">{co.saveDraft}</Button>
        <Button onClick={() => setSent(true)}>{co.submit}</Button>
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
              <TextField name="orderNo" label={co.orderNoLabel} defaultValue={co.orderNo} readOnly />
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
                <Button variant="outline">
                  <Icon name="plus" className="size-4" />
                  {co.addItem}
                </Button>
              </div>
            </div>

            <DataTable<(typeof orderItems)[number]>
              columns={co.itemColumns}
              rows={orderItems}
              render={(it, i) => cells(
                `${i + 1}.`,
                <span>
                  <span className="block font-semibold">{it.product}</span>
                  <span className="block text-xs4 text-neutral-500">{it.sku}</span>
                </span>,
                it.qty,
                <span className="whitespace-nowrap">{it.price}</span>,
                <span className="whitespace-nowrap">{it.discount}</span>,
                <span className="font-semibold whitespace-nowrap">{it.total}</span>,
                <button
                  type="button"
                  aria-label="Remove item"
                  className="grid size-8 place-items-center rounded-s200 text-neutral-500 hover:bg-neutral-100"
                >
                  <Icon name="trash" className="size-4" />
                </button>
              )}
              card={(it) => (
                <>
                  <p className="text-xs3 font-semibold">{it.product}</p>
                  <p className="mb-s200 text-xs4 text-neutral-500">{it.sku}</p>
                  <Row label={co.itemColumns[2]} value={it.qty} />
                  <Row label={co.itemColumns[3]} value={it.price} />
                  <Row label={co.itemColumns[5]} value={it.total} strong />
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
          <Row label={co.summary.subtotal} value={orderTotals.subtotal} />
          <Row label={co.summary.discount} value={orderTotals.discount} />
          <Row label={co.summary.tax} value={orderTotals.tax} />
          <div className="mt-s200 border-t border-neutral-200 pt-s200">
            <Row label={co.summary.total} value={orderTotals.total} strong />
          </div>
          <div className="mt-s300 flex flex-col gap-s200">
            <Button onClick={() => setSent(true)}>{co.submit}</Button>
            <Button variant="outline">{co.saveDraft}</Button>
          </div>
        </Card>
      </div>
    </ConsoleShell>
  )
}
