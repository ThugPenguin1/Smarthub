# Guide: tsconfig.json

## What is this file?
`tsconfig.json` is the **TypeScript configuration file**. It tells the TypeScript compiler how to check your code, what JavaScript version to target, and where to find your source files. Every TypeScript project has one.

## What does each setting do?

### `compilerOptions` (the main settings)

| Setting | Value | What it does |
|---|---|---|
| `target` | `"ES2017"` | What JavaScript version to compile down to. ES2017 is widely supported by all modern browsers. |
| `lib` | `["dom", "dom.iterable", "esnext"]` | Which type definitions to include. `dom` = browser APIs (document, window, etc.), `esnext` = latest JS features. |
| `allowJs` | `true` | Allow `.js` files in the project (not just `.ts`). Useful if you have older JS files. |
| `skipLibCheck` | `true` | Skip type-checking of `.d.ts` files in node_modules. Speeds up compilation. |
| `strict` | `true` | Enable all strict type-checking rules. Catches more bugs but is stricter. |
| `noEmit` | `true` | Don't output `.js` files. Next.js/Bun handles compilation separately; TypeScript is only used for type-checking. |
| `noImplicitAny` | `false` | Allow variables to have implicit `any` type (less strict than full strict mode). |
| `esModuleInterop` | `true` | Allow `import x from "y"` syntax (instead of `import * as x`). Required for most npm packages. |
| `module` | `"esnext"` | Use modern ES module syntax (import/export). |
| `moduleResolution` | `"bundler"` | How to resolve import paths. "bundler" is the modern setting for projects using bundlers (Next.js, Vite, etc.). |
| `resolveJsonModule` | `true` | Allow importing `.json` files (e.g. `import data from "./data.json"`). |
| `isolatedModules` | `true` | Each file must be independently compilable. Required by Next.js for fast builds. |
| `jsx` | `"react-jsx"` | How to handle JSX. "react-jsx" is the modern setting (doesn't require importing React in every file). |
| `incremental` | `true` | Speed up subsequent builds by caching type information in `.tsbuildinfo` file. |
| `plugins: [{ name: "next" }]` | | Load the Next.js TypeScript plugin for additional type-checking (e.g. route types). |

### `paths`
```json
"paths": {
  "@/*": ["./src/*"]
}
```
This is the **path alias**. It means whenever you write `import { something } from "@/lib/utils"`, TypeScript resolves it to `./src/lib/utils`. The `@` is a shortcut for `src/`. Without this, you'd have to write relative paths like `../../lib/utils` which is fragile when you move files.

### `include`
```json
"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"]
```
Which files TypeScript should type-check. All `.ts` and `.tsx` files in the project, plus Next.js generated type files.

### `exclude`
```json
"exclude": ["node_modules"]
```
Don't type-check anything in `node_modules`.

## When would you edit this file?
**Rarely.** The only common reason is to add a new path alias (e.g. `"@components/*": ["./src/components/*"]`). The settings are standard for Next.js projects.

## Common beginner questions

**Q: What does `@/` mean in import paths?**
A: It's a shortcut for `src/`. So `@/lib/utils` = `src/lib/utils`. This is defined by the `paths` setting in this file. It makes imports cleaner and more stable when you move files around.

**Q: What's the difference between `strict: true` and `noImplicitAny: false`?**
A: `strict: true` turns on all strict checks. `noImplicitAny: false` relaxes ONE specific check (allowing implicit `any` types). This is a middle ground — strict on most things, but allows some flexibility.

**Q: Why is `noEmit: true`?**
A: Because TypeScript is only used for type-checking here. Next.js/Bun compiles your TypeScript to JavaScript using their own tools (which are faster). TypeScript's compiler doesn't need to output files.
