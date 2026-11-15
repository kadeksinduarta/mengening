---
name: Tasya Melukat
description: Situs pemesanan jasa pemandu melukat di Pura Mengening, terang dan ramah dengan slate lembut dan satu aksen biru.
colors:
  ink-night: "#0f172b"
  ink-deep: "#1d293d"
  body-slate: "#45556c"
  quiet-slate: "#62748e"
  muted-slate: "#90a1b9"
  canvas-white: "#ffffff"
  mist: "#f8fafc"
  hairline: "#f1f5f9"
  line: "#e2e8f0"
  trust-blue: "#155dfc"
  trust-blue-hover: "#1447e6"
  bright-blue: "#2b7fff"
  blue-tint: "#dbeafe"
  blue-wash: "#eff6ff"
  success-green: "#009966"
  success-wash: "#ecfdf5"
  danger-red: "#e7000b"
  danger-wash: "#fef2f2"
  star-amber: "#ffb900"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "4.5rem"
    fontWeight: 800
    lineHeight: 1
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Inter, Arial, Helvetica, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 300
    lineHeight: 1.625
  label:
    fontFamily: "Inter, Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    letterSpacing: "0.05em"
rounded:
  md: "8px"
  lg: "10px"
  xl: "14px"
  2xl: "18px"
  3xl: "22px"
  full: "9999px"
spacing:
  gutter: "24px"
  gutter-wide: "80px"
  section: "112px"
components:
  button-hero:
    backgroundColor: "{colors.canvas-white}"
    textColor: "{colors.ink-night}"
    rounded: "{rounded.full}"
    padding: "20px 40px"
  button-hero-hover:
    backgroundColor: "{colors.blue-wash}"
  button-cta:
    backgroundColor: "{colors.trust-blue}"
    textColor: "{colors.canvas-white}"
    rounded: "{rounded.xl}"
    padding: "16px 32px"
  button-cta-hover:
    backgroundColor: "{colors.trust-blue-hover}"
  card-review:
    backgroundColor: "{colors.canvas-white}"
    textColor: "{colors.body-slate}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  nav-solid:
    backgroundColor: "{colors.canvas-white}"
    textColor: "{colors.body-slate}"
---

# Design System: Tasya Melukat

> **Status: sistem lama, sebelum redesain.** Dokumen ini mencatat tampilan yang berjalan sekarang. Beranda akan diganti dunia visual baru (arah "Kertas Tempel Berlapis", lihat brief permukaan beranda), jadi jangan meniru sistem ini untuk pekerjaan baru di beranda. File ini ditulis ulang setelah redesain selesai. Sampai saat itu, halaman lain (booking, blog, 404, kebijakan privasi) masih memakainya.

## Overview

**Creative North Star: "The Calm Concierge"**

Terang, bersih, dan ramah. Sistem ini terasa seperti pemandu hotel yang menyapa tanpa menekan: latar putih dan slate lembut, satu aksen biru, kartu membulat besar, dan bayangan halus. Beranda dibuka dengan video penuh layar di bawah lapisan slate gelap, lalu berganti ke bagian-bagian putih yang bergantian dengan abu sangat muda.

Judul memakai serif Playfair Display yang tebal, sedangkan isi memakai Inter yang ringan. Komponen beranda memakai token semantik di `globals.css` (`ink`, `body`, `faint`, `rule`, `surface-alt`, `brand`, dan turunannya), yang nilainya sama dengan palet slate dan biru Tailwind. Halaman lain (booking, blog, 404, kebijakan privasi, admin) masih menulis warna slate dan biru langsung. Token tema shadcn (abu-abu tanpa rona) tidak dipakai oleh halaman publik.

Bahasa visual ini adalah bahasa template perjalanan yang umum. Tidak ada elemen yang khas Pura Mengening atau Bali.

**Key Characteristics:**
- Putih dan slate lembut dengan satu aksen biru; hijau, merah, dan kuning hanya untuk status dan bintang.
- Judul serif tebal di atas isi sans ringan.
- Sudut membulat besar dan kartu terangkat dengan bayangan lembut.
- Hero video penuh layar dengan lapisan gradasi slate dan tombol pil putih.
- Gerak masuk dengan Framer Motion dan AOS di hampir setiap bagian.

## Colors

Palet slate dingin dengan satu biru kepercayaan. Nilai di bawah adalah padanan hex dari utilitas Tailwind yang dipakai (slate, blue, emerald, red, amber).

