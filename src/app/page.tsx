import Link from "next/link";

export default function HomePage() {
  return (
    <main className="lyvee-gradient min-h-screen px-4 py-8">
      <section className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8 py-20 text-center">
        <div className="rounded-full border bg-white px-4 py-2 text-sm text-muted-foreground shadow-sm">
          Social Commerce in 30 Sekunden
        </div>
        <div className="space-y-5">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Das Linktree fürs Geld.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Erstelle schöne Verkaufslinks für Instagram, TikTok, WhatsApp und QR-Codes. Käufer zahlen schnell mit Stripe Checkout, Apple Pay, Google Pay und Link.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/auth/login" className="rounded-2xl bg-black px-7 py-4 text-base font-semibold text-white shadow-lg transition hover:scale-[1.02]">
            Kostenlos starten
          </Link>
          <Link href="#demo" className="rounded-2xl border bg-white px-7 py-4 text-base font-semibold shadow-sm">
            Demo ansehen
          </Link>
        </div>
        <div id="demo" className="mt-8 w-full max-w-sm rounded-[2rem] border bg-white p-4 text-left shadow-2xl">
          <div className="aspect-square rounded-[1.5rem] bg-neutral-100" />
          <div className="space-y-3 p-3">
            <p className="text-xs font-medium text-muted-foreground">lyvee.link/anna-keramik-becher</p>
            <h2 className="text-2xl font-bold">Handgemachter Keramikbecher</h2>
            <p className="text-muted-foreground">Limitierte Kleinserie aus Berlin. Spülmaschinenfest.</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">29,00 €</span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm">Apple Pay</span>
            </div>
            <button className="w-full rounded-2xl bg-black py-4 font-semibold text-white">Jetzt kaufen</button>
          </div>
        </div>
      </section>
    </main>
  );
}
