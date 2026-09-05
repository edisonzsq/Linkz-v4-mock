import { useMemo } from 'react'
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
  Toolbar,
} from '../../components/app/Console'
import { cells } from '../../components/app/consoleUtils'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { ConsoleShell } from '../../layouts/ConsoleShell'
import { filters, purchaseOrders, salesOrders } from '../../data/appData'
import { useFlow } from '../../prototype/flowContext'
import { useSession } from '../../prototype/sessionContext'
import {
  formatIDR,
  orderFinance,
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
  const { go, set } = useFlow()
  const { shared } = useSession()

  const rows = useMemo(
    () => shared.orders.filter((o) => o.kind === kind),
    [shared.orders, kind],
  )

  /**
   * Rows open the order — Figma `4001:13819`, and the 3 Sep flow check. A Draft
   * reopens in the editor; anything sent opens the detail view (§4).
   */
  function openOrder(o: Order) {
    set({ viewingOrder: o.no })
    go(o.status === 'Draft' ? 'order-new' : 'order-detail')
  }

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
          onRowClick={(o) => openOrder(o)}
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
