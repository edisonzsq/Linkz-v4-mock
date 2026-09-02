# tools/

## screenshot.mjs

Renders every prototype screen at 1440×900 and 375×824 and reports console
errors — the sanity check used before pushing.

Playwright is deliberately **not** a dependency of this project: Vercel installs
devDependencies during the build, and Playwright's postinstall would try to
download browsers there. Install it only when you want to run this check:

```bash
npm i --no-save playwright
npm run build && npx vite preview --port 4174 &
BASE=http://localhost:4174 OUT=/tmp/shots node tools/screenshot.mjs dashboard spl profile
```

Pass screen ids (the hash routes) as arguments; omit none — there is no default
list. On this container Chromium is preinstalled, which is why the script points
`executablePath` at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Drop
that option to use a locally installed Playwright browser instead.

## build-questions-docx.py

Regenerates `docs/Order module - open questions.docx` — the answer sheet sent to the
author of the Order behaviour handover. `docs/order-open-questions.md` is the readable
source of record; this script is what turns it into something a non-technical reviewer can
fill in, so **edit the questions in both places** if they change.

```sh
pip install python-docx
python3 tools/build-questions-docx.py
```

Two things to know if you touch it:

- **OOXML child order is strict.** `w:shd`, `w:tcBorders`, `w:tcMar` and friends must appear
  in schema sequence inside `tcPr` / `pPr` / `tblPr`. python-docx will happily write them
  out of order and still reopen the file, but Word and LibreOffice both refuse to load it.
  `insert_ordered()` exists for exactly this — use it instead of `parent.append()`.
- **Column widths need `set_widths()`.** Setting `cell.width` alone does nothing; the table
  also needs a fixed `w:tblLayout` and a matching `w:tblGrid`.

To check a change actually renders, convert and eyeball it — `libreoffice-core` alone cannot
open .docx, you need the Writer module:

```sh
apt-get install -y libreoffice-writer
soffice --headless --convert-to pdf --outdir /tmp/out "docs/Order module - open questions.docx"
```

## verify-orders.mjs

Behavioural check for the Order module rulings recorded in `docs/order-answers.md`. The unit
tests cover the money model; this covers what only a browser shows — that the empty order
list actually leads somewhere, that a created order lands in the list and survives a reload,
and that the Order Report's date range and status filters really filter.

```sh
npm i --no-save playwright
npm run build && npx vite preview --port 4174 &
node tools/verify-orders.mjs
```

Exits non-zero on any failure or console error. It clears `localStorage` first, so run it
against a preview build rather than a session you care about.
