# Round 4 Polish -- Implementation Spec

## File
`/Users/nerijus/Developer/Codeable/roqski/design/mockups/homepage-v1/index.html`

## Brand constraints (from `/Users/nerijus/Developer/Codeable/roqski/docs/brand-direction.md`)
- No boxes, tiles, or bordered containers. Lines and whitespace separate.
- Colors: dark teal (#0B3030), burnt orange (#CD4A16), white. Use existing CSS vars.
- Animation: elegant and deliberate, never distracting.
- Typography hierarchy carries the design.

---

## Item 1: Hero tagline period

**Problem:** The period (`.`) sits outside the cycling `<span>`, so it stays static while the practice area word fades in/out, causing a visible horizontal shift.

**Current HTML (line 1448):**
```html
<span class="hero-cycling" id="hero-cycling">business</span>.</span>
```
The period is between `</span>` (hero-cycling) and `</span>` (hero-slide).

**Fix:** Move the period inside `hero-cycling` so it fades with the word. Update `cyclingWords` array entries to include the period, and update the initial text content.

**Current JS (lines 2027-2029):**
```js
var cyclingWords = isMobile
  ? ['business', 'litigation', 'real estate', 'IP', 'contracts', 'disputes']
  : ['business', 'litigation', 'real estate', 'intellectual property', 'contracts', 'disputes'];
```

**Changes needed:**
1. HTML: Change `<span class="hero-cycling" id="hero-cycling">business</span>.` to `<span class="hero-cycling" id="hero-cycling">business.</span>`
2. JS: Add period to every word in both arrays: `['business.', 'litigation.', ...]`

**Acceptance criteria:**
- The period fades in/out together with the practice area word
- No horizontal shift of the period at any point during the animation
- The period is visible at all times (appears with each word)

---

## Item 2: Hero scroll speed

**Problem:** The cycling interval is 3500ms, which feels too fast/distracting.

**Current JS (line 2044):**
```js
setInterval(cycleWord, 3500);
```

**Fix:** Change to 5000ms (5 seconds per word).

**Also check:** The fade-out duration in `cycleWord()` (line 2033-2038) uses 400ms for the fade-out delay. This is fine but make sure the total cycle still feels smooth at the slower speed.

**Acceptance criteria:**
- Each word displays for ~5 seconds before transitioning
- The animation feels calm and deliberate, not rushed
- The fade transition itself remains smooth

---

## Item 3: Move process section

**Problem:** Process section sits between Positioning and Practice Areas. Client wants it below Practice Areas.

**Current order (by line number):**
1. Hero (1441)
2. Awards (1454)
3. Positioning (1488)
4. Process (1497)
5. Practice Areas (1527)
6. Image break + Team (1580)
7. Case Results (1622)
8. Insights (1668)

**Fix:** Cut the entire Process section (`<section class="process" id="process">` through its closing `</section>`) and paste it after the Practice Areas section closing tag and before the image break div.

**Target order:**
1. Hero
2. Awards
3. Positioning
4. Practice Areas
5. Process
6. Image break + Team
7. Case Results
8. Insights

**Acceptance criteria:**
- "Our Process" section appears immediately after "Practice Areas"
- All content, styling, and reveal animations still work correctly
- No visual gaps or broken spacing between reordered sections

---

## Item 4: Insights hover transition

**Problem:** The title hover color change on `.insight-title` is too abrupt.

**Current CSS (line 1070):**
```css
.insight-title {
  transition: color 200ms ease;
}
```

**Fix:** Slow down to match the smooth feel of other hover transitions. Change to:
```css
.insight-title {
  transition: color 350ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

Also update `.insight-row` padding transition (line 1054) to match:
```css
.insight-row {
  transition: padding-left 350ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

The easing curve `cubic-bezier(0.16, 1, 0.3, 1)` is already defined as `--ease-out` in the page's CSS variables and is used throughout for smooth transitions (e.g., hero animations, photo hover zoom). Using it here creates consistency.

**Acceptance criteria:**
- Hovering over an insight title produces a smooth, gradual color change
- The transition speed and easing feel consistent with button/arrow hover transitions elsewhere on the page
- Both the color change and the padding shift feel coordinated

---

## Item 5: Founders section variants with toggle

### 5A: Build the 50/50 split layout (Option B)

**Design spec:**
Each founder gets a horizontal card taking 50% of the container width. Cards sit side by side.

Each card layout (left to right):
- Circular photo (~200px diameter) on the left
- Right side: Name (bold), Title (lighter weight), Focus areas (small, muted), condensed bio paragraph
- No boxes or borders around cards. Whitespace separates them.
- The two cards separated by generous gap or a subtle vertical line (1px, var(--teal-15))

**Data source:** Use the existing `teamBios` array (line 1805) for bios, and the existing HTML for names/titles/focus areas/photos.

**Implementation approach:**
- Add a `body.team-split-mode` class that toggles between layouts
- Default (no class): current circles layout (Option A)
- `body.team-split-mode`: 50/50 horizontal cards (Option B)
- Use CSS to restyle `.team-grid`, `.team-member`, etc. when `.team-split-mode` is active
- In split mode, render bios directly (not in the detail panel below). Hide `.team-detail` in split mode.
- Add a smooth transition when switching between modes

### 5B: Add the customize panel

**Reference:** The homepage-explorer mockup at `/Users/nerijus/Developer/Codeable/roqski/design/mockups/homepage-explorer/index.html` has a customize panel (bottom-right corner). Study lines 162-258 (CSS) and lines 1598-1667 (HTML) and lines 2231-2431 (JS).

**Implementation:**
- Add a fixed-position customize panel at bottom-right, matching the explorer's visual style exactly
- The panel has ONE section only: "Founders" with two options: "Circles" (active by default) and "Split"
- Clicking "Circles" removes `team-split-mode` from body
- Clicking "Split" adds `team-split-mode` to body
- The drawer opens/closes on toggle button click
- Clicking outside closes the drawer
- Copy the CSS classes from the explorer: `.customize-panel`, `.customize-toggle`, `.customize-drawer`, `.customize-section`, `.customize-section-label`, `.customize-options`
- Match the exact styles (font sizes, colors, padding, border-radius, box-shadow)

**Acceptance criteria:**
- A "Customize" button is visible at bottom-right of the page
- Clicking it opens a drawer with "Founders" section and two options
- "Circles" option shows the current centered circles layout
- "Split" option shows two horizontal 50/50 cards with photo + bio
- Both layouts look polished and consistent with the rest of the page
- No boxes or bordered containers in the split layout
- Toggle transitions are smooth
- Mobile (375px): panel is accessible and both layouts are responsive (split stacks to single column)
- Clicking outside the drawer closes it

---

## Visual quality criteria (all items)

- All changes must use existing CSS variables (--teal, --orange, --teal-15, --teal-30, --teal-60, --ease-out, etc.)
- No new colors, no inline styles for colors
- Typography must match existing hierarchy (font-family, weights, sizes)
- Animations must be elegant and deliberate per brand direction
- Mobile responsive at 375px -- nothing breaks
- No boxes, tiles, or bordered containers anywhere
