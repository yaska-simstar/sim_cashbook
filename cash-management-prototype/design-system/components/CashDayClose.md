# CashDayClose
Prototype: the end-of-day close for all cash boxes — counted cash per box, differences posted, the day locked.

- **Data it needs:** per box the opening balance for the day, posted receipts and payments, draft vouchers; Counted By and Verified By.
- One row per box, each in its own currency: Opening, Receipts, Payments, Expected, **Counted Cash** (typed in), Difference, Reason.
- Counting by note and coin is optional: the "Count by note (optional)" link opens a dialog whose total fills Counted Cash. Nothing is stored per denomination.
- **Close Day** stays disabled, with the reason printed beside it, until there are no drafts, every box has a counted amount, and every difference has a reason. "Post all drafts" posts them from here.
- Difference: Balanced / Short / Excess (word + colour). Closing posts each shortage to the Cash Difference Loss account and each excess to the Cash Difference Gain account (both set on the Accounts screen) and locks every voucher dated that day; **Reopen Day** removes those postings and unlocks it.
