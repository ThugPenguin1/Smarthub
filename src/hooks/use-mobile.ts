import * as React from "react"

/**
 * ============================================================================
 * FILE: use-mobile.ts — useIsMobile Hook
 * ============================================================================
 * WHAT IT IS:
 *   A custom React hook (a function that starts with `use`) that tells
 *   components whether the current viewport is mobile-sized.
 *
 * WHAT IT DOES:
 *   - Returns `true` when the viewport width is less than 768px
 *     (Tailwind's `md` breakpoint), `false` otherwise.
 *   - Subscribes to viewport size changes via `window.matchMedia` so the
 *     value updates live as the user resizes the browser or rotates their
 *     phone.
 *   - Returns `undefined` during the very first render (before the effect
 *     has run), then immediately resolves to the correct value. The
 *     `!!isMobile` at the end converts `undefined` to `false` for callers
 *     that need a strict boolean.
 *
 * HOW IT FITS IN:
 *   Part of the shadcn/ui scaffold — a small utility hook used by
 *   responsive shadcn components (e.g. `sidebar`, `navigation-menu`) to
 *   decide whether to render their mobile or desktop layout. Custom
 *   components can use it too, e.g. for conditionally rendering different
 *   markup on mobile vs desktop.
 *
 *   This file is a "use client" hook in spirit but doesn't need the
 *   directive because it's only ever imported by components that are
 *   already client components.
 * ============================================================================
 */

// Tailwind's `md` breakpoint is 768px. We treat anything below that as
// "mobile". Using a named constant (instead of the magic number 768)
// makes the intent obvious and the value easy to change.
const MOBILE_BREAKPOINT = 768

/**
 * useIsMobile — the custom hook.
 *
 * Inputs: none.
 * Returns: `boolean` — true if viewport width < 768px.
 *
 * Implementation notes:
 *   - `useState<boolean | undefined>(undefined)` starts undefined so the
 *     initial server-side render (where there's no window) doesn't
 *     produce a wrong `true`/`false`. Components can handle the undefined
 *     case (e.g. render nothing until the value is known).
 *   - `matchMedia("(max-width: 767px)")` creates a media-query list we
 *     can subscribe to. The `change` event fires whenever the viewport
 *     crosses the breakpoint — much more efficient than listening to
 *     every `resize` event.
 *   - We also set the state once on mount (in case the viewport is
 *     already mobile when the component first renders).
 *   - The cleanup function removes the listener when the component
 *     unmounts, preventing memory leaks.
 */
export function useIsMobile() {
  // State starts as undefined so the first render is "we don't know yet".
  // This avoids hydration mismatches in SSR scenarios where the server
  // can't know the viewport size.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create a MediaQueryList for "max-width: 767px" — i.e. anything
    // smaller than our 768px breakpoint.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    // Handler that re-checks window.innerWidth and updates state. We use
    // innerWidth (not mql.matches) for consistency with the initial value.
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    // Subscribe to breakpoint-crossing events (more efficient than resize).
    mql.addEventListener("change", onChange)
    // Set the initial value on mount.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    // Cleanup on unmount.
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Convert undefined → false for callers that need a strict boolean.
  return !!isMobile
}
