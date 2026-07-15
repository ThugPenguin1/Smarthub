/**
 * PRISMA DATABASE CLIENT (SCAFFOLD — currently unused)
 * =================================================================
 * WHAT THIS FILE IS:
 *   A standard Prisma client setup file. Prisma is an Object-Relational
 *   Mapper (ORM) for Node.js — it lets you talk to a database (Postgres,
 *   MySQL, SQLite, MongoDB, etc.) using TypeScript objects instead of
 *   raw SQL strings.
 *
 * WHAT IT DOES:
 *   - Creates a single shared `PrismaClient` instance and exports it as
 *     `db`
 *   - In development mode, caches that instance on the `globalThis`
 *     object so Next.js hot-reload doesn't spawn dozens of duplicate
 *     Prisma clients (each of which keeps a connection pool open)
 *   - Enables query logging in dev mode so you can see SQL in the console
 *
 * HOW IT FITS IN THE BIGGER PICTURE:
 *   ⚠️ This file is a SCAFFOLD. The current marketing site doesn't use a
 *   database — it's a static site backed by translation files. This
 *   file exists because the project was scaffolded with shadcn/ui's
 *   starter template, which includes Prisma by default. It's kept
 *   around in case the site later needs to store form submissions,
 *   newsletter signups, or contact enquiries in a database.
 *
 *   The Prisma schema lives at `prisma/schema.prisma` and a SQLite
 *   database file is at `db/custom.db` — but neither is currently
 *   read or written by any page.
 *
 *   If you want to use it:
 *     1. Define your models in `prisma/schema.prisma`
 *     2. Run `npx prisma generate` to regenerate the client
 *     3. Import `db` wherever you need it: `import { db } from "@/lib/db"`
 *
 *   To remove it (if never needed):
 *     - Delete this file
 *     - Delete `prisma/` folder and `db/` folder
 *     - Remove `@prisma/client` from package.json
 * =================================================================
 */

// PrismaClient is the auto-generated class that knows how to talk to
// your specific database based on `prisma/schema.prisma`.
import { PrismaClient } from '@prisma/client'

/**
 * `globalForPrisma` — a typed view of Node's global object that lets us
 * stash the PrismaClient instance across hot-reloads.
 *
 * Why do we need this? In development, Next.js re-imports modules on
 * every file change. Each import would normally create a NEW
 * PrismaClient, and each PrismaClient opens a pool of database
 * connections. After a few edits you'd exhaust your connection limit.
 *
 * The fix: store the instance on `globalThis` (which persists across
 * hot-reloads) and reuse it. In production we don't need this trick
 * because the module is only loaded once.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * `db` — the shared Prisma client.
 *
 * - `globalForPrisma.prisma ?? new PrismaClient(...)` means:
 *   "use the existing instance if it exists, otherwise create one"
 * - `log: ['query']` prints every SQL query to the console in dev
 *   mode (helpful for debugging)
 *
 * This is the only export. Components and API routes that need DB
 * access import it like: `import { db } from "@/lib/db"`.
 */
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

/**
 * Cache the instance on `globalThis` ONLY in non-production
 * environments. In production, the module loads once and there's no
 * hot-reload to worry about.
 */
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
