# Order module — open questions, round 2

**To:** Sanders / the author of `LINKZ ORDER BEHAVIOUR HANDOVER`
**From:** the team building the Order module in the LINKZ v4 prototype
**About:** round 1 (9 questions) was answered on 2 September 2026 and is now built —
see `docs/order-answers.md`
**Date sent:** _(fill in)_

> The version to send is **`docs/Order module - open questions round 2.docx`**, which has
> yellow answer boxes a non-technical reviewer can type into. This file is the readable
> source of record; `tools/build-questions-2-docx.py` turns it into the .docx, so **edit
> both** if a question changes.

---

## Why there is a second round

All nine round 1 answers are implemented. Three of them changed the handover rather than
confirming it (Void Invoice on purchase invoices, no cancelling a paid order, settlement rows
staying Pending).

Building them surfaced these nine. Most come from starting the order list empty, which turned
out to touch more than the list itself. Two are conflicts inside the handover that only became
visible once the screens existed.

**R1–R4 block the next piece of work** — §5 to §7 (create/edit order, order detail, checkout).

| # | Question | Spec | Blocking |
| --- | --- | --- | --- |
| R1 | How does a purchase order come into existence? | §4, §7 | **Yes** |
| R2 | Which order number format is correct? | §2, §9 | **Yes** |
| R3 | What does auto-save actually show the user? | §5.3 | **Yes** |
| R4 | Which invoice does Checkout settle, and can the amount change? | §7 | **Yes** |
| R5 | What is required to save a new contact? | §8.6 | No |
| R6 | What should Send Reminder do in the prototype? | §6 | No |
| R7 | Do you want the Dashboard / Finance empty states? | Q4 | No |
| R8 | Do you want a demo control for settling a settlement? | Q3b | No |
| R9 | Upload Order — spec says no, the frame has one | §4 | No |

---

## R1 — How does a purchase order come into existence?

**§4, §7 · Blocking**

The Q4 answer made both order lists start genuinely empty. But the handover only describes a
user *creating* an order, and a purchase order is one you receive rather than write.

**Consequence:** Checkout is reached from **Make Payment** on a purchase invoice. With the
purchase list empty and no way to put anything in it, **Checkout is unreachable** in a
training session except by typing its address directly.

- [ ] **A — The buyer creates it** on the Create Order screen with a Purchase Order chip.
      §5 does describe a purchase variant (node `4001:11452`).
- [ ] **B — It arrives from a seller.** Needs a demo trigger in a mock with no second company.
- [ ] **C — Upload Order** creates it (see R9).
- [ ] **D — Seed exactly one purchase order** as a deliberate exception to Q4.

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## R2 — Which order number format is correct?

**§2, §9 · Blocking**

| Where | Format | Example |
| --- | --- | --- |
| The handover, for orders a user creates | `DDMMYY-0000001` | `020926-0000001` |
| The Order Report frame (`7017:1308`) | `YYYYMMDD-NNN` | `20260605-001` |

They disagree on date order, separator width and sequence length, so one order cannot satisfy
both. Created orders currently use the first and the report's seeded rows the second — the
same order would appear under two numbers on two screens.

- [ ] **A — `DDMMYY-0000001` everywhere.** The Order Report frame is out of date.
- [ ] **B — `YYYYMMDD-NNN` everywhere.** The handover is out of date.
- [ ] **C — They identify different things** — say what each one is.

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## R3 — What does auto-save actually show the user?

**§5.3 · Blocking**

> The order is written to the list as a Draft as soon as there is anything worth keeping
> (a counterparty, a product name, remarks, any amount) and updated in place thereafter.

With the list starting empty, auto-save is the first thing a trainee triggers — and on this
reading, typing one character makes a Draft row appear, visible to the other demo user.

**3a. Is the draft visible in the list straight away?**

- [ ] Visible immediately, as written
- [ ] Only on leaving the create screen

**3b. What does the user see when it saves?**

- [ ] Nothing at all
- [ ] A "Saved" indicator in the Order Info bar — say the wording
- [ ] A toast

**3c. What happens to an auto-saved draft the user abandons?**

