import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { calculateApplicationFeeCents } from "@/lib/money";

export async function POST(request: Request) {
  const formData = await request.formData();
  const productId = String(formData.get("productId") || "");

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, sellers(stripe_account_id, stripe_onboarding_complete)")
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (product.stock !== null && product.stock <= 0) {
    return NextResponse.json({ error: "Sold out" }, { status: 409 });
  }

  const stripeAccountId = product.sellers?.stripe_account_id;
  if (!stripeAccountId || !product.sellers?.stripe_onboarding_complete) {
    return NextResponse.json({ error: "Seller has not completed Stripe onboarding" }, { status: 409 });
  }

  const applicationFee = calculateApplicationFeeCents(
    product.price_cents,
    env.LYVEE_APPLICATION_FEE_BPS
  );

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: product.currency,
            unit_amount: product.price_cents,
            product_data: {
              name: product.name,
              description: product.description || undefined,
              images: product.image_url ? [product.image_url] : undefined
            }
          }
        }
      ],
      success_url: `${env.NEXT_PUBLIC_APP_URL}/${product.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/${product.slug}`,
      payment_intent_data: {
        application_fee_amount: applicationFee,
        metadata: {
          product_id: product.id,
          seller_id: product.seller_id
        }
      },
      metadata: {
        product_id: product.id,
        seller_id: product.seller_id
      }
    },
    {
      stripeAccount: stripeAccountId
    }
  );

  await supabase.from("orders").insert({
    product_id: product.id,
    seller_id: product.seller_id,
    stripe_account_id: stripeAccountId,
    stripe_checkout_session_id: session.id,
    amount_total_cents: product.price_cents,
    application_fee_cents: applicationFee,
    currency: product.currency,
    status: "pending"
  });

  await supabase.from("product_events").insert({
    product_id: product.id,
    seller_id: product.seller_id,
    event_type: "checkout_started",
    metadata: { session_id: session.id }
  });

  return NextResponse.redirect(session.url!, 303);
}
