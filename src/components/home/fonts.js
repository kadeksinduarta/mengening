import { Bricolage_Grotesque, Atkinson_Hyperlegible_Next } from 'next/font/google';

// Hanya dimuat oleh beranda. Halaman lain tetap memakai Inter dan Playfair dari
// _app.js, jadi bundel font mereka tidak berubah.
//
// Judul: Bricolage Grotesque tebal, huruf-hurufnya terbaca seperti gunting
// kertas: lebar, padat, tanpa kontras goresan. Isi: Atkinson Hyperlegible Next,
// dirancang untuk keterbacaan; pengunjung utama bukan penutur asli bahasa Inggris
// atau Indonesia. Catatan: angka nol-nya bercoret (ciri keterbacaannya), dan itu
// tampil di jam buka dan nomor telepon. Belum dinilai pemilik situs.
export const displayFont = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--nf-paper-display',
  display: 'swap',
});

export const bodyFont = Atkinson_Hyperlegible_Next({
  subsets: ['latin'],
  variable: '--nf-paper-body',
  display: 'swap',
});
