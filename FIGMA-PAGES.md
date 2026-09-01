# Figma page inventory — V.4 Compilation (Edison)

**File key:** `eX8Lc53tVFuY2QEDW4t1QT`
**URL:** https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-

## Why this file exists

`get_metadata` with no `nodeId` lists **only** `0:1 🖼 Cover` for this file — the other
pages are not enumerated by the API, on repeated calls and across fresh MCP connections.
They are reachable only by addressing their node ID directly. Edison supplied the IDs
below by clicking each page and copying the address bar. **Do not re-derive this list from
the API; it cannot be re-derived.** If this file is lost, ask Edison to re-paste.

Node IDs are written `4001-66190` in URLs and `4001:66190` in MCP calls.

## Quota

Figma MCP limits are per seat/plan (Full seat, Pro: ~200 calls/day, 15/min). If a call
returns a rate-limit error, **stop, update the Status column below, and resume the next
day.** Survey costs ~1 call per page; building costs many more per page.

## Pages — surveyed 2026-09-01

Areas are inferred from the page-number prefixes, which restart at `1.` per area, and
match the order Edison pasted the URLs in.

**Columns:** *frames* = top-level frames at mobile (360–420w) or desktop (≥1200w) size —
the raw screen count. *named* = distinct frame names. *base* = distinct screens after
folding ` - ` state suffixes and `mobile`/desktop pairs together — the realistic build unit.

| Area | # | Node ID | Page | frames | named | base | Status |
| --- | --- | --- | --- | ---: | ---: | ---: | --- |
| Onboarding | 1 | `4001:66190` | 1. Sign-Up & Login | 148 | 126 | 36 | 🟡 surveyed |
| Onboarding | 2 | `4001:109341` | 2. Get Started | 18 | 15 | 2 | 🟡 surveyed |
| General Features | 3 | `4001:109342` | 1. Dashboard | 10 | 5 | 2 | 🟡 surveyed |
| General Features | 4 | `9:80` | 2. Order Management | 164 | 75 | 42 | 🟡 surveyed |
| General Features | 5 | `32:11725` | 4. Master Product | 75 | 70 | 19 | 🟡 surveyed |
| Finance | 6 | `9:82` | 1. Seller Pay Later | 69 | 36 | 19 | 🟡 surveyed |
| Finance | 7 | `4001:186598` | 2. Buyer Pay Later | 32 | 16 | 10 | 🟡 surveyed |
| Finance | 8 | `4001:186599` | 3. BizLoan | 4 | 2 | 1 | 🟡 surveyed |
| Finance | 9 | `4001:205473` | 4. Know Your Customer | 55 | 46 | 11 | 🟡 surveyed |
| Account Mgmt | 10 | `9:77` | 1. My Profile | 127 | 24 | 13 | 🟡 surveyed |
| Account Mgmt | 11 | `29:31462` | 2. My Employee | 48 | 18 | 15 | 🟡 surveyed |
| Account Mgmt | 12 | `4001:219575` | 3. Business Contact | 46 | 12 | 9 | 🟡 surveyed |
| Account Mgmt | 13 | `4001:219576` | 4. Referrals | 7 | 2 | 2 | 🟡 surveyed |
| — | — | `0:1` | 🖼 Cover | — | — | — | ✅ cover art only, nothing to build |
| **TOTAL** | | | **13 pages** | **803** | **447** | **181** | |

### Per area

| Area | Pages | Frames | Base screens |
| --- | ---: | ---: | ---: |
| Onboarding | 2 | 166 | 38 |
| General Features | 3 | 249 | 63 |
| Finance | 4 | 160 | 41 |
| Account Management | 4 | 228 | 39 |

### ⚠ One page looks missing

General Features runs `1. Dashboard`, `2. Order Management`, `4. Master Product` — there
is **no `3.`**. Every other area numbers consecutively. Either a page was skipped when the
URLs were pasted, or a `3.` page exists that has not been shared. Ask Edison before
declaring General Features complete.

Status legend: ⬜ not started · 🟡 surveyed · 🟢 built · ⛔ blocked (note reason)

`4001-109342` was pasted twice in the source message; listed once here. 13 unique pages.

### Cached metadata dumps

Every page's `get_metadata` XML is cached in the session scratchpad at
`scratchpad/figma/<node-id>.xml` (~5 MB total), so building costs **zero** extra Figma
calls for structure. Scratchpad does not survive the container, so a new session must
re-fetch (13 calls). Two small pages returned inline and were not cached — `3. BizLoan`
(`4001:186599`) and `4. Referrals` (`4001:219576`); re-fetch those two if needed.

Helper scripts (also scratchpad-only): `survey.py` summarises one dump, `roll.py` rolls
counts up per area, `ingest.py` moves saved tool-result dumps into the cache.

## Source URLs as pasted

```
https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=4001-66190&p=f
https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=4001-109341&p=f
https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=4001-109342&p=f
https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=9-80&p=f
https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=32-11725&p=f
https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=9-82&p=f
https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=4001-186598&p=f
https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=4001-186599&p=f
https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=4001-205473&p=f
https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=9-77&p=f
https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=29-31462&p=f
https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=4001-219575&p=f
https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=4001-219576&p=f
```

## Notes for the next session

- `get_screenshot` with `enableBase64Response: true` **does** return the render inline and
  works here. HANDOFF.md claims visual verification is impossible — that is wrong.
- Raw asset downloads are still blocked (`403 CONNECT tunnel failed` on `figma.com`), so
  exported logos/photography stay as stand-ins.
- The original file `9aWtR6gPo1PTqt1LbGr31g` is on a **View** seat and has exhausted its
  monthly MCP quota. Use this file only.
