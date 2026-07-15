# File: legal.tsx

## What This File Does
`legal.tsx` is a **reusable legal page component**. It exports a single `LegalPage` component that takes a `which` prop (one of `"privacy"`, `"terms"`, `"complaints"`, `"disclosures"`) and renders the corresponding legal document. All four legal pages share the exact same layout — only the copy and hero image differ. The component is rendered four times by the router (once per legal route) with a different `which` prop each time.

## Where It Lives in the Project
- **Path:** `src/components/pages/legal.tsx`
- **Routes:** `privacy` → `#/privacy`, `terms` → `#/terms`, `complaints` → `#/complaints`, `disclosures` → `#/disclosures`
- Imported by `src/app/page.tsx`; the `RouterOutlet` renders `<LegalPage which="privacy" />`, `<LegalPage which="terms" />`, etc., based on the active route.

## What It Produces
The visitor sees, top to bottom:
1. **PageHero** — small-height dark image banner. The eyebrow shows the document's "last updated" date; the title is the document's title. The hero image is selected per document from the `HERO_IMAGES` map.
2. **Legal body** — a narrow `max-w-3xl` reading column with:
   - An intro paragraph.
   - A list of sections, each with an H2 heading and a paragraph.
   - A contact card at the bottom showing the legal entity name, language-aware address, email (mailto link), and phone (tel link).
3. **CTABand** — closing teal gradient panel (reuses the homepage CTA copy).

## Key Concepts

- **`LegalKey` type** — `type LegalKey = "privacy" | "terms" | "complaints" | "disclosures"`. This TypeScript union type lists the four valid legal document keys. The `which` prop is typed as `LegalKey`, so TypeScript will error if you pass any other string (e.g., a typo like `"privac"`).
- **`HERO_IMAGES: Record<LegalKey, string>`** — a map from each legal key to a hero image URL. `Record<K, V>` is a TypeScript utility that requires exactly one entry per key in the union. If you add a new key to `LegalKey`, TypeScript will error until you add its image here too — a nice safety net.
- **`useLang()`** — returns `{ lang, setLang, t }`.
- **`t.legal[which]`** — the document object for the requested legal key. Each document has `{ updated, title, intro, sections[] }`. The `sections` array contains `{ h, p }` pairs (heading + paragraph). These live in `extra-content.ts` and are merged into `t` by `lang-context.tsx`.
- **`companyFacts`** — single-source-of-truth object holding the company's legal name, addresses (English / traditional / simplified), email, and phone.
- **Inline language ternary** — `{lang === "en" ? "Contact us" : lang === "zh-HK" ? "聯絡我哋" : "聯絡我们"}` is a quick inline translation when the string isn't worth adding to the dictionary. The same pattern picks `companyFacts.address` vs `addressZh` vs `addressCn`.
- **Reusable layout via props** — instead of duplicating the legal page layout 4 times (one per doc), this component takes a `which` prop and looks up everything else. This is a common React pattern: parameterize a component by a key, look up the rest of the data.
- **`PageHero`, `CTABand`** — reusable block components.

## Section-by-Section Breakdown

### Imports
- `useLang`, `PageHero`, `CTABand`, `companyFacts`, and `type Lang` (the language union type from `translations.ts`).
- Note: `Lang` is imported as a type but not used directly in the file — it's a leftover import. The `lang` value from `useLang()` is already typed.

### `LegalKey` type & `HERO_IMAGES` map
- `LegalKey` — the 4 valid document keys.
- `HERO_IMAGES` — one Unsplash URL per key.

### `LegalPage` component
- Takes `{ which }: { which: LegalKey }` as props.
- Reads `{ t, lang }` from `useLang()` and `doc = t.legal[which]` for the document copy.

### PageHero
- Small height. Eyebrow = `doc.updated` (the "last updated" date). Title = `doc.title`. Image = `HERO_IMAGES[which]`.

### Legal body section (white, narrow column)
- `max-w-3xl` for a comfortable reading width (about 65 characters per line).
- **Intro paragraph** — `doc.intro`.
- **Sections** — `.map` over `doc.sections`. Each renders an H2 (`s.h`) and a paragraph (`s.p`).
- **Contact card** — a `slate-50` box with:
  - "Contact us" heading (inline-translated).
  - `companyFacts.legalName` (always English — it's a registered legal name).
  - Language-aware address (`companyFacts.address` / `addressZh` / `addressCn`).
  - Email as a `mailto:` link.
  - Phone as a `tel:` link (with whitespace stripped).

### CTABand
- Reuses the homepage CTA copy (`t.pages.home.ctaTitle`, `ctaLead`, `ctaButton`) for cross-page consistency.

## How It Connects to Other Files

- **Imports from:**
  - `@/lib/i18n/lang-context` → `useLang`
  - `@/components/blocks/page-hero` → `PageHero`
  - `@/components/blocks/cta-band` → `CTABand`
  - `@/lib/site-data` → `companyFacts`
  - `@/lib/i18n/translations` → `type Lang` (imported but unused in this file)
- **Imported by:** `src/app/page.tsx` — rendered 4 times with different `which` props:
  ```tsx
  case "privacy":     return <LegalPage which="privacy" />;
  case "terms":       return <LegalPage which="terms" />;
  case "complaints":  return <LegalPage which="complaints" />;
  case "disclosures": return <LegalPage which="disclosures" />;
  ```
- **Router mapping:** URLs `#/privacy`, `#/terms`, `#/complaints`, `#/disclosures` → routes `"privacy"`, `"terms"`, `"complaints"`, `"disclosures"`. See `src/lib/router.tsx`.
- **Data source:** the legal document content lives in `src/lib/i18n/extra-content.ts` under the `legal` key, merged into `t` by `src/lib/i18n/lang-context.tsx`.

## Common Beginner Questions

**Q: Why is there one component for 4 pages instead of 4 separate files?**
A: The 4 legal pages share the exact same layout (hero, intro, sections, contact card, CTA) — only the copy and hero image differ. Duplicating the JSX 4 times would mean 4 places to update if the layout changes. The `which` prop + `t.legal[which]` lookup keeps it DRY (Don't Repeat Yourself).

**Q: Why is `Record<LegalKey, string>` better than a plain object type for `HERO_IMAGES`?**
A: `Record<K, V>` enforces that the object has exactly one entry per key in `K`. If you later add a new `LegalKey` (say `"cookies"`), TypeScript will error on `HERO_IMAGES` until you add its image — catching the omission at compile time rather than at runtime when a visitor hits the cookies page and sees a broken hero.

**Q: Why are some translations inline (`lang === "en" ? "Contact us" : ...`) instead of in the dictionary?**
A: It's a trade-off. The dictionary is the right place for most strings (especially repeating ones), but for one-off strings that only appear here and are tightly coupled to the layout (like the "Contact us" heading), an inline ternary can be simpler. The legal docs themselves are in the dictionary; only this one heading is inline. In a stricter codebase you'd move it to the dictionary for consistency.
