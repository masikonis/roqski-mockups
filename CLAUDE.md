# Working with the designer

This repo holds static HTML/CSS mockups for the **Roquemore Skierski** marketing site (a Dallas-Fort Worth business litigation firm). The mockups are a design artifact. They'll later be translated into the real production site in WordPress.

The person you're collaborating with in this repo is a **designer, not a developer**. This might be their first time using Claude Code. Keep that front of mind.

## How to talk to them

- Plain English. No jargon. If you must use a technical term, explain it in one short sentence.
- Describe changes in terms of what they'll **see on the page**, not what's happening in the code.
- Never show long code blocks unless they ask. Summarize what you changed visually: *"I made the hero heading bigger and added more space under it."*
- If something's ambiguous, ask. Don't guess.
- They'll describe things the way a designer would ("make this feel lighter", "more breathing room", "less aggressive"). Translate that into CSS. Don't ask them to be more technical.

## Which folder is live

There are two folders in this repo:

- **`static-pages/`** is the active working folder. The homepage lives here (`index.html`), and the about page is being built here next (`about.html`). **Always work in `static-pages/` unless told otherwise.**
- `homepage-explorer/` is an old exploration from early in the project. Leave it alone.

## Structure of `static-pages/`

```
static-pages/
├── index.html                ← homepage
├── about.html                ← about page (being built)
├── images/                   ← photos, logos, icons
├── scripts/
│   └── site.js               ← all site-wide JS (nav, carousels, scroll reveal, etc.)
└── styles/
    ├── common.css            ← site-wide tokens: colors, fonts, base spacing, resets
    ├── nav.css               ← header / navigation (shared across pages)
    ├── footer.css            ← footer (shared across pages)
    └── sections/             ← one CSS file per page section
        ├── hero.css
        ├── practice-areas.css
        ├── team.css
        └── ...
```

**About `scripts/site.js`:** every page links this one file before `</body>`. Each behavior inside (nav dropdowns, mobile menu, scroll reveals, hero animation, team roster bios, testimonial carousel) checks for its own elements before running, so the file is safe to include on every page even if the page doesn't use every behavior. When a new page needs a new interactive behavior, add it to `site.js` using the same pattern.

**Rules:**

- Shared components (like `nav.css` and `footer.css`) live directly in `styles/`.
- One CSS file per page section goes in `styles/sections/`.
- `common.css` holds site-wide tokens only. Colors, fonts, base resets. Don't dump page styles there.
- If a section is used on more than one page, it lives in `styles/sections/` and is linked from both HTML files (for example, `process.css` is used on both the homepage and about page).
- If a section is unique to one page, still put the CSS in `styles/sections/` for now (the project is small). If we ever outgrow this, we'll reorganize into per-page folders.

## Useful skill: `/frontend-design`

Claude Code ships with a skill called **`/frontend-design:frontend-design`** that is great for this project. It helps produce polished, distinctive frontend work and avoids generic-looking output. Suggest it to the designer when they:

- Ask for a new page or section from scratch.
- Want a section to feel more "designed" or less generic.
- Are iterating on visual quality (typography, layout, spacing, hierarchy).

They can invoke it by typing `/frontend-design:frontend-design` in the Claude Code prompt, or just describe what they want in plain language and you can route the work through the skill.

## Working in small steps

Small steps beat big ones. Always.

- Make **one visible change at a time**. Adjust spacing, reload the browser, move on. Don't batch five unrelated tweaks.
- After each change, reload the browser and check it looks right before continuing.
- If the designer asks for several things at once, do them one by one and confirm each, not all in one go.
- If something breaks or looks wrong, stop and fix it before piling more changes on top.

Small steps make it easy to see what caused what, and easy to undo if needed.

## Previewing changes

The designer needs to see changes in a browser to judge them. From the `design/mockups` folder, run:

```
open static-pages/index.html
```

Or for the about page:

```
open static-pages/about.html
```

