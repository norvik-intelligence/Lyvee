export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      sellers: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          email: string | null;
          avatar_url: string | null;
          stripe_account_id: string | null;
          stripe_onboarding_complete: boolean;
          consent_accepted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          stripe_account_id?: string | null;
          stripe_onboarding_complete?: boolean;
          consent_accepted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sellers"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          seller_id: string;
          slug: string;
          name: string;
          description: string;
          price_cents: number;
          currency: string;
          image_url: string | null;
          stock: number | null;
          fomo_enabled: boolean;
          is_active: boolean;
          click_count: number;
          sale_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          slug: string;
          name: string;
          description?: string;
          price_cents: number;
          currency?: string;
          image_url?: string | null;
          stock?: number | null;
          fomo_enabled?: boolean;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          product_id: string;
          seller_id: string;
          stripe_account_id: string;
          stripe_checkout_session_id: string;
          stripe_payment_intent_id: string | null;
          stripe_customer_id: string | null;
          buyer_email: string | null;
          amount_total_cents: number;
          application_fee_cents: number;
          currency: string;
          status: "pending" | "paid" | "failed" | "refunded" | "withdrawal_requested";
          withdrawal_requested_at: string | null;
          created_at: string;
          paid_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          seller_id: string;
          stripe_account_id: string;
          stripe_checkout_session_id: string;
          stripe_payment_intent_id?: string | null;
          stripe_customer_id?: string | null;
          buyer_email?: string | null;
          amount_total_cents: number;
          application_fee_cents: number;
          currency?: string;
          status?: "pending" | "paid" | "failed" | "refunded" | "withdrawal_requested";
          paid_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]> & {
          withdrawal_requested_at?: string | null;
        };
      };
      product_events: {
        Row: {
          id: string;
          product_id: string;
          seller_id: string;
          event_type: "view" | "checkout_started" | "purchase";
          created_at: string;
          metadata: Json;
        };
        Insert: {
          id?: string;
          product_id: string;
          seller_id: string;
          event_type: "view" | "checkout_started" | "purchase";
          metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["product_events"]["Insert"]>;
      };
    };
  };
};
