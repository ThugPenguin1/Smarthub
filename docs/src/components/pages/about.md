# File: about.tsx

## What This File Does
`about.tsx` is the **About page**. It exports an `AboutPage` React component that renders the company story, four core values, the MCM Group ecosystem (with Smarthub highlighted), a team blurb, and a final call-to-action. All copy is pulled from `pageContent[lang].pages.about`, so the page works in English, Cantonese, and Mandarin.

## Where It Lives in the Project
- **Path:** `src/components/pages/about.tsx`
- **Route:** `about` → URL `#/about`
- Imported by `src/app/page.tsx` and rendered by `RouterOutlet` when the active route is `"about"`.

## What It Produces
The visitor sees, top to bottom:
1. **PageHero** — a tall dark image banner with eyebrow, H1 title, and lead paragraph (`height="lg"` = tallest hero variant).
2. **Story section** — two columns: left = section heading + multi-paragraph story; right = an office photo (4:5 portrait) + a small TCSP licence card.
3. **Values section** — centered heading + 4 icon cards (Trust, People, Languages, Service).
4. **MCM Group section** — dark image-overlaid band; left = heading + paragraph; right = 2×3 grid of 6 entity tiles where "Smarthub" is highlighted with a teal ring and "You are here" label.
5. **Team section** — two columns: square photo on the left, heading + paragraph on the right (text-first on mobile).
6. **CTABand** — final teal gradient panel with a button to `/contact`.

## Key Concepts

- **`PageHero`** — a reusable block (`@/components/blocks/page-hero`) that renders a dark image banner with an eyebrow pill, H1 title, and optional lead. Props include `height` (`"sm" | "md" | "lg"`), `align` (`"left" | "center"`), and an `image` URL. Used at the top of every interior page for visual consistency.
- **`SectionHeading`** — another reusable block (`@/components/blocks/section-heading`) that renders an eyebrow pill + H2 + optional lead. Props: `eyebrow`, `title`, `lead`, `align`, `dark` (for use on dark backgrounds).
- **`CTABand`** — reusable closing call-to-action panel (`@/components/blocks/cta-band`) with title, lead, and a button. Props: `title`, `lead`, `buttonLabel`, `buttonTo` (a route key), `variant` (`"teal" | "dark"`).
- **`useLang()`** — custom hook returning `{ lang, setLang, t }`. Here only `lang` is destructured because all copy lives in `pageContent` (aliased as `p`).
- **`pageContent[lang].pages.about`** — the per-language about-page copy object: `heroEyebrow`, `heroTitle`, `storyBody` (array of paragraphs), `values` (array of `{title, text}`), etc.
- **Icon-by-position pattern** — `VALUE_ICONS = [ShieldCheck, Users, Languages, HeartHandshake]` pairs icons to values by index. The `?? ShieldCheck` fallback prevents crashes if a 5th value were added without updating the icons array.
- **Responsive reordering** — Tailwind's `order-1` / `order-2` utilities swap column order at the `lg:` breakpoint. Used in the Team section so mobile users see text before the image.
- **`next/image` `<Image>`** — Next.js's optimized image component. Used with `fill` (fills a positioned parent) and `sizes` (responsive resolution hints).

## Section-by-Section Breakdown

### Imports & constants
- Brings in `useLang`, `pageContent`, the three block components (`PageHero`, `SectionHeading`, `CTABand`), four Lucide icons, and `next/image`.
- `VALUE_ICONS` — array of 4 Lucide icon components, one per value card.

### `AboutPage` component
- Reads `lang` from `useLang()` and `p` (about copy) from `pageContent`.
- Returns a fragment with hero + 4 sections + CTA.

### PageHero
- `<PageHero eyebrow={p.heroEyebrow} title={p.heroTitle} lead={p.heroLead} image={...} height="lg" />` — the tallest hero variant.

### STORY section (white)
- 12-column grid: left 7 cols hold `SectionHeading` + a `map` over `p.storyBody` (an array of paragraph strings). Right 5 cols hold a 4:5 office photo with a strong shadow, followed by a small `slate-50` card showing the TCSP licence number and the issuing authority (Hong Kong Companies Registry).

### VALUES section (subtle gradient)
- `SectionHeading` is centered here. Then a 4-column grid (2 on small screens). Each card has a colored icon tile (gradient background + ring), an H3 title, and a description. The icon is picked from `VALUE_ICONS[i]` with a fallback.

### MCM GROUP section (dark image overlay)
- Background: a full-bleed office image with a dark gradient overlay.
- Left column: `SectionHeading` with `dark` prop (renders in light text on dark bg) + a paragraph.
- Right column: 2×3 grid of 6 entity names (`MCAH`, `MCAM`, `MCMWM`, `MCF`, `Smarthub`, `MCU Institute`). The `Smarthub` tile gets `ring-2 ring-teal-400/40` and is labeled "You are here"; others are labeled "Sister entity".

### TEAM section (white)
- 12-column grid. The photo column uses `order-2 lg:order-1` so on mobile the text appears first; the text column uses `order-1 lg:order-2`. Photo is a square aspect ratio. Text column has a `SectionHeading` + a paragraph.

### CTABand (closing)
- `<CTABand title={...home.ctaTitle} lead={...home.ctaLead} buttonLabel={p.groupCta} buttonTo="contact" />` — note the title and lead are reused from the homepage's CTA copy for consistency; only the button label comes from the about page (`p.groupCta`).

## How It Connects to Other Files

- **Imports from:**
  - `@/lib/i18n/lang-context` → `useLang`
  - `@/lib/i18n/page-content` → `pageContent`
  - `@/components/blocks/page-hero` → `PageHero`
  - `@/components/blocks/section-heading` → `SectionHeading`
  - `@/components/blocks/cta-band` → `CTABand`
  - `lucide-react` → icons (`ShieldCheck`, `Users`, `Languages`, `HeartHandshake`)
  - `next/image` → `Image`
- **Imported by:** `src/app/page.tsx` (renders `<AboutPage />` when `route === "about"`).
- **Router mapping:** URL `#/about` → route `"about"`. See `src/lib/router.tsx`.

## Common Beginner Questions

**Q: Why does this page use `PageHero` and `SectionHeading` instead of writing the markup inline?**
A: These reusable blocks keep every interior page visually consistent (same hero treatment, same heading style). If you tweak the hero gradient in `page-hero.tsx`, every page updates at once — no copy/paste drift.

**Q: Why are the values icons paired by index instead of being a field on each value object?**
A: The translation dictionary (`pageContent`) stores only text (so it can be easily translated), while icons are React components that can't live in a JSON-style translation file. The `VALUE_ICONS` array keeps the two in sync by position. It's a simple pattern that works for short, stable lists.

**Q: Why does the CTABand reuse the homepage's `ctaTitle` and `ctaLead`?**
A: So the closing call-to-action reads identically across every page. Only the button label (`p.groupCta`) varies per page to match the section above it. This is a deliberate consistency choice, not a copy/paste mistake.
