# File: site-data.ts

## What This File Does

This is the **single source of truth** for Smarthub Connect's company facts and marketing statistics. It exports three things: `heroStats` (4 hero-section stats, localized per language), `sectionStats` (6 mid-page stats, localized), and `companyFacts` (the canonical contact + identity info — legal name, phone, WhatsApp, email, address, opening hours, founding year, TCSP licence number, domain). Updating any field here automatically propagates to the hero, about page, footer, contact page, navbar, JSON-LD structured data, and SEO metadata.

## Where It Lives in the Project

```
/home/z/my-project/src/lib/site-data.ts
```

## What It Produces

- `StatItem` type — the shape of a single statistic (a `num` + a `label`)
- `heroStats` — 4 stats shown in the hero section, keyed by language (`en` / `zh-HK` / `zh-CN`)
- `sectionStats` — 6 stats shown in the mid-page stats band, keyed by language
- `companyFacts` — the canonical company contact + identity info used across the entire site

## Key Concepts

- **Single source of truth** — A pattern where each piece of data lives in ONE place. Every other file that needs it imports from here. If Smarthub moves office, you change `address` here once and the footer, contact page, navbar, JSON-LD, and SEO metadata all update.
- **`Record<Lang, StatItem[]>`** — A TypeScript utility type meaning "an object whose keys are Lang values (`en` | `zh-HK` | `zh-CN`) and whose values are arrays of StatItems". This lets us hold the same stats in 3 languages in one structure.
- **Localisation (i18n)** — Providing the same content in multiple languages. Here the numbers stay the same across languages but the labels translate.
- **`Lang` type** — Defined in `src/lib/i18n/translations.ts` as `"en" | "zh-HK" | "zh-CN"`.

## Section-by-Section Breakdown

### 1. Header comment + warning (lines 1–14)
Explains this file is the single source of truth and warns that the stat numbers are PLACEHOLDERS pending verification before launch (misleading marketing claims violate the TCSP Code of Practice).

### 2. `Lang` import (line 9)
Imports the `Lang` union type (`"en" | "zh-HK" | "zh-CN"`) from the translations module, so we can type the stats objects by language.

### 3. `StatItem` type (line 11)
A TypeScript type for a single stat: `{ num: string; label: string }`. `num` is the big bold number (e.g. "25+"); `label` is the caption underneath (e.g. "Years in Hong Kong").

### 4. `heroStats` (lines 13–32)
A `Record<Lang, StatItem[]>` — an object keyed by language code, each holding an array of 4 StatItems. Used in the hero section. The numbers are identical across languages; only the labels translate.

### 5. `sectionStats` (lines 34–59)
Same shape as `heroStats` but with 6 items (adds retention rate, languages spoken, MTR distance). Used in the mid-page stats band.

### 6. `companyFacts` (lines 62–78)
The canonical company info object. Fields:
- `legalName` — full legal entity name (used in JSON-LD, footer)
- `shortName` — friendly brand name (used in navbar, hero)
- `tcspLicence` — HK Companies Registry licence number
- `phone` — main office phone (used in navbar, footer, contact)
- `whatsapp` — WhatsApp number for the chat button
- `whatsappUrl` — pre-built `wa.me` URL for the floating WhatsApp button
- `email` — general enquiries email
- `address` (English), `addressZh` (Traditional Chinese), `addressCn` (Simplified Chinese)
- `domain` — site domain (no protocol), used for SEO/OG URLs
- `hours` (English), `hoursZh` (Traditional), `hoursCn` (Simplified)
- `founded` — year founded (used in JSON-LD, about page)

## How It Connects to Other Files

**Imports from:**
- `./i18n/translations` — `Lang` type

**Exports:**
- `StatItem` (type)
- `heroStats` (const)
- `sectionStats` (const)
- `companyFacts` (const)

**Imported by:**
- `src/app/layout.tsx` — uses `companyFacts` for SEO metadata + JSON-LD
- `src/components/pages/home.tsx` — uses `heroStats` + `sectionStats` + `companyFacts`
- `src/components/pages/about.tsx` — uses `companyFacts`
- `src/components/pages/contact.tsx` — uses `companyFacts`
- `src/components/sections/footer.tsx` — uses `companyFacts`
- `src/components/sections/navbar.tsx` — uses `companyFacts` (phone, WhatsApp)
- `src/components/sections/whatsapp-float.tsx` — uses `companyFacts.whatsappUrl`

## Common Beginner Questions

**Q: Why are some fields tripled (e.g. `address` / `addressZh` / `addressCn`) instead of being in a translations file?**
A: Because these are factual data values (a real postal address), not UI strings. Putting them here keeps them with the rest of the company facts. The component picks the right variant based on the current language.

**Q: What does `Record<Lang, StatItem[]>` mean?**
A: It's a TypeScript utility type meaning "an object whose keys are the three language codes (`en`, `zh-HK`, `zh-CN`) and whose values are arrays of `StatItem`". So `heroStats.en` is an array of 4 StatItems, `heroStats["zh-HK"]` is also 4, etc.

**Q: Why is there a warning that the numbers are placeholders?**
A: Because making false marketing claims (e.g. "25+ years" if it's actually 5) would violate the Hong Kong TCSP Code of Practice and could cause legal trouble. The team must verify each number before launch.
