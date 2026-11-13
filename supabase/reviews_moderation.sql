-- T-21: moderasi review untuk Pura Mengening
-- Jalankan di Supabase SQL Editor. Aman diulang.
-- KOSONGKAN editor lebih dulu (Cmd+A lalu hapus) sebelum menempel.
--
-- Tanpa blok DO/$$ supaya tidak bergantung pada cara editor memecah statement.
-- Setiap langkah bisa dijalankan terpisah bila perlu.

-- LANGKAH 1 -- kolom approved
alter table public.reviews
    add column if not exists approved boolean not null default false;

-- LANGKAH 2 -- review yang sudah tayang sebelum moderasi dianggap disetujui,
-- supaya testimoni yang ada di beranda tidak mendadak hilang.
-- Batas tanggalnya tetap, jadi menjalankan ulang tidak akan ikut menyetujui
-- review baru yang sedang menunggu.
update public.reviews
   set approved = true
 where created_at < '2026-11-13T00:00:00Z'
   and approved = false;

-- LANGKAH 3 -- batas panjang. Data yang ada sekarang: pesan terpendek 78
-- karakter, nama terpendek 4 karakter, jadi batas ini aman.
alter table public.reviews drop constraint if exists reviews_message_len;
alter table public.reviews add constraint reviews_message_len
    check (char_length(trim(message)) between 10 and 1000);

alter table public.reviews drop constraint if exists reviews_name_len;
alter table public.reviews add constraint reviews_name_len
    check (char_length(trim(name)) between 2 and 80);

-- LANGKAH 4 -- indeks untuk antrean moderasi
create index if not exists reviews_approved_idx
    on public.reviews (approved, created_at desc);

-- LANGKAH 5 -- publik hanya melihat yang disetujui, admin melihat semua
drop policy if exists "Allow public read access" on public.reviews;
drop policy if exists "Public can view reviews" on public.reviews;
drop policy if exists "Public can view approved reviews" on public.reviews;
drop policy if exists "Admin can view all reviews" on public.reviews;

create policy "Public can view approved reviews"
    on public.reviews for select to anon using (approved = true);

create policy "Admin can view all reviews"
    on public.reviews for select to authenticated using (true);
