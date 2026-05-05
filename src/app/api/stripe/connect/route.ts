import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/auth/login`, 303);
  }

  const { data: seller } = await supabase
    .from("sellers")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!seller) {
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/onboarding`, 303);
  }

  let accountId = seller.stripe_account_id;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "DE",
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      },
      business_profile: {
        product_description: "Verkauf über Lyvee.link Verkaufslinks"
      },
      metadata: {
        seller_id: seller.id
      }
    });

    accountId = account.id;

    await supabase
      .from("sellers")
      .update({ stripe_account_id: accountId })
      .eq("id", user.id);
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
    return_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
    type: "account_onboarding"
  });

  return NextResponse.redirect(accountLink.url, 303);
}
