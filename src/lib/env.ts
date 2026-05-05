import "server-only";
import { z } from "zod";

const fallbackUrl = "https://example.com";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default(fallbackUrl),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Lyvee.link"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default(fallbackUrl),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).default("missing-supabase-anon-key"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default("missing-supabase-service-role-key"),
  STRIPE_SECRET_KEY: z.string().min(1).default("sk_test_missing"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).default("pk_test_missing"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).default("whsec_missing"),
  STRIPE_CONNECT_CLIENT_ID: z.string().min(1).default("ca_missing"),
  LYVEE_APPLICATION_FEE_BPS: z.coerce.number().int().min(0).max(10_000).default(490),
  RESEND_API_KEY: z.string().optional(),
  NOTIFICATION_FROM_EMAIL: z.string().optional(),
  IP_HASH_SECRET: z.string().min(16).optional()
});

const parsed = serverEnvSchema.parse(process.env);

export const env = parsed;

export function assertRuntimeEnv() {
  const missing = [
    ["NEXT_PUBLIC_APP_URL", env.NEXT_PUBLIC_APP_URL === fallbackUrl],
    ["NEXT_PUBLIC_SUPABASE_URL", env.NEXT_PUBLIC_SUPABASE_URL === fallbackUrl],
    ["NEXT_PUBLIC_SUPABASE_ANON_KEY", env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "missing-supabase-anon-key"],
    ["SUPABASE_SERVICE_ROLE_KEY", env.SUPABASE_SERVICE_ROLE_KEY === "missing-supabase-service-role-key"],
    ["STRIPE_SECRET_KEY", env.STRIPE_SECRET_KEY === "sk_test_missing"],
    ["STRIPE_WEBHOOK_SECRET", env.STRIPE_WEBHOOK_SECRET === "whsec_missing"]
  ]
    .filter(([, isMissing]) => isMissing)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Missing runtime environment variables: ${missing.join(", ")}`);
  }
}
