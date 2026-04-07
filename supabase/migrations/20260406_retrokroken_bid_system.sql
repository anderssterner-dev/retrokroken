alter table public.items
  add column if not exists gallery_images text[] not null default '{}',
  add column if not exists main_category text,
  add column if not exists object_code text;

create sequence if not exists public.item_object_code_seq;

create or replace function public.generate_item_object_code()
returns text
language plpgsql
as $$
declare
  next_value bigint;
begin
  next_value := nextval('public.item_object_code_seq');
  return 'RK-' || lpad(next_value::text, 5, '0');
end;
$$;

create or replace function public.set_item_object_code()
returns trigger
language plpgsql
as $$
begin
  if new.object_code is null or btrim(new.object_code) = '' then
    new.object_code := public.generate_item_object_code();
  end if;
  return new;
end;
$$;

drop trigger if exists set_item_object_code_before_insert on public.items;

create trigger set_item_object_code_before_insert
before insert on public.items
for each row
execute function public.set_item_object_code();

update public.items
set object_code = public.generate_item_object_code()
where object_code is null or btrim(object_code) = '';

create unique index if not exists items_object_code_key on public.items(object_code);

create table if not exists public.bid_requests (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  note text,
  status text not null default 'submitted',
  submitted_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.bid_request_items (
  id uuid primary key default gen_random_uuid(),
  bid_request_id uuid not null references public.bid_requests(id) on delete cascade,
  item_id uuid references public.items(id) on delete set null,
  title text not null,
  object_code text,
  main_category text,
  category text,
  amount numeric(12, 2) not null check (amount > 0)
);

create index if not exists bid_request_items_bid_request_id_idx on public.bid_request_items(bid_request_id);

alter table public.bid_requests enable row level security;
alter table public.bid_request_items enable row level security;