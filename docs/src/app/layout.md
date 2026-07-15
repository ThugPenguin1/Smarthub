# File: layout.tsx

## What This File Does

This is the **root layout** of the Next.js App Router application. It wraps every page on the entire site and is responsible for three big things: (1) loading web fonts and the global stylesheet, (2) declaring all SEO metadata that Next.js turns into `<meta>` tags in the HTML `<head>`, and (3) embedding JSON-LD structured data so Google understands this is a Hong Kong corporate-services business. It also wraps every page in a `<LangProvider>` so the trilingual translation system is available everywhere.

## Where It Lives in the Project

```
/home/z/my-project/src/app/layout.tsx
```

In the Next.js App Router, any file named `layout.tsx` inside `app/` defines a layout that surrounds all pages in that folder and its subfolders. `app/layout.tsx` is the special **root** layout — the outermost shell of the entire site.

## What It Produces

- The `<html>` → `<head>` + `<body>` document structure for every page
- A `<script type="application/ld+json">` block in `<head>` containing LocalBusiness / FinancialService structured data
- SEO `<meta>` tags (title, description, OpenGraph, Twitter card, robots, favicons, manifest) — generated automatically by Next.js from the exported `metadata` object
- A `<body>` that contains `<LangProvider>` (the translation context) and `<Toaster>` (toast notifications)

## Key Concepts

- **App Router** — Next.js 13+ routing system where `app/` folder structure defines URLs.
- **`metadata` export** — A Next.js convention. Export an object named `metadata` and Next.js auto-injects the right `<meta>` tags into `<head>`.
- **JSON-LD** — A special `<script>` block with a standardized schema (schema.org) that Google reads to power "rich results" (business panels, opening hours, etc.).
- **OpenGraph / Twitter cards** — Tags that control how the link looks when shared on social media (Facebook, LinkedIn, WhatsApp, Twitter).
- **React Context (`LangProvider`)** — A React pattern that lets any component read the current language and dictionary without prop drilling.
- **`suppressHydrationWarning`** — Tells React not to warn about server/client HTML mismatches (here, because language detection can change `<html lang>`).
- **`dangerouslySetInnerHTML`** — A React escape hatch used to inject raw HTML; needed because React doesn't natively handle JSON-LD script content.

## Section-by-Section Breakdown

### 1. Imports (lines 1–7)
Pulls in: `Metadata` type from Next.js, two web fonts from `@fontsource-variable`, the global stylesheet, the `Toaster` UI component, the `LangProvider` context, and `companyFacts` (the single source of truth for company info).

### 2. `metadata` export (lines 9–70)
A static object Next.js reads at build time. Key sections:
- `title` — `default` is used when a page doesn't set its own; `template` is a suffix pattern (e.g. "About" → "About · Smarthub Connect")
- `description` — short paragraph shown under the title in search results
- `keywords` — SEO keywords
- `metadataBase` — base URL for resolving relative URLs (og:image, etc.) to absolute
- `alternates` — declares canonical URL and that we serve English + Traditional + Simplified Chinese
- `icons` — multiple favicon sizes for different devices
- `manifest` — link to the PWA manifest for "Add to Home screen" support
- `openGraph` — Facebook/LinkedIn/WhatsApp link preview
- `twitter` — Twitter card preview
- `robots` — tells crawlers we want to be indexed

### 3. `jsonLd` const (lines 73–114)
A schema.org object declaring this is a `LocalBusiness` + `FinancialService`. Includes address, GPS coordinates, opening hours, languages served, founding date, and TCSP license number.

### 4. `RootLayout` component (lines 116–135)
The actual React component. Returns `<html>` → `<head>` (with JSON-LD script) → `<body>` (with `LangProvider` wrapping `children` + `Toaster`).

## How It Connects to Other Files

**Imports from:**
- `@/components/ui/toaster` — toast notification UI
- `@/lib/i18n/lang-context` — `LangProvider` context
- `@/lib/site-data` — `companyFacts` (single source of truth for company info)
- `@fontsource-variable/plus-jakarta-sans` and `@fontsource-variable/dm-sans` — fonts
- `./globals.css` — global stylesheet

**Exports:**
- `RootLayout` (default export) — used by Next.js automatically as the root layout
- `metadata` — read by Next.js build pipeline

**Depended on by:**
- Every page in `src/app/` (the `children` prop is whatever the active page renders)

## Common Beginner Questions

**Q: Why isn't there a `<head>` tag I manually edit?**
A: Next.js generates the `<head>` for you from the `metadata` export. This is cleaner than hand-writing `<meta>` tags because it stays in sync with your TypeScript types.

**Q: What's the difference between `metadata` and JSON-LD?**
A: `metadata` produces `<meta>` tags (read by all crawlers for basic SEO — title, description, image previews). JSON-LD is a structured script block that Google reads to understand the *type of thing* this page is about (a LocalBusiness, an Event, a Product, etc.) — it powers rich results like the business info panel.

**Q: Why does `LangProvider` wrap `children` instead of being in `page.tsx`?**
A: Because providers in the layout persist across route changes (no remount), so the chosen language and dictionary stay loaded. If we put the provider inside `page.tsx` it would still work, but it's idiomatic to put global providers in the root layout.
