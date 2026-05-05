import { createProductAction } from "@/server/actions/create-product";

export default function NewProductPage() {
  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8">
      <form action={createProductAction} className="mx-auto max-w-2xl rounded-[2rem] border bg-white p-6 shadow-xl sm:p-8">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Neuer Verkaufslink</p>
          <h1 className="text-3xl font-bold tracking-tight">Produkt anlegen</h1>
          <p className="text-muted-foreground">Für den MVP nutzt du eine Bild-URL. Upload kommt im nächsten Schritt.</p>
        </div>

        <div className="mt-8 space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium">Produktname</span>
            <input name="name" required className="w-full rounded-2xl border px-4 py-3" placeholder="Handgemachter Keramikbecher" />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Preis in EUR</span>
            <input name="price" required inputMode="decimal" className="w-full rounded-2xl border px-4 py-3" placeholder="29,00" />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Kurzbeschreibung</span>
            <textarea name="description" rows={4} className="w-full rounded-2xl border px-4 py-3" placeholder="Kurz, klar, kaufstark." />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Bild-URL</span>
            <input name="imageUrl" type="url" className="w-full rounded-2xl border px-4 py-3" placeholder="https://..." />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Bestand optional</span>
            <input name="stock" inputMode="numeric" className="w-full rounded-2xl border px-4 py-3" placeholder="10" />
          </label>

          <label className="flex gap-3 rounded-2xl border bg-neutral-50 p-4 text-sm">
            <input name="fomoEnabled" type="checkbox" className="mt-1" />
            <span>FOMO anzeigen, z. B. „Nur noch X Stück“</span>
          </label>

          <button className="w-full rounded-2xl bg-black py-4 font-semibold text-white shadow-lg">Link erstellen</button>
        </div>
      </form>
    </main>
  );
}
