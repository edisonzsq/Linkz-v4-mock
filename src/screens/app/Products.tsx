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
  SectionLabel,
  Toolbar,
} from '../../components/app/Console'
import { cells } from '../../components/app/consoleUtils'
import { Button } from '../../components/ui/Button'
import { SelectField, TextAreaField, TextField } from '../../components/ui/Field'
import { Icon } from '../../components/ui/Icon'
import { ConsoleShell } from '../../layouts/ConsoleShell'
import { filters, masterProducts as mp } from '../../data/appData'
import { useFlow } from '../../prototype/flowContext'
import { useSession, type UserId } from '../../prototype/sessionContext'
import { AddedBy } from '../../components/app/AddedBy'

type ProductRow = (typeof mp.rows)[number] & { addedBy?: UserId }

/** Master Products — Figma node 4033:50119 (page "4. Master Product"). */
export function MasterProducts() {
  const { go } = useFlow()
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

/** Create Product — the form behind the "Create Product" button on node 4033:50119. */
export function CreateProduct() {
  const { go } = useFlow()
  const { add } = useSession()
  const f = mp.form
  const [category, setCategory] = useState('')
  const [form, setForm] = useState<Record<string, string>>({})

  const field = (k: string) => ({
    value: form[k] ?? '',
    onChange: (e: { target: { value: string } }) => setForm((v) => ({ ...v, [k]: e.target.value })),
  })

  const canSave = Boolean(form.name?.trim() && form.sku?.trim() && category)

  function save() {
    if (!canSave) return
    add('products', {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category,
      currency: 'IDR',
      price: form.price?.trim() || '0,00',
    })
    go('master-products')
  }

  return (
    <ConsoleShell breadcrumb={f.breadcrumb} back="master-products" activeNav="master-products">
      <PageHeader title={f.title}>
        <Button variant="ghost" onClick={() => go('master-products')}>
          {f.cancel}
        </Button>
        <Button onClick={save} disabled={!canSave}>
          {f.save}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-s300 xl:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-s300">
          <Card>
            <SectionLabel>{f.detailsSection}</SectionLabel>

            <div className="mb-s300 flex flex-wrap items-start gap-s300">
              <span className="grid size-24 shrink-0 place-items-center rounded-s200 bg-primary-25 text-primary-400">
                <Icon name="package" className="size-8" />
              </span>
              <div className="min-w-0">
                <p className="text-xs3 font-semibold text-text-primary">{f.imageLabel}</p>
                <p className="mt-s100 text-xs4 text-text-secondary">{f.imageHelp}</p>
                <div className="mt-s200">
                  <Button variant="outline">
                    <Icon name="upload" className="size-4" />
                    {f.upload}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-s300 sm:grid-cols-2">
              <TextField name="name" label={f.name} placeholder={f.namePlaceholder} required {...field('name')} />
              <TextField name="sku" label={f.sku} placeholder={f.skuPlaceholder} required {...field('sku')} />
              <SelectField
                name="category"
                label={f.category}
                placeholder={f.categoryPlaceholder}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={mp.categories.map((c) => ({ value: c, label: c }))}
                required
              />
            </div>

            <div className="mt-s300">
              <TextAreaField
                name="description"
                label={f.description}
                placeholder={f.descriptionPlaceholder}
                rows={3}
              />
            </div>
          </Card>

          <Card>
            <SectionLabel>{f.pricingSection}</SectionLabel>
            <div className="grid grid-cols-1 gap-s300 sm:grid-cols-2">
              <TextField name="currency" label={f.currency} defaultValue="IDR" readOnly />
              <TextField
                name="price"
                label={f.price}
                placeholder={f.pricePlaceholder}
                inputMode="decimal"
                required
                {...field('price')}
              />
            </div>
          </Card>

          <Card>
            <SectionLabel>{f.stockSection}</SectionLabel>
            <div className="grid grid-cols-1 gap-s300 sm:grid-cols-2">
              <TextField name="stock" label={f.stock} placeholder="0" inputMode="numeric" />
              <TextField name="minStock" label={f.minStock} placeholder="0" inputMode="numeric" />
            </div>
          </Card>
        </div>

        <Card className="h-fit">
          <SectionLabel>{f.title}</SectionLabel>
          <p className="text-xs3 text-text-secondary">
            Products you create here become available to add to any catalogue you share with
            buyers.
          </p>
          <div className="mt-s300 flex flex-col gap-s200">
            <Button onClick={save} disabled={!canSave}>
              {f.save}
            </Button>
            <Button variant="ghost" onClick={() => go('master-products')}>
              {f.cancel}
            </Button>
          </div>
        </Card>
      </div>
    </ConsoleShell>
  )
}
