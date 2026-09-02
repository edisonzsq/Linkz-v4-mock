# Order module — open questions

> ## ✅ ANSWERED — 2 September 2026, by Sanders
>
> All nine questions were answered. **Read `docs/order-answers.md` instead of this file** —
> it records the decisions and what each one changed. The signed sheet is
> `docs/Order module - answers (Sanders, 2 Sep 2026).docx`.
>
> This file is kept as the record of what was asked, and as the source for
> `tools/build-questions-docx.py` if another round of questions is needed.

**To:** the author of `LINKZ ORDER BEHAVIOUR HANDOVER`
**From:** the team implementing it in `edisonzsq/Linkz-v4-mock`
**Date sent:** 2 September 2026 · **Answered:** 2 September 2026

---

## How to answer this document

Each question below has an **answer block** that looks like this:

> ```
> <!-- ╔══════════════ ANSWER HERE ══════════════╗ -->
>
> ...your answer goes in here...
>
> <!-- ╚═════════════ END OF ANSWER ═════════════╝ -->
> ```

Three things to do:

1. **Type your answer between the two lines.** Replace the placeholder text; leave the
   `<!-- ... -->` marker lines in place so we can find each answer.
2. **Tick a box** where options are offered — change `- [ ]` to `- [x]`. If none fit, tick
   nothing and just write what should happen.
3. **Skip nothing.** If a question does not matter to you, write `no preference` — that is
   a useful answer and we will pick a default.

Then send the file back. You do not need the codebase or a Figma account to answer any of
these — everything needed is quoted inline.

**Four questions block work that is otherwise ready to start** (Q1–Q4). The rest can be
answered alongside the build, but each is currently a guess on our side.

---

## Quick index

| # | Question | Spec ref | Blocking? |
| --- | --- | --- | --- |
| Q1 | Amount on the even-out closing invoice | §5.5 | **Yes** |
| Q2 | Four settlement statuses or five? | §9 | **Yes** |
| Q3 | Where Settlement and Payments rows come from | §9 | **Yes** |
| Q4 | Should the order list really start empty? | §4 | **Yes** |
| Q5 | What the Status filter does on the Payments tab | §9 | No |
| Q6 | Whether the date range actually filters | §9 | No |
| Q7 | Whether purchase invoices can only be settled at checkout | §6 | No |
| Q8 | Whether line items stay editable after payment | §5.2 | No |
| Q9 | Order Report Figma node IDs (correction to confirm) | §9 | No |

---

## Q1 — What amount should the even-out closing invoice carry?

**Spec reference:** §5.5 · **Blocking: yes**

This is your own open question in the handover, still unanswered. It blocks the Send Order
dialogs.

**The situation.** An order is worth IDR 5.000.000. An invoice for IDR 3.000.000 has been
raised and paid. The user then edits the order down to IDR 3.000.000 — exactly what was
paid — and sends it. The spec calls this the *even-out* send: it commits the adjustment,
issues a closing invoice, and completes the order.

**The problem.** The paid invoice already covers the whole adjusted total, so there is
nothing left to bill. The closing invoice currently lands at **IDR 0,00**. Making it
non-zero would mean restating the earlier IDR 3.000.000 invoice, which contradicts §3.4:

> An invoice row records the state at the moment it was issued and never changes
> afterwards, except for its `status`.

**Options as we see them:**

- [ ] **A — Keep IDR 0,00.** The closing invoice is a marker that the order was evened out
      and closed. History stays immutable.
- [ ] **B — Do not issue a closing invoice at all** on an even-out send; just commit the
      adjustment and complete the order.
- [ ] **C — Something else** (describe below, including which existing invoice may be
      restated and how that squares with §3.4).

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## Q2 — Are there four settlement statuses or five?

**Spec reference:** §9 · **Blocking: yes**

**The conflict.** Your note on the Order Report page (Figma `7017:1307`) lists **five**
conditions:

| Condition (as written) | Status named in the note |
| --- | --- |
| Sudah paid tapi belum masuk excel | Pending Payment |
| Sudah masuk excel tapi belum settled | Pending Payment (Not Yet Paid) |
| Sudah masuk excel dan sudah settled | Paid Settled |
| Sudah masuk excel, sudah settled, tapi turns out fraud | Chargeback |
| Sudah masuk excel, belum settle, tapi turns out fraud | Canceled |

But the frame itself (`7017:1308`) shows only **four** chips: `Settled`, `Pending`,
`Charge Back`, `Cancelled` — the first two conditions both render as a single `Pending`.

**What we built:** the frame's four, because that is what a user actually sees.

**Options:**

- [ ] **A — Four is correct.** The two "pending" conditions are the same to the user; the
      distinction is internal only.
- [ ] **B — Five is correct.** Give the fifth its own chip label and say how a reader tells
      the two apart at a glance.

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer. If B, give us the exact chip labels you want._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## Q3 — Where do Settlement and Payments rows come from?

**Spec reference:** §9 · **Blocking: yes**

You recommended feeding both tables from real activity:

> settling a sales invoice writes a Settlement row; paying a purchase invoice writes a
> Payment row carrying the method chosen at checkout.

We have built both tables from **fixed sample data** for now. Two things are unclear before
we wire them to real activity:

**3a. Confirm the two write paths.**

- [ ] Settlement rows come only from **sales** invoices being settled — correct?
- [ ] Payments rows come only from **purchase** invoices being paid at checkout — correct?

**3b. What advances a settlement?** If a Settlement row appears the moment a sales invoice
is marked paid, it presumably starts at `Pending`. In a mock with no backend, nothing can
later mark it `Settled`.

