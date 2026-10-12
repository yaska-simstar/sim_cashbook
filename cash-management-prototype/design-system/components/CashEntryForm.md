# CashEntryForm
Prototype: the cash voucher — Receipt or Payment — with the two ledger lines it writes to the Cash Management ledger.

- **Data it needs:** voucher type, date, cash box, contact (`res.partner`), account (`account.account` from Odoo's Chart of Accounts), amount in the box's currency, reference, narration, state, and the posted balance of the box.
- Receipt: Dr box cash account / Cr chosen account. Payment: Dr chosen account / Cr box cash account. A muted line under the lines says nothing is posted to Odoo Accounting.
- Account choices are filtered by `account_type` and change with the voucher type (receipts: income, receivable, customer advances, bank; payments: expenses, advances, payable, bank).
- Draft: **Post**, **Save Draft**, **Cancel** (or **Discard** when new). Errors show as an `alert-danger` at the top of the sheet: missing contact, missing account, zero amount, a closed date, or a payment larger than the box balance.
- Posted vouchers are read-only. **Reverse** posts an opposite voucher dated today and links both; not offered once the voucher's day is closed.
- The chatter logs creation and every state change.
