# CashBookList
Prototype: the cash book of one cash box — every voucher in that box's currency, grouped by day with opening and closing rows and a running balance.

- **Data it needs:** the selected cash box (`cash.box`, one currency); per voucher `date`, `name`, `voucher_type` (receipt / payment), `partner_id` (res.partner), narration, `account_id` (`account.account`), `amount`, `state`; the box's opening balance at the start of the range.
- The box selector (Main Box – AED / Main Box – USD) sits at the left of the summary strip and is also a fixed facet in the search. Never show two currencies in one table.
- Clicking a row opens the voucher form; the breadcrumb returns to the same box.
- Running balance counts **posted** vouchers only; Draft shows "not posted"; Cancelled is struck through and excluded.
- Receipts in `success-ink`, payments in `danger-ink`, right-aligned, tabular numerals.
- Filter chips: All, Draft, Posted, Cancelled; search by voucher, contact, narration or reference. Rows are grouped by date with an opening balance row; a closed day is marked in its group header.
