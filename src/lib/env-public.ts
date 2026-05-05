const fallbackUrl = "https://example.com";

export const publicEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || fallbackUrl,
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Lyvee.link",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackUrl,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "missing-supabase-anon-key",
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_missing"
} as const;
