# File: home.tsx

## What This File Does
`home.tsx` is the **homepage** of the Smarthub Connect marketing site. It exports a single React component called `HomePage` that renders the entire landing page as a stack of `<section>` blocks: a full-bleed hero, an intro band with stats, a 4-card services preview, a dark "Why Hong Kong" teaser, a 3-card insights preview, and a final call-to-action band.

## Where It Lives in the Project
- **Path:** `src/components/pages/home.tsx`
- **Route:** `home` → URL `#/` (the root hash route)
- Imported by `src/app/page.tsx`, where a `RouterOutlet` switch renders `<HomePage />` when the active route is `"home"`.

## What It Produces
The visitor sees, from top to bottom:
1. **Hero** — a full-height Wan Chai skyline photo with a dark teal gradient overlay. On top: a small eyebrow pill with a pulsing dot, a big white headline with a teal-gradient accent word, a lead paragraph, two buttons ("Explore services" → `/services`, "Get in touch" → `/contact`), three trust badges (TCSP license, address, MCM Group), and a bottom stats strip (25+ years, 1,200+ companies, TC010264, 24/7).
2. **Intro Band** — white section with a left text column (eyebrow, headline, paragraph, "Learn more" button to `/about`) and a right 2×2 stats grid.
3. **Services Preview** — 4 image cards (one per service), each linking to `/services`.
4. **Why Hong Kong Preview** — dark image-overlaid band with text on the left and a 2×2 glass-tile grid on the right, plus a button to `/why-hk`.
5. **Insights Preview** — 3 article cards (image, category pill, date, title, excerpt).
6. **CTA Band** — a teal gradient panel with a headline and a button to `/contact`.

## Key Concepts

- **`"use client"`** — a Next.js directive at the top of the file. It marks this component as a Client Component, meaning it runs in the browser (uses React hooks like `useLang`, can read `window`, supports interactivity). Server Components cannot use hooks or browser APIs.
- **`useLang()`** — a custom hook from `@/lib/i18n/lang-context` that returns `{ lang, setLang, t }`:
  - `lang` — the active language code: `"en"`, `"zh-HK"`, or `"zh-CN"`.
  - `setLang` — a function to switch language (not used on this page).
  - `t` — the full translation dictionary for the active language (services, insights, whyhk cards, etc.).
- **`pageContent[lang].pages.home`** (aliased as `p`) — page-specific copy (headlines, eyebrows, CTA labels) translated per language. This is kept separate from `t` for organization.
- **`heroStats[lang]`** — a 4-item array of `{ num, label }` stat tiles from `@/lib/site-data`. Same array powers both the hero stats strip and the intro band's 2×2 grid.
- **`RouterLink`** — a router-aware link component (from `@/lib/router`). Unlike a plain `<a>` tag, clicking a `RouterLink` calls `navigate(to)` which updates `window.location.hash` without a full page reload, and the hash change is picked up by the `RouterProvider` to swap in the new page. Plain `<a href="#/about">` would also work but `RouterLink` is cleaner and supports cmd/ctrl-click to open in a new tab.
- **`Button asChild`** — the shadcn/ui Button supports an `asChild` prop that lets you wrap another element (here a `RouterLink`) so the link inherits button styling. The link becomes the rendered DOM root.
- **`next/image` `<Image>`** — Next.js's optimized image component. `fill` makes it fill a positioned parent; `priority` preloads above-the-fold images; `sizes` tells the browser which image resolution to fetch at each breakpoint.
- **Tailwind utility classes** — e.g. `lg:grid-cols-4`, `bg-gradient-to-br`, `text-transparent bg-clip-text`. The `line-clamp-3`, `lift-card`, `btn-shimmer`, and `pulse-dot` classes are custom (defined in `globals.css`).

## Section-by-Section Breakdown

### Imports & module-level constants
- Pulls in `useLang`, `pageContent`, `RouterLink`, `Button`, `CTABand`, a few Lucide icons (`ArrowRight`, `MapPin`, `ShieldCheck`, `Sparkles`), `heroStats`, and `next/image`.
- `SERVICE_IMAGES` — array of 4 Unsplash URLs, one per service preview card. Indexed by position.
- `INSIGHT_IMAGES` — array of 3 Unsplash URLs for the insight preview cards.

