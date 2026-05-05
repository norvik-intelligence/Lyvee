import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserAndSeller } from "@/server/queries/seller";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatEuro } from "@/lib/money";

export default async function DashboardPage() {
  const { user, seller } = await getCurrentUserAndSeller();
  if (!user) redirect("/auth/login");
  if (!seller?.consent_accepted_at) redirect("/onboarding");

  const supabase = await createSupabaseServerClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  const { data: orders } = await supabase
    .from("orders")
    .select("amount_total_cents, created_at, status")
    .eq("seller_id", user.id)
    .eq("status", "paid");

  const revenue = orders?.reduce((sum, order) => sum + order.amount_total_cents, 0) || 0;

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8">
      <section className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-muted-foreground">Willkommen, {seller.display_name || seller.username}</p>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          </div>
          <Link href="/dashboard/links/new" className="rounded-2xl bg-black px-5 py-3 font-semibold text-white shadow-lg">
            Neuer Verkaufslink
          </Link>
        </header>

        {!seller.stripe_onboarding_complete ? (
          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold">Zahlungen aktivieren</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Verbinde dein Stripe-Konto, damit Käufer deine Links bezahlen können.
                </p>
              </div>
              <form action="/api/stripe/connect" method="POST">
                <button className="rounded-2xl bg-black px-5 py-3 font-semibold text-white shadow-lg">
                  Stripe verbinden
                </button>
              </form>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Gesamtumsatz</p>
            <p className="mt-2 text-3xl font-bold">{formatEuro(revenue)}</p>
          </div>
          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Links</p>
            <p className="mt-2 text-3xl font-bold">{products?.length || 0}</p>
          </div>
          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Verkäufe</p>
            <p className="mt-2 text-3xl font-bold">{orders?.length || 0}</p>
          </div>
        </div>

        <div className="rounded-3xl border bg-white shadow-sm">
          <div className="border-b p-5">
            <h2 className="text-xl font-semibold">Deine Links</h2>
          </div>
          <div className="divide-y">
            {products?.length ? products.map((product) => (
              <Link key={product.id} href={`/dashboard/links/${product.id}`} className="flex items-center justify-between gap-4 p-5 transition hover:bg-neutral-50">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">/{product.slug} · {product.click_count} Klicks · {product.sale_count} Verkäufe</p>
                </div>
                <p className="font-semibold">{formatEuro(product.price_cents)}</p>
              </Link>
            )) : (
              <div className="p-8 text-center text-muted-foreground">Noch keine Links. Erstelle deinen ersten Verkaufslink.</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
