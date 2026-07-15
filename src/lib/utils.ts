/**
 * CLASS NAME MERGER — `cn()` helper
 * =================================================================
 * WHAT THIS FILE IS:
 *   A tiny utility that exports a single function `cn()` (short for
 *   "classNames"). It's the standard helper used by every shadcn/ui
 *   component to merge Tailwind CSS class names intelligently.
 *
 * WHAT IT DOES:
 *   - Combines multiple class name strings / arrays / conditional objects
 *     into a single string (via `clsx`)
 *   - Resolves Tailwind conflicts so later classes win (via `tailwind-merge`)
 *
 * WHY THIS IS NEEDED:
 *   Without `cn()`, writing `<button className="px-4 px-6">` would result
 *   in BOTH classes being applied, and whichever CSS rule was defined
 *   last in the stylesheet would win — unpredictable. `cn()` recognises
 *   that `px-4` and `px-6` are conflicting Tailwind utilities and keeps
 *   only the LAST one (`px-6`), giving predictable override behavior.
 *
 *   It also supports conditional classes:
 *     cn("base-class", isActive && "active-class", { "disabled": !enabled })
 *
 * HOW IT FITS IN THE BIGGER PICTURE:
 *   Every shadcn/ui component (Button, Card, Input, Dialog, etc. in
 *   `src/components/ui/`) imports `cn` from here. It's the standard
 *   glue that lets you pass a `className` prop to override component
 *   styles without conflicts.
 * =================================================================
 */

// `clsx` — combines class names. Supports strings, arrays, objects
// (keys with truthy values are included), and nested combinations.
import { clsx, type ClassValue } from "clsx"

// `twMerge` — Tailwind-aware class merger. Recognises that two classes
// like `px-4` and `px-6` target the same property and keeps only the
// last one. Also understands responsive prefixes (md:px-4) and
// variant prefixes (hover:bg-red-500).
import { twMerge } from "tailwind-merge"

/**
 * cn — merge class names with Tailwind conflict resolution.
 *
 * Inputs:
 *   `...inputs` — any number of ClassValue arguments. Each can be a
 *   string, number, null, undefined, boolean, array, or object
 *   (object keys with truthy values are included). This is the same
 *   input shape `clsx` accepts.
 *
 * Returns:
 *   A single string of merged class names with Tailwind conflicts
 *   resolved (last one wins).
 *
 * Example:
 *   cn("px-4 py-2", isLarge && "px-8", condition ? "bg-red-500" : "bg-blue-500")
 *   // -> "py-2 px-8 bg-blue-500"  (note px-4 was overridden by px-8)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
