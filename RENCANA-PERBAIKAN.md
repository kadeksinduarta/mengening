# Rencana Perbaikan — Situs Pura Mengening (Tasya Melukat)

> **Basis audit:** commit `90f36f1` · 12 November 2026
> **Laporan temuan lengkap:** https://claude.ai/code/artifact/759017c9-5b69-484c-b9c3-e7d6ce2b3589
> **Total:** 31 temuan → 33 tugas, dibagi ke dalam 7 milestone.

---

## Cara memakai dokumen ini

- Kerjakan milestone **berurutan**. M0 menutup kebocoran data yang sedang berjalan; apa pun yang dikerjakan sebelum itu hanya menunda risikonya.
- Setiap tugas punya **Referensi** (file:baris), **Langkah**, dan **Selesai bila** (kriteria yang bisa diuji). Jangan centang tugas sebelum kriteria itu benar-benar terbukti.
- Centang kotaknya (`- [x]`) sambil jalan, dan commit dokumen ini bersama perubahannya supaya progres terekam di git.
- Kolom **Status** di tabel ringkasan diperbarui manual setiap satu milestone tuntas.

### Ringkasan milestone

| # | Milestone | Fokus | Tugas | Perlu deploy | Status |
|---|-----------|-------|------:|--------------|--------|
| M0 | Tutup kebocoran data | Supabase RLS & storage | 5 | Sebagian | 🟡 Berjalan (1/5) |
| M1 | Kunci akses admin | Sesi & autentikasi | 3 | Ya | ⬜ Belum |
| M2 | Fondasi SEO | Domain, sitemap, rendering | 3 | Ya | ⬜ Belum |
| M3 | Bug yang dilihat pengunjung | Tampilan & navigasi | 6 | Ya | ⬜ Belum |
| M4 | Alur booking & review | Validasi dan moderasi | 6 | Ya | 🟡 Berjalan (1/6) |
| M5 | Performa & aset | Gambar, video, bersih-bersih | 3 | Ya | ⬜ Belum |
| M6 | Kode, i18n, kepatuhan | Utang teknis & legal | 7 | Ya | ⬜ Belum |

---

## M0 — Tutup kebocoran data pelanggan

**Tujuan:** data pelanggan tidak lagi bisa dibaca orang luar.
**Dikerjakan di:** sebagian besar di dashboard Supabase; hanya T-03 dan T-04 yang menyentuh kode.
**Jangan tunda.** Selama milestone ini terbuka, siapa pun yang membuka repo GitHub bisa mengunduh seluruh data booking.

### - [x] T-01 · Tutup hak baca publik pada tabel `bookings`

> **Selesai 12 Nov 2026.** Diverifikasi: `GET /rest/v1/bookings?select=*` dengan anon key kini mengembalikan `[]`.
> Sisa yang perlu dicek manual: form `/booking` masih bisa mengirim, dan `/admin/booking` masih menampilkan data setelah login.

**Temuan:** 01 (Kritis, terverifikasi)
**Referensi:** policy RLS tabel `public.bookings`

Saat ini `GET /rest/v1/bookings?select=*` dengan anon key menjawab `200` beserta seluruh baris: `name`, `email`, `phone`, `alamat`, `catatan`, dan path `bukti_transfer`.

**Langkah** — jalankan di Supabase → SQL Editor:

```sql
alter table public.bookings enable row level security;

-- Buang policy select yang terbuka untuk anon.
-- Sesuaikan namanya dengan yang terlihat di Authentication > Policies.
drop policy if exists "Public can view bookings" on public.bookings;
drop policy if exists "Enable read access for all users" on public.bookings;

-- Hanya admin yang sudah login boleh membaca.
create policy "Admin can view bookings"
  on public.bookings for select to authenticated using (true);

-- Form booking publik hanya butuh INSERT.
drop policy if exists "Public can insert bookings" on public.bookings;
create policy "Public can insert bookings"
  on public.bookings for insert to anon, authenticated with check (true);
```

**Selesai bila:**
- `curl "$URL/rest/v1/bookings?select=*" -H "apikey: $ANON" -H "Authorization: Bearer $ANON"` mengembalikan `[]`, bukan data pelanggan.
- Form di `/booking` masih berhasil mengirim booking baru.
- Dashboard `/admin/booking` masih menampilkan daftar booking setelah admin login.

---

### - [ ] T-02 · Verifikasi hak tulis `anon` pada `bookings` dan `blogs`

**Temuan:** 02 (Kritis, **belum terverifikasi**)
**Referensi:** Authentication → Policies

DELETE dan PATCH dengan anon key sama-sama menjawab `204`, tetapi PostgREST juga menjawab `204` saat RLS menyembunyikan baris — jadi angka itu tidak membuktikan apa pun. Harus dilihat langsung.

**Langkah:**
1. Buka Supabase → Authentication → Policies.
2. Untuk `bookings` dan `blogs`, catat setiap policy beserta role dan command-nya.
3. Hapus policy `update`, `delete`, dan `insert` apa pun yang menyertakan role `anon`.
4. Satu-satunya tulis anon yang sah di situs ini: **INSERT booking** dan **INSERT review**.

