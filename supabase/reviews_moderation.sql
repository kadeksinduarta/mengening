-- T-21: moderasi review untuk Pura Mengening
-- Jalankan di Supabase SQL Editor. Aman diulang.
--
-- Latar: review dari pengunjung anonim langsung tayang di beranda tanpa
-- persetujuan, tanpa batas panjang, dan tanpa rate limit.

alter table public.reviews
    add column if not exists approved boolean not null default false;

-- Review yang sudah tayang sebelum moderasi diberlakukan dianggap disetujui,
-- supaya testimoni yang sekarang ada di beranda tidak mendadak hilang.
-- Batas tanggalnya tetap, jadi menjalankan ulang skrip ini tidak akan
-- ikut menyetujui review baru yang sedang menunggu moderasi.
update public.reviews
   set approved = true
 where created_at < '2026-11-13T00:00:00Z'
   and approved = false;

-- Batasi panjang pesan. Review terpendek yang ada sekarang 78 karakter,
-- jadi batas bawah 10 aman untuk data yang sudah ada.
do $$
begin
    if not exists (select 1 from pg_constraint where conname = 'reviews_message_len') then
        alter table public.reviews
            add constraint reviews_message_len
            check (char_length(trim(message)) between 10 and 1000);
    end if;
    if not exists (select 1 from pg_constraint where conname = 'reviews_name_len') then
        alter table public.reviews
            add constraint reviews_name_len
            check (char_length(trim(name)) between 2 and 80);
    end if;
end $$;

create index if not exists reviews_approved_idx on public.reviews (approved, created_at desc);

-- Publik hanya melihat review yang sudah disetujui.
drop policy if exists "Allow public read access" on public.reviews;
drop policy if exists "Public can view reviews" on public.reviews;
drop policy if exists "Public can view approved reviews" on public.reviews;
create policy "Public can view approved reviews"
    on public.reviews for select
    to anon
    using (approved = true);

-- Admin melihat semuanya, termasuk yang masih menunggu.
drop policy if exists "Admin can view all reviews" on public.reviews;
create policy "Admin can view all reviews"
    on public.reviews for select
    to authenticated
    using (true);
