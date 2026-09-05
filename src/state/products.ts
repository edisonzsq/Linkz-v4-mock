/**
 * Master Product variant model.
 *
 * From Figma `4033:53147` / `4033:53383` / `4033:53718` (Create Product with
 * 1–3 variations) and `4033:51964` / `4033:52460` (Edit Product with variants),
 * file `I7UK2KGWw5dRDEhcXaqFGC`.
 *
 * Kept free of React so the combination maths can be tested directly — getting
 * it wrong silently produces the wrong number of priced rows, which is the kind
 * of thing nobody notices until a catalogue is priced.
 */

/** A variation axis: "Color" with options White / Black. */
export type Variation = {
  id: string
  name: string
  /** Fixed-length list; blank entries are placeholders the user has not filled. */
  options: string[]
}

/** One priced cell of the matrix — a combination of one option per variation. */
export type Combo = {
  /** Stable identity: the chosen option values joined. */
  key: string
  values: string[]
  price: string
  sku: string
}

/** The design caps each variation at ten options and shows "n/10 options". */
export const MAX_OPTIONS = 10
/** "Add Variations 3" is the last one the frames offer. */
export const MAX_VARIATIONS = 3

export function newVariation(index: number): Variation {
  return {
    id: `var-${index}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    // The frames start a fresh variation with three option slots.
    options: ['', '', ''],
  }
}

/** Only filled options take part in the matrix. */
export function filledOptions(v: Variation): string[] {
  return v.options.map((o) => o.trim()).filter(Boolean)
}

/** Variations that can contribute a column — named, with at least one option. */
export function activeVariations(variations: Variation[]): Variation[] {
  return variations.filter((v) => v.name.trim() !== '' && filledOptions(v).length > 0)
}

/**
 * Cartesian product of the filled options, in variation order.
 *
 * `[]` when nothing is fillable yet, rather than `[[]]` — a single empty
 * combination would render one phantom priced row.
 */
export function combinations(variations: Variation[]): string[][] {
  const axes = activeVariations(variations).map(filledOptions)
  if (axes.length === 0) return []
  return axes.reduce<string[][]>(
    (rows, axis) => rows.flatMap((row) => axis.map((o) => [...row, o])),
    [[]],
  )
}

export const comboKey = (values: string[]) => values.join(' / ')

/**
 * Rebuilds the matrix after an edit, keeping the price and SKU already typed
 * against any combination that still exists. Renaming an option is therefore a
 * destructive act for that row only, not for the whole table.
 */
export function syncCombos(variations: Variation[], previous: Combo[]): Combo[] {
  const byKey = new Map(previous.map((c) => [c.key, c]))
  return combinations(variations).map((values) => {
    const key = comboKey(values)
    const kept = byKey.get(key)
    return { key, values, price: kept?.price ?? '', sku: kept?.sku ?? '' }
  })
}

/** The Mass Update Table's "Apply to All" — blank fields leave that column alone. */
export function applyToAll(combos: Combo[], price: string, sku: string): Combo[] {
  return combos.map((c, i) => ({
    ...c,
    price: price.trim() ? price : c.price,
    // One SKU across every row would not be unique, so it is suffixed per row.
    sku: sku.trim() ? `${sku.trim()}-${String(i + 1).padStart(2, '0')}` : c.sku,
  }))
}

/* ------------------------------------------------------------- validation */

export type ProductDraft = {
  title: string
  sku: string
  price: string
  variantsEnabled: boolean
  variations: Variation[]
  combos: Combo[]
}

export type ProductErrors = {
  title?: string
  sku?: string
  price?: string
  variants?: string
}

/** Figma `4033:51862` — a SKU already in use is rejected. Case-insensitive. */
export function isDuplicateSku(sku: string, taken: string[]): boolean {
  const s = sku.trim().toLowerCase()
  if (!s) return false
  return taken.some((t) => t.trim().toLowerCase() === s)
}

/**
 * `4033:51658` (Empty Required), `4033:51760` (Invalid Price),
 * `4033:51862` (SKU Duplicated).
 *
 * Price is required only when variants are off — with variants on, each row of
 * the matrix carries its own price instead.
 */
export function validate(draft: ProductDraft, takenSkus: string[]): ProductErrors {
  const errors: ProductErrors = {}
  if (!draft.title.trim()) errors.title = 'Product title is required'
  if (isDuplicateSku(draft.sku, takenSkus)) errors.sku = 'This SKU is already in use'

  if (draft.variantsEnabled) {
    if (draft.combos.length === 0) {
      errors.variants = 'Name each variation and give it at least one option'
    } else if (draft.combos.some((c) => !isPositiveAmount(c.price))) {
      errors.variants = 'Every variant needs a price above zero'
    }
  } else if (!isPositiveAmount(draft.price)) {
    errors.price = 'Enter a price above zero'
  }
  return errors
}

/** Indonesian format, so this goes through the same parser the orders use. */
export function isPositiveAmount(v: string): boolean {
  if (!v.trim()) return false
  const n = Number(String(v).replace(/[^\d,-]/g, '').replace(',', '.'))
  return Number.isFinite(n) && n > 0
}

export const hasErrors = (e: ProductErrors) => Object.keys(e).length > 0

/** SKU is optional in the frame, but the list keys on it, so one is minted. */
export function fallbackSku(): string {
  return `SKU${Date.now().toString().slice(-8)}`
}
