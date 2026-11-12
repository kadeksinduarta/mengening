// Satu-satunya sumber kebenaran untuk alamat situs.
//
// Sebelumnya nilai ini ditulis ulang di SEO.jsx, sitemap.xml.js, dan
// public/robots.txt — tiga tempat yang bisa saling bertentangan tanpa ketahuan.
// Canonical, og:url, sitemap, dan robots semuanya harus menunjuk ke host yang
// sama, kalau tidak Google tidak punya URL sah untuk diindeks.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

if (!SITE_URL) {
    throw new Error(
        'NEXT_PUBLIC_SITE_URL wajib diisi dengan alamat lengkap situs, mis. https://contoh.com. ' +
        'Set di .env.local untuk development, dan di environment variables hosting untuk produksi.'
    );
}