**Kenapa penting:** isi artikel dirender lewat `dangerouslySetInnerHTML` di `src/pages/blog/[id].js:143`. Jika `anon` boleh UPDATE `blogs`, dampaknya bukan hanya artikel dirusak — itu menjadi stored XSS di situs publik.

**Selesai bila:** daftar policy untuk kedua tabel sudah dicatat di bawah ini, dan tidak ada lagi baris anon selain INSERT booking.

```
bookings: (isi hasil pemeriksaan di sini)
blogs:    (isi hasil pemeriksaan di sini)
```

---

### - [ ] T-03 · Pindahkan bukti transfer ke bucket privat

> **Progres 13 Nov 2026 — kode dan infrastruktur selesai, tinggal uji coba.**
> Sudah dikerjakan: bucket `payments` dibuat privat, policy storage dipasang, file lama dipindahkan dari `images/bukti_transfer/`, helper `getPaymentProofUrl()` ditambahkan di `src/utils/supabase.js`, upload di `booking.js` pindah ke bucket `payments`, dan `admin/booking.js` membaca lewat signed URL 60 detik. `npm run build` lolos, lint tidak bertambah.
> **Belum:** satu booking uji dengan metode Transfer Bank dari ujung ke ujung — kirim form, lalu buka detailnya di dashboard dan pastikan gambar buktinya tampil. Centang tugas ini hanya setelah itu terbukti.

**Temuan:** 05 (Kritis, terverifikasi)
**Referensi:** `src/utils/supabase.js:8-14`, `src/pages/booking.js:124-133`, `src/pages/admin/booking.js:366`

Bukti pembayaran saat ini diunggah ke `bukti_transfer/` di bucket publik `images` lalu dibaca lewat `getPublicUrl()`.

**Langkah:**
1. Buat bucket baru `payments` dengan **Public = off**.
2. Beri policy storage: INSERT untuk `anon` (agar form booking tetap bisa mengunggah), SELECT hanya untuk `authenticated`.
3. Ubah path upload di `booking.js` dari bucket `images` ke `payments`.
4. Di `admin/booking.js`, ganti `getImageUrl(...)` untuk bukti transfer menjadi `supabase.storage.from('payments').createSignedUrl(path, 60)`.
5. Pindahkan file lama dari `images/bukti_transfer/` ke bucket baru, lalu hapus yang lama.

**Selesai bila:** URL publik file bukti transfer lama menjawab `400`/`404`, sementara admin yang login tetap bisa membuka buktinya dari dashboard.

---

### - [ ] T-03b · Cabut hak unggah publik dari bucket `images`

**Temuan:** baru, ditemukan 12 Nov 2026 saat mengerjakan T-03
**Referensi:** Storage → Policies → bucket `images`

Bucket `images` punya policy **`Public Uploads` · INSERT · `public`**, artinya siapa pun bisa mengunggah file apa pun ke storage proyek tanpa login — pintu penyalahgunaan, dan di paket Free kuota storage ikut terbakar.

Policy itu ada karena form booking perlu mengunggah bukti transfer tanpa login. Setelah T-03 jalan, bukti transfer pindah ke bucket `payments`, sehingga `images` hanya perlu menerima unggahan dari admin.

**Langkah** — jalankan **hanya setelah kode T-03 ter-deploy dan teruji**:

```sql
drop policy if exists "Public Uploads" on storage.objects;

create policy "Admin can upload images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'images');
```

**Selesai bila:** unggah gambar dari `/admin/blog/create` masih berhasil, sementara unggahan tanpa login ditolak. Policy `Public Access` (SELECT) tetap dipertahankan — gambar artikel harus bisa dibaca publik.

---

### - [ ] T-04 · Hapus kredensial hardcoded dan rotasi kunci

> **Progres 13 Nov 2026 — langkah 1 selesai.**
> `src/utils/supabase.js` tidak lagi menyimpan URL maupun anon key; keduanya kini wajib datang dari environment dan aplikasi gagal keras dengan pesan jelas bila kosong. Diuji dua arah: build dengan `.env.local` lolos, build tanpanya berhenti dengan pesan yang benar.
> **⚠️ Sebelum deploy berikutnya:** pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah terpasang di environment variables hosting. Tanpa itu build produksi akan **gagal** — disengaja, supaya tidak ada lagi fallback diam-diam.
> **Belum:** langkah 3, rotasi anon key (tunggu T-02 tuntas).

**Temuan:** 04 (Kritis, terverifikasi)
**Referensi:** `src/utils/supabase.js:3-4`

URL proyek dan anon key tertulis sebagai nilai fallback, dan repo `kadeksinduarta/mengening` berstatus publik.

**Langkah:**
1. Ganti kedua baris menjadi tanpa fallback, dan gagalkan keras bila env kosong:

```js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY wajib diisi');
}
```

2. Pastikan kedua env sudah terpasang di hosting (Vercel → Settings → Environment Variables), bukan hanya di `.env.local`.
3. Setelah T-01 dan T-02 selesai, rotasi anon key dari dashboard Supabase, lalu perbarui env di hosting.

**Catatan:** rotasi dilakukan **setelah** RLS beres, bukan sebelum — kunci baru dengan RLS lama sama bocornya.

