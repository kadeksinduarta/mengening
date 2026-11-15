# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Wisatawan asing yang merencanakan perjalanan ke Bali dan mencari pengalaman spiritual yang autentik. Mereka biasanya datang lewat pencarian Google atau rekomendasi, sering membuka dari ponsel, dan umumnya belum paham adat Bali. Pekerjaan mereka: memahami apa itu melukat, memutuskan apakah layak dan aman diikuti, lalu memesan sesi dengan pemandu yang bisa dipercaya.

Audiens sekunder (terdeteksi dari kode, belum dikonfirmasi sebagai prioritas): wisatawan domestik, dilayani lewat versi Indonesia.

Pengguna panel admin (`/admin`, dikonfirmasi 14 Nov 2026): Tasya sendiri, sebagai pemilik sekaligus pemandu, dan membukanya dari ponsel, sering di sela jam layanan. Tugasnya: melihat booking baru dan jadwal sesi, memoderasi ulasan, menulis dan mengelola blog, serta sesekali melihat ringkasan angka. Antarmuka admin berbahasa Indonesia saja.

## Product Purpose

Situs pemesanan dan perkenalan untuk Tasya Melukat, jasa pemandu ritual melukat (penyucian diri dengan air suci) di Pura Mengening, Tampaksiring, Gianyar, Bali. Situs menjelaskan urutan ritual, syarat dan persiapan, menampilkan galeri, ulasan, FAQ, dan blog, lalu mengarahkan pengunjung untuk memesan. Berhasil bila pengunjung yang tepat memahami pengalamannya dan menyelesaikan booking.

## Positioning

Pemandu pribadi untuk grup kecil (maksimal 10 orang per sesi) yang mendampingi seluruh urutan ritual: membuat canang, meditasi, melukat di pancuran suci, dan sembahyang penutup. Bukan antrean massal di pancuran.

## Operating Context

- Booking: form di `/booking`, pembayaran transfer bank (Bank Mandiri), konfirmasi lewat WhatsApp. Tidak ada pembayaran online dan alur ini dipertahankan.
- Lokasi layanan: Pura Mengening, Tampaksiring; jam operasional 08:00–17:00.
- Pengelolaan: panel admin (`/admin`) untuk booking, blog, dan ulasan, dengan Supabase sebagai backend dan penyimpanan. Dashboard admin dipakai satu orang di ponsel, jadi harus bisa dipindai dan dioperasikan dengan satu tangan; label dan pesan admin dalam bahasa Indonesia (kode saat ini masih memakai label Inggris, belum diselaraskan).
- Konten dua bahasa (Indonesia dan Inggris) lewat sistem i18n yang ada di `src/locales/`.
- Identitas, kontak, dan pembayaran terpusat di `src/config/site.js`.

## Capabilities and Constraints

- Stack yang ada: Next.js (Pages Router), React 19, Tailwind CSS 4, komponen shadcn/Radix, Framer Motion, AOS, Supabase.
- Dwibahasa ID/EN. Setiap tampilan harus tetap rapi di kedua bahasa.
- Mobile-first: sebagian besar pengunjung diperkirakan memakai ponsel dengan koneksi bervariasi, jadi video hero dan galeri harus tetap ringan.
- Rencana perbaikan teknis berjalan di `RENCANA-PERBAIKAN.md` (keamanan, SEO, booking). Itu di luar lingkup PRODUCT.md.

## Brand Commitments

- Nama usaha: Tasya Melukat. Logo: `public/Logo_Tasya.png`.
- Hormat pada kesucian pura. Pura Mengening adalah tempat ibadah yang masih aktif, jadi nada dan visual tidak boleh terkesan komersial berlebihan atau merendahkan ritual.

## Evidence on Hand

- Foto galeri dan poster hero di `public/` (`Gallery*.webp`, `hero-poster.webp`), serta video hero `public/hero-video.mp4`.
- Salinan konten ritual, persyaratan tamu, dan FAQ di `src/locales/id.json` dan `en.json`.
- Ulasan dikelola lewat tabel Supabase dan moderasi admin. Isinya tidak diperiksa saat init.
- Belum terkonfirmasi: harga paket, jumlah tamu yang pernah dilayani, liputan media, sertifikasi pemandu. Jangan mengarang klaim ini.

## Product Principles

1. Kejelasan mendahului bujukan: wisatawan asing perlu paham apa itu melukat, apa yang terjadi, dan apa yang harus disiapkan sebelum diminta memesan.
2. Kesucian pura menentukan nada. Pengalaman dijual dengan tenang dan jujur, bukan dengan eksotisme atau tekanan.
3. Rasa percaya dibangun dari orang dan bukti nyata: Tasya sebagai pemandu, grup kecil, ulasan asli, kontak langsung lewat WhatsApp.
4. Ponsel adalah layar utama. Alur dari membaca sampai booking harus ringan dan selesai dengan satu tangan.
5. Dua bahasa setara. Versi Inggris bukan terjemahan sisa.

## Accessibility & Inclusion

Pengunjung berasal dari banyak negara dan sebagian bukan penutur asli bahasa Inggris atau Indonesia. Teks perlu sederhana dan mudah dipindai. Standar aksesibilitas formal belum ditetapkan.
