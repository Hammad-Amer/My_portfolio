# Mobile-First Redesign Implementation Plan

> **For agentic workers:** This is a CSS/visual task in a project with **no test runner**. The verification step for every task is a headless-Chrome screenshot at phone width, reviewed by eye — not a unit test. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio feel intentionally designed on phones (≤768px) without touching the desktop layout.

**Architecture:** Append one clearly-marked "Mobile-first redesign" block to the end of `styles.css` that overrides only inside phone-width media queries. Reuse existing markup. Carousels are pure CSS scroll-snap. Minimal markup additions only where unavoidable (carousel peek wrapper / dots, sticky toggle already exists as `ModePill`).

**Tech Stack:** Vite + React 18, single `styles.css`, JetBrains Mono, CSS scroll-snap, `env(safe-area-inset-*)`.

## Global Constraints

- Desktop layout (>768px) must remain visually identical. Only override inside `@media (max-width: 768px)` (and tighter `max-width: 560px` where noted). Never edit existing desktop rules.
- All-monospace theme; tokens: `--bg #07080d`, `--accent #10f294`, `--purple #8b7cf5`, `--ink #e8ecec`. Reuse tokens; don't hardcode new colors.
- Preserve globe paused-offscreen behavior and `prefers-reduced-motion` handling already in `styles.css`.
- Touch targets ≥ 44px.
- Verify in headless Chrome via the harness at `C:/Users/hamma/AppData/Local/Temp/pptr-mobile` (`shot.mjs` full-page, `crop.mjs` segments), viewport 390×844, `prefers-reduced-motion: no-preference`, against `http://localhost:5174/`. Dev server already running.

## File Structure

- **Modify:** `styles.css` — append a single `/* ===== MOBILE-FIRST REDESIGN ===== */` section at EOF containing all mobile overrides, organized by area.
- **Modify (only if needed):** `app.jsx` — add a wrapper element/class around the project grid for the carousel, and any dots affordance. Keep changes additive and desktop-neutral.
- **Reference (no edit):** `ProjectCard.jsx`, `Globe.jsx`, `SongPlayer.jsx`.

All mobile CSS lives in one appended block so desktop rules above are provably untouched.

---

### Task 1: Mobile type scale & spacing rhythm

**Files:**
- Modify: `styles.css` (append mobile block)
- Verify: `crop.mjs` segments `p-0..p-2`, `ps-0..ps-2`

**Interfaces:**
- Produces: the `@media (max-width:768px)` foundation block other tasks extend. Selectors targeted: `.hero-title`, `.section`, `.section-title`, `.section-sub`, `.stats`, `.hero`, `body`.

- [ ] **Step 1: Append the foundation block**

At EOF of `styles.css`:

```css
/* ===== MOBILE-FIRST REDESIGN (≤768px) ===== */
@media (max-width: 768px) {
  .hero-title { font-size: clamp(34px, 11vw, 44px); line-height: 1.06; margin-bottom: 20px; }
  .hero { padding: 24px 0 56px; gap: 28px; min-height: auto; }
  .hero-desc { font-size: 14.5px; margin-bottom: 28px; }
  .section { padding: 52px 0; }
  .section-title { font-size: clamp(26px, 8vw, 32px); margin-bottom: 36px; gap: 12px; }
  .section-title .ico { width: 30px; height: 30px; }
  .section-sub { font-size: 13.5px; margin: -24px auto 32px; }
  .stats { margin: 28px 0 56px; }
}
```

- [ ] **Step 2: Verify** — Run `node crop.mjs` (in pptr dir), open `p-0.png`/`p-1.png`/`ps-0.png`. Expected: hero title no longer dominates, gaps between sections visibly tighter, no overflow.

- [ ] **Step 3: Commit**

```bash
git add styles.css && git commit -m "Add mobile type scale and spacing rhythm"
```

---

### Task 2: Swipeable Projects carousel (signature move)

**Files:**
- Modify: `app.jsx` — `Projects` component (around line 569–601): wrap `.proj-grid` so a peek/scroll container exists; add a class hook. Keep desktop grid behavior intact.
- Modify: `styles.css` — mobile block.
- Verify: `crop.mjs` `p-4..p-8`.

