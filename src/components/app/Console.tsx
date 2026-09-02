import type { ReactNode } from 'react'
import { Icon } from '../ui/Icon'
import { pager } from '../../data/appData'
import { statusTone, type Tone } from './consoleUtils'

/**
 * Shared building blocks for the in-app areas.
 *
 * Sizes follow the Figma frames: cards are 8px radius on a 1px #eaecf0 border,
 * section labels are 10px/14 uppercase, table rows are 48px.
 */

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-s200 text-xs4 font-bold tracking-[0.04em] text-neutral-500">{children}</h2>
  )
}

export function Card({
  children,
  className = '',
  padded = true,
}: {
  children: ReactNode
  className?: string
  padded?: boolean
}) {
  return (
    <section
      className={`rounded-s200 border border-neutral-200 bg-white ${padded ? 'p-s300' : ''} ${className}`}
    >
      {children}
    </section>
  )
}

export function CardTitle({
  title,
  subtitle,
  action,
  badge,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  badge?: ReactNode
}) {
  return (
    <div className="mb-s200 flex items-start gap-s200">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-s200">
          <h3 className="truncate text-xs2 font-semibold text-text-primary">{title}</h3>
          {badge}
        </div>
        {subtitle && <p className="mt-0.5 text-xs4 text-text-secondary">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

/** The small "open in full" affordance in the corner of dashboard widgets. */
export function ExternalAction({ label = 'Open' }: { label?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-6 shrink-0 place-items-center rounded-s200 text-neutral-500 hover:bg-neutral-100"
    >
      <Icon name="external-link" className="size-4" />
    </button>
  )
}

const toneClass: Record<Tone, string> = {
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
  info: 'bg-primary-25 text-primary-500',
  neutral: 'bg-neutral-100 text-neutral-600',
}

export function Pill({ children, tone }: { children: string; tone?: Tone }) {
  const t = tone ?? statusTone(children)
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-s200 py-0.5 text-xs4 font-semibold ${toneClass[t]}`}
    >
      {children}
    </span>
  )
}

/** Page title row with the action buttons the frames carry top-right. */
export function PageHeader({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  return (
    <div className="mb-s300 flex flex-wrap items-center gap-s200">
      <h1 className="text-lg font-bold text-text-primary">{title}</h1>
      <div className="ml-auto flex flex-wrap items-center gap-s200">{children}</div>
    </div>
  )
}

/** Search on the left, filter pills and sort on the right (e.g. node 4001:13925). */
export function Toolbar({
  searchPlaceholder,
  children,
}: {
  searchPlaceholder: string
  children?: ReactNode
}) {
  return (
    <div className="mb-s300 flex flex-wrap items-center gap-s200">
      <label className="flex h-8 min-w-0 flex-1 items-center gap-s200 rounded-s200 border border-neutral-300 bg-white px-s200 sm:max-w-[250px]">
        <input
          type="search"
          placeholder={searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent text-xs3 outline-none placeholder:text-neutral-400"
        />
        <Icon name="search" className="size-4 shrink-0 text-neutral-500" />
      </label>
      <div className="ml-auto flex flex-wrap items-center gap-s200">{children}</div>
    </div>
  )
}

/**
 * Filter / sort pill — a select styled like the design's dropdown buttons.
 *
 * Decorative by default — most lists in this mock are static — but
 * pass `value` / `onChange` and it filters for real. `label` doubles as the
 * "no filter" option, which carries the empty string as its value.
 */
export function FilterPill({
  label,
  icon = 'filter',
  options,
  value,
  onChange,
}: {
  label: string
  icon?: string
  options?: string[]
  value?: string
  onChange?: (value: string) => void
}) {
  return (
    <div className="flex h-8 items-center gap-s200 rounded-s200 border border-neutral-300 bg-white px-s200">
      <Icon name={icon} className="size-4 shrink-0 text-text-secondary" />
      <select
        aria-label={label}
        value={onChange ? value : undefined}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="min-w-0 cursor-pointer appearance-none bg-transparent text-xs3 text-text-secondary outline-none"
      >
        <option value="">{label}</option>
        {options?.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Icon name="chevron-down" className="size-3.5 shrink-0 text-neutral-500" />
    </div>
  )
}

/**
 * Responsive table: a real table from `md` up, stacked cards below, so the
 * mobile frames in Figma (375px) and the desktop frames (1440px) both hold.
 */
export function DataTable<T>({
  columns,
  rows,
  render,
  card,
  empty,
}: {
  columns: string[]
  rows: T[]
  /** Cells for one row, in column order. */
  render: (row: T, index: number) => ReactNode[]
  /** Same row as a stacked card, used below the `md` breakpoint. */
  card: (row: T, index: number) => ReactNode
  empty?: ReactNode
}) {
  if (rows.length === 0 && empty) return <>{empty}</>

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-neutral-200">
              {columns.map((c, i) => (
                <th
                  key={`${c}-${i}`}
                  scope="col"
                  className="px-s200 py-3 text-xs3 font-bold whitespace-nowrap text-text-primary"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="border-b border-neutral-200 last:border-0 hover:bg-neutral-50">
                {render(r, ri).map((c, ci) => (
                  <td key={ci} className="px-s200 py-3 align-middle text-xs3 text-text-primary">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-s200 p-s200 md:hidden">
        {rows.map((r, ri) => (
          <div key={ri} className="rounded-s200 border border-neutral-200 bg-white p-s200">
            {card(r, ri)}
          </div>
        ))}
      </div>
    </>
  )
}

/** Row-level actions menu trigger (the ⋮ in every list frame). */
export function RowMenu() {
  return (
    <button
      type="button"
      aria-label="Row actions"
      className="grid size-8 place-items-center rounded-s200 text-neutral-500 hover:bg-neutral-100"
    >
      <span className="text-xs2 leading-none">⋮</span>
    </button>
  )
}

/** Tab strip used by the finance and contact areas (e.g. node 4001:187533). */
export function TabBar<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
}) {
  return (
    <div role="tablist" className="mb-s300 flex gap-s400 overflow-x-auto border-b border-neutral-200">
      {tabs.map((t) => {
        const active = t.id === value
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(t.id)}
            className={`-mb-px shrink-0 border-b-2 px-s100 pb-s200 text-xs3 transition-colors ${
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
  )
}

/** The "NEW" chip beside recently added rows. */
export function NewChip() {
  return (
    <span className="rounded-[4px] bg-[#f4ebff] px-1.5 py-0.5 text-xs4 font-bold text-[#6941c6]">
      NEW
    </span>
  )
}

export function Pagination({ noun }: { noun: string }) {
  return (
    <div className="flex flex-wrap items-center gap-s200 border-t border-neutral-200 px-s200 py-s300">
      <div className="flex items-center gap-s200">
        <span className="text-xs3 text-text-secondary">{pager.show}</span>
        <select
          aria-label="Rows per page"
          className="h-8 cursor-pointer rounded-s200 border border-neutral-300 bg-white px-s200 text-xs3 outline-none"
        >
          {pager.sizes.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <span className="text-xs3 text-neutral-500">{pager.perPage(noun)}</span>
      </div>

      <div className="ml-auto flex items-center gap-s200">
        <span className="hidden text-xs3 text-text-secondary sm:inline">{pager.goToPage}</span>
        <input
          aria-label="Page number"
          defaultValue="1"
          className="h-8 w-10 rounded-s200 border border-neutral-300 bg-white text-center text-xs3 outline-none"
        />
        <span className="text-xs3 text-neutral-500">{pager.of}</span>
        <button
          type="button"
          aria-label="Previous page"
          disabled
          className="grid size-8 place-items-center rounded-s200 border border-neutral-300 text-neutral-300"
        >
          <Icon name="chevron-left" className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Next page"
          className="grid size-8 place-items-center rounded-s200 border border-primary-400 text-primary-400 hover:bg-primary-25"
        >
          <Icon name="chevron-right" className="size-4" />
        </button>
      </div>
    </div>
  )
}

/**
 * Empty state — concentric rings behind a magnifier, matching the
 * "Empty state" frames (e.g. Figma node 4001:263886).
 */
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string
  body: string
  /** The front-door CTA, where the empty state is the way in (e.g. §4). */
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center px-s300 py-s500 text-center">
      <div className="relative grid size-40 place-items-center">
        {[100, 80, 62, 44, 26].map((pct, i) => (
          <span
            key={pct}
            style={{ width: `${pct}%`, height: `${pct}%` }}
            className={`absolute rounded-full ${i % 2 ? 'bg-neutral-50' : 'bg-neutral-100'}`}
          />
        ))}
        <Icon name="search" className="relative size-10 text-neutral-400" />
      </div>
      <h3 className="mt-s300 text-xs2 font-semibold text-text-primary">{title}</h3>
      <p className="mt-s100 max-w-[360px] text-xs3 text-text-secondary">{body}</p>
      {action && <div className="mt-s300">{action}</div>}
    </div>
  )
}

/** Numbered "how it works" step used by the finance and referral areas. */
export function Step({
  index,
  title,
  body,
  icon,
}: {
  index: number
  title: string
  body: string
  icon?: string
}) {
  return (
    <div className="flex gap-s200">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-25 text-xs2 font-bold text-primary-400">
        {icon ? <Icon name={icon} className="size-5" /> : index}
      </span>
      <div className="min-w-0">
        <h4 className="text-xs3 font-semibold text-text-primary">{title}</h4>
        <p className="mt-s100 text-xs3 text-text-secondary">{body}</p>
      </div>
    </div>
  )
}

/** Label / value row used throughout the detail and summary panels. */
export function Row({
  label,
  value,
  strong,
}: {
  label: string
  value: ReactNode
  strong?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-s300 py-1.5">
      <span className="text-xs3 text-text-secondary">{label}</span>
      <span
        className={`text-right text-xs3 ${strong ? 'font-bold text-text-primary' : 'font-semibold text-text-primary'}`}
      >
        {value}
      </span>
    </div>
  )
}

/** Progress bar used by the limit, eligibility and ranking widgets. */
export function Meter({ value, tone = 'primary' }: { value: number; tone?: 'primary' | 'warning' }) {
  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
      <span
        style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }}
        className={`block h-full rounded-full ${tone === 'warning' ? 'bg-warning' : 'bg-primary-400'}`}
      />
    </span>
  )
}
