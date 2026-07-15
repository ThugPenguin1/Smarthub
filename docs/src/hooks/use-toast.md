# File: use-toast.ts

## What This File Does
`use-toast.ts` is the engine behind the shadcn/ui toast notification system. It maintains an in-memory store of currently-visible toasts, exposes a `toast()` function any component can call to push a new notification, and a `useToast()` hook components use to read the current toast list (typically only the `<Toaster>` component reads this). It uses a tiny pub/sub pattern: the store lives outside React (so `toast()` can be called from anywhere), and `useToast()` subscribes to changes via React's `useState` + `useEffect`.

## Where It Lives in the Project
`src/hooks/use-toast.ts`

Part of the shadcn/ui toast scaffold. The actual UI rendering is done by `<Toaster />` in `src/components/ui/toaster.tsx`, which is mounted once in `src/app/layout.tsx`. Form/page components call `toast()` to trigger notifications.

## What It Produces
- A `toast({ title, description, action })` function that pushes a new toast. Returns `{ id, dismiss, update }`.
- A `useToast()` hook that returns `{ toasts, toast, dismiss }` for the `<Toaster>` component to consume.
- A maximum of 1 toast visible at a time (configurable via `TOAST_LIMIT`).
- Auto-removal of dismissed toasts after a delay (so the slide-out animation can play).

## Key Concepts
- **Custom hook + module-level state** — Unlike most hooks that use `useState` (per-component state), this hook reads from a *module-level* `memoryState` variable shared across the whole app. This lets the `toast()` function dispatch from anywhere — even outside React components — and have all subscribers re-render.
- **Pub/sub pattern** — `listeners` is an array of setState functions. `dispatch()` updates the state and calls every listener. `useToast()` pushes its `setState` into the listeners array on mount and removes it on unmount. This is a minimal version of what Redux/Zustand do.
- **Reducer pattern** — State changes are described by a discriminated union of `Action` types (`ADD_TOAST`, `UPDATE_TOAST`, `DISMISS_TOAST`, `REMOVE_TOAST`) and a pure `reducer` function. This makes state transitions predictable and testable.
- **Discriminated unions with `as const`** — `actionTypes` is declared `as const` so TypeScript infers literal string types (e.g. `"ADD_TOAST"` instead of `string`), which makes the `Action` union properly type-safe.
- **`setTimeout` for animation timing** — `addToRemoveQueue` schedules a `REMOVE_TOAST` dispatch after `TOAST_REMOVE_DELAY` ms. This gives the slide-out animation time to play before the DOM element is removed.
- **Inspired by react-hot-toast** — The shadcn scaffold borrows the API shape (imperative `toast()` function) from the popular `react-hot-toast` library, but implements it from scratch to avoid the dependency.

## Section-by-Section Breakdown
1. **Imports** — `React`, plus `ToastActionElement` and `ToastProps` types from the toast UI component.
2. **Constants** — `TOAST_LIMIT = 1` (max toasts on screen), `TOAST_REMOVE_DELAY = 1000000` (delay before fully removing a dismissed toast).
3. **`ToasterToast` type** — extends `ToastProps` with our own id/title/description/action fields.
4. **`actionTypes`** — const object of the four action type strings, declared `as const`.
5. **`genId()` function** — incrementing counter that returns string IDs, wrapping at `MAX_SAFE_INTEGER`.
6. **`Action` union type** — discriminated union of the four possible reducer actions.
7. **`State` interface** — `{ toasts: ToasterToast[] }`.
8. **`toastTimeouts` Map** — dedupes the removal queue so we don't schedule the same toast twice.
9. **`addToRemoveQueue()`** — schedules a `REMOVE_TOAST` dispatch after the delay.
10. **`reducer()` function** — pure function handling the four action types: ADD (prepend + slice), UPDATE (merge), DISMISS (set open=false + queue removal), REMOVE (filter out).
11. **Pub/sub layer** — `listeners` array + `memoryState` variable.
12. **`dispatch()` function** — runs the reducer, then notifies every listener with the new state.
13. **`Toast` type alias** — `Omit<ToasterToast, "id">` (a toast the caller wants to push, before we assign an id).
14. **`toast()` function** — generates an id, defines `update`/`dismiss` helpers, dispatches `ADD_TOAST` with an `onOpenChange` handler that calls `dismiss()` when the toast closes.
15. **`useToast()` hook** — uses `useState` to mirror `memoryState`, subscribes/unsubscribes via `useEffect`, returns `{ ...state, toast, dismiss }`.
16. **Exports** — `useToast` and `toast`.

## How It Connects to Other Files
- Imports types from `@/components/ui/toast` (the toast UI primitive).
- Exports `useToast` (consumed by `src/components/ui/toaster.tsx`) and `toast` (consumed by any component that needs to show a notification, e.g. form submissions).
- `<Toaster />` is mounted once in `src/app/layout.tsx` so toasts work on every page.

## Common Beginner Questions
**Q: Why is the state stored outside React (in `memoryState`) instead of in `useState`?**
A: If the state lived in `useState` inside a component, only that component and its descendants could update it. By storing it at module level, the `toast()` function can be called from *anywhere* — including non-component code like event handlers, async callbacks, or even utility functions — and still trigger re-renders in subscribers. This is the same pattern Zustand and Redux use.

**Q: Do I need to read every line of this file to use toasts?**
A: No. To use toasts in your component, just do:
```ts
import { toast } from "@/hooks/use-toast";
toast({ title: "Saved!", description: "Your changes are stored." });
```
The internal pub/sub mechanics are an implementation detail.

**Q: Why is `TOAST_REMOVE_DELAY` set to such a large number (1000000 ms ≈ 17 minutes)?**
A: The delay is intentionally huge so the dismissed toast stays in memory long enough for any slide-out animation to complete (typically 200–500ms). The actual removal happens when the `<Toaster>` component calls `dismiss()` after the animation, but the queue is a fallback. It's a known quirk of the shadcn scaffold.
