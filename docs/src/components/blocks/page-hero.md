# File: page-hero.tsx

## What This File Does
`page-hero.tsx` is a reusable "hero" block that appears at the top of every subpage (About, Services, Why HK, Pricing, Insights, Contact). It shows a full-bleed background image with a dark teal-tinted gradient overlay, an eyebrow pill, a large `<h1>` title, an optional lead paragraph, and a decorative white wave SVG at the bottom that smoothly transitions into the page content below.

## Where It Lives in the Project
`src/components/blocks/page-hero.tsx`

Part of the `blocks/` folder — reusable UI building blocks composed together by page components.

## What It Produces
- A dark `<section>` element with vertical padding based on the `height` prop (`sm` / `md` / `lg`).
- A background `<Image>` filling the entire section (Next.js optimised image).
- A three-stop dark gradient overlay for text legibility.
- An eyebrow pill (teal-tinted, uppercase, with a teal dot).
- A large bold `<h1>` (responsive: 4xl → 6xl).
- An optional lead paragraph (`max-w-2xl`).
- A bottom white wave SVG divider that bridges into the white page content below.

## Key Concepts
- **Reusable component via props** — Instead of writing the same hero markup on every page, this one component accepts props (`eyebrow`, `title`, `lead`, `image`, `align`, `height`) and renders accordingly. This is the core React pattern.
- **`ReactNode` for flexible content** — The `title` prop is typed as `ReactNode`, not `string`, so callers can pass JSX with styled spans (e.g. `<span className="text-teal-300">accent</span>`).
- **Next.js `<Image>` component** — Provides automatic optimisation (resizing, format conversion, lazy loading). `fill` makes it cover the parent. `priority` disables lazy loading for above-the-fold images. `sizes` hints the browser's responsive image loader.
- **`absolute inset-0 -z-10`** — A common pattern for layering: position absolutely to fill the parent, push behind content with negative z-index.
- **`relative isolate`** — `isolate` creates a new stacking context so the `-z-10` child stays scoped to this section (doesn't end up behind the page background).
- **`preserveAspectRatio="none"` on SVG** — Lets the wave stretch to any width without preserving aspect ratio. Without this, the SVG would letterbox.
- **Default prop values** — `align = "left"` and `height = "md"` mean callers can omit those props for the common case.

## Section-by-Section Breakdown
1. **Imports** — `Image` from `next/image`, `ReactNode` from React.
2. **`PageHero()` function signature** — destructures props with default values for `align` and `height`.
3. **Prop type definition** — inline object type spelling out each prop's type.
4. **`heights` lookup map** — maps the `height` prop value to a Tailwind padding class string.
5. **`<section>` wrapper** — `relative isolate overflow-hidden bg-slate-900` + the chosen padding.
6. **Background image layer** — `absolute inset-0 -z-10` div containing:
   - `<Image fill priority sizes="100vw">` for the optimised image.
   - A three-stop gradient `from-slate-900/90 via-slate-900/75 to-teal-900/70` overlay.
7. **Content container** — `mx-auto max-w-7xl px-6`. Adds `text-center` when `align="center"`.
8. **Inner content block** — constrained to `max-w-3xl` (and `mx-auto` when centered).
9. **Eyebrow pill** — teal-tinted rounded pill with a teal dot, `uppercase tracking-wider`, `backdrop-blur`.
10. **`<h1>` title** — `font-display text-4xl ... lg:text-6xl`, tight `leading-[1.1]`.
11. **Optional `<p>` lead** — only rendered if `lead` is passed. `max-w-2xl`, `mx-auto` when centered.
12. **Bottom wave divider** — `absolute bottom-0` SVG with `preserveAspectRatio="none"`, `fill-white`, `aria-hidden`.

## How It Connects to Other Files
- Imports `Image` from `next/image` (Next.js built-in).
- Imports `ReactNode` type from React.
- Exports `PageHero` — used by every subpage component (about, services, why-hk, pricing, insights, contact, legal).

## Common Beginner Questions
**Q: Why use Next.js `<Image>` instead of a plain `<img>` tag?**
A: `<Image>` automatically serves correctly sized images for each device, converts to modern formats (WebP/AVIF), and lazy-loads below-the-fold images. This improves performance and Core Web Vitals significantly. The trade-off: you must configure allowed image domains in `next.config.ts` for remote images, and the API is slightly different from `<img>`.

**Q: What does `isolate` actually do?**
A: It creates a new "stacking context". Without it, a child with `-z-10` could end up behind the page background. With `isolate`, the child's z-index only competes with siblings inside this section, so `-z-10` reliably puts it behind the text but in front of the page background.

**Q: Why `preserveAspectRatio="none"` on the wave SVG?**
A: The wave is purely decorative and must stretch to any viewport width. `"none"` lets it stretch without preserving aspect ratio. If we used the default (`xMidYMid meet`), the SVG would letterbox and the wave wouldn't reach the edges on wide screens.
