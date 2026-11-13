-- T-20: status booking untuk Pura Mengening
-- Jalankan di Supabase SQL Editor. Aman diulang.
--
-- Latar: tabel bookings tidak punya kolom status, dan tombol hapus di dashboard
-- gagal diam-diam karena tidak ada policy DELETE sama sekali — PostgREST
-- menjawab 204, baris hilang dari tampilan, lalu muncul lagi setelah refresh.
-- Arsip berbasis status lebih tepat daripada menghapus data pelanggan.

alter table public.bookings
    add column if not exists status text not null default 'pending';

do $$
begin
    if not exists (
        select 1 from pg_constraint where conname = 'bookings_status_check'
    ) then
        alter table public.bookings
            add constraint bookings_status_check
            check (status in ('pending', 'confirmed', 'done', 'cancelled'));
    end if;
end $$;

create index if not exists bookings_status_idx on public.bookings (status);

-- Hanya admin yang sudah login boleh mengubah status.
drop policy if exists "Admin can update bookings" on public.bookings;
create policy "Admin can update bookings"
    on public.bookings for update
    to authenticated
    using (true)
    with check (true);

-- Catatan: TIDAK ada policy DELETE yang dibuat di sini, dan itu disengaja.
-- Booking yang batal ditandai status 'cancelled', bukan dihapus, supaya
-- riwayat pelanggan tetap utuh.
