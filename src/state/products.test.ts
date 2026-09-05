import { describe, expect, it } from 'vitest'
import {
  applyToAll,
  combinations,
  comboKey,
  isDuplicateSku,
  isPositiveAmount,
  newVariation,
  syncCombos,
  validate,
  type Variation,
} from './products'

function variation(name: string, ...options: string[]): Variation {
  return { id: name, name, options: [...options, '', ''] }
}

describe('combinations', () => {
  it('is empty until something is fillable', () => {
    expect(combinations([])).toEqual([])
    expect(combinations([newVariation(1)])).toEqual([])
    // Named but with no options is still nothing to price.
    expect(combinations([variation('Color')])).toEqual([])
  })

  it('does not produce a phantom empty row', () => {
    // A naive cartesian reduce seeds with [[]] and returns one empty
    // combination, which renders as a priced row for a product with no variants.
    expect(combinations([{ id: 'a', name: '', options: ['', ''] }])).toHaveLength(0)
  })

  it('lists one row per option of a single variation', () => {
    expect(combinations([variation('Color', 'White', 'Black')])).toEqual([['White'], ['Black']])
  })

  it('multiplies two variations, first varying slowest', () => {
    const rows = combinations([variation('Color', 'White', 'Black'), variation('Size', 'S-M', 'L-XL')])
    expect(rows).toEqual([
      ['White', 'S-M'],
      ['White', 'L-XL'],
      ['Black', 'S-M'],
      ['Black', 'L-XL'],
    ])
  })

  it('multiplies three variations', () => {
    const rows = combinations([
      variation('Color', 'White', 'Black'),
      variation('Size', 'S', 'M', 'L'),
      variation('Fit', 'Slim', 'Regular'),
    ])
    expect(rows).toHaveLength(12)
  })

  it('ignores blank option slots', () => {
    expect(combinations([{ id: 'c', name: 'Color', options: ['White', '', 'Black', ''] }])).toEqual([
      ['White'],
      ['Black'],
    ])
  })

  it('skips an unnamed variation rather than treating it as an axis', () => {
    const rows = combinations([variation('Color', 'White'), { id: 'x', name: '', options: ['S', 'M'] }])
    expect(rows).toEqual([['White']])
  })
})

describe('syncCombos', () => {
  const vars = [variation('Color', 'White', 'Black'), variation('Size', 'S', 'M')]

  it('keeps prices already typed against surviving combinations', () => {
    const first = syncCombos(vars, [])
    first[0].price = '10.000'
    first[0].sku = 'A-1'
    const again = syncCombos(vars, first)
    expect(again[0].price).toBe('10.000')
    expect(again[0].sku).toBe('A-1')
  })

  it('drops rows whose combination no longer exists', () => {
    const priced = syncCombos(vars, []).map((c) => ({ ...c, price: '5.000' }))
    const narrowed = syncCombos([variation('Color', 'White'), variation('Size', 'S', 'M')], priced)
    expect(narrowed).toHaveLength(2)
    expect(narrowed.every((c) => c.values[0] === 'White')).toBe(true)
  })

  it('adds new rows blank rather than inheriting a neighbour price', () => {
    const priced = syncCombos([variation('Color', 'White')], []).map((c) => ({ ...c, price: '9.000' }))
    const widened = syncCombos([variation('Color', 'White', 'Black')], priced)
    expect(widened[0].price).toBe('9.000')
    expect(widened[1].price).toBe('')
  })

  it('keys rows by their values', () => {
    expect(comboKey(['White', 'S-M'])).toBe('White / S-M')
  })
})

describe('applyToAll', () => {
  const combos = syncCombos([variation('Color', 'White', 'Black')], [])

  it('sets the price on every row', () => {
    expect(applyToAll(combos, '25.000', '').map((c) => c.price)).toEqual(['25.000', '25.000'])
  })

  it('suffixes the SKU so rows stay distinct', () => {
    // A single SKU repeated across rows is not a usable SKU.
    expect(applyToAll(combos, '', 'TSHIRT').map((c) => c.sku)).toEqual(['TSHIRT-01', 'TSHIRT-02'])
  })

  it('leaves a column alone when its field is blank', () => {
    const seeded = combos.map((c) => ({ ...c, price: '1.000', sku: 'KEEP' }))
    const out = applyToAll(seeded, '', '')
    expect(out.map((c) => c.price)).toEqual(['1.000', '1.000'])
    expect(out.map((c) => c.sku)).toEqual(['KEEP', 'KEEP'])
  })
})

describe('validation — the three designed error states', () => {
  const base = {
    title: 'White Cotton T-Shirt',
    sku: 'SKU-NEW',
    price: '10.000',
    variantsEnabled: false,
    variations: [],
    combos: [],
  }

  it('requires a title (4033:51658)', () => {
    expect(validate({ ...base, title: '  ' }, []).title).toBeTruthy()
  })

  it('rejects a duplicate SKU, case-insensitively (4033:51862)', () => {
    expect(validate({ ...base, sku: 'sku12345678' }, ['SKU12345678']).sku).toBeTruthy()
    expect(validate(base, ['SKU12345678']).sku).toBeUndefined()
  })

  it('allows a blank SKU — it is optional in the frame', () => {
    expect(isDuplicateSku('', ['SKU1'])).toBe(false)
  })

  it('rejects a missing or zero price (4033:51760)', () => {
    expect(validate({ ...base, price: '' }, []).price).toBeTruthy()
    expect(validate({ ...base, price: '0' }, []).price).toBeTruthy()
    expect(validate({ ...base, price: '0,00' }, []).price).toBeTruthy()
  })

  it('does not ask for a base price once variants carry their own', () => {
    const combos = syncCombos([variation('Color', 'White')], []).map((c) => ({ ...c, price: '5.000' }))
    const errors = validate(
      { ...base, price: '', variantsEnabled: true, variations: [variation('Color', 'White')], combos },
      [],
    )
    expect(errors.price).toBeUndefined()
    expect(errors.variants).toBeUndefined()
  })

  it('asks for a price on every variant row', () => {
    const combos = syncCombos([variation('Color', 'White', 'Black')], [])
    combos[0].price = '5.000'
    const errors = validate(
      { ...base, price: '', variantsEnabled: true, variations: [variation('Color', 'White', 'Black')], combos },
      [],
    )
    expect(errors.variants).toBeTruthy()
  })

  it('complains when variants are on but nothing is fillable yet', () => {
    const errors = validate(
      { ...base, price: '', variantsEnabled: true, variations: [newVariation(1)], combos: [] },
      [],
    )
    expect(errors.variants).toBeTruthy()
  })

  it('reads Indonesian amounts', () => {
    expect(isPositiveAmount('1.500.000')).toBe(true)
    expect(isPositiveAmount('0,00')).toBe(false)
    expect(isPositiveAmount('abc')).toBe(false)
  })
})
