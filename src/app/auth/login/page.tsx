"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { publicEnv } from "@/lib/env-public";

export default function LoginPage() {
  async function signIn(provider: "google" | "apple") {
    const supabase = createSupabaseBrowserClient();

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${publicEnv.appUrl}/auth/callback`
      }
    });
  }

  return (
    <main className="lyvee-gradient flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[2rem] border bg-white p-8 shadow-2xl">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium text-muted-foreground">Lyvee.link</p>
          <h1 className="text-3xl font-bold tracking-tight">Verkaufslink erstellen</h1>
          <p className="text-muted-foreground">Melde dich an und erstelle deinen ersten Link in unter 30 Sekunden.</p>
        </div>
        <div className="mt-8 space-y-3">
          <button onClick={() => signIn("google")} className="w-full rounded-2xl border bg-white px-5 py-4 font-semibold shadow-sm transition hover:bg-neutral-50">
            Mit Google fortfahren
          </button>
          <button onClick={() => signIn("apple")} className="w-full rounded-2xl bg-black px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-neutral-900">
            Mit Apple fortfahren
          </button>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Durch die Anmeldung akzeptierst du die Beta-Bedingungen und Datenschutz-Hinweise.
        </p>
      </div>
    </main>
  );
}
