// Satu-satunya sumber kebenaran untuk identitas, kontak, dan pembayaran.
//
// Sebelumnya nomor WhatsApp ditulis di tujuh tempat, alamat dan koordinat
// digandakan di dalam satu file SEO, dan nomor rekening tertanam di tengah
// JSX halaman booking. Pola itu yang memicu bug nomor telepon di commit
// 4e2c4c4: satu tempat diperbaiki, sisanya tertinggal.

// --- Alamat situs -----------------------------------------------------------
// Menentukan canonical, og:url, isi sitemap, dan robots.txt. Sengaja wajib:
// nilai cadangan yang diam-diam dipakai justru menyembunyikan salah konfigurasi.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

if (!SITE_URL) {
    throw new Error(
        'NEXT_PUBLIC_SITE_URL wajib diisi dengan alamat lengkap situs, mis. https://contoh.com. ' +
        'Set di .env.local untuk development, dan di environment variables hosting untuk produksi.'
    );
}

// --- Identitas --------------------------------------------------------------
export const BUSINESS_NAME = 'Tasya Melukat';
export const SITE_NAME = 'Tasya Melukat - Wisata Spiritual Pura Mengening Bali';

// --- Kontak -----------------------------------------------------------------
// Format nomor WhatsApp: kode negara tanpa tanda plus dan tanpa nol di depan.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285857864840';
export const PHONE_E164 = `+${WHATSAPP_NUMBER}`;
export const CONTACT_EMAIL = 'info@mengening.com';

export const ADDRESS = {
    street: 'Jalan Tirta No.25M, Sareseda',
    locality: 'Tampaksiring',
    region: 'Bali',
    postalCode: '80552',
    country: 'ID',
};

export const ADDRESS_LINE = `${ADDRESS.street}, ${ADDRESS.locality}, Gianyar, ${ADDRESS.region} ${ADDRESS.postalCode}`;

export const GEO = {
    latitude: -8.42002469161896,
    longitude: 115.309451875886,
};

export const OPENING_HOURS = { opens: '08:00', closes: '17:00' };

// --- Pembayaran -------------------------------------------------------------
export const BANK_TRANSFER = {
    bank: 'Bank Mandiri',
    accountNumber: '1450016415263',
    accountHolder: 'NI KOMANG TASYA APRI',
};

// --- Pembantu ---------------------------------------------------------------
export const whatsappLink = (message) =>
    message
        ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
        : `https://wa.me/${WHATSAPP_NUMBER}`;
