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

## The question sheets — `docx_builder.py` and `build-questions-*.py`

Answer sheets sent to the author of the Order behaviour handover, as Word documents a
non-technical reviewer can fill in: each question ends in a shaded **YOUR ANSWER** box and
tickable ☐ options.

| Round | Script | Output | Status |
| --- | --- | --- | --- |
| 1 | `build-questions-docx.py` | `docs/Order module - open questions.docx` | Answered 2 Sep 2026 |
| 2 | `build-questions-2-docx.py` | `docs/Order module - open questions round 2.docx` | Sent |

Each round has a markdown twin (`docs/order-open-questions.md`,
`docs/order-open-questions-2.md`) which is the readable source of record — **edit both** when
a question changes. Answers come back as a filled-in .docx, are recorded in
`docs/order-answers.md`, and the handover gets a pointer wherever an answer overrides it.

```sh
pip install python-docx
python3 tools/build-questions-2-docx.py
```

`docx_builder.py` holds the shared machinery — `Sheet` plus the OOXML helpers. Round 2 onward
uses it; **round 1's script predates it and still carries its own copy**, deliberately left
alone because that document is already answered and archived.

Two things to know before touching any of this:

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
soffice --headless --convert-to pdf --outdir /tmp/out "docs/Order module - open questions round 2.docx"
```

Markdown is not a substitute for looking at the PDF: the three defects found this way were
a file Word could not open at all, ignored column widths, and an answer box split across a
page break.

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

## verify-flow.mjs

Walks the flows from Edison's 3 Sep 2026 flow check (`docs/flow-check-2026-09-03.md`) —
items 1–9 and 14. 26 checks: Start Over confirms and clears the email, the account-created
popup is not a dead end, Google sign-up still owes Basic Info while log-in does not, the KYC
document set follows the registration type, Industry "Other" reveals its field, KYC entered
from Get Started uses the post-login shell and completes step 1, the sidebar has Dashboard,
and Duplicate sits between Clear and Add to Catalogue.

```sh
npm i --no-save playwright
npm run build && npx vite preview --port 4174 &
node tools/verify-flow.mjs
```

KYC field labels sit in their own column rather than a `<label for>`, so these select on
`name=` rather than by label — worth knowing before adding a check that mysteriously times out.
