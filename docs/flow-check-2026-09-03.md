# Flow check — 3 September 2026

Edison's pass over [linkz-v4-mock.vercel.app](https://linkz-v4-mock.vercel.app/), **flow and
states only — no UI/visual notes**.

Every Figma link below has been rewritten from the file key in the original message
(`9aWtR6gPo1PTqt1LbGr31g`) to **`I7UK2KGWw5dRDEhcXaqFGC`**, per Edison's instruction. That key
is confirmed readable from this session. Base URL:

```
https://www.figma.com/design/I7UK2KGWw5dRDEhcXaqFGC/V.4-Compilation?node-id=<node>
```

**A third file key is now in play.** `HANDOFF.md` covers the other two. Always say which file
a node ID belongs to.

| # | Area | Item | Frame | Status |
| --- | --- | --- | --- | --- |
| 1 | Sign up | "Start Over" wipes the form with no confirmation; email stays pre-filled | `4001-76576` | ✅ |
| 2 | Sign up | Account-created popup X is a dead end — should go to Get Started / KYC, and be a whole-page popup | `4001-76718` | ✅ |
| 3 | Sign up | Google sign-up skips Basic Info, which the AC makes mandatory | `4001-77653`, `4001-77489` | ✅ |
| 4 | KYC | Business type says it "determines which documents needed" but the document set never changes | `4001-84233`, `4001-89494` | ✅ |
| 5 | KYC | Industry "Other (please specify)" reveals no field | `4001-84329` | ✅ |
| 6 | KYC | Entering KYC from Get Started should be "Verify Business after login", not the onboarding flow again | `4001-206888` | ✅ |
| 7 | Get Started | Step 1 never turns "Completed", even after KYC is submitted | `4029-45426` | ✅ |
| 8 | Get Started | No "Invite team member" / "Get help" card below the steps | `4029-45150` | ✅ |
| 9 | Get Started | Sidebar has no Dashboard menu item | `4029-45120` | ✅ |
| 10 | Orders | Order rows should be clickable | `4001-13819` | ✅ |
| 11 | Orders | Order creation UI does not match the current V4 design | (artifact `b4920b29`) | ✅ |
| 12 | Master Products | Creation UI differs: category should not be required, variants should be creatable, right side should be a preview | `4033-50554`, `4033-50848`, `4033-51964` | ✅ |
| 13 | Master Products | Product rows should be clickable | `4033-50139` | ✅ |
| 14 | Master Products | Bulk bar needs a Duplicate button between Clear and Add to Catalogue | `4033-50391` | ✅ |
| 15 | Catalogue | Entire flow missing; needed for training | page `8-76` | ☐ |

**Done:** 1–14, verified in a browser by `tools/verify-flow.mjs` (28 checks) and
`tools/verify-products-orders.mjs` (24 checks).

**Outstanding: 15 only (Catalogue), deferred by Edison on 5 Sep.**

Notes from building 10–13:

- The order detail screen exists in Figma but is **named after its invoice state**, not
  "Order Detail" — `Sales Order Single Invoice` (`4001-16781`), `Sales Order Multi Invoice`
  (`4001-12967`), `Overpaid Sales Order`, `Cancelled Order`, `Order Complete`.
- Create Order and Order Detail are **one screen**; the detail view adds the Invoice section
  and swaps the draft actions for the sent ones. One component serves both.
- The V4 create-order design is in Figma (`4001-11308` and 15 sibling frames), so the
  Claude artifact link in item 11 was not needed. It could not be read from this session
  anyway ("served as a public reader").
- Item 12's frames also specify three validation states nobody had asked for —
  `Empty Required`, `Invalid Price`, `SKU Duplicated` — all three are implemented.
- **Not built:** the Checkout payment step is still unwired, because round-2 question R4
  (which invoice Checkout settles, and whether the amount is editable) is unanswered.
  `Make Payment` on a purchase invoice navigates to the existing Checkout screen.
