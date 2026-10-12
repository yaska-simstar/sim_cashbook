# Badge
The `widget="badge"` pill used for `state` and type columns in list and kanban views.

- **Consumer provides:** a short word (1–2 words) and a tone matching the field's `decoration-*`.
- Tones: `text-bg-info` (Draft), `text-bg-success` (Posted, Balanced), `text-bg-danger` (Cancelled, Short), `text-bg-warning` (Excess / needs review), `text-bg-secondary` (neutral type labels).
- Each tone is a `*-subtle` ground with its `*-ink` text so 12px text stays above 4.5:1. The word carries the meaning; colour only reinforces it.
- Shape `radius-pill`, `small` type at weight 500.
