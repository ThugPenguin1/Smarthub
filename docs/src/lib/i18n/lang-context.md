# File: lang-context.tsx

## What This File Does

This is the **central React Context for trilingual support** (English / Traditional Chinese / Simplified Chinese). It merges strings from three translation modules (`translations.ts`, `page-content.ts`, `extra-content.ts`) into one big dictionary via the `buildDict()` function, detects the user's preferred language on first load (checking localStorage first, then the browser's `navigator.language`), holds the current language state, persists language changes to localStorage, syncs the `<html lang>` attribute for accessibility/SEO, and exposes a `useLang()` hook that every component uses to read the current language, switch languages, and access the translation dictionary.

## Where It Lives in the Project

```
/home/z/my-project/src/lib/i18n/lang-context.tsx
```

## What It Produces

- `buildDict(lang)` function — merges the three translation sources into one dictionary
- `Dict` type — the full type of the merged dictionary (computed via `ReturnType<typeof buildDict>`)
- `LangProvider` component — wraps the app to provide language state via React Context
- `useLang()` hook — lets any component read `{ lang, setLang, t }`

## Key Concepts

- **React Context** — A way to share state across many components without prop drilling. The Provider holds the state; any descendant can call `useContext()` (via the `useLang` hook) to read it. When the state changes, all consumers re-render automatically.
- **`buildDict` function** — Merges three translation sources into one. Why three? To keep each file manageable: `translations.ts` is the base (nav, hero, services), `page-content.ts` is the long-form page text, `extra-content.ts` has supplementary UI strings (cookie banner, legal, etc.). Fusing them here lets consumers read `t.hero.title`, `t.pages.home.about.body`, `t.cookie.accept` from a single object.
- **Language detection** — On first load we check three things in order: (1) localStorage (user previously chose a language), (2) `navigator.language` (browser's preferred language — if it starts with `zh` we check for Traditional vs Simplified variants), (3) default to English. This makes the site feel native to first-time visitors.
- **localStorage persistence** — When the user switches language, we save the choice under the key `"smarthub-lang"` so it survives page reloads. The `try/catch` handles environments where localStorage is disabled (e.g. older Safari private mode).
- **`<html lang>` syncing** — Setting `document.documentElement.lang` to `"en"`, `"zh-Hant"`, or `"zh-Hans"` is important for accessibility (screen readers use it to pick pronunciation rules) and SEO (search engines use it to understand the page's language).
- **`ReturnType<typeof buildDict>`** — A TypeScript trick that computes a type from a function's return value, so we don't have to retype every key of the dictionary by hand. Anywhere `t` is used gets full autocomplete.
- **`useCallback`** — React hook that memoises a function so its identity stays stable across renders. Used here for `setLang` so consumers don't re-render unnecessarily.

## Section-by-Section Breakdown

### 1. `"use client"` + imports (lines 1–7)
Marks the file as a client component (needs `window.localStorage` + `window.navigator`). Imports React hooks, the `Lang` type + base `translations` from `./translations`, and `pageContent` + `extraContent` from sibling files.

### 2. `buildDict(lang)` function (lines 9–24)
Takes a `Lang` and returns a merged dictionary object. Uses object spread to combine:
- Base strings (`...translations[lang]`)
- `pages` (from `pageContent`)
- `footer` — special-cased: merges base footer with extra footer fields
- Supplementary UI strings (`cookie`, `backToTop`, `skipToContent`, `notFound`)
- Page-specific extras (`whyHkExtra`, `insightsExtra`, `pricingExtra`, `contactExtra`)
- Legal strings (`legal`)

### 3. `Dict` type (line 26)
`ReturnType<typeof buildDict>` — TypeScript computes the dictionary type from the function's return value.

### 4. `LangContextValue` type + `LangContext` (lines 28–34)
Type describing the context value (`lang` + `setLang` + `t`), and the actual React Context object (holds `null` when no provider is mounted).

### 5. `STORAGE_KEY` (line 36)
The localStorage key constant: `"smarthub-lang"`.

### 6. `detectInitialLang()` function (lines 38–52)
Detects the user's preferred language on first load:
1. Returns `"en"` on the server (no `window`)
2. Checks localStorage for a saved preference
3. Falls back to `navigator.language` — if it starts with `zh`, checks for Traditional (Hant/HK/TW/MO) vs Simplified
4. Defaults to `"en"`

### 7. `LangProvider` component (lines 54–81)
The React Context Provider. State:
- `lang` — initialized once via `detectInitialLang()` on the client, or `"en"` on the server

Effects:
- Whenever `lang` changes, sets `document.documentElement.lang` to `"en"` / `"zh-Hant"` / `"zh-Hans"`

`setLang(l)`:
- Updates React state (triggers re-render with new dictionary)
- Persists to localStorage

Returns `<LangContext.Provider value={{lang, setLang, t: buildDict(lang)}}>` wrapping children. The dictionary `t` is rebuilt whenever `lang` changes.

### 8. `useLang()` hook (lines 83–89)
Returns `{ lang, setLang, t }` from context. Throws a clear error if used outside a `<LangProvider>`.

## How It Connects to Other Files

**Imports from:**
- `react` — hooks
- `./translations` — `Lang` type + base `translations` object
- `./page-content` — `pageContent` (long-form page text)
- `./extra-content` — `extraContent` (supplementary UI strings)

**Exports:**
- `Dict` (type)
- `LangProvider` (component)
- `useLang` (hook)

**Imported by:**
- `src/app/layout.tsx` — wraps the whole app in `<LangProvider>`
- `src/app/page.tsx` — uses `useLang()` for the skip-link label
- `src/components/language-switcher.tsx` — uses `useLang()` to render language buttons
- Most page components in `src/components/pages/` — use `useLang()` to get the `t` dictionary
- Many section components (navbar, footer, etc.) — use `useLang()` for labels

## Common Beginner Questions

**Q: What's React Context and why use it here?**
A: Context is React's way to share state across many components without passing props manually through every level (prop drilling). Here, the current language + dictionary needs to be accessible by dozens of components at different nesting levels, so Context is the right tool. The Provider holds the state; any descendant calls `useLang()` to read it.

**Q: Why are translations split across 3 files?**
A: To keep each file manageable. `translations.ts` (the base) is already ~980 lines. If we put all page text + supplementary UI strings in one file, it would be unmanageably long. Splitting by category (base / page-content / extra) keeps each file focused.

**Q: How does language detection work for a first-time visitor?**
A: We check localStorage first (in case they've visited before). If nothing saved, we look at `navigator.language` — a browser setting that reflects the user's preferred language. If it starts with `zh`, we check whether it's Traditional (Hant script tag, or HK/TW/MO region tags) or Simplified, and pick the matching variant. Otherwise we default to English. The choice is then saved to localStorage so it persists.
