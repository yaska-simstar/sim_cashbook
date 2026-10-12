# StatusBar
The strip above a form sheet: action buttons on the left, the `state` selection (`widget="statusbar"`) as arrow steps on the right.

- **Consumer provides:** the ordered states (`statusbar_visible`), the current state, and the buttons valid in that state.
- Current step: `action-subtle` ground, `action` text, weight 600. Other steps: `gray-100` ground, `gray-600` text, `border` outline.
- Left side holds at most one `btn-primary` (the next transition, e.g. **Post**) then `btn-secondary` buttons.
- Show only states a user can reach in normal flow (Draft → Posted); Cancelled appears only when the record is cancelled.
