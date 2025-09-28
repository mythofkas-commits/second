import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  PLAUSIBLE_DOMAIN: z.string().optional(),
  ADMIN_EMAILS: z.string().optional(),
  HCAPTCHA_SECRET: z.string().optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_ID: process.env.GITHUB_ID,
  GITHUB_SECRET: process.env.GITHUB_SECRET,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  PLAUSIBLE_DOMAIN: process.env.PLAUSIBLE_DOMAIN,
  ADMIN_EMAILS: process.env.ADMIN_EMAILS,
  HCAPTCHA_SECRET: process.env.HCAPTCHA_SECRET,
  NODE_ENV: process.env.NODE_ENV as Env['NODE_ENV'],
});

export const adminEmails = env.ADMIN_EMAILS
  ? env.ADMIN_EMAILS.split(',').map((email) => email.trim().toLowerCase())
  : [];

export const isProd = env.NODE_ENV === 'production';
