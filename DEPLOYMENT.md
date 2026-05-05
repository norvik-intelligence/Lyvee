# Lyvee Vercel Deployment

## Status

Das Repository ist bereit für den Import in Vercel:

```txt
Repository: norvik-intelligence/Lyvee
Branch: main
Framework: Next.js
Install Command: npm install --legacy-peer-deps
Build Command: npm run build
```

## Vercel Import

1. Vercel Dashboard öffnen.
2. Add New → Project wählen.
3. GitHub Repository `norvik-intelligence/Lyvee` importieren.
4. Framework Preset: `Next.js`.
5. Install Command:

```bash
npm install --legacy-peer-deps
```

6. Build Command:

```bash
npm run build
```

7. Output Directory leer lassen.
8. Deploy klicken.

## Environment Variables

Für den ersten Build sind Dummy-Fallbacks vorhanden. Für echte Auth/Payments müssen danach diese Werte gesetzt werden:

```bash
NEXT_PUBLIC_APP_URL=https://deine-vercel-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Lyvee.link
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_CONNECT_CLIENT_ID=...
LYVEE_APPLICATION_FEE_BPS=490
```

## Supabase

Migration ausführen:

```bash
supabase/migrations/0001_initial_schema.sql
```

OAuth Redirect URL setzen:

```txt
https://deine-vercel-domain.vercel.app/auth/callback
```

## Stripe

Webhook Endpoint setzen:

```txt
https://deine-vercel-domain.vercel.app/api/stripe/webhook
```

Benötigte Events:

```txt
checkout.session.completed
account.updated
```
