import { useState } from 'react'
import {
  Card,
  DataTable,
  EmptyState,
  FilterPill,
  NewChip,
  PageHeader,
  Pagination,
  Row,
  Toolbar,
} from '../../components/app/Console'
import { cells } from '../../components/app/consoleUtils'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { ConsoleShell } from '../../layouts/ConsoleShell'
import { filters, masterProducts as mp } from '../../data/appData'
import { useFlow } from '../../prototype/flowContext'
import { useSession, type UserId } from '../../prototype/sessionContext'
import { AddedBy } from '../../components/app/AddedBy'

type ProductRow = (typeof mp.rows)[number] & { addedBy?: UserId }

/** Master Products — Figma node 4033:50119 (page "4. Master Product"). */
export function MasterProducts() {
  const { go, set } = useFlow()
  const { shared, add } = useSession()
  const [selected, setSelected] = useState<string[]>([])

  const rows: ProductRow[] = [
    ...shared.products.map((r) => ({
      name: String(r.fields.name ?? ''),
      sku: String(r.fields.sku ?? ''),
      isNew: true,
      currency: String(r.fields.currency ?? 'IDR'),
      price: String(r.fields.price ?? '0,00'),
      category: String(r.fields.category ?? ''),
      catalogues: '0',
      addedBy: r.addedBy,
    })),
    ...mp.rows,
  ]

  /**
   * A product row opens the editor — Figma `4033:50139`, and the 3 Sep flow
   * check. The checkbox cell stops propagation so selecting is not the same
   * gesture as opening.
   */
  function openProduct(sku: string) {
    set({ editingSku: sku })
    go('product-edit')
  }

  function toggle(sku: string) {
    setSelected((s) => (s.includes(sku) ? s.filter((x) => x !== sku) : [...s, sku]))
  }

  const allSelected = selected.length === rows.length

  /**
   * Copies each selected product into the shared store with a fresh SKU, so the
   * copy is a distinct row both demo users can see. Suffixes the name the way a
   * duplicate reads in the design's list.
   */
  function duplicateSelected() {
    for (const sku of selected) {
      const src = rows.find((r) => r.sku === sku)
      if (!src) continue
      add('products', {
        name: `${src.name} (Copy)`,
        sku: `${src.sku}-C${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
        currency: src.currency,
        price: src.price,
        category: src.category,
      })
    }
    setSelected([])
  }

  return (
    <ConsoleShell breadcrumb={mp.breadcrumb} back="dashboard" activeNav="master-products">
      <PageHeader title={mp.title}>
        <Button variant="outline">
          <Icon name="save" className="size-4" />
          {mp.buttons.export}
        </Button>
        <Button onClick={() => go('product-new')}>{mp.buttons.create}</Button>
      </PageHeader>

      <Toolbar searchPlaceholder={mp.searchPlaceholder}>
        <FilterPill label={filters.allCategory} options={mp.categories} />
        <FilterPill label={filters.allCatalogues} />
        <FilterPill label={filters.newest} />
      </Toolbar>

      <Card padded={false}>
        <DataTable<ProductRow>
          columns={mp.columns}
          rows={rows}
          empty={<EmptyState title={mp.emptyTitle} body={mp.emptyBody} />}
          onRowClick={(r) => openProduct(r.sku)}
          render={(r, i) => cells(
            <input
              type="checkbox"
              aria-label={`Select ${r.name}`}
              checked={selected.includes(r.sku)}
              onChange={() => toggle(r.sku)}
              className="size-4 appearance-none rounded-[4px] border border-neutral-300 bg-white checked:border-primary-400 checked:bg-primary-400"
            />,
            `${i + 1}.`,
            <span className="flex items-center gap-s200">
              <span className="grid size-10 shrink-0 place-items-center rounded-s200 border border-neutral-200 text-neutral-400">
                <Icon name="package" className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-s200">
                  <span className="truncate font-semibold">{r.name}</span>
                  {r.isNew && <NewChip />}
                  {r.addedBy && <AddedBy by={r.addedBy} />}
                </span>
                <span className="block text-xs4 text-neutral-500">{r.sku}</span>
              </span>
            </span>,
            r.currency,
            <span className="whitespace-nowrap">{r.price}</span>,
            r.category,
            <span className="flex items-center gap-s100">
              {r.catalogues}
              <Icon name="chevron-down" className="size-3.5 text-neutral-500" />
            </span>,
            <button
              type="button"
              aria-label={`Edit ${r.name}`}
              onClick={() => openProduct(r.sku)}
              className="grid size-8 place-items-center rounded-s200 text-neutral-500 hover:bg-neutral-100"
            >
              <Icon name="edit" className="size-4" />
            </button>
          )}
          card={(r) => (
            <>
              <div className="mb-s200 flex items-center gap-s200">
                <span className="grid size-10 shrink-0 place-items-center rounded-s200 border border-neutral-200 text-neutral-400">
                  <Icon name="package" className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-s200">
                    <span className="truncate text-xs3 font-semibold">{r.name}</span>
                    {r.isNew && <NewChip />}
                    {r.addedBy && <AddedBy by={r.addedBy} />}
                  </span>
                  <span className="block text-xs4 text-neutral-500">{r.sku}</span>
                </span>
              </div>
              <Row label={mp.columns[4]} value={`${r.currency} ${r.price}`} strong />
              <Row label={mp.columns[5]} value={r.category} />
              <Row label={mp.columns[6]} value={r.catalogues} />
            </>
          )}
        />
        <Pagination noun={mp.perPageNoun} />
      </Card>

      {selected.length > 0 && (
        <div className="fixed inset-x-4 bottom-4 z-30 flex items-center gap-s300 rounded-s200 border border-neutral-200 bg-white p-s300 shadow-[0_12px_24px_-8px_rgba(16,24,40,.2)] lg:left-[calc(160px+1rem)]">
          <span className="text-xs3 font-semibold">
            {selected.length} selected{allSelected ? ' (all)' : ''}
          </span>
          <div className="ml-auto flex gap-s200">
            <Button variant="ghost" onClick={() => setSelected([])}>
              Clear
            </Button>
            {/* Figma 4033:50391 — Duplicate sits between Clear and Add to
                Catalogue. It writes real copies, so the list actually grows. */}
            <Button variant="outline" onClick={duplicateSelected}>
              Duplicate
            </Button>
            <Button>Add to Catalogue</Button>
          </div>
        </div>
      )}
    </ConsoleShell>
  )
}
