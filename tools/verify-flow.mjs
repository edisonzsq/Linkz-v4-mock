/**
 * Walks the flows from Edison's 3 Sep 2026 flow check
 * (`docs/flow-check-2026-09-03.md`) items 1-9 and 14.
 *
 *   npm i --no-save playwright
 *   npm run build && npx vite preview --port 4174 &
 *   node tools/verify-flow.mjs
 *
 * Exits non-zero on any failure or console error. Clears localStorage first.
 *
 * Note: KYC field labels sit in their own column rather than a <label for>, so
 * these select on `name=` rather than by label.
 */
import { chromium } from 'playwright'
const BASE = process.env.BASE || 'http://localhost:4174'
const out = []
const ok = (n, c, extra='') => out.push(`${c?'PASS':'FAIL'}  ${n}${extra?' — '+extra:''}`)
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } })
const errors = []
page.on('console', m => m.type()==='error' && errors.push(m.text()))
page.on('pageerror', e => errors.push(String(e)))
const goto = async h => { await page.goto(`${BASE}/#/${h}`, {waitUntil:'load'}); await page.waitForTimeout(200) }

await page.goto(BASE); await page.evaluate(() => localStorage.clear())

// ---- 1. Start Over asks first, and clears the email ----
await goto('basic-info')
await page.getByRole('button', { name: 'Start Over' }).click()
await page.waitForTimeout(150)
ok('1 Start Over asks for confirmation', await page.getByText('Start over?').isVisible())
await page.getByRole('button', { name: 'Cancel' }).click()
await page.waitForTimeout(120)
ok('1 Cancel keeps you on the form', (await page.getByText('Start over?').count()) === 0)
await page.getByRole('button', { name: 'Start Over' }).click()
await page.getByRole('button', { name: 'Start over', exact: true }).click()
await page.waitForTimeout(250)
ok('1 confirming lands on Create Account', page.url().includes('create-account'))

// ---- 2. Account-created popup is not a dead end ----
await goto('account-created')
ok('2 popup greets you on arrival', await page.getByText('Account Created!').isVisible())
await page.getByRole('button', { name: 'Close' }).click()
await page.waitForTimeout(200)
ok('2 X leaves you on the form, not stuck', (await page.getByText('Basic Information').count()) > 0)
const continueBtn = page.getByRole('button', { name: 'Continue' })
ok('2 there is a way forward after dismissing', await continueBtn.isVisible())

// ---- 3. Google SIGN-UP goes to Basic Info; LOGIN does not ----
await goto('create-account')
await page.getByRole('button', { name: /Continue with Google/i }).click()
await page.waitForTimeout(200)
await page.getByText('sanders@linkzasia.com').click()
await page.waitForTimeout(150)
await page.getByRole('button', { name: 'Continue' }).click()
await page.waitForTimeout(300)
ok('3 Google sign-up lands on Basic Info', page.url().includes('account-created'), page.url())

await goto('login')
await page.getByRole('button', { name: /Continue with Google/i }).click()
await page.waitForTimeout(200)
await page.getByText('sanders@linkzasia.com').click()
await page.waitForTimeout(150)
await page.getByRole('button', { name: 'Continue' }).click()
await page.waitForTimeout(300)
ok('3 Google log-in still goes straight in', page.url().includes('get-started'), page.url())

// ---- 4. Business type swaps the document set ----
await goto('kyc-business')
const docsOf = async () => (await page.locator('main, body').innerText()).replace(/\s+/g,' ')
let txt = await docsOf()
ok('4 personal asks for Personal ID', txt.includes('Personal ID') && txt.includes('Personal NPWP'))
await page.locator('select[name=registration]').selectOption('established')
await page.waitForTimeout(250)
txt = await docsOf()
ok('4 established asks for the Deed', txt.includes('Deed of Establishment') && txt.includes('Deed of Amendment'))
ok('4 established asks for Company NPWP/NIB', txt.includes('Company NPWP') && txt.includes('Company NIB'))
ok('4 personal documents are gone', !txt.includes('Personal ID'))
ok('4 the match note follows the type', txt.includes('Deed of Establishment, and bank account'))

