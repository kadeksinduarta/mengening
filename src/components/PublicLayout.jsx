import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsappButton from '@/component/WhatsappButton';

// Dipakai semua halaman publik supaya header, footer, dan tombol WhatsApp
// konsisten. Sebelumnya /booking tidak punya navigasi sama sekali dan halaman
// blog tidak punya footer.
//
// solidNav dipakai halaman berlatar terang: navbar default transparan dengan
// teks putih, yang tidak terbaca di atas latar muda.
export default function PublicLayout({ children, solidNav = false }) {
    return (
        <>
            <Navbar solid={solidNav} />
            {children}
            <WhatsappButton />
            <Footer />
        </>
    );
}
