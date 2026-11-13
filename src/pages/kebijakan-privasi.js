import SEO from '@/components/SEO';
import PublicLayout from '@/components/PublicLayout';
import { ADDRESS_LINE, CONTACT_EMAIL, PHONE_E164, whatsappLink } from '@/config/site';
import { useTranslation } from '@/contexts/I18nContext';

// Isi halaman ini disusun dari data yang benar-benar dikumpulkan kode:
// kolom tabel bookings dan reviews, bucket payments, serta pihak ketiga yang
// memang dipakai (Supabase, Vercel, WhatsApp, Google Maps). Jangan tambahkan
// klaim yang tidak tercermin di kode.
const UPDATED = { id: '13 November 2026', en: '13 November 2026' };

// Kedua bahasa ditaruh berdampingan di sini, bukan dipecah ke locale JSON.
// Ini dokumen hukum: paragrafnya panjang, akan menenggelamkan kunci UI lain,
// dan pembaca perlu bisa membandingkan kedua versi secara langsung.
// Versi Indonesia yang berlaku bila ada perbedaan tafsir.
const COPY = {
  id: {
    eyebrow: 'Kebijakan Privasi',
    heading: 'Bagaimana kami memperlakukan data Anda',
    updatedLabel: 'Terakhir diperbarui',
    intro: 'Halaman ini menjelaskan data apa yang kami kumpulkan lewat situs Tasya Melukat, untuk apa data itu dipakai, siapa saja yang dapat mengaksesnya, dan bagaimana Anda meminta data Anda dihapus.',
    s1: 'Data yang kami kumpulkan',
    s1p1a: 'Saat Anda mengisi form booking,',
    s1p1b: ' kami menyimpan nama lengkap, alamat email, nomor WhatsApp, tanggal dan jam kunjungan, alamat asal, tipe kunjungan, metode pembayaran, catatan tambahan yang Anda tulis, dan — bila Anda memilih Transfer Bank — berkas bukti transfer yang Anda unggah.',
    s1p2a: 'Saat Anda mengirim ulasan,',
    s1p2b: ' kami menyimpan nama yang Anda isi, isi ulasan, dan penilaian bintang. Nama dan isi ulasan akan tampil di halaman publik setelah disetujui.',
    s1p3a: 'Di perangkat Anda,',
    s1p3b: ' situs ini menyimpan satu preferensi bahasa di penyimpanan lokal peramban. Kami tidak memasang cookie pelacak maupun layanan analitik pihak ketiga.',
    s2: 'Untuk apa data itu dipakai',
    s2p1: 'Hanya untuk memproses dan mengonfirmasi pemesanan Anda, menghubungi Anda terkait jadwal kunjungan, memverifikasi pembayaran bila Anda memilih transfer, dan menampilkan ulasan di situs bila Anda mengirimkannya.',
    s2p2: 'Kami tidak menjual, menyewakan, atau menukarkan data Anda kepada pihak mana pun, dan tidak mengirimkan email promosi.',
    s3: 'Siapa yang bisa mengakses',
    s3p1: 'Data booking hanya dapat dibaca oleh pengelola yang sudah masuk ke dasbor admin. Bukti transfer disimpan di penyimpanan privat dan hanya dapat dibuka lewat tautan sementara oleh pengelola yang sudah masuk.',
    s3p2: 'Beberapa layanan pihak ketiga ikut memproses data ini:',
    s3li1: ' — basis data dan penyimpanan berkas.',
    s3li2: ' — hosting situs.',
    s3li3: ' — setelah form terkirim, Anda diarahkan ke WhatsApp dengan ringkasan pemesanan yang sudah disiapkan. Percakapan itu tunduk pada kebijakan privasi WhatsApp.',
    s3li4: ' — peta lokasi di halaman kontak dimuat dari server Google, sehingga Google dapat menerima alamat IP Anda saat peta ditampilkan.',
    s4: 'Berapa lama disimpan',
    s4p1: 'Data pemesanan disimpan selama diperlukan untuk melayani kunjungan Anda dan menyimpan catatan transaksi. Bukti transfer dihapus setelah pembayaran terverifikasi dan kunjungan selesai. Ulasan disimpan selama masih ditampilkan di situs.',
    s4p2: 'Anda dapat meminta penghapusan lebih awal kapan saja lewat kontak di bawah.',
    s5: 'Hak Anda',
    s5p1: 'Sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi, Anda berhak meminta salinan data pribadi Anda yang kami simpan, meminta perbaikan bila ada yang keliru, meminta penghapusan, dan menarik persetujuan atas pemrosesan data Anda.',
    s5p2: 'Untuk menggunakan hak tersebut, hubungi kami lewat kontak di bawah dengan menyebutkan nama dan nomor WhatsApp yang Anda pakai saat memesan, agar kami dapat menemukan data Anda.',
    s6: 'Keamanan',
    s6p1: 'Data disimpan di basis data dengan aturan akses per baris, sehingga data pemesanan tidak dapat dibaca dari luar tanpa masuk sebagai pengelola. Bukti transfer berada di penyimpanan privat yang terpisah dari gambar publik situs.',
    s6p2: 'Tidak ada sistem yang sepenuhnya kebal. Bila terjadi kebocoran yang memengaruhi data Anda, kami akan memberi tahu Anda lewat kontak yang Anda berikan.',
    s7: 'Perubahan kebijakan',
    s7p1a: 'Bila kebijakan ini berubah, tanggal ',
    s7p1b: ' di atas akan ikut berubah. Perubahan berlaku sejak dimuat di halaman ini.',
    s8: 'Hubungi kami',
    s8p1: 'Pertanyaan atau permintaan terkait data pribadi Anda:',
    labelWa: 'WhatsApp', labelEmail: 'Email', labelLoc: 'Lokasi',
    authoritative: null,
  },
  en: {
    eyebrow: 'Privacy Policy',
    heading: 'How we handle your data',
    updatedLabel: 'Last updated',
    intro: 'This page explains what data we collect through the Tasya Melukat website, what it is used for, who can access it, and how you can ask for your data to be deleted.',
    s1: 'What we collect',
    s1p1a: 'When you fill in the booking form,',
    s1p1b: ' we store your full name, email address, WhatsApp number, visit date and time, where you are travelling from, visit type, payment method, any notes you write, and — if you choose Bank Transfer — the receipt file you upload.',
    s1p2a: 'When you submit a review,',
    s1p2b: ' we store the name you enter, the review text, and the star rating. Your name and review appear on the public site once approved.',
    s1p3a: 'On your device,',
    s1p3b: ' the site stores a single language preference in your browser. We use no tracking cookies and no third-party analytics.',
    s2: 'What it is used for',
    s2p1: 'Only to process and confirm your booking, contact you about your visit schedule, verify payment if you choose transfer, and display your review on the site if you submit one.',
    s2p2: 'We do not sell, rent, or trade your data with anyone, and we do not send marketing email.',
    s3: 'Who can access it',
    s3p1: 'Booking data can only be read by staff signed in to the admin dashboard. Transfer receipts are held in private storage and can only be opened through a short-lived link by signed-in staff.',
    s3p2: 'Several third-party services process this data:',
    s3li1: ' — database and file storage.',
    s3li2: ' — site hosting.',
    s3li3: ' — once the form is sent, you are taken to WhatsApp with a prepared summary of your booking. That conversation is governed by WhatsApp\u2019s own privacy policy.',
    s3li4: ' — the location map on the contact section loads from Google\u2019s servers, so Google may receive your IP address when the map is shown.',
    s4: 'How long we keep it',
    s4p1: 'Booking data is kept as long as needed to serve your visit and keep transaction records. Transfer receipts are deleted once payment is verified and the visit is complete. Reviews are kept while they remain published.',
    s4p2: 'You may ask for earlier deletion at any time using the contact details below.',
    s5: 'Your rights',
    s5p1: 'Under Indonesian Law No. 27 of 2022 on Personal Data Protection, you may request a copy of the personal data we hold about you, ask for corrections, request deletion, and withdraw your consent to processing.',
    s5p2: 'To exercise these rights, contact us below and include the name and WhatsApp number you used when booking, so we can locate your data.',
    s6: 'Security',
    s6p1: 'Data is held in a database with row-level access rules, so booking data cannot be read from outside without signing in as staff. Transfer receipts live in private storage, separate from the site\u2019s public images.',
    s6p2: 'No system is completely secure. If a breach affects your data, we will notify you using the contact details you provided.',
    s7: 'Changes to this policy',
    s7p1a: 'If this policy changes, the ',
    s7p1b: ' date above will change with it. Changes take effect when published on this page.',
    s8: 'Contact us',
    s8p1: 'Questions or requests about your personal data:',
    labelWa: 'WhatsApp', labelEmail: 'Email', labelLoc: 'Location',
    authoritative: 'The Indonesian version of this policy prevails in the event of any difference in interpretation.',
  },
};

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
    const { language } = useTranslation();
    const c = COPY[language] || COPY.id;

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
                            {c.eyebrow}
                        </p>
                        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-slate-900 leading-tight">
                            {c.heading}
                        </h1>
                        <p className="mt-4 text-slate-500 text-sm">
                            {c.updatedLabel}: {UPDATED[language] || UPDATED.id}
                        </p>

                        <p className="mt-8 text-slate-600 leading-relaxed">
                            {c.intro}
                        </p>

                        <Section title={c.s1}>
                            <p>
                                <strong className="text-slate-800">{c.s1p1a}</strong>{c.s1p1b}
                            </p>
                            <p>
                                <strong className="text-slate-800">{c.s1p2a}</strong>{c.s1p2b}
                            </p>
                            <p>
                                <strong className="text-slate-800">{c.s1p3a}</strong>{c.s1p3b}
                            </p>
                        </Section>

                        <Section title={c.s2}>
                            <p>
                                {c.s2p1}
                            </p>
                            <p>
                                {c.s2p2}
                            </p>
                        </Section>

                        <Section title={c.s3}>
                            <p>
                                {c.s3p1}
                            </p>
                            <p>{c.s3p2}</p>
                            <ul className="list-disc pl-5 space-y-1.5">
                                <li><strong className="text-slate-800">Supabase</strong>{c.s3li1}</li>
                                <li><strong className="text-slate-800">Vercel</strong>{c.s3li2}</li>
                                <li>
                                    <strong className="text-slate-800">WhatsApp (Meta)</strong>{c.s3li3}
                                </li>
                                <li>
                                    <strong className="text-slate-800">Google Maps</strong>{c.s3li4}
                                </li>
                            </ul>
                        </Section>

                        <Section title={c.s4}>
                            <p>
                                {c.s4p1}
                            </p>
                            <p>
                                {c.s4p2}
                            </p>
                        </Section>

                        <Section title={c.s5}>
                            <p>
                                {c.s5p1}
                            </p>
                            <p>
                                {c.s5p2}
                            </p>
                        </Section>

                        <Section title={c.s6}>
                            <p>
                                {c.s6p1}
                            </p>
                            <p>
                                {c.s6p2}
                            </p>
                        </Section>

                        <Section title={c.s7}>
                            <p>
                                {c.s7p1a}&ldquo;{c.updatedLabel}&rdquo;{c.s7p1b}
                            </p>
                        </Section>

                        <Section title={c.s8}>
                            <p>{c.s8p1}</p>
                            <ul className="list-none space-y-1.5">
                                <li>
                                    {c.labelWa}:{' '}
                                    <a
                                        href={whatsappLink()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        {PHONE_E164}
                                    </a>
                                </li>
                                <li>
                                    {c.labelEmail}:{' '}
                                    <a
                                        href={`mailto:${CONTACT_EMAIL}`}
                                        className="text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        {CONTACT_EMAIL}
                                    </a>
                                </li>
                                <li>{c.labelLoc}: {ADDRESS_LINE}</li>
                            </ul>
                        </Section>
                        {c.authoritative && (
                            <p className="mt-12 pt-6 border-t border-slate-100 text-sm text-slate-400 italic">
                                {c.authoritative}
                            </p>
                        )}
                    </article>
                </div>
            </PublicLayout>
        </>
    );
}
