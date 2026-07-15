# File: globals.css

## What This File Does

This is the **single global stylesheet** for the entire site. It bootstraps Tailwind CSS v4, defines the Smarthub Connect brand colour palette (teal primary, coral accent, cream secondary), maps CSS variables to Tailwind theme tokens, sets base typography and accessibility styles, and defines reusable utility classes (`.glass-nav`, `.lift-card`, `.btn-shimmer`, `.reveal`, `.marquee-track`, `.pulse-dot`, etc.) plus keyframe animations.

## Where It Lives in the Project

```
/home/z/my-project/src/app/globals.css
```

Imported by `src/app/layout.tsx` via `import "./globals.css"` so it loads on every page.

## What It Produces

- Tailwind utility classes (`bg-primary`, `text-foreground`, `rounded-lg`, etc.) available in every component
- CSS variables (`--primary`, `--accent`, `--brand-teal`, etc.) that drive both Tailwind utilities and shadcn/ui components
- Light and dark mode palettes (dark activates when `.dark` class is on a parent)
- Custom utility classes for visual effects: glass nav, hover lift, shimmer button, gradient text, hero overlay, marquee scroll, pulse dot, scroll reveal
- Accessibility helpers: keyboard focus rings, skip-to-content link

## Key Concepts

- **Tailwind CSS v4** — A utility-first CSS framework. This project uses v4 which configures the theme via CSS `@theme` blocks instead of a JS config file.
- **`@theme inline`** — Tailwind v4 directive that maps utility class names (e.g. `bg-primary`) to CSS variables (e.g. `var(--primary)`).
- **`@custom-variant dark`** — Tells Tailwind that `dark:` utilities should apply when an ancestor has the `.dark` class (the "class strategy" for dark mode).
- **CSS Variables (custom properties)** — Names like `--primary` that can be overridden in different scopes (e.g. `:root` for light, `.dark` for dark mode).
- **`@layer base`** — Tailwind's layering system. `base` styles have lower priority than utilities, so `bg-red-500` still overrides `background: var(--background)`.
- **`backdrop-filter: blur()`** — CSS effect that blurs whatever is *behind* an element, creating the "frosted glass" look.
- **`background-clip: text`** — Clips a background (e.g. a gradient) to the shape of text letters, enabling gradient-filled text.

## Section-by-Section Breakdown

### 1. Imports + custom variant (lines 1–4)
Imports `tailwindcss` (the framework) and `tw-animate-css` (a set of pre-built animation utilities). Defines the `dark` variant so `dark:` utilities trigger on `.dark` ancestor.

### 2. `@theme inline` block (lines 6–45)
Maps Tailwind theme tokens (`--color-primary`, `--font-sans`, `--radius-lg`, etc.) to the CSS variables defined later in `:root` and `.dark`. So writing `bg-primary` in a component outputs `background-color: var(--primary)`.

### 3. `:root` — light mode palette (lines 47–110)
Defines all brand colours for light mode: background, foreground, card, popover, primary (teal `#0d9488`), secondary (cream `#fef7ed`), muted (slate `#f1f5f9`), accent (coral `#fb7185`), destructive (red), border, ring, 5 chart colours, sidebar palette, and brand-specific tokens (`--brand-teal`, `--brand-coral`, `--brand-amber`, etc.).

### 4. `.dark` — dark mode palette (lines 112–131)
Overrides the same CSS variables with darker values. Activates when `.dark` class is on `<html>` or any ancestor.

### 5. `@layer base` (lines 133–175)
Global element styles:
- `*` selector applies default border colour + focus ring opacity to every element
- `body` sets background + foreground + font features
- `h1`–`h4` use the display font (Plus Jakarta Sans) with tighter letter-spacing
- Focus-visible outline (teal 2px) for keyboard users
- `.skip-link` — off-screen until focused, then slides into view

### 6. Smooth scroll (lines 177–181)
`scroll-behavior: smooth` + `scroll-padding-top: 100px` so anchor links scroll smoothly and leave room for the sticky navbar.

### 7. `.reveal` animation (lines 183–193)
Add `className="reveal"` to any element to fade-up on scroll. A JS observer adds `.is-visible` when the element enters the viewport.

### 8. `.text-gradient-teal` (lines 195–202)
Teal gradient clipped to text shape — used for accent headings.

### 9. `.hero-overlay` (lines 204–210)
Dark-navy-to-teal gradient overlay for hero images, so white text stays readable on top of photos.

### 10. `.glass-nav` (lines 212–222)
Frosted-glass effect for the sticky navbar using `backdrop-filter: blur()`. The `.scrolled` modifier (toggled via JS) increases opacity + adds a soft shadow.

### 11. `.lift-card` (lines 224–232)
Hover effect that lifts cards 6px up with a soft teal-tinted shadow.

### 12. `.btn-shimmer` (lines 234–249)
A diagonal light sweep across the button on hover. Pure CSS — uses a `::after` pseudo-element.

### 13. `@keyframes marquee` + `.marquee-track` (lines 251–258)
Infinite horizontal scroll animation for partner logos / scrolling banners. The track contains children twice; animating `translateX` from 0 to -50% creates a seamless loop.

### 14. `@keyframes pulse-dot` + `.pulse-dot` (lines 260–267)
Subtle "live" indicator — scales up + dims slightly on a 2s loop. Used for "available now" type badges.

## How It Connects to Other Files

**Imports:**
- `tailwindcss` (the framework)
- `tw-animate-css` (animation utilities)

**Imported by:**
- `src/app/layout.tsx` — via `import "./globals.css"`

**Used by:**
- Every component in `src/components/` (uses Tailwind utility classes + custom classes like `.glass-nav`, `.reveal`, `.lift-card`)
- Every shadcn/ui component in `src/components/ui/` (uses theme tokens like `bg-primary`, `text-foreground`, `rounded-lg`)

## Common Beginner Questions

**Q: Why are colours defined as CSS variables instead of Tailwind config?**
A: Tailwind v4 encourages CSS-first configuration. Defining colours as CSS variables means you can override them in different scopes (light/dark) just by re-declaring the variable. Tailwind's `@theme inline` block connects the variables to utility class names.

**Q: What's the difference between `--primary` and `--brand-teal`?**
A: `--primary` is a semantic token — it means "the main brand colour, whatever that is". shadcn/ui components use `--primary`. `--brand-teal` is a concrete colour value used directly by custom components for gradients and effects. If you wanted to rebrand to purple, you'd change `--primary` and `--brand-teal` together.

**Q: Why use `@layer base` for the body styles instead of just writing them directly?**
A: Tailwind's layering system controls specificity. Putting base styles in `@layer base` means utility classes like `bg-red-500` will still override them. Without the layer, you'd have to fight specificity battles.
