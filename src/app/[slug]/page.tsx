import { notFound } from "next/navigation";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { formatEuro } from "@/lib/money";

export default async function PublicProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createSupabaseServiceClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const { data: seller } = await supabase
    .from("sellers")
    .select("username, display_name, stripe_account_id, stripe_onboarding_complete")
    .eq("id", product.seller_id)
    .single();

  await supabase.from("product_events").insert({
    product_id: product.id,
    seller_id: product.seller_id,
    event_type: "view",
    metadata: { slug }
  });
  await supabase.from("products").update({ click_count: product.click_count + 1 }).eq("id", product.id);

  const soldOut = product.stock !== null && product.stock <= 0;

  return (
    <main className="lyvee-gradient min-h-screen px-4 py-6">
      <section className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-[2rem] border bg-white shadow-2xl">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="aspect-square w-full object-cover" />
          ) : (
            <div className="aspect-square w-full bg-neutral-100" />
          )}

          <div className="space-y-5 p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {seller?.display_name || seller?.username || "Lyvee Seller"}
              </p>
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {product.fomo_enabled && product.stock !== null ? (
              <div className="rounded-2xl bg-neutral-100 px-4 py-3 text-sm font-medium">
                Nur noch {product.stock} Stück verfügbar
              </div>
            ) : null}

            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{formatEuro(product.price_cents)}</span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium">Apple Pay · Google Pay</span>
            </div>

            {!seller?.stripe_onboarding_complete ? (
              <div className="rounded-2xl bg-neutral-100 p-4 text-sm text-muted-foreground">
                Checkout ist noch nicht aktiv. Der Verkäufer muss Stripe verbinden.
              </div>
            ) : (
              <form action="/api/checkout" method="POST">
                <input type="hidden" name="productId" value={product.id} />
                <button disabled={soldOut} className="w-full rounded-2xl bg-black py-4 text-base font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:bg-neutral-300">
                  {soldOut ? "Ausverkauft" : "Jetzt kaufen"}
                </button>
              </form>
            )}

            <p className="text-center text-xs text-muted-foreground">
              Sicherer Checkout über Stripe. Widerruf auf der Bestätigungsseite möglich.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