### Primary
- **Trust Blue** (#155dfc, `blue-600`): aksen utama. Dipakai untuk tombol CTA, kicker huruf kapital, kata yang ditekankan di judul, dan fokus. Hover memakai **Trust Blue Hover** (#1447e6).
- **Bright Blue** (#2b7fff, `blue-500`): garis bawah tautan navbar saat hover dan titik aksen kecil.
- **Blue Tint** (#dbeafe) dan **Blue Wash** (#eff6ff): bingkai dekoratif, ikon kutipan, avatar, dan hover tombol hero.

### Secondary
- **Success Green** (#009966) dengan **Success Wash** (#ecfdf5): status berhasil dan konfirmasi.
- **Danger Red** (#e7000b) dengan **Danger Wash** (#fef2f2): galat dan status gagal.
- **Star Amber** (#ffb900): bintang penilaian.

### Neutral
- **Ink Night** (#0f172b, `slate-900`): judul dan teks utama pada latar terang; juga dasar lapisan hero.
- **Ink Deep** (#1d293d, `slate-800`): judul dan kutipan sekunder.
- **Body Slate** (#45556c, `slate-600`): paragraf isi.
- **Quiet Slate** (#62748e, `slate-500`): keterangan.
- **Muted Slate** (#90a1b9, `slate-400`): teks paling redup, ikon, dan label sekunder (pemakaian terbanyak di situs).
- **Canvas White** (#ffffff): latar bagian dan kartu.
- **Mist** (#f8fafc, `slate-50`): latar bagian selang-seling.
- **Hairline** (#f1f5f9, `slate-100`): garis pemisah dan batas kartu tipis.
- **Line** (#e2e8f0, `slate-200`): batas input dan pemisah yang lebih tegas.

### Named Rules
**The One Blue Rule.** Biru adalah satu-satunya aksen untuk tindakan dan penekanan. Hijau, merah, dan kuning hanya membawa status.

**The Slate Ladder Rule.** Hierarki teks dibangun dari tangga slate (900, 800, 600, 500, 400), bukan dari warna lain.

**The Semantic Token Rule.** Di komponen beranda, tangga slate dipanggil lewat token: `ink` (900), `ink-soft` (800), `body` (600), `subtle` (500), `faint` (400), `ghost` (300), `ghost-soft` (200), `ghost-faint` (100), `surface-alt` (50), serta `rule` dan `rule-strong` untuk garis dan `fill-strong` untuk isian. Biru dipanggil lewat `brand-deep`, `brand-strong`, `brand` (600), `brand-bright`, `brand-light`, `brand-mid`, `brand-soft`, `brand-tint`, dan `brand-wash`.

## Typography

**Display Font:** Playfair Display (dengan Georgia, serif), dimuat lewat `next/font` dan dipakai lewat kelas `font-playfair`.
**Body Font:** Inter (dengan Arial, Helvetica, sans-serif), dimuat lewat `next/font`.

**Character:** Serif tebal berkontras tinggi untuk judul dipasangkan dengan sans ringan untuk isi. Kesannya hangat dan editorial, tetapi pasangan ini sangat umum.

### Hierarchy
- **Display** (800, 4.5rem di md ke atas dan 3rem di bawahnya, line-height 1): judul hero (`h1`), putih dengan bayangan teks.
- **Headline** (700, 3rem di md ke atas dan 2.25rem di bawahnya, line-height 1.25): judul bagian seperti Tentang; kata kedua ditekankan dengan Trust Blue.
- **Body** (300, 1.125rem, line-height 1.625): paragraf bagian dengan warna Body Slate. Lebar baca mengikuti kolom setengah halaman.
- **Label** (600, 0.875rem, 0.05em, huruf kapital): kicker di atas judul bagian, dengan warna Trust Blue.
- **Navigasi** (500, 0.875rem): tautan navbar.

### Named Rules
**The Serif Headline Rule.** Judul bagian memakai Playfair; semua selain judul memakai Inter.

## Layout

Halaman publik adalah satu kolom panjang berisi bagian bertumpuk: hero, Tentang, Ritual, Persyaratan, FAQ, Galeri, Ulasan, Kontak. Setiap bagian memakai padding vertikal besar (112px, `py-28`) dan padding horizontal 24px di ponsel serta 80px di md ke atas. Wadah isi dibatasi `max-w-7xl` di navbar dan sekitar `max-w-5xl` di hero.

Tata letak dua kolom (foto dan teks) berbalik di ponsel: foto di bawah, teks di atas (`flex-col-reverse`). Titik putus yang dipakai `sm` (26 kali), `md` (68 kali, yang utama), dan `lg` (27 kali). Hero memakai tinggi layar penuh (`h-screen`).

Bagian selang-seling latar putih dan Mist; garis pemisah tipis memakai Hairline.

## Elevation & Depth

Sistem hibrida: kedalaman utamanya dari bayangan lembut, ditambah garis tipis dan lapisan buram. Kartu putih terangkat di atas latar Mist atau putih. Navbar yang menggulir berubah menjadi putih tembus pandang dengan blur. Bayangan yang paling sering: `shadow-sm` (38), `shadow-xl` dan `shadow-lg` (masing-masing 12), `shadow-md` (9), `shadow-2xl` (7).

### Shadow Vocabulary
- **Kartu diam** (`shadow-sm` dengan batas `border-slate-100`): kartu ulasan dan bidang biasa.
- **Kartu terangkat saat hover** (`shadow-md`): kartu ulasan saat disorot.
- **CTA berwarna** (`shadow-lg shadow-blue-500/30`, hover `shadow-xl shadow-blue-500/40`): tombol Trust Blue.
- **Foto utama** (`shadow-2xl`): foto besar di bagian Tentang.
- **Navbar** (`shadow-sm` dengan `backdrop-blur-xl`): saat menggulir.

### Named Rules
**The Soft Lift Rule.** Elemen interaktif naik dengan bayangan yang membesar saat hover, bukan dengan perubahan warna besar.

## Shapes

Bahasa bentuk: sudut membulat besar. Skala sudut tema sebesar 10px sebagai dasar (`--radius`), dengan `xl` 14px, `2xl` 18px, dan `3xl` 22px. Pemakaian terbanyak: `rounded-xl` (87), `rounded-lg` (52), `rounded-full` (36), `rounded-2xl` (22), `rounded-3xl` (7). Foto besar dan bingkai dekoratif memakai `3xl`; tombol hero dan penukar bahasa memakai pil penuh. Bingkai dekoratif berupa garis biru tipis yang digeser di belakang foto.

## Components

### Buttons
- **Hero Primary:** pil putih (`rounded-full`), teks Ink Night tebal 1.125rem, padding 20px 40px, panah yang bergeser saat hover, bayangan putih. Hover: latar Blue Wash dan membesar 5%.
- **Hero Secondary:** pil transparan dengan batas putih 40%, teks putih, blur latar. Hover: latar putih 20%.
- **CTA Primary:** Trust Blue, teks putih semibold, `rounded-xl`, padding 16px 32px, bayangan biru. Hover: Trust Blue Hover dan membesar 5% (Framer Motion).
- **Komponen `Button` (shadcn):** varian default, outline, secondary, ghost, destructive, link; tinggi 32px dengan `rounded-lg`. Dipakai terutama untuk penukar bahasa dan area admin.

### Cards / Containers
- **Kartu ulasan:** putih, batas `slate-100`, `rounded-2xl`, padding 24px, `shadow-sm` naik ke `shadow-md` saat hover, lebar 280px (320px di sm ke atas), tersusun dalam baris geser horizontal.
- **Kartu shadcn:** `rounded-xl` dengan cincin tipis `ring-1`.

### Inputs / Fields
- Komponen `Input` dan `Textarea` dari shadcn dengan batas `border-input`, fokus berupa cincin 3px.
- Galat memakai batas dan cincin Danger Red.

### Navigation
- Navbar tetap di atas. Transparan dengan teks putih di atas hero, lalu putih 80% dengan blur, bayangan tipis, dan batas bawah saat menggulir atau saat menu terbuka. Logo berubah dari putih (terbalik) menjadi warna asli.
- Tautan berukuran 0.875rem medium; hover mengubah warna menjadi biru dan garis bawah biru 2px tumbuh dari kiri.
- Penukar bahasa berupa tombol pil dengan ikon globe. Di ponsel, menu terbuka sebagai panel putih 95% dengan blur yang dianimasikan Framer Motion.

### Hero Video
Video penuh layar (`h-screen`, `object-cover`, diperbesar 5%) dengan poster, ditutup gradasi dari slate-900 60% ke 40% lalu 80%. Judul, subjudul, dan dua tombol tersusun di tengah. Penunjuk gulir kecil di bawah.

## Do's and Don'ts

### Do:
- **Do** memakai Trust Blue (#155dfc) untuk tindakan utama dan penekanan, dan hanya itu.
- **Do** menyusun hierarki teks dari tangga slate (900, 800, 600, 500, 400).
- **Do** memakai Playfair Display untuk judul bagian dan Inter untuk isi.
- **Do** memberi bagian padding vertikal 112px dan padding horizontal 24px (80px di md ke atas).
- **Do** menjaga kontras teks di atas video dengan lapisan gradasi slate.

### Don't:
- **Don't** menambah warna aksen baru di luar biru; hijau, merah, dan kuning khusus status dan bintang.
- **Don't** menulis `slate-*` atau `blue-*` langsung di komponen beranda; pakai token semantik (`text-ink`, `bg-brand`, `border-rule`, dan seterusnya). Token tema shadcn abu-abu tidak mewakili tampilan sebenarnya.
- **Don't** menaruh teks putih di atas latar terang. Navbar transparan hanya aman di atas hero gelap.
- **Don't** menambah gerak masuk baru di atas Framer Motion dan AOS yang sudah ada tanpa alasan.
