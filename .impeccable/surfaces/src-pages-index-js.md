---
version: 1
slug: "src-pages-index-js"
primary_target: "src/pages/index.js"
related_targets: []
---

---
version: 1
slug: "src-pages-index-js"
primary_target: "src/pages/index.js"
related_targets: []
---

---
version: 1
slug: "src-pages-index-js"
primary_target: "src/pages/index.js"
related_targets: []
---

# Surface brief: Beranda (src/pages/index.js)

Mode: Persuade. Pengunjung memutuskan lalu memesan lewat /booking atau WhatsApp.

## Audiens, tugas, bukti
- Wisatawan asing di ponsel, curiga pada atraksi turis. Dalam beberapa detik harus yakin ini ritual asli, dipandu langsung, grup kecil, di pura yang aktif dihormati.
- Tindakan: Pesan sesi (/booking) atau tanya lewat WhatsApp.
- Bukti nyata yang dipakai: foto dan video di public/ (Gallery*.webp, hero-poster.webp, hero-video.mp4), ulasan Supabase yang sudah disetujui, teks ritual/FAQ/persyaratan di locale.
- Tidak boleh dikarang: harga, jumlah tamu, sertifikasi, liputan. Foto Tasya belum ada di public/; slot disiapkan lewat GUIDE_PHOTO di config/site.js.

## Arah terpilih: Kertas Tempel Berlapis (challenger craft-making-lowicz-layered-papercut), diterjemahkan
- Bentuk: lapisan warna datar tak bercampur, ditempel satu per satu. Tanpa bayangan dan gradasi; kedalaman hanya dari tumpukan. Simetri cermin hanya pada objek (tidak ada bentuk putar atau lengan tertekuk).
- Terjemahan: palet dari dunia pura (air mata air, daun lumut, bata merah, kain kuning), bukan warna kerajinan Polandia. Bentuk dari hal nyata: anak tangga menurun ke mata air, lengkung, canang. Tanpa ayam jantan, bunga, atau klise Bali.
- Konsekuensi implementasi: lapisan dari div dan border-radius sederhana (tidak ada clip-path poligon), gerak "menempel" dengan CSS (transform+opacity), tampil penuh bila gerak berkurang atau tak didukung.

## Batas
- Tidak diubah: /booking, blog, admin, 404, kebijakan privasi, Navbar/Footer/PublicLayout lama, logika Supabase, teks ritual di locale.
- Anti-tujuan: terasa seperti suvenir/brosur resor, tekanan membeli, ikon dekoratif, kartu bersarang, tiga kolom fitur seragam, kicker di atas judul.

## Direction contract
THESIS: Beranda adalah satu objek kertas: lengkung bersarang di atas anak tangga menurun, dengan mata air nyata (video) di jendelanya. Menolak hero video gelap bertuliskan judul di tengah dengan deretan kartu seragam di bawahnya.
OWN-WORLD: Latar halaman putih bersih (permintaan pemilik, 13 Nov 2026) dengan teks tinta hijau-hitam; lembar tint pucat (kapur hijau, air, tanah liat) sebagai kertas tempel bidang besar; warna jenuh (bata, kapur, teal) hanya pada objek lengkung hero dan angka/aksen kecil; kuning kain hanya untuk jalur memesan (tombol), tidak untuk dekorasi; footer tinta gelap. Sudut tegas hasil gunting, hanya lengkung pada jendela. Judul Bricolage Grotesque tebal, isi Atkinson Hyperlegible. Tanpa bayangan, blur, atau gradasi.
STORY: Pengunjung paham apa itu melukat dan siapa yang memandu (hero), melihat empat langkah nyata berfoto, tahu apa yang perlu disiapkan, lalu memesan atau bertanya lewat WhatsApp tanpa tersesat. Ia percaya karena yang tampil nyata: tempat, foto, jam, batas grup, dan pemandu.
FIRST VIEWPORT: Desktop 1440x900: kiri (7 kolom) judul besar "Melukat di Pura Mengening, dipandu Tasya" + satu paragraf + tiga fakta teks + tombol kuning Pesan sesi + tautan WhatsApp; kanan (5 kolom) objek lengkung bersarang simetris berlapis bata, kapur, dan teal dengan video mata air di jendela, di atas empat anak tangga; semuanya di atas latar putih. Ponsel: judul, fakta, Pesan sesi, lalu objek; bilah bawah berisi Pesan dan WhatsApp baru muncul setelah tombol hero keluar layar.
FORM: Kertas Tempel Berlapis (challenger dealt, tidak ada di daftar grounded saya); seed:5d4fc0f80a53c9a6
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Keputusan terbuka
- Foto Tasya (GUIDE_PHOTO) belum ada; sampai diisi, bagian pemandu memakai foto pura yang ada tanpa klaim bahwa itu Tasya.
- Teks About p2 dan p3 (berbahasa New Age) tidak dipakai di beranda baru; tetap ada di locale.
