import { useState } from 'react'
import { Card, Row, SectionLabel } from '../../components/app/Console'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { ConsoleShell } from '../../layouts/ConsoleShell'
import { checkout as ck } from '../../data/appData'
import { useFlow } from '../../prototype/flowContext'

/** Party card — buyer on the left, seller on the right (Figma node 4001:18536). */
function PartyCard({
  party,
  verified,
  children,
}: {
  party: typeof ck.buyer | typeof ck.seller
  verified?: boolean
  children?: React.ReactNode
}) {
  return (
    <Card>
      <div className="mb-s300 flex items-center gap-s200">
        <span className="grid size-8 shrink-0 place-items-center rounded-s200 bg-primary-25 text-primary-400">
          <Icon name="building" className="size-4" />
        </span>
        <h3 className="min-w-0 truncate text-xs2 font-bold text-text-primary">{party.company}</h3>
        {verified && <Icon name="circle-check" className="size-4 shrink-0 text-primary-400" />}
      </div>

      <p className="text-xs3 font-semibold text-text-primary">{party.person}</p>
      <p className="mt-s100 flex flex-wrap items-center gap-s200 text-xs3 text-text-secondary">
        <span>{party.phone}</span>
        <span className="text-neutral-300">|</span>
        <span>{party.email}</span>
      </p>

      <p className="mt-s300 text-xs3 font-semibold text-text-primary">{party.addressLabel}</p>
      <p className="mt-s100 flex flex-wrap items-center gap-s200 text-xs3 text-text-secondary">
        <span>{party.addressPerson}</span>
        <span className="text-neutral-300">|</span>
        <span>{party.addressPhone}</span>
      </p>
      <p className="mt-s100 text-xs3 text-text-secondary">{party.address}</p>

      {children}
    </Card>
  )
}

