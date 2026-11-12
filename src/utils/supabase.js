import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Sengaja gagal keras, bukan diam-diam memakai nilai cadangan. Kredensial yang
// ditulis di kode ikut terbawa ke repo dan tidak bisa dirotasi lewat environment.
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY wajib diisi. ' +
        'Set keduanya di .env.local untuk development, dan di environment variables hosting untuk produksi.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    // Assuming the bucket name is 'images' based on standard conventions
    const { data } = supabase.storage.from('images').getPublicUrl(imagePath);
    return data.publicUrl;
};

// Bukti transfer disimpan di bucket privat terpisah, bukan di 'images' yang publik.
export const PAYMENTS_BUCKET = 'payments';

// Bucket privat tidak punya URL publik, jadi aksesnya lewat signed URL berumur pendek
// yang hanya bisa dibuat oleh sesi admin yang sudah login.
export const getPaymentProofUrl = async (filePath, expiresInSeconds = 60) => {
    if (!filePath) return null;
    const { data, error } = await supabase.storage
        .from(PAYMENTS_BUCKET)
        .createSignedUrl(filePath, expiresInSeconds);

    if (error) {
        console.error('Gagal membuat signed URL bukti transfer:', error.message);
        return null;
    }
    return data.signedUrl;
};
