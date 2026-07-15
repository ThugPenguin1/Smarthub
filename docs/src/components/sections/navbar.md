# File: navbar.tsx

## What This File Does
`navbar.tsx` renders the top navigation of the Smarthub Connect website. It contains a thin dark "top bar" with contact info (phone / WhatsApp / email) and a TCSP licence badge (visible only on desktop), plus the main sticky header that holds the logo, six nav links, a language switcher, a "Get Started" CTA button, and a hamburger menu that opens a slide-in drawer on mobile.

## Where It Lives in the Project
`src/components/sections/navbar.tsx`

It is part of the `sections/` folder, which holds the big page-region components that appear once per page (navbar, footer, floating buttons, cookie banner). The component is mounted once and stays mounted across all hash-based route changes.

## What It Produces
- A desktop top utility bar with clickable `tel:`, `wa.me`, and `mailto:` links plus a TCSP licence pill.
- A sticky glass header with the Smarthub Connect logo, six translated nav links, the `LanguageSwitcher` dropdown, a teal "Get Started" button, and a hamburger icon.
- A right-side `Sheet` drawer (mobile only) that slides in and shows the same nav links + contact shortcuts + a full-width CTA.
- Active-route highlighting: the nav link matching the current route gets a teal background.

## Key Concepts
- **"use client" directive** — Next.js 16 App Router runs components on the server by default. `"use client"` tells Next.js to ship this component (and its hooks like `useState` / `useEffect`) to the browser.
- **Contexts** — `useLang()` reads the active language + translation dictionary from a global `LangProvider`. `useRouter()` reads the current route + `navigate` function from a custom hash-based `RouterProvider`.
- **`useState` + `useEffect` for scroll listening** — A React hook that subscribes to the browser `scroll` event and toggles a `scrolled` boolean after 10px.
- **Controlled Sheet** — The shadcn/ui `Sheet` is "controlled" via `open`/`onOpenChange` props so we can close it programmatically when a link is tapped.
- **`asChild` pattern** — shadcn/ui `Button` and `SheetClose` accept `asChild` to merge their styles into a child element (here a `RouterLink`), so we get a clickable router link styled as a button.
- **Passive event listeners** — `{ passive: true }` promises the browser we won't call `preventDefault`, keeping scrolling smooth on mobile.

## Section-by-Section Breakdown
1. **Imports** — pulls in React hooks, the lang context, the language switcher, shadcn `Button` + `Sheet` pieces, lucide icons, and our custom `RouterLink` / `useRouter` / `Route` type.
2. **`Navbar()` function** — the component body.
3. **Context hooks** — `useLang()` gives the translated dictionary `t`; `useRouter()` gives the current `route`.
4. **State** — `scrolled` (boolean for the glass effect) and `open` (boolean for the mobile Sheet).
5. **Scroll `useEffect`** — adds a `scroll` listener that flips `scrolled` past 10px; cleans up on unmount.
6. **`navLinks` array** — the 6 primary nav entries, each `{ to: Route, label: string }`. Labels come from `t.nav.*` so they re-translate on language switch.
7. **Top bar JSX** — dark bar, `lg:block` only. Three anchor links (tel, wa.me, mailto) on the left; TCSP licence pill on the right.
8. **Sticky `<header>`** — applies `glass-nav` plus optional `scrolled` class. Uses `sticky top-0 z-50` so it stays pinned.
9. **Logo** — `RouterLink` to `home` wrapping a gradient "S" tile and the wordmark.
10. **Desktop nav** — `hidden lg:flex` row of `RouterLink`s. Each gets teal background when `route === link.to`.
11. **Right actions cluster** — `LanguageSwitcher`, the teal CTA `Button` (`sm:inline-flex`), and the hamburger `Sheet` trigger.
12. **Mobile `Sheet`** — `SheetContent side="right"` containing: `SheetTitle` logo, vertical nav with `SheetClose asChild` wrappers (auto-close on click), phone + WhatsApp shortcuts, and a full-width CTA button.

## How It Connects to Other Files
- Imports `useLang` from `@/lib/i18n/lang-context` (the global language provider).
- Imports `LanguageSwitcher` from `@/components/language-switcher` (the EN / 繁 / 简 dropdown).
- Imports `Button` from `@/components/ui/button` (shadcn/ui button).
- Imports `Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose` from `@/components/ui/sheet` (shadcn/ui slide-in drawer).
- Imports `Menu, Phone, MessageCircle, ArrowRight` from `lucide-react` (icon set).
- Imports `RouterLink, useRouter, Route` from `@/lib/router` (custom hash-based router).
- Exports `Navbar` — rendered once in the app shell.

## Common Beginner Questions
**Q: Why does the header use `sticky top-0` instead of `fixed`?**
A: `sticky` keeps the header in the normal document flow until you scroll past it, then it sticks. `fixed` would remove it from flow, requiring extra padding on the page content below. Sticky is simpler and works without layout hacks.

**Q: What does `asChild` actually do?**
A: When a shadcn/ui component has `asChild`, it doesn't render its own `<button>`/`<a>` element. Instead, it clones the child element and merges its props (className, handlers) onto the child. So `<Button asChild><RouterLink>...</RouterLink></Button>` produces a single `<a>` that has both button styles and router behaviour.

**Q: Why is the scroll listener registered with `{ passive: true }`?**
A: Some browsers wait for scroll handlers to finish before scrolling the page, which can feel janky. `passive: true` is a promise that we won't call `event.preventDefault()`, so the browser can scroll immediately.
