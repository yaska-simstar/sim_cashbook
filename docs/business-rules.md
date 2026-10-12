# Business rules (agreed)

These are the functional decisions behind the prototype. Change them only with agreement, and update this file in the same pull request.

## Scope

- Cash Management is a separate module. It never creates Odoo journal entries, invoices, payments or stock moves, so the company's books are not affected.
- It keeps its own double-entry ledger, but its accounts are Odoo's own Chart of Accounts (`account.account`). The module reads them; it does not post to them.
- Contacts (customers, suppliers, staff) are Odoo contacts (`res.partner`).

## Cash boxes and currencies

- Two cash boxes: **Main Box – AED** and **Main Box – USD**. No petty cash box.
- AED and USD are fully separate. There is no conversion, exchange voucher or combined total anywhere.
- Each box has its own cash account, picked from the chart of accounts.

## Cash vouchers

- Types: **Receipt** and **Payment**.
- The cashier posts directly: Draft → Posted. No approval step.
- A payment cannot take a box below zero.
- A posted voucher is never edited. It is corrected with **Reverse**, which posts the opposite voucher.
- Receipts offer income, receivable, customer-advance and bank accounts; payments offer expense, advance, payable and bank accounts (filtered by Odoo account type).

## Day Close

- One close per day covering both boxes.
- Counted cash is entered per box. Counting by note and coin is optional and only helps fill the total; nothing is stored per denomination.
- Draft vouchers must be posted or cancelled first.
- A difference needs a reason. A shortage posts to the Cash Difference Loss account, an excess to Cash Difference Gain.
- Closing locks every voucher of that day. Reopening removes the difference postings and unlocks it.

## Sales (stones)

- A sale order has the same shape as Odoo's Sale Order but is a separate model in this module; it does not appear in Odoo Sales.
- Header fields: Customer and Currency (AED or USD) only.
- Order lines: picking a Serial No fills Product, Cut, Color, Clarity, Carat, Pieces, Lab, Certificate Number and Rap Price from the stone. Only Unit Price and Disc.% are entered.
- Which stones can be picked (paper stock) is a filter to be defined later.
- **Mark as Sold**: each stone's Status becomes **Sold** and its Customer becomes the order's customer. The total is booked as a receivable in the order's currency (Dr Sales Receivable / Cr Sales Income).
- **Register Payment**: full payment only, cash only, into the cash box of the order's currency. The order becomes Paid.
- Cancelling an unpaid sold order returns the stones to Available, clears the customer and removes the receivable.

## Open questions

- Pricing: is Unit Price the price of the whole stone (current prototype), or should Amount be Rap Price × carat × (1 − Disc.%)?
- Is the "Cut" column the cut grade (current prototype) or the shape?
- Who may reopen a closed day: any cashier (current prototype) or a manager only?
- How bank deposits and withdrawals of cash should be recorded beyond normal vouchers.
