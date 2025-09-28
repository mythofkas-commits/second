# Rollout Radar monorepo

This repository contains the Rollout Radar web application, a Next.js 14 + TypeScript project for tracking feature rollouts across popular consumer apps. All application code lives in the [`rollout-radar/`](./rollout-radar/) directory, while the repository root exposes convenience scripts so you can work with the app without changing directories.

## Getting started locally

1. Install dependencies with pnpm (includes the web app via the workspace configuration):
   ```bash
   pnpm install
   ```
2. Copy `.env.example` to `.env.local` inside `rollout-radar/` and fill in the required secrets (Supabase/Postgres, OAuth providers, Upstash Redis, etc.).
3. Run the development server:
   ```bash
   pnpm dev
   ```
   The app will be available at http://localhost:3000.

Additional commands are proxied to the web app as well:

```bash
pnpm build     # production build
pnpm start     # run the compiled app
pnpm lint      # ESLint
pnpm test      # Vitest suite
pnpm test:e2e  # Playwright end-to-end tests
```

## Where you can deploy it

Rollout Radar is a full-stack Next.js application with route handlers, Prisma, and background jobs. It requires a Node.js runtime with serverless/function support:

- **Vercel (recommended):** First-class support for Next.js, built-in cron jobs, environment variable management, and automatic deployments from Git.
- **Netlify:** Supported via the Next.js runtime plugin. You must configure environment variables, Prisma migrations, and any serverless cron triggers manually.
- **Self-hosted Node server (Docker, Railway, Fly.io, Render, etc.):** Build with `pnpm build` and run `pnpm start` on infrastructure that supports persistent environment variables and database connectivity.

Static hosts such as GitHub Pages are not compatible because they do not provide the necessary Node.js server features.

For detailed deployment steps (database provisioning, OAuth configuration, Redis rate limiting, cron setup), see [`rollout-radar/DEPLOY.md`](./rollout-radar/DEPLOY.md).
