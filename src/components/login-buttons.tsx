"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { publicEnv } from "@/lib/env-public";

export function LoginButtons() {
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
    <div className="mt-8 space-y-3">
      <button
        type="button"
        onClick={() => signIn("google")}
        className="w-full rounded-2xl border bg-white px-5 py-4 font-semibold shadow-sm transition hover:bg-neutral-50"
      >
        Mit Google fortfahren
      </button>
      <button
        type="button"
        onClick={() => signIn("apple")}
        className="w-full rounded-2xl bg-black px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-neutral-900"
      >
        Mit Apple fortfahren
      </button>
    </div>
  );
}