**Selesai bila:** `grep -rn "supabase.co" src/` tidak menghasilkan apa pun, dan `npm run build` tetap lolos dengan env terpasang.

---

**✅ M0 tuntas bila:** anon key yang ada di browser tidak lagi bisa membaca satu baris pun dari `bookings`, dan bukti transfer tidak lagi punya URL publik.

---

## M1 — Kunci akses admin

**Tujuan:** sesi admin benar-benar berakhir saat logout, dan guard-nya bisa dipercaya.

### - [ ] T-05 · Perbaiki logout dan guard sesi

**Temuan:** 03 (Kritis, terverifikasi)
**Referensi:** `src/components/admin/AdminLayout.jsx:25-32`, `:37-41`, `src/pages/admin/login.js:23-28`, `:48-49`

Logout hanya menghapus `sessionStorage` dan tidak memanggil `supabase.auth.signOut()`, sehingga sesi Supabase tetap hidup di `localStorage`. Guard-nya pun hanya memeriksa keberadaan string token, tanpa verifikasi maupun cek kedaluwarsa.

**Langkah:**
1. Di `handleLogout`: `await supabase.auth.signOut()` sebelum redirect.
2. Ganti guard dari pembacaan `sessionStorage` menjadi `const { data: { session } } = await supabase.auth.getSession()`, lalu redirect ke `/admin/login` bila `session` kosong.
3. Pasang `supabase.auth.onAuthStateChange` agar admin ikut terlempar keluar saat token kedaluwarsa.
4. Hentikan penyimpanan token di `sessionStorage` pada `login.js:48-49` — supabase-js sudah mengelola sesinya sendiri. Nama admin ambil dari `session.user`.

**Selesai bila:** setelah klik logout, membuka `/admin` di tab yang sama langsung melempar ke halaman login, dan `localStorage` tidak lagi menyimpan sesi Supabase.

---

### - [ ] T-06 · Luruskan field login

**Temuan:** 19 (Tinggi, terverifikasi)
**Referensi:** `src/pages/admin/login.js:109-123`

Label berbunyi "Email / Username" dengan `type="text"`, padahal `signInWithPassword` hanya menerima email.

**Langkah:** ubah label menjadi "Email" dan `type` menjadi `email`.

**Selesai bila:** mengisi username tanpa `@` langsung ditolak browser dengan pesan yang jelas.

---

### - [ ] T-07 · Sambungkan atau sembunyikan kontrol mati di area admin

**Temuan:** 18 (Tinggi, terverifikasi) — bagian admin
**Referensi:** `src/pages/admin/login.js:130`, `src/components/admin/AdminSidebar.jsx:77-87`

**Langkah:**
- "Lupa Password?" → sambungkan ke `supabase.auth.resetPasswordForEmail(email)`, atau hapus tombolnya.
- "Settings" dengan `onClick={() => {}}` → hapus sampai halamannya benar-benar ada.

**Selesai bila:** tidak ada tombol di area admin yang bisa diklik tanpa menghasilkan apa pun.

---

**✅ M1 tuntas bila:** tidak ada jalan masuk ke dashboard tanpa sesi Supabase yang sah dan belum kedaluwarsa.

---

## M2 — Fondasi SEO

**Tujuan:** Google punya URL yang sah untuk diindeks, dan isi artikel benar-benar terbaca crawler.
**Kerjakan ketiganya sekaligus** — saling bergantung, dan memperbaiki salah satu saja tidak mengubah hasil di Search Console.

### - [ ] T-08 · Benahi domain canonical

**Temuan:** 07 (Tinggi, terverifikasi)
**Referensi:** `src/components/SEO.jsx:21`, `src/pages/sitemap.xml.js:3`, `public/robots.txt:6`

`puramengening.com` menjawab NXDOMAIN, padahal dipakai sebagai canonical, `og:url`, isi sitemap, dan baris `Sitemap:` di robots.

**Langkah:**
1. Tentukan domain yang sebenarnya dipakai — aktifkan `puramengening.com`, atau pakai domain hosting yang berjalan sekarang.
2. Set `NEXT_PUBLIC_SITE_URL` di env hosting ke domain itu.
3. Perbarui baris `Sitemap:` di `public/robots.txt` agar cocok.
4. Hapus fallback hardcoded di `SEO.jsx:21` dan `sitemap.xml.js:3` supaya hanya ada satu sumber kebenaran.

**Selesai bila:** `curl -I <domain>` menjawab `200`, dan `view-source` halaman mana pun menunjukkan `canonical` yang menunjuk ke domain yang sama.

---

### - [ ] T-09 · Perbaiki sitemap yang kehilangan semua artikel

**Temuan:** 06 (Tinggi, terverifikasi)
**Referensi:** `src/pages/sitemap.xml.js:42-50`

Query meminta kolom `updated_at` yang tidak ada di tabel `blogs`. Supabase menjawab `400 — column blogs.updated_at does not exist`, dan karena supabase-js mengembalikan error alih-alih melemparnya, `try/catch` tidak pernah aktif: sitemap hanya berisi 3 URL statis.

