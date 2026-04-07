# Round 4 Implementation Plan

## File: `/Users/nerijus/Developer/Codeable/roqski/design/mockups/homepage-v1/index.html`

All 5 items in a single editing pass.

---

## Item 1: Hero tagline period (HTML line 1448 + JS lines 2027-2029)

1. Move the period inside `#hero-cycling`: change `>business</span>.` to `>business.</span>`
2. Add period to every word in both `cyclingWords` arrays: `['business.', 'litigation.', ...]`

## Item 2: Hero scroll speed (JS line 2044)

1. Change `setInterval(cycleWord, 3500)` to `setInterval(cycleWord, 5000)`

## Item 3: Move process section (HTML lines 1497-1525)

1. Cut the entire `<section class="process" id="process">...</section>` block
2. Paste it after the closing `</section>` of Practice Areas (after line 1577) and before `<div class="image-break">`

## Item 4: Insights hover transition (CSS lines 1054, 1070)

1. `.insight-row` transition: change `padding-left 200ms ease` to `padding-left 350ms cubic-bezier(0.16, 1, 0.3, 1)`
2. `.insight-title` transition: change `color 200ms ease` to `color 350ms cubic-bezier(0.16, 1, 0.3, 1)`

## Item 5: Founders toggle

### 5A: Split layout CSS

Add new CSS block before the responsive section (before line 1242). When `body.team-split-mode` is active:

- `.team-grid` becomes a two-column row layout with a subtle 1px vertical divider (using gap + pseudo-element or border)
- `.team-member` becomes a horizontal card: photo (200px circle) on left, text content on right (name, title, focus, bio paragraph), left-aligned
- `.team-detail` is hidden
- Bio text rendered inline via JS (injected into each `.team-member` element)
- Mobile (768px): stack to single column

Design decisions:
- Two cards separated by a 1px vertical line using `border-right` on the first card (color: `var(--teal-15)`)
- No boxes or bordered containers around cards -- whitespace separates
- Photo: 200px diameter circle, same styling as current
- Text: name in 15px/600 weight, title in 14px/400 `var(--teal-60)`, focus in 13px `var(--teal-30)`, bio in 16px/1.7 `var(--teal-60)`
- Typography hierarchy matches existing team member styles exactly
- Transition between modes: fade via opacity transition on the grid

### 5B: Customize panel

Add CSS matching the explorer panel styles exactly (copied from lines 162-258 of homepage-explorer). Add HTML before `</body>`: a `.customize-panel` with one section "Founders" and two buttons "Circles" / "Split".

JS logic:
- Toggle drawer open/close on button click
- Click outside closes drawer
- "Circles" button: remove `team-split-mode` from body, remove bio elements
- "Split" button: add `team-split-mode` to body, inject bio paragraphs into each `.team-member`

---

## Post-implementation

1. Start HTTP server on port 8765
2. Notify QA teammate
