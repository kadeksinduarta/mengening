// Nomor lokal diubah ke format wa.me (kode negara tanpa tanda plus).
export const formatWhatsAppNumber = (phone) => {
    const digits = (phone || '').replace(/[^0-9]/g, '');
    if (digits.startsWith('0')) return `62${digits.slice(1)}`;
    if (digits.startsWith('62')) return digits;
    return `62${digits}`;
};

export const toISODate = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// Kolom tanggal berupa 'YYYY-MM-DD'. new Date('YYYY-MM-DD') dibaca sebagai UTC
// dan bisa mundur sehari, jadi bagiannya dirakit manual sebagai tanggal lokal.
export const parseTanggal = (value) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || '');
    if (!match) return value ? new Date(value) : null;
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};