**Langkah:**
1. Ganti menjadi `.select('id, created_at')` — atau tambahkan kolom `updated_at` di tabel bila memang ingin dipakai.
2. Periksa `error` secara eksplisit, jangan mengandalkan `try/catch`:

```js
const { data, error } = await supabase.from('blogs').select('id, created_at');
if (error) console.error('Sitemap gagal memuat blogs:', error.message, error.code);
blogs = data || [];
```

**Selesai bila:** `curl <domain>/sitemap.xml` memuat satu `<url>` untuk setiap artikel yang ada di database.

---

### - [ ] T-10 · Render blog di server

**Temuan:** 08 (Tinggi, terverifikasi)
**Referensi:** `src/pages/blog/index.js:19-39`, `src/pages/blog/[id].js:17-57`

Kedua halaman ter-prerender statis sementara datanya diambil di `useEffect`. HTML yang diterima crawler dan pratinjau WhatsApp kosong — termasuk `title`, `description`, dan `og:image` artikel.

**Langkah:**
1. `/blog`: pindahkan `fetchBlogs` ke `getStaticProps` dengan `revalidate: 600`.
2. `/blog/[id]`: pakai `getStaticProps` + `getStaticPaths` (`fallback: 'blocking'`) agar artikel baru tetap bisa dibuka tanpa rebuild.
3. Pastikan komponen `SEO` menerima data artikel dari props, bukan dari state yang terisi belakangan.

**Selesai bila:** `curl <domain>/blog/<id> | grep -i "og:title"` menampilkan judul artikel yang benar, dan `curl <domain>/blog` sudah memuat judul-judul artikel di HTML mentahnya.

---

**✅ M2 tuntas bila:** sitemap berisi semua artikel, canonical menunjuk domain hidup, dan isi artikel terlihat di HTML tanpa menjalankan JavaScript. Setelah ini, daftarkan ulang sitemap di Google Search Console.

---

## M3 — Bug yang dilihat pengunjung

### - [ ] T-11 · Hilangkan "Invalid Date" dan rapikan kolom blog

**Temuan:** 09 (Tinggi, terverifikasi)
**Referensi:** `src/pages/blog/[id].js:182`, `:115`, `:119-125`, `src/pages/blog/index.js:133,135`

Tabel `blogs` hanya punya `id, title, content, image_url, image, created_at`. Tetapi kode membaca `published_date`, `author`, `excerpt`, dan `category`. Yang paling kentara: sidebar "Artikel Lainnya" memformat `item.published_date` tanpa fallback sehingga tercetak **"Invalid Date"**.

**Langkah:** pilih salah satu — tambahkan kolom-kolom itu di tabel beserta form-nya di admin, **atau** ganti semua pembacaannya ke `created_at` dengan fallback (`item.published_date || item.created_at`).

**Selesai bila:** tidak ada teks "Invalid Date" di halaman mana pun, dan setiap field yang ditampilkan punya kolom asli di database.

---

### - [ ] T-12 · Aktifkan styling isi artikel

**Temuan:** 10 (Tinggi, terverifikasi)
**Referensi:** `src/pages/blog/[id].js:142`, `src/styles/globals.css`

Kelas `prose prose-lg prose-slate` dipakai, tetapi `@tailwindcss/typography` tidak terpasang — semua kelas itu tidak menghasilkan CSS apa pun, sehingga heading dan daftar dari editor Quill tampil rata tanpa bentuk.

**Langkah:**
```bash
npm install -D @tailwindcss/typography
```
lalu daftarkan di `src/styles/globals.css` (sintaks Tailwind v4):
```css
@plugin "@tailwindcss/typography";
```

**Selesai bila:** artikel yang memuat `<h2>` dan `<ul>` tampil dengan hierarki dan jarak yang jelas.

---

### - [ ] T-13 · Benahi pemuatan font

**Temuan:** 11 (Tinggi, terverifikasi)
**Referensi:** `src/components/Navbar.jsx:32-35`, `src/styles/globals.css:59`, `:80-82`

`font-playfair` dipakai 16 kali tapi token `--font-playfair` tidak pernah didefinisikan, jadi di Tailwind v4 kelas itu tidak menghasilkan apa pun. Playfair pun hanya dimuat lewat `<link>` di dalam Navbar, sehingga tidak tersedia di halaman tanpa Navbar seperti `/booking`. `globals.css:59` juga masih menetapkan `font-family: Arial` pada `body`.

**Langkah:**
1. Muat Playfair Display dan Inter dengan `next/font` di `src/pages/_app.js`.
2. Daftarkan `--font-playfair` di blok `@theme` pada `globals.css`.
3. Hapus `<link>` Google Fonts dari `Navbar.jsx`, dan ganti `font-family: Arial` pada `body` dengan variabel font yang baru.

**Selesai bila:** judul di beranda **dan** di `/booking` sama-sama tampil dengan Playfair Display, dan ESLint tidak lagi melaporkan `no-page-custom-font`.

---

### - [ ] T-14 · Pastikan urutan artikel dan hentikan over-fetch

**Temuan:** 15 (Tinggi, terverifikasi)
**Referensi:** `src/pages/blog/index.js:26`, `src/pages/blog/[id].js:46`

