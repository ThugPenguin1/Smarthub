# File: language-switcher.tsx

## What This File Does
`language-switcher.tsx` renders a small pill-shaped dropdown button showing a globe icon and the current language's short code (`EN`, `繁`, or `简`). Clicking it opens a menu with all three supported languages (English / 繁體中文 / 简体中文), with a check mark next to the currently-active one. Selecting a language calls `setLang()` from the lang context, which updates the global language state, persists the choice to `localStorage`, and re-renders every translated component.

## Where It Lives in the Project
`src/components/language-switcher.tsx`

Used inside the navbar (both desktop and mobile menu). Could be reused in other locations.

## What It Produces
- A pill button with a `Globe` icon and the current language short code.
- A dropdown menu (shadcn/ui `DropdownMenu`) with three items.
- A teal check mark next to the active language.
- A call to `setLang()` on item click, which updates the global language state.

## Key Concepts
- **shadcn/ui `DropdownMenu`** — A pre-built, accessible dropdown primitive. Handles open/close state, keyboard navigation (arrow keys, escape), focus management, click-outside-to-close, and ARIA roles. We just compose the sub-components: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`.
- **`asChild` pattern** — `DropdownMenuTrigger asChild` lets us use our own `<button>` element with custom styles instead of the default trigger.
- **React Context** — `useLang()` reads the global `lang` state and `setLang` setter from `LangProvider`. When `setLang` is called, every component that calls `useLang()` re-renders with the new language.
- **`LANGS` constant** — Imported from `@/lib/i18n/translations`. A single source of truth for the three supported languages: `{ code: Lang, label: string, short: string }[]`. Using a constant ensures the dropdown items always match the languages supported by the rest of the system.
- **Type cast `l.code as Lang`** — `LANGS` is typed as a plain array, so `l.code` is `Lang` at runtime but TypeScript may infer it more narrowly. The cast is defensive.
- **Conditional rendering** — `{l.code === lang && <Check ... />}` shows the check mark only for the currently-active language.

## Section-by-Section Breakdown
1. **Imports** — `useLang` from the lang context; `LANGS, Lang` from translations; the four `DropdownMenu*` sub-components from shadcn/ui; `Globe, Check` icons from lucide-react.
2. **`LanguageSwitcher()` function** — destructures a `compact` prop (currently unused, kept for future variants).
3. **`useLang()` hook** — pulls `lang` (current code) and `setLang` (setter).
4. **`current` lookup** — finds the matching LANGS entry, with a fallback to `LANGS[0]` (English).
5. **`<DropdownMenu>` wrapper** — root of the shadcn dropdown.
6. **`<DropdownMenuTrigger asChild>`** — wraps a custom `<button>`:
   - `aria-label="Switch language"` for screen readers.
   - Pill styling: `rounded-full border bg-white/70 px-3 py-1.5 text-xs`.
   - Hover/focus turns the border + text teal.
   - Contains a `<Globe>` icon and the short code `<span>`.
7. **`<DropdownMenuContent align="end">`** — the dropdown panel, aligned to the right edge of the trigger.
8. **`LANGS.map(...)`** — renders one `<DropdownMenuItem>` per language:
   - `onClick` calls `setLang(l.code as Lang)` — this is the action that changes the site language.
   - `justify-between` puts the label on the left and the check mark on the right.
   - Conditionally shows `<Check>` for the active language only.

## How It Connects to Other Files
- Imports `useLang` from `@/lib/i18n/lang-context` (the language context provider).
- Imports `LANGS, Lang` from `@/lib/i18n/translations` (the language constant + type).
- Imports `DropdownMenu*` from `@/components/ui/dropdown-menu` (shadcn/ui primitive).
- Imports `Globe, Check` from `lucide-react`.
- Exports `LanguageSwitcher` — used by `navbar.tsx`.

## Common Beginner Questions
**Q: What does shadcn/ui's `DropdownMenu` actually do under the hood?**
A: It manages the open/close state, renders the dropdown in a React portal (so it isn't clipped by parent overflow), handles keyboard navigation (arrow keys, home, end, escape), restores focus to the trigger on close, closes on outside-click, and applies correct ARIA roles (`menu`, `menuitem`, `menu-trigger`). Building all of that from scratch would take hundreds of lines — shadcn/ui gives it to you for free.

**Q: How does clicking a language actually re-render the page?**
A: `setLang` (from `useLang`) updates a `useState` inside `LangProvider`. React's normal re-render flow then propagates the new `lang` value through context to every component that calls `useLang()`. Each of those components re-renders, reading fresh translated strings from `t`.

**Q: Why persist the choice to `localStorage`?**
A: Without persistence, the language would reset to English (or the browser default) on every page refresh. Persisting means the user's choice survives reloads and revisits — a basic UX expectation for a multi-language site. The persistence happens inside `setLang` in `lang-context.tsx`, not here.
