# File: cookie-consent.tsx

## What This File Does
`cookie-consent.tsx` renders a small cookie-consent banner card that appears in the bottom-right corner on the user's first visit. It checks `localStorage` for a previously saved consent value; if none exists, it waits 800ms (to avoid an initial-paint flash) and then shows the banner. The user can choose "Accept all" or "Necessary only" — both save the choice to `localStorage` and hide the banner. There's also an X button that defaults to "necessary only".

## Where It Lives in the Project
`src/components/sections/cookie-consent.tsx`

A floating overlay "section" component mounted once in the app shell.

## What It Produces
- A white rounded card with shadow, positioned in the bottom-right corner (`z-[60]`).
- A cookie icon tile, title, body text, and a "Learn more" link.
- Two action buttons: a primary teal "Accept all" and an outlined "Necessary only".
- An X close button that defaults to "necessary only".
- A persisted choice in `localStorage` under the key `smarthub-cookie-consent` so the banner never reappears on subsequent visits.

## Key Concepts
- **`localStorage`** — A browser key-value store that survives page reloads and browser restarts. Used here to remember the user's consent choice. Note: it's synchronous and can throw in private browsing mode, so we wrap it in `try/catch`.
- **Named constants** — `CONSENT_KEY = "smarthub-cookie-consent"` is declared once and reused. This avoids typos and makes renaming easy.
- **`try/catch` around storage** — Some browsers (e.g. Safari private mode) throw on `localStorage` access. Wrapping in `try/catch {}` (with an empty catch) gracefully degrades.
- **Delayed appearance** — A `setTimeout` of 800ms gives the page time to paint before the banner pops in. This is a small UX polish that prevents a jarring flash.
- **`role="dialog"` + `aria-label`** — Tells screen readers this is a dialog and gives it an accessible name. Without these, the popup would be confusing for screen-reader users.
- **`z-[60]`** — Higher than the navbar's `z-50` and the cookie banner needs to be above other floating UI like the WhatsApp button.

## Section-by-Section Breakdown
1. **Imports** — `useLang` for translated strings; `useState`/`useEffect` from React; `Cookie`, `X` icons from lucide-react; `Button` from shadcn/ui.
2. **`CONSENT_KEY` constant** — the localStorage key name.
3. **`CookieConsent()` function** — the component body.
4. **`useLang()` hook** — pulls the translated `t.cookie.*` strings.
5. **`visible` state** — boolean, starts `false`.
6. **`useEffect` first-visit check** — reads `localStorage`. If empty, schedules an 800ms timeout to show the banner. Wrapped in `try/catch` for storage-disabled browsers. Returns a cleanup that clears the timeout.
7. **`choose()` function** — takes `"all"` or `"necessary"`, writes to localStorage (try/catch), sets `visible` to false. Contains a placeholder comment for where real analytics init would go.
8. **Early return** — `if (!visible) return null;` hides the banner entirely when not visible.
9. **Dialog container** — `role="dialog"` + `aria-label`, `fixed bottom-3` on mobile and `sm:right-4 sm:bottom-4` on larger screens, `z-[60]`, `max-w-md`.
10. **Card layout** — `flex items-start gap-3` row with icon tile, content column, and X button.
11. **Icon tile** — teal-tinted rounded square holding the Cookie icon.
12. **Content column** — title `<h2>`, body `<p>` with inline "Learn more" link via `RouterLinkPlaceholder`.
13. **Action buttons** — two shadcn `Button`s: teal gradient "Accept all" and outlined "Necessary only". Each calls `choose()` with the appropriate value.
14. **X close button** — small button in the top-right of the card; calls `choose("necessary")` so closing defaults to the safer option.
15. **`RouterLinkPlaceholder` helper** — a tiny function component that renders `<a href="#/privacy">`. Defined at the bottom of the file as a stand-in for the real `RouterLink`.

## How It Connects to Other Files
- Imports `useLang` from `@/lib/i18n/lang-context`.
- Imports `Cookie`, `X` from `lucide-react`.
- Imports `Button` from `@/components/ui/button` (shadcn/ui).
- Exports `CookieConsent` — rendered once in the app shell.
- The placeholder `RouterLinkPlaceholder` points to `#/privacy` (the privacy page).

## Common Beginner Questions
**Q: Why `try/catch` around `localStorage`? Don't all browsers support it?**
A: The API exists in all modern browsers, but access can throw in private/incognito mode in some Safari versions, or when cookies are disabled. Wrapping in `try/catch` is a defensive pattern that prevents the whole component from crashing if storage is unavailable.

**Q: Why does the X button default to "necessary only" instead of just closing?**
A: Under GDPR-style rules, closing a banner without making an explicit choice should be treated as "no consent for non-essential cookies" — i.e. the same as "necessary only". This is the privacy-friendly default.

**Q: Why an 800ms delay before showing?**
A: If the banner appeared instantly on page load, it would overlap with the initial page paint and feel like a popup ad. The delay lets the page settle first, which feels more polite. It's a small but important UX detail.
