# File: utils.ts

## What This File Does

A tiny utility file that exports a single function `cn()` (short for "classNames"). It's the standard helper used by every shadcn/ui component to merge Tailwind CSS class names intelligently — it combines multiple class name strings/arrays/conditional objects into a single string (via `clsx`) and resolves Tailwind conflicts so the last class wins (via `tailwind-merge`). Without it, `<button className="px-4 px-6">` would result in unpredictable behavior because both classes would apply; `cn()` keeps only `px-6`.

## Where It Lives in the Project

```
/home/z/my-project/src/lib/utils.ts
```

## What It Produces

- `cn()` function — merges class names with Tailwind conflict resolution

## Key Concepts

- **`clsx`** — A tiny library for combining class names. Accepts strings, arrays, objects (keys with truthy values are included), and nested combinations. Example: `clsx("a", false && "b", { c: true, d: false })` → `"a c"`.
- **`tailwind-merge`** — A Tailwind-aware class merger. Recognises that two classes like `px-4` and `px-6` target the same property and keeps only the LAST one. Also understands responsive prefixes (`md:px-4`) and variant prefixes (`hover:bg-red-500`).
- **Why both are needed** — `clsx` handles conditional logic ("include this class if true"); `twMerge` handles conflict resolution ("if two classes set padding, keep the last one"). Combining them gives you a function that handles both concerns.
- **shadcn/ui convention** — Every shadcn/ui component (`src/components/ui/*`) imports `cn` from `@/lib/utils`. This is the standard glue that lets you pass a `className` prop to override component styles.

## Section-by-Section Breakdown

### 1. Imports (lines 1–2)
- `clsx` + its `ClassValue` type — for combining class names with conditional logic
- `twMerge` from `tailwind-merge` — for resolving Tailwind utility conflicts

### 2. `cn` function (lines 4–6)
- Accepts `...inputs: ClassValue[]` — any number of class name arguments (strings, arrays, objects with boolean values, etc.)
- First calls `clsx(inputs)` to flatten and apply conditional logic into a single string
- Then calls `twMerge()` on that string to resolve Tailwind conflicts (last class wins)
- Returns the final merged class string

Example:
```ts
cn("px-4 py-2", isLarge && "px-8", condition ? "bg-red-500" : "bg-blue-500")
// -> "py-2 px-8 bg-blue-500"  (note px-4 was overridden by px-8)
```

## How It Connects to Other Files

**Imports from:**
- `clsx` (npm package)
- `tailwind-merge` (npm package)

**Exports:**
- `cn` (function)

**Imported by:**
- Every shadcn/ui component in `src/components/ui/` (Button, Card, Input, Dialog, etc.) — used to merge the component's internal classes with any `className` prop the consumer passes in
- Many block/section components in `src/components/blocks/` and `src/components/sections/`
- Various page components

## Common Beginner Questions

**Q: Why not just use template strings like `` `base-class ${isActive ? "active" : ""}` ``?**
A: That works for simple cases but becomes painful with many conditions and conflicts. `cn()` handles arrays, objects, and Tailwind conflict resolution in one shot. It's also the standard pattern for shadcn/ui, so adopting it keeps your code consistent with the rest of the ecosystem.

**Q: What's the difference between `clsx` and `tailwind-merge`?**
A: `clsx` handles conditional logic ("include this class if true") and array/object flattening. `tailwind-merge` handles Tailwind conflict resolution ("if `px-4` and `px-6` are both set, keep only the last"). They solve different problems; `cn()` combines them.

**Q: Why is this in `src/lib/utils.ts` instead of inside each component?**
A: It's shared infrastructure. Defining it once and importing it everywhere keeps the bundle small (only one copy) and lets you change the behavior in one place if needed (e.g. to add a custom Tailwind preset to `twMerge`).