// ---- 5. Industry "Other" reveals a field ----
await page.locator('select[name=industry]').selectOption('other')
await page.waitForTimeout(200)
ok('5 Other reveals a specify field', (await page.getByPlaceholder('Please specify the industry').count()) === 1)
await page.locator('select[name=industry]').selectOption('fmcg')
await page.waitForTimeout(200)
ok('5 the field disappears again', (await page.getByPlaceholder('Please specify the industry').count()) === 0)

// ---- 6/7. KYC from Get Started is the post-login variant, and completes step 1 ----
await goto('get-started')
await page.getByRole('button', { name: 'Verify Business' }).click()
await page.waitForTimeout(300)
let shell = (await page.locator('body').innerText()).replace(/\s+/g,' ')
ok('6 post-login KYC shows the breadcrumb', shell.includes('KYC Documents'), shell.slice(0,60))
ok('6 post-login KYC offers Cancel', (await page.getByRole('button',{name:'Cancel'}).count()) > 0)
ok('6 post-login KYC has no Skip for now', !shell.includes('Skip for now'))

await page.locator('input[name=companyName]').fill('Sinar Jaya')
await page.locator('select[name=industry]').selectOption('fmcg')
await page.getByRole('button', { name: 'Continue' }).click()
await page.waitForTimeout(250)
await page.locator('select[name=bank]').selectOption({ index: 1 })
await page.locator('input[name=accountNumber]').fill('1234567890')
await page.locator('input[name=accountName]').fill('Sinar Jaya')
await page.getByRole('button', { name: /Submit|Continue/ }).first().click()
await page.waitForTimeout(300)
await goto('get-started')
const started = (await page.locator('body').innerText()).replace(/\s+/g,' ')
const kycCard = await page.locator('article', { hasText: 'Verify Your Business' }).first().innerText()
ok('7 step 1 card itself reads Completed', /Completed/.test(kycCard), kycCard.replace(/\s+/g,' ').slice(0,90))
const orderCard = await page.locator('article', { hasText: 'Create Your First Order' }).first().innerText()
ok('7 an untouched step still reads Not started', !/Completed/.test(orderCard), orderCard.replace(/\s+/g,' ').slice(0,60))
ok('7 progress counter moved off zero', /1\s*\/\s*4|1 of 4/.test(started.replace(/\s+/g,' ')), (started.match(/\d\s*\/\s*4/) || ['none'])[0])

// ---- 8. More from LINKZ ----
ok('8 Invite Team Members card present', started.includes('Invite Team Members'))
ok('8 Help & Support card present', started.includes('Help & Support'))

// ---- 9. Dashboard in the onboarding sidebar ----
const navItems = await page.locator('aside nav button, nav button').allInnerTexts()
ok('9 sidebar has Dashboard', navItems.some(t => t.trim() === 'Dashboard'), navItems.map(t=>t.trim()).join('|'))
await page.getByRole('button', { name: 'Dashboard', exact: true }).first().click()
await page.waitForTimeout(300)
ok('9 Dashboard nav actually navigates', page.url().includes('dashboard'), page.url())

// ---- 14. Duplicate in the bulk bar ----
await goto('master-products')
const before = await page.locator('table tbody tr').count()
await page.locator('table tbody input[type=checkbox]').first().check()
await page.waitForTimeout(200)
const bulk = (await page.locator('body').innerText()).replace(/\s+/g,' ')
ok('14 bulk bar offers Duplicate', bulk.includes('Duplicate'))
const order = ['Clear','Duplicate','Add to Catalogue'].map(l => bulk.indexOf(l))
ok('14 Duplicate sits between Clear and Add to Catalogue', order[0] < order[1] && order[1] < order[2], order.join(','))
await page.getByRole('button', { name: 'Duplicate' }).click()
await page.waitForTimeout(300)
ok('14 Duplicate adds a row', (await page.locator('table tbody tr').count()) === before + 1, `${before} -> ${await page.locator('table tbody tr').count()}`)

console.log(out.join('\n'))
console.log(errors.length ? '\nCONSOLE ERRORS:\n'+errors.join('\n') : '\nno console errors')
await browser.close()
process.exit(out.some(l=>l.startsWith('FAIL')) || errors.length ? 1 : 0)
