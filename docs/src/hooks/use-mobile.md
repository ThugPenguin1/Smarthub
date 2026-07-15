# File: use-mobile.ts

## What This File Does
`use-mobile.ts` exports a custom React hook called `useIsMobile` that returns `true` when the viewport width is less than 768px (Tailwind's `md` breakpoint), `false` otherwise. It uses `window.matchMedia` to subscribe to breakpoint-crossing events so the value updates live as the user resizes or rotates their device.

## Where It Lives in the Project
`src/hooks/use-mobile.ts`

Part of the shadcn/ui scaffold (the `hooks/` folder holds small reusable utility hooks). It is used by responsive shadcn components like `sidebar` and `navigation-menu`, and can be used by any custom component that needs to know whether it's on a mobile viewport.

## What It Produces
- A `boolean` value: `true` if `window.innerWidth < 768`, otherwise `false`.
- A live-updating value (re-renders when the viewport crosses the 768px boundary).
- `undefined` on the very first render (before the effect runs), coerced to `false` by the `!!` operator.

## Key Concepts
- **Custom hooks** — A function that starts with `use` and uses React hooks (like `useState`/`useEffect`) internally. Custom hooks let you extract reusable stateful logic out of components.
- **`window.matchMedia`** — A browser API that returns a `MediaQueryList` for a given CSS media-query string. You can subscribe to its `change` event to be notified when the viewport crosses the query boundary. This is more efficient than listening to every `resize` event.
- **Tailwind's `md` breakpoint** — 768px by default. Anything below is considered mobile; anything at or above is considered tablet/desktop.
- **SSR-safe initial state** — The hook starts with `undefined` because on the server there's no `window`. The `useEffect` (which only runs on the client) populates the real value after mount. This avoids hydration mismatches.
- **Cleanup functions** — `useEffect` returns a cleanup that removes the event listener when the component unmounts. Without this, you'd leak listeners and potentially update state on unmounted components.
- **`!!value` coercion** — `!!undefined` is `false`; `!!true` is `true`. The double-bang converts any truthy/falsy value to a strict boolean.

## Section-by-Section Breakdown
1. **Imports** — `React` (for `useState` and `useEffect`).
2. **`MOBILE_BREAKPOINT` constant** — 768 (Tailwind's `md`).
3. **`useIsMobile()` function** — the hook body.
4. **`useState<boolean | undefined>(undefined)`** — initial state is `undefined` (not yet known) for SSR safety.
5. **`useEffect`** — runs only on the client (browser).
   - Creates a `MediaQueryList` for `(max-width: 767px)`.
   - Defines `onChange` handler that re-checks `window.innerWidth` and updates state.
   - Subscribes to the `change` event.
   - Sets the initial value once on mount.
   - Returns a cleanup that removes the listener.
6. **`return !!isMobile`** — coerces `undefined` to `false` for callers that need a strict boolean.

## How It Connects to Other Files
- Imports `React` (only).
- Exports `useIsMobile` — used by various shadcn/ui components in `src/components/ui/` (e.g. `sidebar.tsx`) and potentially by custom components.

## Common Beginner Questions
**Q: Why `matchMedia` instead of listening to `resize`?**
A: The `resize` event fires many times per second during a drag, which would cause many state updates and re-renders. `matchMedia`'s `change` event only fires once when the viewport crosses the query boundary (e.g. from 769px to 767px). It's dramatically more efficient for breakpoint-based logic.

**Q: Why is the initial state `undefined` instead of `false`?**
A: On the server (during SSR), there's no `window`, so we can't know the viewport. If we defaulted to `false` and the client actually was mobile, we'd have a "hydration mismatch" — the server-rendered HTML wouldn't match the client's first render. Starting with `undefined` and letting the `useEffect` set the real value after mount avoids this.

**Q: Should I use this hook or Tailwind's responsive classes (`md:flex`, `lg:hidden`)?**
A: Prefer Tailwind's responsive classes for purely visual differences (showing/hiding elements, changing layout). Use this hook only when you need to render *different markup* or *different behaviour* on mobile vs desktop — for example, conditionally rendering a Sidebar component vs a Sheet drawer.
