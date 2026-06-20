# Mobile-First Redesign — Design

**Date:** 2026-06-21
**Status:** Approved
**Scope:** Make the portfolio feel intentionally designed on phones (≤ ~768px),
not a collapsed desktop. Desktop layout must remain untouched.

## Context

Vite + React SPA, single `styles.css` (~2000 lines), all-monospace dark theme
(green `#10f294` + purple `#8b7cf5`, subtle grid background). Dual mode:
Professional (`mode === "pro"`) and Personal, toggled via a floating `ModePill`
and persisted in `localStorage["portfolio-mode"]`. Hash route `#projects` =
archive (`AllProjects`).

Current state at 390px: responsive but uninspired — same desktop type scale
(hero `clamp(48px,7vw,92px)`, section titles `clamp(36px,5vw,56px)`), 80px section
padding leaving large dead gaps, grids that snap to one column, 8 project cards in
a long vertical stack, illegible diagram thumbnails, cramped 2-col bento, and a
text/globe overlap in the Personal "Hobbies" subtitle.

## Approach

**CSS-driven mobile layer**, reusing existing markup. A clearly-marked
"Mobile-first redesign" block appended to `styles.css`, overriding only at phone
widths. Carousels use pure CSS scroll-snap (no JS). Minimal markup additions only
where unavoidable (e.g. carousel dot indicators / a peek wrapper). No React
component forking — desktop and mobile share one DOM. Desktop rules are never
edited, only overridden inside mobile media queries.

Breakpoints: keep existing 900/720/620/480. Add the new phone treatment under
`@media (max-width: 768px)` for layout shifts and tighten further under
`max-width: 560px` where needed.

## Design by area

1. **Type scale & rhythm.** Phone-tuned scale: hero title ~40px, section titles
   ~28–30px, tighter line-heights. Section padding 80px → ~52px; remove oversized
   stat margins. Goal: dense and deliberate, not gappy.

2. **Swipeable Projects (signature move).** Home `.proj-grid` becomes a
   horizontal scroll-snap carousel: card ~85vw with a peek of the next, snap per
   card, hidden scrollbar, dot/progress affordance. Diagram thumbnails become
   full-width legible cards. Pure CSS via `overflow-x:auto` + `scroll-snap-type`.

3. **Sticky bottom mode toggle.** Promote `ModePill` to a fixed, thumb-reachable
   control with frosted backdrop, safe-area inset aware, always one tap away.

4. **Bento → intentional mobile layout.** Short Profile bento and Personal
   "Components of Life": hero cards (tech stack, Spotify Wrapped, song player)
   full width; smaller cards paired 2-up where legible. A real mosaic, not a
   squeeze. Fix the cramped Spotify Wrapped card.

5. **Rough spots.** Fix Personal "Hobbies" subtitle/globe overlap; reduce hero
   avatar size; enforce 44px min touch targets; tighten the archive page (kept
   vertical — it's a browse/filter view).

6. **Perf & motion.** Preserve globe paused-offscreen behavior and reduced-motion
   handling. Verify carousel + sticky toggle stay smooth on a phone viewport.

## Out of scope

- Desktop visual changes.
- New content/sections.
- Framework or build changes.

## Verification

Drive headless Chrome at 390px (iPhone), both modes + `#projects`, with
`prefers-reduced-motion: no-preference`. Confirm: no overflow/overlap, carousel
snaps, toggle reachable, type scale reads well, no perf regression.
