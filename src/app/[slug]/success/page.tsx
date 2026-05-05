import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { requestWithdrawalAction } from "@/server/actions/withdraw-order";

export default async function SuccessPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string; withdrawal?: string }>;
}) {
  const { slug } = await params;
  const { session_id: sessionId, withdrawal } = await searchParams;
  const supabase = createSupabaseServiceClient();

  const { data: product } = await supabase
    .from("products")
    .select("name")
    .eq("slug", slug)
    .single();

  return (
    <main className="lyvee-gradient flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-[2rem] border bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-3xl">✓</div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Danke für deinen Kauf!</h1>
        <p className="mt-3 text-muted-foreground">
          Deine Zahlung für {product?.name || "deinen Kauf"} wurde verarbeitet. Du erhältst alle weiteren Informationen vom Verkäufer.
        </p>

        {withdrawal === "requested" ? (
          <div className="mt-6 rounded-2xl bg-neutral-100 p-4 text-sm font-medium">
            Dein Widerruf wurde vorgemerkt. Der Verkäufer wird informiert.
          </div>
        ) : sessionId ? (
          <form action={requestWithdrawalAction} className="mt-6">
            <input type="hidden" name="sessionId" value={sessionId} />
            <input type="hidden" name="slug" value={slug} />
            <button className="w-full rounded-2xl border bg-white px-5 py-4 font-semibold">
              Widerruf anfordern
            </button>
          </form>
        ) : null}

        <Link href={`/${slug}`} className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground">
          Zurück zum Produkt
        </Link>
      </section>
    </main>
  );
}
