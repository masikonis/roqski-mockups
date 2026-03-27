# Homepage Mockup Brief

## What We Built

A single interactive homepage mockup with two layers of control:

1. **Designer's Picks** (bottom-left corner) - Two curated presets you defined. Click Option A or Option B and the entire page changes at once. Hover for a description of each direction's intent.

2. **Customize** (bottom-right corner) - Opens a drawer with every section toggle. The client can tweak individual settings after seeing the presets. When they deviate from a preset, an orange dot appears to signal they're in custom territory.

This replaces the traditional approach of showing two separate static mockups. Instead of "here's version A, here's version B, which do you prefer?", the conversation becomes "here are two directions - and here's how every piece can be mixed."

## The Two Presets

**Option A: "Here are the people who will handle your matter, here's what they've achieved, explore at your pace."**

Founders in the hero, photo team grid, accordion practice areas, all case result figures visible, uniform insights, sans-serif headings. This is the most Counsel-faithful direction - warm, interactive, evidence on the surface.

**Option B: "Read our work, judge our depth, decide when you're ready."**

City skyline hero, typographic team list (no photos), direct-link practice areas, case results with narrative descriptions, featured first article, serif headings, button CTA in footer. Editorial, type-driven, structured. Same brand, different posture.

## What Each Toggle Controls

| Section | Options | What It Tests |
|---|---|---|
| Headings | Sans-serif / Serif | Typography direction for the whole page + logo swap |
| Nav CTA | Text / Outlined / Filled | How prominent the consultation link should be |
| Hero | Founders / Dark / City | Photography approach and first impression |
| Practice Areas | Accordion / List | Interactive depth vs direct navigation |
| Team | Photos / Typographic / Editorial | Biggest visual decision - faces vs pure typography |
| Case Results | Ledger / Reveal / Detailed | How evidence is presented (all visible, on-click, with narratives) |
| Insights | Uniform / Featured | Equal treatment vs editorial hierarchy |
| Footer CTA | Text / Button | How strong the closing conversion moment should be |

## How the Presets Connect

Every toggle is part of the preset system. When you click Option A, all 8 settings change simultaneously. If the client then tweaks one setting (say, switches the team from photos to editorial), the orange dot appears on "Customize" and neither preset is highlighted - they're in custom territory. Clicking a preset again resets everything.

## What to Review Before Showing the Client

1. **Are the preset combinations right?** We chose what we thought tells the best story for A and B. You spoke with the client directly - adjust if your instinct differs.

2. **Typography and spacing.** The proportions are reasonable but benefit from a designer's eye. Heading sizes, section padding, line spacing - tune in browser.

3. **Hero images are AI-generated.** Good enough for mockup purposes. The founders composite preserves likeness but isn't a real photograph. Flag this to the client.

4. **Team editorial variant (option C)** is our creative addition - small inline photos in horizontal rows. It's a middle ground between the photo grid and pure typographic list. Decide if it earns its place or if two options are enough.

5. **The "Reveal" case results option** uses the Bedrock interaction the client praised (categories visible, figures appear on click). It reuses the accordion pattern from practice areas so it feels native to Counsel rather than imported.

## How to Run the Call

**Start with the presets.** Show Option A first (it loads by default). Scroll through the whole page. Then click Option B. Let the visual difference land before explaining anything. The contrast does the talking.

**Then open the customize drawer.** Pick one section they react to and show them the toggle. "You liked Option A's team photos but Option B's serif headings? Here, try that combination." Let them drive.

**Don't explain every option.** They'll explore on their own. Focus on the two or three decisions that matter most: team treatment, case results presentation, and typography direction. Those are the decisions that define the site's personality.

**What to listen for:**
- Do they gravitate toward photos or typography for the team? This shapes every interior page.
- Do they want case results visible immediately or revealed on interaction? This tells you how much they trust their evidence to speak for itself.
- Serif or sans-serif? This plus the logo choice defines the typographic identity going forward.

## Technical Notes

- Single HTML file with inlined CSS/JS: `design/mockups/homepage/index.html`
- Deployed to GitHub Pages for easy sharing
- All images in `design/mockups/homepage/images/`
- Logo SVGs (your serif and sans-serif options) swap automatically with the heading toggle
- Responsive down to mobile but optimized for desktop presentation
