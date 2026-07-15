# File: cta-band.tsx

## What This File Does
`cta-band.tsx` is a reusable full-width "call to action" band used near the bottom of every page to prompt the user to take the next step. It renders a centred title, optional lead paragraph, and a primary button. It comes in two visual variants (`teal` and `dark`), and includes decorative background layers: a subtle grid pattern and a blurred white glow. The file also exports `CTABandNode`, an alternative that accepts arbitrary children (e.g. multiple buttons) instead of a single `RouterLink` button.

## Where It Lives in the Project
`src/components/blocks/cta-band.tsx`

Part of the `blocks/` folder — reusable UI building blocks.

## What It Produces
- A full-width `<section>` with `py-20 lg:py-24` vertical padding.
- A teal→emerald gradient background (default) OR a dark slate-950 background.
- A decorative 56×56px white grid at 8% opacity.
- A blurred white glow at the top centre.
- A centred `<h2>` title (responsive 3xl → 5xl).
- An optional lead paragraph.
- A primary button (white background, teal text) wrapped around a `RouterLink` — OR arbitrary children when using `CTABandNode`.

## Key Concepts
- **Variants via props** — The `variant` prop (`"teal" | "dark"`) selects between two complete colour schemes. A common React pattern for components that need to look different in different contexts.
- **`asChild` pattern** — shadcn/ui's `Button` accepts `asChild` to merge its styles into a child element. Here we wrap a `RouterLink`, so the result is a single `<a>` that has both button styling and router behaviour.
- **Decorative layers** — `pointer-events-none absolute inset-0` creates overlay layers that don't capture clicks. Useful for grids, glows, gradients, watermarks.
- **CSS gradients as background patterns** — `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px)` draws a 1px horizontal white line; combined with the 90° variant and `background-size: 56px 56px`, it produces a grid.
- **`blur-3xl` glow** — A large blurred element creates a soft "spotlight" effect. Common in modern marketing UI.
- **Two exports from one file** — `CTABand` (single button) and `CTABandNode` (arbitrary children) cover two use cases without code duplication. The shared structure (section + decorative layers + title/lead) is duplicated rather than abstracted, for simplicity.

## Section-by-Section Breakdown

### `CTABand`
1. **Imports** — `Button` from shadcn/ui, `ArrowRight` from lucide-react, `ReactNode` type, `RouterLink` from our router.
2. **`CTABand()` function signature** — destructures props with defaults for `buttonTo` (`"contact"`) and `variant` (`"teal"`).
3. **Inline prop type** — defines `title`, `lead?`, `buttonLabel`, `buttonTo?`, `variant?`.
4. **`isTeal` shortcut** — boolean derived from `variant`.
5. **`<section>` wrapper** — `relative overflow-hidden py-20 lg:py-24`. Background is either a teal gradient or `bg-slate-950`.
6. **Decorative grid layer** — `pointer-events-none absolute inset-0 opacity-[0.08]` div with two linear-gradients producing a 56×56 grid.
7. **Decorative glow layer** — `pointer-events-none absolute -top-32 left-1/2 h-64 w-[60%] -translate-x-1/2 rounded-full bg-white/10 blur-3xl`.
8. **Content container** — `relative mx-auto max-w-4xl px-6 text-center` (the `relative` lets it sit above the absolute decorative layers).
9. **`<h2>` title** — `font-display text-3xl ... lg:text-5xl text-white`.
10. **Optional lead paragraph** — `mt-5 max-w-2xl text-slate-100/90`.
11. **CTA button** — `Button asChild size="lg" btn-shimmer bg-white text-teal-700` wrapping a `RouterLink` with the button label + an `ArrowRight` icon.

### `CTABandNode`
12. **Same imports + function signature** — accepts `title`, `lead?`, `children?`.
13. **Same section + decorative layers** — duplicated (not abstracted) for simplicity.
14. **Same title/lead structure.**
15. **`{children}`** — renders whatever the caller passes where the single button would be. This is the key difference from `CTABand`.

## How It Connects to Other Files
- Imports `Button` from `@/components/ui/button` (shadcn/ui).
- Imports `ArrowRight` from `lucide-react`.
- Imports `RouterLink` from `@/lib/router` (custom hash router).
- Imports `ReactNode` type from React.
- Exports both `CTABand` and `CTABandNode` — used by every page component.

## Common Beginner Questions
**Q: Why two exports instead of one with optional children?**
A: You could write `CTABand({ title, lead, buttonLabel?, buttonTo?, children?, variant? })` and conditionally render either the button or the children. But mixing two APIs in one component gets messy — props become optional in confusing combinations. Two focused exports (`CTABand` for the common single-button case, `CTABandNode` for the flexible multi-child case) is cleaner.

**Q: What is `btn-shimmer`?**
A: A custom CSS class defined in `src/app/globals.css` that applies a shimmering sweep animation across the button. It's a small visual flourish that draws the eye to the CTA.

**Q: Why does the button use `asChild`?**
A: We want a clickable link that navigates via our hash router (no page reload) but looks like a button. `asChild` tells the shadcn `Button` to merge its className and props into the child `RouterLink` instead of rendering its own `<button>` element. The result is a single `<a>` styled as a button.
