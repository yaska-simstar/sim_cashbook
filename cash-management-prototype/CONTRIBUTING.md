# Contributing

## Workflow

1. Pull the latest `main`.
2. Create a branch: `git checkout -b feature/short-name` (or `fix/short-name`).
3. Make the change and open `index.html` to click through the screens you touched.
4. Commit with a clear message, e.g. `sales: add discount column to order lines`.
5. Push and open a pull request into `main`. One reviewer approves before merge.

Protect `main` in GitHub (Settings → Branches → Add rule: require a pull request before merging).

## Before you open a pull request

- The browser console shows no errors.
- Dashboard → Cash Book → voucher → Post still works.
- Sales → New → pick a Serial No → Mark as Sold → Register Payment still works.
- Day Close can still be closed after posting drafts.
- Accounts shows **AED ledger balanced** and **USD ledger balanced**.
- If you changed a rule, update `docs/business-rules.md` in the same pull request.

## Style rules

- Use the tokens in `css/tokens.css` (`var(--brand)`, `var(--space-4)`…); do not hard-code colours or sizes.
- Reuse the Odoo-style classes in `css/odoo.css` (`btn btn-primary`, `o_list_table`, `o_form_sheet`, `badge text-bg-success`…).
- One primary (plum) button per screen.
- Never add a total that mixes AED and USD.
- Screen copy follows Odoo: short, Title Case buttons, no emoji. See `design-system/README.md`.

## Where things go

- A new screen: a new `js/<screen>.js` file with a `v<Screen>()` function, registered in `render()` (`js/shell.js`) and, if it has a menu, in `navbar()`. Add the script tag to `index.html` before `js/events.js`.
- New sample data: `seed()` in `js/data.js`.
- New buttons: give them `data-act="..."` and handle that action in `js/events.js` (or in `saleAct()` for sales).
