# CashSalesList
Prototype: Sales › Sales Orders and Stones — stones sold to a customer from inside Cash Management, kept apart from Odoo's own Sales app.

- **Data it needs:** sale orders (name `CS/2026/NNNN`, date, customer `res.partner`, currency AED or USD, lines of stone + price, state), and the stones offered for sale with their Odoo Status and Customer fields.
- Summary strip shows **To collect** per currency (sold, not yet paid) and says that no Odoo invoice, journal entry or stock move is created.
- Filter chips: All, Quotations, To Collect, Paid, Cancelled. Status badges: Quotation (`text-bg-info`), Sold · To Collect (`text-bg-warning`), Paid (`text-bg-success`), Cancelled (`text-bg-danger`).
- **Stones** tab lists each stone with Status (Available / Sold), Customer and the sale order that sold it. Which stones appear here (paper stock) is a filter to be defined later.
- The dashboard card of each cash box links "To collect (sales)" to the To Collect filter.
