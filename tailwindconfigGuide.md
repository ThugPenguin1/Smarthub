# Guide: tailwind.config.ts

## What is this file?
`tailwind.config.ts` is the **configuration file for Tailwind CSS** — the styling framework this project uses. It tells Tailwind which files to scan for class names, what colors/fonts/themes to use, and what plugins to load.

**Important**: This project uses Tailwind CSS v4, which is configured differently from v3. In v4, most configuration happens in `globals.css` using the `@theme` directive. This file is kept for backward compatibility and plugin loading.

## What does each section do?

### `darkMode: "class"`
Tells Tailwind to enable dark mode by adding a `dark` class to the `<html>` element (rather than using the browser's `prefers-color-scheme`). This lets you manually toggle dark mode via JavaScript.

### `content: [...]`
```typescript
content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
]
```
Tells Tailwind: "scan all `.js`, `.ts`, `.jsx`, `.tsx`, `.mdx` files in `pages/`, `components/`, and `app/` folders for class names." Tailwind only generates CSS for classes it finds in these files. If you use a class but it's not in a scanned file, the CSS won't be generated.

### `theme.extend.colors`
Maps color names (like `background`, `primary`, `card`) to CSS variables (like `hsl(var(--background))`). This is how the brand palette from `globals.css` connects to Tailwind classes like `bg-primary`, `text-foreground`, `border-border`.

Example: when you write `className="bg-primary"`, Tailwind looks up `primary` in this config, finds `hsl(var(--primary))`, and generates `background-color: hsl(var(--primary))`. The actual color value is set in `globals.css` as `--primary: #0d9488`.

### `theme.extend.borderRadius`
Maps radius names to CSS variables. `rounded-lg` → `var(--radius)`, `rounded-md` → `calc(var(--radius) - 2px)`, etc.

### `plugins: [tailwindcssAnimate]`
Loads the `tailwindcss-animate` plugin, which adds animation utilities like `animate-ping`, `animate-pulse`, `animate-bounce`. Used by the WhatsApp float button's pulse ring.

## How colors work (the full chain)
1. **`globals.css`** defines `:root { --primary: #0d9488; }` (the actual teal color)
2. **`tailwind.config.ts`** maps `primary` → `hsl(var(--primary))` (tells Tailwind to use the CSS variable)
3. **In your components** you write `className="bg-primary"` (uses the Tailwind class)
4. **Tailwind generates**: `.bg-primary { background-color: hsl(var(--primary)); }`
5. **Browser resolves**: `hsl(var(--primary))` → `hsl(#0d9488)` → the teal color

This chain means you can change the brand color in ONE place (`globals.css`) and it updates everywhere.

## When would you edit this file?
- **Adding a new color**: Add it to `theme.extend.colors` mapping to a CSS variable, then define the variable in `globals.css`
- **Adding a plugin**: `bun add <plugin-name>` then add it to the `plugins` array
- **Changing which files are scanned**: Add/remove paths in `content`

**Most of the time you don't need to touch this file.** Color changes go in `globals.css`.

## Common beginner questions

**Q: I changed a color in globals.css but it didn't update. Why?**
A: Make sure the color is mapped in `tailwind.config.ts` under `theme.extend.colors`. If you use `bg-mynewcolor` but `mynewcolor` isn't in the config, Tailwind won't generate the CSS.

**Q: Why are colors defined as CSS variables instead of directly in this config?**
A: Because CSS variables enable dark mode and runtime theming. You can override `--primary` in a `.dark` class and the entire site updates. If colors were hardcoded in this config, you'd need to rebuild for dark mode.

**Q: What's the difference between this file and globals.css?**
A: `tailwind.config.ts` tells Tailwind WHAT class names exist and WHERE to scan for them. `globals.css` defines the actual color VALUES and visual styles. In Tailwind v4, most config moved to `globals.css` via `@theme` — this file is mainly for the content paths and plugins.
