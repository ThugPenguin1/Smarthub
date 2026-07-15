# File: db.ts

## What This File Does

This is a **standard Prisma client setup file** — but it's currently a **scaffold that is NOT used** anywhere in the marketing site. Prisma is an Object-Relational Mapper (ORM) that lets you talk to a database using TypeScript objects instead of raw SQL. This file creates a single shared `PrismaClient` instance, caches it on `globalThis` to survive Next.js hot-reloads in development, and exports it as `db`. The current site is static (no database) — this file is kept in case the project later needs to store form submissions, newsletter signups, or contact enquiries.

## Where It Lives in the Project

```
/home/z/my-project/src/lib/db.ts
```

## What It Produces

- `db` — a shared Prisma client instance (currently unused by any page or API route)
- Logs every SQL query to the console in development mode

## Key Concepts

- **Prisma** — A TypeScript-friendly ORM. You define your database schema in `prisma/schema.prisma`, run `npx prisma generate`, and Prisma creates a strongly-typed client that lets you do `db.user.findMany()` instead of writing SQL.
- **PrismaClient** — The auto-generated class that knows how to talk to your specific database (Postgres, MySQL, SQLite, MongoDB, etc.) based on the schema file.
- **`globalThis` caching** — A common Next.js pattern. In development, Next.js re-imports modules on every file change. Each import would normally create a NEW PrismaClient (each opens its own connection pool). Stashing the instance on `globalThis` (which persists across hot-reloads) prevents connection exhaustion. In production the module loads once so this trick isn't needed.
- **ORM (Object-Relational Mapper)** — A library that maps database tables to TypeScript/JavaScript objects, so you can write `db.user.create({...})` instead of `INSERT INTO users ...`.
- **`log: ['query']`** — Prisma option that prints every SQL query to the console. Useful for debugging in dev, noisy in production.

## Section-by-Section Breakdown

### 1. Import (line 1)
Imports `PrismaClient` from `@prisma/client` — the auto-generated client class.

### 2. `globalForPrisma` (lines 3–5)
A typed view of Node's `globalThis` object. We cast it to a shape that includes an optional `prisma` property so TypeScript lets us read/write that property. This lets us stash the PrismaClient instance across hot-reloads.

### 3. `db` export (lines 7–11)
The shared Prisma client. Uses the nullish coalescing operator `??` to mean "use the existing instance if it exists, otherwise create one". The `log: ['query']` option prints every SQL query to the console (useful in dev).

### 4. Global caching guard (line 13)
In non-production environments, caches the instance on `globalThis` so hot-reloads reuse it instead of spawning duplicates. In production the module loads once, so this guard isn't needed.

## How It Connects to Other Files

**Imports from:**
- `@prisma/client` — `PrismaClient` (auto-generated from `prisma/schema.prisma`)

**Exports:**
- `db` — the shared Prisma client

**Imported by:**
- ⚠️ **Currently NOT imported by any file in the project.** This is a scaffold.

**Related files:**
- `prisma/schema.prisma` — the Prisma schema (defines database models)
- `db/custom.db` — a SQLite database file (unused by the live site)

## Common Beginner Questions

**Q: Is this file actually doing anything right now?**
A: No. It's a scaffold — no page or API route imports `db`. The marketing site is currently static. The file exists because the project was scaffolded with a template that includes Prisma.

**Q: What would I need to do to actually use it?**
A: 1) Define your models in `prisma/schema.prisma`. 2) Run `npx prisma generate` to regenerate the client. 3) Import `db` wherever you need it: `import { db } from "@/lib/db"`. 4) If using SQLite (the default in the scaffold), the `db/custom.db` file will be created/updated.

**Q: Why is `globalThis` caching only done in non-production?**
A: In production, Next.js bundles modules and loads them once per server process — there's no hot-reload to worry about. In development, every file change triggers a re-import, which would create duplicate Prisma clients and exhaust your database connection pool. The `globalThis` cache prevents that.
