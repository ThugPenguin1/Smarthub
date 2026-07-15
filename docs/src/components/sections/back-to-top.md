# File: back-to-top.tsx

## What This File Does
`back-to-top.tsx` renders a small dark circular button with an up-arrow that appears in the bottom-right corner (just above the WhatsApp float) once the user has scrolled past 600px from the top of the page. Clicking it smoothly scrolls the page back to the top.

## Where It Lives in the Project
`src/components/sections/back-to-top.tsx`

A floating overlay "section" component mounted once in the app shell.

## What It Produces
- A 44×44 px (`h-11 w-11`) dark circular button.
- An up-arrow icon (`ArrowUp` from lucide-react).
- Hidden on initial load; fades in once `window.scrollY > 600`.
- Smooth-scroll behaviour when clicked.
- Positioned at `bottom-20 right-5` so it sits above the WhatsApp float (which is at `bottom-5`).

## Key Concepts
- **Scroll-position-based UI** — Many UI elements (sticky navs, floating buttons, progress bars) need to react to scroll. The pattern: register a `scroll` listener in `useEffect`, update state, conditionally render based on that state.
- **Early return `if (!visible) return null`** — Cleanest way to hide a component in React. The element is removed from the DOM entirely (not just visually hidden), so it can't be tab-focused or read by screen readers.
- **`window.scrollTo({ behavior: "smooth" })`** — Modern browser API for animated scrolling. Older code uses `window.scrollTo(0, 0)` (instant) or `jQuery.animate()`.
- **Passive listeners** — `{ passive: true }` keeps scroll smooth by promising the browser we won't call `preventDefault`.
- **Z-index stacking** — This button uses `z-40` while the WhatsApp float uses `z-50`, so if they ever overlapped, WhatsApp would win. The `bottom-20` offset prevents overlap entirely.

## Section-by-Section Breakdown
1. **Imports** — `useEffect`, `useState` from React; `ArrowUp` icon from lucide-react; `useLang` for the translated aria-label.
2. **`BackToTop()` function** — the component body.
3. **`useLang()` hook** — pulls `t` (we use `t.backToTop`).
4. **`visible` state** — boolean, starts `false` so the button is hidden on initial render.
5. **`useEffect` scroll listener** — registers a passive scroll handler that flips `visible` to `true` once `window.scrollY > 600`. Calls `onScroll()` once on mount to sync state. Returns a cleanup that removes the listener.
6. **Early return** — `if (!visible) return null;` hides the button entirely when not visible.
7. **`<button>` element** — `aria-label={t.backToTop}` for screen readers; `onClick` smooth-scrolls to top; positioned `fixed bottom-20 right-5 z-40`. Hover darkens the background and scales up 5%.

## How It Connects to Other Files
- Imports `useLang` from `@/lib/i18n/lang-context` for the aria-label.
- Imports `ArrowUp` from `lucide-react`.
- Exports `BackToTop` — rendered once in the app shell.

## Common Beginner Questions
**Q: Why 600px and not, say, half the viewport height?**
A: 600px is a fixed threshold that works well on most devices — roughly one phone viewport or a third of a desktop viewport. You could use `window.innerHeight` for a fully responsive threshold, but a fixed value keeps the behaviour predictable across devices.

**Q: Why return `null` instead of always rendering and toggling a CSS class?**
A: Returning `null` removes the element from the DOM entirely. This is better for accessibility (no phantom tab-stop) and performance (no event listeners, no paint). CSS-only hiding (`opacity-0 pointer-events-none`) is fine too, but only worth it if you want a smooth fade transition — here we don't.

**Q: Why is `onScroll()` called once inside the effect?**
A: The `scroll` event only fires when the user actually scrolls. If the page is loaded already-scrolled (e.g. the browser restored scroll position after a refresh), the listener wouldn't fire and `visible` would be wrong. Calling `onScroll()` once manually syncs the state on mount.
