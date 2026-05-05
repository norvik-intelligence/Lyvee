import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";
import { getCurrentUserAndSeller } from "@/server/queries/seller";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { formatEuro } from "@/lib/money";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, seller } = await getCurrentUserAndSeller();
  if (!user) redirect("/auth/login");
  if (!seller?.consent_accepted_at) redirect("/onboarding");

  const supabase = await createSupabaseServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("seller_id", user.id)
    .single();

  if (!product) notFound();

  const url = `${env.NEXT_PUBLIC_APP_URL}/${product.slug}`;
  const qr = await QRCode.toDataURL(url, { margin: 1, width: 320 });

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8">
      <section className="mx-auto max-w-3xl space-y-6">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">← Zurück</Link>
        <div className="rounded-[2rem] border bg-white p-6 shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Dein Verkaufslink</p>
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
              <p className="text-xl font-semibold">{formatEuro(product.price_cents)}</p>
              <p className="break-all rounded-2xl bg-neutral-100 px-4 py-3 text-sm">{url}</p>
            </div>
            <img src={qr} alt="QR-Code" className="h-40 w-40 rounded-2xl border bg-white p-2" />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <a href={url} target="_blank" className="rounded-2xl bg-black px-5 py-4 text-center font-semibold text-white">Öffnen</a>
            <button className="rounded-2xl border bg-white px-5 py-4 font-semibold" disabled>Kopieren kommt als Client-Komponente</button>
            <Link href="/dashboard" className="rounded-2xl border bg-white px-5 py-4 text-center font-semibold">Dashboard</Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border bg-neutral-50 p-4">
              <p className="text-sm text-muted-foreground">Klicks</p>
              <p className="text-2xl font-bold">{product.click_count}</p>
            </div>
            <div className="rounded-2xl border bg-neutral-50 p-4">
              <p className="text-sm text-muted-foreground">Verkäufe</p>
              <p className="text-2xl font-bold">{product.sale_count}</p>
            </div>
            <div className="rounded-2xl border bg-neutral-50 p-4">
              <p className="text-sm text-muted-foreground">Bestand</p>
              <p className="text-2xl font-bold">{product.stock ?? "∞"}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
