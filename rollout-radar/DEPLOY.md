# Deployment checklist

1. Create a Supabase project and set `DATABASE_URL`. Run `pnpm prisma migrate deploy` followed by `pnpm db:seed`.
2. Configure Google and GitHub OAuth apps with callback URLs pointing to `/api/auth/callback/google` and `/api/auth/callback/github` respectively.
3. Provision Upstash Redis and set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
4. Set `ADMIN_EMAILS` to a comma-separated list of administrator accounts.
5. Deploy the Next.js app to Vercel. Configure environment variables in the Vercel dashboard.
6. Enable a Vercel cron job hitting `/api/cron/worker-kick` if you add the ingestion worker.
7. Set `PLAUSIBLE_DOMAIN` if using Plausible analytics.
8. Verify `/sitemap.xml`, `/robots.txt`, and `/rss.xml` respond correctly after deployment.
