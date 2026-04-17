# LearningHub — Architecture Overview

## System Overview

LearningHub is a full-stack web application built with Next.js. The same repository powers both the frontend UI and the backend API routes, all deployed as a single unit on Vercel.

```
┌─────────────────────────────────────────────────────┐
│                      Browser                        │
│            (React + Tailwind CSS UI)                │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (fetch / SWR)
┌──────────────────────▼──────────────────────────────┐
│              Next.js Application (Vercel)           │
│  ┌─────────────────┐   ┌───────────────────────┐   │
│  │   Pages / App   │   │   API Routes          │   │
│  │  /pages/*.tsx   │   │  /pages/api/**/*.ts   │   │
│  └────────┬────────┘   └──────────┬────────────┘   │
│           │                       │                 │
│           └──────────┬────────────┘                 │
│                      │ Prisma Client                │
│  ┌───────────────────▼────────────────────────┐    │
│  │              lib/prisma.ts                  │    │
│  │         (singleton Prisma client)           │    │
│  └───────────────────┬────────────────────────┘    │
└──────────────────────┼──────────────────────────────┘
                       │ TCP / TLS
┌──────────────────────▼──────────────────────────────┐
│           PostgreSQL Database                       │
│         (Supabase / Neon / Railway)                 │
└─────────────────────────────────────────────────────┘
```

## Component Responsibilities

### Frontend (`/pages/`)

| File | Responsibility |
|------|---------------|
| `pages/index.tsx` | Lists all notes; links to individual notes and note creation |
| `pages/notes/[id].tsx` | Displays a single note with full content, tags, and edit/delete actions |
| `pages/notes/new.tsx` | Form to create a new note (or edit an existing one) |

### Backend API Routes (`/pages/api/`)

| Route | Methods | Responsibility |
|-------|---------|---------------|
| `/api/notes` | `GET`, `POST` | List all notes; create a new note |
| `/api/notes/[id]` | `GET`, `PUT`, `DELETE` | Get, update, or delete a specific note by ID |

All API handlers use the Prisma client (`lib/prisma.ts`) to interact with the database. Minimal input validation is applied; production usage should add stricter schema validation (e.g., Zod).

### Database (`/prisma/`)

| File | Responsibility |
|------|---------------|
| `prisma/schema.prisma` | Defines `User`, `Note`, and `Tag` models and their relations |
| `prisma/seed.ts` | Seeds the database with example users, notes, and tags |

#### Data Model Summary

```
User ─────< Note >───── Tag
            │
            └── title, content, createdAt, updatedAt
```

- A **User** has many **Notes**.
- A **Note** has many **Tags** (many-to-many).

### Authentication (`/lib/auth.ts`)

Authentication is handled via [NextAuth.js](https://next-auth.js.org/). The current implementation is a **placeholder** — the maintainer must configure a provider (email magic links, GitHub OAuth, Google OAuth, or Clerk) before auth is functional.

See `lib/auth.ts` for TODO instructions.

### Shared Libraries (`/lib/`)

| File | Responsibility |
|------|---------------|
| `lib/prisma.ts` | Singleton Prisma client (safe for Next.js hot-reload and Vercel serverless) |
| `lib/auth.ts` | NextAuth configuration skeleton + session helper utilities |

## Data Flow — Create a Note

1. User fills out the form at `/notes/new` and submits.
2. The page component calls `POST /api/notes` with `{ title, content, tags }`.
3. The API route validates the input and calls `prisma.note.create(...)`.
4. Prisma executes the SQL `INSERT` against PostgreSQL.
5. The API returns the created note as JSON.
6. The page redirects the user to `/notes/[id]`.

## Deployment

The application is deployed to **Vercel** as a standard Next.js project.

- **Build command:** `next build`
- **Output directory:** `.next`
- **Environment variables** must be set in the Vercel project dashboard (see `.env.example`).
- The PostgreSQL database must be accessible from Vercel's edge network. Recommended providers: [Supabase](https://supabase.com/), [Neon](https://neon.tech/), [Railway](https://railway.app/).

## Future Considerations

- Add Zod schema validation on API routes.
- Implement spaced-repetition reminder logic (scheduled jobs via Vercel Cron or a queue).
- Add full-text search (PostgreSQL `tsvector` or Algolia).
- Add CSV import/export for notes.
- Migrate to Next.js App Router when ready.
