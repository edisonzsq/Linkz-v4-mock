# Order module — answers to the open questions

Sanders answered all nine questions on **2 September 2026**. The signed sheet is
`docs/Order module - answers (Sanders, 2 Sep 2026).docx`; this file is the readable record
and the one to keep current.

**Three answers change behaviour the handover currently specifies** — Q7, Q8 and Q3b. Those
are marked ⚠ below, and `docs/order-behaviour-handover.md` now carries a pointer at each
affected section. The spec author has said they will correct the source document.

| # | Decision | Effect |
| --- | --- | --- |
| Q1 | Even-out closing invoice: **IDR 0,00, status Paid**, order Completed | Confirms what was built |
| Q2 | **Four** settlement statuses, not five | Confirms what was built |
| Q3a | Settlement ← sales invoice settled; Payments ← purchase invoice paid at checkout | Confirmed |
| Q3b ⚠ | New settlement rows stay **Pending**; only a LINKZ admin settles them | Narrows the spec |
| Q4 | The order list **starts genuinely empty** | Changes the list and Create Order |
| Q5 | **No** status filter on the Payments tab | Confirms what was built |
| Q6 | The date range **filters for real**; seed rows relative to today | Changes the Order Report |
| Q7 ⚠ | Purchase invoices gain **Void Invoice** — but not Mark as Paid | Contradicts §6 |
| Q8 ⚠ | An order with a **paid invoice cannot be Cancelled** | Contradicts §6 |
| Q9 | The §9 node IDs are real but belong to file `9aWtR6gPo1PTqt1LbGr31g` | Explains the mismatch |

---

## Q1 — The even-out closing invoice

> A — keep it at IDR 0,00. On send, a new invoice is created for IDR 0,00, its status is set
> to Paid, and the order is marked Complete. This keeps the rule that every Send raises an
> invoice, so the invoice table stays a complete record of what was sent, and it leaves the
> earlier invoices untouched as §3.4 requires.

Already implemented in `sendOrder`. The "open question" comment there has been replaced with
the ruling.

## Q2 — Four settlement statuses

> A — four is correct. The fifth condition is an internal admin state, not a user-facing one.
> Pending covers two situations behind the scenes: the payment may already have been made but
> not yet reflected in the LINKZ admin spreadsheet, or it may be in the spreadsheet but not
> yet settled out to the user by the LINKZ admin. The user sees Pending in both cases.

No change. The comment in `appData.ts` now records *why* it is four rather than restating the
designer's five conditions as if they were all user-facing.

## Q3 — Where the report rows come from

3a, both confirmed. 3b was **none of the three options offered**:

> A settlement row is created as Pending when the sales invoice is settled. It is moved to
> Settled manually by the LINKZ admin from the admin panel — not by the user, and not on a
> timer. […] Note for this prototype, which has no admin panel: new rows should stay at
> Pending, and Settled should appear only on the seeded sample rows. If you want the
> transition to be demonstrable in training, put it behind a dev or demo control rather than
> in the user-facing UI.

`newSettlementRow()` in `src/state/settlements.ts` therefore takes no `status` argument at
all — there is deliberately no way to construct a `Settled` row from the user-facing
prototype. **The optional dev/demo control is not built**; say so if a trainer wants to
demonstrate the transition.

## Q4 — The order list starts empty

> A — start empty. The order list starts genuinely empty. That is the front door for a
> trainee: their first action is to create an order. The Dashboard and Finance screens keep
> their placeholder figures so the populated layout is still demonstrable. […] Those figures
> are illustrative and are not expected to reconcile against the order list.

This is the largest change. Note the consequence for a trainer: **the Dashboard's order
counts and the Finance figures no longer correspond to anything in the order list** — that is
now the intended behaviour, not a defect.

Empty states for the Dashboard and Finance screens are said to be designed and available if
we would rather show those instead; they have not been built.

## Q5 — No status filter on Payments

> A — remove it. There should be no status filter on the Order Report Payments tab.

Already built that way.

## Q6 — The date range filters for real

> B — filter for real. Seed the sample rows relative to today — today, minus 1, minus 2,
> minus 3 days — instead of hard-coding June 2026.

Implemented. The seeded rows sit at today, today−1 and today−2, keeping two rows on the most
recent day so the day-grouping in the frame is still visible. Order numbers are generated from
each row's own date, or the table would show "2 September 2026" against order `20260605-001`.

## Q7 ⚠ — Void Invoice on purchase invoices

> B — add Void Invoice. Not Mark as Paid. Mark as Paid stays off the purchase side
> deliberately: a buyer should not be able to settle a seller invoice by fiat, so payment
> continues to happen only at checkout. Voiding is a different matter. A purchase order is the
> buyer's own document, and an invoice raised in error has to be retractable — otherwise the
> order can never be closed. The void control belongs to the order creator.

**Contradicts §6**, which gives purchase invoices a download icon and no menu.
`invoiceActionsFor()` implements the new rule.

## Q8 ⚠ — A paid order cannot be cancelled

> A — confirmed, and deliberate. […] One caveat to add: an order that already has a paid
> invoice against it cannot be cancelled.

**Contradicts §6**, which allows cancelling at any point before completion. `canCancel()`
implements the new rule and `cancelOrder()` refuses when it returns false, so no caller can
route around it.

## Q9 — The node IDs

> A — confirmed. The 4072 node IDs are real, but they belong to file
> `9aWtR6gPo1PTqt1LbGr31g`. You are building from `eX8Lc53tVFuY2QEDW4t1QT`. They are two
> different files with different node IDs, so your 7017 frames are the correct references for
> the file you have. The spec should have cited the file key alongside every node ID.

Worth knowing for anything else in this repo that cites a node ID: **the file key matters**,
and this project has two files in play. `HANDOFF.md` covers which is which.
