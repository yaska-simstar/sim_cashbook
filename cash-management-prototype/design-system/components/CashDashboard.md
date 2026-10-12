# CashDashboard
Prototype: the Cash Management home — one kanban card per cash box, each in its own currency.

- **Data it needs:** box name, code and currency, posted balance, today's receipts and payments, count and sum of draft vouchers, whether today is open and the last closed day.
- The currency code sits beside the box name as a small neutral tag; the balance uses `kpi` and the box's own currency only.
- Actions: **New Payment** (primary), **New Receipt**, link **Cash Book**. "N to post" opens the box's cash book filtered to drafts.
- An alert above the cards says whether today is open or closed and links to Day Close.
