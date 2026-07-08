# AGENTS.md

## Stack
Express 5 + Prisma 7 (SQLite via better-sqlite3 adapter) + Zod 4 + JWT + bcryptjs. CommonJS.

## Commands
- `npm run dev` — start dev server with nodemon on port 3000

## Database
- SQLite via Prisma 7. Schema at `prisma/schema.prisma`.
- Prisma 7 requires a driver adapter. SQLite uses `@prisma/adapter-better-sqlite3` — see `config/prisma.js`.
- Prisma config in `prisma.config.js` (ESM — `defineConfig` + imports `DATABASE_URL` from `.env`).
- After schema changes: `npx prisma generate && npx prisma migrate dev --name <name>`.
- `dev.db` is gitignored.

## Architecture
```
app.js → routes/ → controllers/ → prisma → SQLite
         middleware/: authMiddleware (JWT), validateMiddleware (Zod)
         validators/: appSchemas.js (Zod schemas)
```
- API base: `/api/v1/auth` and `/api/v1/jobs`
- Auth: Bearer token in `Authorization` header, validated by `authenticateToken`
- Validation: `validateBody(schema)` middleware sets `req.validatedBody`

## Conventions
- File header: `Script Name`, `Description`, `Usage`, `Author: @tonybnya`
- Named exports in CommonJS (`module.exports = { ... }`)
- Routes and controllers split per resource (`auth`, `jobs`)

## Known state
- Routes are empty stubs. Auth + job controllers exist but are not wired to routes.
- Validators and controllers have syntax bugs (see `validators/appSchemas.js`, `controllers/jobController.js`).
- No tests, no linter, no CI.

## Gotchas
- Prisma 7 drops the `datasources` constructor option — do not pass it to `new PrismaClient()`.
- `prisma-client-js` generator no longer supports `engineType` — use driver adapters instead.
- No `url` in schema's `datasource db` block — Prisma 7 reads it from `prisma.config.js`.
