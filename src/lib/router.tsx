"use client";

/**
 * CUSTOM HASH ROUTER
 * =================================================================
 * WHAT THIS FILE IS:
 *   A tiny do-it-yourself router built on the URL hash (the `#...`
 *   part of a URL). It does NOT use Next.js's built-in file-based
 *   routing — instead, the entire site lives at `/` and the router
 *   swaps content based on the hash (e.g. `#/about`, `#/pricing`).
 *
 * WHAT IT DOES:
 *   - Defines a `Route` type union (the 12 possible routes)
 *   - Maintains two lookup tables: URL-string ↔ Route-name
 *   - Exposes `RouterProvider` to hold the current route state
 *   - Listens for `hashchange` events so back/forward buttons work
 *   - Scrolls to top on route change (or to a secondary anchor)
 *   - Exposes `useRouter()` so any component can read the current
 *     route or call `navigate("about")` to change pages
 *   - Provides a `<RouterLink to="about">` component that respects
 *     cmd+click (open in new tab)
 *
 * HOW IT FITS IN THE BIGGER PICTURE:
 *   `src/app/page.tsx` wraps the whole app in `<RouterProvider>` and
 *   uses `<RouterOutlet />` to pick which page component to render.
 *   Navbar links use `<RouterLink>` so clicking them updates the URL
 *   hash without a full page reload.
 *
 * WHY A HASH ROUTER INSTEAD OF NEXT.JS ROUTING?
 *   - Cheaper to host (static, no server rewrites needed)
 *   - Predictable client-side navigation
 *   - Single bundle for the whole marketing site
 *
 * HOW IT DIFFERS FROM A REAL NEXT.JS ROUTE:
 *   Next.js routing: each file in `app/` becomes a real URL
 *   (e.g. `app/about/page.tsx` → `/about`). The server returns
 *   different HTML for each URL. Our hash router serves the SAME
 *   HTML for every URL — only the `#` changes, and JavaScript
 *   decides what to render.
 * ================================================================= */

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

/**
 * Route — the closed set of possible route names.
 *
 * This is a TypeScript "union type" — it says `route` must be one of
 * these 12 literal strings, nothing else. The compiler will catch
 * typos like `navigate("abuot")` at build time.
 *
 * The "not-found" route is what we set when the URL hash doesn't
 * match any known route.
 */
export type Route =
  | "home"
  | "about"
  | "services"
  | "why-hk"
  | "pricing"
  | "insights"
  | "contact"
  | "privacy"
  | "terms"
  | "complaints"
  | "disclosures"
  | "not-found";

/**
 * ROUTE_MAP — translates a URL string (the part after `#`) into a
 * Route name. Used by `parseHash()` when reading the current URL.
 *
 * Note: `""` and `"/"` both map to "home" so an empty hash still
 * shows the home page.
 */
const ROUTE_MAP: Record<string, Route> = {
  "": "home",
  "/": "home",
  "/about": "about",
  "/services": "services",
  "/why-hong-kong": "why-hk",
  "/pricing": "pricing",
  "/insights": "insights",
  "/contact": "contact",
  "/privacy": "privacy",
  "/terms": "terms",
  "/complaints": "complaints",
  "/disclosures": "disclosures",
};

/**
 * REVERSE_MAP — translates a Route name back into a URL string.
 * Used by `navigate()` and `routeHref()` to build the URL hash to
 * push into `window.location.hash`.
 */
const REVERSE_MAP: Record<Route, string> = {
  home: "/",
  about: "/about",
  services: "/services",
  "why-hk": "/why-hong-kong",
  pricing: "/pricing",
  insights: "/insights",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  complaints: "/complaints",
  disclosures: "/disclosures",
  "not-found": "/not-found",
};

/**
 * parseHash — read the current URL hash and return the matching Route.
 *
 * Steps:
 *   1. If we're on the server (no `window`), default to "home".
 *   2. Grab `window.location.hash` (e.g. "#/about") and strip the
 *      leading `#`. Result: "/about".
 *   3. Strip a leading slash if present. Result: "about".
 *   4. Take only the FIRST path segment (ignore deep links).
 *   5. Look up the segment in ROUTE_MAP. If found, return it;
 *      otherwise return "not-found".
 *
 * Inputs: none (reads from `window.location.hash`)
 * Returns: a `Route` value (one of the 12 literals above)
 */
