import { useMemo, useState } from 'react'
import { Card, PageHeader } from '../../components/app/Console'
import { Button } from '../../components/ui/Button'
import { SelectField, TextField } from '../../components/ui/Field'
import { Icon } from '../../components/ui/Icon'
import { ConsoleShell } from '../../layouts/ConsoleShell'
import { masterProducts as mp, productForm as f } from '../../data/appData'
import { useFlow } from '../../prototype/flowContext'
import { useSession } from '../../prototype/sessionContext'
import {
  MAX_OPTIONS,
  MAX_VARIATIONS,
  applyToAll,
  fallbackSku,
  filledOptions,
  hasErrors,
  newVariation,
  syncCombos,
  validate,
  type Combo,
  type Variation,
} from '../../state/products'

/**
 * Create / Edit Product — Figma `4033:50554`, `4033:50848`, `4033:53383`
 * (file `I7UK2KGWw5dRDEhcXaqFGC`).
 *
 * One component serves both, as the frames are the same screen with a different
 * title and primary action. Three things the 3 Sep flow check asked for:
 * **Category is optional**, **variants can be created**, and the **right column
 * is a live preview** that follows what is typed.
 */
export function ProductForm({ mode }: { mode: 'create' | 'edit' }) {
  const { go, state } = useFlow()
  const { shared, add } = useSession()
  const editing = mode === 'edit'

  /** The row being edited, matched by SKU carried in the flow state. */
  const source = useMemo(() => {
    if (!editing) return null
    const fromShared = shared.products.find((p) => String(p.fields.sku) === state.editingSku)
    if (fromShared) {
      return {
        name: String(fromShared.fields.name ?? ''),
        sku: String(fromShared.fields.sku ?? ''),
        category: String(fromShared.fields.category ?? ''),
        price: String(fromShared.fields.price ?? ''),
      }
    }
    return mp.rows.find((r) => r.sku === state.editingSku) ?? mp.rows[0]
  }, [editing, shared.products, state.editingSku])

  const [title, setTitle] = useState(source?.name ?? '')
  const [sku, setSku] = useState(source?.sku ?? '')
  const [category, setCategory] = useState(source?.category ?? '')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<number[]>(editing ? [1, 2, 3, 4, 5] : [])
  const [catalogues, setCatalogues] = useState<string[]>(editing ? [...f.sampleCatalogues] : [])
  const [costPrice, setCostPrice] = useState('')
  const [price, setPrice] = useState(source?.price ?? '')

  const [variantsEnabled, setVariantsEnabled] = useState(false)
  const [variations, setVariations] = useState<Variation[]>([])
  const [combos, setCombos] = useState<Combo[]>([])
  const [massPrice, setMassPrice] = useState('')
  const [massSku, setMassSku] = useState('')
  const [touched, setTouched] = useState(false)

  /** Every SKU except this product's own, so editing without renaming is fine. */
  const takenSkus = useMemo(
    () =>
      [...shared.products.map((p) => String(p.fields.sku ?? '')), ...mp.rows.map((r) => r.sku)].filter(
        (s) => s !== (source?.sku ?? ''),
      ),
    [shared.products, source],
  )

  const draft = { title, sku, price, variantsEnabled, variations, combos }
  const errors = validate(draft, takenSkus)
  const show = (k: keyof typeof errors) => (touched ? errors[k] : undefined)

  /** Rebuild the matrix whenever an axis changes, keeping what was typed. */
  function updateVariations(next: Variation[]) {
    setVariations(next)
    setCombos((prev) => syncCombos(next, prev))
  }

  function enableVariant() {
    if (variations.length >= MAX_VARIATIONS) return
    setVariantsEnabled(true)
    updateVariations([...variations, newVariation(variations.length + 1)])
  }

  function removeVariation(id: string) {
    const next = variations.filter((v) => v.id !== id)
    updateVariations(next)
    if (next.length === 0) setVariantsEnabled(false)
  }

  function setVariationName(id: string, name: string) {
    updateVariations(variations.map((v) => (v.id === id ? { ...v, name } : v)))
  }

  function setOption(id: string, index: number, value: string) {
    updateVariations(
      variations.map((v) => {
        if (v.id !== id) return v
        const options = [...v.options]
        options[index] = value
        // Keep one spare slot so there is always somewhere to type next.
        if (index === options.length - 1 && value.trim() && options.length < MAX_OPTIONS) {
          options.push('')
        }
        return { ...v, options }
      }),
    )
  }

  function removeOption(id: string, index: number) {
    updateVariations(
      variations.map((v) =>
        v.id === id
          ? { ...v, options: v.options.filter((_, i) => i !== index) }
          : v,
      ),
    )
  }

  function save() {
    setTouched(true)
    if (hasErrors(errors)) return
    add('products', {
      name: title.trim(),
      sku: sku.trim() || fallbackSku(),
      category,
      currency: 'IDR',
      price: variantsEnabled ? combos[0]?.price || '0,00' : price.trim() || '0,00',
    })
    go('master-products')
  }

  const variantCount = variantsEnabled && combos.length > 0 ? combos.length : 1

  return (
    <ConsoleShell
      breadcrumb={editing ? f.editBreadcrumb : f.createBreadcrumb}
      back="master-products"
      activeNav="master-products"
    >
      <PageHeader title={editing ? f.editTitle : f.createTitle}>
        <Button variant="outline" onClick={() => go('master-products')}>
          {f.cancel}
        </Button>
        <Button onClick={save} disabled={touched && hasErrors(errors)}>
          {editing ? f.saveCta : f.createCta}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-s400 xl:grid-cols-[minmax(0,1fr)_400px]">
        {/* ---------------------------------------------------- left column */}
        <div className="flex flex-col gap-s400">
          <Section icon="image" title={f.imageSection}>
            <div className="flex flex-wrap items-start gap-s200">
              <div className="flex h-[92px] w-[112px] shrink-0 flex-col justify-between rounded-s200 border border-neutral-200 p-s200">
                <p className="text-[10px] leading-[13px] text-text-secondary">{f.imageHelp}</p>
                <button
                  type="button"
                  onClick={() => setImages((v) => (v.length >= 5 ? v : [...v, v.length + 1]))}
                  className="rounded-s200 border border-primary-400 px-s200 py-1 text-xs4 font-semibold text-primary-400 hover:bg-primary-50"
                >
                  {f.addFile}
                </button>
              </div>
              {images.map((n, i) => (
                <div
                  key={n}
                  className="relative grid h-[92px] w-[112px] shrink-0 place-items-center overflow-hidden rounded-s200 border border-neutral-200 bg-neutral-100"
                >
                  <Icon name="image" className="size-6 text-neutral-400" />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded-[3px] bg-neutral-900/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {f.cover}
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={`Remove image ${i + 1}`}
                    onClick={() => setImages((v) => v.filter((x) => x !== n))}
                    className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-white/90 text-neutral-600 hover:bg-white"
                  >
                    <Icon name="x" className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          </Section>

          <Section icon="edit" title={f.infoSection}>
            <TextField
              name="title"
              label={f.title}
              required
              placeholder={f.titlePlaceholder}
              value={title}
              error={show('title')}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="grid grid-cols-1 gap-s300 sm:grid-cols-2">
              <TextField
                name="sku"
                label={f.sku}
                placeholder={f.skuPlaceholder}
                value={sku}
                error={show('sku')}
                onChange={(e) => setSku(e.target.value)}
              />
              {/* Optional — the flow check called out that it must not be required. */}
              <SelectField
                name="category"
                label={f.category}
                placeholder={f.categoryPlaceholder}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={mp.categories.map((c) => ({ value: c, label: c }))}
              />
            </div>

            <div className="flex flex-col gap-s100">
              <label htmlFor="description" className="text-xs3 font-medium text-text-primary">
                {f.description}
              </label>
              <div className="overflow-hidden rounded-s200 border border-neutral-300">
                <RichTextToolbar />
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  maxLength={500}
                  placeholder={f.descriptionPlaceholder}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full resize-y px-s300 py-s200 text-xs3 text-text-primary outline-none placeholder:text-neutral-400"
                />
                <p className="px-s300 pb-s200 text-right text-xs4 text-text-secondary">
                  {f.descriptionCounter(description.length)}
                </p>
              </div>
            </div>
          </Section>

          <Section icon="layout-grid" title={f.orgSection}>
            <SelectField
              name="catalogue"
              label={f.catalogue}
              placeholder={f.cataloguePlaceholder}
              value=""
              onChange={(e) => {
                const v = e.target.value
                if (v && !catalogues.includes(v)) setCatalogues((c) => [...c, v])
              }}
              options={f.catalogueOptions
                .filter((c) => !catalogues.includes(c))
                .map((c) => ({ value: c, label: c }))}
            />
            {catalogues.length > 0 && (
              <ol className="flex flex-col gap-s200">
                {catalogues.map((c, i) => (
                  <li key={c} className="flex items-center gap-s200 text-xs3">
                    <span className="text-text-secondary">{i + 1}.</span>
                    <span className="min-w-0 flex-1 truncate text-primary-500">{c}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${c}`}
                      onClick={() => setCatalogues((v) => v.filter((x) => x !== c))}
                      className="grid size-7 shrink-0 place-items-center rounded-s200 text-neutral-500 hover:bg-neutral-100"
                    >
                      <Icon name="trash" className="size-4" />
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </Section>

          <Section icon="package" title={f.pricingSection}>
            {/* The "Variants / + Enable Variant" bar, present in every frame. */}
            {variations.length < MAX_VARIATIONS && (
              <div className="flex items-center gap-s200 rounded-s200 border border-neutral-200 p-s300">
                <span className="text-xs3 text-text-primary">
                  {variations.length === 0
                    ? f.variants
                    : f.addVariation(variations.length + 1)}
                </span>
                <div className="ml-auto">
                  <Button variant="outline" onClick={enableVariant}>
                    {f.enableVariant}
                  </Button>
                </div>
              </div>
            )}

            <SelectField
              name="currency"
              label={f.currency}
              value="IDR"
              onChange={() => {}}
              options={[{ value: 'IDR', label: f.currencyValue }]}
            />

            <TextField
              name="costPrice"
              label={f.costPrice}
              leading={<span className="text-xs3 text-text-secondary">IDR</span>}
              placeholder={f.costPricePlaceholder}
              help={f.costPriceHelp}
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
            />

            {/* With variants on, each combination carries its own price instead. */}
            {!variantsEnabled && (
              <TextField
                name="price"
                label={f.price}
                required
                leading={<span className="text-xs3 text-text-secondary">IDR</span>}
                placeholder={f.pricePlaceholder}
                value={price}
                error={show('price')}
                onChange={(e) => setPrice(e.target.value)}
              />
            )}

            {variations.map((v, i) => (
              <VariationPanel
                key={v.id}
                index={i}
                variation={v}
                onName={(name) => setVariationName(v.id, name)}
                onOption={(idx, value) => setOption(v.id, idx, value)}
                onRemoveOption={(idx) => removeOption(v.id, idx)}
                onRemove={() => removeVariation(v.id)}
              />
            ))}

            {variantsEnabled && combos.length > 0 && (
              <>
                <MassUpdate
                  price={massPrice}
                  sku={massSku}
                  onPrice={setMassPrice}
                  onSku={setMassSku}
                  onApply={() => setCombos((c) => applyToAll(c, massPrice, massSku))}
                />
                <VariantMatrix
                  variations={variations}
                  combos={combos}
                  onChange={(key, patch) =>
                    setCombos((cs) => cs.map((c) => (c.key === key ? { ...c, ...patch } : c)))
                  }
                />
              </>
            )}

            {touched && errors.variants && (
              <p className="text-xs4 text-danger">{errors.variants}</p>
            )}
          </Section>
        </div>

        {/* --------------------------------------------------- right column */}
        <div className="xl:sticky xl:top-[88px] xl:h-fit">
          <Section icon="image" title={f.preview}>
            <div className="overflow-hidden rounded-s200 border border-neutral-200">
              <div className="grid h-[260px] place-items-center bg-neutral-50">
                <Icon name="image" className="size-10 text-neutral-400" />
              </div>
              <div className="flex flex-col gap-s200 p-s300">
                <p className="text-xs2 font-semibold text-text-primary">
                  {title.trim() || f.previewTitle}
                </p>
                <p className="text-xs4 text-text-secondary">
                  {f.previewSku}
                  {sku.trim() || f.none}
                </p>
                <div className="flex items-start justify-between gap-s300">
                  <span className="flex flex-col">
                    <span className="text-xs4 text-text-secondary">{f.previewCategory}</span>
                    <span className="text-xs4 text-text-primary">{category || f.none}</span>
                  </span>
                  <span className="flex flex-col text-right">
                    <span className="text-xs4 text-text-secondary">{f.previewVariant}</span>
                    <span className="text-xs4 text-text-primary">{variantCount}</span>
                  </span>
                </div>
                <p className="text-xs font-bold text-text-primary">
                  IDR {(variantsEnabled ? combos[0]?.price : price) || '0,00'}
                </p>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </ConsoleShell>
  )
}

export const CreateProduct = () => <ProductForm mode="create" />
export const EditProduct = () => <ProductForm mode="edit" />

/* ------------------------------------------------------------ sub-blocks */

/** Section header with the small outline icon the frames put beside each title. */
function Section({
  icon,
  title,
  children,
}: {
  icon: string
  title: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <div className="mb-s300 flex items-center gap-s200">
        <Icon name={icon} className="size-4 text-text-primary" />
        <h2 className="text-xs2 font-bold text-text-primary">{title}</h2>
      </div>
      <div className="flex flex-col gap-s300">{children}</div>
    </Card>
  )
}

/** Decorative — the frames show a full editor; this mock keeps a plain textarea. */
function RichTextToolbar() {
  const tools = ['bold', 'italic', 'underline', 'list', 'link', 'image']
  return (
    <div className="flex items-center gap-s100 border-b border-neutral-200 bg-neutral-50 px-s200 py-1.5">
      {tools.map((t) => (
        <span
          key={t}
          aria-hidden="true"
          className="grid size-7 place-items-center rounded-s200 text-neutral-500"
        >
          <Icon name={t} className="size-4" />
        </span>
      ))}
    </div>
  )
}

function VariationPanel({
  index,
  variation,
  onName,
  onOption,
  onRemoveOption,
  onRemove,
}: {
  index: number
  variation: Variation
  onName: (v: string) => void
  onOption: (index: number, value: string) => void
  onRemoveOption: (index: number) => void
  onRemove: () => void
}) {
  const used = filledOptions(variation).length
  return (
    <section className="flex flex-col gap-s300 rounded-s200 bg-neutral-50 p-s300">
      <div className="flex items-center gap-s200">
        <h3 className="text-xs3 font-bold text-text-primary">{f.variationTitle(index + 1)}</h3>
        <button
          type="button"
          aria-label={f.removeVariation}
          onClick={onRemove}
          className="ml-auto grid size-7 place-items-center rounded-s200 text-neutral-500 hover:bg-neutral-200"
        >
          <Icon name="x" className="size-4" />
        </button>
      </div>

      <TextField
        name={`variation-${index}`}
        label={f.variantName(index + 1)}
        required
        placeholder={f.variantNamePlaceholder}
        value={variation.name}
        onChange={(e) => onName(e.target.value)}
      />

      <div className="flex flex-col gap-s200">
        {variation.options.map((opt, i) => (
          <div key={i} className="flex items-end gap-s200">
            <span aria-hidden="true" className="mb-2 shrink-0 text-neutral-400">
              ⠿
            </span>
            {/* Only variation 1 carries the photo, per the note in the frame. */}
            {index === 0 && (
              <span className="mb-0.5 grid size-9 shrink-0 place-items-center rounded-s200 border border-neutral-200 bg-white text-neutral-400">
                <Icon name="image" className="size-4" />
              </span>
            )}
            <TextField
              name={`variation-${index}-option-${i}`}
              label={f.option(i + 1)}
              placeholder={f.optionPlaceholder}
              value={opt}
              onChange={(e) => onOption(i, e.target.value)}
              containerClassName="flex-1"
            />
            <button
              type="button"
              aria-label={`Remove option ${i + 1}`}
              onClick={() => onRemoveOption(i)}
              className="mb-0.5 grid size-9 shrink-0 place-items-center rounded-s200 text-neutral-500 hover:bg-neutral-200"
            >
              <Icon name="trash" className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs4 text-primary-500">
        {f.optionCount(used, MAX_OPTIONS)}
        {index === 0 ? ` ${f.photoNote}` : ''}
      </p>
    </section>
  )
}

function MassUpdate({
  price,
  sku,
  onPrice,
  onSku,
  onApply,
}: {
  price: string
  sku: string
  onPrice: (v: string) => void
  onSku: (v: string) => void
  onApply: () => void
}) {
  return (
    <section className="flex flex-col gap-s300 rounded-s200 border border-neutral-200 p-s300">
      <h3 className="text-xs3 font-bold text-text-primary">{f.massUpdate}</h3>
      <div className="flex flex-wrap items-end gap-s300">
        <TextField
          name="massPrice"
          label={f.variantPrice}
          required
          leading={<span className="text-xs3 text-text-secondary">IDR</span>}
          placeholder={f.pricePlaceholder}
          value={price}
          onChange={(e) => onPrice(e.target.value)}
          containerClassName="min-w-[180px] flex-1"
        />
        <TextField
          name="massSku"
          label={f.variantSku}
          required
          placeholder={f.skuPlaceholder}
          value={sku}
          onChange={(e) => onSku(e.target.value)}
          containerClassName="min-w-[180px] flex-1"
        />
        <Button variant="outline" onClick={onApply}>
          {f.applyToAll}
        </Button>
      </div>
    </section>
  )
}

function VariantMatrix({
  variations,
  combos,
  onChange,
}: {
  variations: Variation[]
  combos: Combo[]
  onChange: (key: string, patch: Partial<Combo>) => void
}) {
  const axes = variations.filter((v) => v.name.trim() && filledOptions(v).length > 0)
  return (
    <div className="overflow-x-auto rounded-s200 border border-neutral-200">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            {axes.map((v) => (
              <th key={v.id} scope="col" className="px-s300 py-s200 text-xs3 font-bold">
                {v.name}
              </th>
            ))}
            <th scope="col" className="px-s300 py-s200 text-xs3 font-bold">
              {f.matrixPrice} <span className="text-danger">*</span>
            </th>
            <th scope="col" className="px-s300 py-s200 text-xs3 font-bold">
              {f.matrixSku}
            </th>
          </tr>
        </thead>
        <tbody>
          {combos.map((c) => (
            <tr key={c.key} className="border-b border-neutral-200 last:border-0">
              {c.values.map((v, i) => (
                <td key={i} className="px-s300 py-s200 text-xs3 whitespace-nowrap">
                  {i === 0 ? (
                    <span className="flex items-center gap-s200">
                      <span className="grid size-8 shrink-0 place-items-center rounded-s200 border border-neutral-200 text-neutral-400">
                        <Icon name="image" className="size-4" />
                      </span>
                      {v}
                    </span>
                  ) : (
                    v
                  )}
                </td>
              ))}
              <td className="px-s300 py-s200">
                <TextField
                  name={`price-${c.key}`}
                  leading={<span className="text-xs3 text-text-secondary">IDR</span>}
                  placeholder="0,00"
                  value={c.price}
                  onChange={(e) => onChange(c.key, { price: e.target.value })}
                />
              </td>
              <td className="px-s300 py-s200">
                <TextField
                  name={`sku-${c.key}`}
                  placeholder={f.skuPlaceholder}
                  value={c.sku}
                  onChange={(e) => onChange(c.key, { sku: e.target.value })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
