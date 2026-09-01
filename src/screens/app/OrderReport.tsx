import { Fragment, useMemo, useState } from 'react'
import {
  Card,
  EmptyState,
  FilterPill,
  PageHeader,
  Pagination,
  Pill,
  Row,
} from '../../components/app/Console'
import { DateRangePicker } from '../../components/app/DateRangePicker'
import {
  rangeForPreset,
  type DateRange,
  type PresetId,
} from '../../components/app/dateUtils'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { ConsoleShell } from '../../layouts/ConsoleShell'
import { orderReport as rp } from '../../data/appData'
import { formatIDR } from '../../state/orders'

type Tab = (typeof rp.tabs)[number]['id']
type SettlementRow = (typeof rp.settlement.rows)[number]

/**
 * Order Report — Figma 7017:1308 (Settlement), 7017:1508 (Payments),
 * 7017:1350 (date picker open), all under section 7017:1065.
 *
 * §9 of `docs/order-behaviour-handover.md`. The two tables are shaped
 * differently on purpose: Settlement groups by day and carries a Status
 * column; Payments is a flat numbered ledger with neither.
 */
export function OrderReport() {
  const [tab, setTab] = useState<Tab>('settlement')
  const [preset, setPreset] = useState<PresetId>('last7')
  const [range, setRange] = useState<DateRange>(() => rangeForPreset('last7'))
  const [desc, setDesc] = useState(true)

  /** Settlement rows grouped by day, with a per-day total and order count. */
  const groups = useMemo(() => {
    const byDay = new Map<string, SettlementRow[]>()
    for (const r of rp.settlement.rows) {
      byDay.set(r.date, [...(byDay.get(r.date) ?? []), r])
    }
    const entries = [...byDay.entries()]
    // The sample dates are same-month, so ordering by the day number is enough
    // here; real rows would carry a parsed date.
    entries.sort((a, b) => {
      const da = parseInt(a[0], 10)
      const db = parseInt(b[0], 10)
      return desc ? db - da : da - db
    })
    return entries.map(([date, rows]) => ({
      date,
      rows,
      total: rows.reduce((n, r) => n + r.amount, 0),
    }))
  }, [desc])

  const isSettlement = tab === 'settlement'

  return (
    <ConsoleShell breadcrumb={rp.breadcrumb} activeNav="order-report">
      <PageHeader title={rp.title}>
        <Button>
          <Icon name="save" className="size-4" />
          {rp.exportCta}
        </Button>
      </PageHeader>

      {/* Tabs */}
      <div role="tablist" className="mb-s300 flex gap-s400 border-b border-neutral-200">
        {rp.tabs.map((t) => {
          const active = t.id === tab
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setTab(t.id)}
              className={`-mb-px shrink-0 border-b-2 px-s200 pb-s200 text-xs2 transition-colors ${
                active
                  ? 'border-primary-400 font-semibold text-primary-400'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Toolbar: date range left, status + sort right */}
      <div className="mb-s300 flex flex-wrap items-center gap-s200">
        <DateRangePicker
          preset={preset}
          range={range}
          onApply={(p, r) => {
            setPreset(p)
            setRange(r)
          }}
        />
        <div className="ml-auto flex flex-wrap items-center gap-s200">
          {isSettlement && (
            <FilterPill label={rp.allStatus} options={[...rp.settlement.statuses]} />
          )}
          <button
            type="button"
            onClick={() => setDesc((v) => !v)}
            className="flex h-9 items-center gap-s200 rounded-s200 border border-neutral-300 bg-white px-s300 text-xs3 text-text-secondary hover:bg-neutral-50"
          >
            <Icon name="filter" className="size-4" />
            {desc ? rp.sort.desc : rp.sort.asc}
            <Icon name="chevron-down" className="size-4 text-neutral-500" />
          </button>
        </div>
      </div>

      {isSettlement ? <SettlementTable groups={groups} /> : <PaymentsTable />}
    </ConsoleShell>
  )
}

/** Grouped by day: a header row per day carrying the total and order count. */
function SettlementTable({
  groups,
}: {
  groups: { date: string; rows: SettlementRow[]; total: number }[]
}) {
  const s = rp.settlement
  if (groups.length === 0) {
    return (
      <Card padded={false}>
        <EmptyState title={s.emptyTitle} body={s.emptyBody} />
      </Card>
    )
  }

  return (
    <Card padded={false}>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-neutral-200">
              {s.columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="px-s300 py-s300 text-xs2 font-bold whitespace-nowrap text-text-primary"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <Fragment key={g.date}>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <td className="px-s300 py-s300 text-xs3 font-bold whitespace-nowrap text-text-primary">
                    {g.date}
                  </td>
                  <td colSpan={3} />
                  <td className="px-s300 py-s300 whitespace-nowrap">
                    <span className="text-xs3 text-text-secondary">{s.totalLabel} </span>
                    <span className="text-xs3 font-bold text-text-primary">
                      {formatIDR(g.total)}
                    </span>
                  </td>
                  <td className="px-s300 py-s300 text-xs3 whitespace-nowrap text-text-secondary">
                    {s.orders(g.rows.length)}
                  </td>
                </tr>
                {g.rows.map((r) => (
                  <tr
                    key={r.order}
                    className="border-b border-neutral-200 last:border-0 hover:bg-neutral-50"
                  >
                    <td className="px-s300 py-s300 text-xs3 whitespace-nowrap text-text-primary">
                      {r.date} {r.time}
                    </td>
                    <td className="px-s300 py-s300 text-xs3 whitespace-nowrap text-text-primary">
                      {r.order}
                    </td>
                    <td className="px-s300 py-s300 text-xs3 whitespace-nowrap text-text-primary">
                      {r.customer}
                    </td>
                    <td className="px-s300 py-s300 text-xs3 whitespace-nowrap text-text-primary">
                      {r.method}
                    </td>
                    <td className="px-s300 py-s300 text-xs3 whitespace-nowrap text-text-primary">
                      {formatIDR(r.amount)}
                    </td>
                    <td className="px-s300 py-s300">
                      <Pill>{r.status}</Pill>
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile — Figma 7017:2120 "Settlement Card" */}
      <div className="flex flex-col gap-s300 p-s300 md:hidden">
        {groups.map((g) => (
          <div key={g.date}>
            <div className="mb-s200 flex flex-wrap items-baseline gap-s200">
              <span className="text-xs3 font-bold text-text-primary">{g.date}</span>
              <span className="ml-auto text-xs3 text-text-secondary">
                {s.totalLabel}{' '}
                <span className="font-bold text-text-primary">{formatIDR(g.total)}</span>
              </span>
              <span className="w-full text-xs4 text-text-secondary">
                {s.orders(g.rows.length)}
              </span>
            </div>
            <div className="flex flex-col gap-s200">
              {g.rows.map((r) => (
                <div key={r.order} className="rounded-s200 border border-neutral-200 p-s200">
                  <div className="mb-s200 flex items-center gap-s200">
                    <span className="min-w-0 flex-1 truncate text-xs3 font-semibold">
                      {r.order}
                    </span>
                    <Pill>{r.status}</Pill>
                  </div>
                  <Row label={s.columns[2]} value={r.customer} />
                  <Row label={s.columns[3]} value={r.method} />
                  <Row label={s.columns[4]} value={formatIDR(r.amount)} strong />
                  <Row label={s.columns[0]} value={`${r.date} ${r.time}`} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Pagination noun={s.perPageNoun} />
    </Card>
  )
}

/** Flat numbered ledger — no grouping, no status column. */
function PaymentsTable() {
  const p = rp.payments
  if (p.rows.length === 0) {
    return (
      <Card padded={false}>
        <EmptyState title={p.emptyTitle} body={p.emptyBody} />
      </Card>
    )
  }

  return (
    <Card padded={false}>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-neutral-200">
              {p.columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="px-s300 py-s300 text-xs2 font-bold whitespace-nowrap text-text-primary"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {p.rows.map((r, i) => (
              <tr
                key={r.invoice}
                className="border-b border-neutral-200 last:border-0 hover:bg-neutral-50"
              >
                <td className="px-s300 py-s300 text-xs3 text-text-primary">{i + 1}.</td>
                <td className="px-s300 py-s300 text-xs3 whitespace-nowrap text-text-primary">
                  {r.order}
                </td>
                <td className="px-s300 py-s300 text-xs3 whitespace-nowrap text-text-primary">
                  {r.invoice}
                </td>
                <td className="px-s300 py-s300 text-xs3 whitespace-nowrap text-text-primary">
                  {r.paidTo}
                </td>
                <td className="px-s300 py-s300 text-xs3 whitespace-nowrap text-text-primary">
                  {r.date}
                </td>
                <td className="px-s300 py-s300 text-xs3 whitespace-nowrap text-text-primary">
                  {formatIDR(r.amount)}
                </td>
                <td className="px-s300 py-s300 text-xs3 whitespace-nowrap text-text-primary">
                  {r.method}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile — Figma 7017:2063 "Payment Card" */}
      <div className="flex flex-col gap-s200 p-s300 md:hidden">
        {p.rows.map((r) => (
          <div key={r.invoice} className="rounded-s200 border border-neutral-200 p-s200">
            <div className="mb-s200 flex items-center gap-s200">
              <span className="min-w-0 flex-1 truncate text-xs3 font-semibold">{r.order}</span>
              <span className="shrink-0 text-xs3 text-text-secondary">{r.invoice}</span>
            </div>
            <Row label={p.columns[3]} value={r.paidTo} />
            <Row label={p.columns[4]} value={r.date} />
            <Row label={p.columns[5]} value={formatIDR(r.amount)} strong />
            <Row label={p.columns[6]} value={r.method} />
          </div>
        ))}
      </div>

      <Pagination noun={p.perPageNoun} />
    </Card>
  )
}
