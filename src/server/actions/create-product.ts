"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createProductSchema } from "@/lib/validations/product";
import { createProductSlug } from "@/lib/slug";

export async function createProductAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: seller } = await supabase
    .from("sellers")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!seller?.consent_accepted_at) redirect("/onboarding");

  const parsed = createProductSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || "",
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl") || "",
    stock: formData.get("stock") || "",
    fomoEnabled: formData.get("fomoEnabled") === "on"
  });

  const slug = createProductSlug({ sellerUsername: seller.username, productName: parsed.name });

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      seller_id: user.id,
      slug,
      name: parsed.name,
      description: parsed.description,
      price_cents: parsed.price,
      image_url: parsed.imageUrl || null,
      stock: parsed.stock,
      fomo_enabled: parsed.fomoEnabled
    })
    .select("id")
    .single();

  if (error || !product) throw new Error(error?.message || "Produkt konnte nicht erstellt werden.");

  redirect(`/dashboard/links/${product.id}`);
}
