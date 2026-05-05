# Lyvee.link

**Das Linktree fürs Geld** — mobile-first Verkaufslinks für Creator, Coaches, Handwerker und Social-Commerce-Seller in DACH.

Lyvee ermöglicht Verkäufern, in unter 30 Sekunden einen schönen Verkaufslink zu erstellen. Käufer landen auf einer minimalistischen Produktseite und kaufen mit wenigen Klicks über Stripe Checkout, Apple Pay, Google Pay oder Stripe Link.

## MVP-Ziele

- Verkäufer-Login mit Google/Apple über Supabase Auth.
- Produktlink erstellen: Name, Preis, Beschreibung, Bild, optional Bestand.
- Öffentliche Produktseite unter `/{slug}`.
- Stripe Checkout mit Stripe Connect Direct Charges.
- 4,9 % Application Fee für Lyvee.
- Seller-Dashboard mit Umsatz, Klicks und Verkäufen.
- Webhooks für Zahlungserfolg, Bestand und Verkäuferbenachrichtigung.
- EU-orientierte Basis: minimale Datenspeicherung, Consent-Hinweise, Widerrufsbutton auf der Erfolgsseite.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI
- Supabase Auth, PostgreSQL, Storage, RLS
- Stripe Checkout + Connect Direct Charges
- Vercel Hosting

## Lokale Entwicklung

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Die App läuft danach unter:

```txt
http://localhost:3000
```

## Supabase Setup

1. Supabase-Projekt anlegen.
2. Google und Apple OAuth Provider aktivieren.
3. Storage Bucket `product-images` erstellen.
4. Migrationen aus `supabase/migrations` ausführen.
5. Env-Variablen aus `.env.example` setzen.

## Stripe Setup

1. Stripe Account für Lyvee anlegen.
2. Stripe Connect aktivieren.
3. Webhook lokal testen:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. `STRIPE_WEBHOOK_SECRET` in `.env.local` setzen.

## Rechtlicher Hinweis

Dieses Repository implementiert technische Basisfunktionen für DSGVO-nahe Datensparsamkeit, Consent-Flows und Widerruf. Es ersetzt keine Rechtsberatung. Vor Livegang in DACH sollten AGB, Datenschutz, Impressum, Widerrufsbelehrung, Verkäuferpflichten und steuerliche Themen geprüft werden.
