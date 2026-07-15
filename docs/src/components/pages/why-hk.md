# File: why-hk.tsx

## What This File Does
`why-hk.tsx` is the **Why Hong Kong** page. It exports a `WhyHKPage` component that makes the case for setting up a business in Hong Kong: 6 benefit cards, a teal stats band with a grid pattern overlay, a full-bleed Hong Kong skyline image with overlay text, and a dark-variant closing call-to-action. All copy is translated per language.

## Where It Lives in the Project
- **Path:** `src/components/pages/why-hk.tsx`
- **Route:** `why-hk` → URL `#/why-hong-kong` (note: the URL slug is `why-hong-kong`, but the internal route key is `why-hk`. The router maps between them in `src/lib/router.tsx`.)
- Imported by `src/app/page.tsx`; rendered by `RouterOutlet` when `route === "why-hk"`.

## What It Produces
The visitor sees, top to bottom:
1. **PageHero** — medium-height dark image banner with eyebrow, H1, and lead.
2. **Benefits grid** — 6 cards in a 3-column grid (2 on tablet, 1 on mobile). Each card has a large faint number watermark ("01"–"06") in the corner, a teal-gradient icon tile, an H3 title, and a description.
3. **HK stats band** — teal gradient background with a faint white grid pattern overlay. A centered H2 title, then a 6-column grid of stat tiles (number + label).
4. **HK image band** — a 400px-tall full-bleed Hong Kong skyline photo with a left-to-right dark gradient. Overlay text (title + paragraph) on the left.
5. **CTABand** — closing band, but with the `"dark"` variant (slate-950 background) instead of the default teal gradient.

## Key Concepts

- **`PageHero`, `SectionHeading`, `CTABand`** — reusable block components. `SectionHeading` is imported but not used on this page.
- **`useLang()`** — returns `{ lang, setLang, t }`.
- **Three sources of copy:**
  - `p = pageContent[lang].pages.whyhk` — page-level copy (hero, `stats` array, CTA labels).
  - `t.whyhk.cards` — the 6 benefit cards (from the base translations).
  - `t.whyHkExtra.bandTitle` / `bandBody` — the image-band overlay text (merged in from `extra-content.ts` via `lang-context.tsx`).
- **Number watermark pattern** — a big faint "01"–"06" number positioned absolutely in the top-right of each card. `pointer-events-none` ensures clicks pass through to the card. Achieved with `text-slate-50` (almost the same as the white card background) for a subtle effect.
- **Grid pattern overlay** — a CSS `backgroundImage` of two repeating linear gradients (one horizontal, one vertical) creates a faint grid. `opacity-10` keeps it subtle. Used on the stats band and the CTABand.
- **`CTABand variant="dark"`** — the same reusable component, but the `variant` prop switches it from the default teal gradient to a `slate-950` dark background. Lets each page pick a mood.

## Section-by-Section Breakdown

### Imports & constants
- Block components, 6 Lucide icons (`Banknote`, `Globe`, `Scale`, `ShieldCheck`, `Plane`, `Users`), and `next/image`.
- `WHY_ICONS` — array of 6 icons paired by index with `t.whyhk.cards`.

### `WhyHKPage` component
- Destructures `{ t, lang }` from `useLang()` and reads `p` from `pageContent[lang].pages.whyhk`.

### PageHero
- Medium height, with a Hong Kong photo.

### Benefits grid section (white)
- 3-column responsive grid. `.map` over `t.whyhk.cards` (6 items). For each:
  - Picks `Icon = WHY_ICONS[i] ?? ShieldCheck`.
  - **Number watermark** — `0{i + 1}` renders as "01", "02", ..., "06".
  - **Icon tile** — a teal-to-emerald gradient square with the icon in white.
  - **Title + description** in a `relative` container so they sit above the watermark.

### HK stats band (teal gradient + grid overlay)
- Background: `from-teal-600 via-teal-700 to-emerald-700` gradient.
- A `pointer-events-none absolute inset-0 opacity-10` div holds the CSS grid pattern.
- Centered H2 title (`p.statsTitle`), then a 6-column grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`) of stat tiles from `p.stats`. Each tile has a big number and a small uppercase label.

### HK image band (full-bleed)
- `h-[400px]` fixed-height section with a `<Image fill>` background.
- A `bg-gradient-to-r from-slate-900/80 to-transparent` overlay darkens the left side for text contrast.
- A `max-w-7xl` container holds a `max-w-xl` text column with `t.whyHkExtra.bandTitle` (H2) and `t.whyHkExtra.bandBody` (paragraph).

### CTABand (dark variant)
- `<CTABand title={p.ctaTitle} lead={p.ctaLead} buttonLabel={p.ctaButton} buttonTo="contact" variant="dark" />` — uses this page's own CTA copy and the dark background variant.

## How It Connects to Other Files

- **Imports from:**
  - `@/lib/i18n/lang-context` → `useLang`
  - `@/lib/i18n/page-content` → `pageContent`
  - `@/components/blocks/page-hero` → `PageHero`
  - `@/components/blocks/section-heading` → `SectionHeading` (imported but unused)
  - `@/components/blocks/cta-band` → `CTABand`
  - `lucide-react` → 6 icons
  - `next/image` → `Image`
- **Imported by:** `src/app/page.tsx`.
- **Router mapping:** URL `#/why-hong-kong` → route `"why-hk"`. Note the slug vs. key difference in `src/lib/router.tsx`.

## Common Beginner Questions

**Q: Why are there three different sources of text (`p`, `t.whyhk.cards`, `t.whyHkExtra`)?**
A: They evolved at different times. `pageContent` holds the bulk of per-page copy (hero, stats, CTAs). `t.whyhk.cards` lives in the base `translations` dictionary (older). `t.whyHkExtra` lives in `extra-content.ts` and gets merged into `t` by `lang-context.tsx`. It's a bit messy but functional — they're all available as `t.*` or `p.*` at render time.

**Q: Why does this page use `variant="dark"` on the CTABand when other pages use the default teal?**
A: Visual variety. This page already has a teal stats band above the CTA, so a second teal band right below would feel repetitive. The dark slate-950 variant provides contrast.

**Q: What is `0{i + 1}` doing in the watermark?**
A: `i` is the array index (0–5), so `i + 1` is 1–6. The leading `0` is a string literal, so the result is "01", "02", ..., "06" — zero-padded two-digit numbers. It's a quick inline formatting trick.
