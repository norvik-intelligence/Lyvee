import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUserAndSeller } from "@/server/queries/seller";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sellerOnboardingSchema } from "@/lib/validations/seller";

async function saveOnboarding(formData: FormData) {
  "use server";

  const parsed = sellerOnboardingSchema.parse({
    username: formData.get("username"),
    displayName: formData.get("displayName"),
    consentAccepted: formData.get("consentAccepted")
  });

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { error } = await supabase
    .from("sellers")
    .update({
      username: parsed.username,
      display_name: parsed.displayName,
      consent_accepted_at: new Date().toISOString()
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export default async function OnboardingPage() {
  const { user, seller } = await getCurrentUserAndSeller();

  if (!user) redirect("/auth/login");
  if (seller?.consent_accepted_at) redirect("/dashboard");

  return (
    <main className="lyvee-gradient flex min-h-screen items-center justify-center px-4 py-10">
      <form action={saveOnboarding} className="w-full max-w-lg rounded-[2rem] border bg-white p-8 shadow-2xl">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Seller-Onboarding</p>
          <h1 className="text-3xl font-bold tracking-tight">Dein Lyvee-Profil</h1>
          <p className="text-muted-foreground">Wähle deinen Namen und akzeptiere die Beta-Bedingungen.</p>
        </div>
        <div className="mt-8 space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium">Öffentlicher Name</span>
            <input name="displayName" defaultValue={seller?.display_name || ""} required className="w-full rounded-2xl border px-4 py-3" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium">Username</span>
            <input name="username" defaultValue={seller?.username || ""} required pattern="[a-z0-9][a-z0-9-]{2,39}" className="w-full rounded-2xl border px-4 py-3" />
            <span className="text-xs text-muted-foreground">Nur Kleinbuchstaben, Zahlen und Bindestriche.</span>
          </label>
          <label className="flex gap-3 rounded-2xl border bg-neutral-50 p-4 text-sm">
            <input name="consentAccepted" type="checkbox" required className="mt-1" />
            <span>Ich akzeptiere die Beta-Bedingungen, Datenschutz-Hinweise und bestätige, dass ich eigene Produkte/Dienstleistungen verkaufe.</span>
          </label>
          <button className="w-full rounded-2xl bg-black py-4 font-semibold text-white shadow-lg">Dashboard öffnen</button>
        </div>
      </form>
    </main>
  );
}
