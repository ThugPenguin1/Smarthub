# Guide: postcss.config.mjs

## What is this file?
`postcss.config.mjs` is the **PostCSS configuration file**. PostCSS is a tool that transforms your CSS after you write it. In this project, its only job is to run Tailwind CSS's PostCSS plugin, which converts Tailwind classes (`bg-primary`, `text-teal-600`, etc.) into real CSS.

## What's in it?
```javascript
const config = {
  plugins: ["@tailwindcss/postcss"],
};
export default config;
```

That's it — 4 lines. It tells PostCSS: "run the `@tailwindcss/postcss` plugin on all CSS files."

## How it works (the chain)
1. You write `className="bg-primary text-white"` in your React components
2. Tailwind scans your files and finds these class names
3. PostCSS (configured by this file) runs the Tailwind plugin
4. The Tailwind plugin generates CSS rules: `.bg-primary { background-color: hsl(var(--primary)); }`
5. The generated CSS is bundled into the final stylesheet that the browser loads

## Why `.mjs` extension?
The `.mjs` extension means "ES module JavaScript." It uses `import/export` syntax instead of the older `module.exports` (CommonJS). Next.js prefers ES modules.

## When would you edit this file?
**Almost never.** The only reason to edit it is to add another PostCSS plugin, like:
- `autoprefixer` (adds vendor prefixes like `-webkit-` — but Tailwind v4 handles this internally)
- `cssnano` (minifies CSS for production)
- `postcss-preset-env` (lets you use future CSS features today)

For this project, you don't need any of those. Tailwind v4 handles everything.

## Common beginner questions

**Q: Do I need to run PostCSS manually?**
A: No. Next.js runs it automatically every time you build or start the dev server. You just write CSS/Tailwind classes and PostCSS handles the rest.

**Q: What happens if I delete this file?**
A: Tailwind classes will stop working. The `bg-primary`, `text-white`, `rounded-xl` etc. classes won't generate any CSS, and your site will look completely unstyled.

**Q: What's the difference between PostCSS and Tailwind?**
A: PostCSS is the engine that transforms CSS. Tailwind is a PostCSS plugin that generates utility classes. PostCSS is the car, Tailwind is the engine inside it.
