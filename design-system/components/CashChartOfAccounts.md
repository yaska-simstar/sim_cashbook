# CashChartOfAccounts
Prototype: the Accounts screen — Odoo's own Chart of Accounts (`account.account`) reused by Cash Management, with balances computed only from Cash Management vouchers.

- **Data it needs:** the company's `account.account` records (code, name, `account_type`), the module settings, and posted Cash Management vouchers per currency.
- An `alert-info` at the top says the accounts come from Accounting › Configuration › Chart of Accounts and that nothing is posted to Odoo Accounting.
- **Settings** block: the cash account of each box (an account of type Bank and Cash), the Opening Balance account, and the Cash Difference Loss / Gain accounts used by Day Close — all picked from the same chart.
- Which accounts a voucher offers follows `account_type`: receipts get income, other income, receivable, current liabilities (customer advances) and Bank and Cash; payments get expenses, prepayments, current assets (staff advances), payable and Bank and Cash.
- Table: Code, Account Name, Type (Odoo's type label as a neutral badge), Offered On, Balance AED, Balance USD with Dr/Cr. One badge per currency confirms total debit equals total credit; AED and USD never add up into one figure.
- Account codes in the prototype are samples; the real list is whatever the company's chart holds.