Keduanya memakai `select('*')` tanpa `order`, jadi urutan artikel bisa berubah-ubah. Halaman detail juga mengunduh seluruh artikel lengkap dengan kolom `content` hanya untuk mengisi 5 item sidebar.

**Langkah:**
- Daftar: `.select('*').order('created_at', { ascending: false })`
- Sidebar: `.select('id, title, image_url, created_at').neq('id', id).order('created_at', { ascending: false }).limit(5)`
- Tambahkan paginasi bila artikel sudah lebih dari ~20.

**Selesai bila:** artikel terbaru selalu muncul paling atas, dan payload halaman detail tidak lagi memuat isi artikel lain.

---

### - [ ] T-15 · Satukan layout halaman publik

**Temuan:** 29 (Menengah, terverifikasi)
**Referensi:** `src/pages/booking.js`, `src/pages/blog/[id].js`, `src/pages/index.js:6,28`, `src/components/Booking.jsx`

`/booking` tidak punya Navbar maupun Footer — satu-satunya jalan keluar adalah tombol "Kembali ke Website". Halaman blog punya Navbar tapi tanpa Footer.

**Langkah:**
1. Buat `src/components/PublicLayout.jsx` berisi Navbar + konten + Footer + WhatsappButton.
2. Bungkus `/`, `/booking`, `/blog`, dan `/blog/[id]` dengan layout itu.
3. Hapus `src/components/Booking.jsx` yang sudah dikomentari di `pages/index.js:6,28`.

**Selesai bila:** keempat halaman publik punya header dan footer yang sama, dan tidak ada komponen mati yang tertinggal.

---

### - [ ] T-16 · Ganti navigasi internal ke `next/link`

**Temuan:** 24 (Menengah, terverifikasi) — bagian navigasi
**Referensi:** `src/components/home.jsx:51`, `src/components/Navbar.jsx:46,101,157`, `src/components/Booking.jsx:96`

Lima `<a href="/booking">` memicu reload penuh alih-alih navigasi klien — terasa lambat, dan state bahasa ikut ter-reset.

**Langkah:** ganti kelimanya ke `<Link href="...">` dari `next/link`. Tautan jangkar (`#about`, `#contact`) boleh tetap `<a>`.

**Selesai bila:** `npx eslint src` tidak lagi melaporkan `@next/next/no-html-link-for-pages`, dan klik "Book Now" berpindah tanpa halaman berkedip.

---

**✅ M3 tuntas bila:** tidak ada lagi teks rusak, font yang gagal muat, atau navigasi yang memuat ulang halaman.

---

## M4 — Alur booking & review yang bisa dipercaya

### - [ ] T-17 · Tolak tanggal yang sudah lewat

**Temuan:** 12 (Tinggi, terverifikasi)
**Referensi:** `src/pages/booking.js:375-381`, `:63-71`

Input tanggal tidak punya atribut `min`, dan `validateStep` hanya memeriksa field terisi.

**Langkah:**
```jsx
<Input type="date" name="tanggal" min={new Date().toISOString().split('T')[0]} ... />
```
dan tambahkan pemeriksaan yang sama di `validateStep(2)` — atribut `min` saja bisa dilewati.

**Selesai bila:** memilih tanggal kemarin menahan langkah berikutnya dengan pesan yang jelas.

---

### - [x] T-17b · Hilangkan jebakan pengisian jam dan pesan error yang tidak jelas

> **Selesai 12 Nov 2026** (dilaporkan user: pengunjung mengeluh form ditolak padahal terlihat sudah terisi).

**Temuan:** baru, dari keluhan pengguna nyata
**Referensi:** `src/pages/booking.js` — `TIME_SLOTS`, `getMissingFields()`, field `jam`

`<input type="time">` melaporkan nilai **kosong** selama bagian menitnya belum diisi. Pengunjung mengetik jamnya saja, melihat `10:--` di layar dan menganggap sudah terisi, lalu ditolak saat menekan "Lanjutkan". Pesannya pun generik — "Mohon lengkapi semua field yang wajib diisi" — tanpa menyebut field mana, sehingga pengunjung tidak tahu harus memperbaiki apa. Jebakan yang sama berlaku pada input tanggal yang baru terisi sebagian.

**Yang diubah:**
1. Input jam diganti pilihan slot 08:00–17:00 tiap 30 menit, sehingga nilai separuh terisi tidak mungkin terjadi.
2. Pesan error kini menyebut field yang kurang, mis. "Mohon lengkapi Jam Perkiraan, Alamat Asal."
3. Field yang kurang diberi border merah lewat `aria-invalid`, dan tandanya hilang begitu field itu disentuh.

**Perlu dikonfirmasi pemilik:** rentang 08:00–17:00 diambil dari jam operasional di `SEO.jsx:48-55`. Kalau slot melukat sebenarnya berakhir lebih awal, ubah panjang `TIME_SLOTS` di `booking.js:18`.

---

### - [ ] T-18 · Rapatkan alur transfer bank

**Temuan:** 13 (Tinggi, terverifikasi)
**Referensi:** `src/pages/booking.js:118-147`, `:449-466`