/** Checkout — Figma node 4001:18536 (page "2. Order Management"). */
export function Checkout() {
  const { go } = useFlow()
  const [method, setMethod] = useState('bri')
  const [open, setOpen] = useState<string | null>('cards')
  const [paid, setPaid] = useState(false)

  if (paid) {
    return (
      <ConsoleShell breadcrumb={ck.breadcrumb} back="purchase-orders" activeNav="purchase-orders">
        <Card className="mx-auto max-w-[520px] text-center">
          <span className="mx-auto mb-s300 grid size-12 place-items-center rounded-full bg-success-bg text-success">
            <Icon name="check" strokeWidth={2.4} className="size-6" />
          </span>
          <h2 className="text-md font-bold text-text-primary">{ck.paidTitle}</h2>
          <p className="mt-s200 text-xs3 text-text-secondary">{ck.paidBody}</p>
          <div className="mt-s400">
            <Button onClick={() => go('purchase-orders')}>{ck.paidCta}</Button>
          </div>
        </Card>
      </ConsoleShell>
    )
  }

  return (
    <ConsoleShell breadcrumb={ck.breadcrumb} back="purchase-orders" activeNav="purchase-orders">
      <div className="grid grid-cols-1 gap-s400 pb-20 xl:grid-cols-2">
        {/* ---- left column ---- */}
        <div className="flex flex-col gap-s300">
          <section>
            <SectionLabel>{ck.shippingTitle}</SectionLabel>
            <PartyCard party={ck.buyer}>
              <div className="mt-s300 flex flex-wrap gap-s200">
                <Button>
                  <Icon name="plus" className="size-4" />
                  {ck.buyer.newAddress}
                </Button>
                <Button variant="ghost">{ck.buyer.changeAddress}</Button>
              </div>
            </PartyCard>
          </section>

          <section>
            <SectionLabel>{ck.paymentTitle}</SectionLabel>
            <p className="mb-s200 text-xs3 text-text-secondary">{ck.paymentSubtitle}</p>

            <Card padded={false}>
              {ck.methods.map((m, i) => {
                const expandable = 'options' in m && m.options
                const expanded = open === m.id
                return (
                  <div
                    key={m.id}
                    className={i > 0 ? 'border-t border-neutral-200' : undefined}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        expandable ? setOpen(expanded ? null : m.id) : setMethod(m.id)
                      }
                      aria-expanded={expandable ? expanded : undefined}
                      className="flex w-full items-center gap-s300 p-s300 text-left hover:bg-neutral-50"
                    >
                      <Icon name={m.icon} className="size-5 shrink-0 text-text-secondary" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs3 font-semibold text-text-primary">
                          {m.label}
                        </span>
                        <span className="block text-xs4 text-text-secondary">{m.description}</span>
                      </span>
                      {expandable ? (
                        <Icon
                          name={expanded ? 'chevron-up' : 'chevron-down'}
                          className="size-4 shrink-0 text-neutral-500"
                        />
                      ) : (
                        <Radio checked={method === m.id} />
                      )}
                    </button>

                    {expandable && expanded && (
                      <div className="pb-s200">
                        {m.options?.map((o) => (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => setMethod(o.id)}
                            className="flex w-full items-center gap-s300 border-t border-neutral-200 py-s300 pr-s300 pl-s500 text-left hover:bg-neutral-50"
                          >
                            <span className="grid size-6 shrink-0 place-items-center rounded-s200 border border-neutral-200 text-xs4 font-bold text-primary-400">
                              {o.label.slice(0, 2).toUpperCase()}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-xs3 font-semibold text-text-primary">
                                {o.label}
                              </span>
                              <span className="block text-xs4 text-text-secondary">
                                {o.description}
                              </span>
                            </span>
                            <Radio checked={method === o.id} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </Card>
          </section>
        </div>

        {/* ---- right column ---- */}
        <div className="flex flex-col gap-s300">
          <section>
            <SectionLabel>{ck.sellerTitle}</SectionLabel>
            <PartyCard party={ck.seller} verified />
          </section>

          <section>
            <SectionLabel>{ck.summaryTitle}</SectionLabel>
            <Card padded={false}>
              <div className="flex items-start gap-s300 p-s300">
                <span className="grid size-14 shrink-0 place-items-center rounded-s200 bg-neutral-100 text-neutral-400">
                  <Icon name="package" className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs3 font-semibold text-text-primary">{ck.item.name}</p>
                  <p className="text-xs4 text-text-secondary">{ck.item.sku}</p>
                  <p className="text-xs4 text-text-secondary">
                    {ck.item.qty} • {ck.item.unit}
                  </p>
                </div>
                <p className="shrink-0 text-xs2 font-bold text-text-primary">{ck.item.total}</p>
              </div>

              <div className="border-t border-neutral-200 px-s300 py-s200">
                <Row label={ck.summary.subtotal} value={ck.summary.subtotalValue} />
                <Row label={ck.summary.delivery} value={ck.summary.deliveryValue} />
                <Row label={ck.summary.discount} value={ck.summary.discountValue} />
                <Row label={ck.summary.taxes} value={ck.summary.taxesValue} />
              </div>

              <div className="flex items-center justify-between gap-s300 bg-primary-50/60 px-s300 py-s300">
                <span className="text-xs3 font-semibold text-text-primary">
                  {ck.summary.payable}
                </span>
                <span className="text-xs2 font-bold text-text-primary">
                  {ck.summary.payableValue}
                </span>
              </div>
            </Card>
          </section>
        </div>
      </div>

      {/*
       * Sticky total bar — the design pins this to the bottom of the frame.
       * The prototype's screen switcher is fixed bottom-right, so the bar
       * reserves room for it: a right inset on wide screens, and extra bottom
       * padding on narrow ones where the switcher sits over the full width.
       */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white px-4 pt-s300 pb-[72px] sm:pb-s300 lg:left-40 lg:pr-[210px]">
        <div className="flex flex-wrap items-center gap-s300">
          <div className="ml-auto flex items-center gap-s300">
            <span className="text-xs3 text-text-secondary">{ck.totalLabel}</span>
            <span className="text-xs2 font-bold text-text-primary">{ck.totalValue}</span>
          </div>
          <Button className="w-full sm:w-auto" onClick={() => setPaid(true)}>
            {ck.proceed}
          </Button>
        </div>
      </div>
    </ConsoleShell>
  )
}

function Radio({ checked }: { checked: boolean }) {
  return (
    <span
      className={`grid size-4 shrink-0 place-items-center rounded-full border ${
        checked ? 'border-primary-400' : 'border-neutral-300'
      }`}
    >
      {checked && <span className="size-2 rounded-full bg-primary-400" />}
    </span>
  )
}
