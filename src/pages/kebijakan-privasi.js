import SEO from '@/components/SEO';
import PublicLayout from '@/components/PublicLayout';

// Isi halaman ini disusun dari data yang benar-benar dikumpulkan kode:
// kolom tabel bookings dan reviews, bucket payments, serta pihak ketiga yang
// memang dipakai (Supabase, Vercel, WhatsApp, Google Maps). Jangan tambahkan
// klaim yang tidak tercermin di kode.
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285857864840';
const EMAIL = 'info@mengening.com';
const UPDATED = '13 November 2026';

function Section({ title, children }) {
    return (
        <section className="mt-10">
            <h2 className="text-xl md:text-2xl font-playfair font-bold text-slate-900 mb-4">
                {title}
            </h2>
            <div className="space-y-3 text-slate-600 leading-relaxed">{children}</div>
        </section>
    );
}

export default function KebijakanPrivasi() {
    return (
        <>
            <SEO
                title="Kebijakan Privasi"
                description="Bagaimana Tasya Melukat mengumpulkan, menyimpan, dan menggunakan data pribadi pengunjung yang melakukan booking ritual Melukat di Pura Mengening."
            />

            <PublicLayout solidNav>
                <div className="min-h-screen bg-white pt-28 pb-20 px-6 font-sans">
                    <article className="max-w-3xl mx-auto">
                        <p className="text-blue-600 font-semibold tracking-wider text-sm uppercase mb-3">
                            Kebijakan Privasi
                        </p>
                        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-slate-900 leading-tight">
                            Bagaimana kami memperlakukan data Anda
                        </h1>
                        <p className="mt-4 text-slate-500 text-sm">
                            Terakhir diperbarui: {UPDATED}
                        </p>

                        <p className="mt-8 text-slate-600 leading-relaxed">
                            Halaman ini menjelaskan data apa yang kami kumpulkan lewat situs
                            Tasya Melukat, untuk apa data itu dipakai, siapa saja yang dapat
                            mengaksesnya, dan bagaimana Anda meminta data Anda dihapus.
                        </p>

                        <Section title="Data yang kami kumpulkan">
                            <p>
                                <strong className="text-slate-800">Saat Anda mengisi form booking,</strong> kami
                                menyimpan nama lengkap, alamat email, nomor WhatsApp, tanggal dan jam
                                kunjungan, alamat asal, tipe kunjungan, metode pembayaran, catatan
                                tambahan yang Anda tulis, dan — bila Anda memilih Transfer Bank —
                                berkas bukti transfer yang Anda unggah.
                            </p>
                            <p>
                                <strong className="text-slate-800">Saat Anda mengirim ulasan,</strong> kami
                                menyimpan nama yang Anda isi, isi ulasan, dan penilaian bintang. Nama
                                dan isi ulasan akan tampil di halaman publik setelah disetujui.
                            </p>
                            <p>
                                <strong className="text-slate-800">Di perangkat Anda,</strong> situs ini
                                menyimpan satu preferensi bahasa di penyimpanan lokal peramban.
                                Kami tidak memasang cookie pelacak maupun layanan analitik pihak ketiga.
                            </p>
                        </Section>

                        <Section title="Untuk apa data itu dipakai">
                            <p>
                                Hanya untuk memproses dan mengonfirmasi pemesanan Anda, menghubungi
                                Anda terkait jadwal kunjungan, memverifikasi pembayaran bila Anda
                                memilih transfer, dan menampilkan ulasan di situs bila Anda
                                mengirimkannya.
                            </p>
                            <p>
                                Kami tidak menjual, menyewakan, atau menukarkan data Anda kepada
                                pihak mana pun, dan tidak mengirimkan email promosi.
                            </p>
                        </Section>

                        <Section title="Siapa yang bisa mengakses">
                            <p>
                                Data booking hanya dapat dibaca oleh pengelola yang sudah masuk ke
                                dasbor admin. Bukti transfer disimpan di penyimpanan privat dan hanya
                                dapat dibuka lewat tautan sementara oleh pengelola yang sudah masuk.
                            </p>
                            <p>Beberapa layanan pihak ketiga ikut memproses data ini:</p>
                            <ul className="list-disc pl-5 space-y-1.5">
                                <li><strong className="text-slate-800">Supabase</strong> — basis data dan penyimpanan berkas.</li>
                                <li><strong className="text-slate-800">Vercel</strong> — hosting situs.</li>
                                <li>
                                    <strong className="text-slate-800">WhatsApp (Meta)</strong> — setelah
                                    form terkirim, Anda diarahkan ke WhatsApp dengan ringkasan pemesanan
                                    yang sudah disiapkan. Percakapan itu tunduk pada kebijakan privasi WhatsApp.
                                </li>
                                <li>
                                    <strong className="text-slate-800">Google Maps</strong> — peta lokasi di
                                    halaman kontak dimuat dari server Google, sehingga Google dapat menerima
                                    alamat IP Anda saat peta ditampilkan.
                                </li>
                            </ul>
                        </Section>

                        <Section title="Berapa lama disimpan">
                            <p>
                                Data pemesanan disimpan selama diperlukan untuk melayani kunjungan Anda
                                dan menyimpan catatan transaksi. Bukti transfer dihapus setelah
                                pembayaran terverifikasi dan kunjungan selesai. Ulasan disimpan selama
                                masih ditampilkan di situs.
                            </p>
                            <p>
                                Anda dapat meminta penghapusan lebih awal kapan saja lewat kontak di bawah.
                            </p>
                        </Section>

                        <Section title="Hak Anda">
                            <p>
                                Sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data
                                Pribadi, Anda berhak meminta salinan data pribadi Anda yang kami
                                simpan, meminta perbaikan bila ada yang keliru, meminta penghapusan,
                                dan menarik persetujuan atas pemrosesan data Anda.
                            </p>
                            <p>
                                Untuk menggunakan hak tersebut, hubungi kami lewat kontak di bawah
                                dengan menyebutkan nama dan nomor WhatsApp yang Anda pakai saat
                                memesan, agar kami dapat menemukan data Anda.
                            </p>
                        </Section>

                        <Section title="Keamanan">
                            <p>
                                Data disimpan di basis data dengan aturan akses per baris, sehingga
                                data pemesanan tidak dapat dibaca dari luar tanpa masuk sebagai
                                pengelola. Bukti transfer berada di penyimpanan privat yang terpisah
                                dari gambar publik situs.
                            </p>
                            <p>
                                Tidak ada sistem yang sepenuhnya kebal. Bila terjadi kebocoran yang
                                memengaruhi data Anda, kami akan memberi tahu Anda lewat kontak yang
                                Anda berikan.
                            </p>
                        </Section>

                        <Section title="Perubahan kebijakan">
                            <p>
                                Bila kebijakan ini berubah, tanggal &ldquo;terakhir diperbarui&rdquo; di
                                atas akan ikut berubah. Perubahan berlaku sejak dimuat di halaman ini.
                            </p>
                        </Section>

                        <Section title="Hubungi kami">
                            <p>Pertanyaan atau permintaan terkait data pribadi Anda:</p>
                            <ul className="list-none space-y-1.5">
                                <li>
                                    WhatsApp:{' '}
                                    <a
                                        href={`https://wa.me/${WHATSAPP}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        +{WHATSAPP}
                                    </a>
                                </li>
                                <li>
                                    Email:{' '}
                                    <a
                                        href={`mailto:${EMAIL}`}
                                        className="text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        {EMAIL}
                                    </a>
                                </li>
                                <li>Lokasi: Jalan Tirta No.25M, Sareseda, Tampaksiring, Gianyar, Bali 80552</li>
                            </ul>
                        </Section>
                    </article>
                </div>
            </PublicLayout>
        </>
    );
}
