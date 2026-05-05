import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentUserAndSeller() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { user: null, seller: null };

  const { data: seller } = await supabase
    .from("sellers")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, seller };
}
