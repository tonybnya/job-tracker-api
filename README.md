# Job Tracker API

REST API for tracking job applications. Express 5 + Prisma 7 + SQLite.

## Quick Start

```bash
npm install
npm run dev          # http://localhost:3000
```

## Setup

```bash
# Seed database (10 users, 50 jobs, password "password123" for all)
npx prisma db seed
```

## Docs

- **Interactive**: http://localhost:3000/api-docs (Swagger UI)
- **Testing guide**: `API_TESTING.md`

## API Overview

| Prefix | Auth | Description |
|---|---|---|
| `/api/v1/auth` | No | Register, login |
| `/api/v1/jobs` | Bearer JWT | CRUD, filter, sort, paginate, stats |

All responses use `{ success: true, data }` / `{ success: false, error }`.

## Stack

Express 5, Prisma 7 (SQLite + better-sqlite3), Zod 4, JWT, bcryptjs.
