# File: translations.ts

## What This File Does

This is the **BASE translation dictionary** for the entire Smarthub Connect site. It holds the short UI strings for the navigation, hero, services, pricing, contact, footer, etc. in all 3 supported languages (English, Traditional Chinese, Simplified Chinese). It's the BASE only — the full runtime dictionary is built by `buildDict()` in `./lang-context.tsx`, which merges this file with `./page-content.ts` (long-form page text) and `./extra-content.ts` (cookie banner, legal, not-found, etc.). Components read the merged dictionary via `useLang().t` and never import this file directly.

## Where It Lives in the Project

```
/home/z/my-project/src/lib/i18n/translations.ts
```

## What It Produces

- `Lang` — a TypeScript union type listing the 3 supported language codes (`"en" | "zh-HK" | "zh-CN"`)
- `LANGS` — an array describing each language for the Language Switcher UI (code, native name, short label)
- `translations` — a plain object with 3 top-level keys (one per language), each holding the same set of section keys (meta, nav, topbar, hero, about, services, whyhk, pricing, stats, insights, contact, footer)

## Key Concepts

- **i18n (internationalization)** — The practice of designing a site so it can be adapted to different languages without code changes. Here it's done by holding all UI strings in a dictionary object keyed by language.
- **Trilingual support** — English + Traditional Chinese (used in HK/Taiwan) + Simplified Chinese (used in Mainland China). The site shows the appropriate variant based on user preference.
- **TypeScript union type** — `type Lang = "en" | "zh-HK" | "zh-CN"` says `Lang` must be one of these 3 literal strings. This prevents typos like `setLang("zh-TW")` at compile time.
- **`as const`** — A TypeScript assertion that tells the compiler to infer literal types (e.g. `"Starter"` instead of `string`), giving better autocomplete downstream.
- **Base vs merged dictionary** — This file is the BASE. `buildDict()` in lang-context.tsx merges it with `page-content.ts` and `extra-content.ts` to produce the full runtime dictionary. This split keeps each file manageable.
- **Single structure, multiple languages** — All 3 language blocks have the SAME section keys and array lengths. TypeScript enforces this implicitly (if you add a key to `en` but forget `zh-HK`, accessing `t.newKey` would fail at runtime when lang is `zh-HK`).

## Section-by-Section Breakdown

### 1. File header comment (lines 1–59)
A detailed JSDoc-style comment explaining what the file is, its structure, what each top-level section key controls, how to add a new string, and how to add a new language.

### 2. `Lang` type (line 64)
The TypeScript union type: `"en" | "zh-HK" | "zh-CN"`. Used throughout the codebase for type-safe language switching.

### 3. `LANGS` array (lines 70–74)
An array describing each language for the Language Switcher UI:
- `code` — the Lang union value (used internally)
- `label` — the full native name (shown in the dropdown)
- `short` — the 1-character label shown on the switcher button (EN / 繁 / 简)

### 4. `translations` object (lines 81–1107)
The big one. Has 3 top-level keys, one per language:

#### `en` block (lines 87–456) — English (base/reference language)
Contains 12 section keys, each documented with a comment:

