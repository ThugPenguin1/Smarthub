# File: insights.tsx

## What This File Does
`insights.tsx` is the **Insights / blog page**. It exports an `InsightsPage` component that renders a featured article card, a 3-column grid of 5 article cards, a dark newsletter signup panel, and a closing CTA. The article list is built by a custom `useInsightList` hook that merges translated base items with two inline language-aware extras.

## Where It Lives in the Project
- **Path:** `src/components/pages/insights.tsx`
- **Route:** `insights` → URL `#/insights`
- Imported by `src/app/page.tsx`; rendered by `RouterOutlet` when `route === "insights"`.

## What It Produces
The visitor sees, top to bottom:
1. **PageHero** — medium-height dark image banner with eyebrow, H1, and lead.
2. **Featured article** — a large two-column card. Left: image with a rose "Featured" badge. Right: category pill + date, H2 title, excerpt, and a "Read article" affordance with a diagonal arrow.
3. **Article grid** — centered `SectionHeading` + a 3-column grid (2 on tablet, 1 on mobile) of 5 article cards. Each card shows an image, category pill, date, title (3-line clamped excerpt), and a "Read more" affordance. Clicking does nothing (`onClick preventDefault`) since the articles aren't real yet.
4. **Newsletter** — a dark gradient panel with a faint grid pattern, a mail icon, heading, body, and an email signup form. On submit, the button label briefly switches to a success message (no backend call).
5. **CTABand** — closing teal gradient panel.

## Key Concepts

- **`useInsightList` custom hook** — a function that starts with `use` and calls `useLang()` inside, so React treats it as a hook. It returns an array of 5 article objects: the 3 base items from `t.insights.items` (translated in the dictionary) plus 2 extra items whose copy is chosen per-language via a ternary chain (`lang === "en" ? ... : lang === "zh-HK" ? ... : ...`). Encapsulating this in a hook keeps the page component clean and ensures the list re-renders when the language changes.
- **`useState`** — React hook for local component state. Used twice here: `subscribed` (boolean for the success message) and `email` (string for the controlled input).
- **Controlled input** — the email `<Input>` has `value={email}` and `onChange={(e) => setEmail(e.target.value)}`. React owns the input's value; every keystroke updates state, which re-renders the input with the new value. This is the standard React form pattern.
- **`onSubmit` form handler** — `onSubscribe(e)` runs when the form is submitted (Enter key or button click). It calls `e.preventDefault()` to stop the browser's default form POST, sets `subscribed = true`, clears the email, then uses `setTimeout` to reset `subscribed` back to `false` after 3 seconds.
- **`onClick={(e) => e.preventDefault()}`** — used on the article card `<a>` tags to make them no-ops. The `href="#/insights"` still appears in the browser status bar (good for accessibility/SEO), but clicking doesn't navigate.
- **Modulo image indexing** — `INSIGHT_IMAGES[i % INSIGHT_IMAGES.length]` cycles through the 6-image array. With 5 articles, each card gets a unique image; if the list grew to 7+, the 7th would reuse the 1st image.
- **`PageHero`, `SectionHeading`, `CTABand`** — reusable block components.
- **`Button`, `Input`** — shadcn/ui form primitives.

## Section-by-Section Breakdown

### Imports & `INSIGHT_IMAGES`
- Block components, `Button`, `Input`, 3 Lucide icons (`ArrowRight`, `ArrowUpRight`, `Mail`), `next/image`, and `useState`.
- `INSIGHT_IMAGES` — 6 Unsplash URLs for article card images.

### `useInsightList` hook
- Reads `{ t, lang }` from `useLang()` and `p` from `pageContent`.
- `base = t.insights.items` (3 items).
- Returns `[...base, {extra1}, {extra2}]` (5 items total). The two extra items use a ternary chain on `lang` to pick English / Cantonese / Mandarin copy inline.

### `InsightsPage` component
- Reads `{ t, lang }`, `p`, calls `useInsightList()`, and sets up `subscribed` / `email` state.
- Defines `onSubscribe(e)` — the form submit handler.

### PageHero
- Medium height, with a finance/legal-themed Unsplash photo.

### Featured article section (white)
- A single `<article>` card with `lift-card group` (hover effect) and a 2-column grid on large screens.
- **Left column** — image with `bg-gradient-to-t from-slate-900/30` overlay and a rose "Featured" badge (`t.insightsExtra.featuredBadge`).
- **Right column** — category pill + date, H2 title, excerpt, and a "Read article" affordance (`t.insightsExtra.readArticle`) with an `ArrowUpRight` icon that nudges on hover.

### Article grid section (gradient)
- Centered `SectionHeading` (`t.insightsExtra.allArticles` + `p.heroTitle`).
- 3-column responsive grid. `.map` over `insights` (5 items). Each card is a plain `<a>` with `onClick preventDefault`. Inside: image with category pill, date, H3 title, 3-line clamped excerpt, and a "Read more" affordance.

### Newsletter section (white)
- A dark gradient panel (`from-slate-900 via-slate-900 to-teal-900`) with a faint grid pattern overlay.
- A teal gradient mail icon tile, H2 heading (`p.newsletterTitle`), body paragraph (`p.newsletterBody`), and a form.
- The form has a controlled email `<Input>` and a submit `<Button>`. The button label is `p.newsletterSuccess` when `subscribed` is true, otherwise `p.newsletterCta`. The arrow icon is hidden in the success state.

### CTABand
- Reuses the homepage's CTA copy for cross-page consistency.

## How It Connects to Other Files

- **Imports from:**
  - `@/lib/i18n/lang-context` → `useLang`
  - `@/lib/i18n/page-content` → `pageContent`
  - `@/components/blocks/page-hero` → `PageHero`
  - `@/components/blocks/section-heading` → `SectionHeading`
  - `@/components/blocks/cta-band` → `CTABand`
  - `@/components/ui/button` → `Button`
  - `@/components/ui/input` → `Input`
  - `lucide-react` → `ArrowRight`, `ArrowUpRight`, `Mail`
  - `next/image` → `Image`
  - `react` → `useState`
- **Imported by:** `src/app/page.tsx`.
- **Router mapping:** URL `#/insights` → route `"insights"`.

## Common Beginner Questions

**Q: Why are the article links no-ops? Why not just remove the `<a>`?**
A: Semantically, an article card should be a link (screen readers announce it as clickable, the cursor shows a pointer, and the URL appears in the status bar). Since the actual articles don't exist yet, `onClick preventDefault` keeps the semantics while disabling navigation. When real articles are added, replace the `href` and remove the `preventDefault`.

**Q: Why does the newsletter form not actually send the email anywhere?**
A: It's a UI demo. The `onSubscribe` handler just toggles a success message locally — there's no `fetch` call to a backend. To make it real, you'd add a `fetch("/api/newsletter", { method: "POST", body: ... })` call inside the handler and handle the response. (Compare to the contact form, which does call Formspree.)

**Q: Why is `useInsightList` a hook and not just a function?**
A: It calls `useLang()` inside, and React's Rules of Hooks require hooks to only be called from other hooks or component functions. Naming it `useInsightList` (starting with `use`) signals to React's linter that it's a hook and enforces those rules. The benefit: encapsulating the list-building logic keeps the main page component readable.
