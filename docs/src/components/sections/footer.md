# File: footer.tsx

## What This File Does
`footer.tsx` renders the big dark footer shown at the bottom of every page. It includes a teal-tinted CTA strip with a "WhatsApp Us" button, then a 5-column grid containing the brand logo + tagline + TCSP badge, the six main "Explore" page links, four "Legal" policy links, and a "Connect" column with the real address / phone / WhatsApp / email pulled from `companyFacts`. A legal disclaimer and copyright row close it out.

## Where It Lives in the Project
`src/components/sections/footer.tsx`

Part of the `sections/` folder (major page regions rendered once per page).

## What It Produces
- **CTA strip**: a horizontal teal-tinted band with a WhatsApp icon, a short prompt, and a gradient button that opens WhatsApp chat in a new tab.
- **5-column footer grid** (on `lg`+): brand (2 cols) + Explore + Legal + Connect.
- **Brand column**: logo, tagline, TCSP licence badge.
- **Explore column**: 6 internal nav links (About / Services / Why HK / Pricing / Insights / Contact).
- **Legal column**: 4 policy links (Privacy / Terms / Complaints / Disclosures).
- **Connect column**: address, clickable phone, clickable WhatsApp, clickable email.
- **Bottom bar**: copyright line (auto-year) + "MCM Group Member" badge + domain name.

## Key Concepts
- **Single source of truth** — all phone numbers, emails, addresses, and the licence number come from `companyFacts` in `src/lib/site-data.ts`. Changing them there updates the navbar, footer, contact page, JSON-LD schema, etc.
- **`RouterLink` for internal navigation** — internal links use our custom `RouterLink` (hash-based, no page reload). External links (tel:, wa.me, mailto:) use plain `<a>` tags.
- **Responsive grid** — `lg:grid-cols-5` gives a 5-column layout on large screens; on small screens the columns stack (`grid gap-10`).
- **`col-span`** — the brand column uses `lg:col-span-2` to take up 2 of the 5 columns.
- **Translation dictionary `t`** — all visible strings come from `useLang().t.footer.*`, so the footer automatically re-renders in English / 繁 / 简 when the language is switched.

## Section-by-Section Breakdown
1. **Imports** — `useLang`, lucide icons (`Phone, Mail, MessageCircle, MapPin, ShieldCheck`), `RouterLink` + `Route` type, `companyFacts` from site-data.
2. **`Footer()` function** — the component body.
3. **`useLang()` hook** — pulls the translated dictionary `t`.
4. **`exploreLinks` array** — 6 main page links (`{ to: Route, label: string }`).
5. **`legalLinks` array** — 4 policy page links.
6. **CTA strip JSX** — gradient-tinted band; icon tile + prompt text on the left, gradient WhatsApp `<a>` button on the right.
7. **Main grid JSX** — `grid lg:grid-cols-5` wrapper.
8. **Brand column** — `lg:col-span-2`. Logo `RouterLink` to home, tagline `<p>`, TCSP licence badge using `companyFacts.tcspLicence`.
9. **Explore column** — heading + `<ul>` of `RouterLink`s.
10. **Legal column** — heading + `<ul>` of `RouterLink`s.
11. **Connect column** — heading + `<ul>` with four rows: address (text + MapPin), phone (tel: link, whitespace stripped), WhatsApp (wa.me link, new tab), email (mailto: link).
12. **Legal note** — small-print `<p>` separated by a top border.
13. **Bottom bar** — copyright with auto-year + "MCM Group Member" badge + domain name.

## How It Connects to Other Files
- Imports `useLang` from `@/lib/i18n/lang-context` (language context).
- Imports `RouterLink, Route` from `@/lib/router` (custom hash router for internal links).
- Imports `companyFacts` from `@/lib/site-data` (single source of truth for business facts).
- Imports icons from `lucide-react`.
- Exports `Footer` — rendered once in the app shell.

## Common Beginner Questions
**Q: Why do the phone and WhatsApp links use plain `<a>` tags instead of `RouterLink`?**
A: `RouterLink` is only for internal site routes (it changes the URL hash). Phone numbers (`tel:`), WhatsApp chats (`wa.me`), and emails (`mailto:`) are handled by the operating system / external apps, so they need real `<a>` tags with those special href schemes.

**Q: Why pull contact info from `companyFacts` instead of hard-coding it?**
A: The same phone number, email, address, and licence appear in the navbar, footer, contact page, sitemap, and JSON-LD structured data. If you hard-coded them everywhere, you'd have to update 5+ places when something changes. `companyFacts` centralises them — update once, propagate everywhere.

**Q: Why is `new Date().getFullYear()` safe to call inside render?**
A: It runs on every render (server and client) but the value is the same on both for any given year, so there's no hydration mismatch. The copyright year always shows the current calendar year.
