import { useState } from 'react'
import {
  Card,
  DataTable,
  EmptyState,
  FilterPill,
  Pagination,
  Pill,
  Row,
  SectionLabel,
  Step,
  TabBar,
  Toolbar,
} from '../../components/app/Console'
import { cells } from '../../components/app/consoleUtils'
import { Button } from '../../components/ui/Button'
import { SelectField } from '../../components/ui/Field'
import { Icon } from '../../components/ui/Icon'
import { ConsoleShell } from '../../layouts/ConsoleShell'
import { bizLoan, bpl, filters, spl } from '../../data/appData'

/**
 * The two credit cards at the top of both pay-later pages
 * (Figma nodes 4001:187533 and 4001:198717).
 */
function CreditHeader({
  limit,
  bills,
}: {
  limit: typeof spl.limitCard
  bills: typeof spl.billsCard
}) {
  return (
    <div className="mb-s300 grid grid-cols-1 gap-s300 lg:grid-cols-2">
      <Card>
        <h2 className="text-xs2 font-semibold text-text-primary">{limit.title}</h2>
        <p className="mt-s200 text-xs3 text-text-secondary">{limit.subtitle}</p>
        <p className="mt-s100 flex flex-wrap items-baseline gap-s200">
          <span className="text-xl font-bold text-text-primary">{limit.amount}</span>
          <span className="text-md text-neutral-400">{limit.of}</span>
        </p>
      </Card>

      <Card>
        <h2 className="text-xs2 font-semibold text-text-primary">{bills.title}</h2>
        <div className="mt-s200 flex flex-wrap items-end gap-s300">
          <div className="min-w-0 flex-1">
            <p className="text-xl font-bold text-text-primary">{bills.amount}</p>
            <p className="mt-s100 text-xs3 text-text-secondary">
              {bills.body} <span className="font-semibold">{bills.bodyStrong}</span>
            </p>
          </div>
          <Button variant="primary" disabled>
            {bills.cta}
          </Button>
        </div>
      </Card>
    </div>
  )
}

function DownloadButton() {
  return (
    <button
      type="button"
      aria-label="Download invoice"
      className="grid size-8 place-items-center rounded-s200 text-neutral-600 hover:bg-neutral-100"
    >
      <Icon name="upload" className="size-4 rotate-180" />
    </button>
  )
}

type SplTab = (typeof spl.tabs)[number]['id']
type SplRow = (typeof spl.rows)[number]

/** Seller Pay Later — Figma "SPL Requests", node 4001:187533 (page "1. Seller Pay Later"). */
export function SellerPayLater() {
  const [tab, setTab] = useState<SplTab>('requests')
  const [order, setOrder] = useState('')
  const [claimed, setClaimed] = useState(false)

  return (
    <ConsoleShell breadcrumb={spl.breadcrumb} activeNav="spl">
      <CreditHeader limit={spl.limitCard} bills={spl.billsCard} />

      <TabBar tabs={spl.tabs} value={tab} onChange={setTab} />

      {tab === 'claim' ? (
        <div className="grid grid-cols-1 gap-s300 xl:grid-cols-[2fr_1fr]">
          <Card>
            <SectionLabel>{spl.claim.title}</SectionLabel>
            <p className="mb-s300 text-xs3 text-text-secondary">{spl.claim.body}</p>

            {claimed ? (
              <div className="rounded-s200 bg-success-bg p-s300">
                <h3 className="text-xs2 font-semibold text-success">
                  {spl.claim.submittedTitle}
                </h3>
                <p className="mt-s100 text-xs3 text-text-secondary">{spl.claim.submittedBody}</p>
                <div className="mt-s300">
                  <Button variant="outline" onClick={() => setClaimed(false)}>
                    {spl.claim.title}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <SelectField
                  name="order"
                  label={spl.claim.orderLabel}
                  placeholder={spl.claim.orderPlaceholder}
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  options={spl.rows.map((r) => ({ value: r.order, label: r.order }))}
                  required
                />
                <div className="mt-s300">
                  <Button onClick={() => setClaimed(true)} disabled={!order}>
                    {spl.claim.submit}
                  </Button>
                </div>
              </>
            )}
          </Card>

          <Card className="h-fit">
            <SectionLabel>{spl.claim.payoutLabel}</SectionLabel>
            <Row label={spl.claim.amountLabel} value={spl.claim.amount} />
            <Row label={spl.claim.feeLabel} value={spl.claim.fee} />
            <div className="mt-s200 border-t border-neutral-200 pt-s200">
              <Row label={spl.claim.payoutLabel} value={spl.claim.payout} strong />
            </div>
            <p className="mt-s300 text-xs4 text-text-secondary">{spl.claim.accountLabel}</p>
            <p className="text-xs3 font-semibold text-text-primary">{spl.claim.account}</p>
          </Card>
        </div>
      ) : (
        <>
          <Toolbar searchPlaceholder={spl.searchPlaceholder}>
            <FilterPill label={filters.newest} />
          </Toolbar>

          <Card padded={false}>
            <DataTable<SplRow>
              columns={spl.columns}
              rows={tab === 'requests' ? spl.rows : []}
              empty={<EmptyState title={spl.emptyTitle} body={spl.emptyBody} />}
              render={(r, i) => cells(
                `${i + 1}.`,
                <span className="font-semibold whitespace-nowrap">{r.order}</span>,
                <span className="whitespace-nowrap">{r.requested}</span>,
                <span className="whitespace-nowrap">{r.updated}</span>,
                <span className="whitespace-nowrap">{r.payout}</span>,
                <Pill>{r.status}</Pill>,
                <DownloadButton />
              )}
              card={(r) => (
                <>
                  <div className="mb-s200 flex items-center gap-s200">
                    <span className="min-w-0 flex-1 truncate text-xs3 font-semibold">
                      {r.order}
                    </span>
                    <Pill>{r.status}</Pill>
                  </div>
                  <Row label={spl.columns[2]} value={r.requested} />
                  <Row label={spl.columns[4]} value={r.payout} strong />
                </>
              )}
            />
            <Pagination noun={spl.perPageNoun} />
          </Card>
        </>
      )}
    </ConsoleShell>
  )
}

