import { useState } from 'react'
import {
  Card,
  CardTitle,
  ExternalAction,
  Meter,
  Pill,
  Row,
  SectionLabel,
} from '../../components/app/Console'
import { Icon } from '../../components/ui/Icon'
import { ConsoleShell } from '../../layouts/ConsoleShell'
import { dashboard as d } from '../../data/appData'

/** Figma: "Dashboard - Monthly", node 4001:113931 (page "1. Dashboard"). */
export function Dashboard() {
  const [period, setPeriod] = useState('month')

  return (
    <ConsoleShell breadcrumb={[d.title]} activeNav="dashboard">
      <div className="flex flex-col gap-s400">
        {/* ---------- OVERVIEW ---------- */}
        <section>
          <SectionLabel>{d.sections.overview}</SectionLabel>
          <div className="grid grid-cols-1 gap-s300 xl:grid-cols-4">
            <Card>
              <CardTitle
                title={d.bgf.title}
                badge={<Pill tone="success">{d.bgf.status}</Pill>}
              />
              <p className="text-xs4 text-text-secondary">{d.bgf.subtitle}</p>
              <p className="mt-s200 text-lg font-bold text-text-primary">{d.bgf.amount}</p>
              <p className="text-xs4 text-text-secondary">{d.bgf.of}</p>
              <div className="mt-s300 flex flex-col gap-s100">
                <Row label={d.bgf.availableLabel} value={d.bgf.available} />
                <Meter value={1} />
                <Row label={d.bgf.usedLabel} value={d.bgf.used} />
              </div>
            </Card>

            <Card>
              <CardTitle
                title={d.eligibility.title}
                badge={<Pill tone="success">{d.eligibility.status}</Pill>}
              />
              <p className="text-xs4 text-text-secondary">{d.eligibility.subtitle}</p>
              <ul className="mt-s300 flex flex-col gap-s200">
                {d.eligibility.items.map((it) => (
                  <li key={it.label} className="flex items-center gap-s200">
                    <span className="size-1.5 shrink-0 rounded-full bg-primary-400" />
                    <span className="flex-1 text-xs3 text-text-primary">{it.label}</span>
                    <Icon
                      name={it.unlocked ? 'circle-check' : 'lock-keyhole'}
                      className={`size-4 ${it.unlocked ? 'text-primary-400' : 'text-neutral-400'}`}
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-s300">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs4 text-text-secondary">
                    {d.eligibility.progressLabel}
                  </span>
                  <span className="text-xs4 font-semibold">{d.eligibility.progress}</span>
                </div>
                <div className="mt-s100">
                  <Meter value={1} />
                </div>
              </div>
            </Card>

            <div className="flex flex-col gap-s300 xl:col-span-2">
              <div className="grid grid-cols-1 gap-s300 sm:grid-cols-2">
                {[d.payable, d.receivable].map((w) => (
                  <Card key={w.title}>
                    <CardTitle title={w.title} action={<ExternalAction />} />
                    <p className="text-xs4 text-text-secondary">{w.subtitle}</p>
                    <p className="mt-s200 text-lg font-bold text-text-primary">{w.amount}</p>
                  </Card>
                ))}
              </div>

              <Card>
                <CardTitle title={d.settlements.title} action={<ExternalAction />} />
                <div className="flex flex-wrap items-end gap-s300">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs4 text-text-secondary">{d.settlements.subtitle}</p>
                    <p className="mt-s200 text-lg font-bold text-text-primary">
                      {d.settlements.amount}
                    </p>
                  </div>
                  <div className="flex items-center gap-s300 rounded-s200 bg-primary-25 px-s300 py-s200">
                    <span className="text-xs4 text-text-secondary">
                      {d.settlements.nextLabel}
                      <br />
                      {d.settlements.nextDate}
                    </span>
                    <span className="text-xs2 font-bold text-text-primary">
                      {d.settlements.nextAmount}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ---------- PERFORMANCE ---------- */}
        <section>
          <div className="mb-s200 flex flex-wrap items-center gap-s200">
            <SectionLabel>{d.sections.performance}</SectionLabel>
            <div className="mb-s200 ml-auto flex items-center gap-s200">
              <span className="text-xs3 text-text-secondary">{d.sortBy}</span>
              <div className="flex overflow-hidden rounded-s200 border border-neutral-300">
                {d.periods.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPeriod(p.id)}
                    className={`px-s200 py-1.5 text-xs3 transition-colors ${
                      period === p.id
                        ? 'bg-neutral-100 font-semibold text-text-primary'
                        : 'bg-white text-text-secondary hover:bg-neutral-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-s300 xl:grid-cols-[1fr_2fr]">
            <Card>
              <CardTitle
                title={d.financialSummary.title}
                subtitle={d.financialSummary.subtitle}
              />
              <div className="flex flex-col gap-s300">
                {d.financialSummary.rows.map((r) => (
                  <div key={r.label}>
                    <div className="flex items-center justify-between gap-s200">
                      <span className="text-xs3 text-text-secondary">{r.label}</span>
                      <Delta value={r.delta} dir={r.deltaDir} />
                    </div>
                    <p
                      className={`text-xs2 font-bold ${
                        r.tone === 'warning' ? 'text-warning' : 'text-primary-400'
                      }`}
                    >
                      {r.value}
                    </p>
                    <p className="text-xs4 text-text-secondary">{r.vs}</p>
                  </div>
                ))}
                <div className="border-t border-neutral-200 pt-s200">
                  <div className="flex items-center justify-between gap-s200">
                    <span className="text-xs3 text-text-secondary">
                      {d.financialSummary.profitLabel}
                    </span>
                    <span className="text-xs4 text-text-secondary">
                      {d.financialSummary.margin}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-s200">
                    <p className="text-xs2 font-bold text-text-primary">
                      {d.financialSummary.profit}
                    </p>
                    <Delta value={d.financialSummary.profitDelta} dir="up" />
                  </div>
                  <p className="text-xs4 text-text-secondary">{d.financialSummary.profitVs}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="grid grid-cols-1 gap-s300 lg:grid-cols-[minmax(0,280px)_1fr]">
                <div className="lg:border-r lg:border-neutral-200 lg:pr-s300">
                  <CardTitle title={d.salesTrend.title} subtitle={d.salesTrend.subtitle} />
                  <div className="flex flex-col gap-s200">
                    <TrendRow
                      label={d.salesTrend.bestLabel}
                      range={d.salesTrend.bestRange}
                      value={d.salesTrend.bestValue}
                    />
                    <TrendRow
                      label={d.salesTrend.slowestLabel}
                      range={d.salesTrend.slowestRange}
                      value={d.salesTrend.slowestValue}
                    />
                    <div className="border-t border-neutral-200 pt-s200">
                      <span className="text-xs3 text-text-secondary">
                        {d.salesTrend.averageLabel}
                      </span>
                      <div className="flex items-center justify-between gap-s200">
                        <p className="text-xs2 font-bold text-text-primary">
                          {d.salesTrend.average}
                        </p>
                        <Delta value={d.salesTrend.averageDelta} dir="up" />
                      </div>
                      <p className="text-xs4 text-text-secondary">{d.salesTrend.averageVs}</p>
                    </div>
                  </div>
                </div>

                <SalesChart />
              </div>
            </Card>
          </div>
        </section>

        {/* ---------- ORDER ---------- */}
        <section>
          <SectionLabel>{d.sections.order}</SectionLabel>
          <div className="grid grid-cols-1 gap-s300 sm:grid-cols-2 xl:grid-cols-4">
            {d.orderWidgets.map((w) => (
              <Card key={w.id}>
                <div className="flex items-start gap-s200">
                  <span className="grid size-8 shrink-0 place-items-center rounded-s200 bg-primary-25 text-primary-400">
                    <Icon name={w.icon} className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs3 font-semibold text-text-primary">{w.title}</h3>
                    <p className="text-xs4 text-text-secondary">{w.subtitle}</p>
                  </div>
                  <ExternalAction />
                </div>
                <p className="mt-s200 text-lg font-bold text-text-primary">{w.amount}</p>
                <div className="mt-s200 grid grid-cols-2 border-t border-neutral-200 pt-s200">
                  <div>
                    <p className="text-xs4 text-text-secondary">{d.invoicedLabel}</p>
                    <p className="text-xs2 font-bold text-text-primary">{w.invoiced}</p>
                  </div>
                  <div className="border-l border-neutral-200 pl-s300">
                    <p className="text-xs4 text-text-secondary">{d.completedLabel}</p>
                    <p className="text-xs2 font-bold text-text-primary">{w.completed}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ---------- FINANCE ACTIVITY ---------- */}
        <section>
          <SectionLabel>{d.sections.finance}</SectionLabel>
          <div className="grid grid-cols-1 gap-s300 lg:grid-cols-2">
            {[d.splOverview, d.bplOverview].map((w) => (
              <Card key={w.title}>
                <CardTitle title={w.title} action={<ExternalAction />} />
                <div className="flex flex-wrap items-end gap-s300">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs4 text-neutral-400">{w.subtitle}</p>
                    <p className="mt-s100 text-lg font-bold text-neutral-400">{w.amount}</p>
                  </div>
                  <div className="flex gap-s400 border-l border-neutral-200 pl-s300">
                    {w.stats.map((s) => (
                      <div key={s.label}>
                        <p className="text-xs4 text-text-secondary">{s.label}</p>
                        <p className="text-xs2 font-bold text-neutral-400">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ---------- BUSINESS INTELLIGENCE ---------- */}
        <section>
          <SectionLabel>{d.sections.intelligence}</SectionLabel>
          <div className="grid grid-cols-1 gap-s300 lg:grid-cols-2">
            <Card>
              <CardTitle title={d.topCustomers.title} subtitle={d.topCustomers.subtitle} />
              <Ranking
                columns={d.topCustomers.columns}
                rows={d.topCustomers.rows.map((r) => ({
                  name: r.name,
                  bar: r.bar,
                  cells: [r.value],
                }))}
              />
            </Card>
            <Card>
              <CardTitle title={d.topProducts.title} subtitle={d.topProducts.subtitle} />
              <Ranking
                tone="warning"
                columns={d.topProducts.columns}
                rows={d.topProducts.rows.map((r) => ({
                  name: r.name,
                  bar: r.bar,
                  cells: [r.value, r.units],
                }))}
              />
            </Card>
          </div>
        </section>
      </div>
    </ConsoleShell>
  )
}

function Delta({ value, dir }: { value: string; dir: 'up' | 'down' }) {
  const up = dir === 'up'
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-s100 rounded-full px-s200 py-0.5 text-xs4 font-semibold ${
        up ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
      }`}
    >
      <Icon name={up ? 'trending-up' : 'trending-down'} className="size-3.5" />
      {value}
    </span>
  )
}

function TrendRow({ label, range, value }: { label: string; range: string; value: string }) {
  return (
    <div>
      <span className="text-xs3 text-text-secondary">{label}</span>
      <div className="flex items-center gap-s200">
        <span className="shrink-0 text-xs3 text-text-primary">{range}</span>
        <span className="h-px min-w-4 flex-1 bg-neutral-200" />
        <span className="shrink-0 text-xs3 font-bold text-primary-400">{value}</span>
      </div>
    </div>
  )
}

/** Inline sparkline — the Figma chart is a vector; this redraws it from `series`. */
function SalesChart() {
  const pts = d.salesTrend.series
  const w = 100
  const h = 100
  const step = w / (pts.length - 1)
  const line = pts.map((p, i) => `${i * step},${h - p * h}`).join(' ')
  const area = `0,${h} ${line} ${w},${h}`

  return (
    <div className="flex min-w-0 gap-s200">
      <div className="flex shrink-0 flex-col justify-between py-1 text-xs4 text-neutral-500">
        {d.salesTrend.yAxis.map((y) => (
          <span key={y}>{y}</span>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div className="relative h-[200px] w-full">
          <svg
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="none"
            className="size-full"
            aria-label={`${d.salesTrend.title} chart`}
            role="img"
          >
            <polygon points={area} className="fill-primary-400/10" />
            <polyline
              points={line}
              className="fill-none stroke-primary-400"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Tooltip on the active point — Figma shows week 3 selected. */}
          <div className="pointer-events-none absolute top-2 right-2 rounded-s200 border border-neutral-200 bg-white p-s200 shadow-[0_8px_16px_-6px_rgba(16,24,40,.16)]">
            <p className="text-xs3 font-semibold text-text-primary">{d.salesTrend.tooltip.label}</p>
            <p className="text-xs2 font-bold text-primary-400">{d.salesTrend.tooltip.value}</p>
            <p className="text-xs4 text-text-secondary">{d.salesTrend.tooltip.range}</p>
          </div>
        </div>

        <div className="mt-s100 flex justify-between text-xs4">
          {d.salesTrend.xAxis.map((x) => (
            <span
              key={x}
              className={
                x === d.salesTrend.activePoint
                  ? 'font-bold text-primary-400'
                  : 'text-text-secondary'
              }
            >
              {x}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Ranking({
  columns,
  rows,
  tone = 'primary',
}: {
  columns: string[]
  rows: { name: string; bar: number; cells: string[] }[]
  tone?: 'primary' | 'warning'
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            <th scope="col" className="w-6 py-1.5 text-xs4 font-bold text-neutral-500">
              {columns[0]}
            </th>
            <th scope="col" className="py-1.5 text-xs4 font-bold text-neutral-500">
              {columns[1]}
            </th>
            {columns.slice(2).map((c) => (
              <th
                key={c}
                scope="col"
                className="py-1.5 text-right text-xs4 font-bold whitespace-nowrap text-neutral-500"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.name} className="align-bottom">
              <td className="py-1.5 text-xs3 text-text-secondary">{i + 1}.</td>
              <td className="py-1.5 pr-s300">
                <span className="block text-xs3 font-semibold text-text-primary">{r.name}</span>
                <span className="mt-1 block">
                  <Meter value={r.bar} tone={tone} />
                </span>
              </td>
              {r.cells.map((c, ci) => (
                <td
                  key={ci}
                  className="py-1.5 pl-s300 text-right text-xs3 whitespace-nowrap text-text-primary"
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
