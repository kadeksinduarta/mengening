-- Reviews / Testimonials schema for Pura Mengening
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- Safe to re-run: table creation is guarded, and policies are dropped/recreated.

create table if not exists public.reviews (
    id bigint generated always as identity primary key,
    name text not null check (char_length(trim(name)) > 0),
    message text not null check (char_length(trim(message)) > 0),
    rating smallint not null check (rating between 1 and 5),
    created_at timestamptz not null default now()
);

comment on table public.reviews is 'Visitor testimonials shown on the public site and managed from /admin/review.';

create index if not exists reviews_created_at_idx on public.reviews (created_at desc);

-- Row Level Security
alter table public.reviews enable row level security;

-- Public (anonymous) visitors can submit a review directly from the site.
drop policy if exists "Public can insert reviews" on public.reviews;
create policy "Public can insert reviews"
    on public.reviews
    for insert
    to anon, authenticated
    with check (true);

-- Reviews are shown immediately on the public site, so everyone can read them.
drop policy if exists "Public can view reviews" on public.reviews;
create policy "Public can view reviews"
    on public.reviews
    for select
    to anon, authenticated
    using (true);

-- Only logged-in admins can edit a review (e.g. fix a typo).
drop policy if exists "Admin can update reviews" on public.reviews;
create policy "Admin can update reviews"
    on public.reviews
    for update
    to authenticated
    using (true)
    with check (true);

-- Only logged-in admins can delete/moderate reviews.
drop policy if exists "Admin can delete reviews" on public.reviews;
create policy "Admin can delete reviews"
    on public.reviews
    for delete
    to authenticated
    using (true);
