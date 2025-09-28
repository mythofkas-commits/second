# Rollout Radar

Rollout Radar is a production-ready Next.js 14 web application that tracks new feature rollouts across popular apps. It exposes availability by country and device, captures community reports, and provides instructions for enabling features.

## Tech stack

- **Framework:** Next.js 14 (App Router) with TypeScript
- **Styling/UI:** Tailwind CSS, shadcn/ui, lucide-react
- **Data:** Prisma ORM (PostgreSQL/Supabase), TanStack Query, Zod validation
- **Auth:** NextAuth (Google + GitHub OAuth) with role-based access
- **Infrastructure helpers:** Upstash Redis for rate limiting, Plausible analytics, MDX instructions, Playwright & Vitest for testing

## Running locally

1. Install dependencies (from the repo root you can run `pnpm install`, or run the commands inside this directory):
   ```bash
   pnpm install
   ```
2. Copy `.env.example` to `.env.local` and set the required environment variables (database URL, OAuth credentials, Redis, etc.).
3. Prepare the database:
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```
   Visit http://localhost:3000 to view the app.

## Testing

```bash
pnpm lint       # ESLint + TypeScript rules
pnpm test       # Vitest unit tests (checker logic, report handling)
pnpm test:e2e   # Playwright smoke tests
```

## Deployment options

Rollout Radar needs a Node.js environment with serverless APIs, database access, and background job support.

- **Vercel (recommended):** Seamless deployment for Next.js, automatic route handlers, and cron jobs. Follow [`DEPLOY.md`](./DEPLOY.md) for Supabase, Upstash, and OAuth setup steps.
- **Netlify:** Use the official Next.js runtime plugin to deploy. Ensure you configure environment variables, Prisma migrations, and optional cron jobs manually.
- **Railway, Fly.io, Render, or custom Node hosting:** Build with `pnpm build` and run with `pnpm start`. Provide the same environment variables and connect to your managed PostgreSQL/Redis services.

Static hosting solutions (e.g., GitHub Pages) are not supported because the application relies on server-side route handlers and background jobs.

## Useful scripts

- `pnpm worker:run` – executes the ingestion worker once using the YAML-configured sources
- `pnpm worker:add-source --feature <slug> --url <url> --type <type>` – append a source to the YAML config and database
- `pnpm db:studio` – open Prisma Studio for inspecting data locally

For environment provisioning and deployment steps, see [`DEPLOY.md`](./DEPLOY.md).
