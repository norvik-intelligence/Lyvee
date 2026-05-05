create extension if not exists "pgcrypto";

create table public.sellers (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  email text,
  avatar_url text,
  stripe_account_id text unique,
  stripe_onboarding_complete boolean not null default false,
  consent_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sellers_username_format check (username ~ '^[a-z0-9][a-z0-9-]{2,39}$')
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.sellers(id) on delete cascade,
  slug text unique not null,
  name text not null,
  description text not null default '',
  price_cents integer not null check (price_cents >= 100),
  currency text not null default 'eur',
  image_url text,
  stock integer check (stock is null or stock >= 0),
  fomo_enabled boolean not null default false,
  is_active boolean not null default true,
  click_count integer not null default 0,
  sale_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  seller_id uuid not null references public.sellers(id) on delete restrict,
  stripe_account_id text not null,
  stripe_checkout_session_id text unique not null,
  stripe_payment_intent_id text unique,
  stripe_customer_id text,
  buyer_email text,
  amount_total_cents integer not null,
  application_fee_cents integer not null,
  currency text not null default 'eur',
  status text not null default 'pending',
  withdrawal_requested_at timestamptz,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  constraint orders_status_check check (status in ('pending', 'paid', 'failed', 'refunded', 'withdrawal_requested'))
);

create table public.product_events (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  seller_id uuid not null references public.sellers(id) on delete cascade,
  event_type text not null,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint product_events_type_check check (event_type in ('view', 'checkout_started', 'purchase'))
);

create index products_seller_id_idx on public.products(seller_id);
create index products_slug_idx on public.products(slug);
create index orders_seller_id_idx on public.orders(seller_id);
create index orders_product_id_idx on public.orders(product_id);
create index orders_created_at_idx on public.orders(created_at desc);
create index product_events_product_id_idx on public.product_events(product_id);

alter table public.sellers enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.product_events enable row level security;

create policy "Sellers can read own seller profile" on public.sellers for select using (auth.uid() = id);
create policy "Sellers can insert own seller profile" on public.sellers for insert with check (auth.uid() = id);
create policy "Sellers can update own seller profile" on public.sellers for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Public can read active products" on public.products for select using (is_active = true);
create policy "Sellers can create own products" on public.products for insert with check (auth.uid() = seller_id);
create policy "Sellers can update own products" on public.products for update using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

create policy "Sellers can read own orders" on public.orders for select using (auth.uid() = seller_id);
create policy "Sellers can read own product events" on public.product_events for select using (auth.uid() = seller_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_username text;
  final_username text;
begin
  base_username := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'seller'), '[^a-zA-Z0-9]+', '-', 'g'));
  base_username := trim(both '-' from base_username);

  if length(base_username) < 3 then
    base_username := 'seller';
  end if;

  final_username := left(base_username, 32) || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6);

  insert into public.sellers (id, username, display_name, email, avatar_url)
  values (
    new.id,
    final_username,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );

  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