function parseHash(): Route {
  if (typeof window === "undefined") return "home";
  const raw = window.location.hash.replace(/^#/, "");
  // strip leading slash
  const path = raw.startsWith("/") ? raw.slice(1) : raw;
  // take first segment only
  const seg = path.split("/")[0] || "";
  const mapped = ROUTE_MAP[seg === "" ? "/" : `/${seg}`];
  return mapped ?? "not-found";
}

/**
 * RouterContextValue — the shape of the context value every consumer
 * receives when calling `useRouter()`.
 *   - `route`     : the current Route name
 *   - `navigate`  : a function to change the route
 */
type RouterContextValue = {
  route: Route;
  navigate: (r: Route) => void;
};

/**
 * RouterContext — the React Context object itself.
 * It holds a value of type `RouterContextValue | null` (null when
 * no provider is mounted). We export it implicitly via the hook.
 */
const RouterContext = createContext<RouterContextValue | null>(null);

/**
 * RouterProvider — the React Context Provider that owns route state.
 *
 * Inputs:
 *   `children` — any React nodes that should have access to the
 *   router (typically the whole app).
 *
 * State:
 *   `route` — initialised once by reading the URL hash via
 *   `parseHash()`. Then updated whenever `hashchange` fires.
 *
 * Effects:
 *   1. Subscribes to `hashchange` so back/forward buttons work and
 *      so manual edits to the URL update the UI.
 *   2. On every route change, scrolls to the top of the page —
 *      UNLESS there's a secondary anchor like `#/about#team`, in
 *      which case it scrolls to that element instead.
 *
 * `navigate(r)`:
 *   Sets `window.location.hash` to the matching URL string. The
 *   actual state update happens via the `hashchange` listener
 *   (single source of truth — no separate setState call).
 *
 * Returns:
 *   A `<RouterContext.Provider>` element wrapping `children`.
 */
export function RouterProvider({ children }: { children: React.ReactNode }) {
  // useState initialiser reads the URL hash ONCE on mount.
  const [route, setRoute] = useState<Route>(() => parseHash());

  // Subscribe to hashchange events so the URL bar and back/forward
  // buttons keep the UI in sync.
  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Scroll to top on route change (unless there's a secondary anchor)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    // if hash has a secondary anchor like #/about#team, scroll to that
    const secondaryAnchor = hash.includes("#", 2) ? hash.split("#")[2] : null;
    if (secondaryAnchor) {
      const el = document.getElementById(secondaryAnchor);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [route]);

  /**
   * navigate — programmatically change the route.
   *
   * We set `window.location.hash`, which fires a `hashchange` event,
   * which triggers the listener above, which calls `setRoute`. We
   * don't call `setRoute` directly here so the URL is always the
   * single source of truth.
   */
  const navigate = useCallback((r: Route) => {
    if (typeof window === "undefined") return;
    window.location.hash = `#${REVERSE_MAP[r]}`;
    // state update will happen via hashchange listener
  }, []);

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

/**
 * useRouter — the hook every component uses to read the current
 * route or call `navigate()`.
 *
 * Throws if used outside a `<RouterProvider>` so you get a clear
 * error instead of a silent undefined.
 */
export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within a RouterProvider");
  return ctx;
}

/**
 * routeHref — helper to build a hash href for a route.
 *
 * Inputs:
 *   `r`       — the Route name (e.g. "about")
 *   `anchor?` — optional secondary anchor (e.g. "team")
 *
 * Returns: a string like "#/about" or "#/about#team" that can be
 * used as an `<a href>` value. Useful for cases where you need
 * the href without rendering a `<RouterLink>` (e.g. for a button
 * styled as a link).
 */
/** Helper to build a hash href for a route */
export function routeHref(r: Route, anchor?: string): string {
  const base = `#${REVERSE_MAP[r]}`;
  return anchor ? `${base}#${anchor}` : base;
}

/**
 * RouterLink — a router-aware <a> element.
 *
 * Why not just use a plain <a href="#/about">?
 *   - Plain <a> would cause a tiny scroll jump because the browser
 *     treats `#/about` as a fragment identifier.
 *   - We also want to fire `navigate()` so the URL/state update is
 *     explicit and consistent.
 *
 * Behavior:
 *   - `onClick`: if the user is holding cmd/ctrl/shift (open in new
 *     tab), let the browser handle it. Otherwise preventDefault and
 *     call `navigate(to)` for smooth client-side routing.
 *   - The `href` is still set via `routeHref()` so the link works
 *     even without JS (progressive enhancement) and so right-click
 *     "copy link" works.
 *
 * Props:
 *   - `to`       — required Route name
 *   - `anchor?`  — optional secondary anchor (e.g. "team")
 *   - `className?`, `children`, `onClick?` — standard anchor props
 *   - `...rest`  — any other valid <a> attributes except `href`
 *                  (which is computed) and `onClick` (handled here)
 */
/** Link component for router-aware navigation */
export function RouterLink({
  to,
  anchor,
  className,
  children,
  onClick,
  ...rest
}: {
  to: Route;
  anchor?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  const { navigate } = useRouter();
  return (
    <a
      href={routeHref(to, anchor)}
      className={className}
      onClick={(e) => {
        // allow cmd+click to open in new tab
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        navigate(to);
        onClick?.();
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