- [ ] **A — Stay Pending.** New rows sit at `Pending` forever; `Settled` only ever appears
      on the seeded sample rows.
- [ ] **B — Advance on a timer** (say how long).
- [ ] **C — Advance by a manual action** in the prototype (say what and where).

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## Q4 — Should the order list really start empty?

**Spec reference:** §4 · **Blocking: yes**

This is the one we would most like your decision on, because it changes several screens
either way.

**What the spec says:**

> Starts **empty**; the empty state is the front door with a single **Create Order** CTA.

**Why that conflicts with the rest of the prototype.** This build is a **training mock**.
Several already-built screens read from seeded orders:

- the **Dashboard** shows order counts, GMV and revenue totals;
- the **Finance** screens (Seller / Buyer Pay Later) reference invoices and orders;
- **Checkout** is reached from a seeded purchase order.

If the order list starts genuinely empty, those screens either show zeros or show figures
that no longer correspond to anything in the list.

**Options:**

- [ ] **A — Start empty, accept the knock-on.** The list is the front door; the dashboard
      and finance screens show zeros until the trainee creates orders. Most faithful to §4.
- [ ] **B — Keep the seeded orders.** The empty state appears only after the trainee clears
      the demo data. Most useful for a training walkthrough.
- [ ] **C — Seed the other screens independently** of the order list, so the list starts
      empty while the dashboard still demonstrates populated figures. (Means the numbers
      will not reconcile against the list — acceptable in a mock?)

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## Q5 — What does the Status filter do on the Payments tab?

**Spec reference:** §9 · **Blocking: no**

The Payments frame (`7017:1508`) shows an **All Status** filter in the toolbar. But the
Payments table has no Status column, and your own comparison table says so explicitly:

> | Status column | Yes — Settled / Pending / Charge Back / Cancelled | **No** |

**What we built:** the filter is hidden on the Payments tab, shown on Settlement only.

**Options:**

- [ ] **A — Correct, drop it** from the Payments tab.
- [ ] **B — Keep it** — it filters on a field not shown in the table (name it below).

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## Q6 — Should the date range actually filter, and from what default?

**Spec reference:** §9 · **Blocking: no**

The picker is built and applies a range correctly. Two loose ends:

**6a.** The sample rows are dated **June 2026**, but the default preset in the frame is
**Last 7 days**. If the range filtered literally against today's date, the table would open
**empty** — which is not what the frame shows.

**6b.** Right now the range is applied and displayed but does not filter the sample rows.

- [ ] **A — Do not filter in the mock.** The picker demonstrates the interaction; the rows
      stay put. (What we have now.)
- [ ] **B — Filter for real** — and move the sample data to sit inside the default range,
      or change the default preset (say which).

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## Q7 — Can a purchase invoice only ever be settled through checkout?

**Spec reference:** §6 · **Blocking: no**

Your table gives the two invoice types different row actions:

| | Sales | Purchase |
| --- | --- | --- |
| Row actions | ⋮ menu: Download PDF · Mark as Paid · Void Invoice | **download icon only** (no menu) |

**The consequence.** A purchase invoice can only be closed by **paying it at checkout** —
there is no Mark as Paid and no Void. So a purchase invoice raised in error cannot be
voided at all, and the order it belongs to cannot be closed without paying.

- [ ] **A — Intended.** Purchase invoices are settled only at checkout; that is the point.
- [ ] **B — Not intended.** Purchase invoices should also offer (tick what applies):
      - [ ] Void Invoice
      - [ ] Mark as Paid
      - [ ] Something else — describe below

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## Q8 — Do line items stay editable after money has been collected?

**Spec reference:** §5.2 · **Blocking: no**

> **Rows stay editable after the order is sent**, until it is Completed or Cancelled.
> Only **Buyer/Seller Info** locks on send.

Read literally, that includes an order with a **fully paid** invoice against it. We believe
that is deliberate — it is exactly what makes the Overpaid state in §5.4 reachable, since
overpaid arises only by *"reducing an order after money has been collected"*.

We have implemented it that way. Confirming, because it is the kind of rule that looks like
a bug to a reviewer who has not read §5.4.

- [ ] **A — Confirmed.** Editing stays open until Completed or Cancelled, even with a paid
      invoice on the order.
- [ ] **B — No** — the product table should lock at some earlier point (say when).

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## Q9 — Order Report node IDs (a correction to confirm)

**Spec reference:** §9 · **Blocking: no**

The node IDs cited in §9 — `4072:99011`, `4072:99211`, `4072:99053` — **do not exist** in
the Figma file `eX8Lc53tVFuY2QEDW4t1QT`. We found the Order Report under section
`7017:1065` and built against these frames instead:

| Screen | Node | Link |
| --- | --- | --- |
| Settlement | `7017:1308` | https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=7017-1308 |
| Payments | `7017:1508` | https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=7017-1508 |
| Date picker open | `7017:1350` | https://www.figma.com/design/eX8Lc53tVFuY2QEDW4t1QT/V.4-Compilation--Edison-?node-id=7017-1350 |

- [ ] **A — Confirmed.** The `4072:*` IDs were from an earlier file; the frames above are
      the intended design.
- [ ] **B — No** — the `4072:*` frames are newer and live somewhere else. Send the file key.

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## Anything else

If reviewing these surfaced something we have not asked about — a rule you expected to see
questioned, or a decision you would like revisited — put it here.

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Optional._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

**Answered by:** _(name)_
**Date:** _(date)_
