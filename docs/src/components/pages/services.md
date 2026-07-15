# File: services.tsx

## What This File Does
`services.tsx` is the **Services page**. It exports a `ServicesPage` component that renders the 4 core Smarthub Connect services as alternating image/text rows (with a feature checklist per service), followed by a pricing teaser card and a closing call-to-action band. All text is pulled from the translation dictionaries via `useLang()` and `pageContent`.

## Where It Lives in the Project
- **Path:** `src/components/pages/services.tsx`
- **Route:** `services` → URL `#/services`
- Imported by `src/app/page.tsx`; rendered by `RouterOutlet` when `route === "services"`.

## What It Produces
The visitor sees, top to bottom:
1. **PageHero** — medium-height dark image banner with eyebrow, H1 title, and lead.
2. **Detailed services** — 4 two-column rows, alternating image-left / image-right. Each row has:
   - An image (5:4 aspect) with a small white icon badge in the top-left corner.
   - A tag pill, H2 title, description paragraph, a 2-column feature checklist (with green check icons), and a "Get started" button linking to `/contact`.
3. **Pricing teaser** — a single white card on a soft gradient. Left side: heading + body text; right side: a large button linking to `/pricing`.
4. **CTABand** — closing teal gradient panel with a button to `/contact`.

## Key Concepts

- **`PageHero`, `SectionHeading`, `CTABand`** — reusable block components. `PageHero` and `CTABand` are used here; `SectionHeading` is imported but not used on this particular page.
- **`useLang()`** — returns `{ lang, setLang, t }`. Here we use both `t` (for the `services.items` array) and `lang` (to index `pageContent`).
- **`t.services.items`** — an array of 4 service objects, each shaped like `{ tag, title, desc, features[] }`. Translation-per-language means each language has its own 4-item array.
- **`pageContent[lang].pages.services`** (aliased `p`) — page-level copy: hero text, the per-row CTA label (`p.detailCta`), and the pricing teaser text.
- **Alternating layout pattern** — `const flip = i % 2 === 1` checks whether the index is odd. When `flip` is true, the image column gets `lg:order-2` (moves to the right) and the text column gets `lg:order-1` (moves to the left). This creates a zig-zag visual rhythm down the page.
- **`Button asChild`** — wraps a `RouterLink` so the link is rendered with button styling.
- **`next/image` `<Image>`** — optimized images. `fill` + `sizes` + `object-cover` is the standard pattern for responsive cover images.

## Section-by-Section Breakdown

### Imports & constants
- Imports block components, Lucide icons (`Check`, `ArrowRight`, `Briefcase`, `Building2`, `Wifi`, `Presentation`), `next/image`, and `RouterLink`.
- `SERVICE_IMAGES` — 4 Unsplash URLs, one per service.
- `SERVICE_ICONS` — 4 Lucide icon components, one per service, shown as a badge on the image.

### `ServicesPage` component
- Destructures `{ t, lang }` from `useLang()`.
- Reads `p` from `pageContent[lang].pages.services`.
- Returns a fragment with hero + services list + pricing teaser + CTA.

### PageHero
- `height="md"` gives a medium-height hero.

### Detailed services section
- Wraps a `space-y-24 lg:space-y-32` container so rows have generous vertical spacing.
- `.map` over `t.services.items` (4 items). For each:
  - Picks `Icon = SERVICE_ICONS[i] ?? Briefcase` (safe fallback).
  - Computes `flip = i % 2 === 1` to alternate layout direction.
  - **Image column** — 5:4 aspect image with a soft top gradient, and a white icon badge positioned top-left.
  - **Text column** — tag pill, H2 title, description, a 2-column feature checklist (`svc.features.map`), and a teal-gradient "Get started" button that links to `/contact` via `RouterLink`.

### Pricing teaser section
- A soft tri-color gradient background (`from-teal-50 via-white to-rose-50`).
- A single white card with a strong shadow, split into 2 columns: left = `lg:col-span-2` heading + body; right = a large button linking to `/pricing`.

### CTABand
- Reuses the homepage's `ctaTitle`, `ctaLead`, and `ctaButton` so the closing CTA reads identically across every page.

## How It Connects to Other Files

- **Imports from:**
  - `@/lib/i18n/lang-context` → `useLang`
  - `@/lib/i18n/page-content` → `pageContent`
  - `@/components/blocks/page-hero` → `PageHero`
  - `@/components/blocks/section-heading` → `SectionHeading` (imported but unused on this page)
  - `@/components/blocks/cta-band` → `CTABand`
  - `@/components/ui/button` → `Button`
  - `lucide-react` → icons
  - `next/image` → `Image`
  - `@/lib/router` → `RouterLink`
- **Imported by:** `src/app/page.tsx`.
- **Router mapping:** URL `#/services` → route `"services"`.

## Common Beginner Questions

**Q: How does the alternating layout actually work?**
A: Tailwind's `order-*` utilities control flex/grid item order. On large screens, the image column normally appears first (`order-1` is default). When `flip` is true, the image column gets `lg:order-2` and the text column gets `lg:order-1`, swapping their visual positions. On mobile (`<lg`) both columns stack in source order regardless of `order-*`.

**Q: Why is `svc.features` a separate array per service?**
A: Each service has a different number and set of features. Storing them as an array in the translation dictionary lets the same JSX (`svc.features.map(...)`) render 3 features for one service and 6 for another without code changes.

**Q: Why is there a "Get started" button per service instead of one global CTA?**
A: Each button links to the same `/contact` page, but the visual repetition gives visitors a clear next step after reading each service. (The contact page does not currently preselect a service based on which button was clicked — that's a possible future enhancement.)