### `HomePage` component
- Reads `t` and `lang` from `useLang()`.
- Reads `p = pageContent[lang].pages.home` for page copy.
- Reads `stats = heroStats[lang]` for the 4 stat tiles.
- Returns a React fragment `<>...</>` containing all sections.

### HERO section (`min-h-[88vh]`)
- **Background layer** — `next/image` fills a positioned container with a Wan Chai skyline photo; a dark-to-teal gradient overlay ensures white text contrast; a blurred teal glow adds depth.
- **Content column** — eyebrow pill with animated pulse dot, big H1 with a gradient-filled accent word (`p.heroAccent`), lead paragraph, two CTA buttons (`p.heroCta1`, `p.heroCta2`), and three trust badges (hard-coded credentials).
- **Stats strip** — absolutely positioned at the bottom of the hero (large screens only). Maps over `stats` to render 4 tiles separated by left borders.

### INTRO BAND section (white)
- 12-column grid: left 7 cols hold eyebrow, H2, paragraph, and an "outline" button linking to `/about`; right 5 cols hold a 2×2 stats grid built from the same `stats` array. Uses a `gap-px` + `bg-slate-200` trick to draw thin divider lines between tiles.

### SERVICES PREVIEW section
- Heading row (eyebrow, H2, lead, and an "outline" button to `/services`) followed by a 4-column responsive grid (`sm:grid-cols-2 lg:grid-cols-4`). Each card is a `RouterLink to="services"` containing an image (with gradient overlay and title), a 3-line clamped description, and a "Learn more" affordance.

### WHY HK PREVIEW section (dark)
- Full-bleed dark image background with overlay. Left column: eyebrow pill, H2, lead, and a white button to `/why-hk`. Right column: 2×2 grid of glass-style tiles showing the first 4 entries of `t.whyhk.cards`.

### INSIGHTS PREVIEW section (white)
- Heading row + 3-column grid (`md:grid-cols-3`). Each `<article>` card shows an image with category pill, date, title, and a 3-line clamped excerpt. Maps over `t.insights.items`.

### CTA BAND (reusable block)
- Renders `<CTABand title={p.ctaTitle} lead={p.ctaLead} buttonLabel={p.ctaButton} buttonTo="contact" />`. The `CTABand` component (from `@/components/blocks/cta-band`) draws a teal gradient panel with decorative grid + glow, a centered headline, lead, and a white button linking to the specified route.

## How It Connects to Other Files

- **Imports from:**
  - `@/lib/i18n/lang-context` → `useLang`
  - `@/lib/i18n/page-content` → `pageContent`
  - `@/lib/router` → `RouterLink`
  - `@/components/ui/button` → `Button`
  - `@/components/blocks/cta-band` → `CTABand`
  - `@/lib/site-data` → `heroStats`
  - `lucide-react` → icons
  - `next/image` → `Image`
- **Imported by:** `src/app/page.tsx` (the Next.js root page). It renders `<HomePage />` inside `RouterOutlet` when `route === "home"`.
- **Router mapping:** URL `#/` (or no hash) → route `"home"` → renders `<HomePage />`. See `src/lib/router.tsx` for the `ROUTE_MAP`.

## Common Beginner Questions

**Q: Why are there two sources of text — `t` (from `useLang`) and `p` (from `pageContent`)?**
A: They're both part of the same i18n system, just organized differently. `t` is the merged dictionary (built in `lang-context.tsx`) that includes navigation, services, insights, and page-level copy under `t.pages`. `p` is a direct shortcut to `pageContent[lang].pages.home` for the homepage's own copy. Both work; `p` is shorter and clearer when you only need this page's strings.

**Q: Why does the hero stats strip use `hidden ... lg:block`?**
A: It's `hidden` by default and only shown on large (`lg:`) screens. On mobile, the strip would crowd the hero; the same stats already appear in the intro band's 2×2 grid below.

**Q: What does `asChild` on the Button do?**
A: Instead of rendering a `<button>` element, `asChild` makes the Button component clone its child (the `RouterLink`) and merge its styles/props onto it. The result is an `<a>` tag that looks like a button but navigates via the hash router — no `<button>`-inside-`<a>` invalid HTML.
