# File: page.tsx

## What This File Does

This is the **single Next.js page** that renders at the URL `/`. Because this project uses a **custom hash router** instead of Next.js's built-in file-based routing, all "pages" actually live as components in `src/components/pages/*.tsx`, and this file acts as the conductor: it sets up the router, mounts the global site chrome (navbar, footer, floating buttons, cookie banner), and uses a `switch` statement to pick which page component to render based on the current URL hash.

## Where It Lives in the Project

```
/home/z/my-project/src/app/page.tsx
```

In the Next.js App Router, `app/page.tsx` is automatically served at the root URL `/`. It is the `children` prop passed into `RootLayout` (see `layout.tsx`).

## What It Produces

- A full-screen page with: a skip-link, navbar, page content, footer, floating WhatsApp button, back-to-top button, and cookie consent banner
- The active page is chosen by the `RouterOutlet` switch based on the URL hash (e.g. `#/about` renders `<AboutPage />`)
- An accessibility-friendly skip link for keyboard/screen-reader users

## Key Concepts

- **`"use client"` directive** — Tells Next.js this component must run in the browser. Required because the hash router depends on `window.location.hash`, which doesn't exist during server-side rendering.
- **Custom hash router** — Instead of using Next.js's file-based routing (which would put each page at its own URL like `/about`), this project uses URL hash routing (`/#/about`). The page never reloads — only the content swaps. See `src/lib/router.tsx` for how this works.
- **`RouterProvider` / `useRouter`** — React Context pattern. The provider holds the current route state and a `navigate()` function; any descendant can call `useRouter()` to read or change it.
- **`RouterOutlet`** — A component whose only job is to look at the current route and return the matching page component. Named after a similar concept in Angular.
- **Skip link** — AWCAG accessibility pattern. An off-screen link that becomes visible on focus, letting keyboard users jump straight to page content.
- **`useLang()`** — Hook returning the current language and translation dictionary. Used here to get the localized label for the skip link.

## Section-by-Section Breakdown

### 1. `"use client"` + imports (lines 1–18)
Marks the file as a client component. Imports the router provider/hooks, the language hook, all global "section" components (navbar, footer, floating buttons, cookie consent), and all per-route page components (home, about, services, why-hk, pricing, insights, contact, legal, not-found).

### 2. `RouterOutlet` component (lines 20–51)
The switch statement that maps each route name (e.g. `"about"`, `"services"`, `"privacy"`) to its corresponding page component. The four legal routes (`privacy`, `terms`, `complaints`, `disclosures`) all reuse the same `<LegalPage>` component and pass a `which` prop to specify which legal document. Falls back to `<HomePage />` for safety.

### 3. `SkipLink` component (lines 53–60)
Renders `<a href="#main-content" className="skip-link">` with the localized label. The CSS in `globals.css` positions it off-screen until focused, then slides it into view.

### 4. `Home` default export (lines 62–78)
The actual page component. Wraps everything in `<RouterProvider>`, then composes the layout:
- `<SkipLink />` — a11y helper
- `<Navbar />` — top nav (logo, links, language switcher)
- `<main id="main-content" className="flex-1">` — wraps `<RouterOutlet />`. The `flex-1` makes it grow to push footer down.
- `<Footer />` — bottom of page
- `<WhatsAppFloat />` — floating WhatsApp chat button
- `<BackToTop />` — floating scroll-to-top button
- `<CookieConsent />` — cookie banner (appears on first visit)

## How It Connects to Other Files

**Imports from:**
- `@/lib/router` — `RouterProvider`, `useRouter`, `RouterLink`
- `@/lib/i18n/lang-context` — `useLang` hook
- `@/components/sections/*` — global chrome (navbar, footer, whatsapp-float, cookie-consent, back-to-top)
- `@/components/pages/*` — one component per route

**Exports:**
- `Home` (default export) — Next.js automatically renders this at `/`

**Depended on by:**
- Next.js App Router (renders this as the root page)
- `layout.tsx` — receives `Home` as its `children` prop

## Common Beginner Questions

**Q: Why is there only ONE page.tsx for the whole site?**
A: The project uses a custom hash router (URLs look like `/#/about` instead of `/about`). This means the page never actually reloads — only the inner content swaps. Having one page file keeps everything simple, and the actual page content lives in `src/components/pages/`.

**Q: Why is `"use client"` at the top?**
A: The hash router needs to read `window.location.hash`, which only exists in the browser. `"use client"` tells Next.js to render this component on the client side after hydration, so it has access to browser APIs.

**Q: Why is `LegalPage` used for four different routes?**
A: All four legal documents (Privacy, Terms, Complaints, Disclosures) have the same layout — just different text. Instead of writing four near-identical components, we write one `LegalPage` and pass a `which` prop to tell it which document to display.
