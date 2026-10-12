# Button
Odoo action buttons: one `btn-primary` per view for the main action, `btn-secondary` for the rest, `btn-link` for Discard/Cancel.

- **Consumer provides:** the label (verb, Title Case: "Post", "Close Day") and the click handler.
- One `btn-primary` (`brand` fill, white text) per statusbar or control panel — e.g. **Post** on a draft voucher, **New** in a list.
- `btn-secondary` (`gray-200` fill, `gray-900` text) for Print, Reset to Draft, Export.
- `btn-link` (`action` text) for Discard and dialog dismissals; `btn-danger-link` for destructive links.
- Radius `radius`, padding 5px 10px, `label` weight. Focus ring: 2px solid `action`, offset 2px.
- Don't use the plum for anything but the primary action; don't add icons to statusbar buttons.
