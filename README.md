# TaskFlow - Task Management Dashboard

A full-stack task management application with authentication, real-time updates, and a clean responsive UI. Built to demonstrate modern React patterns and best practices.

## Tech Stack

- **Next.js 15 (App Router)** — SSR + API routes in one project, Server Components for performance
- **TypeScript** — Type safety across the stack
- **Prisma + SQLite** — Type-safe ORM, easy local setup, swap to PostgreSQL for production
- **NextAuth.js v5** — Battle-tested auth with JWT strategy for stateless sessions
- **TanStack Query v5** — Server state management with optimistic updates and cache invalidation
- **ShadCN UI + Tailwind CSS** — Composable components, no runtime CSS overhead
- **Zod** — Shared validation schemas between client and server

## Getting Started

```bash
git clone <repo-url>
cd task-dashboard
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Login and register pages
│   ├── (dashboard)/          # Protected dashboard (server component)
│   └── api/                  # REST API routes
├── components/
│   ├── ui/                   # ShadCN primitives
│   └── header.tsx            # App header with user menu
├── features/
│   └── tasks/                # Task feature module
│       ├── components/       # Task UI components
│       ├── hooks/            # TanStack Query hooks
│       └── services/         # API client functions
├── lib/                      # Shared utilities
│   ├── auth.ts               # NextAuth configuration
│   ├── prisma.ts             # Database client singleton
│   └── validations.ts        # Zod schemas
├── providers/                # React context providers
├── types/                    # TypeScript definitions
└── middleware.ts             # Route protection
```

## Architecture Decisions

1. **Feature-based architecture** — Colocates related code (components, hooks, services) by domain. Scales better than type-based grouping as the codebase grows.

2. **Server Components for initial data fetch** — Dashboard page fetches tasks via Prisma on the server, passes data to client components. Eliminates loading state flash on first render.

3. **Shared Zod schemas** — Single source of truth for validation on both client and server. Form validation mirrors API validation exactly.

4. **Optimistic updates with rollback** — Mutations update the UI immediately for snappy feedback. If the API fails, changes revert automatically.

5. **SQLite for development** — Zero-config local development. Prisma makes switching to PostgreSQL a one-line change in `schema.prisma`.

## Assumptions

- Single-user experience (no team/collaboration features)
- SQLite for development simplicity (production would use PostgreSQL)
- Light mode only (dark mode out of scope for MVP)
- Email/password auth only (no OAuth providers)

## Running Tests

```bash
npm run test        # Run tests once
npm run test:watch  # Watch mode
```

## Scripts

```bash
npm run dev         # Start development server
npm run build       # Production build
npm run lint        # Run ESLint
npm run format      # Format with Prettier
npm run test        # Run Vitest tests
```
