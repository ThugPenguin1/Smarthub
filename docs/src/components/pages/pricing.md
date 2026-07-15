# File: pricing.tsx

## What This File Does
`pricing.tsx` is the **Pricing page**. It exports a `PricingPage` component that shows 3 subscription tiers (Starter, Professional [highlighted as "popular"], Enterprise), a workspace add-ons grid, and a FAQ accordion. Each tier's CTA button deep-links to the contact form with the matching service preselected via a URL query string. All copy is translated per language.

## Where It Lives in the Project
- **Path:** `src/components/pages/pricing.tsx`
- **Route:** `pricing` → URL `#/pricing`
- Imported by `src/app/page.tsx`; rendered by `RouterOutlet` when `route === "pricing"`.

## What It Produces
The visitor sees, top to bottom:
1. **PageHero** — medium-height dark image banner with eyebrow, H1, and lead.
2. **Tiers** — 3-column grid of pricing cards. The middle "Professional" card is highlighted with a teal border + ring, a slight upward translate (`lg:-translate-y-3`), and a star badge floating above the top edge. Each card shows: tier name, tagline, price (with optional HK$ prefix), description, a deep-link CTA button, divider, and a feature checklist.
3. **Workspace add-ons** — a bordered card with a 3-column grid of small add-on tiles (name, price pill, description).
4. **Disclaimer** — a tiny centered line under the add-ons.
5. **FAQ** — a centered SectionHeading + a Radix Accordion of question/answer pairs.
6. **CTABand** — closing teal gradient panel.

## Key Concepts

- **`useLang()`** — returns `{ lang, setLang, t }`. Both `t` and `lang` are used.
- **Three data sources:**
  - `t.pricing.tiers` — the 3 tier objects, each `{ name, tagline, price, period, desc, cta, popular, features[] }`.
  - `t.pricing.workspace` — the add-on tiles, each `{ name, price, desc }`.
  - `p = pageContent[lang].pages.pricing` — page-level copy (hero, FAQ title, `faq` array).
  - `t.pricingExtra.faqEyebrow` — the FAQ section eyebrow (from `extra-content.ts`).
- **"Popular" highlight pattern** — `const isPopular = tier.popular` drives all the highlight styling via conditional className strings. The same boolean controls: border color, ring, translate, badge visibility, button gradient, and check-circle color.
- **Deep-link CTA** — the tier button is a plain `<a href="#/contact?service=...">`, not a `RouterLink`, because it needs to attach a query string. The `encodeURIComponent` call URL-encodes the service name (important for Chinese characters). The contact page (`contact.tsx`) parses this query string on mount and uses it to preselect the matching option in the service dropdown.
- **`HK$` prefix logic** — `tier.price !== "Custom"` (and its Chinese equivalents) decides whether to show the "HK$" currency prefix. The "Enterprise" tier's price is "Custom" so it shows just the word with no currency symbol.
- **Radix Accordion** — the `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` components come from `@/components/ui/accordion` (a shadcn/ui wrapper around Radix UI primitives). `type="single"` means only one item can be open at a time; `collapsible` lets you close an open item. The `data-[state=open]:...` Tailwind variant classes restyle the item when open (teal border + ring).
- **`Button asChild`** — wraps an `<a>` so the link gets button styling.

## Section-by-Section Breakdown

### Imports & `PricingPage` component
- Imports block components, `Button`, the 4 accordion parts, and 3 Lucide icons (`Check`, `Star`, `ArrowRight`).
- Reads `{ t, lang }` and `p = pageContent[lang].pages.pricing`.

### PageHero
- Medium height, with a finance-themed Unsplash photo.

### Tiers section
- 3-column grid. `.map` over `t.pricing.tiers` (3 items). For each:
  - **Card container** — `rounded-3xl border bg-white p-7 shadow-sm`. If `isPopular`, border becomes teal, adds `ring-2 ring-teal-500/30`, and `lg:-translate-y-3` lifts it slightly.
  - **Popular badge** — only renders when `isPopular`. A gradient pill with a star icon and `tier.cta` text, positioned `-top-3` to float above the card.
  - **Tier name + tagline**.
  - **Price row** — `HK$` prefix (conditional) + price + optional period.
  - **Description**.
  - **CTA button** — a plain `<a>` (not RouterLink) with `href="#/contact?service=<encoded>"`. Button label is `t.nav.cta` for the popular tier, otherwise `tier.cta`.
  - **Divider** — a 1px slate line.
  - **Feature checklist** — `tier.features.map` to a list of items with circular check icons. Popular tier uses filled teal circles with white checks; others use light teal circles with teal checks.

### Workspace add-ons
- A bordered card. Header row has a gradient background and an H3 (`t.pricing.workspaceTitle`).
- Body is a 3-column grid (`sm:grid-cols-2 lg:grid-cols-3`) using the `gap-px bg-slate-100` trick to draw divider lines. Each tile: bold name + teal price pill + small description.

### Disclaimer
- A tiny centered `<p>` with `t.pricing.disclaimer`.

### FAQ section
- Centered `SectionHeading` (`t.pricingExtra.faqEyebrow` + `p.faqTitle`).
- A Radix `<Accordion type="single" collapsible>`. `.map` over `p.faq` (array of `{q, a}`). Each `<AccordionItem>` has `value={`item-${i}`}` (Radix requires unique string values) and `data-[state=open]:...` classes for the open-state styling.
- `<AccordionTrigger>` shows the question; `<AccordionContent>` shows the answer.

### CTABand
- Reuses the homepage's CTA copy for cross-page consistency.

## How It Connects to Other Files

- **Imports from:**
  - `@/lib/i18n/lang-context` → `useLang`
  - `@/lib/i18n/page-content` → `pageContent`
  - `@/components/blocks/page-hero` → `PageHero`
  - `@/components/blocks/section-heading` → `SectionHeading`
  - `@/components/blocks/cta-band` → `CTABand`
  - `@/components/ui/button` → `Button`
  - `@/components/ui/accordion` → `Accordion`, `AccordionContent`, `AccordionItem`, `AccordionTrigger`
  - `lucide-react` → `Check`, `Star`, `ArrowRight`
  - `@/lib/router` → `RouterLink` (imported but not used on this page)
- **Imported by:** `src/app/page.tsx`.
- **Router mapping:** URL `#/pricing` → route `"pricing"`.
- **Deep-link integration:** builds `#/contact?service=<encoded>` URLs that are read by `src/components/pages/contact.tsx` (the `preselectedService` state initializer).

## Common Beginner Questions

**Q: Why is the tier CTA a plain `<a>` instead of a `RouterLink`?**
A: `RouterLink` only takes a `to` prop (a route key) and builds a clean `#/route` URL. To attach a query string like `?service=...`, we need to write the full href ourselves. A plain `<a href="#/contact?service=...">` works because the router's `parseHash` function only reads the first path segment and ignores the query string for routing purposes — but the contact page's `preselectedService` initializer reads the query string directly from `window.location.hash`.

**Q: How does the "popular" highlight work?**
A: It's all driven by the `tier.popular` boolean from the data. The same `isPopular` flag controls 6 visual aspects (border, ring, translate, badge, button gradient, check-circle color). This is a common React pattern: derive all UI variations from a single data flag instead of writing conditional JSX for each.

**Q: How does the FAQ accordion actually open and close?**
A: Radix UI's Accordion manages the open/close state internally. When you click an `AccordionTrigger`, Radix toggles the `data-state` attribute between `"open"` and `"closed"` on the parent `AccordionItem`. The `data-[state=open]:...` Tailwind variant classes then apply different styling when the item is open. You don't write any open/close state code yourself — Radix handles it.
