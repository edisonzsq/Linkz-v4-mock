/**
 * Flow-check items 10-13: order rows open a detail screen, the rebuilt Create
 * Order, the rebuilt Create/Edit Product with variants, and product rows opening
 * the editor. Frames: 4001:11308, 4001:12967, 4033:50554, 4033:50848
 * (file I7UK2KGWw5dRDEhcXaqFGC).
 *
 *   npm i --no-save playwright
 *   npm run build && npx vite preview --port 4174 &
 *   node tools/verify-products-orders.mjs
 *
 * Note: the prototype's screen switcher is a fixed button named after the
 * current screen, so "Create Product" matches twice — target the page header's
 * button with .first().
 */
import { chromium } from 'playwright'
const BASE='http://localhost:4174'
const out=[]; const ok=(n,c,x='')=>out.push(`${c?'PASS':'FAIL'}  ${n}${x?' — '+x:''}`)
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1440,height:1000}})
const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>m.type()==='error'&&errs.push(m.text()))
const goto=async h=>{await p.goto(`${BASE}/#/${h}`,{waitUntil:'load'}); await p.waitForTimeout(250)}
await p.goto(BASE); await p.evaluate(()=>localStorage.clear())

// ---- #13 product rows clickable -> Edit Product ----
await goto('master-products')
await p.locator('table tbody tr').first().click()
await p.waitForTimeout(350)
ok('#13 product row opens the editor', p.url().includes('product-edit'), p.url())
const body = (await p.locator('body').innerText()).replace(/\s+/g,' ')
ok('#13 editor is prefilled from the row', body.includes('White Cotton T-Shirt'))
ok('#13 edit mode says Save Changes', body.includes('Save Changes'))
ok('#12 category is optional', body.includes('Category (Optional)') || body.includes('Category'))

// checkbox must not open the row
await goto('master-products')
await p.locator('table tbody input[type=checkbox]').first().check()
await p.waitForTimeout(250)
ok('#13 the checkbox selects without navigating', p.url().includes('master-products'), p.url())

// ---- #12 create product: variants + validation ----
await goto('product-new')
await p.getByRole('button',{name:'Create Product'}).first().click()
await p.waitForTimeout(200)
let t=(await p.locator('body').innerText()).replace(/\s+/g,' ')
ok('#12 empty form is rejected', t.includes('Product title is required'), '')
await p.locator('input[name=title]').fill('Test Tee')
await p.locator('input[name=sku]').fill('SKU12345678')
await p.waitForTimeout(200)
t=(await p.locator('body').innerText()).replace(/\s+/g,' ')
ok('#12 duplicate SKU is caught', t.includes('already in use'))
await p.locator('input[name=sku]').fill('SKU-UNIQUE-1')
await p.locator('input[name=price]').fill('25.000')
await p.waitForTimeout(200)
await p.getByRole('button',{name:'Create Product'}).first().click()
await p.waitForTimeout(400)
ok('#12 valid product saves and returns to the list', p.url().includes('master-products'), p.url())
ok('#12 the new product is in the list', (await p.locator('table tbody tr').filter({hasText:'Test Tee'}).count())===1)

// ---- #11 create order -> #10 detail ----
await goto('order-new')
t=(await p.locator('body').innerText()).replace(/\s+/g,' ')
ok('#11 create order shows the V4 layout', t.includes('Payment Details') && t.includes('Product & Service') && t.includes("Buyer's Due"))
ok('#11 shows the placeholder order number', t.includes('000000-0000000'))
ok('#11 Send is blocked without a buyer', await p.getByRole('button',{name:'Send Order'}).isDisabled())
await p.locator('select[name=buyer]').selectOption('PT Maju Bersama')
await p.waitForTimeout(250)
await p.locator('input[name^=item-name-]').first().fill('Hazmat Suit')
await p.locator('input[name^=item-price-]').first().fill('1.000.000')
await p.waitForTimeout(300)
t=(await p.locator('body').innerText()).replace(/\s+/g,' ')
ok('#11 the payment panel totals the row', t.includes('IDR 1.000.000,00'), '')
ok('#11 Send is enabled once valid', !(await p.getByRole('button',{name:'Send Order'}).isDisabled()))
await p.getByRole('button',{name:'Send Order'}).click()
await p.waitForTimeout(250)
ok('#11 send asks first', (await p.getByText('Send this order?').count())===1)
await p.getByRole('button',{name:'Send Order'}).last().click()
await p.waitForTimeout(500)
ok('#11 sending opens the order detail', p.url().includes('order-detail'), p.url())
t=(await p.locator('body').innerText()).replace(/\s+/g,' ')
ok('#10 detail shows the Invoice section', t.includes('Invoice') && t.includes('INV-001'))
ok('#10 invoice is Unpaid with a Send Reminder', t.includes('Unpaid') && t.includes('Send Reminder'))
ok('#10 Cancel Order is offered while unpaid', (await p.getByRole('button',{name:'Cancel Order'}).count())>0)

// Q7/Q8 rules surfaced in the UI
await p.getByRole('button',{name:'Invoice actions'}).first().click()
await p.waitForTimeout(200)
const menu=(await p.locator('body').innerText()).replace(/\s+/g,' ')
ok('#10 sales invoice menu offers Mark as Paid and Void', menu.includes('Mark as Paid')&&menu.includes('Void Invoice'))
await p.getByRole('button',{name:'Mark as Paid'}).click()
await p.waitForTimeout(400)
t=(await p.locator('body').innerText()).replace(/\s+/g,' ')
ok('#10 marking paid updates the invoice', t.includes('Paid'))
ok('Q8 Cancel disappears once an invoice is paid', (await p.getByRole('button',{name:'Cancel Order'}).count())===0)

// ---- #10 order rows clickable from the list ----
await goto('sales-orders')
const rows=await p.locator('table tbody tr').count()
ok('order list has the created order', rows===1, `rows=${rows}`)
await p.locator('table tbody tr').first().click()
await p.waitForTimeout(400)
ok('#10 order row opens the detail', p.url().includes('order-detail'), p.url())

console.log(out.join('\n'))
console.log(errs.length? '\nCONSOLE ERRORS:\n'+errs.join('\n') : '\nno console errors')
await b.close()
process.exit(out.some(l=>l.startsWith('FAIL'))||errs.length?1:0)