type BplTab = (typeof bpl.tabs)[number]['id']
type BplRow = (typeof bpl.rows)[number]

/** Buyer Pay Later — Figma "BPL Billings", node 4001:198717 (page "2. Buyer Pay Later"). */
export function BuyerPayLater() {
  const [tab, setTab] = useState<BplTab>('billings')

  const rows =
    tab === 'billings'
      ? bpl.rows.filter((r) => r.status === 'Outstanding')
      : tab === 'history'
        ? bpl.rows.filter((r) => r.status === 'Repaid')
        : []

  return (
    <ConsoleShell breadcrumb={bpl.breadcrumb} activeNav="bpl">
      <CreditHeader limit={bpl.limitCard} bills={bpl.billsCard} />

      <TabBar tabs={bpl.tabs} value={tab} onChange={setTab} />

      <Toolbar searchPlaceholder={bpl.searchPlaceholder}>
        <FilterPill label={filters.newest} />
      </Toolbar>

      <Card padded={false}>
        <DataTable<BplRow>
          columns={bpl.columns}
          rows={rows}
          empty={<EmptyState title={bpl.emptyTitle} body={bpl.emptyBody} />}
          render={(r, i) => cells(
            `${i + 1}.`,
            <span className="font-semibold whitespace-nowrap">{r.bill}</span>,
            <span className="whitespace-nowrap">{r.order}</span>,
            <span className="whitespace-nowrap">{r.billed}</span>,
            <span className="whitespace-nowrap">{r.due}</span>,
            <span className="whitespace-nowrap">{r.amount}</span>,
            <Pill>{r.status}</Pill>,
            <DownloadButton />
          )}
          card={(r) => (
            <>
              <div className="mb-s200 flex items-center gap-s200">
                <span className="min-w-0 flex-1 truncate text-xs3 font-semibold">{r.bill}</span>
                <Pill>{r.status}</Pill>
              </div>
              <Row label={bpl.columns[2]} value={r.order} />
              <Row label={bpl.columns[4]} value={r.due} />
              <Row label={bpl.columns[5]} value={r.amount} strong />
            </>
          )}
        />
        <Pagination noun={bpl.perPageNoun} />
      </Card>
    </ConsoleShell>
  )
}

/** Biz Loan — Figma "BizLoan - Landing", node 4001:204677 (page "3. BizLoan"). */
export function BizLoan() {
  return (
    <ConsoleShell breadcrumb={bizLoan.breadcrumb} activeNav="bizloan">
      <div className="mb-s300 flex flex-wrap items-center gap-s200">
        <h1 className="text-lg font-bold text-text-primary">{bizLoan.title}</h1>
        <div className="ml-auto">
          <Button>{bizLoan.applyCta}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-s300 xl:grid-cols-[336px_1fr]">
        {/* Banner — the Figma frame uses an exported photograph here. */}
        <Card className="h-fit overflow-hidden" padded={false}>
          <div className="p-s300">
            <h2 className="text-md font-bold text-text-primary">{bizLoan.bannerTitle}</h2>
            <p className="mt-s200 text-xs3 text-text-secondary">{bizLoan.bannerBody}</p>
          </div>
          <div className="relative mx-s300 mb-s300 grid h-[180px] place-items-center overflow-hidden rounded-s200 bg-primary-25">
            <span className="absolute -top-6 -right-6 size-24 rounded-full bg-primary-100" />
            <span className="absolute bottom-4 left-5 h-8 w-16 rounded-full bg-primary-50" />
            <Icon name="banknote" className="relative size-16 text-primary-400" />
          </div>
        </Card>

        <div className="flex flex-col gap-s400">
          <section>
            <h3 className="mb-s300 text-xs2 font-semibold text-text-primary">
              {bizLoan.howTitle}
            </h3>
            <div className="grid grid-cols-1 gap-s300 md:grid-cols-3">
              {bizLoan.steps.map((s, i) => (
                <Step key={s.title} index={i + 1} title={s.title} body={s.body} />
              ))}
            </div>
          </section>

          <div className="h-px bg-neutral-200" />

          <section>
            <h3 className="mb-s300 text-xs2 font-semibold text-text-primary">
              {bizLoan.tipsTitle}
            </h3>
            <div className="grid grid-cols-1 gap-s300 md:grid-cols-2">
              {bizLoan.tips.map((s, i) => (
                <Step
                  key={s.title}
                  index={i + 1}
                  icon={i === 0 ? 'trending-up' : 'card'}
                  title={s.title}
                  body={s.body}
                />
              ))}
            </div>
          </section>

          <div className="h-px bg-neutral-200" />

          <p className="text-center text-xs4 text-text-secondary">{bizLoan.partner}</p>
        </div>
      </div>
    </ConsoleShell>
  )
}