Saat metode "Transfer Bank" dipilih, `bukti_transfer` tetap opsional. Tidak ada batas ukuran atau pemeriksaan tipe file selain atribut `accept`. Jika insert gagal setelah file terunggah, file tertinggal sebagai sampah di storage.

**Langkah:**
1. Wajibkan bukti saat `payment_method === 'Transfer'`.
2. Tolak file di atas 5 MB dan tipe di luar `image/jpeg`, `image/png`, `image/webp`.
3. Bila insert gagal, hapus file yang sudah terunggah: `supabase.storage.from('payments').remove([filePath])`.

**Selesai bila:** submit dengan metode transfer tanpa bukti ditolak, file 10 MB ditolak, dan storage tidak menyisakan file saat insert gagal.

---

### - [ ] T-19 · Perbaiki penanganan error booking

**Temuan:** 14 (Tinggi, terverifikasi)
**Referensi:** `src/pages/booking.js:157`

`console.log('Error:', error.response?.data)` memakai bentuk error axios, padahal errornya dari supabase-js — nilainya selalu `undefined`, jadi penyebab asli kegagalan hilang.

**Langkah:** ganti menjadi `console.error('Booking gagal:', error.message, error.code)`, dan tampilkan pesan yang lebih berguna untuk kasus yang bisa dikenali (mis. gangguan jaringan vs gagal upload).

**Selesai bila:** mematikan koneksi lalu submit menghasilkan pesan error yang bisa dibaca di console maupun di layar.

---

### - [ ] T-20 · Tambahkan status booking

**Temuan:** 16 (Tinggi, terverifikasi)
**Referensi:** tabel `bookings`, `src/pages/admin/booking.js`

Tabel tidak punya kolom status dan dashboard hanya menyediakan hapus — satu-satunya cara membersihkan daftar adalah menghapus data pelanggan.

> **Catatan dari pemeriksaan policy 12 Nov 2026:** `bookings` sama sekali tidak punya policy DELETE, bahkan untuk `authenticated`. Jadi tombol hapus di `admin/booking.js:51-55` saat ini **gagal tanpa pesan apa pun** — PostgREST menjawab `204`, kode menganggapnya sukses dan menghapus baris dari tampilan, padahal datanya masih ada dan akan muncul lagi setelah refresh. Tugas ini sekalian menyelesaikan itu: ganti hapus dengan arsip berbasis status, dan tambahkan policy UPDATE untuk `authenticated`.

**Langkah:**
```sql
alter table public.bookings
  add column if not exists status text not null default 'pending'
  check (status in ('pending','confirmed','done','cancelled'));
```
Lalu tambahkan kontrol ubah status di dashboard, dan tampilkan sebagai badge berwarna di daftar maupun di kartu mobile.

**Selesai bila:** admin bisa menandai booking sebagai terkonfirmasi/selesai/batal tanpa menghapus datanya, dan daftar bisa difilter per status.

---

### - [ ] T-21 · Moderasi review sebelum tayang

**Temuan:** 17 (Tinggi, terverifikasi)
**Referensi:** `supabase/reviews_schema.sql:20-34`, `src/components/Review.jsx`, `src/pages/admin/review/index.js`

Review dari `anon` langsung tayang di beranda, tanpa kolom approval, batas panjang pesan, maupun rate limit.

**Langkah:**
```sql
alter table public.reviews
  add column if not exists approved boolean not null default false;

alter table public.reviews
  add constraint reviews_message_len check (char_length(message) between 10 and 1000);

drop policy if exists "Public can view reviews" on public.reviews;
create policy "Public can view approved reviews"
  on public.reviews for select to anon using (approved = true);
create policy "Admin can view all reviews"
  on public.reviews for select to authenticated using (true);
```
Lalu tambahkan tombol setujui/tolak di `/admin/review`, dan ubah pesan sukses di form agar berbunyi "menunggu moderasi", bukan langsung menyisipkan review ke daftar.

**Selesai bila:** review baru tidak muncul di beranda sampai admin menyetujuinya, dan pesan di bawah 10 karakter ditolak database.

---

**✅ M4 tuntas bila:** booking tidak bisa dibuat dengan data yang mustahil, dan tidak ada konten publik yang tayang tanpa persetujuan.

---

## M5 — Performa & aset

### - [ ] T-22 · Kompres dan optimalkan media beranda

**Temuan:** 20 (Menengah, terverifikasi)
**Referensi:** `public/`, `src/components/galery.jsx:50-55`, `src/components/home.jsx:11-19`

Enam gambar galeri yang dipakai berjumlah ±5,9 MB — `Gallery14.jpeg` sendiri 2,7 MB — ditambah video hero autoplay 2,1 MB dan `favicon.ico` 311 KB. `next/image` tidak dipakai sama sekali: ada 15 tag `<img>` mentah.

**Langkah:**
1. Resize gambar galeri ke lebar maksimum ~1600px, konversi ke WebP, target di bawah 200 KB per file.
2. Ganti semua `<img>` ke `next/image` dengan `width`/`height` atau `fill` + `sizes`.
3. Beri video atribut `poster` dan `preload="metadata"` agar tidak diunduh sebelum terlihat.
4. Buat ulang `favicon.ico` di bawah 20 KB.

