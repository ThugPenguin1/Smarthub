# Guide: package.json

## What is this file?
`package.json` is the **manifest file for the project**. It lists:
- Project name and version
- Available npm/bun scripts (commands you can run)
- All npm dependencies (packages the project needs)
- Dev dependencies (packages only needed during development)

Every Node.js/Next.js project has one. It's the most important config file.

## The 3 main sections

### 1. `scripts` — commands you can run
```json
"scripts": {
  "dev": "next dev -p 3000 2>&1 | tee dev.log",
  "build": "next build && cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/",
  "start": "NODE_ENV=production bun .next/standalone/server.js 2>&1 | tee server.log",
  "lint": "eslint .",
  "db:push": "prisma db push",
  "db:generate": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "db:reset": "prisma migrate reset"
}
```

| Command | What it does |
|---|---|
| `bun run dev` | Starts the dev server on port 3000. This is what runs in the preview panel. |
| `bun run build` | Builds the production version. Creates `.next/standalone/` folder. |
| `bun run start` | Runs the production build. Used after `bun run build`. |
| `bun run lint` | Runs ESLint to check code quality. Run this before committing. |
| `bun run db:push` | Pushes Prisma schema to the database. Used when you change `schema.prisma`. |
| `bun run db:generate` | Generates the Prisma Client (TypeScript types for your database). |
| `bun run db:migrate` | Creates a database migration (records schema changes). |
| `bun run db:reset` | Resets the database (DESTRUCTIVE — deletes all data). |

### 2. `dependencies` — packages needed to run
These are installed in `node_modules/` and are required for the app to work. Key ones:

| Package | What it does |
|---|---|
| `next` (^16.1.1) | The Next.js framework — routing, SSR, image optimization, etc. |
| `react` / `react-dom` (^19.0.0) | The React UI library. |
| `@fontsource-variable/plus-jakarta-sans` | Self-hosted display font (headings). |
| `@fontsource-variable/dm-sans` | Self-hosted body font. |
| `lucide-react` | Icon library (all the icons you see in the UI). |
| `@radix-ui/react-*` | 30+ Radix UI primitives — the unstyled accessible components that shadcn/ui is built on. |
| `tailwind-merge` | Smart merging of Tailwind classes (used by the `cn()` helper). |
| `class-variance-authority` | For creating variant-based component styles (used by shadcn/ui Button). |
| `prisma` / `@prisma/client` | Database ORM (currently unused but available). |
| `framer-motion` | Animation library (available but not heavily used). |
| `next-intl` | Internationalization library (available but we built our own simpler system). |
| `next-themes` | Dark mode toggle (available but not currently used). |

### 3. `devDependencies` — packages for development only
These are NOT included in the production build. They include:
- `typescript` — the TypeScript compiler
- `eslint` + `eslint-config-next` — code linting
- `tailwindcss` + `@tailwindcss/postcss` — CSS framework
- `@types/react` / `@types/node` — TypeScript type definitions

## When would you edit this file?

### To add a new package:
```bash
bun add <package-name>           # adds to dependencies
bun add -d <package-name>        # adds to devDependencies
```
This automatically updates `package.json` and installs the package.

### To add a new script:
Edit the `scripts` section directly. Example:
```json
"scripts": {
  ...
  "format": "prettier --write ."
}
```
Then run it with `bun run format`.

## Common beginner questions

**Q: What's the difference between dependencies and devDependencies?**
A: `dependencies` are needed at runtime (when the app runs). `devDependencies` are only needed during development (linting, type-checking, building). Production builds exclude devDependencies to save space.

**Q: What do the `^` and `~` prefixes mean?**
A: `^16.1.1` means "any 16.x.x version" (allows minor updates). `~16.1.1` means "any 16.1.x version" (allows patch updates only). This is called semver (semantic versioning).

**Q: What is `bun.lock`?**
A: It's the lockfile. It records the EXACT version of every package installed. This ensures everyone who clones the project gets the same versions. Never edit this file manually.

**Q: How do I update packages?**
A: `bun update <package-name>` updates one package. `bun update` updates all packages. Be careful — major version updates can break things.