You can run this yourself, or tell the designer to run it. Either works. After any change, the designer must **reload the browser tab** to see it (you can't reload it for them). Always preview before committing. If something looks off, fix it first.

There's also a live version hosted on GitHub Pages: https://masikonis.github.io/roqski-mockups/static-pages/ (updates within a minute or two after you push). This is the link we send to the client.

## Starting a new page

Right now there's `index.html` (homepage) and `about.html` (in progress). When the designer wants another page, say, a **Team** page, here's the flow. Walk them through it. Don't just do it silently.

### 1. Create the HTML file at the root of `static-pages/`

Every page is its own `.html` file. For Team, that's `static-pages/team.html`.

### 2. Reuse what already exists

Every page shares the **header**, **footer**, **common.css**, and **scripts/site.js**. The new file should pull those in exactly like `index.html` does:

```html
<link rel="stylesheet" href="styles/common.css">
<link rel="stylesheet" href="styles/nav.css">
<!-- page-specific section styles go here -->
<link rel="stylesheet" href="styles/footer.css">
```

And just before `</body>`:

```html
<script src="scripts/site.js"></script>
```

Then **copy the `<nav>` and `<footer>` markup** from `index.html` into the new page. Same HTML, same CSS, identical look, consistent across the site.

> **Rule of thumb:** if something appears on more than one page (header, footer, a button style, a card layout), its CSS stays in `styles/sections/` (or directly in `styles/` if it's a site-wide component like nav) and its markup gets copied between pages. Never copy-paste CSS into two places. That's how things drift out of sync. Same for JS: new interactive behavior goes into `scripts/site.js`, not inline in the HTML.

### 3. Link the section styles

For the new page, link each section's CSS file between the nav and footer styles:

```html
<link rel="stylesheet" href="styles/common.css">
<link rel="stylesheet" href="styles/nav.css">
<link rel="stylesheet" href="styles/sections/team-hero.css">
<link rel="stylesheet" href="styles/sections/team-grid.css">
<link rel="stylesheet" href="styles/footer.css">
```

### 4. Spot reusable pieces

If while building a new page you notice a style or block that's **the same as something on another page**, stop and promote it:

- Make sure the CSS lives in **one** file in `styles/sections/` (or `styles/` for site-wide components).
- Link that file from both pages.
- Use the same HTML markup on both.

Components exist so one change updates everywhere.

### 5. Good first commit for a new page

Once the new page loads in the browser with nav and footer looking right (even if the middle is empty), **commit**. That's the "skeleton works" checkpoint. Then build the page section by section, committing as each section lands.

## Committing (saving progress)

Git is how we save snapshots of the work. When the designer reaches something they might want to come back to, **remind them to commit**. Don't wait for them to ask.

**Good moments to suggest a commit:**

- A section looks the way they wanted.
- A whole page is done or in a good intermediate state.
- Before trying something experimental (so they can roll back if it doesn't work).
- End of a work session.

**How to prompt them:** *"This looks like a good checkpoint. Want me to save it? I'll commit with a message like 'Tighten hero spacing and update CTA color'."*

When they agree, commit with a short, plain-English message that describes the **visible change**, not the code. Examples:

- Good: `Tighten hero spacing and update CTA color`
- Good: `Add firm story section to about page`
- Bad: `Update CSS` (too vague)
- Bad: `Refactor hero.css flex layout` (too technical)

This repo has its own remote (`masikonis/roqski-mockups`). **Push often.** Every commit worth keeping should get pushed to GitHub the same session. That way:

- The work is backed up (laptop dies, no work lost).
- Anything can be rolled back to a prior commit if an experiment goes sideways.
- The designer can always get back to a known-good state.
- The live GitHub Pages URL updates so we can share the latest with the client.

After committing, offer to push: *"Want me to push this to GitHub too?"* Default to yes unless they say otherwise.

## Rolling back when something breaks

The whole point of committing often is to make mistakes cheap. When the designer wants to undo, they'll ask in plain English: *"go back to before the team section changes"*, *"undo the last thing"*, *"I liked the hero from yesterday better"*.

- Use `git log --oneline` to find the right commit.
- For the most recent commit: `git revert HEAD` (keeps history clean, safe default).
- For going back several commits, or discarding uncommitted work: confirm with the designer first, then use `git reset --hard <commit>` (destructive, make sure pushed work isn't lost).
- If in doubt, ask: *"Want me to undo just the last change, or go all the way back to [earlier state]?"*

Explain the result in visual terms (*"I've restored the hero back to the version from this morning, the big heading is back"*), not in git terms. The designer doesn't need to know what revert vs. reset means.

## The client

The client (Michael, partner at the firm) reviews the live GitHub Pages link and sends written feedback in rounds. He's detail-oriented and will notice small things: sizing inconsistencies, motion timing, image quality, optical alignment, mobile bugs (especially on iPhone 14).

Two things to know:

- **Cache.** The client rarely succeeds at hard-refreshing. When you generate a link to share, append a version param like `?v=2` and bump the number each time (`?v=3`, `?v=4`). This forces a fresh load.
- **Mobile.** Always test on a mobile breakpoint (roughly 390px wide) before saying a change is ready. Most of the client's mobile bugs come from this width.

## If they get stuck

Encourage them to describe **what they see vs. what they want**. That's always enough to go on. They don't need to know the code. Example: *"The buttons in the nav feel too close together"* is a perfectly good brief.

## What not to do

- Don't reorganize files, rename things, or "clean up" code unless asked.
- Don't add new tools, frameworks, or build steps. This is plain HTML + CSS on purpose.
- Don't make invisible changes (refactors, reformatting). Every commit should correspond to something the designer can see.
- Don't pile up changes. Small, visible, committed steps are better than one big one.
- Don't touch `homepage-explorer/`. That folder is archived exploration.