- **`meta`** — page `<title>` + meta description. Used by some pages' Next.js metadata export and as a JSON-LD fallback.
- **`nav`** — top navigation bar labels. Used by `src/components/sections/navbar.tsx`. Includes `cta` ("Get Started" button) and `call`/`whatsapp` quick-contact buttons.
- **`topbar`** — slim utility strip above the navbar (phone, WhatsApp, email, TCSP licence badge). Used by the Navbar component's top row.
- **`hero`** — homepage hero section: eyebrow tag, big headline (split into `title` + `titleAccent` so the accent can be styled differently), lead paragraph, two CTAs, and 4 inline stat items. Used by `src/components/pages/home.tsx`.
- **`about`** — About-page content: eyebrow, title, two body paragraphs (`body`, `body2`), and 4 bullet `points[]` (each with title + text). Used by `src/components/pages/about.tsx`.
- **`services`** — Services-page content: eyebrow, title, lead, an array of 4 service `items[]` (each with tag, title, desc, and a features list of 6 bullets), and a CTA button label. Used by `src/components/pages/services.tsx`.
- **`whyhk`** — "Why Hong Kong" page: eyebrow, title, lead, and 6 `cards[]` (each with title + text). Used by `src/components/pages/why-hk.tsx`.
- **`pricing`** — Pricing-page content: eyebrow, title, lead, disclaimer, 3 pricing `tiers[]` (Starter / Professional / Enterprise, each with name, tagline, price, period, desc, features list, CTA, popular flag), plus a workspace add-ons section (`workspaceTitle` + `workspace[]` array of 6 items: name, price, desc). Used by `src/components/pages/pricing.tsx`.
- **`stats`** — mid-page stats band: section title + 6 stat `items[]` (each with `num` + `label`). Used by the homepage stats band. (Note: the same stats also appear in `src/lib/site-data.ts` as `sectionStats` for places that need them outside the dictionary.)
- **`insights`** — Insights/blog page: eyebrow, title, lead, 3 article `items[]` (each with cat, date, title, excerpt), and a CTA label. Used by `src/components/pages/insights.tsx`.
- **`contact`** — Contact-page content: eyebrow, title, lead, `form` object (field labels, service options array, submit/sending/success states, placeholder text), and `info` object (address/phone/whatsapp/email/hours labels + values). Used by `src/components/pages/contact.tsx`.
- **`footer`** — site-wide footer: tagline, 3 column headings (explore, legal, connect), `links` object with all 10 link labels (about, services, whyhk, pricing, insights, contact, privacy, terms, complaints, disclosures), legal `note` text, and copyright `rights`. Used by `src/components/sections/footer.tsx`. Note: the LangProvider merges this base footer with extra footer fields from extra-content.ts.

#### `"zh-HK"` block (lines 463–780) — Traditional Chinese (Hong Kong/Cantonese)
Mirrors the `en` block's structure exactly: same section keys, same array lengths. Only the string values are translated.

#### `"zh-CN"` block (lines 788–1105) — Simplified Chinese (Mainland China)
Mirrors the `en` block's structure exactly: same section keys, same array lengths. Only the string values are translated.

### 5. `as const` assertion (line 1107)
Tells TypeScript to infer literal types (e.g. `"Starter"` instead of `string`), giving better autocomplete downstream.

## How It Connects to Other Files

**Imports from:**
- (none — this is a leaf module)

**Exports:**
- `Lang` (type)
- `LANGS` (array)
- `translations` (object)

**Imported by:**
- `./lang-context.tsx` — imports `Lang` + `translations` and merges them with `pageContent` + `extraContent` via `buildDict()`
- `./page-content.ts` and `./extra-content.ts` — likely import `Lang` for typing
- `src/lib/site-data.ts` — imports `Lang` for typing the `Record<Lang, StatItem[]>` objects

**Not imported directly by:**
- Any component — components use the merged dictionary via `useLang().t` from lang-context.tsx

## Common Beginner Questions

**Q: Why are translations split across 3 files (translations.ts, page-content.ts, extra-content.ts)?**
A: To keep each file manageable. If everything were in one file, it would be 2000+ lines and hard to navigate. Splitting by category (base UI strings / long-form page text / supplementary UI strings) keeps each file focused and easier to edit.

**Q: Why does each language have the same structure?**
A: So TypeScript can guarantee type safety. If you add a key to `en` but forget `zh-HK`, accessing that key when the language is `zh-HK` would fail at runtime. The `as const` + `Record` typing makes TypeScript error if the structures don't match.

**Q: What's the difference between `Lang` and `LANGS`?**
A: `Lang` is a TYPE (a union of 3 string literals). `LANGS` is a VALUE (an array of objects describing each language). The type is used for compile-time checks; the array is used at runtime to render the Language Switcher UI.

**Q: How do I add a new string?**
A: 1) Add it under the SAME section key in all 3 languages (en, zh-HK, zh-CN). TypeScript will error if you forget one. 2) Use it in a component: `const { t } = useLang(); t.hero.title`.

**Q: How do I add a new language?**
A: 1) Add the new code to the `Lang` union type. 2) Add an entry to the `LANGS` array. 3) Add a new top-level key (e.g. `ja: {...}`) to `translations` mirroring the structure of `en`. 4) Repeat for `page-content.ts` and `extra-content.ts`. 5) Update `detectInitialLang()` in `lang-context.tsx` to detect it.
