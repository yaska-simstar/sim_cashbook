# ControlPanel
The top of every action: the light `o_main_navbar` (app name + menu sections) and the `o_control_panel` (New button, breadcrumb, search with facets, pager, view switcher).

- **Consumer provides:** app name, menu sections with the active one, breadcrumb trail, active search facets, pager range, available view types.
- Navbar ground `view-bg` with a `border` bottom; the active menu section sits on `gray-200`.
- Breadcrumb: parents in `action` (clickable), the current item in `gray-800` `breadcrumb` style.
- Facets: `gray-200` pill with a `brand` icon cell (filter ▾, group-by ≡); search box outlined in `border`, `action` on focus.
- **New** is the only `btn-primary` in a list/kanban control panel.
