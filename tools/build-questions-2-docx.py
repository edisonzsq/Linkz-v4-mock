# -*- coding: utf-8 -*-
"""
Round 2 of the Order module open questions — the ones that surfaced while
building §4 and §9 against the round 1 answers.

    python3 tools/build-questions-2-docx.py

Content also lives in `docs/order-open-questions-2.md`; edit both.
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from docx_builder import Sheet  # noqa: E402

s = Sheet(
    title='Order module — open questions, round 2',
    subtitle='Nine follow-up questions. Please answer in the yellow boxes and send the file back.',
    meta_rows=[
        ('To', 'Sanders / the author of the LINKZ Order Behaviour handover'),
        ('From', 'The team building the Order module in the LINKZ v4 prototype'),
        ('About', 'Round 1 (9 questions) was answered on 2 September 2026 and is now built'),
        ('Date sent', '…' * 12),
    ],
    footer_label='Order module — open questions, round 2',
)

# ------------------------------------------------------------------ intro
s.heading('Why there is a second round')

s.para('Thank you for the round 1 answers — all nine are now implemented. Three of them '
       'changed the handover rather than confirming it (Void Invoice on purchase invoices, '
       'no cancelling a paid order, and settlement rows staying Pending), and those are '
       'built as you described.')
s.para([('Building them surfaced these nine.', True),
        ' Most come from starting the order list empty, which turned out to touch more than '
        'the list itself. Two are conflicts inside the handover that only became visible '
        'once the screens existed.'])

s.heading('How to answer this document')
s.para('Same as last time. You do not need the codebase, the prototype, or a Figma account — '
       'everything each question refers to is quoted inside the question.')
s.numbered([('Type into the yellow boxes. ', True),
            'Click inside, delete the grey placeholder, and type. The box grows as you write.'])
s.numbered([('Tick a box by replacing ', True), ('☐', True), (' with an ', True), ('X', True),
            '. Click just to the right of the box, press Backspace once, and type a capital X.'])
s.numbered([('Please do not skip any question. ', True),
            'If one does not matter to you, write ', ('no preference', False, True),
            ' and we will choose a sensible default.'])
s.para([('Four of the nine block the next piece of work', True),
        ' — R1 to R4, marked ', ('BLOCKING', True),
        '. They stand between us and §5 to §7 (create/edit order, order detail, checkout). '
        'If you are short of time, answer those four first.'])
s.spacer(2)

s.heading('The nine questions at a glance')
s.table(
    ['#', 'Question', 'Spec', 'Blocking'],
    [
        ['R1', 'How does a purchase order come into existence?', '§4, §7', ('Yes', True)],
        ['R2', 'Which order number format is correct?', '§2, §9', ('Yes', True)],
        ['R3', 'What does auto-save actually show the user?', '§5.3', ('Yes', True)],
        ['R4', 'Which invoice does Checkout settle, and can the amount change?', '§7', ('Yes', True)],
        ['R5', 'What is required to save a new contact?', '§8.6', 'No'],
        ['R6', 'What should Send Reminder do in the prototype?', '§6', 'No'],
        ['R7', 'Do you want the Dashboard / Finance empty states?', 'Q4', 'No'],
        ['R8', 'Do you want a demo control for settling a settlement?', 'Q3b', 'No'],
        ['R9', 'Upload Order button — spec says no, the frame has one', '§4', 'No'],
    ],
    widths=[0.5, 3.9, 0.65, 1.05],
)

# ------------------------------------------------------------------- R1
s.question('R1', 'How does a purchase order come into existence?', '§4, §7', True)
s.para([('This is the one that blocks most. ', True),
        'Your Q4 answer made both order lists start genuinely empty, which we have built. '
        'But the handover only ever describes a user ', ('creating', False, True),
        ' an order, and a purchase order is an order you receive rather than write.'])
s.para([('The consequence. ', True),
        'Checkout (§7) is reached from ', ('Make Payment', True),
        ' on a purchase invoice. With the purchase list empty and no way to put anything in '
        'it, ', ('Checkout is now unreachable', True),
        ' in a training session except by typing its address directly. The same is true of '
        'everything else that hangs off a purchase order.'])
s.para('How should a purchase order appear for a trainee?')
s.option('A — The buyer creates it', ' on the same Create Order screen, choosing the '
         'Purchase Order chip. §5 does describe a purchase variant of that screen '
         '(node 4001:11452), so this may already be the intent.')
s.option('B — It arrives from a seller', ' — a sales order someone sends you becomes your '
         'purchase order. Closest to how this presumably works in production. In a mock with '
         'no second company we would need a demo trigger; tell us where to put it.')
s.option('C — Upload Order', ' creates it, from the button in the list header (see R9).')
s.option('D — Seed exactly one purchase order', ' as a deliberate exception to Q4, so '
         'Checkout is reachable. The sales list still starts empty.')
s.answer_box('Click here and type your answer. If B, please say what should trigger the arrival in the mock.')

# ------------------------------------------------------------------- R2
s.question('R2', 'Which order number format is correct?', '§2, §9', True)
s.para('Two formats appear in the material, and we have had to implement both:')
s.table(
    ['Where', 'Format', 'Example'],
    [
        ['The handover, for orders a user creates', 'DDMMYY-0000001', '020926-0000001'],
        ['The Order Report frame (7017:1308)', 'YYYYMMDD-NNN', '20260605-001'],
    ],
    widths=[2.9, 1.9, 1.65],
)
s.para('They disagree on the date order, the separator width and the sequence length, so a '
       'single order cannot satisfy both. Right now created orders use the first and the '
       'report’s seeded rows use the second, which means the same order would appear '
       'under two different numbers on two screens.')
s.option('A — DDMMYY-0000001 everywhere.', ' The Order Report frame is out of date.')
s.option('B — YYYYMMDD-NNN everywhere.', ' The handover is out of date.')
s.option('C — They are genuinely different things', ' — please say what each one identifies '
         '(for example, one is the order and the other is a settlement reference).')
s.answer_box()

# ------------------------------------------------------------------- R3
s.question('R3', 'What does auto-save actually show the user?', '§5.3', True)
s.quote('The order is written to the list as a Draft as soon as there is anything worth '
        'keeping (a counterparty, a product name, remarks, any amount) and updated in place '
        'thereafter.')
s.para([('Why this needs pinning down now. ', True),
        'With the list starting empty (Q4), auto-save is the first thing a trainee will '
        'trigger — and on this reading, typing a single character into a new order makes a '
        'Draft row appear in the list, visible to the other demo user immediately.'])
s.para('Three things the handover does not say:')
s.para([('3a. Is the draft visible in the list straight away, ', True),
        'or only once the user leaves the screen?'], indent=0.0)
s.option('Visible immediately, as written', level=1)
s.option('Only on leaving the create screen', level=1)
s.para([('3b. What does the user see when it saves?', True)], indent=0.0)
s.option('Nothing at all', level=1)
s.option('A "Saved" indicator in the Order Info bar', ' — say the wording', level=1)
s.option('A toast', level=1)
s.para([('3c. What happens to an auto-saved draft the user abandons ', True),
        'without pressing Save as Draft or Send — does it stay in the list?'], indent=0.0)
s.option('It stays as a Draft', level=1)
s.option('It is discarded', level=1)
s.answer_box('Click here and answer 3a, 3b and 3c.')

# ------------------------------------------------------------------- R4
s.question('R4', 'Which invoice does Checkout settle, and can the amount change?', '§7', True)
s.quote('Proceeding settles that invoice through the same path as Mark as Paid, so the '
        'completion rules in §3.5 apply unchanged.')
s.para('An order can carry several invoices, and §5.5 describes an "Amount to Pay" dialog '
       'with a Set Amount to Pay field — so part-payment clearly exists somewhere. What is '
       'not clear is whether it exists at checkout.')
s.para([('4a. ', True), 'Checkout settles ', ('exactly the one invoice', True),
        ' whose Make Payment was clicked, at its full payable amount — correct?'])
s.option('Correct', level=1)
s.option('No', ' — describe what it settles', level=1)
s.para([('4b. Can the payable amount be edited at checkout?', True),
        ' The Order Summary shows a Payable Amount, but the frame does not obviously make it '
        'editable.'])
s.option('A — Fixed.', ' The invoice is paid in full or not at all. Part-payment happens '
         'only when raising the invoice.', level=1)
s.option('B — Editable', ' — the buyer can pay part of an invoice. If so, what happens to '
         'the remainder: does the invoice stay Unpaid, or is a new one raised?', level=1)
s.answer_box('Click here and answer 4a and 4b.')

# ------------------------------------------------------------------- R5
s.question('R5', 'What is required to save a new contact?', '§8.6', False)
s.quote('Two-pane modal (4001:14992). The side nav scrolls the form to Basic Information / '
        'Other Information… Shared by both modules: a contact is a buyer on a sales order '
        'and a seller on a purchase order.')
s.para('The layout is clear; the rules are not.')
s.para([('5a. Which fields must be filled before Save is enabled?', True),
        ' A company name alone, or more?'])
s.para([('5b. ', True), 'Does a contact created from inside an order become selectable in '
        'that order’s buyer/seller dropdown ', ('immediately', True), '?'])
s.option('Yes, and it is selected automatically', level=1)
s.option('Yes, but the user still has to pick it', level=1)
s.option('No', level=1)
s.para([('5c. ', True), 'A seller needs bank details (§5 gives purchase orders a '
        '"Seller’s bank details" panel). Are those required when creating the contact, '
        'or can they be added later?'])
s.answer_box('Click here and answer 5a, 5b and 5c.')

# ------------------------------------------------------------------- R6
s.question('R6', 'What should Send Reminder do in the prototype?', '§6', False)
s.para('The sales invoice row carries a Payment Link column whose action is Send Reminder. '
       'Nothing says what it does, and in a mock nothing can actually be sent.')
s.option('A — A confirmation, then a toast.', ' The row records that a reminder was sent.')
s.option('B — Nothing visible.', ' It is decorative in the mock.')
s.option('C — Something else', ' — describe it.')
s.para([('Also: ', True), 'should the control be disabled after one reminder, or can it be '
        'sent repeatedly? If there is a limit (once a day, say), name it.'])
s.answer_box()

# ------------------------------------------------------------------- R7
s.question('R7', 'Do you want the Dashboard / Finance empty states?', 'follow-up to Q4', False)
s.quote('The Dashboard and Finance screens keep their placeholder figures so the populated '
        'layout is still demonstrable. Empty states for all of those screens are already '
        'designed and available if you would rather show those instead.')
s.para([('We have kept the placeholder figures', True),
        ', as your answer specified. The offer of empty states is noted but not taken up, '
        'because we do not have the frames.'])
s.option('A — Leave it as is.', ' Placeholder figures on the Dashboard and Finance screens.')
s.option('B — Switch to the empty states.', ' Please paste the Figma links or node IDs — we '
         'cannot find frames without them.')
s.option('C — Make it switchable', ' from the prototype’s demo panel, so a trainer can '
         'show either. (More work, but useful if different sessions want different things.)')
s.answer_box()

# ------------------------------------------------------------------- R8
s.question('R8', 'Do you want a demo control for settling a settlement?', 'follow-up to Q3b', False)
s.quote('If you want the transition to be demonstrable in training, put it behind a dev or '
        'demo control rather than in the user-facing UI.')
s.para([('Not built', True),
        ', since it was offered rather than asked for. As things stand a settlement row '
        'created during a session stays ', ('Pending', True),
        ' forever, and Settled appears only on the sample rows — which is exactly what you '
        'specified, but it does mean a trainer cannot show the transition happening.'])
s.option('A — Not needed.', ' The sample rows are enough.')
s.option('B — Yes, add it', ' to the prototype’s existing demo panel (the floating '
         'switcher, alongside Reset data). Invisible to a trainee unless the trainer opens it.')
s.option('C — Yes, but somewhere else', ' — say where.')
s.answer_box()

# ------------------------------------------------------------------- R9
s.question('R9', 'Upload Order — the spec says no, the frame has one', '§4', False)
s.quote('Starts empty; the empty state is the front door with a single Create Order CTA. '
        'There is no Download Template or Upload Order button.')
s.para([('But the order list frame we built from (', False), ('4001:13925', True),
        (') carries three header buttons: ', False), ('Order Report', True), (' · ', False),
        ('Upload Order', True), (' · ', False), ('Create Order', True), ('.', False)])
s.para('We have kept all three, because the frame is what a user sees. R1 also raises Upload '
       'Order as a possible way a purchase order gets created, which would make it load-'
       'bearing rather than decorative.')
s.option('A — Remove Upload Order', ' (and Download Template). The spec is right; the frame '
         'is out of date.')
s.option('B — Keep it and make it work.', ' Say what it accepts — a spreadsheet? — and what '
         'happens after a successful upload.')
s.option('C — Keep it as a visible but inert button', ' for now.')
s.answer_box()

# ------------------------------------------------------------- anything else
s.spacer(0)
s.rule()
s.heading('Anything else')
s.para('If reviewing these surfaced something we have not asked about — including anything '
       'in the round 1 answers you would like to revisit now that it is built — please put '
       'it here.')
s.answer_box('Optional.', lines=5)

s.signoff()

out = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    'docs',
    'Order module - open questions round 2.docx',
)
print('saved:', s.save(out))
