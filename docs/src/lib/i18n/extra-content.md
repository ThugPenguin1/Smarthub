# File: extra-content.ts

## What This File Does
This file contains "extra" translations that were originally hardcoded English strings scattered in component files, plus the full text of 4 legal pages (Privacy Policy, Terms of Use, Complaints Procedure, Disclosures), the 404 page, the cookie consent banner, and various UI labels — all in 3 languages.

## Where It Lives in the Project
`src/lib/i18n/extra-content.ts`

## What It Produces
A big JavaScript object called `extraContent` that gets merged into the master `t` dictionary by `lang-context.tsx`. Components access it like:
```js
t.footer.ctaTitle          // "Ready to set up in Hong Kong?"
t.cookie.title             // "We use cookies"
t.legal.privacy.title      // "Privacy Policy"
t.legal.privacy.sections   // array of {h, p} objects
t.notFound.title           // "Page not found"
```

## Key Concepts
- **Why this file exists**: The original vibecoded site had English strings hardcoded in component files (like `footer.tsx` had "Ready to set up in Hong Kong?" written directly in the JSX). When we added Chinese translations, we extracted all those strings into this file so they could be translated.
- **Legal pages as data**: Each legal page (privacy, terms, complaints, disclosures) is stored as a data object with `title`, `updated`, `intro`, and `sections[]`. The `legal.tsx` component reads this data and renders it. This means you can edit the legal text without touching any JSX.
- **`sections[]` array**: Each legal page has an array of section objects, each with `h` (heading) and `p` (paragraph). The legal page component maps over this array to render the sections.

## Section-by-Section Breakdown

### Header comment (lines 1–14)
Explains what the file is and how it fits with the other 2 translation files.

### `en: { ... }` (English section)
Contains these blocks:
- **`footer`**: CTA strip text (title, body, button) used in footer.tsx.
- **`cookie`**: Cookie consent banner text (title, body, acceptAll, necessaryOnly, learnMore).
- **`backToTop`**: Label for the back-to-top button (accessibility).
- **`skipToContent`**: Label for the skip-to-content link (accessibility).
- **`notFound`**: 404 page text (title, body, cta).
- **`whyHk`**: Image band text on the Why HK page (bandTitle, bandBody).
- **`insights`**: Labels for the Insights page (featuredBadge, readArticle, allArticles, readMore).
- **`pricing`**: FAQ eyebrow label.
- **`contact`**: Extra contact form labels (mapsButton, formError, privacyNotice, privacyLink, honeypotLabel).
- **`legal`**: The big one — 4 legal documents:
  - `privacy`: 7 sections covering data collection, purpose, cross-border transfer, retention, rights, cookies, contact.
  - `terms`: 7 sections covering information-only, no client relationship, IP, third-party links, liability, governing law, changes.
  - `complaints`: 6 sections covering how to complain, acknowledgement, investigation, response, escalation, confidentiality.
  - `disclosures`: 5 sections covering Smarthub Connect, MCM Group ecosystem, licence verification, no offer, accuracy.

### `"zh-HK": { ... }` (Traditional Chinese)
Same structure, all values translated to Cantonese-style Traditional Chinese.

### `"zh-CN": { ... }` (Simplified Chinese)
Same structure, all values translated to Mainland-style Simplified Chinese.

## How It Connects to Other Files
- **Imports**: None (pure data file).
- **Imported by**: `src/lib/i18n/lang-context.tsx` (merges into master dictionary).
- **Used by**: `footer.tsx`, `cookie-consent.tsx`, `back-to-top.tsx`, `not-found.tsx`, `why-hk.tsx`, `insights.tsx`, `pricing.tsx`, `contact.tsx`, `legal.tsx`.

## Common Beginner Questions

**Q: I need to update the Privacy Policy text. Where do I edit it?**
A: In this file, under `en.legal.privacy`. Each section has an `h` (heading) and `p` (paragraph). Edit those, then update `zh-HK.legal.privacy` and `zh-CN.legal.privacy` with translations.

**Q: What is the honeypot field?**
A: `contact.honeypotLabel` is the label for a hidden form field that bots fill in but humans don't. If the field is filled, the form silently rejects the submission. It's an anti-spam technique.

**Q: Why are legal pages stored as data instead of JSX?**
A: Because the same `legal.tsx` component renders all 4 legal pages. It takes a `which` prop ("privacy", "terms", "complaints", "disclosures") and reads the corresponding data from this file. This means you can edit legal text without touching any component code.
