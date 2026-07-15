# File: section-heading.tsx

## What This File Does
`section-heading.tsx` is a reusable heading block used at the top of nearly every content section on every page. It renders an optional eyebrow pill (small uppercase label with a teal dot), a bold `<h2>` title in the display font, and an optional lead paragraph. It supports left or center alignment and a `dark` prop that switches colours for use on dark backgrounds.

## Where It Lives in the Project
`src/components/blocks/section-heading.tsx`

Part of the `blocks/` folder — small reusable UI pieces.

## What It Produces
- A `<div>` (not a `<section>`) constrained to `max-w-3xl`.
- An optional teal-tinted eyebrow pill (with a small dot).
- A bold display-font `<h2>` (responsive: 3xl → 4xl → 2.75rem).
- An optional lead paragraph below the title.
- Two colour schemes: light (default) and dark (for use on dark sections).

## Key Concepts
- **Reusable presentational component** — A "presentational" component (one that just renders UI based on props, no data fetching or state). This is the most common React pattern.
- **Optional props with defaults** — `align` defaults to `"left"`, `dark` defaults to `false`. `eyebrow` and `lead` are optional (`?` in the type) and conditionally rendered.
- **`ReactNode` for title** — Allows callers to pass JSX (e.g. `<span className="text-teal-600">accent</span>`) rather than just a plain string.
- **Conditional className** — A common pattern: `${condition ? "classA" : "classB"}`. The `dark` flag toggles between two complete colour schemes.
- **Conditional rendering** — `{eyebrow && <span>...</span>}` renders the pill only when an eyebrow was passed. Same for the lead paragraph.

## Section-by-Section Breakdown
1. **Imports** — `ReactNode` type from React.
2. **`SectionHeading()` function signature** — destructures props with defaults for `align` and `dark`.
3. **Inline prop type** — defines `eyebrow?: string`, `title: ReactNode`, `lead?: string`, `align?`, `dark?`.
4. **Container `<div>`** — `max-w-3xl`, plus `mx-auto text-center` when `align === "center"`.
5. **Eyebrow pill (optional)** — `{eyebrow && ...}`. Teal-tinted pill with `uppercase tracking-wider` text and a small dot. Colours flip based on `dark`.
6. **`<h2>` title** — `mt-5 font-display`, responsive sizes `text-3xl sm:text-4xl lg:text-[2.75rem]`. Colour flips based on `dark`.
7. **Lead paragraph (optional)** — `{lead && ...}`. `mt-5`, responsive `text-base sm:text-lg`. Muted colour (slate-600 or slate-300 depending on `dark`).

## How It Connects to Other Files
- Imports `ReactNode` from React.
- Exports `SectionHeading` — used by essentially every page and many sub-blocks across the site (home, about, services, why-hk, pricing, insights, contact, legal).

## Common Beginner Questions
**Q: Why is this a `<div>` and not a `<section>`?**
A: Semantic HTML uses `<section>` for a thematic grouping of content with a heading. Since this component is *just* the heading (not the whole section), it should be a `<div>`. The page component typically wraps the section heading + content in a `<section>` element.

**Q: Why `max-w-3xl` (48rem)?**
A: Long lines of text are fatiguing to read. `max-w-3xl` (768px) is a common comfortable reading width for headings and body text. Wider containers make text feel sparse and unfocused.

**Q: What's `font-display`?**
A: A custom Tailwind utility class (configured in `tailwind.config.ts`) that applies the "DM Sans Variable" display font. Display fonts are designed for headings — they're more characterful than body fonts. Body text uses `font-sans` (Plus Jakarta Sans).