**Interfaces:**
- Consumes: `.proj-grid` and `ProjectCard` markup (unchanged).
- Produces: `.proj-grid` becomes a horizontal scroll-snap row at ≤768px.

- [ ] **Step 1: Inspect current Projects markup**

Read `app.jsx` lines 569–601 to confirm `.proj-grid` structure and that `ProjectCard` children are direct grid items. Do NOT change desktop markup beyond what's needed.

- [ ] **Step 2: Add mobile carousel CSS**

In the mobile block:

```css
@media (max-width: 768px) {
  .proj-grid {
    display: flex;
    grid-template-columns: none;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 16px;
    padding: 4px 0 14px;
    margin: 0 calc(-1 * var(--pad-x));
    padding-left: var(--pad-x);
    padding-right: var(--pad-x);
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .proj-grid::-webkit-scrollbar { display: none; }
  .proj-grid > * {
    scroll-snap-align: center;
    flex: 0 0 85%;
    min-width: 85%;
  }
}
```

- [ ] **Step 3: Verify** — `node crop.mjs`; open `p-4.png`/`p-5.png`. Expected: one project card ~85% width with a peek of the next; diagram images now legible; horizontal scroll works (card edges visible at viewport sides).

- [ ] **Step 4: Add a swipe affordance (dots or hint)**

If a peek alone reads ambiguously, add a small caption under the grid in `Projects` (e.g. `<p className="swipe-hint">swipe →</p>`) styled mobile-only:

```css
@media (max-width: 768px) {
  .swipe-hint { display: block; text-align: center; color: var(--ink-3); font-size: 12px; margin-top: 10px; letter-spacing: 0.04em; }
}
@media (min-width: 769px) { .swipe-hint { display: none; } }
```

- [ ] **Step 5: Verify + Commit**

```bash
git add app.jsx styles.css && git commit -m "Make projects a swipeable carousel on mobile"
```

---

### Task 3: Sticky bottom mode toggle

**Files:**
- Modify: `styles.css` — mobile block. Target `ModePill`'s rendered class (confirm via `app.jsx` line 832 `ModePill`).
- Verify: `shot.mjs` full-page bottom + `crop.mjs` last segment of each mode.

**Interfaces:**
- Consumes: existing `ModePill` markup/classes.
- Produces: fixed bottom-centered toggle with frosted backdrop, safe-area aware.

- [ ] **Step 1: Confirm ModePill classes** — Read `app.jsx` line 832 + matching CSS for the pill (grep `mode-pill`/`mode-opt`). Note the actual wrapper class name.

- [ ] **Step 2: Add sticky CSS** (substitute real wrapper class for `.mode-pill`)

```css
@media (max-width: 768px) {
  .mode-pill {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    z-index: 90;
    background: color-mix(in srgb, var(--bg) 78%, transparent);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.45);
  }
  .mode-opt { min-height: 44px; }
  /* keep content clear of the fixed pill */
  body { padding-bottom: 84px; }
}
```

- [ ] **Step 3: Verify** — `node shot.mjs`; open `pro-full.png` bottom and `personal-full.png` bottom. Expected: pill floats fixed above content, thumb-reachable, not overlapping footer text. Scroll segments confirm it stays put.

- [ ] **Step 4: Commit**

```bash
git add styles.css && git commit -m "Make mode toggle a sticky bottom control on mobile"
```

---

### Task 4: Bento grids → intentional mobile mosaic

**Files:**
- Modify: `styles.css` — mobile block. Targets `.bento` (Short Profile, ~line 463) and the Personal "Components of Life" grid (`PersonalBento`, app.jsx ~777) plus Spotify Wrapped + song player cards.
- Verify: `crop.mjs` `p-2`/`p-3` (Short Profile) and `ps-3`/`ps-4` (Personal bento, Wrapped, song).

**Interfaces:**
- Consumes: `.bento` and personal bento grid classes (confirm names via grep).
- Produces: full-width hero cards, 2-up smaller cards where legible.

