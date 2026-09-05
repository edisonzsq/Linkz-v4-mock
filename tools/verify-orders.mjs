/**
 * Behavioural check for the Order module rulings in `docs/order-answers.md`.
 *
 * The unit tests cover the money model; this covers the things only a browser
 * can show — that the empty list actually leads somewhere, that a created order
 * lands in the list and survives a reload, and that the report's range and
 * status filters really filter.
 *
 *   npm i --no-save playwright
 *   npm run build && npx vite preview --port 4174 &
 *   node tools/verify-orders.mjs
 *
 * Exits non-zero on any failure or console error.
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:4174'
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const out = []
const ok = (n, c, extra = '') => out.push(`${c ? 'PASS' : 'FAIL'}  ${n}${extra ? ' — ' + extra : ''}`)

const browser = await chromium.launch({ executablePath: EXE })
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))

async function goto(hash) {
  await page.goto(`${BASE}/#/${hash}`, { waitUntil: 'load' })
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())))
  await page.waitForTimeout(150)
}

// Start from a clean store.
await page.goto(BASE)
await page.evaluate(() => localStorage.clear())

// ---- Q4: the list starts empty and the empty state is the front door ----
await goto('sales-orders')
const emptyTitle = await page.getByText('No orders yet').count()
ok('Q4 sales list starts empty', emptyTitle === 1)
const ctaInEmpty = await page
  .locator('div', { hasText: 'No orders yet' })
  .getByRole('button', { name: 'Create Order' })
  .count()
ok('Q4 empty state carries a Create Order CTA', ctaInEmpty > 0)
const rowCount = await page.locator('table tbody tr').count()
ok('Q4 no seeded rows in the table', rowCount === 0, `rows=${rowCount}`)

await goto('purchase-orders')
ok('Q4 purchase list starts empty', (await page.getByText('No purchase orders yet').count()) === 1)

// ---- create an order and confirm it lands in the list ----
// The create screen is the V4 rebuild (Figma 4001:11308), so the buyer is a
// search/select in Buyer Info and the line items are edited in place.
await goto('order-new')
const sendBtn = page.getByRole('button', { name: 'Send Order' }).first()
ok('Send Order is disabled with no buyer', await sendBtn.isDisabled())

await page.locator('select[name=buyer]').selectOption('PT Maju Bersama')
await page.waitForTimeout(200)
await page.locator('input[name^=item-name-]').first().fill('Hazmat Suit')
await page.locator('input[name^=item-price-]').first().fill('1.000.000')
await page.waitForTimeout(250)
ok('Send Order enables once a buyer and a priced row exist', !(await sendBtn.isDisabled()))

const totalText = await page.getByText('IDR 1.000.000,00').first().count()
ok('the payment panel totals the row', totalText > 0)

await sendBtn.click()
await page.waitForTimeout(250)
ok('send asks for confirmation first', (await page.getByText('Send this order?').count()) === 1)
await page.getByRole('button', { name: 'Send Order' }).last().click()
await page.waitForTimeout(500)
ok('sending opens the order detail', page.url().includes('order-detail'), page.url())

await goto('sales-orders')
const rowsAfter = await page.locator('table tbody tr').count()
ok('created order appears in the list', rowsAfter === 1, `rows=${rowsAfter}`)
const statusPill = await page.locator('table tbody tr').first().innerText()
ok('created order is Invoiced with 1 invoice', /Invoiced/.test(statusPill), statusPill.replace(/\s+/g, ' ').slice(0, 120))
ok('grand total shown on the row', /1\.000\.000/.test(statusPill))

// ---- the order survives a reload (shared store) ----
await page.reload()
await page.waitForTimeout(300)
ok('order persists across reload', (await page.locator('table tbody tr').count()) === 1)

// ---- Q6: the report filters for real, and Last 7 days is populated ----
await goto('order-report')
const settleRows = await page.locator('table tbody tr').count()
ok('Q6 Last 7 days is populated by default', settleRows > 0, `rows=${settleRows}`)
const hasToday = await page.getByText(new RegExp(`${new Date().getDate()} ${['January','February','March','April','May','June','July','August','September','October','November','December'][new Date().getMonth()]}`)).count()
ok('Q6 rows are dated relative to today', hasToday > 0)

// pick "Today" and confirm the table shrinks
await page.getByRole('button', { name: /Last 7 days|Custom/ }).click()
await page.waitForTimeout(150)
await page.getByRole('button', { name: 'Today', exact: true }).click()
await page.getByRole('button', { name: 'Apply' }).click()
await page.waitForTimeout(200)
const todayRows = await page.locator('table tbody tr').count()
ok('Q6 narrowing the range actually filters', todayRows > 0 && todayRows < settleRows, `${settleRows} -> ${todayRows}`)

// ---- Q5: no status filter on the Payments tab ----
await page.getByRole('tab', { name: 'Settlement' }).click()
await page.waitForTimeout(100)
ok('Q5 status filter present on Settlement', (await page.getByLabel('All Status').count()) === 1)
await page.getByRole('tab', { name: 'Payments' }).click()
await page.waitForTimeout(150)
ok('Q5 status filter absent on Payments', (await page.getByLabel('All Status').count()) === 0)
const payHeaders = await page.locator('table thead th').allInnerTexts()
ok('Q5 Payments has no Status column', !payHeaders.includes('Status'), payHeaders.join('|'))

// ---- status filter on Settlement filters ----
await page.getByRole('tab', { name: 'Settlement' }).click()
await page.waitForTimeout(150)
await page.getByRole('button', { name: /Today|Last 7 days|Custom/ }).click()
await page.getByRole('button', { name: 'Last 7 days' }).click()
await page.getByRole('button', { name: 'Apply' }).click()
await page.waitForTimeout(150)
const allRows = await page.locator('table tbody tr').count()
await page.getByLabel('All Status').selectOption('Settled')
await page.waitForTimeout(150)
const settledRows = await page.locator('table tbody tr').count()
ok('Settlement status filter filters', settledRows < allRows, `${allRows} -> ${settledRows}`)

console.log(out.join('\n'))
console.log(errors.length ? '\nCONSOLE ERRORS:\n' + errors.join('\n') : '\nno console errors')
await browser.close()
process.exit(out.some((l) => l.startsWith('FAIL')) || errors.length ? 1 : 0)
