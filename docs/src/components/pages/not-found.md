# File: not-found.tsx

## What This File Does
`not-found.tsx` is the **404 page**. It exports a `NotFoundPage` component that renders a friendly "page not found" screen with a giant gradient "404" number, a headline, a body paragraph, and two buttons (Back to home / Go back). It's shown whenever a visitor hits a URL that doesn't match any route.

## Where It Lives in the Project
- **Path:** `src/components/pages/not-found.tsx`
- **Route:** `not-found` — rendered when the router can't match the current hash to any known route. The router's `parseHash()` function (in `src/lib/router.tsx`) returns `"not-found"` for any unrecognized path.
- Imported by `src/app/page.tsx`; rendered by `RouterOutlet` when `route === "not-found"`.

## What It Produces
The visitor sees a vertically-centered layout on a soft gradient background:
1. A giant "404" number with a teal-to-emerald gradient fill (the `bg-clip-text` trick).
2. A bold headline (`t.notFound.title`).
3. A body paragraph (`t.notFound.body`) explaining what happened.
4. Two buttons:
   - **Primary** — "Back to home" (a `RouterLink` to `/`) with a Home icon.
   - **Secondary** — "Go back" (an outline button that calls `window.history.back()`) with an ArrowLeft icon.
5. Two decorative blurred circles in the background for visual softness.

## Key Concepts

- **`useLang()`** — returns `{ lang, setLang, t }`. Here only `t` is destructured (we need `t.notFound` for the copy).
- **`t.notFound`** — the 404-page copy object (`title`, `body`, `cta`), merged into `t` from `extra-content.ts` by `lang-context.tsx`.
- **`bg-clip-text` gradient text trick** — `text-transparent` + `bg-gradient-to-br from-... to-...` + `bg-clip-text` makes the text itself render with a gradient fill. The text color is set to transparent, and the gradient is clipped to the text shape instead of filling a background box.
- **`RouterLink`** — used for the primary "Back to home" button to navigate via the hash router (no full page reload).
- **`window.history.back()`** — the secondary button uses the browser's History API to go back one page. The `typeof window !== "undefined"` guard protects against server-side rendering crashes (Next.js runs components on the server first, where `window` doesn't exist).
- **`Button asChild`** — wraps both a `RouterLink` (primary) and a plain `<a href="#">` (secondary) so each inherits button styling. The secondary button is a plain `<a href="#">` (not a `RouterLink`) because clicking it should NOT trigger the hash router — only the `onClick` handler (which calls `history.back()`) should run.
- **Inline language check** — `{t.notFound.cta === "Back to home" ? "Go back" : "返回"}` is a quick way to pick the "Go back" label based on whether the active language is English. It's a pragmatic shortcut when the string isn't worth adding to the dictionary.

## Section-by-Section Breakdown

### Imports
- `useLang`, `Button`, `RouterLink`, and 2 Lucide icons (`Home`, `ArrowLeft`).

### `NotFoundPage` component
- Reads `{ t }` from `useLang()`.
- Returns a single `<section>` (no fragment needed — only one root element).

### Outer section
- `min-h-[70vh]` — fills 70% of the viewport height so the page feels substantial, not like a tiny error box.
- `flex items-center justify-center` — centers the content vertically and horizontally.
- `bg-gradient-to-br from-slate-50 via-teal-50/30 to-rose-50/30` — a soft tri-color gradient background.

### Decorative blurred circles
- Two `pointer-events-none` divs with `blur-3xl` and faint color fills. They add visual depth without distracting from the content. `pointer-events-none` ensures they never intercept clicks.

### Content container
- `max-w-2xl px-6 text-center` — caps the width and centers text.

### Giant "404"
- `text-[10rem]` on mobile, `sm:text-[14rem]` on small screens and up — truly huge.
- `text-transparent` + `bg-clip-text` + `bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-500` — gradient-filled text.

### Headline + body
- H1 (`t.notFound.title`) + paragraph (`t.notFound.body`).

### Buttons
- **Primary** — `Button asChild` wrapping `<RouterLink to="home">`. Teal gradient background, white text, shadow. Home icon + `t.notFound.cta` label.
- **Secondary** — `Button asChild` with `onClick={() => typeof window !== "undefined" && window.history.back()}`, wrapping `<a href="#">`. Outline variant (slate border). ArrowLeft icon + "Go back" / "返回" label.

## How It Connects to Other Files

- **Imports from:**
  - `@/lib/i18n/lang-context` → `useLang`
  - `@/components/ui/button` → `Button`
  - `@/lib/router` → `RouterLink`
  - `lucide-react` → `Home`, `ArrowLeft`
- **Imported by:** `src/app/page.tsx` (renders `<NotFoundPage />` when `route === "not-found"`).
- **Router mapping:** the router's `parseHash()` returns `"not-found"` for any unrecognized hash path. See the `ROUTE_MAP` and `parseHash` function in `src/lib/router.tsx`.

## Common Beginner Questions

**Q: Why does the secondary button use `<a href="#">` instead of a `RouterLink` or a plain `<button>`?**
A: Three reasons. (1) `Button asChild` expects a single child element that can receive DOM props — both `<a>` and `<button>` work, but `<a>` is what `RouterLink` renders, so consistency is easier. (2) Using `href="#"` means the link is keyboard-accessible and focusable like a real link (good for a11y). (3) We don't want the hash router to handle the click — we want `window.history.back()` to run instead. The `onClick` handler doesn't call `e.preventDefault()`, but since `href="#"` would just scroll to top (which we don't want), the `history.back()` runs first and navigates away before the `#` takes effect. (In practice, if there's no history to go back to, the `#` scroll is harmless.)

**Q: How does the router know to show this page?**
A: The router's `parseHash()` function (in `src/lib/router.tsx`) looks up the current hash path in `ROUTE_MAP`. If the path isn't in the map, it returns `"not-found"`. The `RouterOutlet` switch in `src/app/page.tsx` then renders `<NotFoundPage />` for that route. So visiting `#/typo`, `#/nonexistent`, or any other unmapped path triggers the 404.

**Q: Why is the "Go back" label decided by checking `t.notFound.cta === "Back to home"`?**
A: It's a quick-and-dirty way to detect the active language without importing the `lang` value. If the CTA string is in English, the active language is English, so "Go back" is shown; otherwise "返回" (Chinese) is shown. In a stricter codebase you'd add a `goBack` string to the `notFound` dictionary entry and use `t.notFound.goBack` directly. This shortcut works because the English CTA string is known and stable.
