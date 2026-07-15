# File: whatsapp-float.tsx

## What This File Does
`whatsapp-float.tsx` renders the green circular WhatsApp button fixed to the bottom-right corner of every page. It pulses for the first 3.5 seconds to draw the user's eye, then stops. On hover it shows a "WhatsApp" tooltip, and clicking it opens a WhatsApp chat with the company in a new tab.

## Where It Lives in the Project
`src/components/sections/whatsapp-float.tsx`

A floating overlay "section" component mounted once in the app shell.

## What It Produces
- A 56×56 px (h-14 w-14) green circle in the bottom-right corner.
- The official WhatsApp logo as inline SVG.
- A pulsing `animate-ping` ring behind the button for the first 3.5 seconds after mount.
- A dark tooltip pill that fades in on hover, sitting to the left of the button.
- An accessible `aria-label` so screen readers announce "WhatsApp".

## Key Concepts
- **`useState` + `useEffect` + `setTimeout`** — A common pattern for time-based UI behaviour. We use a boolean state (`pulsing`) that starts `true` and gets flipped to `false` by a 3500ms timer. The cleanup function clears the timer if the component unmounts early.
- **`fixed` positioning** — `position: fixed` removes the element from the normal document flow and pins it relative to the viewport, so it stays put while the page scrolls.
- **`z-50`** — A high stacking-context value so the button sits above other page content but below modals (which typically use `z-[60]` or higher).
- **Tailwind `group` / `group-hover:`** — Adding the `group` class to a parent lets you style children based on the parent's hover state. Here, the tooltip is `opacity-0` by default and `group-hover:opacity-100` when the parent `<a>` is hovered.
- **`animate-ping`** — A built-in Tailwind keyframe animation that scales the element up and fades it out, creating a "radar ping" effect.
- **`aria-label` + `aria-hidden`** — Accessibility pair: the parent `<a>` needs a label because it has no text content; the SVG is `aria-hidden` so screen readers don't read it twice.

## Section-by-Section Breakdown
1. **Imports** — `useLang` for the translated WhatsApp string; `useEffect`/`useState` from React.
2. **`WhatsAppFloat()` function** — the component body.
3. **`useLang()` hook** — pulls `t` (we use `t.nav.whatsapp`).
4. **`pulsing` state** — boolean, starts `true`.
5. **`useEffect` with `setTimeout`** — schedules a 3.5s timer that flips `pulsing` to `false`; returns a cleanup that clears the timer.
6. **`<a>` element** — the button itself:
   - `href="https://wa.me/85255013516"` opens WhatsApp chat.
   - `target="_blank"` + `rel="noopener noreferrer"` opens it in a new tab safely.
   - `aria-label={t.nav.whatsapp}` for accessibility.
   - `group` enables group-hover for the tooltip.
   - `fixed bottom-5 right-5 z-50` pins it to the bottom-right corner.
   - `bg-[#25D366]` is WhatsApp's official brand green.
   - Hover scales the button up 10% and darkens the green slightly.
7. **Inline SVG** — the WhatsApp logo. `aria-hidden` because the parent link already has a label.
8. **Tooltip `<span>`** — positioned to the left (`right-16`), `opacity-0` by default, `group-hover:opacity-100` reveals it. `pointer-events-none` so it never blocks clicks.
9. **Pulse ring** — conditionally rendered (`{pulsing && ...}`) only while `pulsing` is true. Uses `animate-ping` and sits behind the button via `-z-10`.

## How It Connects to Other Files
- Imports `useLang` from `@/lib/i18n/lang-context` for the translated tooltip/aria-label string.
- No other dependencies — it's a self-contained floating button.
- Exports `WhatsAppFloat` — rendered once in the app shell.

## Common Beginner Questions
**Q: Why use `setTimeout` instead of a CSS animation that runs N times?**
A: CSS animations can run a fixed number of times (`animation-iteration-count: 3`), but controlling when they stop based on a state change (e.g. user interaction) is harder. `setTimeout` is the simplest, most idiomatic React way: schedule a state update, and the component re-renders without the pulse element.

**Q: Why is the tooltip `pointer-events-none`?**
A: If the tooltip captured mouse events, hovering it could cause flicker (the tooltip would briefly block the hover on the parent). `pointer-events-none` lets mouse events pass through, so the parent's `:hover` stays stable.

**Q: Why not use a `<button>` instead of `<a>`?**
A: Because clicking it navigates to an external URL (`wa.me/...`), an `<a>` is the semantically correct element. `<button>` is for actions that don't navigate (e.g. submit, toggle).