**Selesai bila:** total transfer beranda di bawah ~1,5 MB (cek di DevTools → Network), dan LCP di Lighthouse mobile di bawah 2,5 detik.

---

### - [ ] T-23 · Bersihkan aset dan boilerplate tak terpakai

**Temuan:** 21 (Menengah, terverifikasi)
**Referensi:** `public/`, `src/pages/api/hello.js`, `README.md`

Sembilan file galeri (±5 MB) tidak pernah dirujuk kode. Ikut tertinggal `next.svg`, `vercel.svg`, `window.svg`, `file.svg`, `globe.svg`, `qris-example.png`, route contoh `api/hello.js` yang mengembalikan "John Doe", dan README bawaan create-next-app.

**Langkah:** hapus semuanya, lalu tulis ulang README berisi deskripsi proyek, daftar env yang dibutuhkan, dan cara menjalankan.

**Selesai bila:** setiap file di `public/` bisa ditelusuri ke satu rujukan di `src/`, dan README menjelaskan proyek ini.

---

### - [ ] T-24 · Pindahkan gambar artikel ke storage sendiri

**Temuan:** 22 (Menengah, terverifikasi)
**Referensi:** data tabel `blogs`, `src/pages/admin/blog/create.js:64-69`

Ketiga artikel memakai `image_url` yang menunjuk ke host luar — `soc-phoenix.s3-ap-southeast-1.amazonaws.com`, `encrypted-tbn1.gstatic.com` (thumbnail Google Images), dan `tourbali.id`. Hotlink seperti ini bisa mati kapan saja dan berisiko hak cipta. Kolom `image` juga berisi nilai sampah `image_agent_tag_…`.

**Langkah:**
1. Unduh, periksa lisensinya, lalu unggah ulang ke Supabase Storage — ganti yang tidak jelas haknya dengan foto sendiri.
2. Hapus salah satu dari dua kolom gambar; `create.js:64-69` sengaja menulis ke keduanya dan itu sumber kebingungan.
3. Samakan pembacaannya di `blog/index.js:30` dan `blog/[id].js:33`.

**Selesai bila:** semua `image_url` menunjuk ke domain Supabase milik sendiri, dan hanya ada satu kolom gambar.

---

**✅ M5 tuntas bila:** beranda terbuka cepat di koneksi seluler dan tidak ada aset yang bergantung pada server orang lain.

---

## M6 — Kode, i18n, dan kepatuhan

### - [ ] T-25 · Satukan konfigurasi kontak dan pembayaran

**Temuan:** 26 (Menengah, terverifikasi)
**Referensi:** `src/components/Contact.jsx:73`, `src/components/Footer.jsx:6-7`, `src/component/WhatsappButton.jsx:4-5`, `src/pages/booking.js:155`, `:456`

Nomor WhatsApp tersebar: `Contact.jsx` menulisnya langsung sementara tempat lain memakai env dengan fallback. Nomor rekening Bank Mandiri beserta nama pemiliknya juga hardcoded. `NEXT_PUBLIC_WHATSAPP_NUMBER` dan `NEXT_PUBLIC_SITE_URL` tidak ada di `.env.local`, jadi semuanya selalu memakai fallback — pola yang persis memicu bug nomor telepon di commit `4e2c4c4`.

**Langkah:** buat `src/config/site.js` berisi nomor WhatsApp, email, alamat, dan info rekening; impor dari sana di semua tempat. Lengkapi `.env.local` serta environment di hosting.

**Selesai bila:** mengubah nomor WhatsApp cukup di satu tempat, dan `grep -rn "6285857864840" src/` hanya menemukannya di file config.

---

### - [ ] T-26 · Verifikasi alamat email kontak

**Temuan:** 27 (Menengah, **belum terverifikasi**)
**Referensi:** `src/components/Contact.jsx:61`

Halaman kontak menampilkan `info@mengening.com` — domain yang berbeda dari `puramengening.com` yang dipakai di seluruh konfigurasi SEO.

**Langkah:** kirim email uji ke alamat itu. Bila belum aktif, ganti ke alamat yang benar-benar terpantau.

**Selesai bila:** email uji sampai ke kotak masuk yang memang dibaca.

---

### - [ ] T-27 · Gabungkan dua folder komponen

**Temuan:** 25 (Menengah, terverifikasi)
**Referensi:** `src/component/`, `src/components/`, `src/pages/blog/index.js:4,126-138`

`src/component/` (berisi `BlogCard` dan `WhatsappButton`) hidup bersebelahan dengan `src/components/`. `BlogCard` bahkan tidak terpakai: `blog/index.js` mengimpornya tapi menggambar kartunya sendiri secara inline.

**Langkah:** pindahkan kedua file ke `src/components/`, perbarui semua impor, lalu hapus `BlogCard` atau pakai kembali menggantikan kartu inline — pilih salah satu, jangan biarkan keduanya ada.

**Selesai bila:** folder `src/component/` sudah tidak ada dan `npm run build` tetap lolos.

---

### - [ ] T-28 · Tuntaskan sisa error ESLint dan jalankan lint di CI

**Temuan:** 24 (Menengah, terverifikasi) — sisanya setelah T-16
**Referensi:** keluaran `npx eslint src`

