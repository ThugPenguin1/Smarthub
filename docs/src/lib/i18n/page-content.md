# File: page-content.ts

## What This File Does
This file contains all the **page-specific body copy** (hero headlines, story paragraphs, FAQ items, etc.) for every page on the site, written in all 3 languages (English, Traditional Chinese, Simplified Chinese). It's the file you edit when you need to change the actual WORDS that appear on a specific page — not the UI labels (those are in `translations.ts`).

## Where It Lives in the Project
`src/lib/i18n/page-content.ts`

## What It Produces
A big JavaScript object called `pageContent` that looks like:
```
{
  en: { pages: { home: {...}, about: {...}, services: {...}, ... } },
  "zh-HK": { pages: { home: {...}, about: {...}, ... } },
  "zh-CN": { pages: { home: {...}, about: {...}, ... } },
}
```
This object is imported by `lang-context.tsx`, which merges it into the master `t` dictionary. Page components then access it like:
```js
const p = pageContent[lang].pages.home;
// p.heroTitle, p.heroLead, p.introBody, etc.
```

## Key Concepts
- **3-language object**: The file has 3 top-level keys (`en`, `zh-HK`, `zh-CN`), each with identical structure but different text values.
- **Key mirroring**: Every key in the `en` block MUST exist in `zh-HK` and `zh-CN`. If you add a new key to English but forget the Chinese versions, the UI will show `undefined` when the user switches language.
- **`as const` assertion**: The file ends with `as const` which tells TypeScript "these string values are exact, don't widen them to generic `string` type." This enables autocomplete and type-checking when accessing keys.

## Section-by-Section Breakdown

### Header comment (lines 1–14)
Explains what the file is and how it fits with the other 2 translation files.

### `export const pageContent = {` (line 18)
The main export. Imported by `lang-context.tsx`.

### `en: { pages: { ... } }` (English section)
Contains 7 page blocks:
- **`home`**: Hero eyebrow/title/accent/lead, intro section text, services preview text, why-HK preview text, insights preview text, CTA band text.
- **`about`**: Hero text, story section (3 paragraphs), values (4 items), MCM Group section, team section.
- **`services`**: Hero text, pricing teaser text, detail CTA label.
- **`whyhk`**: Hero text, stats title + 6 stat items, CTA band text.
- **`pricing`**: Hero text, 3 pricing tiers (name/tagline/price/period/desc/features[]/cta/popular), 6 workspace add-ons, 6 FAQ items (q/a pairs), disclaimer.
- **`insights`**: Hero text, featured article (cat/date/title/excerpt), newsletter form text.
- **`contact`**: Hero text, map title/body.

### `"zh-HK": { pages: { ... } }` (Traditional Chinese)
Same structure as English, all values translated to Cantonese-style Traditional Chinese.

### `"zh-CN": { pages: { ... } }` (Simplified Chinese)
Same structure as English, all values translated to Mainland-style Simplified Chinese.

## How It Connects to Other Files
- **Imports**: None (it's a pure data file).
- **Imported by**: `src/lib/i18n/lang-context.tsx` (merges it into the master dictionary), and directly by page components like `home.tsx`, `about.tsx`, etc.
- **Related files**: `translations.ts` (UI labels), `extra-content.ts` (legal pages + extras).

## Common Beginner Questions

**Q: I want to change the hero headline on the homepage. Where do I edit it?**
A: In this file, under `en.pages.home.heroTitle`. Then also update `zh-HK.pages.home.heroTitle` and `zh-CN.pages.home.heroTitle` with the translated versions.

**Q: What happens if I add a new key to English but forget the Chinese versions?**
A: The site won't crash, but when a user switches to Cantonese or Mandarin, any text using that missing key will show `undefined` instead of the text. Always update all 3 languages.

**Q: Why is this separate from translations.ts?**
A: `translations.ts` has UI labels (short strings like "Home", "Contact", "Send Enquiry") that appear on every page. This file has longer page-specific body copy (paragraphs, FAQs, story text). Splitting them keeps each file manageable.
