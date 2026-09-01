import { chromium } from 'playwright'
import fs from 'node:fs'

const base = process.env.BASE || 'http://localhost:4173'
const screens = process.argv.slice(2)
const outDir = process.env.OUT || '/tmp/shots'
fs.mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const errors = []

for (const [name, w, h] of [['desktop', 1440, 900], ['mobile', 375, 824]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } })
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${name}] ${page.url().split('#')[1]}: ${m.text()}`) })
  page.on('pageerror', (e) => errors.push(`[${name}] ${page.url().split('#')[1]}: ${e.message}`))
  for (const s of screens) {
    await page.goto(`${base}/#/${s}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(180)
    await page.screenshot({ path: `${outDir}/${s}-${name}.png`, fullPage: name === 'desktop' })
  }
  await ctx.close()
}
await browser.close()
console.log(errors.length ? 'CONSOLE ERRORS:\n' + errors.join('\n') : 'no console errors')