Tersisa 8 `react-hooks/immutability` (fungsi fetch dipanggil sebelum dideklarasikan), 3 `set-state-in-effect`, dan 8 `no-unescaped-entities`.

**Langkah:**
1. Pindahkan deklarasi fungsi fetch ke atas `useEffect` yang memanggilnya (`blog/index.js:20`, `blog/[id].js:20-21`, `admin/blog/index.js:19`, `admin/booking.js:34`, `admin/review/index.js:75`, `admin/index.js:23`, `admin/blog/edit/[id].js:37`).
2. Escape tanda kutip di `BlogCard.jsx:73`, `Booking.jsx:119`, `admin/booking.js:354`, `booking.js:559`.
3. Tambahkan langkah `npm run lint` di pipeline CI.

**Selesai bila:** `npx eslint src` melaporkan 0 error, dan CI menggagalkan PR yang memunculkannya lagi.

---

### - [ ] T-29 · Tuntaskan dukungan dua bahasa

**Temuan:** 23 (Menengah, terverifikasi)
**Referensi:** `src/pages/booking.js`, `src/pages/blog/*`, `src/components/Review.jsx:54-62`, `src/pages/_document.js:5`

`/booking`, `/blog`, dan `/blog/[id]` seluruhnya hardcoded bahasa Indonesia — tidak satu pun memakai `useTranslation`. Sebaliknya `timeAgo` selalu Inggris ("Today", "3 days ago") bahkan dalam mode ID. `_document.js` mematok `lang="id"` meski antarmuka beralih ke EN. Karena bahasa hanya disimpan di localStorage dan tidak punya URL sendiri, versi Inggris tidak bisa diindeks dan `hreflang` tidak mungkin dipasang — padahal pengunjung asing adalah target utama situs ini.

**Langkah:**
1. Terjemahkan halaman booking dan blog lewat `useTranslation`, tambahkan kuncinya ke `en.json` dan `id.json`.
2. Perbaiki `timeAgo` agar mengikuti bahasa aktif.
3. Set atribut `lang` secara dinamis dari `I18nContext`.
4. **Keputusan yang perlu diambil:** bila versi Inggris penting untuk pencarian, pindah ke i18n routing bawaan Next (`/en/…`) supaya tiap bahasa punya URL dan `hreflang` sendiri. Ini pekerjaan terbesar di dokumen ini — jadwalkan terpisah.

**Selesai bila:** mengganti bahasa mengubah seluruh teks di semua halaman publik, tanpa ada kalimat yang tertinggal.

---

### - [ ] T-30 · Lengkapi halaman wajib dan security header

**Temuan:** 28 (Menengah, terverifikasi) + 18 (bagian footer)
**Referensi:** `next.config.mjs`, `src/components/Footer.jsx:180-181`

Tidak ada `pages/404.js`, tidak ada header keamanan, dan tidak ada halaman kebijakan privasi — padahal situs mengumpulkan email, nomor telepon, dan alamat rumah. Tautan Privacy dan Terms di footer mengarah ke `href="#"`.

**Langkah:**
1. Buat `src/pages/404.js` bernuansa situs.
2. Tambahkan blok `headers()` di `next.config.mjs`:

```js
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ],
  }];
}
```

3. Tulis halaman kebijakan privasi singkat: data apa yang dikumpulkan, untuk apa, disimpan di mana, dan cara meminta penghapusan. Sambungkan tautan footer ke sana.

**Selesai bila:** tautan footer mengarah ke halaman nyata, URL ngawur menampilkan 404 yang rapi, dan header terlihat di `curl -I`.

---

### - [ ] T-31 · Audit ulang

Setelah M0–M6 tuntas, ulangi pemeriksaan dasar untuk memastikan tidak ada yang kembali terbuka.

**Langkah:**
```bash
npm run build                     # harus lolos
npx eslint src                    # harus 0 error
curl -I <domain>                  # 200 + security header
curl <domain>/sitemap.xml         # memuat semua artikel
# anon key tidak boleh bisa membaca bookings:
curl "$URL/rest/v1/bookings?select=*" -H "apikey: $ANON" -H "Authorization: Bearer $ANON"
```
Lalu jalankan Lighthouse mobile pada beranda dan satu halaman artikel.

**Selesai bila:** query `bookings` mengembalikan `[]`, lint bersih, dan skor Lighthouse Performance maupun SEO di atas 90.

---

**✅ M6 tuntas bila:** tidak ada utang teknis yang terdaftar di audit ini tersisa.

---

## Catatan

- **Temuan yang belum terverifikasi:** T-02 (hak tulis anon) dan T-26 (alamat email). Keduanya tidak bisa dipastikan dari luar dan butuh pemeriksaan langsung oleh pemilik akses.
- **Urutan tidak boleh dibalik:** M0 sebelum apa pun; T-08 sebelum T-09 dan T-10 karena keduanya memakai domain yang sama.
- **Perubahan database** (T-20, T-21, T-03) sebaiknya ditulis sebagai file SQL di folder `supabase/` agar tercatat, mengikuti pola `supabase/reviews_schema.sql` yang sudah ada.
