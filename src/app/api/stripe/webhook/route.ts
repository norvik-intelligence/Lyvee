import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const productId = session.metadata?.product_id;
    const sellerId = session.metadata?.seller_id;

    if (productId && sellerId) {
      const { data: product } = await supabase
        .from("products")
        .select("stock, sale_count")
        .eq("id", productId)
        .single();

      await supabase
        .from("orders")
        .update({
          status: "paid",
          stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
          stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
          buyer_email: session.customer_details?.email || session.customer_email || null,
          paid_at: new Date().toISOString()
        })
        .eq("stripe_checkout_session_id", session.id);

      await supabase
        .from("products")
        .update({
          sale_count: (product?.sale_count || 0) + 1,
          stock: product?.stock === null || product?.stock === undefined ? null : Math.max(0, product.stock - 1)
        })
        .eq("id", productId);

      await supabase.from("product_events").insert({
        product_id: productId,
        seller_id: sellerId,
        event_type: "purchase",
        metadata: { session_id: session.id }
      });
    }
  }

  if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;
    await supabase
      .from("sellers")
      .update({ stripe_onboarding_complete: Boolean(account.details_submitted && account.charges_enabled) })
      .eq("stripe_account_id", account.id);
  }

  return NextResponse.json({ received: true });
}
