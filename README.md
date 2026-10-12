# Cash Management — Odoo 18 prototype

A clickable prototype of a standalone **Cash Management** module for Odoo 18, styled like the Odoo 18 Enterprise backend. It is plain HTML, CSS and JavaScript: no install, no build step, no server.

## Run it

- **Locally:** clone the repo and open `index.html` in Chrome, Edge or Safari.
- **Online:** turn on GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root). The site then updates about a minute after every push to `main`.

Sample data lives in the browser only. Reloading the page (or **Reset data**, top right) restores it. "Today" is fixed at 08/10/2026 so the sample data makes sense.

## What it covers

| Menu | What you can do |
| --- | --- |
| Dashboard | One card per cash box (Main Box – AED, Main Box – USD): balance, today in/out, drafts, sales to collect |
| Cash Book | Vouchers per box, grouped by day, running balance; open any voucher |
| Cash voucher | Receipt or Payment against an Odoo account; Post, Cancel, Reverse |
| Sales | Sale orders for stones: Mark as Sold (stone Status → Sold, Customer set), receivable booked, Register Payment (full, cash) |
| Day Close | Counted cash per box (count by note optional), differences with reason, close and lock the day |
| Accounts | Odoo chart of accounts with Cash Management balances per currency, plus account settings |

The business rules behind these screens are in [`docs/business-rules.md`](docs/business-rules.md). Read them before changing behaviour.

## Project layout

```
index.html              entry point; loads the CSS and JS below in order
css/tokens.css          design tokens (colours, spacing, radius, fonts)
css/odoo.css            Odoo-style components (navbar, control panel, list, form, badges…)
css/app.css             styles specific to these screens
js/data.js              constants, sample data, shared state S
js/helpers.js           formatting, balances, lookups
js/shell.js             navbar + render()
js/dashboard.js         Dashboard
js/cash-book.js         Cash Book
js/voucher.js           Cash voucher form
js/day-close.js         Day Close + count-by-note dialog
js/sales.js             Sales Orders, Stones, Sale Order form, Register Payment
js/accounts.js          Accounts screen
js/events.js            click / input / change handlers
js/main.js              starts the app
design-system/          tokens.json, design rules, one guideline file per component/screen
docs/business-rules.md  agreed functional rules
tools/build-single-file.py  bundles everything into one HTML file in dist/
```

The JS files are plain scripts that share global functions and the state object `S`. Keep the load order in `index.html` when adding files.

## Sharing as one file

```
python3 tools/build-single-file.py
```

This writes `dist/cash_management_prototype.html`, which can be emailed or opened anywhere. `dist/` is not committed.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md).
