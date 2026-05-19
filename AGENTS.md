# sc200

Server-rendered Next.js app — practice quiz for **Microsoft SC-200: Security Operations Analyst Associate** (exam updated April 16, 2026).

Backend: Prisma + Vercel Postgres. Auth: Auth.js (NextAuth v5) with email/password credentials.

## Project structure

```
src/
  app/              # Next.js App Router pages
    layout.tsx      # root layout — Geist fonts, dark-mode, AuthProvider, UserMenu
    page.tsx        # home / quiz launcher
    quiz/           # quiz-taking page
    study/          # browse all questions
    review/         # review missed questions
    bookmarks/      # starred questions
    flagged/        # flagged questions
    search/         # keyword search
    analysis/       # per-question accuracy & score trends
    results/        # past quiz results
    signin/         # sign-in page (email + password)
    signup/         # sign-up page (email + password + confirm)
    api/
      sync/         # single CRUD endpoint for all user state
      auth/
        [...nextauth]/  # Auth.js route handler
        signup/         # account creation endpoint
  components/
    AuthProvider.tsx    # SessionProvider wrapper
    UserMenu.tsx        # user avatar / sign-in / sign-out dropdown
    SyncProvider.tsx    # hydrates localStorage from DB on mount
    ProgressBar.tsx
    QuestionCard.tsx
    Skeleton.tsx
    TopicBadge.tsx
  lib/
    auth.ts           # Auth.js config (Credentials provider, JWT)
    db.ts             # PrismaClient singleton
    storage.ts        # localStorage CRUD + fire-and-forget API sync
    questions.json    # 150 questions across 3 exam functional groups
    study-notes.json  # 3 topics, 9 sections covering the official study guide
    types.ts          # Question, QuizRecord interfaces
    random.ts         # seeded PRNG + Fisher-Yates shuffle
    linkify.tsx       # URL linkifier component
    topics.ts         # Topic labels and colors
prisma/
  schema.prisma       # 10 models: User + 9 data models
```

## Architecture

- **Server-rendered** (Next.js App Router, no static export)
- **Database**: Prisma Postgres via `@prisma/adapter-pg`
- **Auth**: Auth.js v5 with Credentials provider — email/password stored in DB (bcryptjs)
- **API**: Single `/api/sync` endpoint handles all user state (bookmarks, flags, quiz history, attempts, study progress)
- **Client**: localStorage for instant sync + fire-and-forget POST to `/api/sync`; `SyncProvider` hydrates from DB on mount
- **Data model**: All records keyed by `userId` — anonymous users use a generated deviceId UUID; authenticated users use their real userId; migration happens automatically on first API call after login
- **Dark mode** via `localStorage("sc200-dark")` + `.dark` class; CSS overrides in `globals.css`
- **Daily quiz** uses `dateSeed()` for deterministic per-day question shuffle
- **Quiz history** capped at 50 records per user

## Commands (run from app root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on `0.0.0.0` |
| `npm run build` | Server build |
| `npm run lint` | ESLint |
| `npx prisma db push` | Sync schema to Postgres |
| `npx prisma generate` | Regenerate Prisma client |

## Topics

| Slug | Label | Weight | Sections |
|------|-------|--------|---------|
| `manage-soc` | Manage a Security Operations Environment | 40-45% | 4 sections |
| `respond-incidents` | Respond to Security Incidents | 35-40% | 3 sections |
| `threat-hunting` | Perform Threat Hunting | 20-25% | 2 sections |

## Conventions

- Import `@/lib/...` and `@/components/...` (not relative paths)
- Topics are slug keys: `manage-soc`, `respond-incidents`, `threat-hunting`
- All localStorage keys prefixed `sc200-`
- Question IDs are numeric, 1-indexed
- COUNT_OPTIONS: `[5, 10, 15, 20, 25, 30, 50, 150]` (150 = all)
- Custom dark overrides in `globals.css` supplement Tailwind `dark:` variant
- Auth sessions via JWT (no DB sessions); `AUTH_SECRET` env var required
- User data automatically migrates from anonymous deviceId on first sign-in
