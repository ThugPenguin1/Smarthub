# Guide: eslint.config.mjs

## What is this file?
`eslint.config.mjs` is the **ESLint configuration file**. ESLint is a code linter — it checks your code for common mistakes, bad practices, and style issues. You run it with `bun run lint`.

## What's in it?

### Imports (lines 1–6)
```javascript
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
```
Imports Next.js's recommended ESLint rules. `core-web-vitals` includes rules for performance and best practices. `typescript` adds TypeScript-specific rules.

### The config array
ESLint v9 uses an array of config objects (the "flat config" format). This file exports an array with 2 objects:

### Config object 1: rules (the big one)
```javascript
{
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/no-unescaped-entities": "off",
    "@next/next/no-img-element": "off",
    "prefer-const": "off",
    "no-console": "off",
    // ... many more
  }
}
```

Almost every rule is turned **OFF**. This is a very permissive configuration. Here's what the key ones mean:

| Rule | What it normally catches | Why it's off |
|---|---|---|
| `@typescript-eslint/no-explicit-any` | Using `any` type | This project uses `any` in some places for flexibility |
| `@typescript-eslint/no-unused-vars` | Variables declared but never used | Common during development; would be annoying |
| `react-hooks/exhaustive-deps` | Missing dependencies in useEffect | This rule flagged our lazy useState initializer pattern |
| `react/no-unescaped-entities` | Apostrophes/quotes in JSX | Would require escaping "it's" → "it&apos;s" which is annoying |
| `@next/next/no-img-element` | Using `<img>` instead of `<Image>` | Some places use plain `<img>` (like SVGs) |
| `prefer-const` | Using `let` when `const` would work | Permissive |
| `no-console` | `console.log()` statements | Useful during development |

### Config object 2: ignores
```javascript
{
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "examples/**", "skills"]
}
```
Tells ESLint to skip these folders entirely. `node_modules`, `.next`, `build` are generated files. `examples/` and `skills/` are scaffold folders not part of the actual project.

## When would you edit this file?
- **To turn a rule ON**: Change `"off"` to `"warn"` (yellow squiggly) or `"error"` (red squiggly, fails lint)
- **To turn a rule OFF**: Change `"error"` or `"warn"` to `"off"`
- **To add a new rule**: Add it to the `rules` object

Example: to catch unused variables:
```javascript
"@typescript-eslint/no-unused-vars": "warn",
```

## Common beginner questions

**Q: I got an ESLint error. What do I do?**
A: Run `bun run lint` to see all errors. Each error tells you the file, line number, and what rule was violated. Either fix the code or turn off the rule in this file.

**Q: Why are so many rules turned off?**
A: This project was built for rapid development. Strict linting slows you down when you're iterating fast. For a production project, you'd want to turn more rules ON to catch bugs.

**Q: What's the difference between "warn" and "error"?**
A: `"warn"` shows a yellow warning but doesn't fail the lint command. `"error"` shows a red error and makes `bun run lint` exit with a non-zero status (which would fail a CI/CD pipeline).
