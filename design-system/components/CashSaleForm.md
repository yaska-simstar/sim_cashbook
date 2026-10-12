# CashSaleForm
Prototype: the cash sale order, laid out like the SimStar Odoo Sale Order (title, header fields, Order Lines notebook, totals block) but trimmed to what Cash Management needs. It only writes to Cash Management and to two fields on each stone.

- **Header:** Customer (`res.partner`, required) and Currency (AED or USD, required; it decides which cash box takes the payment). No document type, pricelist, payment terms, salesperson, addresses or expiration.
- **Order Lines:** columns Serial No, Product, Cut, Color, Clarity, Carat, Pieces, Lab, Certificate Number, Rap Price, Unit Price, Disc.%, Amount. Picking a **Serial No** fills every stone column from the stone record; only Unit Price and Disc.% are typed. Amount = Unit Price × (1 − Disc.% / 100). "Add a product" adds a line; a stone already on another open order or already sold is not offered.
- Rap Price is the stone's list price in US$ per carat and is reference only; Unit Price and Amount are in the order's currency. Totals block: Untaxed Amount, Discount, Total. No taxes.
- States: Quotation → Sold → Paid (Cancelled aside). **Mark as Sold** sets each stone's Status to Sold and Customer to the order's customer and books the receivable (Dr Sales Receivable / Cr Sales Income); an `alert-info` under the lines says this first. **Register Payment** takes the full amount in cash into the matching box. **Cancel Sale** (unpaid) returns the stones to Available.
- **Ledger** tab shows the sale and payment lines; the chatter sits under the sheet because the order lines need the full width.