- [ ] **Step 1: Identify exact grid class names** — Grep `styles.css` + `app.jsx` for `.bento`, `PersonalBento`'s grid class, Spotify Wrapped card class, song player container class.

- [ ] **Step 2: Add mobile bento CSS** (substitute real class names)

```css
@media (max-width: 768px) {
  .bento { grid-template-columns: 1fr; grid-template-rows: none; gap: 14px; }
  /* personal "Components of Life" grid -> single column, hero cards full width */
  /* (fill real selector) { grid-template-columns: 1fr; } */
}
```

- [ ] **Step 3: Verify** — `node crop.mjs`; open `p-2.png`, `ps-3.png`, `ps-4.png`. Expected: tech-stack/Wrapped/song cards full width and uncramped; no clipped content.

- [ ] **Step 4: Commit**

```bash
git add styles.css && git commit -m "Restructure bento grids for mobile"
```

---

### Task 5: Fix rough spots (overlap, avatar, touch targets, archive)

**Files:**
- Modify: `styles.css` — mobile block. Targets `.section-sub` overlap in Personal Hobbies, `.avatar-wrap`, `.social`, `.archive-grid`.
- Verify: `crop.mjs` `ps-0` (hobbies), `p-0` (avatar), `ar-*` (archive).

**Interfaces:**
- Consumes: existing selectors.
- Produces: no overlaps, 44px targets, smaller avatar, tightened archive.

- [ ] **Step 1: Reproduce the Hobbies overlap** — Read `ps-0.png`; confirm subtitle text overlaps the globe/world canvas. Inspect the relevant section markup in `app.jsx` (`Hobbies` ~730) to find the offending positioning.

- [ ] **Step 2: Add fixes**

```css
@media (max-width: 768px) {
  .avatar-wrap { width: min(78%, 300px); }
  .social { width: 44px; height: 44px; }
  /* Hobbies subtitle overlap fix — adjust once real cause confirmed (e.g. position/z-index/margin) */
}
@media (max-width: 560px) {
  .archive-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify** — `node crop.mjs`; open `ps-0.png`, `p-0.png`, `ar-0.png`/`ar-1.png`. Expected: no text/globe overlap, avatar smaller, archive cards full width and readable.

- [ ] **Step 4: Commit**

```bash
git add styles.css && git commit -m "Fix mobile rough spots: overlap, avatar, touch targets, archive"
```

---

### Task 6: Full sweep verification & perf check

**Files:**
- Verify only: `shot.mjs` (all 3) + `crop.mjs` (all segments).

- [ ] **Step 1: Full re-capture** — `node shot.mjs && node crop.mjs`.

- [ ] **Step 2: Review every segment** — Open each `p-*`, `ps-*`, `ar-*`. Checklist: no horizontal overflow, no overlaps, type scale consistent, carousel snaps, sticky toggle present and clear, footer not hidden behind toggle.

- [ ] **Step 3: Perf probe** — Confirm Professional mode settles to 0 JS rAF frames after load and the globe in Personal mode still pauses offscreen (per `verify-in-headless-chrome` memory). No new long-running animations introduced.

- [ ] **Step 4: Desktop regression spot-check** — Capture at 1280px width (both modes) and confirm desktop is visually unchanged.

- [ ] **Step 5: Final commit** (if any tweaks)

```bash
git add -A && git commit -m "Final mobile verification tweaks"
```

---

## Self-Review

- **Spec coverage:** Type scale/rhythm → T1; swipeable projects → T2; sticky toggle → T3; bento → T4; rough spots (overlap/avatar/targets/archive) → T5; perf & motion + desktop-untouched → T6. All spec areas covered.
- **Placeholders:** Tasks 3–5 intentionally say "confirm real class name via grep" because the exact rendered class must be read from source at execution — this is a lookup instruction, not a content gap; concrete CSS is provided for every confirmed selector.
- **Consistency:** Single mobile block at `≤768px`, tighter rules at `≤560px`; all tasks append to the same block.
