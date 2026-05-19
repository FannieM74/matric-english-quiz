# Matric English Quiz

Server-rendered Next.js app — practice quiz for **South African Grade 12 English Home Language** final exams.

Backend: Prisma + Postgres. Auth: Auth.js (NextAuth v5) with email/password credentials.

## Project structure

```
src/
  app/              # Next.js App Router pages
    layout.tsx      # root layout — Geist fonts, dark-mode, AuthProvider, UserMenu
    page.tsx        # home / quiz launcher
    quiz/           # quiz-taking page
    study/          # browse all sections (exam tips)
    review/         # review missed questions
    bookmarks/      # starred questions
    flagged/        # flagged questions
    search/         # keyword search
    analysis/       # per-section accuracy & score trends
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
    questions.json    # 153 questions across 3 exam papers
    study-notes.json  # 3 papers, exam tips and study guides
    types.ts          # Question, QuizRecord interfaces
    random.ts         # seeded PRNG + Fisher-Yates shuffle
    linkify.tsx       # URL linkifier component
    topics.ts         # Paper labels, sections, and colors
prisma/
  schema.prisma       # 10 models: User + 9 data models
```

## Architecture

- **Server-rendered** (Next.js App Router, no static export)
- **Database**: Prisma Postgres via `@prisma/adapter-pg`
- **Auth**: Auth.js v5 with Credentials provider — email/password stored in DB (bcryptjs)
- **API**: Single `/api/sync` endpoint handles all user state (bookmarks, flags, quiz history, attempts, study progress)
- **Client**: localStorage for instant sync + fire-and-forget POST to `/api/sync`; `SyncProvider` hydrates from DB on mount
- **Data model**: All records keyed by `userId`; authenticated users use their real userId
- **Dark mode** via `localStorage("meq-dark")` + `.dark` class; CSS overrides in `globals.css`
- **Quiz history** capped at 50 records per user

## Commands (run from app root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on `0.0.0.0` |
| `npm run build` | Server build |
| `npm run lint` | ESLint |
| `npx prisma db push` | Sync schema to Postgres |
| `npx prisma generate` | Regenerate Prisma client |

## Topics (Papers)

| Slug | Label | Sections |
|------|-------|----------|
| `paper-1` | Paper 1: Language in Context | 5 sections |
| `paper-2` | Paper 2: Literature | 18 sections |
| `paper-3` | Paper 3: Writing | 3 sections |

## Conventions

- Import `@/lib/...` and `@/components/...` (not relative paths)
- Topics are slug keys: `paper-1`, `paper-2`, `paper-3`
- All localStorage keys prefixed `meq-`
- Question IDs are numeric, 1-indexed
- COUNT_OPTIONS: `[5, 10, 15, 20, 25, 30, 50]`
- Custom dark overrides in `globals.css` supplement Tailwind `dark:` variant
- Auth sessions via JWT (no DB sessions); `AUTH_SECRET` env var required