- [ ] It stays as a Draft
- [ ] It is discarded

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer to 3a, 3b and 3c._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## R4 — Which invoice does Checkout settle, and can the amount change?

**§7 · Blocking**

> Proceeding settles that invoice through the same path as Mark as Paid, so the completion
> rules in §3.5 apply unchanged.

An order can carry several invoices, and §5.5 describes an "Amount to Pay" dialog with a
**Set Amount to Pay** field — so part-payment exists somewhere. Not clear whether at checkout.

**4a.** Checkout settles exactly the one invoice whose Make Payment was clicked, at its full
payable amount — correct?

- [ ] Correct
- [ ] No — describe what it settles

**4b.** Can the payable amount be edited at checkout?

- [ ] **A — Fixed.** Paid in full or not at all; part-payment happens when raising the invoice.
- [ ] **B — Editable.** If so: does the invoice stay Unpaid for the remainder, or is a new one
      raised?

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer to 4a and 4b._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## R5 — What is required to save a new contact?

**§8.6 · Not blocking**

The two-pane modal layout (`4001:14992`) is clear; the rules are not.

- **5a.** Which fields must be filled before Save is enabled?
- **5b.** Does a contact created from inside an order become selectable in that order's
  dropdown immediately?
  - [ ] Yes, and it is selected automatically
  - [ ] Yes, but the user still has to pick it
  - [ ] No
- **5c.** A seller needs bank details (§5 gives purchase orders a "Seller's bank details"
  panel). Required at creation, or addable later?

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer to 5a, 5b and 5c._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## R6 — What should Send Reminder do in the prototype?

**§6 · Not blocking**

The sales invoice row carries a Payment Link column whose action is **Send Reminder**. Nothing
says what it does, and in a mock nothing can be sent.

- [ ] **A — A confirmation, then a toast.** The row records that a reminder was sent.
- [ ] **B — Nothing visible.** Decorative in the mock.
- [ ] **C — Something else** — describe it.

Also: disabled after one reminder, or repeatable? If there is a limit, name it.

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## R7 — Do you want the Dashboard / Finance empty states?

**Follow-up to Q4 · Not blocking**

> Empty states for all of those screens are already designed and available if you would rather
> show those instead.

We kept the placeholder figures, as your answer specified. The empty states are not built
because we do not have the frames.

- [ ] **A — Leave it as is.**
- [ ] **B — Switch to the empty states.** Paste the Figma links or node IDs.
- [ ] **C — Make it switchable** from the prototype's demo panel.

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## R8 — Do you want a demo control for settling a settlement?

**Follow-up to Q3b · Not blocking**

> If you want the transition to be demonstrable in training, put it behind a dev or demo
> control rather than in the user-facing UI.

Not built, since it was offered rather than asked for. A settlement row created in a session
stays `Pending` forever and `Settled` appears only on sample rows — exactly as specified, but
a trainer cannot show the transition happening.

- [ ] **A — Not needed.**
- [ ] **B — Yes, add it** to the existing demo panel, alongside Reset data.
- [ ] **C — Yes, but somewhere else** — say where.

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## R9 — Upload Order: the spec says no, the frame has one

**§4 · Not blocking**

> Starts empty; the empty state is the front door with a single Create Order CTA. There is no
> Download Template or Upload Order button.

But the order list frame we built from (`4001:13925`) carries three header buttons: **Order
Report · Upload Order · Create Order**. We kept all three, because the frame is what a user
sees. R1 also raises Upload Order as a possible origin for purchase orders.

- [ ] **A — Remove Upload Order** (and Download Template).
- [ ] **B — Keep it and make it work.** Say what it accepts and what happens after upload.
- [ ] **C — Keep it as a visible but inert button.**

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Replace this line with your answer._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

## Anything else

Including anything in the round 1 answers you would like to revisit now that it is built.

<!-- ╔══════════════ ANSWER HERE ══════════════╗ -->

_Optional._

<!-- ╚═════════════ END OF ANSWER ═════════════╝ -->

---

**Answered by:** _(name)_
**Date:** _(date)_
