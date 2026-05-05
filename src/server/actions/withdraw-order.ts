"use server";

import { redirect } from "next/navigation";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function requestWithdrawalAction(formData: FormData) {
  const sessionId = String(formData.get("sessionId") || "");
  const slug = String(formData.get("slug") || "");

  if (!sessionId || !slug) {
    redirect("/");
  }

  const supabase = createSupabaseServiceClient();

  await supabase
    .from("orders")
    .update({
      status: "withdrawal_requested",
      withdrawal_requested_at: new Date().toISOString()
    })
    .eq("stripe_checkout_session_id", sessionId);

  redirect(`/${slug}/success?withdrawal=requested`);
}
