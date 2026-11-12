import '@/styles/globals.css';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Inter, Playfair_Display } from 'next/font/google';
import { I18nProvider } from '@/contexts/I18nContext';

// Dimuat di sini, bukan lewat <link> di dalam Navbar. Tag link itu tertanam di
// body dan tidak ikut terpasang di halaman tanpa Navbar seperti /booking, jadi
// Playfair tidak pernah tersedia di sana.
//
// Keduanya tanpa `weight` agar next/font memuat variable font-nya — situs ini
// memakai banyak ketebalan, dari font-light sampai font-black.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
});

export default function App({ Component, pageProps }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out',
    });
  }, []);

  return (
    <>
      {/* Ditaruh di :root, bukan sebagai pembungkus <div>, supaya tidak ada
          elemen tambahan yang mengubah tata letak halaman mana pun. */}
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-playfair-display: ${playfairDisplay.style.fontFamily};
        }
      `}</style>

      <I18nProvider>
        <Component {...pageProps} />
      </I18nProvider>
    </>
  );
}
