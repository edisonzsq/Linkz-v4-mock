import { mockOrders, mockSummary, mockVolume, type MockOrder } from '../data/content'
import { Icon } from './ui/Icon'

const statusStyles: Record<MockOrder['status'], string> = {
  Confirmed: 'bg-signal-500/12 text-signal-600 ring-signal-500/25',
  'Awaiting stock': 'bg-amber-brand/12 text-[#8a5a00] ring-amber-brand/30',
  'Draft from email': 'bg-brand-500/10 text-brand-700 ring-brand-500/20',
  'In transit': 'bg-ink-100 text-ink-600 ring-ink-200',
  Delivered: 'bg-ink-100 text-ink-500 ring-ink-200',
}

function Sparkline({ points }: { points: number[] }) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const w = 120
  const h = 34
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w
      const y = h - ((p - min) / (max - min || 1)) * (h - 4) - 2
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-[120px] overflow-visible" aria-hidden="true">
      <path d={`${d} L${w},${h} L0,${h} Z`} fill="url(#spark)" opacity="0.28" />
      <path d={d} fill="none" stroke="var(--color-brand-500)" strokeWidth="1.8" strokeLinecap="round" />
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brand-500)" />
          <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/**
 * A static, non-interactive mock of the Linkz order desk.
 * Purely presentational — every value comes from src/data/content.ts.
 */
export function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink-900/8 shadow-[0_1px_2px_rgba(13,23,40,.06),0_28px_60px_-24px_rgba(13,23,40,.35)]">
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-ink-100 bg-ink-50/70 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-ink-200" />
          <span className="size-2.5 rounded-full bg-ink-200" />
          <span className="size-2.5 rounded-full bg-ink-200" />
        </div>
        <div className="mx-auto flex items-center gap-2 rounded-md bg-white px-3 py-1 text-[11px] text-ink-400 ring-1 ring-ink-100">
          app.linkz.example/orders
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] text-ink-400">Order desk</p>
            <p className="mt-0.5 text-lg font-semibold tracking-[-0.01em] text-ink-900">
              This week
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Sparkline points={mockVolume} />
            <span className="rounded-full bg-signal-500/12 px-2 py-1 text-[11px] font-semibold text-signal-600">
              +23%
            </span>
          </div>
        </div>

        {/* Summary tiles */}
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          {mockSummary.map((s) => (
            <div key={s.label} className="rounded-xl bg-ink-50 p-3 ring-1 ring-ink-100">
              <p className="truncate text-[11px] font-medium text-ink-400">{s.label}</p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.02em] text-ink-900">{s.value}</p>
              <p
                className={`mt-0.5 truncate text-[11px] ${
                  s.trend === 'up' ? 'text-signal-600' : 'text-ink-400'
                }`}
              >
                {s.delta}
              </p>
            </div>
          ))}
        </div>

        {/* Order table */}
        <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-ink-100">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-ink-50/80 text-[11px] tracking-wide text-ink-400 uppercase">
                <th className="px-3 py-2 font-medium">Partner</th>
                <th className="hidden px-3 py-2 font-medium sm:table-cell">Items</th>
                <th className="px-3 py-2 font-medium">Value</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((o) => (
                <tr key={o.id} className="border-t border-ink-100 text-[13px]">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-50 text-[10px] font-semibold text-brand-700 ring-1 ring-brand-100">
                        {o.initials}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-ink-800">{o.partner}</span>
                        <span className="block text-[11px] text-ink-400">{o.id}</span>
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-3 py-2.5 text-ink-500 sm:table-cell">{o.items}</td>
                  <td className="px-3 py-2.5 font-medium text-ink-800 tabular-nums">{o.value}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${statusStyles[o.status]}`}
                    >
                      {o.status}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-ink-400">{o.eta}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center gap-2 text-[12px] text-ink-400">
          <Icon name="sparkle" className="size-4 text-brand-500" />
          3 orders drafted from email in the last hour
        </div>
      </div>
    </div>
  )
}
