Use this system to prototype screens that drop into the Odoo 18 Enterprise backend (web client) without looking foreign. Class names mirror Odoo's own (`o_control_panel`, `o_list_table`, `o_form_sheet`, `btn-primary`), so a prototype maps one-to-one onto QWeb/OWL views.

## Content fundamentals

- Write like Odoo: short, plain, functional. Buttons are verbs in Title Case — **New**, **Post**, **Reset to Draft**, **Close Day**, **Print Voucher**.
- Field labels are nouns in Title Case with no colon: "Cash Box", "Received From", "Paid To".
- Record names are sequence codes: `AED/2026/10/0045` (one sequence per cash box). Show them as the form's h1 (`record-title`) and as the last breadcrumb.
- Dates as `08/10/2026` (dd/mm/yyyy); money with the currency code or symbol first, comma thousands and two decimals: `AED 61,772.50`, `$ 19,580.00`. Never mix currencies in one total.
- Help and empty states speak to the user in second person, one sentence: "No cash vouchers match this search."
- No emoji, no exclamation marks.

## Visual foundations

**Colour.** The UI is neutral first: `view-bg` sheets on a `gray-100` webclient ground, text in `text` (`gray-700`), headings in `gray-800`. Two hues carry action:

- `brand` (plum) — only the single primary button of a view, the avatar and the cover. White text on it.
- `action` (teal) — links, many2one values, the current statusbar step (`action-subtle` ground), focus rings and selected checkboxes.

Status colours always come as a pair: a `*-subtle` ground with its `*-ink` text (badges, alerts). Use `success-ink` for receipt amounts and `danger-ink` for payment amounts in lists. `warning` is a fill only, never text on white. `gray-400`/`gray-500` are for disabled text, placeholders and icons, never body copy.

**Type.** One family, the system UI stack (`sans`); numbers set with `font-variant-numeric: tabular-nums`. `body` 14px is the base; `label` (500) for field labels and column heads; `record-title` 26px for the form h1; `breadcrumb` 18px; `section-title` for separators and kanban titles; `kpi` for balances; `small` for badges and help text.

**Spacing.** `space-4` (16px) is Odoo's horizontal padding for the control panel, lists and cards; `space-6` pads the form sheet; `space-2` between buttons; `space-5` between form groups and dashboard cards.

**Shape.** `radius` (4px) for buttons, inputs, sheets; `radius-lg` for kanban cards and dialogs; `radius-pill` for badges. Borders, not shadows, separate things: 1px `border` around sheets and cards, `hairline` between list rows. `shadow-sheet` is a faint lift; `shadow-dropdown` only on floating menus.

**Fields.** Form inputs are borderless with a 1px `border` underline that darkens on hover and turns `action` on focus; read-only fields lose the underline. Required empty fields show a `danger` underline.

**States.** Hover = `gray-100` ground. Selected list row = `action-subtle`. Focus = 2px solid `action` outline, offset 2px (≥3:1 on every surface). Disabled = 50% opacity.

**Layout.** Navbar (46px, `view-bg`, bottom `border`) → control panel (New, breadcrumb, search with facets, pager, view switcher) → view. Forms: statusbar strip, then a sheet max 1140px wide with two `o_inner_group` columns, a notebook, and the chatter docked on the right on wide screens.

## Components

`Button`, `Badge`, `StatusBar`, `ControlPanel` are the building blocks. The **Cash Management prototype** group composes them into a standalone app. All seven cards run the same live prototype (shared sample data, click through between screens):

- `CashDashboard` — one card per cash box (Main Box – AED, Main Box – USD). There is no petty cash box.
- `CashBookList` — the cash book of one box, switched with the box selector, with day grouping and running balance.
- `CashEntryForm` — the cash voucher: Receipt or Payment, with its ledger lines.
- `CashDayClose` — counted cash per box (counting by note is optional), differences, close and lock the day.
- `CashSalesList` — Sales Orders and Stones: what is sold, what is still to collect per currency.
- `CashSaleForm` — the cash sale order: Mark as Sold (stone Status and Customer set in Odoo, receivable booked), Register Payment (full cash receipt).
- `CashChartOfAccounts` — the Accounts screen: Odoo's own chart of accounts with Cash Management balances per currency, plus the account settings.

Rules every Cash Management screen follows:

- It never writes to Odoo Accounting (`account.move`); every screen that shows ledger data says so in one muted line or an `alert-info`.
- Each cash box holds exactly one currency (AED or USD). Amounts in a box are always shown in that currency; there is no converted total.
- AED and USD are separate ledgers. There is no conversion, exchange or combined total anywhere in the module.
- Contacts are Odoo contacts (`res.partner`) and accounts are Odoo accounts (`account.account`, Accounting › Chart of Accounts), both shown as many2one links in `action`. The module reads them; it never creates journal entries.
- Sales orders never create Odoo invoices, journal entries or stock moves. The only Odoo data they change is each stone's Status (Sold) and Customer.
- Sales are paid in full, in cash, into the cash box of the order's currency.
- The cashier posts directly: Draft → Posted. A posted voucher is corrected by **Reverse**, never edited; a closed day locks its vouchers.

## Iconography

Odoo 18 uses Font Awesome 4.7 (`fa fa-*`) for icons. This system does not ship that font: previews use simple 1.75px-stroke inline SVGs (`o_icon`, `currentColor`) and text glyphs (⋮, ▾, ≡) as stand-ins. In the real module use the matching `fa` class (`fa-cog`, `fa-paperclip`, `fa-search`, `fa-th`). No logo is included; the app name is set in plain type.
